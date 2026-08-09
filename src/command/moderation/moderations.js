const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderation')
        .setDescription('Система модерации')

        // BAN
        .addSubcommand(sub =>
            sub.setName('ban')
                .setDescription('Забанить пользователя')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Причина'))
        )

        // MUTE
        .addSubcommand(sub =>
            sub.setName('mute')
                .setDescription('Замутить пользователя')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('time')
                        .setDescription('Время в минутах')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Причина'))
        )

        // WARN
        .addSubcommand(sub =>
            sub.setName('warn')
                .setDescription('Выдать предупреждение')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Причина')
                        .setRequired(true))
        )

        // UNMUTE
        .addSubcommand(sub =>
            sub.setName('unmute')
                .setDescription('Размутить пользователя')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь')
                        .setRequired(true))
        )

        // UNBAN
        .addSubcommand(sub =>
            sub.setName('unban')
                .setDescription('Разбанить пользователя')
                .addStringOption(option =>
                    option.setName('userid')
                        .setDescription('ID пользователя')
                        .setRequired(true))
        )

        // CLEAR
        .addSubcommand(sub =>
            sub.setName('clear')
                .setDescription('Удалить сообщения')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Количество')
                        .setRequired(true))
        )

        // HISTORY
        .addSubcommand(sub =>
            sub.setName('history')
                .setDescription('История наказаний')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Пользователь')
                        .setRequired(true))
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        // пока просто заглушка
        await interaction.reply({
            content: `Команда: ${subcommand} (в разработке)`,
            ephemeral: true
        });
    }
};
