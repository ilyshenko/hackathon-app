import React, { useEffect, useRef } from "react";
import "./Header.css";
import { Link } from "react-router-dom";   

export default function Header({ tabs = [], active, setActive }) {
  const indicatorRef = useRef(null);
  const btnsRef = useRef([]);

  useEffect(() => {
    const idx = tabs.indexOf(active);
    const el = btnsRef.current[idx];
    if (el && indicatorRef.current) {
      indicatorRef.current.style.width = `${el.offsetWidth}px`;
      indicatorRef.current.style.left = `${el.offsetLeft}px`;
    }
  }, [active, tabs]);

  return (
    <header className="header-root">
      <div className="header-inner">
        <div className="header-left">
          <Link to="/new" className="brand">
  ИИ репетитор <span>VITALY.Ai</span>
</Link>

        </div>

        <nav className="tabs" role="tablist" aria-label="главное меню">
          <div className="tabs-track panel-glass">
            {tabs.map((t, i) => (
              <button
                key={t}
                ref={(el) => (btnsRef.current[i] = el)}
                className={`tab-btn ${active === t ? "active" : ""}`}
                onClick={() => setActive(t)}
                aria-selected={active === t}
              >
                {t}
              </button>
            ))}

            <div className="active-indicator" ref={indicatorRef}></div>
          </div>
        </nav>

      </div>
    </header>
  );
}
