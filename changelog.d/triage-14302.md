### Fixed

- A Gemini agent now gets the tools of a local MCP server that is slow to start, such as Serena, sooner. Gemini waits only 5 seconds for a server when a chat starts. Before, dani-dex then stopped the server and started it again from zero, so its tools came some messages later or not at all. dani-dex now keeps the server running and gives it to Gemini when Gemini asks again, so the tools are there from the next message.
