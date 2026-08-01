const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EMOJI = require('../utils/emojis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Открыть канал обратно')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    await interaction.reply(`${EMOJI.SHIELD} Канал снова открыт.`);
  }
};
