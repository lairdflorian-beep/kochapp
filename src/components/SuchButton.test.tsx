import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SuchButton from './SuchButton';

test('renders the recipe search button without submitting forms', () => {
  render(<SuchButton onSuchen={() => {}} />);

  const searchButton = screen.getByRole('button', { name: 'Rezept suchen' });
  expect(searchButton).toBeInTheDocument();
  expect(searchButton).toHaveAttribute('type', 'button');
});

test('calls onSuchen only when clicked', () => {
  const onSuchen = jest.fn();
  render(<SuchButton onSuchen={onSuchen} />);

  expect(onSuchen).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Rezept suchen' }));

  expect(onSuchen).toHaveBeenCalledTimes(1);
});
