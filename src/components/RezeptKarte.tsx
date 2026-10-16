import React from 'react';
import './RezeptKarte.css';

interface RezeptKarteProps {
  name: string;
  autor: string;
  dauerMinuten: number;
  foto?: string;
  onAuswaehlen?: () => void;
}

function RezeptKarte({ name, autor, dauerMinuten, foto, onAuswaehlen }: RezeptKarteProps) {
  return (
    <button className="rezept-karte" type="button" onClick={onAuswaehlen}>
      <span className="rezept-bild" aria-hidden="true">
        {foto && <img src={foto} alt="" />}
      </span>
      <span className="rezept-text">
        <span className="rezept-name">{name}</span>
        <span className="rezept-info">von {autor} · {dauerMinuten} Min.</span>
      </span>
      <span className="rezept-pfeil" aria-hidden="true">›</span>
    </button>
  );
}

export default RezeptKarte;

