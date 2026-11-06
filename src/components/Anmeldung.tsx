import React, { FormEvent, useState } from 'react';
import './RezeptFormular.css';

interface AnmeldungProps {
  benutzer: string | null;
  onAnmelden: (benutzer: string, passwort: string) => Promise<void>;
  onAbmelden: () => void;
}

function Anmeldung({ benutzer, onAnmelden, onAbmelden }: AnmeldungProps) {
  const [name, setName] = useState('');
  const [passwort, setPasswort] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState('');

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLaeuft(true);
    setFehler('');
    try {
      await onAnmelden(name.trim(), passwort);
      setName('');
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Die Anmeldung ist fehlgeschlagen.');
    } finally {
      setPasswort('');
      setLaeuft(false);
    }
  }

  if (benutzer) {
    return (
      <section className="rezept-formular anmeldung" aria-label="Anmeldung">
        <p className="anmeldung-status" role="status">Angemeldet als {benutzer}</p>
        <button type="button" onClick={onAbmelden}>Abmelden</button>
      </section>
    );
  }

  return (
    <form className="rezept-formular anmeldung" aria-label="Anmeldung" onSubmit={absenden}>
      <h2>Anmelden</h2>
      <div className="anmeldung-hinweis">
        <p>Beispiel-Zugangsdaten:</p>
        <ul>
          <li>Benutzername: <strong>max.mustermann</strong></li>
          <li>Passwort: <strong>test1234</strong></li>
        </ul>
      </div>
      <label>
        Benutzername
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required />
      </label>
      <label>
        Passwort
        <input
          type="password"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {fehler && <p className="rezept-formular-fehler" role="alert">{fehler}</p>}
      <button type="submit" disabled={laeuft}>{laeuft ? 'Wird angemeldet …' : 'Anmelden'}</button>
    </form>
  );
}

export default Anmeldung;
