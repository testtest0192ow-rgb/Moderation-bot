const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Информация о сервере'),
  async execute(interaction) {
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`📋 ${g.name}`)
      .setThumbnail(g.iconURL())
      .addFields(
        { name: '👑 Владелец', value: `<@${(await g.fetchOwner()).id}>`, inline: true },
        { name: '👥 Участников', value: `${g.memberCount}`, inline: true },
        { name: '📅 Создан', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '💬 Каналов', value: `${g.channels.cache.size}`, inline: true },
        { name: '🎭 Ролей', value: `${g.roles.cache.size}`, inline: true },
        { name: '🚀 Буст-уровень', value: `${g.premiumTier}`, inline: true }
      )
      .setColor(0x8a6bff);
    await interaction.reply({ embeds: [embed] });
  }
};
