import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import RezeptKarte from './RezeptKarte';

afterEach(() => {
  jest.restoreAllMocks();
});

test.each([
  { name: 'Tomatensuppe', autor: 'Alex', dauerMinuten: 25 },
  { name: 'Crème brûlée & Beeren', autor: 'Renée', dauerMinuten: 0 },
])('renders the supplied recipe data for $name', ({ name, autor, dauerMinuten }) => {
  render(<RezeptKarte name={name} autor={autor} dauerMinuten={dauerMinuten} />);

  const recipeCard = screen.getByRole('button');
  const info = `von ${autor} · ${dauerMinuten} Min.`;

  expect(recipeCard).toHaveAttribute('type', 'button');
  expect(recipeCard).toHaveAccessibleName(`${name} ${info}`);
  expect(within(recipeCard).getByText(name)).toBeInTheDocument();
  expect(within(recipeCard).getByText(info)).toBeInTheDocument();
});

test('updates the recipe card when its props change', () => {
  const { rerender } = render(
    <RezeptKarte name="Nudelsalat" autor="Kim" dauerMinuten={15} />
  );

  rerender(<RezeptKarte name="Gemüseauflauf" autor="Robin" dauerMinuten={45} />);

  expect(screen.getByRole('button')).toHaveAccessibleName('Gemüseauflauf von Robin · 45 Min.');
  expect(screen.getByText('Gemüseauflauf')).toBeInTheDocument();
  expect(screen.getByText('von Robin · 45 Min.')).toBeInTheDocument();
  expect(screen.queryByText('Nudelsalat')).not.toBeInTheDocument();
  expect(screen.queryByText('von Kim · 15 Min.')).not.toBeInTheDocument();
});

test('alerts the current recipe name when the card is clicked', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const { rerender } = render(
    <RezeptKarte name="Tomatensuppe" autor="Alex" dauerMinuten={25} />
  );

  expect(alertSpy).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button'));

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenNthCalledWith(1, 'Tomatensuppe');

  rerender(<RezeptKarte name="Crème brûlée & Beeren" autor="Renée" dauerMinuten={0} />);
  fireEvent.click(screen.getByRole('button'));

  expect(alertSpy).toHaveBeenCalledTimes(2);
  expect(alertSpy).toHaveBeenNthCalledWith(2, 'Crème brûlée & Beeren');
});

