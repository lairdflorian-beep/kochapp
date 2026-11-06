import React, { useEffect, useRef } from 'react';
import type { Rezept } from '../api';
import { filtereRezepte } from '../suche';
import RezeptListe from './RezeptListe';
import './RezeptDetail.css';
import './RezeptSuche.css';

interface RezeptSucheProps {
  rezepte: Rezept[];
  suchbegriff: string;
  onSuchbegriffAendern: (suchbegriff: string) => void;
  onAuswaehlen: (id: number) => void;
  onZurueck: () => void;
}

function RezeptSuche({ rezepte, suchbegriff, onSuchbegriffAendern, onAuswaehlen, onZurueck }: RezeptSucheProps) {
  const suchfeld = useRef<HTMLInputElement>(null);
  const treffer = filtereRezepte(rezepte, suchbegriff);
  const begriff = suchbegriff.trim();

  useEffect(() => {
    suchfeld.current?.focus();
  }, []);

  return (
    <section className="rezept-suche">
      <button className="rezept-zurueck" type="button" onClick={onZurueck}>
        <span aria-hidden="true">←</span> Zurück
      </button>

      <h1>Rezept suchen</h1>

      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="suchbegriff">Suchbegriff</label>
        <input
          id="suchbegriff"
          type="search"
          ref={suchfeld}
          value={suchbegriff}
          placeholder="Rezept oder Autor"
          onChange={(event) => onSuchbegriffAendern(event.target.value)}
        />
      </form>

      <p className="suchergebnis" role="status">
        {begriff ? `${treffer.length} Treffer für „${begriff}“` : `Alle ${treffer.length} Rezepte`}
      </p>

      {treffer.length > 0 ? (
        <RezeptListe rezepte={treffer} onAuswaehlen={onAuswaehlen} />
      ) : (
        <p className="status">Keine passenden Rezepte gefunden. Versuche einen anderen Suchbegriff.</p>
      )}
    </section>
  );
}

export default RezeptSuche;
