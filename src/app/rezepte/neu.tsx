import { useRouter } from 'expo-router';
import RezeptFormular from '../../components/RezeptFormular';
import { useKochbuch } from '../../KochbuchKontext';

export default function NeuesRezept() {
  const { benutzer, speichern } = useKochbuch();
  const router = useRouter();

  return (
    <RezeptFormular neu
      rezept={{ id: '', name: '', autor: benutzer.name, dauerMinuten: 0, zutaten: [], zubereitung: [] }}
      onSpeichern={speichern} onAbbrechen={() => router.back()} />
  );
}
