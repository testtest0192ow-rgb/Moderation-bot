const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Панель тикетов'),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Создать тикет')
        .setStyle(ButtonStyle.Primary)
    );

    interaction.reply({
      content: 'Тикеты',
      components: [row]
    });
  }
};
