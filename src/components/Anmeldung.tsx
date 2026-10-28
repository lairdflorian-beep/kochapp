import React, { FormEvent, useRef, useState } from 'react';
import './SuchButton.css';
import './Anmeldung.css';

function Anmeldung() {
  const dialog = useRef<HTMLDialogElement>(null);
  const anfrage = useRef(0);
  const [benutzer, setBenutzer] = useState('');
  const [fehler, setFehler] = useState('');
  const [laedt, setLaedt] = useState(false);

  function schliessen() {
    anfrage.current++;
    dialog.current?.close();
    dialog.current?.querySelector('form')?.reset();
    setFehler('');
    setLaedt(false);
  }

  async function anmelden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (laedt) return;
    const daten = new FormData(event.currentTarget);
    const id = ++anfrage.current;
    setFehler('');
    setLaedt(true);

    try {
      const zugangsdaten = encodeURIComponent(
        String(daten.get('username')).trim() + ':' + daten.get('password')
      ).replace(/%([0-9A-F]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
      const antwort = await fetch('/login', {
        method: 'POST',
        credentials: 'omit',
        headers: { Authorization: 'Basic ' + btoa(zugangsdaten) },
      });
      const ergebnis = await antwort.json();
      if (id !== anfrage.current) return;

      if (antwort.ok && typeof ergebnis.username === 'string' && ergebnis.username) {
        setBenutzer(ergebnis.username);
        schliessen();
      } else {
        setFehler(antwort.status === 401 ? 'Benutzername oder Passwort ist falsch.' : 'Anmeldung fehlgeschlagen.');
      }
    } catch {
      if (id === anfrage.current) setFehler('Die Anmeldung ist gerade nicht möglich. Bitte versuche es erneut.');
    } finally {
      if (id === anfrage.current) setLaedt(false);
    }
  }

  return (
    <section className="anmeldung" aria-label="Anmeldung">
      {benutzer ? <p role="status">Hallo, {benutzer}!</p> : (
        <button className="suche" type="button" onClick={() => dialog.current?.showModal()}>Anmelden</button>
      )}
      <dialog ref={dialog} aria-labelledby="anmeldung-titel" aria-describedby="anmeldung-hinweis"
        onCancel={(event) => { event.preventDefault(); schliessen(); }}>
        <h2 id="anmeldung-titel">Anmelden</h2>
        <p id="anmeldung-hinweis">
          Beispiel-Zugangsdaten:<br />
          Benutzername: <code>max.mustermann</code><br />
          Passwort: <code>test1234</code>
        </p>
        <form onSubmit={anmelden} aria-busy={laedt}>
          <label>Benutzername
            <input name="username" autoComplete="username" required disabled={laedt} />
          </label>
          <label>Passwort
            <input name="password" type="password" autoComplete="current-password" required disabled={laedt} />
          </label>
          <button className="suche" type="submit" disabled={laedt}>{laedt ? 'Bitte warten …' : 'Anmelden'}</button>
          {fehler && <p role="alert">{fehler}</p>}
        </form>
        <button className="suche" type="button" onClick={schliessen}>Schließen</button>
      </dialog>
    </section>
  );
}

export default Anmeldung;
