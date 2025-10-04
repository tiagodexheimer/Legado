
import React, { useState } from 'react';
import { Inventory } from '../types';

interface CampfireMenuProps {
  inventory: Inventory;
  onProcess: (item: string) => void;
  onClose: () => void;
}

const CampfireMenu: React.FC<CampfireMenuProps> = ({ inventory, onProcess, onClose }) => {
  const [activeTab, setActiveTab] = useState('cooking');

  const canCookChicken = inventory['Carne de Galinha Crua'] && inventory['Carne de Galinha Crua'].quantity > 0;
  const canSmeltIron = inventory['Minério de Ferro'] && inventory['Minério de Ferro'].quantity > 0;

  return (
    <div className="panel" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 110 }}>
      <h2>Fogueira</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <button onClick={() => setActiveTab('cooking')} style={{ padding: '8px 12px', border: activeTab === 'cooking' ? '1px solid var(--border-color)' : 'none', backgroundColor: activeTab === 'cooking' ? 'var(--hover-bg)' : 'transparent', color: 'var(--foreground)', cursor: 'pointer', borderRadius: '4px' }}>Cozinhar</button>
        <button onClick={() => setActiveTab('smelting')} style={{ padding: '8px 12px', border: activeTab === 'smelting' ? '1px solid var(--border-color)' : 'none', backgroundColor: activeTab === 'smelting' ? 'var(--hover-bg)' : 'transparent', color: 'var(--foreground)', cursor: 'pointer', borderRadius: '4px' }}>Fundir</button>
      </div>

      {activeTab === 'cooking' && (
        <div>
          {canCookChicken ? (
            <button onClick={() => onProcess('Carne de Galinha Crua')}>Cozinhar Galinha</button>
          ) : (
            <p>Você não tem galinha para cozinhar.</p>
          )}
        </div>
      )}

      {activeTab === 'smelting' && (
        <div>
          {canSmeltIron ? (
            <button onClick={() => onProcess('Minério de Ferro')}>Derreter Minério de Ferro</button>
          ) : (
            <p>Você não tem minério de ferro para derreter.</p>
          )}
        </div>
      )}

      <button onClick={onClose} style={{ marginTop: '10px' }}>Fechar</button>
    </div>
  );
};

export default CampfireMenu;
