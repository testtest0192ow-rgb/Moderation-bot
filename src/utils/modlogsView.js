const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EMOJI = require('./emojis');

const PER_PAGE = 5;

function buildModlogsView(targetId, username, logs, page = 0) {
  const sorted = [...logs].reverse();
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  const pageItems = sorted.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  const lines = pageItems.length
    ? pageItems.map(l => `**${l.action}** — <@${l.moderatorId}>, <t:${Math.floor(l.date / 1000)}:R>\n└ ${l.reason}`)
    : ['Пока пусто.'];

  const embed = new EmbedBuilder()
    .setTitle(`${EMOJI.JAIL} История модерации — ${username}`)
    .setDescription(lines.join('\n\n'))
    .setFooter({ text: `Страница ${safePage + 1}/${totalPages} · Всего записей: ${sorted.length}` })
    .setColor(0xffa64d);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`modlogs_page:${targetId}:${safePage - 1}`)
      .setEmoji(EMOJI.toComponentEmoji(EMOJI.ARROW_LEFT))
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(safePage === 0),
    new ButtonBuilder()
      .setCustomId(`modlogs_page:${targetId}:${safePage + 1}`)
      .setEmoji(EMOJI.toComponentEmoji(EMOJI.ARROW_RIGHT))
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(safePage >= totalPages - 1)
  );

  return { embed, row };
}

module.exports = { buildModlogsView };
