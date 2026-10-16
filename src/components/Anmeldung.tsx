import React, { useEffect, useRef, useState } from 'react';
import { Benutzer, DEMO_BENUTZER, DEMO_EMAIL, DEMO_PASSWORT } from '../data/anmeldung';

interface AnmeldungProps {
  onAnmelden: (benutzer: Benutzer) => void;
}

function Anmeldung({ onAnmelden }: AnmeldungProps) {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState(false);
  const emailFeld = useRef<HTMLInputElement>(null);
  useEffect(() => { emailFeld.current?.focus(); }, []);

  function anmelden(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== DEMO_EMAIL || passwort !== DEMO_PASSWORT) {
      setFehler(true);
      return;
    }
    onAnmelden(DEMO_BENUTZER);
  }

  return (
    <section className="rezept-detail anmeldeseite">
      <h1>Familienkochbuch</h1>
      {fehler && <p className="anmelde-fehler" id="anmelde-fehler" role="alert">
        E-Mail oder Passwort ist falsch. Bitte versuchen Sie es erneut.
      </p>}
      <form className="rezept-formular" onSubmit={anmelden}>
        <label htmlFor="email">E-Mail</label>
        <input id="email" ref={emailFeld} type="email" autoComplete="username" required
          placeholder="name@beispiel.de" value={email} onChange={(event) => setEmail(event.target.value)}
          aria-invalid={fehler} aria-describedby={fehler ? 'anmelde-fehler' : undefined} />
        <label htmlFor="passwort">Passwort</label>
        <input id="passwort" type="password" autoComplete="current-password" required
          placeholder="Passwort eingeben" value={passwort} onChange={(event) => setPasswort(event.target.value)}
          aria-invalid={fehler} aria-describedby={fehler ? 'anmelde-fehler' : undefined} />
        <button className="rezept-aktion formular-absenden" type="submit">Anmelden</button>
      </form>
      <aside className="demo-hinweis">
        <strong>Testzugang: {DEMO_BENUTZER.name}</strong>
        <p>E-Mail: {DEMO_EMAIL}<br />Passwort: {DEMO_PASSWORT}</p>
      </aside>
    </section>
  );
}

export default Anmeldung;


