const API_URL = 'http://localhost:3001';

// MongoDB vergibt die ID im Feld _id als Zeichenkette.
export interface Rezept {
  _id: string;
  name: string;
  autor: string;
  dauerMinuten: number;
}

export type NeuesRezept = Omit<Rezept, '_id'>;

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

export function ladeRezept(id: string): Promise<Rezept> {
  return lade<Rezept>(`/rezepte/${id}`);
}

export async function legeRezeptAn(rezept: NeuesRezept): Promise<Rezept> {
  let antwort: Response;
  try {
    antwort = await fetch(`${API_URL}/rezepte`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rezept),
    });
  } catch {
    // fetch schlägt nur fehl, wenn der Server nicht erreichbar ist.
    throw new Error(
      'Das Rezept konnte nicht gespeichert werden. Bitte überprüfe deine Internetverbindung und speichere es erneut.'
    );
  }
  const daten = await antwort.json();
  if (!antwort.ok) {
    throw new Error(daten.error);
  }
  return daten;
}
