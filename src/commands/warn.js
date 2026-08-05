const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Выдать предупреждение')
    .addUserOption(o => o.setName('user').setRequired(true))
    .addStringOption(o => o.setName('reason')),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Не указана';

    const db = client.db;

    const warns = await db.collection('warns').countDocuments({ userId: user.id });

    let duration = 0;

    if (warns === 0) duration = 4 * 60 * 60 * 1000;
    if (warns === 1) duration = 8 * 60 * 60 * 1000;
    if (warns >= 2) duration = 24 * 60 * 60 * 1000;

    const member = await interaction.guild.members.fetch(user.id);

    if (warns >= 2) {
      await member.timeout(duration, "3 предупреждения");
    }

    await db.collection('warns').insertOne({
      userId: user.id,
      reason,
      createdAt: Date.now()
    });

    interaction.reply({
      embeds: [{
        description:
`━━━━━━━━━━━━━━━━
• Пользователь: <@${user.id}>
• Варн #${warns + 1}
• Причина: ${reason}
━━━━━━━━━━━━━━━━`
      }]
    });
  }
};
