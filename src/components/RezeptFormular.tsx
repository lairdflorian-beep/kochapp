import React, { useEffect, useRef, useState } from 'react';
import { Rezept } from '../data/rezepte';

interface RezeptFormularProps {
  rezept: Rezept;
  onSpeichern: (rezept: Rezept) => void;
  onAbbrechen: () => void;
}

function RezeptFormular({ rezept, onSpeichern, onAbbrechen }: RezeptFormularProps) {
  const [name, setName] = useState(rezept.name);
  const [autor, setAutor] = useState(rezept.autor);
  const [dauer, setDauer] = useState(String(rezept.dauerMinuten));
  const [zutaten, setZutaten] = useState(rezept.zutaten.join('\n'));
  const [zubereitung, setZubereitung] = useState(rezept.zubereitung.join('\n'));
  const [fehler, setFehler] = useState('');
  const nameFeld = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameFeld.current?.focus();
  }, []);

  function speichern(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dauerMinuten = Number(dauer);
    if (!name.trim() || !autor.trim() || !dauer.trim() ||
        !Number.isSafeInteger(dauerMinuten) || dauerMinuten < 0) {
      setFehler('Bitte Name, Autor und eine gültige Dauer in ganzen Minuten eingeben.');
      return;
    }

    const zeilen = (text: string) => text.split(/\r?\n/).map((zeile) => zeile.trim()).filter(Boolean);
    onSpeichern({
      ...rezept,
      name: name.trim(),
      autor: autor.trim(),
      dauerMinuten,
      zutaten: zeilen(zutaten),
      zubereitung: zeilen(zubereitung),
    });
  }

  return (
    <form className="rezept-formular" onSubmit={speichern}>
      <h1>Rezept bearbeiten</h1>
      <label htmlFor="rezept-name">Name</label>
      <input id="rezept-name" ref={nameFeld} value={name} onChange={(event) => setName(event.target.value)} required />

      <label htmlFor="rezept-autor">Autor</label>
      <input id="rezept-autor" value={autor} onChange={(event) => setAutor(event.target.value)} required />

      <label htmlFor="rezept-dauer">Dauer (Minuten)</label>
      <input id="rezept-dauer" type="number" min="0" step="1" value={dauer} onChange={(event) => setDauer(event.target.value)} required />

      <label htmlFor="rezept-zutaten">Zutaten (eine pro Zeile)</label>
      <textarea id="rezept-zutaten" rows={6} value={zutaten} onChange={(event) => setZutaten(event.target.value)} />

      <label htmlFor="rezept-zubereitung">Zubereitung (ein Schritt pro Zeile)</label>
      <textarea id="rezept-zubereitung" rows={6} value={zubereitung} onChange={(event) => setZubereitung(event.target.value)} />

      {fehler && <p className="rezept-fehler" role="alert">{fehler}</p>}
      <p className="rezept-hinweis">Änderungen gelten nur für diese Sitzung.</p>
      <div className="rezept-aktionen">
        <button className="rezept-aktion" type="submit">Speichern</button>
        <button className="rezept-aktion" type="button" onClick={onAbbrechen}>Abbrechen</button>
      </div>
    </form>
  );
}

export default RezeptFormular;
