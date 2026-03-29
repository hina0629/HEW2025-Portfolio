import React from 'react';

function PokemonModal({ isOpen, onClose, pokemonData }) {
  if (!isOpen || !pokemonData) return null;

  const { id, name, types, description } = pokemonData;
  const paddedNumber = String(id).padStart(3, '0');

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <i className="fa-solid fa-xmark close-modal" onClick={onClose}></i>
        <div className="modal-image">
          <img src={`/img/${paddedNumber}gif.png`} alt="ポケモン画像" />
          <div className="modal-wrapper">
            <p>図鑑番号：No.{paddedNumber}</p>
            <h2>{name}</h2>
            <p>タイプ：{types.join('・')}</p>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
