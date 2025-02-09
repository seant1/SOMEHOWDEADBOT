const prefix = "~";
import {login} from '../token_spotify.js';

export const name = 'messageCreate';
export const once = false;
export async function execute(msg) {
		if (msg.author.bot) return; //don't do anything if its from the bot
    if (!msg.content.startsWith(prefix)) return; // don't bother checking the rest
    
    if (msg.content.startsWith(`${prefix}p`)) {
      var commandArgs = msg.content.match(new RegExp(`${prefix}p (?<url>.+)`));
      if(commandArgs) {
        msg.channel.send(`play url: ${commandArgs.groups.url}`);
      }
      else {
        msg.channel.send(`${prefix}p spotify-playlist`);
      }
    }
    else if (msg.content === `${prefix}s`) {
      msg.channel.send('skip');
    }
    else if (msg.content === `${prefix}pause`) {
      msg.channel.send('pause');
    }
    else if (msg.content === `${prefix}clear`) {
      msg.channel.send('clear');
    }
    else if (msg.content === `${prefix}q`) {
      msg.channel.send('queue');
    }
    else if (msg.content === `${prefix}l`) {
      // const getToken = require('../token_spotify.js');
      await login();
    }
};


