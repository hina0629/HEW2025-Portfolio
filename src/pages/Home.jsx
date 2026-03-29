import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import PokemonCard from '../components/PokemonCard';

function Home() {
  const [randomPokemons, setRandomPokemons] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v2/pokemon');
        const dbData = await res.json();
        
        const randoms = [];
        for (let i = 0; i < 6; i++) {
          let randomIndex = Math.floor(Math.random() * dbData.length);
          randoms.push(dbData[randomIndex]); // idとnameを持つオブジェクトを保持
        }
        setRandomPokemons(randoms);
      } catch (err) {
        console.error('Failed to fetch pokemons:', err);
      }
    };
    
    fetchPokemons();
  }, []);

  return (
    <div className="body-wrapper">
      <Header />
      <main>
        <div className="center">
          <div className="title dotgothic16-regular">
            <p>ポケットモンスター</p>
            <h2>１５１ずかん</h2>
          </div>

          {/* 検索窓 */}
          <SearchBox />

          {/* ランダムに表示される箱 */}
          <div id="random" className="random">
            {randomPokemons.map((pokemon, index) => (
              <PokemonCard 
                key={index} 
                id={pokemon?.id} 
                name={pokemon?.name} 
                isRandom={true} 
                onClick={() => navigate(`/list?name=${pokemon?.name}`)}
              />
            ))}
          </div>

          <Link to="/list" className="list-button dotgothic16-regular">
            図鑑をみる
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
