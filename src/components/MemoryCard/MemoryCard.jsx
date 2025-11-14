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

  const cardRef = useRef(null);
  let startX = 0;

  function handleFlip() {
    setFlipped(!flipped);
  }

  function handleNext(direction) {
    setFlipped(false);

    cardRef.current.style.opacity = 0;
    cardRef.current.style.transform =
      `translateX(${direction === "left" ? "-80px" : "80px"})`;

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % cardsData.length);
      cardRef.current.style.transform = "translateX(0)";
      cardRef.current.style.opacity = 1;
    }, 250);
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

  return (
    <div className="mc-container">

      <div className="mc-progress">
        карточка {index + 1} из {cardsData.length}
      </div>

      <div
        className={`mc-card ${flipped ? "flipped" : ""}`}
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
        <button onClick={() => handleNext("left")} className="mc-btn">
          ← предыдущая
        </button>
        <button onClick={() => handleNext("right")} className="mc-btn">
          следующая →
        </button>
      </div>
    </div>
  );
}
