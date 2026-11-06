import React, { FormEvent, useState } from 'react';
import type { NeuesRezept } from '../api';
import './RezeptFormular.css';

interface RezeptFormularProps {
  onSpeichern: (rezept: NeuesRezept) => Promise<void>;
}

function RezeptFormular({ onSpeichern }: RezeptFormularProps) {
  const [name, setName] = useState('');
  const [autor, setAutor] = useState('');
  const [dauerMinuten, setDauerMinuten] = useState('');
  const [speichert, setSpeichert] = useState(false);
  const [fehler, setFehler] = useState('');

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSpeichert(true);
    setFehler('');
    try {
      await onSpeichern({ name, autor, dauerMinuten: Number(dauerMinuten) });
      setName('');
      setAutor('');
      setDauerMinuten('');
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Das Rezept konnte nicht gespeichert werden.');
    } finally {
      setSpeichert(false);
    }
  }

  return (
    <form className="rezept-formular" aria-label="Neues Rezept" onSubmit={absenden}>
      <h2>Neues Rezept</h2>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Autor
        <input value={autor} onChange={(e) => setAutor(e.target.value)} required />
      </label>
      <label>
        Dauer in Minuten
        <input
          type="number"
          min="1"
          value={dauerMinuten}
          onChange={(e) => setDauerMinuten(e.target.value)}
          required
        />
      </label>
      {fehler && <p className="rezept-formular-fehler" role="alert">{fehler}</p>}
      <button type="submit" disabled={speichert}>
        {speichert ? 'Wird gespeichert …' : 'Rezept speichern'}
      </button>
    </form>
  );
}

export default RezeptFormular;
