import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Rezept } from '../data/rezepte';
import { stile } from '../stile';
import Knopf from './Knopf';

interface RezeptFormularProps {
  rezept: Rezept;
  neu?: boolean;
  onSpeichern: (rezept: Rezept) => void;
  onAbbrechen: () => void;
}

function RezeptFormular({ rezept, neu = false, onSpeichern, onAbbrechen }: RezeptFormularProps) {
  const [name, setName] = useState(rezept.name);
  const [dauer, setDauer] = useState(neu ? '' : String(rezept.dauerMinuten));
  const [zutaten, setZutaten] = useState(rezept.zutaten.join('\n'));
  const [zubereitung, setZubereitung] = useState(rezept.zubereitung.join('\n'));
  const [foto, setFoto] = useState(rezept.foto);
  const [fehler, setFehler] = useState('');

  // Ersetzt <input type="file">: öffnet die Foto-Galerie des Smartphones.
  async function fotoAuswaehlen() {
    const ergebnis = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (ergebnis.canceled) return;
    try {
      // Das ausgewählte Foto liegt nur in einem Zwischenspeicher. Damit es
      // dauerhaft erhalten bleibt, wird es in den Ordner der App kopiert.
      const auswahl = new File(ergebnis.assets[0].uri);
      const kopie = new File(Paths.document, `foto-${Date.now()}${auswahl.extension}`);
      await auswahl.copy(kopie);
      setFoto(kopie.uri);
    } catch {
      setFehler('Das Foto konnte nicht gelesen werden. Bitte erneut versuchen.');
    }
  }

  function speichern() {
    const dauerMinuten = Number(dauer);
    if (!name.trim() || !dauer.trim() ||
        !Number.isSafeInteger(dauerMinuten) || dauerMinuten <= 0) {
      setFehler('Bitte Rezeptname und eine gültige Zubereitungszeit in ganzen Minuten eingeben.');
      return;
    }

    const zeilen = (text: string) => text.split(/\r?\n/).map((zeile) => zeile.trim()).filter(Boolean);
    if (!zeilen(zutaten).length || !zeilen(zubereitung).length) {
      setFehler('Bitte mindestens eine Zutat und einen Zubereitungsschritt eingeben.');
      return;
    }
    setFehler('');
    onSpeichern({
      ...rezept,
      name: name.trim(),
      dauerMinuten,
      zutaten: zeilen(zutaten),
      zubereitung: zeilen(zubereitung),
      foto,
    });
  }

  return (
    <ScrollView style={stile.seite} contentContainerStyle={styles.inhalt} keyboardShouldPersistTaps="handled">
      <Text style={[stile.label, styles.erstesLabel]}>Rezeptname</Text>
      <TextInput style={stile.eingabe} placeholder="z. B. Omas Apfelkuchen" value={name} onChangeText={setName} />

      <Text style={stile.label}>Zubereitungszeit (Minuten)</Text>
      <TextInput style={stile.eingabe} placeholder="z. B. 75" value={dauer} onChangeText={setDauer}
        keyboardType="number-pad" />

      <Text style={stile.label}>Zutaten (eine pro Zeile)</Text>
      <TextInput style={[stile.eingabe, stile.mehrzeilig]} placeholder="Eine Zutat pro Zeile" value={zutaten}
        onChangeText={setZutaten} multiline />

      <Text style={stile.label}>Zubereitung (ein Schritt pro Zeile)</Text>
      <TextInput style={[stile.eingabe, stile.mehrzeilig]} placeholder="Ein Schritt pro Zeile" value={zubereitung}
        onChangeText={setZubereitung} multiline />

      {foto && <Image style={styles.fotoVorschau} source={{ uri: foto }} />}
      <View style={stile.aktionen}>
        <Knopf titel={foto ? 'Foto ändern' : 'Foto hinzufügen'} onPress={fotoAuswaehlen} />
      </View>
      {foto && <Pressable style={styles.textButton} onPress={() => setFoto(undefined)}>
        <Text style={styles.textButtonText}>Foto entfernen</Text>
      </Pressable>}

      {fehler !== '' && <Text style={stile.fehler}>{fehler}</Text>}
      <View style={stile.aktionen}>
        <Knopf titel="Speichern" onPress={speichern} />
        <Knopf titel="Abbrechen" onPress={onAbbrechen} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inhalt: {
    paddingBottom: 60,
  },
  erstesLabel: {
    marginTop: 0,
  },
  fotoVorschau: {
    height: 160,
    marginTop: 24,
    borderRadius: 12,
  },
  textButton: {
    padding: 12,
    alignItems: 'center',
  },
  textButtonText: {
    fontSize: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
});

export default RezeptFormular;
