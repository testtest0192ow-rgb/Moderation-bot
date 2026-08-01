require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data) commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Регистрирую ${commands.length} команд...`);
    // Глобальная регистрация (может занять до 1 часа на обновление)
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    // Для мгновенного тестирования на одном сервере раскомментируй строки ниже
    // и закомментируй строку выше:
    // await rest.put(
    //   Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    //   { body: commands }
    // );

    console.log('✅ Команды успешно зарегистрированы.');
  } catch (err) {
    console.error(err);
  }
})();
