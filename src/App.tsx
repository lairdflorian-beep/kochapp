import React, { useEffect, useState } from 'react';
import Anmeldung from './components/Anmeldung';
import RezeptDetail from './components/RezeptDetail';
import RezeptFormular from './components/RezeptFormular';
import RezeptListe from './components/RezeptListe';
import RezeptSuche from './components/RezeptSuche';
import SuchButton from './components/SuchButton';
import Ueberschrift from './components/Ueberschrift';
import { Rezept } from './data/rezepte';
import { ladeRezepte, speichereRezepte } from './data/speicher';
import { ladeAnmeldung, speichereAnmeldung } from './data/anmeldung';
import './App.css';

type Seite =
  | { typ: 'start' | 'neu' | 'anmelden' | 'unbekannt' }
  | { typ: 'suche'; suchbegriff: string | null }
  | { typ: 'detail' | 'bearbeiten'; rezeptId: string; suche: string | null };

function seiteAusAdresse(): Seite {
  const [pfad, query = ''] = window.location.hash.slice(1).split('?');
  const parameter = new URLSearchParams(query);
  if (!pfad || pfad === '/') return { typ: 'start' };
  if (pfad === '/suche') return { typ: 'suche', suchbegriff: parameter.get('q') };
  if (pfad === '/anmelden') return { typ: 'anmelden' };
  if (pfad === '/rezepte/neu') return { typ: 'neu' };
  const rezeptPfad = /^\/rezepte\/([^/]+)(\/bearbeiten)?$/.exec(pfad);
  if (rezeptPfad) {
    try {
      return {
        typ: rezeptPfad[2] ? 'bearbeiten' : 'detail',
        rezeptId: decodeURIComponent(rezeptPfad[1]),
        suche: parameter.get('suche'),
      };
    } catch { /* Fehlerhafte URLs werden als unbekannte Seite angezeigt. */ }
  }
  return { typ: 'unbekannt' };
}

