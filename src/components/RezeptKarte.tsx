import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface RezeptKarteProps {
  name: string;
  autor: string;
  dauerMinuten: number;
  foto?: string;
  onAuswaehlen?: () => void;
}

function RezeptKarte({ name, autor, dauerMinuten, foto, onAuswaehlen }: RezeptKarteProps) {
  return (
    <Pressable style={styles.karte} onPress={onAuswaehlen}>
      {foto ? <Image style={styles.bild} source={{ uri: foto }} /> : <View style={styles.bild} />}
      <View style={styles.text}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>von {autor} · {dauerMinuten} Min.</Text>
      </View>
      <Text style={styles.pfeil}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  karte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  bild: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  text: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#252525',
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
  pfeil: {
    fontSize: 28,
    color: '#252525',
  },
});

export default RezeptKarte;
