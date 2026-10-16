import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { DEMO_BENUTZER, DEMO_EMAIL, DEMO_PASSWORT, SITZUNG_SCHLUESSEL, speichereAnmeldung } from './data/anmeldung';
import { REZEPTE_SCHLUESSEL, MAX_FOTO_BYTES } from './data/speicher';
import { rezepte } from './data/rezepte';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  localStorage.clear();
  sessionStorage.clear();
  speichereAnmeldung(DEMO_BENUTZER);
});

afterEach(() => {
  jest.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

function klicken(name: string | RegExp) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function ausfuellen(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function neuesRezept() {
  klicken('Neues Rezept');
  ausfuellen('Rezeptname', ' Familienbrot ');
  expect(screen.queryByLabelText('Autor')).not.toBeInTheDocument();
  ausfuellen('Zubereitungszeit (Minuten)', '60');
  ausfuellen('Zutaten (eine pro Zeile)', ' 500 g Mehl\n\n 300 ml Wasser ');
  ausfuellen('Zubereitung (ein Schritt pro Zeile)', ' Kneten.\n Backen. ');
}

function suche(begriff: string) {
  klicken('Rezept suchen');
  ausfuellen('Suchbegriff', begriff);
  klicken('Suchen');
}

test('findet die beiden Kuchen aus der PDF und erhält die Suche beim Zurückgehen', () => {
  render(<App />);
  suche('  kUcHeN  ');
  expect(screen.getByRole('status')).toHaveTextContent('2 Treffer für „kUcHeN“');
  expect(within(screen.getByRole('list', { name: 'Rezepte' })).getAllByRole('listitem')).toHaveLength(2);
  klicken(/Omas Apfelkuchen/);
  klicken('Bearbeiten');
  klicken('Abbrechen');
  klicken('Zurück');
  expect(screen.getByLabelText('Suchbegriff')).toHaveValue('kUcHeN');
  expect(screen.getByRole('status')).toHaveTextContent('2 Treffer');
});

test('sucht auch nach Zutaten und Autoren und zeigt keine oder alle Treffer', () => {
  render(<App />);
  suche('Butter');
  expect(screen.getByRole('status')).toHaveTextContent('1 Treffer');
  ausfuellen('Suchbegriff', 'Lena');
  klicken('Suchen');
  expect(screen.getByRole('button', { name: /Pfannkuchen/ })).toBeInTheDocument();
  ausfuellen('Suchbegriff', 'Nicht vorhanden');
  klicken('Suchen');
  expect(screen.getByText(/Keine passenden Rezepte/)).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  ausfuellen('Suchbegriff', '  ');
  klicken('Suchen');
  expect(screen.getByRole('status')).toHaveTextContent('5 Treffer – alle Rezepte');
});

test('unterstützt direkte Suchlinks und geänderte Suchparameter', () => {
  window.history.replaceState(null, '', '/#/suche?q=Kuchen');
  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent('2 Treffer');
  act(() => {
    window.history.replaceState(null, '', '/#/suche?q=Suppe');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByLabelText('Suchbegriff')).toHaveValue('Suppe');
  expect(screen.getByRole('status')).toHaveTextContent('1 Treffer');
});

test('legt ein Rezept an, speichert bereinigte Daten und lädt sie erneut', () => {
  const app = render(<App />);
  neuesRezept();
  klicken('Speichern');
  expect(screen.getByRole('heading', { name: 'Familienbrot' })).toBeInTheDocument();
  expect(screen.getByText('von Jürgen · 60 Min.')).toBeInTheDocument();
  const gespeichert = JSON.parse(localStorage.getItem(REZEPTE_SCHLUESSEL)!);
  expect(gespeichert).toHaveLength(6);
  expect(gespeichert[5].autor).toBe('Jürgen');
  expect(gespeichert[5].zutaten).toEqual(['500 g Mehl', '300 ml Wasser']);
  app.unmount();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Familienbrot' })).toBeInTheDocument();
  klicken('Zurück');
  expect(screen.getByRole('button', { name: /Familienbrot/ })).toBeInTheDocument();
});

test('bricht eine Neuanlage ohne Änderung der Daten ab', () => {
  render(<App />);
  neuesRezept();
  klicken('Abbrechen');
  expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(5);
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
});

test.each(['Zutaten (eine pro Zeile)', 'Zubereitung (ein Schritt pro Zeile)'])('weist leere Zeilen in %s zurück', (label) => {
  render(<App />);
  neuesRezept();
  ausfuellen(label, ' \n ');
  klicken('Speichern');
  expect(screen.getByRole('alert')).toHaveTextContent('mindestens eine Zutat und einen Zubereitungsschritt');
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
});

test.each(['0', '-1', '1.5'])('verhindert die ungültige Zubereitungszeit %s', (dauer) => {
  render(<App />);
  neuesRezept();
  ausfuellen('Zubereitungszeit (Minuten)', dauer);
  fireEvent.submit(screen.getByRole('button', { name: 'Speichern' }).closest('form')!);
  expect(screen.getByRole('alert')).toHaveTextContent('gültige Zubereitungszeit');
});

test('behält Eingaben und Originaldaten bei einem Speicherfehler', () => {
  render(<App />);
  neuesRezept();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError'); });
  klicken('Speichern');
  expect(screen.getByRole('alert')).toHaveTextContent('nicht gespeichert');
  expect(screen.getByLabelText('Rezeptname')).toHaveValue(' Familienbrot ');
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBeNull();
});

test('fügt ein Foto hinzu, tauscht es aus und entfernt es dauerhaft', async () => {
  render(<App />);
  neuesRezept();
  fireEvent.change(screen.getByLabelText('Rezeptfoto auswählen'), {
    target: { files: [new File(['fotodaten'], 'brot.png', { type: 'image/png' })] },
  });
  const vorschau = await screen.findByAltText('Vorschau des Rezeptfotos');
  expect(vorschau).toHaveAttribute('src', expect.stringContaining('data:image/png;base64,'));
  klicken('Speichern');
  expect(screen.getByAltText('Familienbrot')).toHaveAttribute('src', vorschau.getAttribute('src'));
  klicken('Bearbeiten');
  fireEvent.change(screen.getByLabelText('Rezeptfoto auswählen'), {
    target: { files: [new File(['anderesfoto'], 'brot.jpg', { type: 'image/jpeg' })] },
  });
  await waitFor(() => expect(screen.getByAltText('Vorschau des Rezeptfotos'))
    .toHaveAttribute('src', expect.stringContaining('data:image/jpeg;base64,')));
  klicken('Speichern');
  expect(screen.getByAltText('Familienbrot')).toHaveAttribute('src', expect.stringContaining('data:image/jpeg;base64,'));
  klicken('Bearbeiten');
  klicken('Foto entfernen');
  klicken('Speichern');
  expect(screen.queryByAltText('Familienbrot')).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(REZEPTE_SCHLUESSEL)!)[5].foto).toBeUndefined();
});

test('weist ungeeignete und zu große Fotodateien zurück', () => {
  render(<App />);
  neuesRezept();
  fireEvent.change(screen.getByLabelText('Rezeptfoto auswählen'), {
    target: { files: [new File(['text'], 'notiz.txt', { type: 'text/plain' })] },
  });
  expect(screen.getByRole('alert')).toHaveTextContent('JPG, PNG oder WebP');
  fireEvent.change(screen.getByLabelText('Rezeptfoto auswählen'), {
    target: { files: [new File([new Uint8Array(MAX_FOTO_BYTES + 1)], 'gross.png', { type: 'image/png' })] },
  });
  expect(screen.getByRole('alert')).toHaveTextContent('höchstens 2 MB');
  expect(screen.queryByAltText('Vorschau des Rezeptfotos')).not.toBeInTheDocument();
});

test('löscht ein Rezept erst nach Bestätigung und behält die Löschung nach Neuladen', () => {
  const app = render(<App />);
  klicken(/Omas Apfelkuchen/);
  klicken('Löschen');
  const dialog = screen.getByRole('alertdialog');
  expect(within(dialog).getByText(/wirklich löschen/)).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Löschen' }));
  expect(screen.queryByRole('button', { name: /Omas Apfelkuchen/ })).not.toBeInTheDocument();
  app.unmount();
  render(<App />);
  expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(4);
});

test('hält den Fokus im Dialog und schließt ihn mit Escape', () => {
  render(<App />);
  klicken(/Omas Apfelkuchen/);
  const ausloeser = screen.getByRole('button', { name: 'Löschen' });
  ausloeser.focus();
  fireEvent.click(ausloeser);
  const dialog = screen.getByRole('alertdialog');
  const abbrechen = within(dialog).getByRole('button', { name: 'Abbrechen' });
  expect(abbrechen).toHaveFocus();
  fireEvent.keyDown(abbrechen, { key: 'Tab', shiftKey: true });
  expect(within(dialog).getByRole('button', { name: 'Löschen' })).toHaveFocus();
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(ausloeser).toHaveFocus();
});

test('behält bei fehlgeschlagener Löschung das Rezept und den Dialog', () => {
  render(<App />);
  klicken(/Omas Apfelkuchen/);
  klicken('Löschen');
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Speicher gesperrt'); });
  const dialog = screen.getByRole('alertdialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Löschen' }));
  expect(within(dialog).getByRole('alert')).toHaveTextContent('Löschen konnte nicht gespeichert werden');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Abbrechen' }));
  expect(screen.getByRole('heading', { name: 'Omas Apfelkuchen' })).toBeInTheDocument();
});

