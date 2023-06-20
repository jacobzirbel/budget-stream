export enum MoneyHeaders {
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
}

export const isCredit = (header: MoneyHeaders) => [
  MoneyHeaders.Apple,
  MoneyHeaders.Discover,
  MoneyHeaders.Chase,
  MoneyHeaders.Prime,
  MoneyHeaders.Verizon
].includes(header)