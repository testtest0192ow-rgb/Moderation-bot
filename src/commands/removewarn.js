const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { getOrCreateRole, removeRoleSafe, WARNED_ROLE_NAME } = require('../utils/roles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Удалить конкретное предупреждение по номеру')
    .addUserOption(o => o.setName('пользователь').setDescription('У кого').setRequired(true))
    .addIntegerOption(o => o.setName('номер').setDescription('Номер предупреждения из /warnings (начиная с 1)').setRequired(true).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const index = interaction.options.getInteger('номер') - 1;
    const removed = db.removeWarning(target.id, index);

    if (!removed) return interaction.reply({ content: 'Предупреждение с таким номером не найдено.', ephemeral: true });

    // Если предупреждений больше не осталось — снимаем роль Warned
    const remaining = db.getWarnings(target.id);
    if (remaining.length === 0) {
      const member = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (member) {
        const warnedRole = await getOrCreateRole(interaction.guild, WARNED_ROLE_NAME, '#ffe066');
        await removeRoleSafe(member, warnedRole);
      }
    }

    const embed = new EmbedBuilder().setDescription(`${EMOJI.CHECK} Удалено предупреждение у <@${target.id}>: "${removed.reason}"`).setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
