// Утилита для авто-ролей "Muted" и "Warned".
// Роль создаётся один раз на сервере (если её ещё нет) и переиспользуется дальше.

async function getOrCreateRole(guild, name, color) {
  let role = guild.roles.cache.find(r => r.name === name);
  if (!role) {
    role = await guild.roles.create({
      name,
      color,
      reason: `Автоматически создано ботом для системы модерации (${name})`
    });
  }
  return role;
}

async function addRoleSafe(member, role) {
  if (!role) return false;
  if (role.position >= member.guild.members.me.roles.highest.position) return false; // бот не может выдать роль выше своей
  if (member.roles.cache.has(role.id)) return true;
  await member.roles.add(role);
  return true;
}

async function removeRoleSafe(member, role) {
  if (!role) return false;
  if (!member.roles.cache.has(role.id)) return true;
  await member.roles.remove(role);
  return true;
}

module.exports = {
  getOrCreateRole,
  addRoleSafe,
  removeRoleSafe,
  MUTED_ROLE_NAME: 'Muted',
  WARNED_ROLE_NAME: 'Warned'
};
