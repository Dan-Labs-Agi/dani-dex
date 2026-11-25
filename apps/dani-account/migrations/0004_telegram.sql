CREATE TABLE telegram_codes (
  code_hash TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE telegram_chats (
  host_id TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  bot_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  linked_at INTEGER NOT NULL,
  PRIMARY KEY (host_id, chat_id)
);
