const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunmute')
        .setDescription('Снять скрытый мут')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'sunmute',
            user: interaction.options.getUser('user')
        });
    }
};
