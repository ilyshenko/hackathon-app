import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { LectureContext } from "../../context/LectureContext";

const ChevronRight = ({ open }) => (
  <svg
    className={`chev ${open ? "open" : ""}`}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Sidebar() {
  const { lectures, activeLecture, setActiveLecture } = useContext(LectureContext);

  // ------------------- ПАПКИ -------------------
const [folders, setFolders] = useState([]);

  const createFolder = () => {
    const title = prompt("название папки:");
    if (!title) return;
    setFolders((prev) => [...prev, { name: title.toLowerCase(), open: false, files: [] }]);
  };

  const toggle = (i) =>
    setFolders((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, open: !f.open } : f))
    );

  // ------------------- ТИГР -------------------
  const tigerImages = ["/tiger/1.png", "/tiger/2.png", "/tiger/3.png", "/tiger/4.png"];
  const [tigerIndex, setTigerIndex] = useState(0);

  const changeTiger = () => setTigerIndex((prev) => (prev + 1) % tigerImages.length);

  // ------------------- DRAG & DROP -------------------

  const [dragging, setDragging] = useState(null); // { id, title }

  const onDragStart = (lec) => {
    setDragging({ id: lec.id, title: lec.title });
  };

  const onDragEnd = () => setDragging(null);

  const onDragOverFolder = (e) => {
    e.preventDefault();
  };

  const onDropToFolder = (folderIndex) => {
    if (!dragging) return;

    setFolders((prev) =>
      prev.map((f, idx) =>
        idx === folderIndex
          ? { ...f, files: [...f.files, dragging.title] }
          : f
      )
    );

    setDragging(null);
  };

  return (
    <aside className="sidebar-root">
      <div className="sidebar-panel">

        {/* --------- ШАПКА + КНОПКА --------- */}
        <div className="sidebar-header">
          <h3>библиотека</h3>
          <button className="btn create" onClick={createFolder}>
            создать папку
          </button>
        </div>

        {/* --------- ПАПКИ --------- */}
        <div className="folders">
          {folders.map((f, i) => (
            <div
              key={i}
              className={`folder ${dragging ? "folder-dropzone" : ""}`}
              onDragOver={onDragOverFolder}
              onDrop={() => onDropToFolder(i)}
            >
              <button className="folder-toggle" onClick={() => toggle(i)}>
                <ChevronRight open={f.open} />
                <span className="fname">{f.name}</span>
              </button>

              <div className={`files ${f.open ? "open" : ""}`}>
                {f.files.length === 0 ? (
                  <div className="empty">пусто</div>
                ) : (
                  f.files.map((file, idx) => (
                    <div key={idx} className="file-row">
                      {file}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --------- ЗАГРУЖЕННЫЕ ФАЙЛЫ --------- */}
        <div className="history-list">
          {lectures.map((lec) => {
            const active = activeLecture?.id === lec.id;
            return (
              <div
                key={lec.id}
                className={`file-row upload-file ${active ? "active-file" : ""}`}
                draggable
                onDragStart={() => onDragStart(lec)}
                onDragEnd={onDragEnd}
                onClick={() => setActiveLecture(lec)}
              >
                {lec.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* --------- ТИГР --------- */}
      <div className="tiger-container" onClick={changeTiger}>
        <img
          src={tigerImages[tigerIndex]}
          alt="Тигр"
          className="tiger-image"
          draggable="false"
        />
      </div>

    </aside>
  );

}
