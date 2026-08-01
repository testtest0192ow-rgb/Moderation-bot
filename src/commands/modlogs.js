const { SlashCommandBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { buildModlogsView } = require('../utils/modlogsView');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('Показать историю модерации пользователя (баны, кики, муты, варны)')
    .addUserOption(o => o.setName('пользователь').setDescription('Чью историю показать').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const logs = db.getModLogs(target.id);

    if (logs.length === 0) {
      return interaction.reply(`${EMOJI.CHECK} У <@${target.id}> чистая история — модераторских действий не найдено.`);
    }

    const { embed, row } = buildModlogsView(target.id, target.username, logs, 0);
    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
