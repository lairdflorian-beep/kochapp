import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Constants } from '../Constants';
import { Rezept } from '../Rezept';
import './RezeptDetail.css';

function RezeptDetail() {
  const { id } = useParams();
  const [rezept, setRezept] = useState<Rezept | null>(null);

  useEffect(() => {
    setRezept(null);
    fetch(`/rezepte/${id}`)
      .then((antwort) => (antwort.ok ? antwort.json() : null))
      .then((daten: Rezept | null) => setRezept(daten))
      .catch(() => setRezept(null));
  }, [id]);

  return (
    <>
      {rezept && (
        <section className="rezept-detail" aria-label="Rezeptdetails">
          <h2>{rezept.name}</h2>
          <p>ID: {rezept.id}</p>
          <p>Autor: {rezept.autor}</p>
          <p>Dauer: {Constants.formatiereDauer(rezept.dauerMinuten)}</p>
        </section>
      )}
      <Link className="rezept-zurueck" to="/">
        Zurück zur Übersicht
      </Link>
    </>
  );
}

export default RezeptDetail;
