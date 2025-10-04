
"use client";

import { useState, useEffect, useCallback } from 'react';
import PlayerStats from './components/PlayerStats';
import InventoryDisplay from './components/Inventory';
import Crafting from './components/Crafting';
import PlayerAttributes from './components/PlayerAttributes';
import PlayerSkills from './components/PlayerSkills';
import CampfireMenu from './components/CampfireMenu';
import Campfire from './components/Campfire';
import {
  Inventory,
  Recipe,
  ResourceName,
  LoadedChunks,
  MapCell,
  Player,
  Attributes,
  Skills,
  SkillName,
  PlayerStatsData,
  ChunkData,
  Chicken,
  CampfireData
} from './types';
import { generateChunk, CHUNK_SIZE, getBiome } from './engine/mapGenerator';

// --- CONSTANTES E DADOS INICIAIS ---
const VIEW_RADIUS = 1;

const initialInventory: Inventory = {
  'Galho': { name: 'Galho', quantity: 0, icon: '/file.svg' },
  'Pedra': { name: 'Pedra', quantity: 0, icon: '/globe.svg' },
  'Vinha': { name: 'Vinha', quantity: 0, icon: '/window.svg' },
  'Madeira': { name: 'Madeira', quantity: 0, icon: '/file.svg' },
  'Pedra Afiada': { name: 'Pedra Afiada', quantity: 0, icon: '/file.svg' },
  'Frutas': { name: 'Frutas', quantity: 0, icon: '/file.svg' },
  'Cacto': { name: 'Cacto', quantity: 0, icon: '/file.svg' },
  'Machado Primitivo': { name: 'Machado Primitivo', quantity: 0, icon: '/file.svg' },
  'Picareta Primitiva': { name: 'Picareta Primitiva', quantity: 0, icon: '/file.svg' },
  'Carne de Galinha Crua': { name: 'Carne de Galinha Crua', quantity: 0, icon: '/file.svg' },
  'Carne de Galinha Cozida': { name: 'Carne de Galinha Cozida', quantity: 0, icon: '/file.svg' },
  'Fogueira': { name: 'Fogueira', quantity: 0, icon: '/file.svg' },
  'Minério de Ferro': { name: 'Minério de Ferro', quantity: 0, icon: '/file.svg' },
  'Barra de Ferro': { name: 'Barra de Ferro', quantity: 0, icon: '/file.svg' },
  'Picareta de Ferro': { name: 'Picareta de Ferro', quantity: 0, icon: '/file.svg' },
  'Machado de Ferro': { name: 'Machado de Ferro', quantity: 0, icon: '/file.svg' },
  'Pregos': { name: 'Pregos', quantity: 0, icon: '/file.svg' },
  'Tábua': { name: 'Tábua', quantity: 0, icon: '/file.svg' },
  'Parede de Madeira': { name: 'Parede de Madeira', quantity: 0, icon: '/file.svg' },
  'Porta de Madeira': { name: 'Porta de Madeira', quantity: 0, icon: '/file.svg' },
};

