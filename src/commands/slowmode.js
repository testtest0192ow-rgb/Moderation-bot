const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Установить режим замедления в канале')
    .addIntegerOption(o => o.setName('секунды').setDescription('0 — выключить').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('секунды');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply(seconds === 0 ? '⏱️ Замедление выключено.' : `⏱️ Замедление установлено: ${seconds} сек.`);
  }
};
