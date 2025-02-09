// require('dotenv').config();
// const { Client, Intents, Message } = require('discord.js');
// const fs = require('fs');
import dotenv from 'dotenv'
dotenv.config();
import { Client, Intents, Message } from 'discord.js';
import fs from 'fs';
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	let {name, once, execute} = await import(`./events/${file}`);
	if (once) {
		client.once(name, (...args) => execute(...args));
	} else {
		client.on(name, (...args) => execute(...args));
	}
}

client.login(TOKEN);

//spotify
//need server to listen to callbacks
import http from 'http';
import {authCallback} from './token_spotify.js';

const server = http.createServer();

server.on('request', (req, res) => {
	res.end();
	var [path, content] = req.url.split("?");
	//listen to callback from initial login
	if (path === '/auth/callback') {
		authCallback(content);
	}
});

server.listen(5000, () => {
	console.log("server start at port 5000");
});