function App() {
  const [anfang] = useState(ladeRezepte);
  const [rezepte, setRezepte] = useState<Rezept[]>(anfang.rezepte);
  const [speicherFehler, setSpeicherFehler] = useState(anfang.fehler);
  const [meldung, setMeldung] = useState('');
  const [benutzer, setBenutzer] = useState(ladeAnmeldung);
  const [seite, setSeite] = useState(seiteAusAdresse);

  useEffect(() => {
    const adresseGeaendert = () => setSeite(seiteAusAdresse());
    window.addEventListener('hashchange', adresseGeaendert);
    return () => window.removeEventListener('hashchange', adresseGeaendert);
  }, []);

  function navigiere(pfad: string) {
    window.location.hash = pfad;
    setSeite(seiteAusAdresse());
    setMeldung('');
  }

  function rezeptAdresse(id: string, bearbeiten = false, suche: string | null = null) {
    return `/rezepte/${encodeURIComponent(id)}${bearbeiten ? '/bearbeiten' : ''}` +
      (suche !== null ? `?suche=${encodeURIComponent(suche)}` : '');
  }

  function aktualisieren(neueRezepte: Rezept[]): boolean {
    if (!benutzer) return false;
    if (!speichereRezepte(neueRezepte)) {
      setSpeicherFehler('Änderungen konnten nicht gespeichert werden. Der Browserspeicher ist voll oder gesperrt. Bitte ein kleineres Foto verwenden oder Speicher freigeben.');
      return false;
    }
    setRezepte(neueRezepte);
    setSpeicherFehler('');
    return true;
  }

  function speichern(rezept: Rezept) {
    if (!benutzer) return;
    const neu = !rezept.id;
    const bisher = rezepte.find((eintrag) => eintrag.id === rezept.id);
    if (!neu && !bisher) return;
    const gespeichert: Rezept = {
      ...rezept,
      id: neu ? `rezept-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` : rezept.id,
      autor: bisher ? bisher.autor : benutzer.name,
    };
    const neueRezepte = neu ? [...rezepte, gespeichert] : rezepte.map((bisher) =>
      bisher.id === gespeichert.id ? gespeichert : bisher);
    if (aktualisieren(neueRezepte)) {
      const suche = seite.typ === 'bearbeiten' ? seite.suche : null;
      navigiere(rezeptAdresse(gespeichert.id, false, suche));
      setMeldung(neu ? 'Rezept wurde angelegt.' : 'Rezept wurde gespeichert.');
    }
  }

  function inhalt() {
    if (!benutzer) {
      return <Anmeldung onAnmelden={(angemeldeterBenutzer) => {
        speichereAnmeldung(angemeldeterBenutzer);
        setBenutzer(angemeldeterBenutzer);
        setMeldung('');
        if (seite.typ === 'anmelden') navigiere('');
      }} />;
    }
    if (seite.typ === 'start' || seite.typ === 'anmelden') {
      return (
        <>
          <div className="konto-leiste">
            <span>{benutzer.name}</span>
            <button className="text-button" type="button" onClick={() => {
              speichereAnmeldung(null);
              setBenutzer(null);
              navigiere('/anmelden');
            }}>Abmelden</button>
          </div>
          <Ueberschrift inhalt="Familienkochbuch" />
          <div className="start-aktionen">
            <SuchButton onSuchen={() => navigiere('/suche')} />
            <button className="rezept-aktion" type="button" onClick={() => navigiere('/rezepte/neu')}>Neues Rezept</button>
          </div>
          {rezepte.length > 0
            ? <RezeptListe rezepte={rezepte} onAuswaehlen={(id) => navigiere(rezeptAdresse(id))} />
            : <p>Keine Rezepte vorhanden. Lege das erste Familienrezept an.</p>}
        </>
      );
    }
    if (seite.typ === 'suche') {
      return <RezeptSuche rezepte={rezepte} suchbegriff={seite.suchbegriff}
        onZurueck={() => navigiere('')}
        onSuchen={(begriff) => navigiere(`/suche?q=${encodeURIComponent(begriff)}`)}
        onAuswaehlen={(id) => navigiere(rezeptAdresse(id, false, seite.suchbegriff))} />;
    }
    if (seite.typ === 'neu') {
      return <div className="rezept-detail">
        <button className="rezept-zurueck" type="button" onClick={() => navigiere('')}><span aria-hidden="true">←</span> Zurück</button>
        <RezeptFormular key="neu" neu rezept={{ id: '', name: '', autor: benutzer.name, dauerMinuten: 0, zutaten: [], zubereitung: [] }}
          onAbbrechen={() => navigiere('')} onSpeichern={speichern} />
      </div>;
    }
    if (seite.typ === 'detail' || seite.typ === 'bearbeiten') {
      const ausgewaehlt = rezepte.find((rezept) => rezept.id === seite.rezeptId);
      const zurListe = () => navigiere(seite.suche !== null ? `/suche?q=${encodeURIComponent(seite.suche)}` : '');
      if (ausgewaehlt) {
        const zurDetailseite = () => navigiere(rezeptAdresse(ausgewaehlt.id, false, seite.suche));
        if (seite.typ === 'bearbeiten') {
          return <div className="rezept-detail">
            <button className="rezept-zurueck" type="button" onClick={zurDetailseite}><span aria-hidden="true">←</span> Zurück</button>
            <RezeptFormular key={ausgewaehlt.id} rezept={ausgewaehlt} onAbbrechen={zurDetailseite} onSpeichern={speichern} />
          </div>;
        }
        return <RezeptDetail key={ausgewaehlt.id} rezept={ausgewaehlt} onZurueck={zurListe}
          onBearbeiten={() => navigiere(rezeptAdresse(ausgewaehlt.id, true, seite.suche))}
          onLoeschen={() => {
            if (!aktualisieren(rezepte.filter((rezept) => rezept.id !== ausgewaehlt.id))) return false;
            zurListe();
            setMeldung('Rezept wurde gelöscht.');
            return true;
          }} />;
      }
    }
    return <div className="rezept-detail">
      <button className="rezept-zurueck" type="button" onClick={() => navigiere('')}><span aria-hidden="true">←</span> Zurück</button>
      <h1>{seite.typ === 'unbekannt' ? 'Seite nicht gefunden' : 'Rezept nicht gefunden'}</h1>
      <p>Dieser Inhalt ist nicht verfügbar.</p>
    </div>;
  }

  return (
    <main className={`App${!benutzer || (seite.typ !== 'start' && seite.typ !== 'anmelden' && seite.typ !== 'suche') ? ' App--detail' : ''}`}>
      {benutzer && speicherFehler && <p className="speicher-fehler" role="alert">{speicherFehler}</p>}
      {benutzer && meldung && <p className="statusmeldung" role="status">{meldung}</p>}
      {inhalt()}
    </main>
  );
}

export default App;
