import React, { useState, useRef } from "react";
import "./MemoryCard.css";

const cardsData = [
  {
    question: "что такое ядерная реакция?",
    answer: "процесс превращения атомных ядер с выделением или поглощением энергии."
  },
  {
    question: "что такое энергия связи ядра?",
    answer: "энергия, необходимая для разделения ядра на отдельные нуклоны."
  },
  {
    question: "какая частица запускает деление урана-235?",
    answer: "медленный нейтрон."
  },
  {
    question: "что такое радиоактивность?",
    answer: "самопроизвольный распад нестабильных ядер с излучением частиц."
  },
  {
    question: "что такое цепная реакция?",
    answer: "реакция, при которой продукты одной реакции вызывают новые реакции."
  }
];

export default function MemoryCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardsGenerated, setCardsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef(null);
  let startX = 0;

  function handleFlip() {
    if (isAnimating || !cardsGenerated) return;
    setFlipped(!flipped);
  }

  function handleNext(nextDirection) {
    if (isAnimating || !cardsGenerated) return;

    setIsAnimating(true);
    setFlipped(false);

    setTimeout(() => {
      let newIndex;

      if (nextDirection === "left") {
        newIndex = (index - 1 + cardsData.length) % cardsData.length;
      } else {
        newIndex = (index + 1) % cardsData.length;
      }

      setIndex(newIndex);

      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }, 300);
  }

  function touchStart(e) {
    startX = e.touches[0].clientX;
  }

  function touchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 60) handleNext("right");
    if (diff < -60) handleNext("left");
  }

  function generateCards() {
    setIsGenerating(true);

    setTimeout(() => {
      setCardsGenerated(true);
      setIsGenerating(false);
    }, 1500);
  }

  return (
    <div className="mc-container">
      
      {/* Кнопка генерации сверху по центру */}
      {!cardsGenerated && (
        <div className="mc-generate-wrapper">
          <button
            onClick={generateCards}
            className="mc-generate-btn"
            disabled={isGenerating}
          >
            {isGenerating ? "Идёт генерация..." : "Сгенерировать"}
          </button>

          {isGenerating && (
            <div className="mc-loading">
              <div className="mc-spinner"></div>
              <p>Подготовка карточек...</p>
            </div>
          )}
        </div>
      )}

      {/* Основной контент после генерации */}
      {cardsGenerated && (
        <>
          <div className="mc-progress">
            карточка {index + 1} из {cardsData.length}
          </div>

          <div
            className={`mc-card ${
              flipped ? "flipped" : ""
            } ${isAnimating ? "changing" : ""}`}
            onClick={handleFlip}
            onTouchStart={touchStart}
            onTouchEnd={touchEnd}
            ref={cardRef}
          >
            <div className="mc-face mc-front">
              {cardsData[index].question}
            </div>

            <div className="mc-face mc-back">
              {cardsData[index].answer}
            </div>
          </div>

          <div className="mc-buttons">
            <button
              onClick={() => handleNext("left")}
              className="mc-btn"
              disabled={isAnimating}
            >
              ← предыдущая
            </button>
            <button
              onClick={() => handleNext("right")}
              className="mc-btn"
              disabled={isAnimating}
            >
              следующая →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
