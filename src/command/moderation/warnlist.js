const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const warns = require('../../database/moderation/warns');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('Количество варнов')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const count = warns.get(user.id);

        await interaction.reply({
            content: `Варны: ${count || 0}`,
            ephemeral: true
        });
    }
};
