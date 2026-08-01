const { SlashCommandBuilder } = require('discord.js');
const { buildHelpView } = require('../utils/helpView');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Список всех команд по категориям'),
  async execute(interaction) {
    const { embed, row } = buildHelpView(interaction.client, 'moderation');
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
