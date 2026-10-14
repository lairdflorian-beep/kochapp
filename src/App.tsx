import React from 'react';
import './App.css';

function App() {
  return (
      <div className="App">
        <h1>Familienkochbuch</h1>

        <button id="suche" className="suche" type="button">Rezept suchen</button>

        <ul className="rezept-liste" aria-label="Rezepte">
          <li>
            <button className="rezept-karte" type="button">
              <span className="rezept-bild" aria-hidden="true"></span>
              <span className="rezept-text">
                        <span className="rezept-name">Omas Apfelkuchen</span>
                        <span className="rezept-info">von Oma · 75 Min.</span>
                    </span>
              <span className="rezept-pfeil" aria-hidden="true">›</span>
            </button>
          </li>
          <li>
            <button className="rezept-karte" type="button">
              <span className="rezept-bild" aria-hidden="true"></span>
              <span className="rezept-text">
                        <span className="rezept-name">Papas Gulasch</span>
                        <span className="rezept-info">von Papa · 90 Min.</span>
                    </span>
              <span className="rezept-pfeil" aria-hidden="true">›</span>
            </button>
          </li>
          <li>
            <button className="rezept-karte" type="button">
              <span className="rezept-bild" aria-hidden="true"></span>
              <span className="rezept-text">
                        <span className="rezept-name">Kartoffelsuppe</span>
                        <span className="rezept-info">von Mama · 40 Min.</span>
                    </span>
              <span className="rezept-pfeil" aria-hidden="true">›</span>
            </button>
          </li>
          <li>
            <button className="rezept-karte" type="button">
              <span className="rezept-bild" aria-hidden="true"></span>
              <span className="rezept-text">
                        <span className="rezept-name">Pfannkuchen</span>
                        <span className="rezept-info">von Lena · 20 Min.</span>
                    </span>
              <span className="rezept-pfeil" aria-hidden="true">›</span>
            </button>
          </li>
          <li>
            <button className="rezept-karte" type="button">
              <span className="rezept-bild" aria-hidden="true"></span>
              <span className="rezept-text">
                        <span className="rezept-name">Gemüse-Lasagne</span>
                        <span className="rezept-info">von Opa · 60 Min.</span>
                    </span>
              <span className="rezept-pfeil" aria-hidden="true">›</span>
            </button>
          </li>
        </ul>
      </div>
  );
}

export default App;
