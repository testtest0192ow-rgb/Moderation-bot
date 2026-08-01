const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Информация о пользователе')
    .addUserOption(o => o.setName('пользователь').setDescription('О ком показать').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('пользователь') || interaction.user;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '🆔 ID', value: target.id, inline: true },
        { name: '📅 Аккаунт создан', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 На сервере с', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : '—', inline: true },
        { name: '🎭 Роли', value: member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(', ') || 'Нет' : '—' }
      )
      .setColor(0x8a6bff);
    await interaction.reply({ embeds: [embed] });
  }
};
