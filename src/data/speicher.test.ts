import { istRezept, ladeRezepte, REZEPTE_SCHLUESSEL, speichereRezepte } from './speicher';
import { rezepte } from './rezepte';

beforeEach(() => { localStorage.clear(); });
afterEach(() => { jest.restoreAllMocks(); });

test('lädt Beispieldaten nur ohne gespeicherte Rezepte', () => {
  expect(ladeRezepte()).toEqual({ rezepte, fehler: '' });
  expect(speichereRezepte([])).toBe(true);
  expect(ladeRezepte()).toEqual({ rezepte: [], fehler: '' });
});

test('lädt gespeicherte Änderungen einschließlich Foto', () => {
  const daten = [{ ...rezepte[0], name: 'Neuer Name', foto: 'data:image/png;base64,Zm90bw==' }];
  expect(speichereRezepte(daten)).toBe(true);
  expect(ladeRezepte()).toEqual({ rezepte: daten, fehler: '' });
});

test.each(['kein JSON', '{}', '[null]', '[{"id":"unvollständig"}]'])('behandelt beschädigte Daten: %s', (daten) => {
  localStorage.setItem(REZEPTE_SCHLUESSEL, daten);
  expect(ladeRezepte().rezepte).toEqual(rezepte);
  expect(ladeRezepte().fehler).toContain('nicht geladen');
  expect(localStorage.getItem(REZEPTE_SCHLUESSEL)).toBe(daten);
});

test('weist doppelte IDs, falsche Datentypen und nicht unterstützte Fotoquellen zurück', () => {
  localStorage.setItem(REZEPTE_SCHLUESSEL, JSON.stringify([rezepte[0], rezepte[0]]));
  expect(ladeRezepte().fehler).not.toBe('');
  expect(istRezept({ ...rezepte[0], zutaten: [42] })).toBe(false);
  expect(istRezept({ ...rezepte[0], dauerMinuten: -5 })).toBe(false);
  expect(istRezept({ ...rezepte[0], foto: 'https://example.com/foto.png' })).toBe(false);
  expect(istRezept({ ...rezepte[0], foto: 'data:image/svg+xml;base64,Zm90bw==' })).toBe(false);
});

test('meldet gesperrten Speicher ohne Absturz', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('SecurityError'); });
  expect(ladeRezepte().fehler).not.toBe('');
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError'); });
  expect(speichereRezepte(rezepte)).toBe(false);
});
