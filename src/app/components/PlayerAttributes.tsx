
import React from 'react';
import { Attributes } from '../types';

const PlayerAttributes = ({ attributes }: { attributes: Attributes }) => (
  <div className="panel">
    <h2>Atributos</h2>
    <div>Força: {attributes.strength}</div>
    <div>Agilidade: {attributes.agility}</div>
    <div>Vigor: {attributes.vigor}</div>
  </div>
);

export default PlayerAttributes;
