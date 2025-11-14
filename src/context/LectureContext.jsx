import React, { createContext, useEffect, useRef, useState } from "react";

// localStorage ключ
const STORAGE_KEY = "vitaly_lectures_v1";

// ЗАМЕНИ на реальный webhook n8n
const N8N_WEBHOOK_URL = "https://your-n8n-instance/webhook/your-webhook-id";

export const LectureContext = createContext();

export function LectureProvider({ children }) {
  const [lectures, setLectures] = useState([]); // {id,title,dataUrl,mime,createdAt}
  const [activeLecture, setActiveLectureState] = useState(null);
  const [sending, setSending] = useState(false);

  // флаг — чтобы пропустить автосенд при первичной загрузке
  const skipAutoSendRef = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLectures(parsed);
        if (parsed.length > 0) {
          setActiveLectureState(parsed[0]); // установим активную, но автосенд будет пропущен
        }
      }
    } catch (e) {
      console.error("Load lectures failed", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
    } catch (e) {
      console.error("Save lectures failed", e);
    }
  }, [lectures]);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result, mime: file.type });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // добавляем лекцию (не отправляем автоматически здесь — выбор делает это)
  const addLecture = async (file, title) => {
    if (!file) return null;
    try {
      const { dataUrl, mime } = await fileToDataUrl(file);
      const id = Date.now().toString();
      const newItem = {
        id,
        title: title || file.name.replace(/\.(pdf|txt|docx?)$/i, ""),
        dataUrl,
        mime,
        createdAt: new Date().toISOString(),
      };
      setLectures((prev) => [newItem, ...prev]);
      // делаем новой активной — эта установка может вызвать автосенд (см. useEffect ниже)
      setActiveLectureState(newItem);
      return newItem;
    } catch (err) {
      console.error("addLecture error", err);
      return null;
    }
  };

  const removeLecture = (id) => {
    if (!confirm("Удалить этот файл из истории?")) return;
    setLectures((prev) => prev.filter((l) => l.id !== id));
    if (activeLecture?.id === id) {
      setActiveLectureState(null);
    }
  };

  // Отправляет выбранную лекцию в n8n через webhook
  const sendToN8N = async (lecture) => {
    if (!lecture) throw new Error("No lecture to send");
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("id", lecture.id);
      formData.append("title", lecture.title);
      formData.append("mime", lecture.mime);
      formData.append("createdAt", lecture.createdAt);
      // Отправляем dataUrl — n8n должен декодировать
      formData.append("dataUrl", lecture.dataUrl);

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => null);
      setSending(false);
      return { ok: res.ok, status: res.status, data: json };
    } catch (err) {
      setSending(false);
      console.error("sendToN8N error", err);
      throw err;
    }
  };

  // Обёртка для установки activeLecture: при установке — если это не первичная загрузка — отправляем
  const setActiveLecture = (lecture) => {
    setActiveLectureState(lecture);
  };

  // Авто-отправка при смене activeLecture (но пропускаем initial)
  useEffect(() => {
    if (!activeLecture) return;

    if (skipAutoSendRef.current) {
      // пропускаем первый раз (при инициализации из localStorage)
      skipAutoSendRef.current = false;
      return;
    }

    // отправляем активную лекцию автоматически
    (async () => {
      try {
        await sendToN8N(activeLecture);
        // можно отображать уведомление — но чтобы не ломать UI, просто лог
        console.log("Авто-отправка файла в n8n завершена:", activeLecture.title);
      } catch (err) {
        console.error("Авто-отправка не удалась:", err);
      }
    })();
  }, [activeLecture]);

  return (
    <LectureContext.Provider
      value={{
        lectures,
        activeLecture,
        setActiveLecture,
        addLecture,
        removeLecture,
        sendToN8N,
        sending,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
}
