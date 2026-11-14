import { Pressable, StyleSheet, Text } from 'react-native';

interface SuchButtonProps {
  onSuchen: () => void;
}

function SuchButton({ onSuchen }: SuchButtonProps) {
  return (
    <Pressable style={styles.suche} onPress={onSuchen}>
      <Text style={styles.text}>Rezept suchen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  suche: {
    flex: 1,
    minHeight: 56,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#424242',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default SuchButton;
