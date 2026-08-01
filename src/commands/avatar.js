const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Показать аватар пользователя в полном размере')
    .addUserOption(o => o.setName('пользователь').setDescription('Чей аватар').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('пользователь') || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Аватар — ${target.username}`)
      .setImage(target.displayAvatarURL({ size: 1024 }))
      .setColor(0x8a6bff);
    await interaction.reply({ embeds: [embed] });
  }
};
