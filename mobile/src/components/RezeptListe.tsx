import { FlatList, StyleSheet } from 'react-native';
import { Rezept } from '../data/rezepte';
import RezeptKarte from './RezeptKarte';

interface RezeptListeProps {
  rezepte: Rezept[];
  onAuswaehlen: (id: string) => void;
}

// FlatList ersetzt <ul> mit rezepte.map(...): Sie ist scrollbar und
// rendert nur die Einträge, die gerade sichtbar sind.
function RezeptListe({ rezepte, onAuswaehlen }: RezeptListeProps) {
  return (
    <FlatList
      style={styles.liste}
      data={rezepte}
      keyExtractor={(rezept) => rezept.id}
      renderItem={({ item: rezept }) => (
        <RezeptKarte
          name={rezept.name}
          autor={rezept.autor}
          dauerMinuten={rezept.dauerMinuten}
          foto={rezept.foto}
          onAuswaehlen={() => onAuswaehlen(rezept.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  liste: {
    flex: 1,
    marginTop: 24,
  },
});

export default RezeptListe;
