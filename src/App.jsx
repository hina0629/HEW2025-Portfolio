import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ListPage from './pages/List';

// ローディングアニメーション制御用のラッパー
function LoadWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // ページ遷移のたびにローディングアニメーションを見せる設定
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2秒 (元のCSSアニメーション時間に合わせる)
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="wrap">
          <div className="bg"></div>
        </div>
      )}
      <div className={loading ? "wrap2-hidden" : "wrap2"}>
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LoadWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </LoadWrapper>
    </BrowserRouter>
  );
}

export default App;
