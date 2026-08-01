const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const CATEGORIES = {
  moderation: {
    label: '🛡️ Модерация',
    names: ['ban', 'kick', 'timeout', 'untimeout', 'warn', 'warnings', 'removewarn', 'clearwarnings', 'unban', 'tierlist', 'modlogs', 'lock', 'unlock', 'slowmode', 'clear', 'giverole', 'removerole', 'createrole', 'nickname']
  },
  utility: {
    label: '🔧 Утилиты',
    names: ['ping', 'serverinfo', 'userinfo', 'avatar', 'help']
  }
};

function buildHelpView(client, categoryKey = 'moderation') {
  const category = CATEGORIES[categoryKey] || CATEGORIES.moderation;

  const lines = category.names
    .map(name => {
      const cmd = client.commands.get(name);
      return cmd ? `\`/${name}\` — ${cmd.data.description}` : null;
    })
    .filter(Boolean);

  const embed = new EmbedBuilder()
    .setTitle(`📖 Команды бота — ${category.label}`)
    .setDescription(lines.join('\n'))
    .setFooter({ text: 'Выбери категорию ниже, чтобы посмотреть другие команды' })
    .setColor(0x8a6bff);

  const menu = new StringSelectMenuBuilder()
    .setCustomId('help_category_select')
    .setPlaceholder('Выбери категорию команд')
    .addOptions(
      Object.entries(CATEGORIES).map(([key, cat]) => ({
        label: cat.label,
        value: key,
        default: key === categoryKey
      }))
    );

  const row = new ActionRowBuilder().addComponents(menu);
  return { embed, row };
}

module.exports = { buildHelpView };
