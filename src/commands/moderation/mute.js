const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Выдать мут')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .addStringOption(o => o.setName('time').setDescription('Время (10m, 4h)').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Причина').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const time = interaction.options.getString('time');
        const reason = interaction.options.getString('reason');

        await executor.execute(interaction, {
            type: 'mute',
            user,
            time,
            reason
        });
    }
};
