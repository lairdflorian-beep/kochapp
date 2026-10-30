import React from 'react';
import RezeptKarte from "./RezeptKarte";


function RezeptDetail () {
    return (
        <article className="rezept-detail">
            <div>

                <h1>NAME</h1>
                <p>von Autor · XXX Min.</p>
                <h2>Zutaten</h2>
                <ul>
                    <li>Zutat 1: <input/></li>
                    <li>Zutat 2: <input/></li>
                </ul>

                <h2>Zubereitung</h2>
                <ol>
                    <li>Schritt 1: <input/></li>
                    <li>Schritt 2: <input/></li>
                </ol>

                <div className="rezept-aktionen">
                    <button>
                        Reszept speichern
                    </button>
                </div>
            </div>
        </article>
    );
}

export default RezeptDetail;
