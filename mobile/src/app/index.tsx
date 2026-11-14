import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Knopf from '../components/Knopf';
import RezeptListe from '../components/RezeptListe';
import SuchButton from '../components/SuchButton';
import { useKochbuch } from '../KochbuchKontext';
import { stile } from '../stile';

// Startseite: Übersicht aller Rezepte.
export default function Start() {
  const { rezepte, benutzer, abmelden } = useKochbuch();
  const router = useRouter();

  return (
    <View style={stile.seite}>
      <View style={styles.kontoLeiste}>
        <Text style={styles.kontoText}>{benutzer.name}</Text>
        <Pressable onPress={abmelden}>
          <Text style={[styles.kontoText, styles.abmelden]}>Abmelden</Text>
        </Pressable>
      </View>

      <View style={styles.startAktionen}>
        <SuchButton onSuchen={() => router.push('/suche')} />
        <Knopf titel="Neues Rezept" onPress={() => router.push('/rezepte/neu')} />
      </View>

      {rezepte.length > 0
        ? <RezeptListe rezepte={rezepte} onAuswaehlen={(id) => router.push(`/rezepte/${id}`)} />
        : <Text style={[stile.text, styles.leer]}>Keine Rezepte vorhanden. Lege das erste Familienrezept an.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  kontoLeiste: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  kontoText: {
    fontSize: 14,
    color: '#252525',
  },
  abmelden: {
    paddingVertical: 8,
    textDecorationLine: 'underline',
  },
  startAktionen: {
    flexDirection: 'row',
    gap: 12,
  },
  leer: {
    marginTop: 24,
  },
});
