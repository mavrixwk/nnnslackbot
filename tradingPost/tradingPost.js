const api = require('./apiService.js');
const itemManager = require('./itemManager.js');
var sf = require('./sharedFunctions.js');

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

const getTrading = id => new Promise((resolve, reject) => resolve('hi'))

const chooseItem = (bot, list) => new Promise((resolve, reject) => bot.startConversation(message, function(err, convo) {
  var listofItems = '';
  for (var i in itemSearchResults) {
    listofItems += '\n' + [i] + ": " + itemSearchResults[i].inventoryName + sf.levelAndRarityForItem(itemSearchResults[i]) + (itemSearchResults[i].forged ? " (Mystic Forge)" : "");
  }
  convo.ask('I found multiple items with that name. Which number you mean? (say no to quit)' + listofItems, [{
    //number, no, or repeat
    pattern: new RegExp(/^(\d{1,2})/i),
    callback: function(response, convo) {
      //if it's a number, and that number is within our search results, print it
      const matches = response.text.match(/^(\d{1,2})/i);
      const selection = matches[0];
      if (selection < itemSearchResults.length) {
        convo.next();        
        return resolve([itemSearchResults[selection]]);
      } else convo.repeat(); //invalid number. repeat choices.
    }
  }, {
    //negative response. Stop repeating the list.
    pattern: bot.utterances.no,
    callback: function(response, convo) {
      convo.say('¯\\_(ツ)_/¯');
      convo.next();
      return reject(new Error('User cancelled item request'));
    }
  }, {
    default: true,
    callback: function(response, convo) {
      // loop back, user needs to pick or say no.
      convo.say("Nope. Next time choose a number of the item you'd like to see.");
      convo.next();
    }
  }]);
}));

const getTradingPostMessage = item => `buy price: ${item.buys.unit_price} \n sell price: ${item.sells.unit_price}`

const searchTrading = (bot, message) => {
  const matches = sf.removePunctuationAndToLower(message.text).match(/(tp|trading|tradingpost)([\s\w]*)$/i);
  if (!matches) {
    bot.reply(message, "I didn't quite get that. Maybe ask \'help trading\'?");
    return;
  }
  const searchTerm = (matches[2] ? matches[2].replace(/\s+/g, '') : null);
  if(!searchTerm){
    return;
  }
  itemManager.search(searchTerm).then(items => new Promise((resolve, reject) => {
    if(items.length === 0){
      bot.reply(`No item found with name ${searchTerm}. Please try a different search.`)
      return reject(new Error(`No item found with name ${searchTerm}. Please try a different search.`));
    }
    if(items.length === 1){
      return resolve(items[0]);
    }
    return chooseItem(bot, items);
  }))
  .then(item => item.id)
  .then(getTrading)
  .then(getTradingPostMessage)
  .then(response => bot.reply(message, response))
}

const appendHelp = helpFile => helpFile.trading = "Search the trading post for the buy/sell price of an item. Useage:trading <name>";

module.exports = {
  toCurrency,
  search: searchTrading
};
