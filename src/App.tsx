import React from 'react';
import Anmeldung from './components/Anmeldung';
import RezeptListe from './components/RezeptListe';
import SuchButton from './components/SuchButton';
import Ueberschrift from './components/Ueberschrift';
import './App.css';

function App() {
  return (
      <div className="App">
        <Anmeldung />

        <Ueberschrift inhalt="Familienkochbuch" />

        <SuchButton />

        <RezeptListe />
      </div>
  );
}

export default App;
