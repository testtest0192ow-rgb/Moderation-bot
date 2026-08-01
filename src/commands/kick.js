const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Выгнать пользователя с сервера')
    .addUserOption(o => o.setName('пользователь').setDescription('Кого выгнать').setRequired(true))
    .addStringOption(o => o.setName('причина').setDescription('Причина').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const reason = interaction.options.getString('причина') || 'Без причины';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Не удалось найти этого участника.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: 'Недостаточно прав для кика.', ephemeral: true });

    const dmEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI.POLICE} Тебя выгнали с сервера`)
      .setDescription(`Сервер: **${interaction.guild.name}**\nПричина: ${reason}`)
      .setColor(0xffa64d);
    const dmSent = await target.send({ embeds: [dmEmbed] }).then(() => true).catch(() => false);

    await member.kick(reason);
    db.addModLog(target.id, 'Кик', interaction.user.id, reason);

    const embed = new EmbedBuilder()
      .setDescription(`${EMOJI.POLICE} <@${target.id}> выгнан с сервера.\nПричина: ${reason}${dmSent ? '' : '\n*(не удалось отправить ЛС)*'}`)
      .setColor(0xffa64d);
    await interaction.reply({ embeds: [embed] });
  }
};
