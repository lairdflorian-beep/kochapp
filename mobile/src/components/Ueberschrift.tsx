import { StyleSheet, Text } from 'react-native';

interface UeberschriftProps {
  inhalt: string;
}

function Ueberschrift({ inhalt }: UeberschriftProps) {
  return <Text style={styles.ueberschrift}>{inhalt}</Text>;
}

const styles = StyleSheet.create({
  ueberschrift: {
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#252525',
  },
});

export default Ueberschrift;
