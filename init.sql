-- テーブル作成: pokemon から pokemons に変更
CREATE TABLE IF NOT EXISTS pokemons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT
);

-- データは seed.js 経由で PokeAPI から一括取得するため、初期投入SQLは空にしています。
