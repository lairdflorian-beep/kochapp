import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Anmeldung from '../components/Anmeldung';
import { Benutzer } from '../data/anmeldung';
import { Rezept } from '../data/rezepte';
import { ladeRezepte, speichereRezepte } from '../data/speicher';
import { KochbuchKontext } from '../KochbuchKontext';

// Entspricht App.tsx der Web-App: Hier liegen der State und die Funktionen
// zum Ändern der Rezepte. Die einzelnen Seiten stehen als Dateien im Ordner app/.
export default function RootLayout() {
  const [rezepte, setRezepte] = useState<Rezept[]>([]);
  const [geladen, setGeladen] = useState(false);
  const [benutzer, setBenutzer] = useState<Benutzer | null>(null);
  const router = useRouter();

  // Gespeicherte Rezepte einmalig beim Start der App laden.
  useEffect(() => {
    ladeRezepte().then((gespeicherteRezepte) => {
      setRezepte(gespeicherteRezepte);
      setGeladen(true);
    });
  }, []);

  async function aktualisieren(neueRezepte: Rezept[]): Promise<boolean> {
    if (!(await speichereRezepte(neueRezepte))) {
      Alert.alert('Fehler', 'Änderungen konnten nicht gespeichert werden.');
      return false;
    }
    setRezepte(neueRezepte);
    return true;
  }

  async function speichern(rezept: Rezept) {
    if (!benutzer) return;
    const neu = !rezept.id;
    const gespeichert: Rezept = {
      ...rezept,
      id: neu ? `rezept-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` : rezept.id,
      autor: neu ? benutzer.name : rezept.autor,
    };
    const neueRezepte = neu ? [...rezepte, gespeichert] : rezepte.map((bisher) =>
      bisher.id === gespeichert.id ? gespeichert : bisher);
    if (await aktualisieren(neueRezepte)) {
      // Neues Rezept: Formular durch die Detailseite ersetzen. Sonst zurück zur Detailseite.
      if (neu) router.replace(`/rezepte/${gespeichert.id}`);
      else router.back();
    }
  }

  async function loeschen(id: string) {
    if (await aktualisieren(rezepte.filter((rezept) => rezept.id !== id))) {
      router.back();
    }
  }

  if (!geladen) return null;
  if (!benutzer) return <Anmeldung onAnmelden={setBenutzer} />;

  return (
    <KochbuchKontext value={{ rezepte, benutzer, speichern, loeschen, abmelden: () => setBenutzer(null) }}>
      <Stack screenOptions={{ headerBackTitle: 'Zurück' }}>
        <Stack.Screen name="index" options={{ title: 'Familienkochbuch' }} />
        <Stack.Screen name="suche" options={{ title: 'Rezept suchen' }} />
        <Stack.Screen name="rezepte/neu" options={{ title: 'Neues Rezept' }} />
        <Stack.Screen name="rezepte/[id]/index" options={{ title: 'Rezept' }} />
        <Stack.Screen name="rezepte/[id]/bearbeiten" options={{ title: 'Rezept bearbeiten' }} />
      </Stack>
    </KochbuchKontext>
  );
}
