const {
    Client
} = require('discord.js');


const {
    ID
} = require('./oath');

// ---------------------------------------------------------------------------------------------------- actual Bot

class Bot {

    /**
     * 
     * @param {string} token The token of the bot
     * @param {'online'|'idle'|'invisible'|'dnd'} status The status of the bot
     * @param {string} game_name The name of the game played
     * @param {string|'&'|'.'|';'|'/'|'-'} prefix The trigger for the command
     * @param {boolean} disableEveryone No description yet
     */

    constructor(token, status, game_name, prefix, disableEveryone=false) {
        this.token = token;
        this.status = status;
        this.game_name = game_name;
        this.prefix = prefix;
        this.disableEveryone = disableEveryone;
    }

    /**
     * 
     * @param {"PLAYING"|"STREAMING"|"WATCHING"|"LISTENING"} type The type of the activity
     */

    // run script
    run(type, url="") {

        // get the members
        let members;

        // create a Bot
        this.Bot = new Client({disableEveryone: this.disableEveryone});

        // on-ready
        this.Bot.on('ready', () => {
            info(`${this.Bot.user.tag} is ready (again)...`);

            members = this.Bot.guilds.find('id','679389961291694131').members;
            if (url != "") {
                this.Bot.user.setPresence({
                    game: {
                        name: this.game_name,
                        type: type,
                        url: url
                    },
                    status: this.status
                });
            }
            else {
                this.Bot.user.setPresence({
                    game: {
                        name: this.game_name,
                        type: type,
                    },
                    status: this.status
                });
            }
        });

        // on error
        this.Bot.on('error', async err => { if (err) throw err; else this.Bot.login(this.token); });

        // on disconnect
        this.Bot.on('disconnect', async e => this.Bot.login(this.token));

        // on messaged
        this.Bot.on('message', async msg => {
            ID.forEach(id => { if (msg.author.id == id) return; });

            //info(msg.content);

            let content = msg.content;

            if (content.startsWith(this.prefix)) {  

                let cmd = content.substr(1).split(/ /g);
                let cmd_p = cmd[0];

                let cmd_args = cmd.splice(1);
                
                let members_id = [];

                members.forEach(m => members_id.push(m.id));

                info(`CMD: ${cmd_p}; ARGS: ${cmd_args == null ? "NULL" : cmd_args}`);

                switch (cmd_p) {
                    case 'ping': msg.channel.send('pong'); break;
                    case 'get':
                        let id = cmd_args[0].replace(/<@!/g, '').replace(/>/g, '');
                        if (contains(members_id, id)) {

                            let m = this.Bot.guilds.find('id','679389961291694131').members.find('id', id.toString());

                            msg.channel.send(`The info for ${m.user.tag}:\nNickname: ${m.nickname}\nID: ${m.user.id}\nPresence (Status): ${m.user.presence.status}\nPresence (Game): ${m.user.presence.game.name}\nType: ${parseActivityType(m.user.presence.game.type)/*m.user.presence.game.type*/}\nProfile Pic:`, {
                                embed: {
                                    image: {
                                        url: m.user.displayAvatarURL
                                    }
                                }
                            });
                        }
                        break;
                    default: msg.channel.send('Sorry, this is not a command! :('); break;
                }
            }
        });

        // connect
        this.Bot.login(this.token);
    }
}

// ---------------------------------------------------------------------------------------------------- Help and non-exportable stuff

/**
 * 
 * @param {string} x The message to be logged into the console
 */

const info = x => {
    var d = new Date();

    console.log(`[INFO@${time(d.getHours(), false)}:${time(d.getMinutes(), false)}:${time(d.getSeconds(), false)}:${time(d.getMilliseconds(), true)}]:${x}`);
};

/**
 * 
 * @param {number} x A number
 * @param {boolean} ms If it is milliseconds
 */

function time(x, ms) {
    if (ms) return x < 10 ? `00${x}` : x < 100 ? `0${x}` : `${x}`;
    else return x < 10 ? `0${x}` : `${x}`;
};

/**
 * 
 * @param {number[]} arr The array
 * @param {number} e The element that is to be checked
 */

const contains = (arr, e) => {

    let i = 0;
    let res = false;

    while (!res) {
        res = arr[i] == e;
        i++;
        if (i == arr.length ^ res) break;
    }
    
    return res;
};

/**
 * 
 * @param {number} type The presence
 * @returns {"Playing"|"Streaming"|"Watching"|"Listening"|"Custom"}
 */

const parseActivityType = type => {
    switch (type) {
        case 0: return "Playing";
        case 1: return "Streaming";
        case 2: return "Listening";
        case 3: return "Watching";
        case 4: return "Custom";
        default: return null;
    }
};

// ---------------------------------------------------------------------------------------------------- export the module

module.exports = {
    Bot: Bot
};
