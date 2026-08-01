const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Проверить задержку бота'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Понг...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Понг! Задержка: **${latency}мс** | API: **${Math.round(interaction.client.ws.ping)}мс**`);
  }
};
