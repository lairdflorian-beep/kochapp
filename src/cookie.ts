const NAME = 'zugang';
const GUELTIGKEIT_SEKUNDEN = 60 * 60; // 1 Stunde

export function speichereZugang(zugang: string): void {
  const cookie = `${NAME}=${encodeURIComponent(zugang)}; max-age=${GUELTIGKEIT_SEKUNDEN}`;
  document.cookie = `${cookie}; path=/; SameSite=Strict`;
}

export function leseZugang(): string | null {
  const eintrag = document.cookie.split('; ').find((c) => c.startsWith(`${NAME}=`));
  return eintrag ? decodeURIComponent(eintrag.slice(NAME.length + 1)) : null;
}

export function loescheZugang(): void {
  document.cookie = `${NAME}=; max-age=0; path=/`;
}

// Liest den Benutzernamen aus dem gespeicherten Header „Basic …“,
// damit die Oberfläche nach dem Neuladen „Angemeldet als …“ anzeigen kann.
export function benutzerAusZugang(zugang: string): string | null {
  try {
    const binaer = atob(zugang.replace(/^Basic /, ''));
    const text = decodeURIComponent(
      Array.from(binaer, (zeichen) => '%' + zeichen.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    const trenner = text.indexOf(':');
    return trenner > 0 ? text.slice(0, trenner) : null;
  } catch {
    return null;
  }
}
