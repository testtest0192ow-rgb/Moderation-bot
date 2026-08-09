const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('smute')
        .setDescription('Скрытый мут')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .addStringOption(o => o.setName('time').setDescription('Время').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'smute',
            user: interaction.options.getUser('user'),
            time: interaction.options.getString('time'),
            reason: interaction.options.getString('reason')
        });
    }
};
