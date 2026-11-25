CREATE TABLE remote_hosts (
  host_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  membership_id TEXT NOT NULL,
  device_public_key TEXT,
  auth_epoch INTEGER NOT NULL DEFAULT 1,
  machine_token_hash TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX remote_hosts_user ON remote_hosts(user_id);
CREATE TABLE mobile_tickets (
  ticket_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  host_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE account_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  platform TEXT,
  host_id TEXT,
  created_at INTEGER NOT NULL,
  last_active INTEGER NOT NULL
);
CREATE INDEX account_sessions_user ON account_sessions(user_id);
CREATE TABLE remote_sessions (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  ended INTEGER NOT NULL DEFAULT 0
);
