
import React from 'react';
import { Inventory, Recipe } from '../types'; // We will create this type file next

const Crafting = ({ recipes, inventory, onCraft }: { recipes: Recipe[], inventory: Inventory, onCraft: (recipe: Recipe) => void }) => {
  const canCraft = (recipe: Recipe) => {
    return recipe.ingredients.every(ing => {
      const itemInInventory = inventory[ing.name];
      return itemInInventory && itemInInventory.quantity >= ing.quantity;
    });
  };

  return (
    <div className="panel">
      <h2>Criação</h2>
      {recipes.map(recipe => (
        <div key={recipe.name} className="crafting-recipe">
          <div><strong>{recipe.name}</strong></div>
          <small>
            Requer: {recipe.ingredients.map(ing => `${ing.quantity}x ${ing.name}`).join(', ')}
          </small>
          <button onClick={() => onCraft(recipe)} disabled={!canCraft(recipe)}>
            Criar {recipe.result.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Crafting;
