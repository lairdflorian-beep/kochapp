import type { Rezept } from './api';

// Vereinheitlicht Texte für den Vergleich: Kleinschreibung und Umlaute,
// damit etwa „gemuese“ auch „Gemüse“ findet.
function normalisieren(text: string): string {
  return text
    .normalize('NFC')
    .toLocaleLowerCase('de')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

// Liefert alle Rezepte, deren Name oder Autor jedes Wort des Suchbegriffs enthält.
export function filtereRezepte(rezepte: Rezept[], suchbegriff: string): Rezept[] {
  const woerter = normalisieren(suchbegriff).split(/\s+/).filter(Boolean);
  return rezepte.filter((rezept) => {
    const text = normalisieren(`${rezept.name} ${rezept.autor}`);
    return woerter.every((wort) => text.includes(wort));
  });
}
