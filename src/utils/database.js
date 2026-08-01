// Лёгкая JSON-база без нативных зависимостей.
// ВАЖНО: на бесплатном Render диск эфемерный (сбрасывается при редеплое/перезапуске).
// Для продакшена лучше подключить настоящую БД (см. README -> "Хранение данных").
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ warnings: {}, modlogs: {}, afk: {}, removedWarnings: [] }, null, 2));
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  if (!db.removedWarnings) db.removedWarnings = [];
  return db;
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function addWarning(userId, reason, moderatorId) {
  const db = load();
  if (!db.warnings[userId]) db.warnings[userId] = [];
  db.warnings[userId].push({ reason, moderatorId, date: Date.now() });
  save(db);
  return db.warnings[userId];
}

function getWarnings(userId) {
  const db = load();
  return db.warnings[userId] || [];
}

function removeWarning(userId, index, removedBy) {
  const db = load();
  if (!db.warnings[userId] || !db.warnings[userId][index]) return null;
  const removed = db.warnings[userId].splice(index, 1)[0];
  db.removedWarnings.push({ userId, reason: removed.reason, originalModeratorId: removed.moderatorId, removedBy, removedAt: Date.now() });
  save(db);
  return removed;
}

function clearWarnings(userId, removedBy) {
  const db = load();
  const list = db.warnings[userId] || [];
  for (const w of list) {
    db.removedWarnings.push({ userId, reason: w.reason, originalModeratorId: w.moderatorId, removedBy, removedAt: Date.now() });
  }
  const count = list.length;
  db.warnings[userId] = [];
  save(db);
  return count;
}

function getRemovedWarnings(limit = 15) {
  const db = load();
  return db.removedWarnings.slice(-limit).reverse();
}

function addModLog(userId, action, moderatorId, reason) {
  const db = load();
  if (!db.modlogs[userId]) db.modlogs[userId] = [];
  db.modlogs[userId].push({ action, moderatorId, reason, date: Date.now() });
  save(db);
  return db.modlogs[userId];
}

function getModLogs(userId) {
  const db = load();
  return db.modlogs[userId] || [];
}

function setAfk(userId, reason) {
  const db = load();
  db.afk[userId] = { reason, since: Date.now() };
  save(db);
}

function getAfk(userId) {
  const db = load();
  return db.afk[userId] || null;
}

function removeAfk(userId) {
  const db = load();
  const had = !!db.afk[userId];
  delete db.afk[userId];
  save(db);
  return had;
}

module.exports = {
  addWarning,
  getWarnings,
  removeWarning,
  clearWarnings,
  getRemovedWarnings,
  addModLog,
  getModLogs,
  setAfk,
  getAfk,
  removeAfk
};
