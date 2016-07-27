//Template for new modules
//Author: Roger Lampe roger.lampe@gmail.com

var sf = require('./sharedFunctions.js');
var gw2api = require('./api.js');

module.exports = function() {

	var ret = {
		addResponses: function(controller) {
			controller.hears(['^color$', '^colors$', '^dye$', '^dyes$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
				bot.reply(message, "colors go!");
				sf.setGlobalMessage(message);
				//establish if we're fetching one user or many
				var userToFetch;
				//just one for now
				if (true) userToFetch = [message.user];
				sf.storageUsersGetSynch(userToFetch)
					.then(function(users) {
						return sf.userHasPermissionsAndReply(users, "unlocks");
					})
					.then(function(validUsers) {
						var userColorPromises = [];
						for (var usr in validUsers)
							if (validUsers[usr] !== null) {
								if (debug) sf.log(validUsers[usr].name + " is a valid user", true);
								userColorPromises.push(gw2api.promise.accountDyes(["all"], validUsers[usr].access_token, true));
							}
						if (debug) sf.log(userColorPromises.length + " account dye lists to fetch");
						return Promise.all(userColorPromises);
					})
					.then(function(colorLists) {
						if (debug) sf.log("Colorlists: " + JSON.stringify(colorLists));
						var colorText = [];
						var colorIcons = ["http://wiki.guildwars2.com/images/c/c4/Unidentified_Dye.png"];
						for (var id in colorLists[0]) {
							var color = gw2api.findInData("id", colorLists[0][id], "colors");
							if (color && color.name)
								colorText.push(color.name);
							else sf.log("Invalid color id: " + colorLists[0][id]);
							var item = gw2api.findInData("id", color.item, "items");
							if (item && item.icon)
								colorIcons.push(item.icon);
						}
						colorText.sort();
						sf.log(JSON.stringify(colorIcons));
						sf.replyWith({
							attachments: {
								attachment: {
									fallback: 'A list of ' + colorText.length + ' dyes.',
									title: "Dyes Known: " + colorText.length,
									text: colorText.join(", "),
									thumb_url: sf.randomOneOf(colorIcons)
								}
							}
						});
					})
					.catch(function(error) {
						sf.replyWith(message, "I got an error on my way to promise land from colors. Send help!\nTell them " + error);
					});
			});
		},
		addHelp: function(helpFile) {
			helpFile.colors = "Returns a list of dyes you've discovered";
			helpFile.dyes = "Returns a list of dyes you've discovered";
		}
	};
	return ret;
}();
//'private' functions