export enum MoneyOption {
  Verizon = 'Verizon',
  Chase = 'Chase',
  Apple = 'Apple',
  ACheck = 'ACheck',
  ASpend = 'ASpend',
  ASave = 'ASave',
  SoFi = 'SoFi',
  Cash = 'Cash',
  Kohler = 'Kohler',
  Discover = 'Discover',
  Prime = 'Prime',
  Other = 'Other',
  SRoth = 'SRoth',
  STrad = 'STrad',
  SSave = 'SSave',
  Baird = 'Baird',
  Four = '401k',
  HSA = 'HSA',
  Crypto = 'Crypto',
  Treasury = 'Treasury',
  Metal = 'Metal',
  House = 'House',
  Exit = 'Exit',
}

export const isCredit = (header: MoneyOption) => [
  MoneyOption.Apple,
  MoneyOption.Discover,
  MoneyOption.Chase,
  MoneyOption.Prime,
  MoneyOption.Verizon
].includes(header);