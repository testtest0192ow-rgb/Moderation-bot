const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Очистка сообщений')
        .addIntegerOption(o => o.setName('amount').setDescription('Количество').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        const messages = await interaction.channel.bulkDelete(amount, true);

        await interaction.reply({
            content: `Удалено сообщений: ${messages.size}`,
            ephemeral: true
        });
    }
};
