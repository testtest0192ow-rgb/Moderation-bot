const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { getOrCreateRole, addRoleSafe, MUTED_ROLE_NAME } = require('../utils/roles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Замутить пользователя на N минут')
    .addUserOption(o => o.setName('пользователь').setDescription('Кого замутить').setRequired(true))
    .addIntegerOption(o => o.setName('минуты').setDescription('На сколько минут').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('причина').setDescription('Причина').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const minutes = interaction.options.getInteger('минуты');
    const reason = interaction.options.getString('причина') || 'Без причины';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Участник не найден.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: 'Недостаточно прав для мута.', ephemeral: true });

    await member.timeout(minutes * 60 * 1000, reason);

    const mutedRole = await getOrCreateRole(interaction.guild, MUTED_ROLE_NAME, '#818386');
    await addRoleSafe(member, mutedRole);

    db.addModLog(target.id, `Мут (${minutes} мин.)`, interaction.user.id, reason);

    const dmEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI.JAIL} Тебя замутили`)
      .setDescription(`Сервер: **${interaction.guild.name}**\nДлительность: ${minutes} мин.\nПричина: ${reason}`)
      .setColor(0xffd76b);
    const dmSent = await target.send({ embeds: [dmEmbed] }).then(() => true).catch(() => false);

    const embed = new EmbedBuilder()
      .setDescription(`${EMOJI.JAIL} <@${target.id}> замучен на **${minutes} мин.**\nПричина: ${reason}${dmSent ? '' : '\n*(не удалось отправить ЛС)*'}`)
      .setColor(0xffd76b);
    await interaction.reply({ embeds: [embed] });
  }
};
