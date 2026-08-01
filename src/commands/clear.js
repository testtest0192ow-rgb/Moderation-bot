const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Удалить сообщения из канала')
    .addIntegerOption(o => o.setName('количество').setDescription('Сколько сообщений удалить (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('количество');
    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    if (!deleted) return interaction.editReply('Не удалось удалить сообщения (возможно, они старше 14 дней).');
    await interaction.editReply(`🧹 Удалено сообщений: ${deleted.size}`);
  }
};
