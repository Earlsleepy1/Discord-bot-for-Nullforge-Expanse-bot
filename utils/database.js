const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../nullforge.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Players table - tracks user statistics
    db.run(`
      CREATE TABLE IF NOT EXISTS players (
        userId TEXT PRIMARY KEY,
        username TEXT,
        scraplingKills INTEGER DEFAULT 0,
        chronoStalkerKills INTEGER DEFAULT 0,
        voidSentryKills INTEGER DEFAULT 0,
        automaton_defeats INTEGER DEFAULT 0,
        nullShardsCollected INTEGER DEFAULT 0,
        voidGearCores INTEGER DEFAULT 0,
        totalPlaytime INTEGER DEFAULT 0,
        joinedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table - logs Nullforge events
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        eventType TEXT,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES players(userId)
      )
    `);

    // Leaderboard cache table
    db.run(`
      CREATE TABLE IF NOT EXISTS leaderboard_cache (
        id INTEGER PRIMARY KEY,
        stat TEXT UNIQUE,
        data TEXT,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
};

// Player functions
const getPlayer = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM players WHERE userId = ?', [userId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const createPlayer = (userId, username) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO players (userId, username) VALUES (?, ?)',
      [userId, username],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const updatePlayerStat = (userId, stat, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE players SET ${stat} = ${stat} + ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?`,
      [value, userId],
      function(err) {
        if (err) reject(err);
        resolve(this.changes);
      }
    );
  });
};

const logEvent = (userId, eventType, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO events (userId, eventType, description) VALUES (?, ?, ?)',
      [userId, eventType, description],
      function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getLeaderboard = (stat, limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT userId, username, ${stat} as value FROM players ORDER BY ${stat} DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      }
    );
  });
};

const getPlayerEvents = (userId, limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM events WHERE userId = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, limit],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      }
    );
  });
};

module.exports = {
  db,
  initDatabase,
  getPlayer,
  createPlayer,
  updatePlayerStat,
  logEvent,
  getLeaderboard,
  getPlayerEvents,
};
