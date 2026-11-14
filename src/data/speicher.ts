import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rezept, rezepte as startRezepte } from './rezepte';

export const REZEPTE_SCHLUESSEL = 'familienkochbuch.rezepte.v1';

// AsyncStorage ersetzt localStorage aus der Web-App.
// Wichtigster Unterschied: Lesen und Schreiben sind asynchron (async/await).

export async function ladeRezepte(): Promise<Rezept[]> {
  try {
    const gespeichert = await AsyncStorage.getItem(REZEPTE_SCHLUESSEL);
    if (gespeichert !== null) return JSON.parse(gespeichert);
  } catch {
    // Bei einem Fehler werden die Beispielrezepte angezeigt.
  }
  return startRezepte;
}

export async function speichereRezepte(rezepte: Rezept[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(REZEPTE_SCHLUESSEL, JSON.stringify(rezepte));
    return true;
  } catch {
    return false;
  }
}
