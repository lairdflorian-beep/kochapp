import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { DEMO_BENUTZER, DEMO_EMAIL, DEMO_PASSWORT, SITZUNG_SCHLUESSEL } from './data/anmeldung';
import { REZEPTE_SCHLUESSEL } from './data/speicher';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

function anmelden() {
  fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: DEMO_EMAIL } });
  fireEvent.change(screen.getByLabelText('Passwort'), { target: { value: DEMO_PASSWORT } });
  fireEvent.click(screen.getByRole('button', { name: 'Anmelden' }));
}

function erwarteAnmeldung() {
  expect(screen.getByLabelText('E-Mail')).toBeInTheDocument();
  expect(screen.getByLabelText('Passwort')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Anmelden' })).toBeInTheDocument();
  expect(screen.queryByRole('list', { name: 'Rezepte' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Rezept suchen' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Neues Rezept' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Bearbeiten' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Löschen' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Speichern' })).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Suchbegriff')).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Rezeptname')).not.toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Zutaten' })).not.toBeInTheDocument();
}

test.each([
  ['', 'Familienkochbuch'],
  ['/anmelden', 'Familienkochbuch'],
  ['/suche?q=Kuchen', 'Rezept suchen'],
  ['/rezepte/neu', 'Neues Rezept'],
  ['/rezepte/omas-apfelkuchen', 'Omas Apfelkuchen'],
  ['/rezepte/omas-apfelkuchen/bearbeiten', 'Rezept bearbeiten'],
  ['/rezepte/omas-apfelkuchen/bearbeiten?suche=Kuchen', 'Rezept bearbeiten'],
])('sperrt %s ohne Anmeldung und öffnet das Ziel nach erfolgreicher Anmeldung', (pfad, titel) => {
  window.history.replaceState(null, '', `/#${pfad}`);
  render(<App />);
  erwarteAnmeldung();
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
  anmelden();
  expect(screen.queryByLabelText('Passwort')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: titel, level: 1 })).toBeInTheDocument();
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBe(DEMO_BENUTZER.id);
  if (pfad && pfad !== '/anmelden') expect(window.location.hash).toBe(`#${pfad}`);
});

test.each(['familie', 'unbekannt', '{"id":"juergen","name":"Andere Person"}'])('akzeptiert die ungültige Sitzung %s nicht', (sitzung) => {
  sessionStorage.setItem(SITZUNG_SCHLUESSEL, sitzung);
  render(<App />);
  erwarteAnmeldung();
});

test('zeigt nach Anmeldung nur einmal Jürgen und keine zusätzliche Anmeldemeldung', () => {
  render(<App />);
  anmelden();
  expect(screen.getAllByText('Jürgen')).toHaveLength(1);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.queryByText(/Angemeldet als|Du bist als/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Abmelden' })).toBeInTheDocument();
});

test('sperrt nach Abmeldung auch Browser-Zurück, Vorwärts, Direktlinks und Neuladen', async () => {
  const app = render(<App />);
  anmelden();
  fireEvent.click(screen.getByRole('button', { name: /Omas Apfelkuchen/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));
  fireEvent.click(screen.getByRole('button', { name: 'Abmelden' }));
  erwarteAnmeldung();
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBeNull();

  act(() => { window.history.back(); });
  await waitFor(() => expect(window.location.hash).toBe(''));
  erwarteAnmeldung();
  act(() => { window.history.back(); });
  await waitFor(() => expect(window.location.hash).toBe('#/rezepte/omas-apfelkuchen'));
  erwarteAnmeldung();
  act(() => { window.history.forward(); });
  await waitFor(() => expect(window.location.hash).toBe(''));
  erwarteAnmeldung();

  act(() => {
    window.history.replaceState(null, '', '/#/rezepte/omas-apfelkuchen/bearbeiten');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  erwarteAnmeldung();
  app.unmount();
  render(<App />);
  erwarteAnmeldung();
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
});

test('bleibt bei falschem Passwort auch auf einem Bearbeitungsdirektlink gesperrt', () => {
  window.history.replaceState(null, '', '/#/rezepte/omas-apfelkuchen/bearbeiten');
  render(<App />);
  fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: DEMO_EMAIL } });
  fireEvent.change(screen.getByLabelText('Passwort'), { target: { value: 'falsch' } });
  fireEvent.click(screen.getByRole('button', { name: 'Anmelden' }));
  erwarteAnmeldung();
  expect(screen.getByRole('alert')).toHaveTextContent('E-Mail oder Passwort ist falsch');
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBeNull();
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
});

test('zeigt bei gesperrtem Sitzungsspeicher zunächst ausschließlich die Anmeldung', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('SecurityError'); });
  render(<App />);
  erwarteAnmeldung();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
