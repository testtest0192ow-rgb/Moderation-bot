const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');
const EMOJI = require('../utils/emojis');
const { getOrCreateRole, addRoleSafe, MUTED_ROLE_NAME, WARNED_ROLE_NAME } = require('../utils/roles');

const TIERS = { MUTE_AT: 3, MUTE_MINUTES: 60, KICK_AT: 5, BAN_AT: 7 };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Выдать предупреждение пользователю')
    .addUserOption(o => o.setName('пользователь').setDescription('Кому').setRequired(true))
    .addStringOption(o => o.setName('причина').setDescription('Причина').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('пользователь');
    const reason = interaction.options.getString('причина');
    const warnings = db.addWarning(target.id, reason, interaction.user.id);
    db.addModLog(target.id, 'Предупреждение', interaction.user.id, reason);

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    let escalation = null;

    if (member) {
      const warnedRole = await getOrCreateRole(interaction.guild, WARNED_ROLE_NAME, '#ffe066');
      await addRoleSafe(member, warnedRole);

      const count = warnings.length;
      if (count >= TIERS.BAN_AT && member.bannable) {
        await member.ban({ reason: `Автобан: достигнут порог в ${TIERS.BAN_AT} предупреждений` });
        db.addModLog(target.id, 'Автобан (по варнам)', interaction.client.user.id, `Достигнут порог ${TIERS.BAN_AT} предупреждений`);
        escalation = `${EMOJI.POLICE} Автобан — достигнут порог **${TIERS.BAN_AT}** предупреждений.`;
      } else if (count >= TIERS.KICK_AT && member.kickable) {
        await member.kick(`Автокик: достигнут порог в ${TIERS.KICK_AT} предупреждений`);
        db.addModLog(target.id, 'Автокик (по варнам)', interaction.client.user.id, `Достигнут порог ${TIERS.KICK_AT} предупреждений`);
        escalation = `${EMOJI.POLICE} Автокик — достигнут порог **${TIERS.KICK_AT}** предупреждений.`;
      } else if (count >= TIERS.MUTE_AT && member.moderatable) {
        await member.timeout(TIERS.MUTE_MINUTES * 60 * 1000, `Автомут: достигнут порог в ${TIERS.MUTE_AT} предупреждений`);
        const mutedRole = await getOrCreateRole(interaction.guild, MUTED_ROLE_NAME, '#818386');
        await addRoleSafe(member, mutedRole);
        db.addModLog(target.id, 'Автомут (по варнам)', interaction.client.user.id, `Достигнут порог ${TIERS.MUTE_AT} предупреждений`);
        escalation = `${EMOJI.JAIL} Автомут на **${TIERS.MUTE_MINUTES} мин.** — достигнут порог **${TIERS.MUTE_AT}** предупреждений.`;
      }
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle('⚠️ Тебе выдали предупреждение')
      .setDescription(`Сервер: **${interaction.guild.name}**\nПричина: ${reason}\nВсего предупреждений: ${warnings.length}${escalation ? `\n\n${escalation}` : ''}`)
      .setColor(0xffe066);
    const dmSent = await target.send({ embeds: [dmEmbed] }).then(() => true).catch(() => false);

    const embed = new EmbedBuilder()
      .setDescription(`⚠️ <@${target.id}> получил предупреждение (всего: ${warnings.length})\nПричина: ${reason}${escalation ? `\n${escalation}` : ''}${dmSent ? '' : '\n*(не удалось отправить ЛС)*'}`)
      .setColor(0xffe066);
    await interaction.reply({ embeds: [embed] });
  }
};
