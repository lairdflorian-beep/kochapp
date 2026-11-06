import React from 'react';
import type { Rezept } from '../api';
import RezeptKarte from './RezeptKarte';
import './RezeptListe.css';

interface RezeptListeProps {
  rezepte: Rezept[];
  onAuswaehlen: (id: string) => void;
}

function RezeptListe({ rezepte, onAuswaehlen }: RezeptListeProps) {
  return (
    <ul className="rezept-liste" aria-label="Rezepte">
      {rezepte.map((rezept) => (
        <li key={rezept._id}>
          <RezeptKarte
            name={rezept.name}
            autor={rezept.autor}
            dauerMinuten={rezept.dauerMinuten}
            onAuswaehlen={() => onAuswaehlen(rezept._id)}
          />
        </li>
      ))}
    </ul>
  );
}

export default RezeptListe;
