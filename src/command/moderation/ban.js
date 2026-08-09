const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Забанить пользователя')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'ban',
            user: interaction.options.getUser('user'),
            reason: interaction.options.getString('reason')
        });
    }
};
