import React, { useState, useEffect } from 'react';
import './Notes.css';

export default function Notes() {
  const [noteText, setNoteText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fileNames = ['cons1.txt', 'cons2.txt', 'cons3.txt'];
        const loadedNotes = [];

        for (const fileName of fileNames) {
          try {
            const response = await fetch(`/${fileName}`);

            // Проверяем статус ответа
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            let content = await response.text();

            // Проверяем, что это не HTML
            if (content.includes('<!doctype html>') || content.includes('<html')) {
              loadedNotes.push(`ОШИБКА: Файл ${fileName} не найден`);
              continue;
            }

            // Преобразуем первую букву каждого предложения в заглавную
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

          } catch (error) {
            console.error(`Ошибка загрузки ${fileName}:`, error);
            loadedNotes.push(`ОШИБКА: Не удалось загрузить ${fileName}`);
          }
        }

        console.log('Загружено конспектов:', loadedNotes.length);
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Общая ошибка:', error);
        setNotes(['Ошибка загрузки конспектов']);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  const generateOrRegenerateNote = () => {
    if (!isGenerated && notes.length > 0) {
      setNoteText(notes[0]);
      setIsGenerated(true);
    } else if (notes.length > 0) {
      const currentIndex = notes.indexOf(noteText);
      const nextIndex = (currentIndex + 1) % notes.length;
      setNoteText(notes[nextIndex]);
    }
  };

  const buttonText = isGenerated ? 'Перегенерировать' : 'Сгенерировать';

  if (isLoading) {
    return <div className="notes-container">Загрузка...</div>;
  }

  return (
    <div className="notes-container">
      <button onClick={generateOrRegenerateNote} className="generate-btn">
        {buttonText}
      </button>
      <pre className="note-content">{noteText}</pre>
    </div>
  );
}