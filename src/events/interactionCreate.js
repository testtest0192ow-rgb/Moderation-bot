const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { buildModlogsView } = require('../utils/modlogsView');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        const payload = { content: '❌ Произошла ошибка при выполнении команды.', ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(payload);
        else await interaction.reply(payload);
      }
      return;
    }

    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('modlogs_page:')) {
      const [, targetId, pageStr] = interaction.customId.split(':');
      const page = parseInt(pageStr, 10);
      const target = await interaction.client.users.fetch(targetId).catch(() => null);
      if (!target) return interaction.reply({ content: `${EMOJI.CROSS} Пользователь не найден.`, ephemeral: true });

      const logs = db.getModLogs(targetId);
      const { embed, row } = buildModlogsView(targetId, target.username, logs, page);
      await interaction.update({ embeds: [embed], components: [row] });
      return;
    }

    if (interaction.customId === 'view_removed_warnings') {
      const hasPerms = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);
      if (!hasPerms) {
        return interaction.reply({ content: `${EMOJI.CROSS} Только модераторы могут смотреть эту историю.`, ephemeral: true });
      }

      const removed = db.getRemovedWarnings(15);
      if (removed.length === 0) {
        return interaction.reply({ content: `${EMOJI.CHECK} Пока никто не снимал предупреждения.`, ephemeral: true });
      }

      const lines = removed.map(r =>
        `<@${r.userId}> — "${r.reason}"\n└ снял <@${r.removedBy}>, <t:${Math.floor(r.removedAt / 1000)}:R>`
      );

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Снятые предупреждения')
        .setDescription(lines.join('\n\n'))
        .setFooter({ text: `Показаны последние ${removed.length}` })
        .setColor(0x8a6bff);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
