require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data) client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'src', 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(process.env.DISCORD_TOKEN);

// Мини веб-сервер — нужен, чтобы Render (Web Service) видел открытый порт и не "засыпал" бот
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('Bot is alive ✅')).listen(PORT);
