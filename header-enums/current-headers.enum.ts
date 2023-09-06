export enum CategoryOption {
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
  Split = 'Split',
  Skip = 'Skip',
  Exit = 'Exit',
}

export function getCurrentColumnOffsetX(header: CategoryOption) {
  switch (header) {
  case CategoryOption.Misc: 
    return 3;
  case CategoryOption.Health:
    return 8;
  default:
    return 0;
  }
}
