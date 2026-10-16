import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

function oeffneApfelkuchen() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Omas Apfelkuchen/ }));
}

function oeffneApfelkuchenFormular() {
  oeffneApfelkuchen();
  fireEvent.click(screen.getByRole('button', { name: 'Bearbeiten' }));
}

test('renders the cookbook heading and recipe search', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Familienkochbuch', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Rezept suchen' })).toBeInTheDocument();
});

test('renders all five recipes with their authors and preparation times', () => {
  render(<App />);

  const recipeList = screen.getByRole('list', { name: 'Rezepte' });
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

test('opens the apple cake in read mode with the ingredients and preparation from the PDF', () => {
  oeffneApfelkuchen();

  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen');
  expect(screen.getByRole('heading', { name: 'Omas Apfelkuchen', level: 1 })).toHaveFocus();
  expect(screen.getByText('von Oma · 75 Min.')).toBeInTheDocument();
  const zutaten = within(screen.getByRole('region', { name: 'Zutaten' })).getAllByRole('listitem');
  expect(zutaten.map((item) => item.textContent)).toEqual([
    '6 Äpfel', '250 g Mehl', '125 g Zucker', '125 g Butter', '2 Eier',
  ]);
  const schritte = within(screen.getByRole('region', { name: 'Zubereitung' })).getAllByRole('listitem');
  expect(schritte.map((item) => item.textContent)).toEqual([
    'Äpfel schälen und schneiden.',
    'Teig kneten und in die Form geben.',
    'Mit Äpfeln belegen und 45 Min. backen.',
  ]);
  expect(within(screen.getByRole('region', { name: 'Zubereitung' })).getByRole('list').tagName).toBe('OL');
  expect(screen.getByRole('button', { name: 'Bearbeiten' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Löschen' })).toBeDisabled();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Speichern' })).not.toBeInTheDocument();
});

test('opens the prefilled apple cake form only after choosing edit', () => {
  oeffneApfelkuchenFormular();

  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen/bearbeiten');
  expect(screen.getByRole('heading', { name: 'Rezept bearbeiten' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Omas Apfelkuchen');
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  expect(screen.getByRole('textbox', { name: 'Autor' })).toHaveValue('Oma');
  expect(screen.getByRole('spinbutton', { name: 'Dauer (Minuten)' })).toHaveValue(75);
  expect(screen.getByLabelText('Zutaten (eine pro Zeile)')).toHaveValue(
    '6 Äpfel\n250 g Mehl\n125 g Zucker\n125 g Butter\n2 Eier'
  );
  expect(screen.getByLabelText('Zubereitung (ein Schritt pro Zeile)')).toHaveValue(
    'Äpfel schälen und schneiden.\nTeig kneten und in die Form geben.\nMit Äpfeln belegen und 45 Min. backen.'
  );
  expect(screen.queryByRole('button', { name: 'Bearbeiten' })).not.toBeInTheDocument();
});

test.each([
  { name: 'Papas Gulasch', autor: 'Papa', dauer: 90, id: 'papas-gulasch' },
  { name: 'Kartoffelsuppe', autor: 'Mama', dauer: 40, id: 'kartoffelsuppe' },
  { name: 'Pfannkuchen', autor: 'Lena', dauer: 20, id: 'pfannkuchen' },
  { name: 'Gemüse-Lasagne', autor: 'Opa', dauer: 60, id: 'gemuese-lasagne' },
])('opens $name in read mode before allowing editing', ({ name, autor, dauer, id }) => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: `${name} von ${autor} · ${dauer} Min.` }));

  expect(window.location.hash).toBe(`#/rezepte/${id}`);
  expect(screen.getByRole('heading', { name, level: 1 })).toBeInTheDocument();
  expect(screen.getByText(`von ${autor} · ${dauer} Min.`)).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Löschen' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Bearbeiten' }));

  expect(screen.getByRole('heading', { name: 'Rezept bearbeiten' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(name);
  expect(screen.getByRole('textbox', { name: 'Autor' })).toHaveValue(autor);
  expect(screen.getByRole('spinbutton', { name: 'Dauer (Minuten)' })).toHaveValue(dauer);
  expect(window.location.hash).toBe(`#/rezepte/${id}/bearbeiten`);
  expect(screen.getByLabelText('Zutaten (eine pro Zeile)')).toHaveValue('');
  expect(screen.getByLabelText('Zubereitung (ein Schritt pro Zeile)')).toHaveValue('');
});

test('returns from the form to the recipe list without saving', () => {
  oeffneApfelkuchenFormular();
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Nicht gespeichert' } });
  fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));

  expect(screen.getByRole('heading', { name: 'Familienkochbuch' })).toBeInTheDocument();
  expect(within(screen.getByRole('list', { name: 'Rezepte' })).getAllByRole('listitem')).toHaveLength(5);
  expect(screen.getByRole('button', { name: /Omas Apfelkuchen/ })).toBeInTheDocument();
  expect(window.location.hash).toBe('');
});

test('supports direct links and browser hash navigation', () => {
  window.history.replaceState(null, '', '/#/rezepte/omas-apfelkuchen');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Omas Apfelkuchen' })).toBeInTheDocument();

  act(() => {
    window.history.replaceState(null, '', '/');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { name: 'Familienkochbuch' })).toBeInTheDocument();

  act(() => {
    window.history.replaceState(null, '', '/#/rezepte/pfannkuchen');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { name: 'Pfannkuchen' })).toBeInTheDocument();
});

