
"use client";

import { useState, useEffect, useCallback } from 'react';
import PlayerStats from './components/PlayerStats';
import InventoryDisplay from './components/Inventory';
import Crafting from './components/Crafting';
import PlayerAttributes from './components/PlayerAttributes';
import PlayerSkills from './components/PlayerSkills';
import { 
  Inventory, 
  Recipe, 
  ResourceName, 
  LoadedChunks,
  MapChunk,
  Player,
  Attributes,
  Skills,
  SkillName,
  MapCell,
  PlayerStatsData
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
};

const getChunkKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
  woodcutting: 'Silvicultura',
  foraging: 'Coleta',
  mining: 'Mineração',
};

const toolRequirements: Partial<Record<ResourceName, ResourceName>> = {
  'Árvore': 'Machado Primitivo',
  'Pedra': 'Picareta Primitiva',
};

const resourceRewards: Partial<Record<ResourceName, { item: ResourceName, quantity: number, xp: number, skill: SkillName }>> = {
    'Árvore': { item: 'Madeira', quantity: 3, xp: 20, skill: 'woodcutting' },
    'Pedra': { item: 'Pedra', quantity: 2, xp: 15, skill: 'mining' },
    'Cacto': { item: 'Frutas', quantity: 1, xp: 10, skill: 'foraging' },
    'Frutas': { item: 'Frutas', quantity: 2, xp: 5, skill: 'foraging' },
};

// --- COMPONENTES ---
const MapGrid = ({ loadedChunks, player }: { loadedChunks: LoadedChunks; player: Player }) => {
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

      const chunk = loadedChunks[getChunkKey(chunkX, chunkY, player.z)];
      
      let cell: MapCell | undefined;
      if (chunk) {
        cell = chunk[cellY][cellX];
      }

      const resource = cell?.resource;

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
          {player.x === globalX && player.y === globalY ? '🧑' : (resource ? resourceIcons[resource.name] : '')}
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

  useEffect(() => {
    const playerChunkX = Math.floor(player.x / CHUNK_SIZE);
    const playerChunkY = Math.floor(player.y / CHUNK_SIZE);
    let chunksToLoad: { [key: string]: MapChunk } = {};

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
    }
  }, [player.x, player.y, player.z, loadedChunks]);

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

        newStats.hunger = Math.max(0, newStats.hunger - 0.5);
        newStats.thirst = Math.max(0, newStats.thirst - 0.7);

        if (newStats.hunger === 0) healthDamage += 1;
        if (newStats.thirst === 0) healthDamage += 1.5;

        let tempChange = 0;
        if ((currentBiome === 'desert' && player.z === 0)) tempChange = 0.5;
        else if (currentBiome === 'mountain' || player.z > 0) tempChange = -0.4;
        else {
          if (newStats.temperature > 37) tempChange = -0.2;
          else if (newStats.temperature < 37) tempChange = 0.2;
        }
        newStats.temperature += tempChange;

        if (newStats.temperature < 32 || newStats.temperature > 42) healthDamage += 2;
        
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
        setTimeout(() => setMessage(`Sua habilidade de ${SKILL_DISPLAY_NAMES[skillName]} aumentou para o nível ${skill.level}!`), 0);
      }
      return newSkills;
    });
  }, []);

  const handleInteraction = useCallback((chunkKey: string, cellX: number, cellY: number) => {
    const newChunks = { ...loadedChunks };
    const chunk = newChunks[chunkKey];
    if (!chunk) return;
    const resourceNode = chunk[cellY][cellX].resource;

    if (!resourceNode) return;

    const requiredTool = toolRequirements[resourceNode.name];
    
    // Se uma ferramenta é necessária
    if (requiredTool) {
      // Se o jogador TEM a ferramenta
      if (inventory[requiredTool] && inventory[requiredTool]!.quantity > 0) {
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
          chunk[cellY][cellX].resource = newResourceNode;
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
          chunk[cellY][cellX].resource = undefined;
        }
      } 
      // Se o jogador NÃO TEM a ferramenta
      else {
        let foundItem: ResourceName | null = null;
        let message = `Você precisa de um ${requiredTool}.`;

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
        chunk[cellY][cellX].resource = undefined;
      }
    }
    setLoadedChunks(newChunks);
  }, [loadedChunks, inventory, handleSkillUp]);

  const handlePlayerMove = useCallback(async (dx: number, dy: number) => {
    if (isDead) return;
    const newX = player.x + dx;
    const newY = player.y + dy;

    const targetChunkX = Math.floor(newX / CHUNK_SIZE);
    const targetChunkY = Math.floor(newY / CHUNK_SIZE);
    const targetChunkKey = getChunkKey(targetChunkX, targetChunkY, player.z);
    
    let targetChunk = loadedChunks[targetChunkKey];
    if (!targetChunk) return;

    const targetXInChunk = ((newX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const targetYInChunk = ((newY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const targetCell = targetChunk[targetYInChunk][targetXInChunk];
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
      const destCell = destChunk[destYInChunk][destXInChunk];

      if (destCell.terrain !== 'water' && destCell.terrain !== 'rock') {
        setPlayer({ x: destX, y: destY, z: destZ });
        setMessage(isRampUp ? "Você sobe a rampa..." : "Você desce a rampa...");
      } else {
        setMessage("O caminho da rampa está bloqueado.");
      }
      return;
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
  }, [player, loadedChunks, handleInteraction, isDead]);

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

    const resultItem = newInventory[recipe.result.name] || { ...recipe.result, quantity: 0 };
    resultItem.quantity += 1;
    newInventory[recipe.result.name] = resultItem;

    setInventory(newInventory);
    setMessage(`Você criou ${recipe.result.name}!`);
  };

  const handleConsume = useCallback((itemName: ResourceName) => {
    if (isDead) return;

    const item = inventory[itemName];
    if (!item || item.quantity === 0) return;

    if (itemName === 'Frutas') {
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
      const newInventory = { ...inventory };
      newInventory[itemName]!.quantity -= 1;
      setInventory(newInventory);
      setMessage("Você comeu algumas frutas.");
    }
  }, [inventory, isDead]);

  return (
    <main>
      {isDead && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, fontSize: '2em' }}>
          <h1>Você Morreu</h1>
        </div>
      )}
      <div className="game-container">
        <div className="game-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
          {Object.keys(loadedChunks).length > 0 ? 
            <MapGrid loadedChunks={loadedChunks} player={player} /> : 
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
