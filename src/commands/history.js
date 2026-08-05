const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('История пользователя')
    .addUserOption(o => o.setName('user').setRequired(true)),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');

    const data = await client.db.collection('punishments')
      .find({ userId: user.id }).toArray();

    if (!data.length) {
      return interaction.reply({ content: 'История пуста', ephemeral: true });
    }

    const text = data.map(p =>
      `• ${p.type} | ${p.reason}`
    ).join('\n');

    interaction.reply({
      embeds: [{
        description:
`━━━━━━━━━━━━━━━━
История <@${user.id}>

${text}
━━━━━━━━━━━━━━━━`
      }]
    });
  }
};
