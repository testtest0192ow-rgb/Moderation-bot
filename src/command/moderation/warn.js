const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Выдать предупреждение')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'warn',
            user: interaction.options.getUser('user'),
            reason: interaction.options.getString('reason')
        });
    }
};
