import React, { useEffect, useState } from 'react';
import { ladeRezepte, legeRezeptAn } from './api';
import type { NeuesRezept, Rezept } from './api';
import RezeptDetail from './components/RezeptDetail';
import RezeptFormular from './components/RezeptFormular';
import RezeptListe from './components/RezeptListe';
import RezeptSuche from './components/RezeptSuche';
import SuchButton from './components/SuchButton';
import Ueberschrift from './components/Ueberschrift';
import './App.css';

function App() {
  const [rezepte, setRezepte] = useState<Rezept[]>([]);
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState('');
  const [ausgewaehlteId, setAusgewaehlteId] = useState<string | null>(null);
  const [sucheAktiv, setSucheAktiv] = useState(false);
  const [suchbegriff, setSuchbegriff] = useState('');

  useEffect(() => {
    let aktiv = true;
    let timer: ReturnType<typeof setTimeout>;

    // Lädt die Rezepte beim Start und versucht es erneut, solange der Server nicht erreichbar ist.
    function laden() {
      ladeRezepte()
        .then((daten) => {
          if (!aktiv) return;
          setRezepte(daten);
          setFehler('');
          setLaedt(false);
        })
        .catch(() => {
          if (!aktiv) return;
          setFehler('Die Rezepte konnten nicht geladen werden. Neuer Versuch in 3 Sekunden …');
          setLaedt(false);
          timer = setTimeout(laden, 3000);
        });
    }

    laden();
    return () => {
      aktiv = false;
      clearTimeout(timer);
    };
  }, []);

  async function rezeptAnlegen(neuesRezept: NeuesRezept) {
    const gespeichert = await legeRezeptAn(neuesRezept);
    setRezepte((bisherigeRezepte) => [...bisherigeRezepte, gespeichert]);
  }

  if (ausgewaehlteId !== null) {
    return (
        <div className="App">
          <RezeptDetail id={ausgewaehlteId} onZurueck={() => setAusgewaehlteId(null)} />
        </div>
    );
  }

  if (sucheAktiv) {
    return (
        <div className="App">
          <RezeptSuche
            rezepte={rezepte}
            suchbegriff={suchbegriff}
            onSuchbegriffAendern={setSuchbegriff}
            onAuswaehlen={setAusgewaehlteId}
            onZurueck={() => {
              setSucheAktiv(false);
              setSuchbegriff('');
            }}
          />
        </div>
    );
  }

  return (
      <div className="App">
        <Ueberschrift inhalt="Familienkochbuch" />

        <SuchButton onSuchen={() => setSucheAktiv(true)} />

        {laedt && <p className="status">Rezepte werden geladen …</p>}
        {fehler && <p className="status status-fehler" role="alert">{fehler}</p>}
        {!laedt && !fehler && <RezeptListe rezepte={rezepte} onAuswaehlen={setAusgewaehlteId} />}

        <RezeptFormular onSpeichern={rezeptAnlegen} />
      </div>
  );
}

export default App;
