import { erstelleZugang } from './api';

test('creates a basic authentication header', () => {
  expect(erstelleZugang('max.mustermann', 'test1234')).toBe('Basic bWF4Lm11c3Rlcm1hbm46dGVzdDEyMzQ=');
});

test('encodes umlauts as UTF-8', () => {
  // „jürgen:geheim“ in UTF-8, Base64-kodiert
  expect(erstelleZugang('jürgen', 'geheim')).toBe('Basic asO8cmdlbjpnZWhlaW0=');
});
