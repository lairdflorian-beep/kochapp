import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Benutzer, DEMO_BENUTZER, DEMO_EMAIL, DEMO_PASSWORT } from '../data/anmeldung';
import { stile } from '../stile';
import Knopf from './Knopf';
import Ueberschrift from './Ueberschrift';

interface AnmeldungProps {
  onAnmelden: (benutzer: Benutzer) => void;
}

function Anmeldung({ onAnmelden }: AnmeldungProps) {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState(false);

  function anmelden() {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || passwort !== DEMO_PASSWORT) {
      setFehler(true);
      return;
    }
    onAnmelden(DEMO_BENUTZER);
  }

  return (
    <SafeAreaView style={stile.seite}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Ueberschrift inhalt="Familienkochbuch" />
        {fehler && <Text style={styles.anmeldeFehler}>
          E-Mail oder Passwort ist falsch. Bitte versuchen Sie es erneut.
        </Text>}

        <Text style={stile.label}>E-Mail</Text>
        <TextInput style={stile.eingabe} placeholder="name@beispiel.de" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />

        <Text style={stile.label}>Passwort</Text>
        <TextInput style={stile.eingabe} placeholder="Passwort eingeben" value={passwort} onChangeText={setPasswort}
          secureTextEntry onSubmitEditing={anmelden} />

        <View style={stile.aktionen}>
          <Knopf titel="Anmelden" onPress={anmelden} />
        </View>

        <View style={styles.demoHinweis}>
          <Text style={styles.demoTitel}>Testzugang: {DEMO_BENUTZER.name}</Text>
          <Text style={styles.demoText}>E-Mail: {DEMO_EMAIL}</Text>
          <Text style={styles.demoText}>Passwort: {DEMO_PASSWORT}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  anmeldeFehler: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#a32020',
    borderRadius: 8,
    fontSize: 16,
    color: '#8b1b1b',
    backgroundColor: '#fff5f5',
  },
  demoHinweis: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  demoTitel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#252525',
  },
  demoText: {
    fontSize: 14,
    color: '#252525',
  },
});

export default Anmeldung;
