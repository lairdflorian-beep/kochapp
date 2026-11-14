// Ausschließlich ein öffentlicher Demo-Zugang, keine sichere Authentifizierung.
export const DEMO_EMAIL = 'familie@beispiel.de';
export const DEMO_PASSWORT = 'Familienkochbuch123!';

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
