module.exports = async (message, client) => {
  if (message.author.bot) return;

  const links = /(https?:\/\/)/;

  if (links.test(message.content)) {
    await message.delete();

    await client.db.collection('alerts').insertOne({
      userId: message.author.id,
      content: message.content,
      createdAt: Date.now()
    });

    const modChannel = message.guild.channels.cache.find(c => c.name === "mod-logs");

    if (modChannel) {
      modChannel.send(
`⚠️ Обнаружена ссылка

• Пользователь: <@${message.author.id}>
• Сообщение удалено`
      );
    }
  }
};
