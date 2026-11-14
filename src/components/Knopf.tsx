import { Pressable, StyleSheet, Text } from 'react-native';

interface KnopfProps {
  titel: string;
  onPress: () => void;
  loeschen?: boolean;
}

// Entspricht <button className="rezept-aktion"> aus der Web-App.
function Knopf({ titel, onPress, loeschen = false }: KnopfProps) {
  return (
    <Pressable style={[styles.knopf, loeschen && styles.knopfLoeschen]} onPress={onPress}>
      <Text style={[styles.text, loeschen && styles.textLoeschen]}>{titel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  knopf: {
    flex: 1,
    minHeight: 56,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  knopfLoeschen: {
    borderColor: '#a32020',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#252525',
    textAlign: 'center',
  },
  textLoeschen: {
    color: '#a32020',
  },
});

export default Knopf;
