import { MapChunk, MapCell, TerrainType, BiomeType } from '../types';

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
export const generateChunk = (chunkX: number, chunkY: number, chunkZ: number): MapChunk => {
  const biome = getBiome(chunkX, chunkY);
  const chunk: MapChunk = Array.from({ length: CHUNK_SIZE }, () => 
    Array.from({ length: CHUNK_SIZE }, () => ({ terrain: 'grass' } as MapCell))
  );

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

      chunk[y][x] = { terrain: primaryTerrain };

      // Detalhes do terreno
      if (chunkZ !== 0) { // Caminhos em cavernas/montanhas
        if(rand < 0.3) chunk[y][x].terrain = 'grass';
      } else { // Detalhes da superfície
        if (biome === 'plains' || biome === 'forest') {
          if (rand < 0.05) chunk[y][x].terrain = 'water'; // Pequenas poças
        }
      }

      // Adicionar recursos
      const resourceRand = seededRandom(tileSeed + 100);
      if (chunk[y][x].terrain === 'grass') {
        let treeChance = 0.05;
        if (biome === 'forest') treeChance = 0.3;

        if (resourceRand < treeChance) chunk[y][x].resource = { name: 'Árvore', hits: 5, maxHits: 5 };
        else if (resourceRand < 0.2) chunk[y][x].resource = { name: 'Frutas', hits: 1, maxHits: 1 };
      } else if (chunk[y][x].terrain === 'rock') {
          if (resourceRand < 0.1) chunk[y][x].resource = { name: 'Pedra', hits: 3, maxHits: 3 };
      } else if (chunk[y][x].terrain === 'sand') {
          if (resourceRand < 0.08) chunk[y][x].resource = { name: 'Cacto', hits: 2, maxHits: 2 };
          else if (resourceRand < 0.12) chunk[y][x].resource = { name: 'Pedra', hits: 3, maxHits: 3 };
      }
    }
  }

  // Colocar Rampas
  const rampSeed = baseSeed + 1;
  const rampX = Math.floor(seededRandom(rampSeed) * CHUNK_SIZE);
  const rampY = Math.floor(seededRandom(rampSeed + 1) * CHUNK_SIZE);

  if (chunk[rampY][rampX].terrain !== 'water') {
    if (chunkZ < 0) { // Cavernas sempre levam para cima
      chunk[rampY][rampX].resource = 'RampUp';
    } else if (chunkZ > 0) { // Montanhas sempre levam para baixo
      chunk[rampY][rampX].resource = 'RampDown';
    } else { // Superfície (z=0)
      if (biome === 'mountain') {
        chunk[rampY][rampX].resource = 'RampUp';
      } else if (seededRandom(baseSeed + 2) < 0.1) { // Chance de entrada de caverna em outros biomas
        chunk[rampY][rampX].resource = 'RampDown';
      }
    }
  }

  return chunk;
};