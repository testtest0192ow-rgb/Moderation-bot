const { SlashCommandBuilder } = require('discord.js');
const menu = require('../../interactions/moderation/history/menu');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('История пользователя')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        await interaction.reply({
            content: `История нарушений\n\nПользователь: ${user}`,
            components: [menu(user.id)],
            ephemeral: true
        });
    }
};
