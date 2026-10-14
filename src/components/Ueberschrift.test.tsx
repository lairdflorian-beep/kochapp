import React from 'react';
import { render, screen } from '@testing-library/react';
import Ueberschrift from './Ueberschrift';

test('renders the supplied content as a level-one heading', () => {
  render(<Ueberschrift inhalt="Lieblingsrezepte & Gebäck" />);

  expect(screen.getByRole('heading', { name: 'Lieblingsrezepte & Gebäck', level: 1 }))
    .toBeInTheDocument();
});

test('updates the heading when its content changes', () => {
  const { rerender } = render(<Ueberschrift inhalt="Familienkochbuch" />);

  rerender(<Ueberschrift inhalt="Neue Rezepte" />);

  expect(screen.getByRole('heading', { name: 'Neue Rezepte', level: 1 }))
    .toBeInTheDocument();
  expect(screen.queryByText('Familienkochbuch')).not.toBeInTheDocument();
});
