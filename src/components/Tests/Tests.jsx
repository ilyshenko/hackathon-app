import React, { useState } from 'react';
import './Tests.css';

const QUESTIONS = [
  {
    question: 'Что означает аббревиатура ИИ?',
    options: ['Информационный Интерфейс', 'Искусственный Интеллект', 'Интеллектуальный Интерфейс', 'Интегрированная Информация'],
    correctAnswer: 'Искусственный Интеллект'
  },
  {
    question: 'Какой тип ИИ используется в современных голосовых помощниках?',
    options: ['Сильный ИИ', 'Общий ИИ', 'Слабый ИИ', 'Суперинтеллект'],
    correctAnswer: 'Слабый ИИ'
  },
  {
    question: 'Что такое машинное обучение?',
    options: ['Программирование роботов', 'Обучение компьютеров на основе данных', 'Создание алгоритмов вручную', 'Изучение компьютерного железа'],
    correctAnswer: 'Обучение компьютеров на основе данных'
  },
  {
    question: 'Какая технология лежит в основе глубокого обучения?',
    options: ['Деревья решений', 'Нейронные сети', 'Метод k-ближайших соседей', 'Линейная регрессия'],
    correctAnswer: 'Нейронные сети'
  },
  {
    question: 'Что такое NLP в контексте ИИ?',
    options: ['Нейролингвистическое программирование', 'Обработка естественного языка', 'Новый язык программирования', 'Сетевая архитектура'],
    correctAnswer: 'Обработка естественного языка'
  },
  {
    question: 'Какой алгоритм часто используется для рекомендательных систем?',
    options: ['Кластеризация K-means', 'Метод опорных векторов', 'Фильтрация по коллаборации', 'Логистическая регрессия'],
    correctAnswer: 'Фильтрация по коллаборации'
  },
  {
    question: 'Что такое компьютерное зрение?',
    options: ['Создание 3D-графики', 'Распознавание и анализ изображений', 'Проектирование интерфейсов', 'Разработка видеоигр'],
    correctAnswer: 'Распознавание и анализ изображений'
  }
];

export default function Test() {
  const [isTestStarted, setIsTestStarted] = useState(false); // Флаг: начался ли тест
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const startTest = () => {
      setIsLoading(true); // Включаем индикатор загрузки

      // Задержка 1500 мс (1.5 секунды)
      setTimeout(() => {
          setIsTestStarted(true);
          setIsLoading(false); // Отключаем индикатор
        }, 1500);
    };



  // Генерация нового теста (при повторном нажатии "Сгенерировать")
  const generateNewTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setSelectedAnswer('');
    setIsTestStarted(true); // Остаёмся в режиме теста
  };

  // Обработка выбора ответа
  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
  };


  // Переход к следующему вопросу
  const nextQuestion = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedAnswers);


    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  // Отображение результатов
  const renderResults = () => {
    const correctAnswers = userAnswers.filter(
      (userAnswer, index) => userAnswer === QUESTIONS[index].correctAnswer
    ).length;


    return (
      <div className="results">
        <h2>Результаты теста</h2>
        <p>Правильных ответов: {correctAnswers} из {QUESTIONS.length}</p>
        <p>Неправильных ответов: {QUESTIONS.length - correctAnswers}</p>

        <div className="correct-answers">
          <h3>Правильные ответы:</h3>
          {QUESTIONS.map((q, index) => (
            <div key={index}>
              <strong>Вопрос {index + 1}:</strong> {q.correctAnswer}
            </div>
          ))}
        </div>

        <button onClick={generateNewTest} className="test-btn">
          Пройти тест заново
        </button>
      </div>
    );
  };

  // Отображение текущего вопроса
  const renderQuestion = () => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    return (
      <div className="question-container">
        <h3>Вопрос {currentQuestionIndex + 1} из {QUESTIONS.length}</h3>
        <p className="question">{currentQuestion.question}</p>

        {currentQuestion.options.map((option, index) => (
          <label key={index} className="answer-label">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
            {option}
          </label>
        ))}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={nextQuestion}
          className="test-btn"
          disabled={!selectedAnswer}
        >
          {currentQuestionIndex === QUESTIONS.length - 1
            ? 'Завершить тест'
            : 'Далее'}
        </button>
      </div>
    );
  };

return (
  <div className="test-container">

    {/* Центрируем кнопку генерации */}
    {!isTestStarted && !isLoading && (
      <div className="center-container">
        <button onClick={startTest} className="test-btn">
          Сгенерировать
        </button>
      </div>
    )}

    {isLoading && (
      <div className="loading-message">
        Идёт генерация...
      </div>
    )}

    {isTestStarted && !showResults && renderQuestion()}
    {isTestStarted && showResults && renderResults()}
  </div>
);

}
