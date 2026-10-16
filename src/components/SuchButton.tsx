import React from 'react';
import './SuchButton.css';

interface SuchButtonProps {
  onSuchen: () => void;
}

function SuchButton({ onSuchen }: SuchButtonProps) {
  return (
    <button
      id="suche"
      className="suche"
      type="button"
      onClick={onSuchen}
    >
      Rezept suchen
    </button>
  );
}

export default SuchButton;

