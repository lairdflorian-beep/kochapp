import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RezeptDetail from './components/RezeptDetail';
import RezeptListe from './components/RezeptListe';
import SuchButton from './components/SuchButton';
import Ueberschrift from './components/Ueberschrift';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
      <div className="App">
        <Ueberschrift inhalt="Familienkochbuch" />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SuchButton />

                <RezeptListe onAuswahl={(id) => navigate(`/rezept/${id}`)} />
              </>
            }
          />
          <Route path="/rezept/:id" element={<RezeptDetail />} />
        </Routes>
      </div>
  );
}

export default App;
