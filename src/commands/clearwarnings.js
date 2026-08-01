const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { getOrCreateRole, removeRoleSafe, WARNED_ROLE_NAME } = require('../utils/roles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Очистить все предупреждения пользователя')
    .addUserOption(o => o.setName('пользователь').setDescription('У кого очистить').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const count = db.clearWarnings(target.id, interaction.user.id);

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (member) {
      const warnedRole = await getOrCreateRole(interaction.guild, WARNED_ROLE_NAME, '#ffe066');
      await removeRoleSafe(member, warnedRole);
    }

    const embed = new EmbedBuilder().setDescription(`${EMOJI.CHECK} Очищено предупреждений у <@${target.id}>: **${count}**`).setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
