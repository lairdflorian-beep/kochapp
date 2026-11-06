import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

const rezepte = [
  { _id: 'r1', name: 'Omas Apfelkuchen', autor: 'Oma', dauerMinuten: 75 },
  { _id: 'r2', name: 'Papas Gulasch', autor: 'Papa', dauerMinuten: 90 },
  { _id: 'r3', name: 'Kartoffelsuppe', autor: 'Mama', dauerMinuten: 40 },
  { _id: 'r4', name: 'Pfannkuchen', autor: 'Lena', dauerMinuten: 20 },
  { _id: 'r5', name: 'Gemüse-Lasagne', autor: 'Opa', dauerMinuten: 60 },
];

function antwort(status: number, daten: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(daten),
  } as Response);
}

let fetchMock: jest.Mock;

beforeEach(() => {
  fetchMock = jest.fn(() => antwort(200, rezepte));
  global.fetch = fetchMock;
});

function formularAusfuellen(name: string, autor: string, dauerMinuten: string) {
  const formular = screen.getByRole('form', { name: 'Neues Rezept' });
  fireEvent.change(within(formular).getByLabelText('Name'), { target: { value: name } });
  fireEvent.change(within(formular).getByLabelText('Autor'), { target: { value: autor } });
  fireEvent.change(within(formular).getByLabelText('Dauer in Minuten'), {
    target: { value: dauerMinuten },
  });
  return formular;
}

test('renders the cookbook heading and recipe search', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Familienkochbuch', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Rezept suchen' })).toBeInTheDocument();
  await screen.findByRole('list', { name: 'Rezepte' });
});

test('loads all five recipes from the web api', async () => {
  render(<App />);

  expect(screen.getByText('Rezepte werden geladen …')).toBeInTheDocument();

  const recipeList = await screen.findByRole('list', { name: 'Rezepte' });
  expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/rezepte');
  expect(screen.queryByText('Rezepte werden geladen …')).not.toBeInTheDocument();
  expect(within(recipeList).getAllByRole('listitem')).toHaveLength(5);
  expect(within(recipeList).getAllByRole('button')).toHaveLength(5);

  const recipes = [
    { name: /Omas Apfelkuchen/, info: 'von Oma · 75 Min.' },
    { name: /Papas Gulasch/, info: 'von Papa · 90 Min.' },
    { name: /Kartoffelsuppe/, info: 'von Mama · 40 Min.' },
    { name: /Pfannkuchen/, info: 'von Lena · 20 Min.' },
    { name: /Gemüse-Lasagne/, info: 'von Opa · 60 Min.' },
  ];

  recipes.forEach(({ name, info }) => {
    const recipeCard = within(recipeList).getByRole('button', { name });
    expect(recipeCard).toHaveAttribute('type', 'button');
    expect(within(recipeCard).getByText(info)).toBeInTheDocument();
  });
});

test('shows an error when the server is not reachable', async () => {
  fetchMock.mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));
  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Die Rezepte konnten nicht geladen werden.');
  expect(screen.queryByRole('list', { name: 'Rezepte' })).not.toBeInTheDocument();
});

test('loads the recipes as soon as the server becomes reachable', async () => {
  fetchMock
    .mockImplementationOnce(() => Promise.reject(new TypeError('Failed to fetch')))
    .mockImplementation(() => antwort(200, rezepte));
  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Neuer Versuch in 3 Sekunden');

  const recipeList = await screen.findByRole('list', { name: 'Rezepte' }, { timeout: 5000 });
  expect(within(recipeList).getAllByRole('listitem')).toHaveLength(5);
  expect(screen.queryByText(/Die Rezepte konnten nicht geladen werden/)).not.toBeInTheDocument();
});

test('shows an error when the server responds with an error status', async () => {
  fetchMock.mockImplementation(() => antwort(500, { error: 'Interner Serverfehler' }));
  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Die Rezepte konnten nicht geladen werden.');
});

test('creates a recipe via POST and adds the saved recipe to the list', async () => {
  render(<App />);
  await screen.findByRole('list', { name: 'Rezepte' });

  const gespeichert = { _id: 'r6', name: 'Linsencurry', autor: 'Lena', dauerMinuten: 35 };
  fetchMock.mockImplementation(() => antwort(201, gespeichert));

  const formular = formularAusfuellen('Linsencurry', 'Lena', '35');
  fireEvent.submit(formular);

  const recipeList = screen.getByRole('list', { name: 'Rezepte' });
  expect(await within(recipeList).findByRole('button', { name: /Linsencurry/ })).toBeInTheDocument();
  expect(within(recipeList).getAllByRole('listitem')).toHaveLength(6);
  expect(fetchMock).toHaveBeenLastCalledWith('http://localhost:3001/rezepte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Linsencurry', autor: 'Lena', dauerMinuten: 35 }),
  });
  expect(within(formular).getByLabelText('Name')).toHaveValue('');
});

