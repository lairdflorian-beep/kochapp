import React, { useEffect, useRef, useState } from 'react';
import { ladeRezept } from '../api';
import type { Rezept } from '../api';
import './RezeptDetail.css';

interface RezeptDetailProps {
  id: string;
  onZurueck: () => void;
}

function RezeptDetail({ id, onZurueck }: RezeptDetailProps) {
  const [rezept, setRezept] = useState<Rezept | null>(null);
  const [fehler, setFehler] = useState('');
  const titel = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let aktiv = true;
    ladeRezept(id)
      .then((daten) => {
        if (aktiv) setRezept(daten);
      })
      .catch(() => {
        if (aktiv) setFehler('Das Rezept konnte nicht geladen werden.');
      });
    return () => {
      aktiv = false;
    };
  }, [id]);

  useEffect(() => {
    titel.current?.focus();
  }, [rezept]);

  return (
    <article className="rezept-detail">
      <button className="rezept-zurueck" type="button" onClick={onZurueck}>
        <span aria-hidden="true">←</span> Zurück
      </button>

      {fehler && <p className="status status-fehler" role="alert">{fehler}</p>}
      {!rezept && !fehler && <p className="status">Rezept wird geladen …</p>}

      {rezept && (
        <>
          <header>
            <h1 ref={titel} tabIndex={-1}>{rezept.name}</h1>
            <p className="rezept-detail-info">von {rezept.autor} · {rezept.dauerMinuten} Min.</p>
          </header>

          <div className="rezept-detail-bild" aria-hidden="true">
            <svg viewBox="0 0 345 160" preserveAspectRatio="none">
              <path d="M0 0L345 160M345 0L0 160" />
            </svg>
          </div>
        </>
      )}
    </article>
  );
}

export default RezeptDetail;
