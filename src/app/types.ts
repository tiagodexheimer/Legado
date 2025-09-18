
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
  | 'Picareta Primitiva';

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

export type LoadedChunks = {
  [key: string]: MapChunk;
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

export type SkillName = 'woodcutting' | 'foraging' | 'mining';

export type Skills = Record<SkillName, Skill>;