test('zeigt den leeren Zustand nach Löschen des letzten Rezepts dauerhaft', () => {
  localStorage.setItem(REZEPTE_SCHLUESSEL, JSON.stringify([rezepte[0]]));
  const app = render(<App />);
  klicken(/Omas Apfelkuchen/);
  klicken('Löschen');
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Löschen' }));
  app.unmount();
  render(<App />);
  expect(screen.getByText(/Keine Rezepte vorhanden/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Neues Rezept' })).toBeEnabled();
});

test('zeigt Anmeldefehler und erlaubt anschließend Anmeldung und Abmeldung', () => {
  sessionStorage.clear();
  const app = render(<App />);
  expect(screen.getByLabelText('Passwort')).toHaveAttribute('type', 'password');
  ausfuellen('E-Mail', DEMO_EMAIL);
  ausfuellen('Passwort', 'falsch');
  klicken('Anmelden');
  expect(screen.getByRole('alert')).toHaveTextContent('E-Mail oder Passwort ist falsch. Bitte versuchen Sie es erneut.');
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBeNull();
  ausfuellen('Passwort', DEMO_PASSWORT);
  klicken('Anmelden');
  expect(screen.getAllByText('Jürgen')).toHaveLength(1);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBe(DEMO_BENUTZER.id);
  expect(JSON.stringify(sessionStorage)).not.toContain(DEMO_PASSWORT);
  app.unmount();
  render(<App />);
  klicken('Neues Rezept');
  expect(screen.queryByLabelText('Autor')).not.toBeInTheDocument();
  klicken('Abbrechen');
  klicken('Abmelden');
  expect(screen.getByRole('button', { name: 'Anmelden' })).toBeInTheDocument();
  expect(screen.queryByRole('list', { name: 'Rezepte' })).not.toBeInTheDocument();
  expect(sessionStorage.getItem(SITZUNG_SCHLUESSEL)).toBeNull();
});

test.each(['/unbekannt', '/rezepte/%E0%A4%A'])('behandelt die ungültige Adresse %s', (pfad) => {
  window.history.replaceState(null, '', `/#${pfad}`);
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Seite nicht gefunden' })).toBeInTheDocument();
  klicken('Zurück');
  expect(screen.getByRole('list', { name: 'Rezepte' })).toBeInTheDocument();
});


