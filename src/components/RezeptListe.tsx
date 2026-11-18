import React, { useEffect, useState } from 'react';
import { Rezept } from '../Rezept';
import RezeptKarte from './RezeptKarte';
import './RezeptListe.css';

interface RezeptListeProps {
  onAuswahl?: (id: number) => void;
}

function RezeptListe({ onAuswahl }: RezeptListeProps) {
  const [rezepte, setRezepte] = useState<Rezept[]>([]);

  useEffect(() => {
    fetch('/rezepte')
      .then((antwort) => antwort.json())
      .then((daten: Rezept[]) => setRezepte(daten))
      .catch(() => setRezepte([]));
  }, []);

  return (
    <ul className="rezept-liste" aria-label="Rezepte">
      {rezepte.map((rezept) => (
        <li key={rezept.id}>
          <RezeptKarte
            name={rezept.name}
            autor={rezept.autor}
            dauerMinuten={rezept.dauerMinuten}
            onClick={() => onAuswahl?.(rezept.id)}
          />
        </li>
      ))}
    </ul>
  );
}

export default RezeptListe;
