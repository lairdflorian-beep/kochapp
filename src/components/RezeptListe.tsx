import React from 'react';
import RezeptKarte from './RezeptKarte';
import './RezeptListe.css';

const rezepte = [
  { id: 'omas-apfelkuchen', name: 'Omas Apfelkuchen', autor: 'Oma', dauerMinuten: 75 },
  { id: 'papas-gulasch', name: 'Papas Gulasch', autor: 'Papa', dauerMinuten: 90 },
  { id: 'kartoffelsuppe', name: 'Kartoffelsuppe', autor: 'Mama', dauerMinuten: 40 },
  { id: 'pfannkuchen', name: 'Pfannkuchen', autor: 'Lena', dauerMinuten: 20 },
  { id: 'gemuese-lasagne', name: 'Gemüse-Lasagne', autor: 'Opa', dauerMinuten: 60 },
];

function RezeptListe() {
  return (
    <ul className="rezept-liste" aria-label="Rezepte">
      {rezepte.map((rezept) => (
        <li key={rezept.id}>
          <RezeptKarte
            name={rezept.name}
            autor={rezept.autor}
            dauerMinuten={rezept.dauerMinuten}
          />
        </li>
      ))}
    </ul>
  );
}

export default RezeptListe;

