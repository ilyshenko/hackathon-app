import React, { useContext, useRef, useState } from "react";
import "./Lectures.css";
import { LectureContext } from "../../context/LectureContext";

export default function Lectures() {
  const { lectures, addLecture, activeLecture, setActiveLecture } = useContext(LectureContext);

  // модалка / временные состояния перед загрузкой
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // при выборе файла не отправляем — просто сохраняем в состоянии, даём возможность редактировать title
  const handleFileChosen = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setTitleDraft((t) => t || file.name.replace(/\.(pdf|txt|docx?)$/i, ""));
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Выберите файл перед загрузкой.");
    setLoading(true);
    try {
      await addLecture(selectedFile, titleDraft);
      // сброс формы
      setSelectedFile(null);
      setTitleDraft("");
      setShowUpload(false);
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке файла.");
    } finally {
      setLoading(false);
    }
  };

  // выбор карточки в основной области — делает её активной (и по логике контекста — отправится)
  const handleSelectInGrid = (lec) => {
    setActiveLecture(lec);
  };

  // для открытия файла отдельно (двойной клик)
  const handleOpen = (lec) => {
    window.open(lec.dataUrl, "_blank");
  };

  return (
    <div className="lectures-root">
      <div className="lectures-row">
        <div className="lecture-card upload-card" onClick={() => setShowUpload(true)}>
          <div className="plus">+</div>
          <div className="upload-text">загрузить лекцию</div>
        </div>

        <div className="lecture-row-grid">
          {lectures.map((lec) => {
            const active = activeLecture?.id === lec.id;
            return (
              <div
                key={lec.id}
                className={`lecture-card ${active ? "active" : ""}`}
                onClick={() => handleSelectInGrid(lec)}
                onDoubleClick={() => handleOpen(lec)}
                title="клик — выбрать; двойной клик — открыть"
              >
                <div className="book-icon">📘</div>
                <div className="lecture-title">{lec.title}</div>
                <div className="lecture-date">{new Date(lec.createdAt).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {showUpload && (
        <div className="modal-backdrop" onClick={() => setShowUpload(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">загрузить новую лекцию</div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="modal-input"
              onChange={handleFileChosen}
            />

            <input
              type="text"
              className="modal-input"
              placeholder="название (опционально)"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button className="modal-btn" onClick={() => { setShowUpload(false); setSelectedFile(null); setTitleDraft(""); }} disabled={loading}>
                отмена
              </button>

              <button
                className="modal-btn"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                disabled={loading}
              >
                выбрать файл
              </button>

              <button className="modal-btn" onClick={handleUpload} disabled={loading || !selectedFile}>
                {loading ? "сохраняем..." : "загрузить"}
              </button>
            </div>

            {selectedFile && <div style={{ marginTop: 12, fontSize: 13 }}>{selectedFile.name}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
