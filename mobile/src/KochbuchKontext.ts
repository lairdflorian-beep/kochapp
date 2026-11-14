import { createContext, useContext } from 'react';
import { Benutzer } from './data/anmeldung';
import { Rezept } from './data/rezepte';

// In der Web-App reicht App.tsx Rezepte und Funktionen als Props an die
// Seiten weiter. Mit Expo Router ist jede Seite eine eigene Datei, deshalb
// stellt app/_layout.tsx diese Werte über einen React-Context bereit.
interface Kochbuch {
  rezepte: Rezept[];
  benutzer: Benutzer;
  speichern: (rezept: Rezept) => void;
  loeschen: (id: string) => void;
  abmelden: () => void;
}

export const KochbuchKontext = createContext<Kochbuch | null>(null);

export function useKochbuch(): Kochbuch {
  const kochbuch = useContext(KochbuchKontext);
  if (!kochbuch) throw new Error('KochbuchKontext fehlt');
  return kochbuch;
}
