import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import RezeptFormular from '../../../components/RezeptFormular';
import { useKochbuch } from '../../../KochbuchKontext';
import { stile } from '../../../stile';

export default function RezeptBearbeiten() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rezepte, speichern } = useKochbuch();
  const router = useRouter();
  const rezept = rezepte.find((eintrag) => eintrag.id === id);

  if (!rezept) return <View style={stile.seite} />;
  return <RezeptFormular rezept={rezept} onSpeichern={speichern} onAbbrechen={() => router.back()} />;
}
