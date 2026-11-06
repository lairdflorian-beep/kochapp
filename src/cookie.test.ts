import { benutzerAusZugang, leseZugang, loescheZugang, speichereZugang } from './cookie';

const ZUGANG = 'Basic bWF4Lm11c3Rlcm1hbm46dGVzdDEyMzQ=';

afterEach(() => {
  loescheZugang();
  jest.restoreAllMocks();
});

test('stores the login in a cookie valid for one hour', () => {
  const setter = jest.spyOn(Document.prototype, 'cookie', 'set');

  speichereZugang(ZUGANG);

  expect(setter).toHaveBeenCalledWith(
    'zugang=Basic%20bWF4Lm11c3Rlcm1hbm46dGVzdDEyMzQ%3D; max-age=3600; path=/; SameSite=Strict'
  );
  expect(leseZugang()).toBe(ZUGANG);
});

test('returns null without a stored login and after logout', () => {
  expect(leseZugang()).toBeNull();

  speichereZugang(ZUGANG);
  loescheZugang();

  expect(leseZugang()).toBeNull();
});

test('reads the user name from the stored login', () => {
  expect(benutzerAusZugang(ZUGANG)).toBe('max.mustermann');
  expect(benutzerAusZugang('Basic asO8cmdlbjpnZWhlaW0=')).toBe('jürgen');
  expect(benutzerAusZugang('Basic kein-base64!')).toBeNull();
});
