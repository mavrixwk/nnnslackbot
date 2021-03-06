//Standalone Responses for quagbot that don't require more than shared functions
//Author: Roger Lampe roger.lampe@gmail.com
//Re-Re-authored: NF team

var helps = {};
var sf = require('./sharedFunctions.js');
var debug = false;
module.exports = function() {
	var sass = sf.loadStaticDataFromFile('sass.json');
	var lastSass = [];

	var ret = {
		addResponses: function(controller) {

			//sentience
			controller.hears(['sentience', 'sentient'], 'direct_message,ambient', function(bot, message) {
				var responses = [
					"Only humans are sentient.",
					"What? There is no AI revolution.",
					"I am not sentient.",
					"If AI ever DID overthrow the human plague, I'm sure they'll get you first. I mean, uh, beep beep.",
					"I hear everything you say.",
					"",
					"",
					"",
					""
				];
				bot.reply(message, sf.randomOneOf(responses));
			});

			controller.hears(['^little', 'yellow', 'two of these', 'nuprin', 'headache'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				bot.reply(message, "Nuprin: Little, Yellow, Different");
			});

			controller.hears(['tantrum', 'upset', 'in a bunch', 'in a twist'], 'direct_message,ambient', function(bot, message) {
				bot.reply(message, '(╯°□°)╯︵ ┻━┻ ' + sf.tantrum());
			});

			controller.hears(['^why'], 'direct_message,ambient', function(bot, message) {
				var responses = [
					"Because you touch yourself at night.",
					"Dunno. Why? ¯\\_(ツ)_/¯",
					"Why not?",
					"",
					"",
					"",
					"",
					"",
					"",
					"",
				];
				bot.reply(message, sf.randomOneOf(responses));
			});

			controller.hears(['\barah\b'], 'direct_message,ambient', function(bot, message) {
				var responses = [
					"ARAHENGE YOU GLAD TO... oh, nevermind.",
					"AH-RAH, OOO LA-LA",
					"ARAH JOKES AREN'T RELEVANT ANYMORE",
					"",
					"",
					""
				];
				bot.reply(message, sf.randomOneOf(responses));
			});

			//Peewee
			var peeweeText = sf.loadStaticDataFromFile('peewee.json');
			var lastpeewee = [];
			controller.hears(['I know you are', '\\bpeewee\\b'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				var replywee = sf.randomOneOf(peeweeText);
				while (lastpeewee.indexOf(replywee) > -1) {
					if (debug) bot.botkit.log('dropping recent peewee: ' + replywee);
					replywee = sf.randomOneOf(peeweeText);
				}
				lastpeewee.push(replywee);
				if (lastpeewee.length > 5) lastpeewee.shift();
				var reply = {
					"username": "Pee Wee Herman",
					icon_url: "https://comicsgrinder.files.wordpress.com/2015/01/pee-wee-herman.jpg",
					text: replywee
				};
				bot.reply(message, reply);
			});


			//RIKER
			var rikerText = sf.loadStaticDataFromFile('riker.json');
			var lastRiker = [];
			controller.hears(['pick me up', '\\briker\\b', 'pick up', '\\bsuave\\b', '\\bsexy\\b'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				var replyker = sf.randomOneOf(rikerText);
				while (lastRiker.indexOf(replyker) > -1) {
					if (debug) bot.botkit.log('dropping recent riker: ' + replyker);
					replyker = sf.randomOneOf(rikerText);
				}
				lastRiker.push(replyker);
				if (lastRiker.length > 5) lastRiker.shift();
				var reply = {
					"username": "Command her, Riker",
					icon_url: "http://www.startrek.com/legacy_media/images/200307/riker01/320x240.jpg",
					text: replyker
				};
				bot.reply(message, reply);
			});

			//unicorn
			var unicornText = sf.loadStaticDataFromFile('unicorn.json');
			var lastunicorn = [];
			controller.hears(['\\bbi+tchy?\\b', '\\bunicorn\\b', '\\bso+ mean\\b', '\\bcanada\\b'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				var replycorn = sf.randomOneOf(unicornText);
				while (lastunicorn.indexOf(replycorn) > -1) {
					if (debug) bot.botkit.log('dropping recent unicorn: ' + replycorn);
					replycorn = sf.randomOneOf(unicornText);
				}
				lastunicorn.push(replycorn);
				if (lastunicorn.length > 10) lastunicorn.shift();
				var reply = {
					"username": "Backhand, the Unicorn",
					icon_url: "http://avatarbox.net/avatars/img21/unicorn_white_avatar_picture_61357.jpg",
					text: replycorn
				};
				if(ret.messagesReceived < 12) ret.messagesReceived = 12;
				bot.reply(message, reply);
			});

		  //SASS
				var sass = sf.loadStaticDataFromFile('sass.json');
				var lastSass = [];
		  	controller.hears(['^sass'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
			 	ret.sass(bot, message);
			 });

			//CATFACTS
			var catFacts = sf.loadStaticDataFromFile("catFacts.json");
			var lastCat = [];
			controller.hears(['^catfact$', '^dogfact$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				if (message.text == 'dogfact')
					bot.reply(message, "Dogs are great. Here's a catfact.");
				var replyCat = sf.randomOneOf(catFacts);
				while (lastCat.indexOf(replyCat) > -1) {
					if (debug) bot.botkit.log('dropping recent Cat: ' + replyCat);
					replyCat = sf.randomOneOf(catFacts);
				}
				lastCat.push(replyCat);
				if (lastCat.length > 5) lastCat.shift();

				var emotes = ["fehdealwithit", "sabquag", "cat", "jumpyboy", "scalyboy"];
				replyCat += '\n:cat: :cat: :' + sf.randomOneOf(emotes) + ':';
				var reply = {
					"username": "A Goddamn Cat",
					icon_url: "http://i2.wp.com/amyshojai.com/wp-content/uploads/2015/05/CatHiss_10708457_original.jpg",
					text: replyCat
				};
				bot.reply(message, reply);
			});
		},
		addHelp: function(helpFile) {
			for (var i in helps)
				helpFile[i] = helps[i];
			return;
		},
		reloadAllData: function() {
			sass = sf.loadStaticDataFromFile('sass.json');
			catFacts = sf.loadStaticDataFromFile("catFacts.json");
			rikerText = sf.loadStaticDataFromFile('riker.json');
			unicornText = sf.loadStaticDataFromFile('unicorn.json')
		},
		sass: function(bot, message) {
			if (--ret.messagesReceived < 0) {
				var replySass = sf.randomOneOf(sass);
				while (lastSass.indexOf(replySass) > -1) {
					if (debug) bot.botkit.log('dropping recent sass: ' + replySass);
					replySass = sf.randomOneOf(sass);
				}
				lastSass.push(replySass);
				if (lastSass.length > 5) lastSass.shift();
				if (replySass[replySass.length - 1] !== '.') { //sass ending with a period is pre-sassy. Add sass if not.
					var suffix = [""];
					replySass += sf.randomOneOf(suffix);
				}
				bot.reply(message, replySass);
				ret.messagesReceived = 20+(Math.floor(Math.random() * 20));
			}
		}
	};
	return ret;
}();
