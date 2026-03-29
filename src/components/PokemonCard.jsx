import React, { useState } from 'react';

function PokemonCard({ id, name, isRandom = false, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const paddedNumber = String(id).padStart(3, '0');
  
  // 通常画像とGIF画像のパス
  const srcNormal = `/img/${paddedNumber}.png`;
  const srcGif = `/img/${paddedNumber}gif.png`;

  // トップ画面とリスト画面で少し構造が異なる
  if (isRandom) {
    return (
      <div className="pokemon-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <img 
          src={isHovered ? srcGif : srcNormal} 
          alt={`ポケモンNo.${paddedNumber}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>
    );
  }

  // 図鑑リスト用
  return (
    <div className="pokemon-list-card" onClick={onClick}>
      <img 
        src={isHovered ? srcGif : srcNormal} 
        alt={`ポケモンNo.${paddedNumber}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <p className="dotgothic16-regular">{name}</p>
    </div>
  );
}

export default PokemonCard;
