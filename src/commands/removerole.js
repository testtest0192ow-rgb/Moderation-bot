const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Убрать роль у пользователя')
    .addUserOption(o => o.setName('пользователь').setDescription('У кого').setRequired(true))
    .addRoleOption(o => o.setName('роль').setDescription('Какую роль убрать').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const role = interaction.options.getRole('роль');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Участник не найден.', ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: `${EMOJI.CROSS} Эта роль выше моей — не могу её убрать.`, ephemeral: true });
    }

    await member.roles.remove(role);
    const embed = new EmbedBuilder().setDescription(`${EMOJI.CHECK} Роль ${role} убрана у <@${target.id}>`).setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
