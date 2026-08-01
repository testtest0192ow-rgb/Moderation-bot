const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Закрыть канал для обычных участников')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    await interaction.reply(`${EMOJI.SHIELD} Канал закрыт для отправки сообщений.`);
  }
};
