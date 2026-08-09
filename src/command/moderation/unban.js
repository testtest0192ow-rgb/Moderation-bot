const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Разбанить')
        .addStringOption(o => o.setName('userid').setDescription('ID пользователя').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'unban',
            userId: interaction.options.getString('userid')
        });
    }
};
