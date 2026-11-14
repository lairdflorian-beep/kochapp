# Familienkochbuch – mobile App

React-Native-Version des Familienkochbuchs, erstellt mit [Expo](https://expo.dev) (`npx create-expo-app@latest`).
Die Web-App im übergeordneten Ordner bleibt unverändert.

## Start

```bash
npm install
npx expo start
```

Danach den QR-Code mit der App **Expo Go** scannen (Android: in Expo Go, iOS: mit der Kamera-App).
Smartphone und Rechner müssen im selben WLAN sein. Klappt die Verbindung nicht (z. B. im Hochschulnetz),
hilft `npx expo start --tunnel`.

Demo-Anmeldung: `familie@beispiel.de` / `Familienkochbuch123!`

## Aufbau

| Web-App | Mobile App |
| --- | --- |
| `src/App.tsx` (State, Seitenwechsel) | `src/app/_layout.tsx` (State, Stack-Navigation) |
| `#/` | `src/app/index.tsx` |
| `#/suche` | `src/app/suche.tsx` |
| `#/rezepte/neu` | `src/app/rezepte/neu.tsx` |
| `#/rezepte/{id}` | `src/app/rezepte/[id]/index.tsx` |
| `#/rezepte/{id}/bearbeiten` | `src/app/rezepte/[id]/bearbeiten.tsx` |
| `src/components/*.tsx` + CSS | `src/components/*.tsx` mit `StyleSheet` |
| `localStorage` | `AsyncStorage` (`src/data/speicher.ts`) |
| `<input type="file">` | `expo-image-picker` |
| `LoeschDialog` | `Alert.alert` |

Die Seiten erhalten Rezepte und Funktionen nicht als Props, sondern über `useKochbuch()` aus `src/KochbuchKontext.ts`.

## Prüfung

```bash
npx tsc --noEmit
```
