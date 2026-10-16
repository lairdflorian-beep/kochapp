import React, { useEffect, useRef, useState } from 'react';
import { Rezept } from '../data/rezepte';
import RezeptListe from './RezeptListe';

interface RezeptSucheProps {
  rezepte: Rezept[];
  suchbegriff: string | null;
  onSuchen: (begriff: string) => void;
  onAuswaehlen: (id: string) => void;
  onZurueck: () => void;
}

function RezeptSuche({ rezepte, suchbegriff, onSuchen, onAuswaehlen, onZurueck }: RezeptSucheProps) {
  const [eingabe, setEingabe] = useState(suchbegriff ?? '');
  const suchfeld = useRef<HTMLInputElement>(null);
  useEffect(() => { suchfeld.current?.focus(); }, []);
  useEffect(() => { setEingabe(suchbegriff ?? ''); }, [suchbegriff]);

  const normalisieren = (text: string) => text.toLocaleLowerCase('de').normalize('NFC');
  const woerter = normalisieren(suchbegriff ?? '').trim().split(/\s+/).filter(Boolean);
  const treffer = rezepte.filter((rezept) => {
    const text = normalisieren([rezept.name, rezept.autor, ...rezept.zutaten].join(' '));
    return woerter.every((wort) => text.includes(wort));
  });

  return (
    <section className="rezept-detail suchseite">
      <button className="rezept-zurueck" type="button" onClick={onZurueck}><span aria-hidden="true">←</span> Zurück</button>
      <h1>Rezept suchen</h1>
      <form className="rezept-formular" role="search" onSubmit={(event) => {
        event.preventDefault();
        onSuchen(eingabe.trim());
      }}>
        <label htmlFor="suchbegriff">Suchbegriff</label>
        <input id="suchbegriff" type="search" ref={suchfeld} value={eingabe}
          placeholder="Rezept, Zutat oder Autor" onChange={(event) => setEingabe(event.target.value)} />
        <button className="rezept-aktion formular-absenden" type="submit">Suchen</button>
      </form>
      {suchbegriff !== null ? (
        <>
          <p className="suchergebnis" role="status">
            {treffer.length} Treffer{suchbegriff ? ` für „${suchbegriff}“` : ' – alle Rezepte'}
          </p>
          {treffer.length > 0 ? <RezeptListe rezepte={treffer} onAuswaehlen={onAuswaehlen} /> : (
            <p>Keine passenden Rezepte gefunden. Versuche einen anderen Suchbegriff.</p>
          )}
        </>
      ) : <p className="rezept-hinweis">Suche nach einem Rezept, einer Zutat oder einem Familienmitglied.</p>}
    </section>
  );
}

export default RezeptSuche;

