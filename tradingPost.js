const reducingDivide = (divisors, value, acc = []) =>
  divisors.length === 0 ?
  acc :
  reducingDivide(divisors.slice(1), value % divisors[0], acc.concat(Math.floor(value / divisors[0])))

const currencyHelper = (config, value, accumulation = '') =>
  reducingDivide(config.map(denomination => denomination.divisor), value)
  .map((value, index) => value + config[index].symbol)
  .join(' ')

const currencyConfig = {
  gold: {
    symbol: ':gold:',
    divisor: 10000
  },
  silver: {
    symbol: ':silver:',
    divisor: 100
  },
  copper: {
    symbol: ':copper:',
    divisor: 1
  }
};

const toCurrency = value => currencyHelper([currencyConfig.gold, currencyConfig.silver, currencyConfig.copper], value);

module.exports = {
  toCurrency
};
