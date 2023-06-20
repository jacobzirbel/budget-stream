export enum CurrentHeader {
  Health = 'Health',
  Rent = 'Rent',
  Phone = 'Phone',
  Travel = 'Travel',
  Car = 'Car',
  Grocery = 'Grocery',
  Fast = 'Fast',
  Drugs = 'Drugs',
  Gift = 'Gift',
  Misc = 'Misc',
}

export function getCurrentColumnOffset(header: CurrentHeader) {
  switch (header) {
    case CurrentHeader.Misc: 
      return 3;
    case CurrentHeader.Health:
      return 8;
    default:
      return 0;
  }
}