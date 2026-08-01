const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('Выдать роль пользователю')
    .addUserOption(o => o.setName('пользователь').setDescription('Кому').setRequired(true))
    .addRoleOption(o => o.setName('роль').setDescription('Какую роль выдать').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const role = interaction.options.getRole('роль');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Участник не найден.', ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ content: `${EMOJI.CROSS} Эта роль выше моей — не могу её выдать.`, ephemeral: true });
    }

    await member.roles.add(role);
    const embed = new EmbedBuilder().setDescription(`${EMOJI.CHECK} Роль ${role} выдана <@${target.id}>`).setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
