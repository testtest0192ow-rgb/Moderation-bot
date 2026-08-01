const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { getOrCreateRole, removeRoleSafe, MUTED_ROLE_NAME } = require('../utils/roles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Снять мут с пользователя')
    .addUserOption(o => o.setName('пользователь').setDescription('С кого снять мут').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Участник не найден.', ephemeral: true });

    await member.timeout(null);

    const mutedRole = await getOrCreateRole(interaction.guild, MUTED_ROLE_NAME, '#818386');
    await removeRoleSafe(member, mutedRole);

    db.addModLog(target.id, 'Снятие мута', interaction.user.id, '—');
    const embed = new EmbedBuilder().setDescription(`${EMOJI.CHECK} Мут снят с <@${target.id}>.`).setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
