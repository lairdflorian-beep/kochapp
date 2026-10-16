import React, { useEffect, useRef, useState } from 'react';
import { Rezept } from '../data/rezepte';
import LoeschDialog from './LoeschDialog';
import './RezeptDetail.css';

interface RezeptDetailProps {
  rezept: Rezept;
  onZurueck: () => void;
  onBearbeiten: () => void;
  onLoeschen: () => boolean;
}

function RezeptDetail({ rezept, onZurueck, onBearbeiten, onLoeschen }: RezeptDetailProps) {
  const titel = useRef<HTMLHeadingElement>(null);
  const loeschButton = useRef<HTMLButtonElement>(null);
  const [loeschenOffen, setLoeschenOffen] = useState(false);

  useEffect(() => {
    titel.current?.focus();
  }, [rezept.id]);

  useEffect(() => {
    if (!loeschenOffen && document.activeElement === document.body) loeschButton.current?.focus();
  }, [loeschenOffen]);

  return (
    <article className="rezept-detail">
      <div inert={loeschenOffen}>
      <button className="rezept-zurueck" type="button" onClick={onZurueck}>
        <span aria-hidden="true">←</span> Zurück
      </button>

          <header>
            <h1 ref={titel} tabIndex={-1}>{rezept.name}</h1>
            <p className="rezept-detail-info">von {rezept.autor} · {rezept.dauerMinuten} Min.</p>
          </header>

          <div className="rezept-detail-bild">
            {rezept.foto ? <img src={rezept.foto} alt={rezept.name} /> : <svg aria-hidden="true" viewBox="0 0 345 160" preserveAspectRatio="none">
              <path d="M0 0L345 160M345 0L0 160" />
            </svg>}
          </div>

          <section aria-labelledby="zutaten-titel">
            <h2 id="zutaten-titel">Zutaten</h2>
            {rezept.zutaten.length > 0 ? (
              <ul>
                {rezept.zutaten.map((zutat, index) => <li key={index}>{zutat}</li>)}
              </ul>
            ) : <p>Noch keine Zutaten hinterlegt.</p>}
          </section>

          <section aria-labelledby="zubereitung-titel">
            <h2 id="zubereitung-titel">Zubereitung</h2>
            {rezept.zubereitung.length > 0 ? (
              <ol>
                {rezept.zubereitung.map((schritt, index) => <li key={index}>{schritt}</li>)}
              </ol>
            ) : <p>Noch keine Zubereitung hinterlegt.</p>}
          </section>

          <div className="rezept-aktionen">
            <button className="rezept-aktion" type="button" onClick={onBearbeiten}>
              Bearbeiten
            </button>
            <button className="rezept-aktion rezept-aktion--loeschen" type="button" ref={loeschButton}
              onClick={() => setLoeschenOffen(true)}>
              Löschen
            </button>
          </div>
      </div>
      {loeschenOffen && <LoeschDialog name={rezept.name} onAbbrechen={() => setLoeschenOffen(false)} onLoeschen={onLoeschen} />}
    </article>
  );
}

export default RezeptDetail;
