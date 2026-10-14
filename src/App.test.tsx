import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the cookbook heading and recipe search', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Familienkochbuch', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Rezept suchen' })).toBeInTheDocument();
});

test('renders all five recipes with their authors and preparation times', () => {
  render(<App />);

  const recipeList = screen.getByRole('list', { name: 'Rezepte' });
  expect(within(recipeList).getAllByRole('listitem')).toHaveLength(5);
  expect(within(recipeList).getAllByRole('button')).toHaveLength(5);

  const recipes = [
    { name: /Omas Apfelkuchen/, info: 'von Oma · 75 Min.' },
    { name: /Papas Gulasch/, info: 'von Papa · 90 Min.' },
    { name: /Kartoffelsuppe/, info: 'von Mama · 40 Min.' },
    { name: /Pfannkuchen/, info: 'von Lena · 20 Min.' },
    { name: /Gemüse-Lasagne/, info: 'von Opa · 60 Min.' },
  ];

  recipes.forEach(({ name, info }) => {
    const recipeCard = within(recipeList).getByRole('button', { name });
    expect(recipeCard).toHaveAttribute('type', 'button');
    expect(within(recipeCard).getByText(info)).toBeInTheDocument();
  });
});
