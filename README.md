# Pokemon Paste MCP Server

An MCP (Model Context Protocol) server that creates Pokepastes from structured Pokemon set data using the `@pkmn/sets` library and the Pokepaste API.

## Installation

```bash
npm install
npm run build
```

## Usage

The server provides a `create_pokepaste` tool that accepts Pokemon set data and creates a Pokepaste URL.

### Tool: create_pokepaste

Creates a Pokepaste from an array of Pokemon set objects.

**Parameters:**
- `pokemon` (array, required): Array of Pokemon set objects
- `title` (string, optional): Title for the paste
- `author` (string, optional): Author name
- `notes` (string, optional): Additional notes

**Pokemon Set Object Structure:**
```json
{
  "name": "string",
  "species": "string", 
  "item": "string",
  "ability": "string",
  "moves": ["string", "string", "string", "string"],
  "nature": "string",
  "gender": "string",
  "evs": {
    "hp": 0,
    "atk": 252,
    "def": 0,
    "spa": 4,
    "spd": 0,
    "spe": 252
  },
  "ivs": {
    "hp": 31,
    "atk": 31,
    "def": 31,
    "spa": 31,
    "spd": 31,
    "spe": 31
  },
  "level": 50,
  "shiny": false,
  "happiness": 255,
  "pokeball": "Poke Ball",
  "hpType": "Electric",
  "dynamaxLevel": 10,
  "gigantamax": false,
  "teraType": "Electric"
}
```

**Example Usage:**
```json
{
  "pokemon": [
    {
      "name": "Pikachu",
      "species": "Pikachu",
      "item": "Light Ball",
      "ability": "Static",
      "moves": ["Thunderbolt", "Quick Attack", "Iron Tail", "Agility"],
      "nature": "Jolly",
      "gender": "M",
      "evs": { "hp": 0, "atk": 252, "def": 0, "spa": 4, "spd": 0, "spe": 252 },
      "ivs": { "hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31 },
      "level": 50
    }
  ],
  "title": "My Team",
  "author": "Trainer"
}
```

## Development

- `npm run dev`: Watch mode for development
- `npm run build`: Build the project
- `npm start`: Start the server

## Configuration for Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "pokemon-paste": {
      "command": "node",
      "args": ["/path/to/pokemon-paste-mcp/build/index.js"],
      "env": {}
    }
  }
}
```