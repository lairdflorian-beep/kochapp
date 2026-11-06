import { filtereRezepte } from './suche';

const rezepte = [
  { id: 1, name: 'Omas Apfelkuchen', autor: 'Oma', dauerMinuten: 75 },
  { id: 2, name: 'Papas Gulasch', autor: 'Papa', dauerMinuten: 90 },
  { id: 3, name: 'Kartoffelsuppe', autor: 'Mama', dauerMinuten: 40 },
  { id: 5, name: 'Gemüse-Lasagne', autor: 'Opa', dauerMinuten: 60 },
];

const namen = (suchbegriff: string) => filtereRezepte(rezepte, suchbegriff).map((r) => r.name);

test('returns all recipes for an empty search term', () => {
  expect(namen('')).toHaveLength(4);
  expect(namen('   ')).toHaveLength(4);
});

test('finds recipes by name and author regardless of case', () => {
  expect(namen('gulasch')).toEqual(['Papas Gulasch']);
  expect(namen('MAMA')).toEqual(['Kartoffelsuppe']);
});

test('treats umlauts and their spelled-out form alike', () => {
  expect(namen('gemuese')).toEqual(['Gemüse-Lasagne']);
  expect(namen('Gemüse')).toEqual(['Gemüse-Lasagne']);
});

test('requires every word of the search term to match', () => {
  expect(namen('kuchen oma')).toEqual(['Omas Apfelkuchen']);
  expect(namen('kuchen papa')).toEqual([]);
});