const recipes: Recipe[] = [
  {
    name: "Criar Pedra Afiada",
    result: { name: 'Pedra Afiada', icon: '/file.svg' },
    ingredients: [{ name: 'Pedra', quantity: 2 }],
  },
  {
    name: "Criar Machado Primitivo",
    result: { name: 'Machado Primitivo', icon: '🪓' },
    ingredients: [
      { name: 'Pedra Afiada', quantity: 1 },
      { name: 'Galho', quantity: 1 },
      { name: 'Vinha', quantity: 1 },
    ],
  },
   {
    name: "Criar Picareta Primitiva",
    result: { name: 'Picareta Primitiva', icon: '⛏️' },
    ingredients: [
      { name: 'Pedra Afiada', quantity: 2 },
      { name: 'Galho', quantity: 1 },
      { name: 'Vinha', quantity: 2 },
    ],
  },
  {
    name: "Criar Fogueira",
    result: { name: 'Fogueira', icon: '🔥' },
    ingredients: [
      { name: 'Pedra', quantity: 5 },
      { name: 'Galho', quantity: 5 },
    ],
  },
  {
    name: "Criar Tábua",
    result: { name: 'Tábua', icon: '/file.svg' },
    ingredients: [{ name: 'Madeira', quantity: 1 }],
  },
  {
    name: "Criar Picareta de Ferro",
    result: { name: 'Picareta de Ferro', icon: '⛏️' },
    ingredients: [
      { name: 'Barra de Ferro', quantity: 2 },
      { name: 'Galho', quantity: 1 },
    ],
  },
  {
    name: "Criar Machado de Ferro",
    result: { name: 'Machado de Ferro', icon: '🪓' },
    ingredients: [
      { name: 'Barra de Ferro', quantity: 2 },
      { name: 'Galho', quantity: 1 },
    ],
  },
  {
    name: "Criar Pregos",
    result: { name: 'Pregos', icon: '/file.svg' },
    ingredients: [{ name: 'Barra de Ferro', quantity: 1 }],
  },
  {
    name: "Criar Parede de Madeira",
    result: { name: 'Parede de Madeira', icon: '/file.svg' },
    ingredients: [
      { name: 'Tábua', quantity: 5 },
      { name: 'Pregos', quantity: 2 },
    ],
  },
  {
    name: "Criar Porta de Madeira",
    result: { name: 'Porta de Madeira', icon: '/file.svg' },
    ingredients: [
      { name: 'Tábua', quantity: 7 },
      { name: 'Pregos', quantity: 4 },
    ],
  },
];

const resourceIcons: Partial<Record<ResourceName, string>> = {
  'Árvore': '🌳',
  'Pedra': '🪨',
  'Frutas': '🍇',
  'Cacto': '🌵',
  'RampUp': '↗️',
  'RampDown': '↘️',
  'Machado Primitivo': '🪓',
  'Picareta Primitiva': '⛏️',
  'Carne de Galinha Crua': '🍗',
  'Fogueira': '🔥',
  'Minério de Ferro': '⚫',
  'Barra de Ferro': '🔗',
  'Picareta de Ferro': '⛏️',
  'Machado de Ferro': '🪓',
};

const terrainColors = {
  grass: '#2a5934',
  water: '#4a90e2',
  rock: '#696969',
  sand: '#d2b48c',
  void: '#111',
};

const initialAttributes: Attributes = {
  strength: 5,
  agility: 5,
  vigor: 5,
};

const initialSkills: Skills = {
  woodcutting: { level: 1, xp: 0, xpToNextLevel: 100 },
  foraging: { level: 1, xp: 0, xpToNextLevel: 100 },
  mining: { level: 1, xp: 0, xpToNextLevel: 100 },
  hunting: { level: 1, xp: 0, xpToNextLevel: 100 },
  cooking: { level: 1, xp: 0, xpToNextLevel: 100 },
};

const getChunkKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
  woodcutting: 'Silvicultura',
  foraging: 'Coleta',
  mining: 'Mineração',
  hunting: 'Caça',
  cooking: 'Cozinhar',
};

const toolRequirements: Partial<Record<ResourceName, ResourceName[]>> = {
  'Árvore': ['Machado Primitivo', 'Machado de Ferro'],
  'Pedra': ['Picareta Primitiva', 'Picareta de Ferro'],
  'Minério de Ferro': ['Picareta Primitiva', 'Picareta de Ferro'],
};

const resourceRewards: Partial<Record<ResourceName, { item: ResourceName, quantity: number, xp: number, skill: SkillName }>> = {
    'Árvore': { item: 'Madeira', quantity: 3, xp: 20, skill: 'woodcutting' },
    'Pedra': { item: 'Pedra', quantity: 2, xp: 15, skill: 'mining' },
    'Cacto': { item: 'Frutas', quantity: 1, xp: 10, skill: 'foraging' },
    'Frutas': { item: 'Frutas', quantity: 1, xp: 5, skill: 'foraging' },
    'Minério de Ferro': { item: 'Minério de Ferro', quantity: 1, xp: 30, skill: 'mining' },
};

