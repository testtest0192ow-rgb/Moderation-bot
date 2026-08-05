const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction, client);
});

(async () => {
  const mongo = new MongoClient("ТВОЙ_MONGO_URI");
  await mongo.connect();

  client.db = mongo.db("discordBot");

  client.login("ТОКЕН");
})();
