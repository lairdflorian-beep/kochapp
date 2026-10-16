export interface Rezept {
  id: string;
  name: string;
  autor: string;
  dauerMinuten: number;
  zutaten: string[];
  zubereitung: string[];
}

export const rezepte: Rezept[] = [
  {
    id: 'omas-apfelkuchen',
    name: 'Omas Apfelkuchen',
    autor: 'Oma',
    dauerMinuten: 75,
    zutaten: ['6 Äpfel', '250 g Mehl', '125 g Zucker', '125 g Butter', '2 Eier'],
    zubereitung: [
      'Äpfel schälen und schneiden.',
      'Teig kneten und in die Form geben.',
      'Mit Äpfeln belegen und 45 Min. backen.',
    ],
  },
  {
    id: 'papas-gulasch', name: 'Papas Gulasch', autor: 'Papa', dauerMinuten: 90,
    zutaten: [], zubereitung: [],
  },
  {
    id: 'kartoffelsuppe', name: 'Kartoffelsuppe', autor: 'Mama', dauerMinuten: 40,
    zutaten: [], zubereitung: [],
  },
  {
    id: 'pfannkuchen', name: 'Pfannkuchen', autor: 'Lena', dauerMinuten: 20,
    zutaten: [], zubereitung: [],
  },
  {
    id: 'gemuese-lasagne', name: 'Gemüse-Lasagne', autor: 'Opa', dauerMinuten: 60,
    zutaten: [], zubereitung: [],
  },
];
