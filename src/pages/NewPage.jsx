import React from "react";
import "./NewPage.css";
import { Link } from "react-router-dom";

export default function NewPage() {
  return (
    <div className="lp-wrapper">


      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <h1>
            учись быстрее<br /> с персональным<br /> ии-репетитором
          </h1>

          <p className="hero-sub">
            персональные объяснения, адаптивные задания и обучение,
            которое подстраивается под твой темп
          </p>

          <Link to="/" className="hero-btn glow-btn">
            начать сейчас
          </Link>
        </div>

        <div className="hero-image">
          <img src="/tiger.png" alt="tiger" />
        </div>
      </section>

      {/* БЛОКИ */}
      <section className="info-grid">
        <div className="info-card">
          <h2>объяснения<br /> под твой уровень</h2>
          <p>
            ии объясняет простым языком и может давать дополнительные примеры,
            если что-то непонятно.
          </p>
        </div>

        <div className="info-card">
          <h2>адаптивные<br /> задания</h2>
          <p>
            система подбирает задания, чтобы обучение было интересным
            и эффективным.
          </p>
        </div>

        <div className="info-card">
          <h2>отслеживание<br /> прогресса</h2>
          <p>
            смотри свой рост, понимай слабые места и прокачивай навыки быстрее.
          </p>
        </div>
      </section>

      <footer className="lp-footer">
        <p>© 2025 Vitaly.AI — персональный ИИ-репетитор</p>
      </footer>

    </div>
  );
}
