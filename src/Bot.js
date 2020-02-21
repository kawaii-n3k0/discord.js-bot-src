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

    // run script
    run() {
        // create a Bot
        this.Bot = new Client({disableEveryone: this.disableEveryone});

        // on-ready
        this.Bot.on('ready', () => {
            info(`${this.Bot.user.tag} is ready (again)...`);

            this.Bot.user.setPresence({
                game: {
                    name: this.game_name,
                    type: "PLAYING"
                },
                status: this.status
            });
        });

        // on error
        this.Bot.on('error', async err => { if (err) throw err; else this.Bot.login(this.token); });

        // on disconnect
        this.Bot.on('disconnect', async e => this.Bot.login(this.token));

        // on messaged
        this.Bot.on('message', async msg => {
            ID.forEach(id => { if (msg.author.id == id) return; });

            let content = msg.content;

            if (content.startsWith(this.prefix)) {  

                let cmd = content.substr(1).split(/ /g);
                let cmd_p = cmd[0];
                let cmd_args = cmd.splice(1);
                
                switch (cmd_p) {
                    case 'ping': msg.channel.send('pong'); break;
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

// ---------------------------------------------------------------------------------------------------- export the module

module.exports = {
    Bot: Bot
}