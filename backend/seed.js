const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'pokemon_db',
});

// 英語のタイプを日本語にマッピング
const typeMapping = {
  normal: "ノーマル", fire: "ほのお", water: "みず", electric: "でんき",
  grass: "くさ", ice: "こおり", fighting: "かくとう", poison: "どく",
  ground: "じめん", flying: "ひこう", psychic: "エスパー", bug: "むし",
  rock: "いわ", ghost: "ゴースト", dragon: "ドラゴン", dark: "あく",
  steel: "はがね", fairy: "フェアリー"
};

async function seed() {
  console.log('--- 🚀 Data Seeding Started ---');
  
  try {
    // テーブルが存在しなければ作成する（ボリュームが残っていた場合の対策）
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);

    // 既にデータが151件以上あるか確認
    const countRes = await pool.query('SELECT COUNT(*) FROM pokemons');
    if (parseInt(countRes.rows[0].count) >= 151) {
      console.log('✅ 既に151匹のデータがDBに格納されています。PokeAPIからの取得（Seeding）をスキップします。');
      process.exit(0);
    }
    
    console.log('PokeAPIから151匹のデータを取得してDBに格納します。少し時間がかかります...');

    // 151匹順番にAPIを叩いてDBに保存
    for (let i = 1; i <= 151; i++) {
      try {
        // 1. speciesデータ (名前、説明文) を取得
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
        const speciesData = await speciesRes.json();
        
        const nameObj = speciesData.names.find(n => n.language.name === 'ja');
        const name = nameObj ? nameObj.name : `ポケモン${i}`;
        
        const flavorObj = speciesData.flavor_text_entries.find(e => e.language.name === 'ja');
        // descriptionは改行を取り除いて綺麗にする
        const description = flavorObj ? flavorObj.flavor_text.replace(/\n|\f|\r/g, ' ') : '';

        // 2. pokemonデータ (タイプ) を取得
        const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const pokeData = await pokeRes.json();
        const types = pokeData.types.map(t => typeMapping[t.type.name] || t.type.name);
        const typeStr = types.join('/'); // 例：「くさ/どく」のように保存

        // 3. データベースに挿入 (すでに存在した場合は上書きする)
        await pool.query(
          `INSERT INTO pokemons (id, name, type, description) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (id) 
           DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, description = EXCLUDED.description`,
          [i, name, typeStr, description]
        );
        
        // 進捗ログ
        if (i % 10 === 0 || i === 151) {
          console.log(`📦 ${i}/151匹完了: ${name}`);
        }
      } catch (err) {
        console.error(`❌ ポケモンID ${i} の取得に失敗しました:`, err);
      }
    }
    
    console.log('🎉 Seeding Success! 151匹のデータが正常に保存されました。');
  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    pool.end();
  }
}

seed();