test('shows the error message of the server and keeps the input', async () => {
  render(<App />);
  await screen.findByRole('list', { name: 'Rezepte' });

  fetchMock.mockImplementation(() =>
    antwort(400, { error: 'dauerMinuten muss eine Zahl größer als 0 sein' })
  );

  const formular = formularAusfuellen('Linsencurry', 'Lena', '0');
  fireEvent.submit(formular);

  expect(await within(formular).findByRole('alert')).toHaveTextContent(
    'dauerMinuten muss eine Zahl größer als 0 sein'
  );
  expect(within(formular).getByLabelText('Name')).toHaveValue('Linsencurry');
  expect(within(screen.getByRole('list', { name: 'Rezepte' })).getAllByRole('listitem')).toHaveLength(5);
});

test('requests the recipe list only once in StrictMode', async () => {
  render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  await screen.findByRole('list', { name: 'Rezepte' });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('shows the filled detail view of a recipe and returns to the list', async () => {
  render(<App />);
  const recipeList = await screen.findByRole('list', { name: 'Rezepte' });

  fetchMock.mockImplementation(() => antwort(200, rezepte[1]));
  fireEvent.click(within(recipeList).getByRole('button', { name: /Papas Gulasch/ }));

  expect(await screen.findByRole('heading', { name: 'Papas Gulasch', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('von Papa · 90 Min.')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenLastCalledWith('http://localhost:3001/rezepte/r2');
  expect(screen.queryByRole('list', { name: 'Rezepte' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Zurück/ }));

  expect(screen.getByRole('list', { name: 'Rezepte' })).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test('shows an error in the detail view when the recipe cannot be loaded', async () => {
  render(<App />);
  const recipeList = await screen.findByRole('list', { name: 'Rezepte' });

  fetchMock.mockImplementation(() => antwort(404, { error: 'Rezept nicht gefunden' }));
  fireEvent.click(within(recipeList).getByRole('button', { name: /Kartoffelsuppe/ }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Das Rezept konnte nicht geladen werden.');
});

test('searches the loaded recipes without further requests', async () => {
  render(<App />);
  await screen.findByRole('list', { name: 'Rezepte' });

  fireEvent.click(screen.getByRole('button', { name: 'Rezept suchen' }));

  const suchfeld = screen.getByRole('searchbox', { name: 'Suchbegriff' });
  expect(suchfeld).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Alle 5 Rezepte');

  fireEvent.change(suchfeld, { target: { value: 'gemuese' } });
  expect(screen.getByRole('status')).toHaveTextContent('1 Treffer für „gemuese“');
  const recipeList = screen.getByRole('list', { name: 'Rezepte' });
  expect(within(recipeList).getByRole('button', { name: /Gemüse-Lasagne/ })).toBeInTheDocument();

  fireEvent.change(suchfeld, { target: { value: 'Pizza' } });
  expect(screen.getByRole('status')).toHaveTextContent('0 Treffer für „Pizza“');
  expect(screen.getByText(/Keine passenden Rezepte gefunden/)).toBeInTheDocument();

  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('returns from a search result to the search with the term kept', async () => {
  render(<App />);
  await screen.findByRole('list', { name: 'Rezepte' });

  fireEvent.click(screen.getByRole('button', { name: 'Rezept suchen' }));
  fireEvent.change(screen.getByRole('searchbox', { name: 'Suchbegriff' }), { target: { value: 'papa' } });

  fetchMock.mockImplementation(() => antwort(200, rezepte[1]));
  fireEvent.click(screen.getByRole('button', { name: /Papas Gulasch/ }));
  expect(await screen.findByRole('heading', { name: 'Papas Gulasch', level: 1 })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Zurück/ }));
  expect(screen.getByRole('searchbox', { name: 'Suchbegriff' })).toHaveValue('papa');

  fireEvent.click(screen.getByRole('button', { name: /Zurück/ }));
  expect(screen.getByRole('heading', { name: 'Familienkochbuch', level: 1 })).toBeInTheDocument();
  expect(within(screen.getByRole('list', { name: 'Rezepte' })).getAllByRole('listitem')).toHaveLength(5);
});

test('shows a helpful message when the server is not reachable while saving', async () => {
  render(<App />);
  await screen.findByRole('list', { name: 'Rezepte' });

  fetchMock.mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));

  const formular = formularAusfuellen('Linsencurry', 'Lena', '35');
  fireEvent.submit(formular);

  const meldung = await within(formular).findByRole('alert');
  expect(meldung).toHaveTextContent(
    'Das Rezept konnte nicht gespeichert werden. Bitte überprüfe deine Internetverbindung und speichere es erneut.'
  );
  expect(meldung).not.toHaveTextContent('Failed to fetch');
  expect(within(formular).getByLabelText('Name')).toHaveValue('Linsencurry');
});
