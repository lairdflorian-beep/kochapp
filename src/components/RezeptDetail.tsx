import React from 'react';

function RezeptDetail () {
    return (
        <article className="rezept-detail">
            <div>

                <h1>NAME</h1>
                <p>von Autor · XXX Min.</p>
                <h2>Zutaten</h2>
                <ul>
                    <li>Zutat 1: </li>
                    <li>Zutat 2: </li>
                </ul>

                <h2>Zubereitung</h2>
                <ol>
                    <li>Schritt 1</li>
                    <li>Schritt 2</li>
                </ol>

            </div>
        </article>
    );
}

export default RezeptDetail;