// --- COMPONENTES ---
const MapGrid = ({ loadedChunks, player, allChickens, campfires, walls, doors }: { loadedChunks: LoadedChunks; player: Player; allChickens: Record<string, Chicken>, campfires: CampfireData[], walls: {x: number, y: number, z: number}[], doors: {x: number, y: number, z: number}[] }) => {
  const playerChunkX = Math.floor(player.x / CHUNK_SIZE);
  const playerChunkY = Math.floor(player.y / CHUNK_SIZE);

  const gridDimension = (2 * VIEW_RADIUS + 1) * CHUNK_SIZE;
  const gridCells = [];

  const startGlobalX = (playerChunkX - VIEW_RADIUS) * CHUNK_SIZE;
  const startGlobalY = (playerChunkY - VIEW_RADIUS) * CHUNK_SIZE;

  for (let gridY = 0; gridY < gridDimension; gridY++) {
    for (let gridX = 0; gridX < gridDimension; gridX++) {
      const globalX = startGlobalX + gridX;
      const globalY = startGlobalY + gridY;

      const chunkX = Math.floor(globalX / CHUNK_SIZE);
      const chunkY = Math.floor(globalY / CHUNK_SIZE);
      
      const cellX = ((globalX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
      const cellY = ((globalY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

      const chunkData = loadedChunks[getChunkKey(chunkX, chunkY, player.z)];
      
      let cell: MapCell | undefined;
      if (chunkData) {
        cell = chunkData.cells[cellY][cellX];
      }

      const resource = cell?.resource;
      const isCampfireLocation = campfires.some(c => c.x === globalX && c.y === globalY && c.z === player.z);

      gridCells.push(
        <div key={`${globalX}-${globalY}`} style={{
          width: 18, height: 18,
          backgroundColor: cell ? terrainColors[cell.terrain] : terrainColors.void,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px',
          position: 'relative',
        }}>
          {resource && resource.hits < resource.maxHits && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', backgroundColor: '#333' }}>
              <div style={{ width: `${(resource.hits / resource.maxHits) * 100}%`, height: '100%', backgroundColor: 'red' }}></div>
            </div>
          )}
          {player.x === globalX && player.y === globalY ? '🧑' : (resource ? resourceIcons[resource.name] : (isCampfireLocation ? <Campfire /> : ''))}
          {Object.values(allChickens).map(chicken => (
            chicken.x === globalX && chicken.y === globalY && chicken.z === player.z ? 
            <span key={chicken.id} style={{ position: 'absolute', fontSize: '12px' }}>🐔</span> : null
          ))}
        </div>
      );
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridDimension}, 18px)`,
      gridTemplateRows: `repeat(${gridDimension}, 18px)`,
      border: '1px solid #444',
    }}>
      {gridCells}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function GamePage() {
  const [inventory, setInventory] = useState<Inventory>(initialInventory);
  const [stats, setStats] = useState<PlayerStatsData>({ health: 100, hunger: 100, thirst: 100, temperature: 37 });
  const [attributes, setAttributes] = useState<Attributes>(initialAttributes);
  const [skills, setSkills] = useState<Skills>(initialSkills);
  const [message, setMessage] = useState("Crie um Machado ou Picareta para começar!");
  const [loadedChunks, setLoadedChunks] = useState<LoadedChunks>({});
  const [player, setPlayer] = useState<Player>({ x: 0, y: 0, z: 0 });
  const [isDead, setIsDead] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'attributes' | 'skills'>('stats');
  const [allChickens, setAllChickens] = useState<Record<string, Chicken>>({});
  const [campfires, setCampfires] = useState<CampfireData[]>([]);
  const [showCampfireMenu, setShowCampfireMenu] = useState(false);
  const [walls, setWalls] = useState<{x: number, y: number, z: number}[]>([]);
  const [doors, setDoors] = useState<{x: number, y: number, z: number}[]>([]);

  useEffect(() => {
    const playerChunkX = Math.floor(player.x / CHUNK_SIZE);
    const playerChunkY = Math.floor(player.y / CHUNK_SIZE);
    let chunksToLoad: { [key: string]: ChunkData } = {};

    for (let y = playerChunkY - VIEW_RADIUS; y <= playerChunkY + VIEW_RADIUS; y++) {
      for (let x = playerChunkX - VIEW_RADIUS; x <= playerChunkX + VIEW_RADIUS; x++) {
        const key = getChunkKey(x, y, player.z);
        if (!loadedChunks[key]) {
          chunksToLoad[key] = generateChunk(x, y, player.z);
        }
      }
    }

    if (Object.keys(chunksToLoad).length > 0) {
      setLoadedChunks(prev => ({ ...prev, ...chunksToLoad }));
      setAllChickens(prev => {
        const newChickens = { ...prev };
        Object.values(chunksToLoad).forEach(chunkData => {
          chunkData.chickens.forEach(chicken => {
            newChickens[chicken.id] = chicken;
          });
        });
        return newChickens;
      });
    }
  }, [player.x, player.y, player.z, loadedChunks]);

  // Game Loop para movimento das galinhas
  useEffect(() => {
    if (isDead) return;

    const timer = setInterval(() => {
      setAllChickens(prevChickens => {
        const newChickens = { ...prevChickens };
        Object.values(newChickens).forEach(chicken => {
          const dx = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          const dy = Math.floor(Math.random() * 3) - 1; // -1, 0, 1

          const newX = chicken.x + dx;
          const newY = chicken.y + dy;

          const currentChunkX = Math.floor(chicken.x / CHUNK_SIZE);
          const currentChunkY = Math.floor(chicken.y / CHUNK_SIZE);
          const currentChunkKey = getChunkKey(currentChunkX, currentChunkY, chicken.z);
          const currentChunkData = loadedChunks[currentChunkKey];

          if (currentChunkData) {
            const cellX = ((newX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
            const cellY = ((newY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
            const targetCell = currentChunkData.cells[cellY][cellX];

            if (targetCell && targetCell.terrain !== 'water' && targetCell.terrain !== 'rock') {
              chicken.x = newX;
              chicken.y = newY;
            }
          }
        });
        return newChickens;
      });
    }, 1000); // Move every 1 second

    return () => clearInterval(timer);
  }, [isDead, loadedChunks]);

  // Game Loop para necessidades
  useEffect(() => {
    if (isDead) return;

    const timer = setInterval(() => {
      const playerChunkX = Math.floor(player.x / CHUNK_SIZE);
      const playerChunkY = Math.floor(player.y / CHUNK_SIZE);
      const currentBiome = getBiome(playerChunkX, playerChunkY);

      setStats(prevStats => {
        let healthDamage = 0;
        const newStats = { ...prevStats };

        let hungerDecay = 0.2;
        let thirstDecay = 0.3;

        if (newStats.temperature > 38) {
          thirstDecay *= 2;
        } else if (newStats.temperature < 36) {
          hungerDecay *= 2;
        }

        newStats.hunger = Math.max(0, newStats.hunger - hungerDecay);
        newStats.thirst = Math.max(0, newStats.thirst - thirstDecay);

        if (newStats.hunger === 0) healthDamage += 1;
        if (newStats.thirst === 0) healthDamage += 1.5;

        let tempChange = 0;
        if ((currentBiome === 'desert' && player.z === 0)) tempChange = 0.5;
        else if (currentBiome === 'mountain' || player.z > 0) tempChange = -0.4;
        else {
          if (newStats.temperature > 37.1) tempChange = -0.2;
          else if (newStats.temperature < 36.9) tempChange = 0.2;
        }
        newStats.temperature += tempChange;

        if (newStats.hunger > 80 && newStats.thirst > 80) {
          newStats.health = Math.min(100, newStats.health + 1);
        } else {
          if (newStats.temperature < 32 || newStats.temperature > 42) healthDamage += 2;
        }
        
        if (healthDamage > 0) {
            newStats.health = Math.max(0, newStats.health - healthDamage);
        }

        return newStats;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isDead, player.x, player.y, player.z]);

  // Hook para verificar a morte
  useEffect(() => {
    if (!isDead && stats.health <= 0) {
      setIsDead(true);
      setMessage("Você morreu.");
    }
  }, [stats.health, isDead]);

  const handleSkillUp = useCallback((skillName: SkillName, amount: number) => {
    setSkills(prevSkills => {
      const newSkills = { ...prevSkills };
      const skill = { ...newSkills[skillName] };
      skill.xp += amount;
      let levelUp = false;
      while (skill.xp >= skill.xpToNextLevel) {
        levelUp = true;
        skill.level++;
        skill.xp -= skill.xpToNextLevel;
        skill.xpToNextLevel = Math.floor(skill.xpToNextLevel * 1.5);
      }
      newSkills[skillName] = skill;
      if (levelUp) {
        setMessage(`Sua habilidade de ${SKILL_DISPLAY_NAMES[skillName]} aumentou para o nível ${skill.level}!`);
      }
      return newSkills;
    });
  }, []);

  const handleInteraction = useCallback((chunkKey: string, cellX: number, cellY: number) => {
    const newChunks = { ...loadedChunks };
    const chunk = newChunks[chunkKey];
    if (!chunk) return;
    const resourceNode = chunk.cells[cellY][cellX].resource;

    if (!resourceNode) return;

    const requiredTools = toolRequirements[resourceNode.name];
    
    // Se uma ferramenta é necessária
    if (requiredTools && requiredTools.length > 0) {
      const hasRequiredTool = requiredTools.some(tool => inventory[tool] && inventory[tool]!.quantity > 0);

      // Se o jogador TEM a ferramenta
      if (hasRequiredTool) {
        let foundItem: ResourceName | null = null;
        if (resourceNode.name === 'Árvore') {
          if (Math.random() < 0.3) foundItem = 'Galho';
          if (Math.random() < 0.10) foundItem = 'Vinha'; // 10% chance to find Vinha with tool
        } else if (resourceNode.name === 'Pedra' && Math.random() < 0.5) foundItem = 'Pedra';

        if (foundItem) {
          setInventory(prev => {
            const newInventory = { ...prev };
            const existingItem = newInventory[foundItem!] || { name: foundItem!, quantity: 0, icon: initialInventory[foundItem!]?.icon || '' };
            existingItem.quantity += 1;
            newInventory[foundItem!] = existingItem;
            return newInventory;
          });
        }

        const newResourceNode = { ...resourceNode };
        newResourceNode.hits -= 1;

        if (newResourceNode.hits > 0) {
          let hitMessage = `Você atinge ${newResourceNode.name}... (${newResourceNode.hits}/${newResourceNode.maxHits})`;
          if (foundItem) hitMessage += ` e um ${foundItem} cai!`;
          setMessage(hitMessage);
          chunk.cells[cellY][cellX].resource = newResourceNode;
        } else {
          const reward = resourceRewards[newResourceNode.name];
          if (reward) {
            setInventory(prev => {
              const newInventory = { ...prev };
              const existingItem = newInventory[reward.item] || { name: reward.item, quantity: 0, icon: initialInventory[reward.item]?.icon || '' };
              existingItem.quantity += reward.quantity;
              newInventory[reward.item] = existingItem;
              return newInventory;
            });
            handleSkillUp(reward.skill, reward.xp);
            setMessage(`Você coletou ${reward.quantity}x ${reward.item}!`);
          }
        chunk.cells[cellY][cellX].resource = undefined;
        }
      } 
      // Se o jogador NÃO TEM a ferramenta
      else {
        let foundItem: ResourceName | null = null;
        let message = `Você precisa de um ${requiredTools.join(' ou ')}.`;

        if (resourceNode.name === 'Árvore') {
          if (Math.random() < 0.05) foundItem = 'Galho';
          if (Math.random() < 0.05) foundItem = 'Vinha'; // 5% chance to find Vinha without tool
          message = 'Você força e consegue quebrar um galho.';
        } else if (resourceNode.name === 'Pedra' && Math.random() < 0.10) {
          foundItem = 'Pedra';
          message = 'Você consegue arrancar uma pequena pedra.';
        }

        if (foundItem) {
          setInventory(prev => {
            const newInventory = { ...prev };
            const existingItem = newInventory[foundItem!] || { name: foundItem!, quantity: 0, icon: initialInventory[foundItem!]?.icon || '' };
            existingItem.quantity += 1;
            newInventory[foundItem!] = existingItem;
            return newInventory;
          });
        }
        setMessage(message);
        return; // Não danifica o recurso principal
      }
    } 
    // Se nenhuma ferramenta é necessária (ex: Frutas)
    else {
      if (resourceNode.name === 'Frutas' && Math.random() < 0.15) {
        setInventory(prev => {
          const newInventory = { ...prev };
          const existingItem = newInventory['Vinha'] || { name: 'Vinha', quantity: 0, icon: initialInventory['Vinha']?.icon || '' };
          existingItem.quantity += 1;
          newInventory['Vinha'] = existingItem;
          return newInventory;
        });
        setMessage("Você encontrou uma Vinha!");
      }
      const newResourceNode = { ...resourceNode };
      newResourceNode.hits -= 1;
      if (newResourceNode.hits <= 0) {
        const reward = resourceRewards[newResourceNode.name];
        if (reward) {
          setInventory(prev => {
            const newInventory = { ...prev };
            const existingItem = newInventory[reward.item] || { name: reward.item, quantity: 0, icon: initialInventory[reward.item]?.icon || '' };
            existingItem.quantity += reward.quantity;
            newInventory[reward.item] = existingItem;
            return newInventory;
          });
          handleSkillUp(reward.skill, reward.xp);
          setMessage(`Você coletou ${reward.quantity}x ${reward.item}!`);
        }
        chunk.cells[cellY][cellX].resource = undefined;
      }
    }
    setLoadedChunks(newChunks);
  }, [loadedChunks, inventory, handleSkillUp]);

  const handlePlayerMove = useCallback(async (dx: number, dy: number) => {
    if (isDead) return;
    const newX = player.x + dx;
    const newY = player.y + dy;

    const isCampfireLocation = campfires.some(c => c.x === newX && c.y === newY && c.z === player.z);
    if (isCampfireLocation) {
      setShowCampfireMenu(true);
      return;
    }

    const targetChunkX = Math.floor(newX / CHUNK_SIZE);
    const targetChunkY = Math.floor(newY / CHUNK_SIZE);
    const targetChunkKey = getChunkKey(targetChunkX, targetChunkY, player.z);
    
    let targetChunk = loadedChunks[targetChunkKey];
    if (!targetChunk) return;

    const targetXInChunk = ((newX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const targetYInChunk = ((newY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const targetCell = targetChunk.cells[targetYInChunk][targetXInChunk];
    const resource = targetCell.resource;

    if (resource && toolRequirements[resource.name]) {
      handleInteraction(targetChunkKey, targetXInChunk, targetYInChunk);
      return;
    }

    if (resource && (resource.name === 'RampUp' || resource.name === 'RampDown')) {
      const isRampUp = resource.name === 'RampUp';
      const destZ = player.z + (isRampUp ? 1 : -1);
      const destX = newX;
      const destY = newY;

      const destChunkX = Math.floor(destX / CHUNK_SIZE);
      const destChunkY = Math.floor(destY / CHUNK_SIZE);
      const destChunkKey = getChunkKey(destChunkX, destChunkY, destZ);

      let destChunk = loadedChunks[destChunkKey];
      if (!destChunk) {
        destChunk = generateChunk(destChunkX, destChunkY, destZ);
        setLoadedChunks(prev => ({ ...prev, [destChunkKey]: destChunk }));
      }

      const destXInChunk = ((destX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
      const destYInChunk = ((destY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
      const destCell = destChunk.cells[destYInChunk][destXInChunk];

      if (destCell.terrain !== 'water' && destCell.terrain !== 'rock') {
        setPlayer({ x: destX, y: destY, z: destZ });
        setMessage(isRampUp ? "Você sobe a rampa..." : "Você desce a rampa...");
      } else {
        setMessage("O caminho da rampa está bloqueado.");
      }
      return;
    }

    // Check for chicken interaction
    const chickenInCell = Object.values(allChickens).find(chicken => 
      chicken.x === newX && chicken.y === newY && chicken.z === player.z
    );

    if (chickenInCell) {
      if (chickenInCell.health - 1 <= 0) {
        setAllChickens(prev => {
          const newChickens = { ...prev };
          delete newChickens[chickenInCell.id];
          return newChickens;
        });
        setInventory(prevInv => {
          const newInv = { ...prevInv };
          const rawMeat = newInv['Carne de Galinha Crua'] || { name: 'Carne de Galinha Crua', quantity: 0, icon: resourceIcons['Carne de Galinha Crua'] || '' };
          rawMeat.quantity += 1;
          newInv['Carne de Galinha Crua'] = rawMeat;
          return newInv;
        });
        handleSkillUp('hunting', 10);
        setMessage("Você matou uma galinha e coletou Carne de Galinha Crua!");
      } else {
        setAllChickens(prev => {
          const newChickens = { ...prev };
          const chicken = { ...newChickens[chickenInCell.id] };
          chicken.health -= 1;
          newChickens[chickenInCell.id] = chicken;
          setMessage(`Você atinge a galinha! (${chicken.health}/${chicken.maxHealth})`);
          return newChickens;
        });
      }
      return; // Player does not move into chicken's cell
    }

    if (targetCell.terrain === 'water') {
      setStats(prev => ({ 
        ...prev,
        thirst: Math.min(100, prev.thirst + 30),
        temperature: Math.max(20, prev.temperature - 2) // 20 is a reasonable floor temp
      }));
      setMessage("Você bebe um pouco de água e se refresca.");
      return;
    }
    if (targetCell.terrain === 'rock') {
      return; // Collision
    }

    if (resource) {
      handleInteraction(targetChunkKey, targetXInChunk, targetYInChunk);
    }

    setPlayer({ x: newX, y: newY, z: player.z });
  }, [player, loadedChunks, handleInteraction, isDead, campfires]);

  useEffect(() => {
    if (isDead) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': handlePlayerMove(0, -1); break;
        case 'ArrowDown': handlePlayerMove(0, 1); break;
        case 'ArrowLeft': handlePlayerMove(-1, 0); break;
        case 'ArrowRight': handlePlayerMove(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayerMove, isDead]);

  const handleCraft = (recipe: Recipe) => {
    if (isDead) return;
    const canCraft = recipe.ingredients.every(ing => {
      const itemInInventory = inventory[ing.name];
      return itemInInventory && itemInInventory.quantity >= ing.quantity;
    });

    if (!canCraft) {
      setMessage("Você não tem os recursos necessários.");
      return;
    }

    let newInventory = { ...inventory };
    recipe.ingredients.forEach(ing => {
      const item = newInventory[ing.name];
      if (item) item.quantity -= ing.quantity;
    });

    if (recipe.result.name === 'Fogueira') {
      setCampfires([...campfires, { x: player.x, y: player.y, z: player.z, id: Date.now().toString() }]);
      setMessage("Você construiu uma fogueira.");
    } else {
      const resultItem = newInventory[recipe.result.name] || { ...recipe.result, quantity: 0 };
      resultItem.quantity += 1;
      newInventory[recipe.result.name] = resultItem;
      setMessage(`Você criou ${recipe.result.name}!`);
    }

    setInventory(newInventory);
  };

  const handleProcess = (itemName: string) => {
    if (itemName === 'Carne de Galinha Crua') {
      setInventory(prev => {
        const newInventory = { ...prev };
        newInventory['Carne de Galinha Crua']!.quantity -= 1;
        newInventory['Carne de Galinha Cozida']!.quantity += 1;
        return newInventory;
      });
      handleSkillUp('cooking', 15);
      setMessage("Você cozinhou a galinha.");
      setShowCampfireMenu(false);
    } else if (itemName === 'Minério de Ferro') {
      setInventory(prev => {
        const newInventory = { ...prev };
        newInventory['Minério de Ferro']!.quantity -= 1;
        newInventory['Barra de Ferro']!.quantity += 1;
        return newInventory;
      });
      handleSkillUp('cooking', 25);
      setMessage("Você derreteu o minério de ferro.");
      setShowCampfireMenu(false);
    }
  };

  const handleConsume = useCallback((itemName: ResourceName) => {
    if (isDead) return;

    const item = inventory[itemName];
    if (!item || item.quantity === 0) return;

    const newInventory = { ...inventory };
    newInventory[itemName]!.quantity -= 1;

    if (itemName === 'Frutas') {
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
      setMessage("Você comeu algumas frutas.");
    } else if (itemName === 'Carne de Galinha Cozida') {
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 50) }));
      setMessage("Você comeu a galinha cozida.");
    }
    setInventory(newInventory);
  }, [inventory, isDead]);

  return (
    <main>
      {isDead && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, fontSize: '2em' }}>
          <h1>Você Morreu</h1>
        </div>
      )}
      {showCampfireMenu && (
        <CampfireMenu 
          inventory={inventory} 
          onProcess={handleProcess} 
          onClose={() => setShowCampfireMenu(false)} 
        />
      )}
      <div className="game-container">
        <div className="game-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
          {Object.keys(loadedChunks).length > 0 ? 
            <MapGrid loadedChunks={loadedChunks} player={player} allChickens={allChickens} campfires={campfires} /> : 
            <p>Gerando mundo...</p>}
        </div>
        <div className="sidebar">
          <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--panel-bg)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
              <button onClick={() => setActiveTab('stats')} style={{ padding: '8px 12px', border: activeTab === 'stats' ? '1px solid var(--border-color)' : 'none', backgroundColor: activeTab === 'stats' ? 'var(--hover-bg)' : 'transparent', color: 'var(--foreground)', cursor: 'pointer', borderRadius: '4px' }}>Status</button>
              <button onClick={() => setActiveTab('attributes')} style={{ padding: '8px 12px', border: activeTab === 'attributes' ? '1px solid var(--border-color)' : 'none', backgroundColor: activeTab === 'attributes' ? 'var(--hover-bg)' : 'transparent', color: 'var(--foreground)', cursor: 'pointer', borderRadius: '4px' }}>Atributos</button>
              <button onClick={() => setActiveTab('skills')} style={{ padding: '8px 12px', border: activeTab === 'skills' ? '1px solid var(--border-color)' : 'none', backgroundColor: activeTab === 'skills' ? 'var(--hover-bg)' : 'transparent', color: 'var(--foreground)', cursor: 'pointer', borderRadius: '4px' }}>Habilidades</button>
            </div>
            {activeTab === 'stats' && <PlayerStats stats={stats} />}
            {activeTab === 'attributes' && <PlayerAttributes attributes={attributes} />}
            {activeTab === 'skills' && <PlayerSkills skills={skills} />}
          </div>
          <InventoryDisplay inventory={inventory} onConsume={handleConsume} />
          <Crafting recipes={recipes} inventory={inventory} onCraft={handleCraft} />
        </div>
      </div>
      <div className="panel" style={{ borderRadius: '0', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', textAlign: 'center' }}>
        <p>{message}</p>
      </div>
    </main>
  );
}
