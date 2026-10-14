import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SuchButton from './SuchButton';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the recipe search button without submitting forms', () => {
  render(<SuchButton />);

  const searchButton = screen.getByRole('button', { name: 'Rezept suchen' });
  expect(searchButton).toBeInTheDocument();
  expect(searchButton).toHaveAttribute('type', 'button');
});

test('alerts the search message only when clicked', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<SuchButton />);

  expect(alertSpy).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Rezept suchen' }));

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenCalledWith('Rezept suchen ...');
});
