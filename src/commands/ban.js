const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Забанить пользователя')
    .addUserOption(o => o.setName('пользователь').setDescription('Кого забанить').setRequired(true))
    .addStringOption(o => o.setName('причина').setDescription('Причина бана').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const reason = interaction.options.getString('причина') || 'Без причины';
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Не удалось найти этого участника на сервере.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: 'У меня недостаточно прав, чтобы забанить этого пользователя.', ephemeral: true });

    // Стучимся в ЛС ДО бана — после бана бот и пользователь теряют общий сервер,
    // и Discord перестаёт разрешать отправку личных сообщений.
    const dmEmbed = new EmbedBuilder()
      .setTitle(`${EMOJI.POLICE} Тебя забанили`)
      .setDescription(`Сервер: **${interaction.guild.name}**\nПричина: ${reason}`)
      .setColor(0xff4d4d);
    const dmSent = await target.send({ embeds: [dmEmbed] }).then(() => true).catch(() => false);

    await member.ban({ reason });
    db.addModLog(target.id, 'Бан', interaction.user.id, reason);

    const embed = new EmbedBuilder()
      .setDescription(`${EMOJI.POLICE} <@${target.id}> забанен.\nПричина: ${reason}${dmSent ? '' : '\n*(не удалось отправить ЛС — закрыты у пользователя)*'}`)
      .setColor(0xff4d4d);
    await interaction.reply({ embeds: [embed] });
  }
};
