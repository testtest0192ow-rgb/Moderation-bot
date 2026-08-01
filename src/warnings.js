const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Показать предупреждения пользователя')
    .addUserOption(o => o.setName('пользователь').setDescription('Чьи предупреждения').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const list = db.getWarnings(target.id);

    if (list.length === 0) return interaction.reply(`${EMOJI.CHECK} У <@${target.id}> нет предупреждений.`);

    const lines = list.map((w, i) => `**${i + 1}.** ${w.reason} — <@${w.moderatorId}>, <t:${Math.floor(w.date / 1000)}:R>`);
    const embed = new EmbedBuilder().setTitle(`${EMOJI.JAIL} Предупреждения — ${target.username}`).setDescription(lines.join('\n')).setColor(0xffe066);
    await interaction.reply({ embeds: [embed] });
  }
};
