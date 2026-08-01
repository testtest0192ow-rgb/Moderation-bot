const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const EMOJI = require('../utils/emojis');

function normalizeHex(input) {
  const clean = input.trim().replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return null;
  return `#${clean.toUpperCase()}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Создать новую роль с выбранным HEX-цветом')
    .addStringOption(o => o.setName('название').setDescription('Название роли').setRequired(true))
    .addStringOption(o => o.setName('цвет').setDescription('HEX-код цвета, например FF6BD6 или #FF6BD6').setRequired(true))
    .addUserOption(o => o.setName('пользователь').setDescription('Сразу выдать роль этому пользователю').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const name = interaction.options.getString('название');
    const rawColor = interaction.options.getString('цвет');
    const target = interaction.options.getUser('пользователь');

    const color = normalizeHex(rawColor);
    if (!color) {
      return interaction.reply({ content: `${EMOJI.CROSS} Некорректный HEX-цвет. Пример правильного формата: \`FF6BD6\` или \`#FF6BD6\`.`, ephemeral: true });
    }

    const role = await interaction.guild.roles.create({
      name,
      color,
      reason: `Создано через /createrole пользователем ${interaction.user.tag}`
    });

    let assignedText = '';
    if (target) {
      const member = await interaction.guild.members.fetch(target.id).catch(() => null);
      if (member) {
        await member.roles.add(role);
        assignedText = `\nВыдана: <@${target.id}>`;
      }
    }

    const embed = new EmbedBuilder()
      .setDescription(`${EMOJI.CHECK} Роль ${role} создана с цветом \`${color}\`${assignedText}`)
      .setColor(color);
    await interaction.reply({ embeds: [embed] });
  }
};
