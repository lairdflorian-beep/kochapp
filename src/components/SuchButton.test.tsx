import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SuchButton from './SuchButton';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the recipe search button without submitting forms', () => {
  render(<SuchButton onSuchen={jest.fn()} />);

  const searchButton = screen.getByRole('button', { name: 'Rezept suchen' });
  expect(searchButton).toBeInTheDocument();
  expect(searchButton).toHaveAttribute('type', 'button');
});

test('starts the search only when clicked', () => {
  const onSuchen = jest.fn();
  render(<SuchButton onSuchen={onSuchen} />);

  expect(onSuchen).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Rezept suchen' }));

  expect(onSuchen).toHaveBeenCalledTimes(1);
});

