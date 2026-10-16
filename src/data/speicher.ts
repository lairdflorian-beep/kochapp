import { Rezept, rezepte as startRezepte } from './rezepte';

export const REZEPTE_SCHLUESSEL = 'familienkochbuch.rezepte.v1';
export const MAX_FOTO_BYTES = 2 * 1024 * 1024;

export function istRezept(wert: unknown): wert is Rezept {
  if (!wert || typeof wert !== 'object') return false;
  const rezept = wert as Partial<Rezept>;
  const text = (inhalt: unknown): inhalt is string => typeof inhalt === 'string' && !!inhalt.trim();
  const zeilen = (inhalt: unknown) => Array.isArray(inhalt) && inhalt.every(text);
  return text(rezept.id) && text(rezept.name) && text(rezept.autor) &&
    Number.isSafeInteger(rezept.dauerMinuten) && rezept.dauerMinuten! >= 0 &&
    zeilen(rezept.zutaten) && zeilen(rezept.zubereitung) &&
    (rezept.foto === undefined || (typeof rezept.foto === 'string' &&
      rezept.foto.length <= Math.ceil(MAX_FOTO_BYTES / 3) * 4 + 100 &&
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(rezept.foto)));
}

export function ladeRezepte(): { rezepte: Rezept[]; fehler: string } {
  try {
    const gespeichert = window.localStorage.getItem(REZEPTE_SCHLUESSEL);
    if (gespeichert !== null) {
      const daten: unknown = JSON.parse(gespeichert);
      if (!Array.isArray(daten) || !daten.every(istRezept) ||
          new Set(daten.map((rezept) => rezept.id)).size !== daten.length) {
        throw new Error('Ungültige Rezeptdaten');
      }
      return { rezepte: daten, fehler: '' };
    }
    return { rezepte: startRezepte, fehler: '' };
  } catch {
    return {
      rezepte: startRezepte,
      fehler: 'Gespeicherte Rezepte konnten nicht geladen werden. Es werden die Beispielrezepte angezeigt.',
    };
  }
}

export function speichereRezepte(rezepte: Rezept[]): boolean {
  try {
    window.localStorage.setItem(REZEPTE_SCHLUESSEL, JSON.stringify(rezepte));
    return true;
  } catch {
    return false;
  }
}
