CREATE TABLE mobile_links (
  link_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  host_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX mobile_links_user_host ON mobile_links(user_id, host_id);
