import React, { useState } from "react";
import "./Sidebar.css";

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
  // ---------------- ТИГР ------------------
  const tigerImages = [
    "/tiger/1.png",
    "/tiger/2.png",
    "/tiger/3.png",
    "/tiger/4.png"
  ];

  const [tigerIndex, setTigerIndex] = useState(0);

  const changeTiger = () => {
    setTigerIndex((prev) => (prev + 1) % tigerImages.length);
  };

  // ---------------- ПАПКИ ------------------
  const [folders, setFolders] = useState([
    { name: "frontend", open: false, files: ["react intro", "hooks", "state management"] },
    { name: "backend", open: false, files: ["node basics", "express routes"] }
  ]);

  const createFolder = () => {
    const title = prompt("название папки:");
    if (!title) return;
    setFolders((prev) => [
      ...prev,
      { name: title.toLowerCase(), open: false, files: [] }
    ]);
  };

  const toggle = (idx) =>
    setFolders((prev) =>
      prev.map((f, i) =>
        i === idx ? { ...f, open: !f.open } : f
      )
    );

  return (
    <aside className="sidebar-root">
      <div className="sidebar-panel">
        <div className="sidebar-header">
          <h3>библиотека</h3>
          <button className="btn create" onClick={createFolder}>
            создать папку
          </button>
        </div>

        <div className="folders">
          {folders.map((f, i) => (
            <div key={i} className="folder">
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
      </div>

      {/* ------------------ ТИГР ------------------ */}
      <div className="tiger-container" onClick={changeTiger}>
        <img
          src={tigerImages[tigerIndex]}
          alt="Тигр эмоция"
          className="tiger-image"
          draggable="false"
        />
      </div>
    </aside>
  );
}
