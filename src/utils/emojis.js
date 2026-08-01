// Кастомные эмодзи сервера. Формат <:имя:ID> — Discord рендерит по ID,
// поле "имя" может не совпадать с реальным названием эмодзи на сервере.
const EMOJI = {
  CHECK: '<:emoji_7:1530158205127102474>',   // ✅ успех
  CROSS: '<:emoji_9:1530158250459267172>',   // ❌ ошибка/отказ
  CROWN: '<:emoji_7:1530158164765446227>',   // 👑 админ/владелец
  POLICE: '<:emoji_26:1530160752034320446>', // 👮 бан/кик
  JAIL: '<:emoji_27:1530160785932685344>',   // ⛓️ бан/мут
  SHIELD: '<:emoji_38:1530161174509781194>', // 🛡️ lock/автомодерация
  ARROW_LEFT: '<:emoji_39:1530161202360090724>',
  ARROW_RIGHT: '<:emoji_41:1530161256609218610>'
};

function toComponentEmoji(tag) {
  const match = tag.match(/<:([a-zA-Z0-9_]+):(\d+)>/);
  if (!match) return null;
  return { name: match[1], id: match[2] };
}

module.exports = { ...EMOJI, toComponentEmoji };
