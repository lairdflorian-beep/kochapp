import React from 'react';
import { Rezept } from '../data/rezepte';
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
        <li key={rezept.id}>
          <RezeptKarte
            name={rezept.name}
            autor={rezept.autor}
            dauerMinuten={rezept.dauerMinuten}
            foto={rezept.foto}
            onAuswaehlen={() => onAuswaehlen(rezept.id)}
          />
        </li>
      ))}
    </ul>
  );
}

export default RezeptListe;
