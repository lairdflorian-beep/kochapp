import React from 'react';

interface UeberschriftProps {
  inhalt: string;
}

function Ueberschrift({ inhalt }: UeberschriftProps) {
  return <h1>{inhalt}</h1>;
}

export default Ueberschrift;
