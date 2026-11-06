import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import RezeptKarte from './RezeptKarte';

test.each([
  { name: 'Tomatensuppe', autor: 'Alex', dauerMinuten: 25 },
  { name: 'Crème brûlée & Beeren', autor: 'Renée', dauerMinuten: 0 },
])('renders the supplied recipe data for $name', ({ name, autor, dauerMinuten }) => {
  render(<RezeptKarte name={name} autor={autor} dauerMinuten={dauerMinuten} onAuswaehlen={() => {}} />);

  const recipeCard = screen.getByRole('button');
  const info = `von ${autor} · ${dauerMinuten} Min.`;

  expect(recipeCard).toHaveAttribute('type', 'button');
  expect(recipeCard).toHaveAccessibleName(`${name} ${info}`);
  expect(within(recipeCard).getByText(name)).toBeInTheDocument();
  expect(within(recipeCard).getByText(info)).toBeInTheDocument();
});

test('updates the recipe card when its props change', () => {
  const { rerender } = render(
    <RezeptKarte name="Nudelsalat" autor="Kim" dauerMinuten={15} onAuswaehlen={() => {}} />
  );

  rerender(<RezeptKarte name="Gemüseauflauf" autor="Robin" dauerMinuten={45} onAuswaehlen={() => {}} />);

  expect(screen.getByRole('button')).toHaveAccessibleName('Gemüseauflauf von Robin · 45 Min.');
  expect(screen.getByText('Gemüseauflauf')).toBeInTheDocument();
  expect(screen.getByText('von Robin · 45 Min.')).toBeInTheDocument();
  expect(screen.queryByText('Nudelsalat')).not.toBeInTheDocument();
  expect(screen.queryByText('von Kim · 15 Min.')).not.toBeInTheDocument();
});

test('calls onAuswaehlen when the card is clicked', () => {
  const onAuswaehlen = jest.fn();
  render(<RezeptKarte name="Tomatensuppe" autor="Alex" dauerMinuten={25} onAuswaehlen={onAuswaehlen} />);

  expect(onAuswaehlen).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button'));

  expect(onAuswaehlen).toHaveBeenCalledTimes(1);
});