test('supports form direct links and resets fields when navigating to another recipe', () => {
  window.history.replaceState(null, '', '/#/rezepte/omas-apfelkuchen/bearbeiten');
  render(<App />);
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Omas Apfelkuchen');
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Entwurf' } });

  act(() => {
    window.history.replaceState(null, '', '/#/rezepte/pfannkuchen/bearbeiten');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Pfannkuchen');
  expect(screen.getByRole('textbox', { name: 'Autor' })).toHaveValue('Lena');
  expect(screen.getByRole('spinbutton', { name: 'Dauer (Minuten)' })).toHaveValue(20);
  expect(screen.getByLabelText('Zutaten (eine pro Zeile)')).toHaveValue('');

  act(() => {
    window.history.replaceState(null, '', '/#/rezepte/pfannkuchen');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('heading', { name: 'Pfannkuchen' })).toBeInTheDocument();

  act(() => {
    window.history.replaceState(null, '', '/#/rezepte/pfannkuchen/bearbeiten');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Pfannkuchen');
});

test('supports browser back and forward between the list, read mode and the form', async () => {
  oeffneApfelkuchenFormular();

  act(() => { window.history.back(); });
  expect(await screen.findByRole('heading', { name: 'Omas Apfelkuchen' })).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

  act(() => { window.history.back(); });
  expect(await screen.findByRole('heading', { name: 'Familienkochbuch' })).toBeInTheDocument();

  act(() => { window.history.forward(); });
  expect(await screen.findByRole('heading', { name: 'Omas Apfelkuchen' })).toBeInTheDocument();

  act(() => { window.history.forward(); });
  expect(await screen.findByRole('heading', { name: 'Rezept bearbeiten' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Omas Apfelkuchen');
});

test.each(['', '/bearbeiten'])('handles an unknown recipe at route %s and allows returning to the list', (suffix) => {
  window.history.replaceState(null, '', `/#/rezepte/unbekannt${suffix}`);
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Rezept nicht gefunden' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Zurück/ }));
  expect(screen.getByRole('list', { name: 'Rezepte' })).toBeInTheDocument();
});

test('saves edited fields to both the detail page and the recipe card', () => {
  oeffneApfelkuchenFormular();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: ' Neuer Kuchen ' } });
  fireEvent.change(screen.getByRole('textbox', { name: 'Autor' }), { target: { value: ' Alex ' } });
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Dauer (Minuten)' }), { target: { value: '50' } });
  fireEvent.change(screen.getByLabelText('Zutaten (eine pro Zeile)'), { target: { value: ' 3 Äpfel\n\n 100 g Mehl ' } });
  fireEvent.change(screen.getByLabelText('Zubereitung (ein Schritt pro Zeile)'), { target: { value: ' Mischen.\n Backen. ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen');
  expect(screen.getByRole('heading', { name: 'Neuer Kuchen' })).toBeInTheDocument();
  expect(screen.getByText('von Alex · 50 Min.')).toBeInTheDocument();
  expect(within(screen.getByRole('region', { name: 'Zutaten' })).getAllByRole('listitem').map((item) => item.textContent))
    .toEqual(['3 Äpfel', '100 g Mehl']);
  expect(within(screen.getByRole('region', { name: 'Zubereitung' })).getAllByRole('listitem').map((item) => item.textContent))
    .toEqual(['Mischen.', 'Backen.']);

  fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));
  fireEvent.click(screen.getByRole('button', { name: 'Neuer Kuchen von Alex · 50 Min.' }));
  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen');
  expect(screen.getByRole('heading', { name: 'Neuer Kuchen' })).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bearbeiten' }));
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Neuer Kuchen');
  expect(screen.getByLabelText('Zutaten (eine pro Zeile)')).toHaveValue('3 Äpfel\n100 g Mehl');
  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen/bearbeiten');
});

test('discards edits when cancelled', () => {
  oeffneApfelkuchenFormular();
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Verworfen' } });
  fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }));

  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen');
  expect(screen.getByRole('heading', { name: 'Omas Apfelkuchen' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Bearbeiten' }));
  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen/bearbeiten');
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Omas Apfelkuchen');
});

test('rejects a recipe name containing only whitespace', () => {
  oeffneApfelkuchenFormular();
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Bitte Name, Autor und eine gültige Dauer');
  expect(screen.getByRole('heading', { name: 'Rezept bearbeiten' })).toBeInTheDocument();
});

test('shows a disabled delete button without confirmation, navigation or data changes', () => {
  const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  oeffneApfelkuchen();
  const loeschen = screen.getByRole('button', { name: 'Löschen' });
  expect(loeschen).toBeDisabled();
  fireEvent.click(loeschen);

  expect(confirmSpy).not.toHaveBeenCalled();
  expect(alertSpy).not.toHaveBeenCalled();
  expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen');
  expect(screen.getByRole('heading', { name: 'Omas Apfelkuchen' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));
  const liste = screen.getByRole('list', { name: 'Rezepte' });
  expect(within(liste).getAllByRole('listitem')).toHaveLength(5);
  fireEvent.click(within(liste).getByRole('button', { name: /Omas Apfelkuchen/ }));
  expect(screen.getByText('6 Äpfel')).toBeInTheDocument();
});
