// Ausschließlich ein öffentlicher Demo-Zugang, keine sichere Authentifizierung.
export const DEMO_EMAIL = 'familie@beispiel.de';
export const DEMO_PASSWORT = 'Familienkochbuch123!';
export const SITZUNG_SCHLUESSEL = 'familienkochbuch.demo-sitzung';

export interface Benutzer {
  id: string;
  name: string;
  email: string;
}

export const DEMO_BENUTZER: Benutzer = {
  id: 'juergen',
  name: 'Jürgen',
  email: DEMO_EMAIL,
};

export function ladeAnmeldung(): Benutzer | null {
  try {
    return window.sessionStorage.getItem(SITZUNG_SCHLUESSEL) === DEMO_BENUTZER.id ? DEMO_BENUTZER : null;
  } catch {
    return null;
  }
}

export function speichereAnmeldung(benutzer: Benutzer | null) {
  try {
    if (benutzer) window.sessionStorage.setItem(SITZUNG_SCHLUESSEL, benutzer.id);
    else window.sessionStorage.removeItem(SITZUNG_SCHLUESSEL);
  } catch {
    // Ohne Session-Speicher bleibt die Anmeldung nur bis zum Neuladen erhalten.
  }
}

