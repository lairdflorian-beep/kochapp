import { StyleSheet } from 'react-native';

// Gemeinsame Styles für mehrere Bildschirme (entspricht App.css der Web-App).
export const stile = StyleSheet.create({
  seite: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: '#252525',
  },
  label: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252525',
  },
  eingabe: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 6,
    fontSize: 18,
    color: '#252525',
    backgroundColor: 'white',
  },
  mehrzeilig: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  hinweis: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  fehler: {
    marginTop: 12,
    fontSize: 16,
    color: '#a32020',
  },
  aktionen: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
});
