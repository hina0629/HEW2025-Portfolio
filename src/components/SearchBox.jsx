import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBox({ isList = false, onSearch, value, onChange }) {
  const [internalKeyword, setInternalKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // URLパラメーターからの初期化（nameとsearch両対応）
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keywordFromUrl = params.get("name") || params.get("search");
    if (keywordFromUrl && value === undefined) {
      setInternalKeyword(keywordFromUrl);
    }
  }, [location.search, value]);

  // 親からvalueが渡されている場合（List画面など）はそれを使い、そうでない場合（Home画面）は内部Stateを使う
  const currentKeyword = value !== undefined ? value : internalKeyword;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e); // 親コンポーネントが制御中
    } else {
      setInternalKeyword(e.target.value); // 自己制御
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedKeyword = currentKeyword.trim();
      
      if (onSearch && isList) {
        // コールバックが指定されていればそれに任せる
        onSearch(trimmedKeyword);
      } else if (trimmedKeyword !== "") {
        // トップページ等からエンターを押した際の遷移先を /list?name=... に統一
        navigate(`/list?name=${encodeURIComponent(trimmedKeyword)}`);
      }
    }
  };

  return (
    <form action="/" method="get" onSubmit={(e) => e.preventDefault()}>
      <div className={`search-box ${isList ? 'list-search' : ''}`}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          name="query" 
          placeholder="ポケモンの名前で検索" 
          value={currentKeyword}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
}

export default SearchBox;
