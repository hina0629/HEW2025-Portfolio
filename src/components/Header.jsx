import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Header({ isList = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(true); // メニュー開閉はCSSクラスでアニメーション
    if (iconRef.current) {
      iconRef.current.style.opacity = "0";
      iconRef.current.style.transform = "scale(0.8)";
      
      setTimeout(() => {
        setIsOpen(!isOpen);
        iconRef.current.style.opacity = "1";
        iconRef.current.style.transform = "scale(1)";
      }, 200);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className={`header-wrapper ${isList ? 'list-header-wrapper' : ''}`}>
      <Link to="/" className="logo-img">
        <img src="/img/logo.png" alt="ロゴ" />
      </Link>

      {/* ハンバーガーメニューアイコン */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <i ref={iconRef} className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`} style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}></i>
      </button>

      {/* メニュー本体 */}
      <nav className={`side-menu dotgothic16-regular ${isOpen ? 'open' : ''}`}>
        <div className="nav-flex">
          <ul className="main-nav">
            <li><Link to="/"><span className="cursol">▶ </span>ホーム</Link></li>
            <li><Link to="/list"><span className="cursol">▶ </span>図鑑</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
