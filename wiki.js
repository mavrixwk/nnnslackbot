var sf = require('./sharedFunctions.js');
var request = require('request');

var config = {
  baseuri: "https://wiki.guildwars2.com/api.php",
  mediawikiBase: 'https://wiki.guildwars2.com/wiki/',
  agentIdentifier: "quagbot/1.0",
  debug: false
};

function getWikiUri(action) {
  return config.baseuri + '?action=' + action
}

function getWikiData(uri) {
  var requestOptions = {
    method: 'GET',
    url: uri,
    headers: {
      "Api-User-Agent": config.agentIdentifier
    }
  };
  return new Promise(function(resolve, reject) {
    request(requestOptions, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

function searchWiki(term) {
  var searchAddress = config.baseuri + '?action=opensearch&search=' + encodeURIComponent(term);
  return getWikiData(searchAddress);
}

function getPageEnding(link) {
  return link.split(/[/]+/).pop();
}

function getPageInfo(item) {
  var uri = config.baseuri + '?action=parse&page=' + getPageEnding(item.link);
  return getWikiData(uri);
}

function stripMarkup(text) {
  var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  while (scriptRegex.test(text)) {
    text = text.replace(scriptRegex, '');
  }
  return text.replace(/<(?:.|\n)*?>/gm, '').replace(/\n\s*\n/g, '\n');
}

function getImage(item) {
  var uri = config.baseuri + '?action=parse&prop=images&format=json&page=' + encodeURIComponent(item.name);
  return getWikiData(uri)
    .then(function(data) {
      if (data && data.parse && data.parse.images && data.parse.images.length > 0) {
        return data.parse.images;
      }
      throw new Error('no images found');
    }).then(function(images) {
      var index = -1;
      for (var i = 0; i < images.length; i++) {
        //todo: make all comparisons case insensitive
        images.some(function(element, i) {
          if (item.name === element.toLowerCase()) {
            index = i;
            return true;
          }
        });
        if (index > 0) {
          return images[i];
        }
      }
      return images[0];
    }).then(function(image) {
      var imageInfoUri = config.baseuri + '?action=query&prop=imageinfo&iiprop=url&format=json&titles=File:' + encodeURIComponent(image);
      return getWikiData(imageInfoUri);
    }).then(function(data) {
      if (data && data.query && data.query.pages) {
        var keys = Object.keys(data.query.pages);
        var id = data.query.pages[keys[0]];
        if (id.imageinfo && id.imageinfo.length > 0 && id.imageinfo[0].url) {
          return id.imageinfo[0].url;
        }
        throw new Error('no image url found');
      }
      throw new Error('no image url found');
    })
    .catch(function(error) {
      console.log(error);
      return null;
    });
}

function getPageSummary(item) {
  var uri = config.baseuri + '?action=parse&prop=text&section=0&format=json&disabletoc=true&page=' + encodeURIComponent(item.name);
  return getWikiData(uri)
    .then(function(result) {
      // get content section
      if (result && result.parse && result.parse.text && result.parse.text['*']) {
        return result.parse.text['*'];
      }
      throw new Error('no summary found')
    })
    .then(stripMarkup)
    .catch(function(err) {
      console.log(err);
      return null;
    });
}

function getAttachment(item) {
  return Promise.all([getImage(item), getPageSummary(item)])
    .then(function(values) {
      var imageUrl = values[0];
      var summary = values[1];
      var pretext = '';
      var fields = [];
      return { //assemble attachment
        fallback: item.name,
        pretext: pretext,
        title: item.name,
        color: '#AA129F',
        thumb_url: imageUrl,
        fields: fields,
        text: summary
      };
    });
}

function convertWikiResults(results) {
  var items = [];
  for (var i = 0; i < results[1].length; i++) {
    items.push({
      name: results[1][i],
      link: results[3][i]
    });
  }
  return items;
}

function noResultsAnswer(bot, message) {
  return bot.reply(message, "I\'ve got nothing. Are you sure that exists?");
}

function getItemResponse(item) {
  return getAttachment(item)
    .then(function(attachment) {
      var response = {
        text: item.link,
        attachments: {
          attachment: attachment
        }
      };
      return response;
    });
}

function returnWikiLink(bot, message, item) {
  return getItemResponse(item)
    .then(function(response) {
      return bot.reply(message, response);
    });
}

function chooseItem(bot, message, items) {
  bot.startConversation(message, function(err, convo) {
    var listofItems = '';
    for (var i in items) {
      listofItems += '\n' + [i] + ": " + items[i].name;
    }
    convo.ask('I found multiple items with that name. Which number you mean? (say no to quit)' + listofItems, [{
      //number, no, or repeat
      pattern: new RegExp(/^(\d{1,2})/i),
      callback: function(response, convo) {
        //if it's a number, and that number is within our search results, print it
        var matches = response.text.match(/^(\d{1,2})/i);
        var selection = matches[0];
        if (selection < items.length) {
          getItemResponse(items[selection]).then(function(response) {
            return convo.addMessage(response);
          }).catch(function(err) {
            console.log(err);
          });
        } else convo.repeat(); //invalid number. repeat choices.
        convo.next();
      }
    }, {
      //negative response. Stop repeating the list.
      pattern: bot.utterances.no,
      callback: function(response, convo) {
        convo.say('¯\\_(ツ)_/¯');
        convo.next();
      }
    }, {
      default: true,
      callback: function(response, convo) {
        // loop back, user needs to pick or say no.
        convo.say("Nope. Next time choose a number of the item you'd like to see.");
        convo.next();
      }
    }]);
  });
}

function getExactMatch(term, items) {
  for (var i = 0; i < items.length; i++) { // do we have underscore or an equivalent?
    if (items[i].name.toLowerCase() === term) {
      return items[i];
    }
  }
  return null;
}

module.exports = function() {
  var ret = {
    addResponses: function(controller) {
      controller.hears(['^wiki(.*)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
        var matches = sf.removePunctuationAndToLower(message.text).match(/(wiki)\s?([\s\w]*)$/i);
        if (!matches[2]) {
          bot.reply(message, 'I don\'t see a search term from you. Did you lose it?');
          return;
        }
        bot.reply(message, 'Searching wiki for ' + matches[2]);
        searchWiki(matches[2])
          .then(convertWikiResults)
          .then(function(results) {
            var numResults = results.length;
            if (numResults === 0) {
              return noResultsAnswer(bot, message);
            }
            if (numResults === 1) {
              return returnWikiLink(bot, message, results[0]);
            }
            var exactMatch = getExactMatch(matches[2], results);
            if (exactMatch) {
              return returnWikiLink(bot, message, exactMatch);
            }
            return chooseItem(bot, message, results);
          });
      });
    },
    addHelp: function(helpFile) {
      helpFile.wiki = "Searches the wiki for an item by name. Useage:wiki <name>";
    }
  };
  return ret;
}();
//'private' functions