// Лёгкая JSON-база без нативных зависимостей.
// ВАЖНО: на бесплатном Render диск эфемерный (сбрасывается при редеплое/перезапуске).
// Для продакшена лучше подключить настоящую БД (см. README -> "Хранение данных").
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ warnings: {}, modlogs: {}, afk: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
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

function removeWarning(userId, index) {
  const db = load();
  if (!db.warnings[userId] || !db.warnings[userId][index]) return null;
  const removed = db.warnings[userId].splice(index, 1)[0];
  save(db);
  return removed;
}

function clearWarnings(userId) {
  const db = load();
  const count = (db.warnings[userId] || []).length;
  db.warnings[userId] = [];
  save(db);
  return count;
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
  addModLog,
  getModLogs,
  setAfk,
  getAfk,
  removeAfk
};
