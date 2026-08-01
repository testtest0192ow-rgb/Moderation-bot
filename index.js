require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src', 'commands');
const commandsJson = [];
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    client.commands.set(command.data.name, command);
    commandsJson.push(command.data.toJSON());
  }
}

const eventsPath = path.join(__dirname, 'src', 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

// Автоматическая регистрация слэш-команд при каждом запуске —
// не нужно вручную запускать отдельный скрипт деплоя.
async function registerCommands() {
  if (!process.env.CLIENT_ID) {
    console.warn('⚠️  CLIENT_ID не задан — пропускаю автоматическую регистрацию команд.');
    return;
  }
  try {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commandsJson }
      );
      console.log(`✅ Зарегистрировано ${commandsJson.length} команд на сервере ${process.env.GUILD_ID}`);
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandsJson });
      console.log(`✅ Зарегистрировано ${commandsJson.length} команд глобально (обновление может занять до часа)`);
    }
  } catch (err) {
    console.error('❌ Не удалось зарегистрировать команды:', err);
  }
}

registerCommands().then(() => client.login(process.env.DISCORD_TOKEN));

// Мини веб-сервер — нужен, чтобы Render (Web Service) видел открытый порт и не "засыпал" бот
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('Bot is alive ✅')).listen(PORT);
