import { test, describe, expect } from 'vitest';
import { Sets } from '@pkmn/sets';

const samplePokemonSet = {
  name: "Pikachu",
  species: "Pikachu",
  item: "Light Ball",
  ability: "Static",
  moves: ["Thunderbolt", "Quick Attack", "Iron Tail", "Agility"],
  nature: "Jolly",
  gender: "M",
  evs: { hp: 0, atk: 252, def: 0, spa: 4, spd: 0, spe: 252 },
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  level: 50
};

const sampleTeam = [
  samplePokemonSet,
  {
    name: "Charizard",
    species: "Charizard",
    item: "Charcoal",
    ability: "Blaze",
    moves: ["Flamethrower", "Air Slash", "Solar Beam", "Roost"],
    nature: "Modest",
    gender: "M",
    evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
    ivs: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 },
    level: 50
  }
];

describe('Pokemon Set Export Tests', () => {
  test('should export a single Pokemon set correctly', () => {
    const exported = Sets.exportSet(samplePokemonSet);
    
    expect(exported).toBeTypeOf('string');
    expect(exported).toContain('Pikachu (M) @ Light Ball');
    expect(exported).toContain('Ability: Static');
    expect(exported).toContain('Level: 50');
    expect(exported).toContain('EVs: 252 Atk / 4 SpA / 252 Spe');
    expect(exported).toContain('Jolly Nature');
    expect(exported).toContain('- Thunderbolt');
    expect(exported).toContain('- Quick Attack');
  });

  test('should handle Pokemon with zero attack IV', () => {
    const specialAttacker = {
      ...samplePokemonSet,
      name: "Alakazam",
      species: "Alakazam",
      item: "Life Orb",
      ability: "Magic Guard",
      moves: ["Psychic", "Focus Blast", "Shadow Ball", "Recover"],
      nature: "Timid",
      evs: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
      ivs: { hp: 31, atk: 0, def: 31, spa: 31, spd: 31, spe: 31 }
    };

    const exported = Sets.exportSet(specialAttacker);
    expect(exported).toContain('IVs: 0 Atk');
  });

  test('should handle optional fields', () => {
    const shinyPokemon = {
      ...samplePokemonSet,
      shiny: true,
      happiness: 0,
      pokeball: "Premier Ball",
      teraType: "Electric"
    };

    const exported = Sets.exportSet(shinyPokemon);
    expect(exported).toBeTypeOf('string');
  });
});

describe('Team Export Tests', () => {
  test('should export multiple Pokemon sets', () => {
    const teamStrings = sampleTeam.map(set => Sets.exportSet(set));
    
    expect(teamStrings).toBeInstanceOf(Array);
    expect(teamStrings).toHaveLength(2);
    
    teamStrings.forEach(str => {
      expect(str).toBeTypeOf('string');
      expect(str.length).toBeGreaterThan(0);
    });

    const combinedTeam = teamStrings.join('\n\n');
    expect(combinedTeam).toContain('Pikachu');
    expect(combinedTeam).toContain('Charizard');
  });
});

describe('Input Validation Tests', () => {
  test('should handle missing optional fields gracefully', () => {
    const minimalSet = {
      name: "Bulbasaur",
      species: "Bulbasaur",
      item: "",
      ability: "Overgrow",
      moves: ["Tackle"],
      nature: "Hardy",
      gender: "M",
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      level: 5
    };

    const exported = Sets.exportSet(minimalSet);
    expect(exported).toBeTypeOf('string');
    expect(exported).toContain('Bulbasaur');
  });
});

