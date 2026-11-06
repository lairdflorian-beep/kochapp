const API_URL = 'http://localhost:3001';

export interface Rezept {
  id: number;
  name: string;
  autor: string;
  dauerMinuten: number;
}

export type NeuesRezept = Omit<Rezept, 'id'>;

const laufendeAnfragen = new Map<string, Promise<unknown>>();

function lade<T>(pfad: string): Promise<T> {
  let anfrage = laufendeAnfragen.get(pfad);
  if (!anfrage) {
    anfrage = fetch(`${API_URL}${pfad}`)
      .then(async (antwort) => {
        if (!antwort.ok) {
          throw new Error(`Fehler ${antwort.status}`);
        }
        return antwort.json();
      })
      .finally(() => laufendeAnfragen.delete(pfad));
    laufendeAnfragen.set(pfad, anfrage);
  }
  return anfrage as Promise<T>;
}

export function ladeRezepte(): Promise<Rezept[]> {
  return lade<Rezept[]>('/rezepte');
}

export function ladeRezept(id: number): Promise<Rezept> {
  return lade<Rezept>(`/rezepte/${id}`);
}

// Erzeugt den Header für die HTTP-Basic-Authentifizierung.
// btoa verarbeitet nur einzelne Bytes, deshalb wird der Text vorher in UTF-8 umgewandelt,
// damit auch Umlaute in Benutzername oder Passwort korrekt kodiert werden.
export function erstelleZugang(benutzer: string, passwort: string): string {
  const utf8 = encodeURIComponent(`${benutzer}:${passwort}`).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return 'Basic ' + btoa(utf8);
}

export async function meldeAn(benutzer: string, passwort: string): Promise<string> {
  const zugang = erstelleZugang(benutzer, passwort);
  let antwort: Response;
  try {
    antwort = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { Authorization: zugang },
    });
  } catch {
    throw new Error('Die Anmeldung ist gerade nicht möglich. Bitte überprüfe deine Internetverbindung.');
  }
  if (antwort.status === 401) {
    throw new Error('Benutzername oder Passwort ist falsch.');
  }
  if (!antwort.ok) {
    throw new Error('Die Anmeldung ist fehlgeschlagen.');
  }
  return zugang;
}

export async function legeRezeptAn(rezept: NeuesRezept, zugang: string | null): Promise<Rezept> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (zugang) {
    headers.Authorization = zugang;
  }
  let antwort: Response;
  try {
    antwort = await fetch(`${API_URL}/rezepte`, {
      method: 'POST',
      headers,
      body: JSON.stringify(rezept),
    });
  } catch {
    // fetch schlägt nur fehl, wenn der Server nicht erreichbar ist.
    throw new Error(
      'Das Rezept konnte nicht gespeichert werden. Bitte überprüfe deine Internetverbindung und speichere es erneut.'
    );
  }
  if (antwort.status === 401) {
    throw new Error('Bitte melde dich an, um ein Rezept zu speichern.');
  }
  const daten = await antwort.json();
  if (!antwort.ok) {
    throw new Error(daten.error);
  }
  return daten;
}
