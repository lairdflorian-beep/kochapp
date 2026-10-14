import React from 'react';
import './SuchButton.css';

function SuchButton() {
  return (
    <button
      id="suche"
      className="suche"
      type="button"
      onClick={() => window.alert('Rezept suchen ...')}
    >
      Rezept suchen
    </button>
  );
}

export default SuchButton;
