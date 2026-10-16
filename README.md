# Familienkochbuch

React-/TypeScript-Anwendung nach den acht Ansichten aus **Kochrezepte-APP mit allen Seiten.pdf**.

## Start und Prüfung

- `npm install` – Abhängigkeiten installieren
- `npm start` – Entwicklungsserver starten

## Seiten und Funktionen

| PDF | Ansicht | Adresse / Funktion |
| --- | --- | --- |
| 1 | Familienkochbuch | Übersicht, Anmeldung, Suche, neues Rezept |
| 2 | Rezept suchen | `#/suche`, Suche nach Name, Autor oder Zutaten; Trefferzahl und Leerzustand |
| 3 | Rezeptdetails | `#/rezepte/{id}`, Zutaten, Schritte und optionales Foto |
| 4 | Neues Rezept | `#/rezepte/neu`, Pflichtfelder, Fotoauswahl und Speichern |
| 5 | Rezept bearbeiten | `#/rezepte/{id}/bearbeiten`, vorbelegte Felder, Foto ändern/entfernen, Abbrechen |
| 6 | Rezept löschen | Bestätigungsdialog mit Abbrechen, Escape und Tastatur-Fokusführung |
| 7–8 | Anmeldung | `#/anmelden`, Demo-Anmeldung, Fehleranzeige und Abmeldung |

Die Suche ist unabhängig von Groß-/Kleinschreibung. Mehrere Suchwörter müssen alle vorkommen; eine leere Suche zeigt alle Rezepte. Der Suchbegriff steht in der URL und bleibt beim Wechsel zwischen Ergebnisliste, Detail und Bearbeitung erhalten. Browser-Zurück/-Vorwärts und direkte Seitenlinks werden unterstützt.

Neue Rezepte erhalten automatisch den angemeldeten Benutzer als Autor. 

## Demo-Anmeldung – keine echte Authentifizierung

- **Testbenutzer:** Jürgen
- **E-Mail:** `familie@beispiel.de`
- **Passwort:** `Familienkochbuch123!`

Alle App-Funktionen sind erst nach erfolgreicher Anmeldung verfügbar: Übersicht, Suche, Rezeptdetails, Anlegen, Bearbeiten, Fotos und Löschen. Auch direkte Seitenlinks und die Browsernavigation umgehen die vorgeschaltete Anmeldung nicht. Nach erfolgreicher Anmeldung wird die angeforderte Seite geöffnet; nach Abmeldung sind die Funktionen wieder gesperrt. Auf der Startseite wird der Benutzername nur einmal angezeigt, ohne zusätzliche Anmelde-Erfolgsmeldung.

## Lokale Speicherung

Rezepte und Fotos liegen unter `familienkochbuch.rezepte.v1` in `localStorage` und bleiben beim Neuladen erhalten. Es gibt keine Synchronisierung mit anderen Geräten oder Familienmitgliedern. Auch Löschen wirkt nur im aktuellen Browser. Beim Löschen der Website-Daten gehen die lokal gespeicherten Rezepte verloren.