import React, { useState, useEffect } from 'react';
import './Notes.css';

export default function Notes() {
  const [noteText, setNoteText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Загрузка только по кнопке
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  // Загрузка конспектов при первом рендере (без индикатора)
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fileNames = ['cons1.txt', 'cons2.txt', 'cons3.txt'];
        const loadedNotes = [];

        for (const fileName of fileNames) {
          try {
            const response = await fetch(`/${fileName}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let content = await response.text();

            if (content.includes('<!doctype html>') || content.includes('<html')) {
              loadedNotes.push(`ОШИБКА: Файл ${fileName} не найден`);
              continue;
            }

            const formattedContent = content
              .split('. ')
              .map(sentence => {
                if (sentence.trim()) {
                  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
                }
                return sentence;
              })
              .join('. ');

            loadedNotes.push(formattedContent);
          } catch (err) {
            console.error(`Ошибка загрузки ${fileName}:`, err);
            loadedNotes.push(`ОШИБКА: Не удалось загрузить ${fileName}`);
          }
        }

        if (loadedNotes.length === 0) {
          setError('Не удалось загрузить ни одного конспекта.');
        } else {
          setNotes(loadedNotes);
        }
      } catch (err) {
        console.error('Общая ошибка:', err);
        setError('Произошла ошибка при загрузке конспектов.');
      }
    };

    loadNotes();
  }, []);

  // Обработчик кнопки (с индикатором загрузки)
  const generateOrRegenerateNote = () => {
    setIsLoading(true); // Включаем индикатор
    setError(null);

    setTimeout(() => { // Искусственная задержка для видимости индикатора
      try {
        if (!isGenerated && notes.length > 0) {
          setNoteText(notes[0]);
          setIsGenerated(true);
        } else if (notes.length > 0) {
          const currentIndex = notes.indexOf(noteText);
          const nextIndex = (currentIndex + 1) % notes.length;
          setNoteText(notes[nextIndex]);
        } else {
          setError('Нет доступных конспектов для отображения.');
        }
      } catch (err) {
        setError('Ошибка при генерации конспекта.');
      }
      setIsLoading(false); // Отключаем индикатор
    }, 800); // 800 мс — длительность анимации
  };

  const buttonText = isGenerated ? 'Перегенерировать' : 'Сгенерировать';

  return (
    <div className="notes-container">
      <button
        onClick={generateOrRegenerateNote}
        className="generate-btn"
        disabled={isLoading} // Блокируем кнопку во время загрузки
      >
        {isLoading ? 'Идёт генерация...' : buttonText}
      </button>

      {error && (
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Подождите, идёт генерация...</p>
        </div>
      )}

      {!isLoading && noteText && (
        <pre className="note-content">{noteText}</pre>
      )}
    </div>
  );
}
