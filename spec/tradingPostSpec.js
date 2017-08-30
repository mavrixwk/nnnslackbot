const { toCurrency } = require('../tradingPost')

describe('Currency formatting', function(){
  it('needs to give a complete formatted currency', function(){
    const value = 123456;
    const expected = '12:gold: 34:silver: 56:copper:';
    const actual = toCurrency(value);
    expect(actual).toEqual(expected);
  });
});
