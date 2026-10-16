import React, { useEffect, useRef, useState } from 'react';
import { Rezept } from '../data/rezepte';
import { MAX_FOTO_BYTES } from '../data/speicher';

interface RezeptFormularProps {
  rezept: Rezept;
  neu?: boolean;
  onSpeichern: (rezept: Rezept) => void;
  onAbbrechen: () => void;
}

function RezeptFormular({ rezept, neu = false, onSpeichern, onAbbrechen }: RezeptFormularProps) {
  const [name, setName] = useState(rezept.name);
  const [dauer, setDauer] = useState(neu ? '' : String(rezept.dauerMinuten));
  const [zutaten, setZutaten] = useState(rezept.zutaten.join('\n'));
  const [zubereitung, setZubereitung] = useState(rezept.zubereitung.join('\n'));
  const [foto, setFoto] = useState(rezept.foto);
  const [fotoFehler, setFotoFehler] = useState('');
  const [fotoLaedt, setFotoLaedt] = useState(false);
  const [fehler, setFehler] = useState('');
  const nameFeld = useRef<HTMLInputElement>(null);
  const fotoFeld = useRef<HTMLInputElement>(null);
  const leser = useRef<FileReader | null>(null);

  useEffect(() => {
    nameFeld.current?.focus();
    return () => { leser.current?.abort(); };
  }, []);

  function fotoAuswaehlen(event: React.ChangeEvent<HTMLInputElement>) {
    const datei = event.target.files?.[0];
    event.target.value = '';
    if (!datei) return;
    leser.current?.abort();
    setFotoLaedt(false);
    setFotoFehler('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(datei.type)) {
      setFotoFehler('Bitte ein Foto im Format JPG, PNG oder WebP auswählen.');
      return;
    }
    if (datei.size === 0 || datei.size > MAX_FOTO_BYTES) {
      setFotoFehler('Das Foto darf nicht leer und höchstens 2 MB groß sein.');
      return;
    }
    const reader = new FileReader();
    leser.current = reader;
    setFotoLaedt(true);
    reader.onload = () => {
      if (typeof reader.result === 'string') setFoto(reader.result);
      setFotoLaedt(false);
    };
    reader.onerror = () => {
      setFotoFehler('Das Foto konnte nicht gelesen werden. Bitte erneut versuchen.');
      setFotoLaedt(false);
    };
    reader.readAsDataURL(datei);
  }

  function speichern(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (fotoLaedt) return;
    const dauerMinuten = Number(dauer);
    if (!name.trim() || !dauer.trim() ||
        !Number.isSafeInteger(dauerMinuten) || dauerMinuten <= 0) {
      setFehler('Bitte Rezeptname und eine gültige Zubereitungszeit in ganzen Minuten eingeben.');
      return;
    }

    const zeilen = (text: string) => text.split(/\r?\n/).map((zeile) => zeile.trim()).filter(Boolean);
    if (!zeilen(zutaten).length || !zeilen(zubereitung).length) {
      setFehler('Bitte mindestens eine Zutat und einen Zubereitungsschritt eingeben.');
      return;
    }
    setFehler('');
    onSpeichern({
      ...rezept,
      name: name.trim(),
      dauerMinuten,
      zutaten: zeilen(zutaten),
      zubereitung: zeilen(zubereitung),
      foto,
    });
  }

  return (
    <form className="rezept-formular" onSubmit={speichern}>
      <h1>{neu ? 'Neues Rezept' : 'Rezept bearbeiten'}</h1>
      <label htmlFor="rezept-name">Rezeptname</label>
      <input id="rezept-name" ref={nameFeld} placeholder="z. B. Omas Apfelkuchen" value={name} onChange={(event) => setName(event.target.value)} required />

      <label htmlFor="rezept-dauer">Zubereitungszeit (Minuten)</label>
      <input id="rezept-dauer" type="number" min="1" step="1" placeholder="z. B. 75" value={dauer} onChange={(event) => setDauer(event.target.value)} required />

      <label htmlFor="rezept-zutaten">Zutaten (eine pro Zeile)</label>
      <textarea id="rezept-zutaten" rows={5} placeholder="Eine Zutat pro Zeile" value={zutaten} onChange={(event) => setZutaten(event.target.value)} required />

      <label htmlFor="rezept-zubereitung">Zubereitung (ein Schritt pro Zeile)</label>
      <textarea id="rezept-zubereitung" rows={5} placeholder="Ein Schritt pro Zeile" value={zubereitung} onChange={(event) => setZubereitung(event.target.value)} required />

      <div className="foto-auswahl">
        {foto && <img className="foto-vorschau" src={foto} alt="Vorschau des Rezeptfotos" />}
        <input className="visuell-versteckt" id="rezept-foto" type="file" ref={fotoFeld} tabIndex={-1}
          aria-label="Rezeptfoto auswählen" accept="image/jpeg,image/png,image/webp" onChange={fotoAuswaehlen} />
        <button className="rezept-aktion" type="button" onClick={() => fotoFeld.current?.click()}>
          {foto || !neu ? 'Foto ändern' : 'Foto hinzufügen'}
        </button>
        {foto && <button className="text-button" type="button" onClick={() => {
          leser.current?.abort();
          setFotoLaedt(false);
          setFoto(undefined);
          setFotoFehler('');
        }}>Foto entfernen</button>}
        <p className="rezept-hinweis">Optional: JPG, PNG oder WebP, maximal 2 MB.</p>
        {fotoLaedt && <p role="status">Foto wird geladen …</p>}
        {fotoFehler && <p className="rezept-fehler" role="alert">{fotoFehler}</p>}
      </div>

      {fehler && <p className="rezept-fehler" role="alert">{fehler}</p>}
      <div className="rezept-aktionen">
        <button className="rezept-aktion" type="submit" disabled={fotoLaedt}>Speichern</button>
        <button className="rezept-aktion" type="button" onClick={onAbbrechen}>Abbrechen</button>
      </div>
    </form>
  );
}

export default RezeptFormular;
