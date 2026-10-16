import React, { useEffect, useState } from 'react';
import RezeptDetail from './components/RezeptDetail';
import RezeptListe from './components/RezeptListe';
import SuchButton from './components/SuchButton';
import Ueberschrift from './components/Ueberschrift';
import { Rezept, rezepte as startRezepte } from './data/rezepte';
import './App.css';

function seiteAusAdresse(): { rezeptId: string | null; bearbeiten: boolean } {
  const prefix = '#/rezepte/';
  if (!window.location.hash.startsWith(prefix)) {
    return { rezeptId: null, bearbeiten: false };
  }

  const pfad = window.location.hash.slice(prefix.length);
  const suffix = '/bearbeiten';
  const bearbeiten = pfad.endsWith(suffix);
  return {
    rezeptId: bearbeiten ? pfad.slice(0, -suffix.length) : pfad,
    bearbeiten,
  };
}

function App() {
  const [rezepte, setRezepte] = useState<Rezept[]>(startRezepte);
  const [{ rezeptId, bearbeiten }, setSeite] = useState(seiteAusAdresse);

  useEffect(() => {
    const adresseGeaendert = () => setSeite(seiteAusAdresse());
    window.addEventListener('hashchange', adresseGeaendert);
    return () => window.removeEventListener('hashchange', adresseGeaendert);
  }, []);

  function zeigeRezept(id: string | null, bearbeiten = false) {
    window.location.hash = id === null ? '' : `/rezepte/${id}${bearbeiten ? '/bearbeiten' : ''}`;
    setSeite({ rezeptId: id, bearbeiten: id !== null && bearbeiten });
  }

  function speichern(aktualisiert: Rezept) {
    setRezepte((bisher) => bisher.map((rezept) => rezept.id === aktualisiert.id ? aktualisiert : rezept));
    zeigeRezept(aktualisiert.id);
  }

  const ausgewaehlt = rezepte.find((rezept) => rezept.id === rezeptId);

  return (
    <main className={`App${rezeptId !== null ? ' App--detail' : ''}`}>
      {rezeptId !== null ? (
        ausgewaehlt ? (
          <RezeptDetail
            key={ausgewaehlt.id}
            rezept={ausgewaehlt}
            bearbeiten={bearbeiten}
            onZurueck={() => zeigeRezept(null)}
            onBearbeiten={() => zeigeRezept(ausgewaehlt.id, true)}
            onAbbrechen={() => zeigeRezept(ausgewaehlt.id)}
            onSpeichern={speichern}
          />
        ) : (
          <div className="rezept-detail">
            <button className="rezept-zurueck" type="button" onClick={() => zeigeRezept(null)}>← Zurück</button>
            <h1>Rezept nicht gefunden</h1>
            <p>Dieses Rezept ist nicht verfügbar.</p>
          </div>
        )
      ) : (
        <>
          <Ueberschrift inhalt="Familienkochbuch" />
          <SuchButton />
          {rezepte.length > 0
            ? <RezeptListe rezepte={rezepte} onAuswaehlen={(id) => zeigeRezept(id)} />
            : <p>Keine Rezepte vorhanden.</p>}
        </>
      )}
    </main>
  );
}

export default App;
