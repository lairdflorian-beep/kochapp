import React from 'react';
import { Constants } from '../Constants';
import './RezeptKarte.css';

interface RezeptKarteProps {
  name: string;
  autor: string;
  dauerMinuten: number;
  onClick?: () => void;
}

function RezeptKarte({ name, autor, dauerMinuten, onClick }: RezeptKarteProps) {
  return (
    <button className="rezept-karte" type="button" onClick={onClick}>
      <span className="rezept-bild" aria-hidden="true"></span>
      <span className="rezept-text">
        <span className="rezept-name">{name}</span>
        <span className="rezept-info">von {autor} · {Constants.formatiereDauer(dauerMinuten)}</span>
      </span>
      <span className="rezept-pfeil" aria-hidden="true">›</span>
    </button>
  );
}

export default RezeptKarte;
