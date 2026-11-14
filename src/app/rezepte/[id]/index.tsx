import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Knopf from '../../../components/Knopf';
import { useKochbuch } from '../../../KochbuchKontext';
import { stile } from '../../../stile';

// Detailseite eines Rezepts. [id] im Ordnernamen ist der Platzhalter für die
// Rezept-ID, z. B. /rezepte/omas-apfelkuchen.
export default function RezeptDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rezepte, loeschen } = useKochbuch();
  const router = useRouter();
  const rezept = rezepte.find((eintrag) => eintrag.id === id);

  // Direkt nach dem Löschen gibt es das Rezept nicht mehr: leere Seite zeigen.
  if (!rezept) return <View style={stile.seite} />;

  // Alert.alert zeigt den Bestätigungsdialog des Betriebssystems
  // und ersetzt die Komponente LoeschDialog der Web-App.
  const loeschenBestaetigen = () => {
    Alert.alert('Rezept löschen?', `Möchten Sie „${rezept.name}“ wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => loeschen(rezept.id) },
    ]);
  };

  return (
    <ScrollView style={stile.seite} contentContainerStyle={styles.inhalt}>
      <Text style={styles.titel}>{rezept.name}</Text>
      <Text style={styles.info}>von {rezept.autor} · {rezept.dauerMinuten} Min.</Text>

      {rezept.foto
        ? <Image style={styles.bild} source={{ uri: rezept.foto }} />
        : <View style={styles.bild} />}

      <Text style={styles.abschnitt}>Zutaten</Text>
      {rezept.zutaten.length > 0
        ? rezept.zutaten.map((zutat, index) => <Text key={index} style={styles.zeile}>• {zutat}</Text>)
        : <Text style={styles.leer}>Noch keine Zutaten hinterlegt.</Text>}

      <Text style={styles.abschnitt}>Zubereitung</Text>
      {rezept.zubereitung.length > 0
        ? rezept.zubereitung.map((schritt, index) => <Text key={index} style={styles.zeile}>{index + 1}. {schritt}</Text>)
        : <Text style={styles.leer}>Noch keine Zubereitung hinterlegt.</Text>}

      <View style={stile.aktionen}>
        <Knopf titel="Bearbeiten" onPress={() => router.push(`/rezepte/${rezept.id}/bearbeiten`)} />
        <Knopf titel="Löschen" loeschen onPress={loeschenBestaetigen} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inhalt: {
    paddingBottom: 60,
  },
  titel: {
    marginBottom: 8,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#252525',
  },
  info: {
    marginBottom: 28,
    fontSize: 16,
    color: '#666',
  },
  bild: {
    height: 160,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  abschnitt: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#252525',
  },
  zeile: {
    marginBottom: 6,
    fontSize: 18,
    color: '#252525',
  },
  leer: {
    fontSize: 18,
    color: '#666',
  },
});
