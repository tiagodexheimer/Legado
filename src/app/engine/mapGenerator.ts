import { MapCell, TerrainType, BiomeType, Chicken, ChunkData } from '../types';

export const CHUNK_SIZE = 16;

// --- Funções de Geração de Ruído ---
const getSeed = (x: number, y: number, z: number) => {
  let seed = (x * 18397) + (y * 20441) + (z * 22543);
  return seed;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// --- Lógica de Biomas ---
export const getBiome = (chunkX: number, chunkY: number): BiomeType => {
  const biomeSeed = getSeed(chunkX, chunkY, 0); // Biome is 2D
  const rand = seededRandom(biomeSeed);

  if (rand < 0.25) return 'desert';
  if (rand < 0.5) return 'forest';
  if (rand < 0.7) return 'mountain';
  return 'plains';
};

// --- Geração de Chunks ---
export const generateChunk = (chunkX: number, chunkY: number, chunkZ: number): ChunkData => {
  const biome = getBiome(chunkX, chunkY);
  const cells: MapCell[][] = Array.from({ length: CHUNK_SIZE }, () => 
    Array.from({ length: CHUNK_SIZE }, () => ({ terrain: 'grass' } as MapCell))
  );
  const chickens: Chicken[] = [];
  const baseSeed = getSeed(chunkX, chunkY, chunkZ);

  // Lógica de terreno base por nível Z e Bioma
  let primaryTerrain: TerrainType = 'grass';
  if (chunkZ > 0) primaryTerrain = 'rock'; // Níveis de montanha
  if (chunkZ < 0) primaryTerrain = 'rock'; // Níveis de caverna
  if (chunkZ === 0) { // Biomas da superfície
    if (biome === 'desert') primaryTerrain = 'sand';
    if (biome === 'mountain') primaryTerrain = 'rock';
  }

  for (let y = 0; y < CHUNK_SIZE; y++) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      const tileSeed = baseSeed + (y * CHUNK_SIZE) + x;
      const rand = seededRandom(tileSeed);

      cells[y][x] = { terrain: primaryTerrain };

      // Detalhes do terreno
      if (chunkZ !== 0) { // Caminhos em cavernas/montanhas
        if(rand < 0.3) cells[y][x].terrain = 'grass';
      } else { // Detalhes da superfície
        if (biome === 'plains' || biome === 'forest') {
          if (rand < 0.05) cells[y][x].terrain = 'water'; // Pequenas poças
          else if (rand < 0.1) cells[y][x].terrain = 'rock'; // Afloramentos rochosos
        } else if (biome === 'mountain') {
          if (rand < 0.2) cells[y][x].terrain = 'grass'; // Caminhos na montanha
        }
      }

      // Adicionar recursos
      const resourceRand = seededRandom(tileSeed + 100);
      if (cells[y][x].terrain === 'grass') {
        let treeChance = 0.05;
        if (biome === 'forest') treeChance = 0.3;

        if (resourceRand < treeChance) cells[y][x].resource = { name: 'Árvore', hits: 5, maxHits: 5 };
        else if (resourceRand < 0.2) cells[y][x].resource = { name: 'Frutas', hits: 1, maxHits: 1 };
      } else if (cells[y][x].terrain === 'rock') {
          let ironChance = 0.05;
          if(chunkZ !== 0) ironChance = 0.15;

          if (resourceRand < ironChance) cells[y][x].resource = { name: 'Minério de Ferro', hits: 4, maxHits: 4 };
          else if (resourceRand < 0.2) cells[y][x].resource = { name: 'Pedra', hits: 3, maxHits: 3 };
      } else if (cells[y][x].terrain === 'sand') {
          if (resourceRand < 0.08) cells[y][x].resource = { name: 'Cacto', hits: 2, maxHits: 2 };
          else if (resourceRand < 0.12) cells[y][x].resource = { name: 'Pedra', hits: 3, maxHits: 3 };
      }
    }
  }

  // Colocar Rampas
  const rampSeed = baseSeed + 1;
  const rampX = Math.floor(seededRandom(rampSeed) * CHUNK_SIZE);
  const rampY = Math.floor(seededRandom(rampSeed + 1) * CHUNK_SIZE);

  if (cells[rampY][rampX].terrain !== 'water') {
    if (chunkZ < 0) { // Cavernas sempre levam para cima
      cells[rampY][rampX].resource = 'RampUp';
    } else if (chunkZ > 0) { // Montanhas sempre levam para baixo
      cells[rampY][rampX].resource = 'RampDown';
    } else { // Superfície (z=0)
      if (biome === 'mountain') {
        cells[rampY][rampX].resource = 'RampUp';
      } else if (seededRandom(baseSeed + 2) < 0.1) { // Chance de entrada de caverna em outros biomas
        cells[rampY][rampX].resource = 'RampDown';
      }
    }
  }

  // Adicionar Galinhas
  if (chunkZ === 0 && (biome === 'plains' || biome === 'forest')) {
    for (let y = 0; y < CHUNK_SIZE; y++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const chickenRand = seededRandom(baseSeed + 200 + (y * CHUNK_SIZE) + x);
        if (chickenRand < 0.02 && cells[y][x].terrain === 'grass') { // 2% chance to spawn a chicken on grass
          chickens.push({
            id: Math.random().toString(36).substring(7),
            x: chunkX * CHUNK_SIZE + x,
            y: chunkY * CHUNK_SIZE + y,
            z: chunkZ,
            health: 3,
            maxHealth: 3,
          });
        }
      }
    }
  }

  return { cells, chickens };