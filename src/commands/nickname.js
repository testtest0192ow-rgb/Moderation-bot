const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Изменить никнейм участника')
    .addUserOption(o => o.setName('пользователь').setDescription('Кому').setRequired(true))
    .addStringOption(o => o.setName('никнейм').setDescription('Новый никнейм (пусто — сбросить)').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const nickname = interaction.options.getString('никнейм') || null;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Участник не найден.', ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: `${EMOJI.CROSS} Недостаточно прав, чтобы изменить ник этого пользователя.`, ephemeral: true });

    await member.setNickname(nickname);
    const embed = new EmbedBuilder()
      .setDescription(`${EMOJI.CHECK} Никнейм <@${target.id}> изменён на: **${nickname || member.user.username}**`)
      .setColor(0x6bffb0);
    await interaction.reply({ embeds: [embed] });
  }
};
