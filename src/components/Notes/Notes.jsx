import React, { useState, useEffect } from 'react';
import './Notes.css';

export default function Notes() {
  const [noteText, setNoteText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

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

  const generateOrRegenerateNote = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
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
      setIsLoading(false);
    }, 800);
  };

  const buttonText = isGenerated ? 'Перегенерировать' : 'Сгенерировать';

  return (
    <div className="notes-container">

      {/* БЛОК ДЛЯ ЦЕНТРОВКИ КНОПКИ */}
      <div className="center-container">
        <button
          onClick={generateOrRegenerateNote}
          className="generate-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Идёт генерация...' : buttonText}
        </button>
      </div>

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
