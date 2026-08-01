const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const EMOJI = require('../utils/emojis');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function loadWarnings() {
  if (!fs.existsSync(DB_PATH)) return {};
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  return db.warnings || {};
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tierlist')
    .setDescription('Список всех участников с предупреждениями (кто сколько получил)'),

  async execute(interaction) {
    const warnings = loadWarnings();
    const entries = Object.entries(warnings).filter(([, list]) => list.length > 0);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('view_removed_warnings').setLabel('🗑️ Снятые предупреждения').setStyle(ButtonStyle.Secondary)
    );

    if (entries.length === 0) {
      return interaction.reply({ content: `${EMOJI.CHECK} Ни у кого нет предупреждений — чистый сервер.`, components: [row] });
    }

    entries.sort((a, b) => b[1].length - a[1].length);

    const medals = ['🥇', '🥈', '🥉'];
    const lines = entries.slice(0, 20).map(([userId, list], i) => {
      const prefix = medals[i] || `${i + 1}.`;
      const lastMod = list[list.length - 1].moderatorId;
      return `${prefix} <@${userId}> — **${list.length}** предупреждений (последнее от <@${lastMod}>)`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`${EMOJI.JAIL} Тирлист предупреждений`)
      .setDescription(lines.join('\n'))
      .setFooter({ text: `Всего участников с предупреждениями: ${entries.length}` })
      .setColor(0xffe066);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
