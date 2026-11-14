import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Knopf from '../components/Knopf';
import RezeptListe from '../components/RezeptListe';
import { useKochbuch } from '../KochbuchKontext';
import { stile } from '../stile';

// Suche nach Name, Autor oder Zutaten.
export default function RezeptSuche() {
  const { rezepte } = useKochbuch();
  const router = useRouter();
  const [eingabe, setEingabe] = useState('');
  // null bedeutet: Es wurde noch nicht gesucht.
  const [suchbegriff, setSuchbegriff] = useState<string | null>(null);

  const normalisieren = (text: string) => text.toLocaleLowerCase('de').normalize('NFC');
  const woerter = normalisieren(suchbegriff ?? '').trim().split(/\s+/).filter(Boolean);
  const treffer = rezepte.filter((rezept) => {
    const text = normalisieren([rezept.name, rezept.autor, ...rezept.zutaten].join(' '));
    return woerter.every((wort) => text.includes(wort));
  });

  function suchen() {
    setSuchbegriff(eingabe.trim());
  }

  return (
    <View style={stile.seite}>
      <Text style={[stile.label, styles.erstesLabel]}>Suchbegriff</Text>
      <TextInput style={stile.eingabe} placeholder="Rezept, Zutat oder Autor" value={eingabe}
        onChangeText={setEingabe} returnKeyType="search" onSubmitEditing={suchen} autoFocus />
      <View style={styles.suchen}>
        <Knopf titel="Suchen" onPress={suchen} />
      </View>

      {suchbegriff !== null ? (
        <>
          <Text style={styles.suchergebnis}>
            {treffer.length} Treffer{suchbegriff ? ` für „${suchbegriff}“` : ' – alle Rezepte'}
          </Text>
          {treffer.length > 0
            ? <RezeptListe rezepte={treffer} onAuswaehlen={(id) => router.push(`/rezepte/${id}`)} />
            : <Text style={stile.text}>Keine passenden Rezepte gefunden. Versuche einen anderen Suchbegriff.</Text>}
        </>
      ) : <Text style={stile.hinweis}>Suche nach einem Rezept, einer Zutat oder einem Familienmitglied.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  erstesLabel: {
    marginTop: 0,
  },
  suchen: {
    flexDirection: 'row',
    marginTop: 16,
  },
  suchergebnis: {
    marginTop: 28,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252525',
  },
});
