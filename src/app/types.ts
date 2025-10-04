
export type ResourceName = 
  | 'Galho' 
  | 'Pedra' 
  | 'Vinha' 
  | 'Madeira' 
  | 'Pedra Afiada' 
  | 'Frutas' 
  | 'Árvore' 
  | 'Cacto'
  | 'RampUp' 
  | 'RampDown'
  | 'Machado Primitivo'
  | 'Picareta Primitiva'
  | 'Carne de Galinha Crua'
  | 'Carne de Galinha Cozida'
  | 'Fogueira'
  | 'Minério de Ferro'
  | 'Barra de Ferro'
  | 'Picareta de Ferro'
  | 'Machado de Ferro'
  | 'Pregos'
  | 'Tábua'
  | 'Parede de Madeira'
  | 'Porta de Madeira';

export type CampfireData = {
  id: string;
  x: number;
  y: number;
  z: number;
};

export type Chicken = {
  id: string;
  x: number;
  y: number;
  z: number;
  health: number;
  maxHealth: number;
};

export type TerrainType = 'grass' | 'water' | 'rock' | 'sand';

export type BiomeType = 'plains' | 'forest' | 'desert' | 'mountain';

export type Item = {
  name: ResourceName;
  quantity: number;
  icon: string;
};

export type Inventory = Partial<Record<ResourceName, Item>>;

export type Recipe = {
  name: string;
  result: { name: ResourceName; icon: string };
  ingredients: { name: ResourceName; quantity: number }[];
};

export type ResourceNode = {
  name: ResourceName;
  hits: number;
  maxHits: number;
}

export type MapCell = {
  terrain: TerrainType;
  resource?: ResourceNode;
};

export type MapChunk = MapCell[][];

export type ChunkData = {
  cells: MapCell[][];
  chickens: Chicken[];
};

export type LoadedChunks = {
  [key: string]: ChunkData;
};

export type Player = {
  x: number;
  y: number;
  z: number;
};

export type PlayerStatsData = {
  health: number;
  hunger: number;
  thirst: number;
  temperature: number;
};

export type Attributes = {
  strength: number;
  agility: number;
  vigor: number;
};

export type Skill = {
  level: number;
  xp: number;
  xpToNextLevel: number;
};

export type SkillName = 'woodcutting' | 'foraging' | 'mining' | 'hunting' | 'cooking';


export type Skills = Record<SkillName, Skill>;
