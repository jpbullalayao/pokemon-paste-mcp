# Pokemon Paste MCP Server

An MCP (Model Context Protocol) server that creates Pokepastes from structured Pokemon set data using the `@pkmn/sets` library and the Pokepaste API.

## Installation

### From npm (Recommended)

```bash
npm install -g pokemon-paste-mcp
```

### From source

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


### MCP Client Configuration

Configure your MCP client (Claude Desktop, Cursor, etc.):

**Using remote npm package:**
```json
{
  "mcpServers": {
    "pokemon-paste": {
      "command": "npx",
      "args": ["pokemon-paste-mcp"],
      "env": {}
    }
  }
}
```

**Local development:**
```json
{
  "mcpServers": {
    "pokemon-paste": {
      "command": "node",
      "args": ["/path/to/pokemon-paste-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

## Testing

### Local MCP Tool Testing

You can test the local MCP server using the MCP Inspector:

```bash
npm run build
npx @modelcontextprotocol/inspector node path/to/pokemon-paste-mcp/dist/index.js
```

If you want to test the MCP server directly with your MCP client, use this complete test input:

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
      "level": 50,
      "shiny": false
    },
    {
      "name": "Charizard",
      "species": "Charizard",
      "item": "Charcoal",
      "ability": "Blaze",
      "moves": ["Flamethrower", "Air Slash", "Solar Beam", "Roost"],
      "nature": "Modest",
      "gender": "M",
      "evs": { "hp": 4, "atk": 0, "def": 0, "spa": 252, "spd": 0, "spe": 252 },
      "ivs": { "hp": 31, "atk": 0, "def": 31, "spa": 31, "spd": 31, "spe": 31 },
      "level": 50,
      "teraType": "Fire"
    },
    {
      "name": "Alakazam",
      "species": "Alakazam",
      "item": "Life Orb",
      "ability": "Magic Guard",
      "moves": ["Psychic", "Focus Blast", "Shadow Ball", "Recover"],
      "nature": "Timid",
      "gender": "M",
      "evs": { "hp": 4, "atk": 0, "def": 0, "spa": 252, "spd": 0, "spe": 252 },
      "ivs": { "hp": 31, "atk": 0, "def": 31, "spa": 31, "spd": 31, "spe": 31 },
      "level": 50,
      "shiny": true,
      "pokeball": "Ultra Ball"
    }
  ],
  "title": "Sample Competitive Team",
  "author": "Pokemon Trainer",
  "notes": "A balanced team with Pikachu as the main attacker, Charizard for coverage, and Alakazam for special sweeping."
}
```

This test input includes:
- Three diverse Pokemon with different roles
- Various optional fields (shiny, teraType, pokeball)
- Sample EV/IV spreads for competitive play
- Team metadata (title, author, notes)

The expected output should be a Pokepaste URL that you can visit to see the formatted team.

## Author's Note

Interested in the progress of this project? Feel free to follow the repo for live updates!

If you need to get a hold of me regarding this project, feel free to either:

- email me at professor.ragna@gmail.com
- tweet me [@professorragna](https://twitter.com/professorragna)

If you're interested in helping to fund this project, you can support me [here](https://www.buymeacoffee.com/professorragna). Any and all support is greatly appreciated!

## License

MIT