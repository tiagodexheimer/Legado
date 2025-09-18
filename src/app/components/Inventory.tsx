import React from 'react';
import Image from 'next/image';
import { Inventory, ResourceName } from '../types';

const consumableItems: ResourceName[] = ['Frutas'];

const InventoryDisplay = ({ inventory, onConsume }: { inventory: Inventory, onConsume: (item: ResourceName) => void }) => (
  <div className="panel">
    <h2>Inventário</h2>
    {Object.values(inventory).filter(item => item && item.quantity > 0).map(item => (
      <div key={item.name} className="inventory-item">
        <span title={item.name}>
          <Image src={item.icon} alt={item.name} width={16} height={16} className="dark:invert" style={{ display: 'inline-block', marginRight: '8px' }} />
          {item.name.length > 15 ? `${item.name.substring(0, 12)}...` : item.name}
        </span>
        <div>
          <span>x{item.quantity}</span>
          {consumableItems.includes(item.name) && (
            <button 
              onClick={() => onConsume(item.name)} 
              style={{ marginLeft: '10px', padding: '2px 8px', cursor: 'pointer' }}>
              Usar
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default InventoryDisplay;