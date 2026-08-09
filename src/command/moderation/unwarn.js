const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const executor = require('../../systems/moderation/executor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Снять предупреждение')
        .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await executor.execute(interaction, {
            type: 'unwarn',
            user: interaction.options.getUser('user')
        });
    }
};
