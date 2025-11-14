import React, { useState } from "react";
import "./Lectures.css";

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10);
}

export default function Lectures() {
  const [lectures, setLectures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [title, setTitle] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileData(file);
    if (!title) setTitle(file.name);
  };

  const saveLecture = () => {
    if (!fileData) return;

    const url = URL.createObjectURL(fileData);

    const newLecture = {
      id: uuid(),
      title: title || "Новая лекция",
      file: fileData,
      url
    };

    setLectures([...lectures, newLecture]);

    setFileData(null);
    setTitle("");
    setShowModal(false);
  };

  const openLecture = (lecture) => {
    window.open(lecture.url, "_blank");
  };

  return (
    <div className="lectures-container">

      {/* Кнопка-карточка */}
      <div className="upload-card" onClick={() => setShowModal(true)}>
        <div className="upload-plus">+</div>
        <div className="upload-text">загрузить лекцию</div>
      </div>

      {/* Вывод лекций */}
      {lectures.map((lec) => (
        <div className="lecture-card" key={lec.id} onClick={() => openLecture(lec)}>
          <div className="lecture-icon">📘</div>
          <div className="lecture-title">{lec.title}</div>
        </div>
      ))}

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">загрузить новую лекцию</div>

            <input
              type="file"
              accept=".pdf,.txt"
              className="modal-input"
              onChange={handleFileUpload}
            />

            <input
              type="text"
              className="modal-input"
              placeholder="название лекции"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button className="modal-btn" onClick={saveLecture}>
              сохранить
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
