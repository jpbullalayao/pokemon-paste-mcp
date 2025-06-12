#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { Sets } from "@pkmn/sets";
import fetch from "node-fetch";

const StatIDSchema = z.enum(['hp', 'atk', 'def', 'spa', 'spd', 'spe']);
const StatsTableSchema = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  spa: z.number(),
  spd: z.number(),
  spe: z.number(),
});

const PokemonSetSchema = z.object({
  name: z.string(),
  species: z.string(),
  item: z.string(),
  ability: z.string(),
  moves: z.array(z.string()),
  nature: z.string(),
  gender: z.string(),
  evs: StatsTableSchema,
  ivs: StatsTableSchema,
  level: z.number(),
  shiny: z.boolean().optional(),
  happiness: z.number().optional(),
  pokeball: z.string().optional(),
  hpType: z.string().optional(),
  dynamaxLevel: z.number().optional(),
  gigantamax: z.boolean().optional(),
  teraType: z.string().optional(),
});

const CreatePokepasteSchema = z.object({
  pokemon: z.array(PokemonSetSchema),
  title: z.string().optional(),
  author: z.string().optional(),
  notes: z.string().optional(),
});

const server = new Server(
  {
    name: "pokemon-paste-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function createPokepaste(pokemonSets: any[], title?: string, author?: string, notes?: string): Promise<string> {
  const pokemonStrings = pokemonSets.map(set => Sets.exportSet(set));
  const pasteContent = pokemonStrings.join('\n\n');
  
  const formData = new URLSearchParams();
  formData.append('paste', pasteContent);
  
  if (title) formData.append('title', title);
  if (author) formData.append('author', author);
  if (notes) formData.append('notes', notes);

  const response = await fetch('https://pokepast.es/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    redirect: 'manual'
  });

  if (response.status === 303) {
    const location = response.headers.get('location');
    if (location) {
      return `https://pokepast.es${location}`;
    }
  }
  
  throw new Error(`Failed to create pokepaste: ${response.status} ${response.statusText}`);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_pokepaste",
        description: "Create a Pokepaste from Pokemon set data",
        inputSchema: {
          type: "object",
          properties: {
            pokemon: {
              type: "array",
              description: "Array of Pokemon set objects",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Pokemon nickname" },
                  species: { type: "string", description: "Pokemon species" },
                  item: { type: "string", description: "Held item" },
                  ability: { type: "string", description: "Pokemon ability" },
                  moves: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of move names"
                  },
                  nature: { type: "string", description: "Pokemon nature" },
                  gender: { type: "string", description: "Pokemon gender (M/F/N)" },
                  evs: {
                    type: "object",
                    description: "Effort Values",
                    properties: {
                      hp: { type: "number" },
                      atk: { type: "number" },
                      def: { type: "number" },
                      spa: { type: "number" },
                      spd: { type: "number" },
                      spe: { type: "number" }
                    },
                    required: ["hp", "atk", "def", "spa", "spd", "spe"]
                  },
                  ivs: {
                    type: "object",
                    description: "Individual Values",
                    properties: {
                      hp: { type: "number" },
                      atk: { type: "number" },
                      def: { type: "number" },
                      spa: { type: "number" },
                      spd: { type: "number" },
                      spe: { type: "number" }
                    },
                    required: ["hp", "atk", "def", "spa", "spd", "spe"]
                  },
                  level: { type: "number", description: "Pokemon level" },
                  shiny: { type: "boolean", description: "Is shiny", default: false },
                  happiness: { type: "number", description: "Pokemon happiness" },
                  pokeball: { type: "string", description: "Pokeball type" },
                  hpType: { type: "string", description: "Hidden Power type" },
                  dynamaxLevel: { type: "number", description: "Dynamax level" },
                  gigantamax: { type: "boolean", description: "Can Gigantamax" },
                  teraType: { type: "string", description: "Tera type" }
                },
                required: ["name", "species", "item", "ability", "moves", "nature", "gender", "evs", "ivs", "level"]
              }
            },
            title: { type: "string", description: "Optional title for the paste" },
            author: { type: "string", description: "Optional author name" },
            notes: { type: "string", description: "Optional notes" }
          },
          required: ["pokemon"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "create_pokepaste") {
    try {
      const validatedArgs = CreatePokepasteSchema.parse(args);
      const url = await createPokepaste(
        validatedArgs.pokemon,
        validatedArgs.title,
        validatedArgs.author,
        validatedArgs.notes
      );
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully created Pokepaste: ${url}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating Pokepaste: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});