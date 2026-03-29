import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import SearchBox from '../components/SearchBox';

const TYPE_LIST = [
  'ノーマル', 'ほのお', 'みず', 'くさ', 'でんき', 'こおり',
  'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
  'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
];

function List() {
  const [allPokemonData, setAllPokemonData] = useState([]);

  // ▼ 検索用とタイプ用のState（表示データはこれらを元に自動算出します）
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  // 全ポケモンのデータを取得
  useEffect(() => {
    const loadAllPokemon = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/v2/pokemon`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const dbData = await res.json();

        // DBのデータをフロントエンドの形式に合わせる
        const results = dbData.map(pokemon => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.type ? pokemon.type.split('/') : [],
            description: pokemon.description || '説明がありません'
          };
        });

        setAllPokemonData(results);

        // URLパラメータの確認（トップページから来た時のため）
        const params = new URLSearchParams(location.search);
        const keyword = params.get("name") || params.get("search");
        if (keyword) {
          setSearchTerm(keyword);
        }
      } catch (error) {
        console.error("ポケモンの取得に失敗しました:", error);
      }
    };
    loadAllPokemon();
  }, [location.search]);

  // ▼ 大文字小文字の統一と、ひらがなをカタカナに変換する関数
  const normalizeString = (str) => {
    if (!str) return "";
    return str
      .toLowerCase() // 英字の大文字を小文字に
      .replace(/[\u3041-\u3096]/g, match =>
        // ひらがなをカタカナに変換（文字コードをずらす）
        String.fromCharCode(match.charCodeAt(0) + 0x60)
      );
  };

  // ▼ すべてのPokemonデータから、現在の「検索文字」と「選択タイプ」に合うものだけを絞り込む
  const filteredData = useMemo(() => {
    return allPokemonData.filter(p => {
      // 選択されているすべてのタイプを持っているか（AND検索）
      const matchType = selectedTypes.length > 0 
        ? selectedTypes.every(t => p.types.includes(t))
        : true;
      const matchName = searchTerm
        ? normalizeString(p.name).includes(normalizeString(searchTerm))
        : true;
      return matchType && matchName;
    });
  }, [allPokemonData, selectedTypes, searchTerm]);

  // タイプフィルター (トグル & 最大2つまで保持)
  const handleTypeClick = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // すでに選択されていれば解除
        return prev.filter(t => t !== type);
      }
      // 新規追加（3つ目が選ばれた場合は一番古いものを押し出す）
      return [...prev, type].slice(-2);
    });
  };

  // クリア処理
  const handleClear = () => {
    setSelectedTypes([]);
    setSearchTerm("");
  };

  // モーダルオープン処理
  const handleCardClick = (pokemon) => {
    setModalData(pokemon);
    setIsModalOpen(true);
  };

  return (
    <div id="list-top" className="body-wrapper-list" style={{ minHeight: '100vh' }}>
      <Header isList={true} />



      <main>
        <div className="center">
          {/* タイトル */}
          <div className="list-title dotgothic16-regular">
            <h2>１５１ずかん</h2>
            <hr />
          </div>

          <SearchBox 
            isList={true} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          {/* タイプ */}
          <div className="type-buttons button-reset">
            {TYPE_LIST.map((type, index) => (
              <React.Fragment key={type}>
                <button
                  className={selectedTypes.includes(type) ? 'select-button' : ''}
                  onClick={() => handleTypeClick(type)}
                >
                  {type}
                </button>
                {index === 8 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* クリアボタン */}
          <div className="clear-button button-reset">
            <button onClick={handleClear}>絞り込みクリア</button>
          </div>

          {/* ポケモン一覧 */}
          {filteredData.length > 0 ? (
            <div className="pokemon-list">
              {filteredData.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  id={pokemon.id}
                  name={pokemon.name}
                  onClick={() => handleCardClick(pokemon)}
                />
              ))}
            </div>
          ) : (
            <p className="notfound pokemon-list-card">該当するポケモンは見つかりませんでした</p>
          )}

          {/* モーダルウィンドウ */}
          <PokemonModal
            isOpen={isModalOpen}
            pokemonData={modalData}
            onClose={() => setIsModalOpen(false)}
          />

        </div>
      </main>

      <footer className={filteredData.length === 0 ? "footer-wrapper footer-notfound" : "footer-wrapper"}>
        {/* 上に戻るボタン */}
        <a href="#list-top">
          <div className="list-top-btn">
            <i className="fa-solid fa-chevron-up"></i>
          </div>
        </a>
        <div className="footer-content dotgothic16-regular">
          <p>&copy; pokemon図鑑</p>
        </div>
      </footer>
    </div>
  );
}

export default List;
