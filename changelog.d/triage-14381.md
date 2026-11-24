### Fixed

- An agent can now see its saved API keys when dani-dex cannot update a copy of a Vault key. Before, the agent got "dani-dex could not save the API key. Try again." when it only asked for the list of keys, and each retry failed the same way. When dani-dex cannot read the keys at all, the agent now gets a correct message, and the log shows the cause.
