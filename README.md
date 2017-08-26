# quagbot - A charming API abusing slackbot for the Netherfore slack team & guild

Based on the lovely nnnslackbot (Lessdremoth) - A slackbot for the neuralnexus slack team

[![npm](https://img.shields.io/npm/v/nnnslackbot.svg)](https://www.npmjs.com/package/nnnslackbot)
[![npm](https://img.shields.io/npm/l/nnnslackbot.svg)](https://spdx.org/licenses/MIT)

A slackbot that uses the guildwars 2 API to provide some functionality to the Netherfore slack team. Provides base ingredients, item nomenclature, wiki integration, some fun reply bots and more!

## Installation

Check out quagbot directly from Git.

```bash
git clone git@github.com/mavrixwk/quagbot.git
```

Then in the checkout directory, install quagbot's dependencies

```
bash
npm install
```

## Setup

quagbot expects a slackbot token as an environment variable called 'token'. Slackbot tokens can be setup in the Custom Integrations section of your Slack Team's settings:
https://YOUR_SLACK_TEAM_NAME.slack.com/apps/manage/custom-integrations

Documentation from Slack is here:
https://api.slack.com/custom-integrations


Note that the bot's name will be whatever you call it in custom integrations. The bot will automatically connect but must be invited into channels aside from the default channel you set up in custom integrations.

Note! The original Lessdremoth that quagbot is based on uses some custom emoji. I may remove them if the bot gets at all popular. In the meantime, consider adding custom emoji with these names to your slack channel: hello, eyebulge, facepalm, gir, coollink, frasier, butt, gary_busey, fu, bustin

## Usage
Say 'help' in a channel with quagbot for a list of commands, and help 'command' for specific command help.

```
help deaths
```


quagbot can save guild wars 2 access tokens to fetch account-specific data. Tell quagbot 'access token help' for steps.

## Run with Node

To launch slackbot from a command line you need node installed, and need to set your slackbot token as an environment variable.

```
bash
set token=YOUR_SLACKBOT_TOKEN
```

Then simply point node at main.js

(from quagbot's directory)
```
bash
node ./main.js
```

Standard out will show (hopefully) helpful log messages whenever quagbot is doing something. Save this output when submitting bugs.

## Containerized Service

To launch quagbot as a Docker containerized service, execute the following commands on your command line.  We recommend nesting these steps under a subdirectory so quagbot and its data can be isolated.  Something as simple as this is sufficient:

```
mkdir lessy
cd lessy
```
Remember that this requires Docker, and it must be installed and started independently before running these commands.

```bash
git clone git@github.com/mavrixwk/quagbot.git
mkdir data
export SLACKTOKEN=<get the current active slack token from custom integrations>
export INSTALL_DIR=<absolute path to git clone location>
bash $INSTALL_DIR/quagbot/launch.sh
```

Thanks for trying out quagbot. Please email the author with questions or submit issues/feature requests/general insults as issues in git and they will be seen in short order.

List of commands as of v2.17.4:

craft, bcraft, bc, asscraft, basscraft, ac, bac, shop, bshop, professionReport, pr, deaths, characters, cheevo, cheevor, cheevof, daily, today, tomorrow, wallet, dungeonWallet, dw, bank, dungeonfriends, dungeonfriendsverbose, df, dfv, prefix, suffix, mycolors, colors, mycolorscheme, colorscheme, dye, latest, todo, access, quaggans, quaggan, hello, hi, shutdown, restart, uptime, who are you, sample

Responses without help: tantrum, riker, catfact, other 'easter eggs' that are easily findable in a text editor. :)
