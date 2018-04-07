// Libs
var Discord = require("discord.js");
var auth = require("./auth.json");
var _ = require("lodash");
var Promise = require("bluebird");

// Imports
var Constants = require("./bot-constants.js");
var PrefixManager = require("./bot-prefix.js");
var MusicManager = require("./bot-music.js");
var GamesManager = require("./bot-games.js");
// Didscord client
const client = new Discord.Client();
global.client = client;
global.Discord =  Discord;

client.login(auth.token);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    var argObj = PrefixManager.checkPrefix(msg);
    if (!argObj.status) {
        return;
    }

    var cmd = argObj.cmd;
    var args = argObj.args;
    
    if (cmd === Constants.PING) {
        return msg.channel.send("<@" + msg.author.id + "> WSPing:" + client.ping);
    } else if (cmd === Constants.PREFIX) {
        return msg.reply(PrefixManager.parseArgs(args));
    } else if (cmd === Constants.JOIN) {
        return msg.channel.send(MusicManager.init(argObj));
    } else if (cmd === Constants.LEAVE) {
        return msg.channel.send(MusicManager.leave());
    } else if (cmd === Constants.PLAY) {
        MusicManager.play(argObj);
    } else if (cmd === Constants.USE_THIS_TEXT_CHANNEL) {
        Promise.try(function() {
            return MusicManager.useThisTextChannel(argObj);
        }).then(function() {
            return msg.react("🍆");
        });
    } else if (cmd === Constants.PING_TEXT_CHANNEL) {
        return MusicManager.pingTextChannel();
    } else if (cmd === Constants.SKIP) {
        MusicManager.skip();
    } else if (cmd === Constants.QUEUE) {
        MusicManager.showQueue();
    } else if (cmd === Constants.SHUT_DOWN) {
        // TODO
    } else if (cmd === Constants.RESUME) {
        MusicManager.resume();
    } else if (cmd === Constants.PAUSE) {
        MusicManager.pause();
    } else if (cmd === Constants.NOW_PLAYING) {
        MusicManager.nowPlaying();
    } else if (cmd === Constants.CLEAR_QUEUE) {
        MusicManager.clearQueue();
    } else if (cmd === Constants.REMOVE) {
        MusicManager.removeFromQueue(argObj.args);
    } else if (cmd === Constants.AUTOPLAY) {
        MusicManager.autoPlay(argObj);
    } else if (cmd === Constants.AUTOPLAY_THIS) {
        MusicManager.autoPlayThis();
    } else if (cmd === Constants.AUTOPLAY_OFF) {
        MusicManager.turnAutoplayOff();
    } else if (cmd === Constants.SHOW_PLAYED_HISTORY) {
        MusicManager.showPlayedHistory();
    } else if (cmd === Constants.GAME) {
        GamesManager.rpc(argObj);
    } else if (cmd === Constants.NUDGE) {
        Promise.try(function() {
            MusicManager = require("./bot-music.js");
            return client.destroy();
        }).then(function() {
            client.login(auth.token);
        });
    }
});

