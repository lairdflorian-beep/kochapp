import React, { useEffect, useRef } from 'react';

interface LoeschDialogProps {
  name: string;
  onAbbrechen: () => void;
  onLoeschen: () => boolean;
}

function LoeschDialog({ name, onAbbrechen, onLoeschen }: LoeschDialogProps) {
  const abbrechen = useRef<HTMLButtonElement>(null);
  const loeschen = useRef<HTMLButtonElement>(null);
  const [fehler, setFehler] = React.useState('');

  useEffect(() => {
    const vorherigerFokus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    abbrechen.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      vorherigerFokus?.focus();
    };
  }, []);

  function tastatur(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onAbbrechen();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      if (document.activeElement === abbrechen.current) loeschen.current?.focus();
      else abbrechen.current?.focus();
    }
  }

  return (
    <div className="dialog-hintergrund" onClick={(event) => {
      if (event.target === event.currentTarget) onAbbrechen();
    }}>
      <div className="loeschdialog" role="alertdialog" aria-modal="true"
        aria-labelledby="loeschen-titel" aria-describedby="loeschen-text" onKeyDown={tastatur}>
        <h2 id="loeschen-titel">Rezept löschen?</h2>
        <p id="loeschen-text">Möchten Sie „{name}“ wirklich löschen? Das Rezept wird für die ganze Familie entfernt.</p>
        <p className="rezept-hinweis">In dieser lokalen Version wird es nur in diesem Browser gelöscht.</p>
        {fehler && <p className="rezept-fehler" role="alert">{fehler}</p>}
        <div className="rezept-aktionen">
          <button className="rezept-aktion" type="button" ref={abbrechen} onClick={onAbbrechen}>Abbrechen</button>
          <button className="rezept-aktion rezept-aktion--loeschen" type="button" ref={loeschen} onClick={() => {
            if (!onLoeschen()) setFehler('Löschen konnte nicht gespeichert werden. Bitte den Browserspeicher prüfen.');
          }}>Löschen</button>
        </div>
      </div>
    </div>
  );
}

export default LoeschDialog;
