import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Lectures from "../components/Lectures/Lectures";
import MemoryCard from "../components/MemoryCard/MemoryCard";  // ← ДОБАВЛЕНО
import Notes from '../components/Notes/Notes';
import Tests from '../components/Tests/Tests';
import "./Work.css";

export default function Work() {
  const tabs = ["лекции", "конспект", "тест", "memory card", "репетитор"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="work-layout">
      <Sidebar />
      <div className="work-main">
        <Header tabs={tabs} active={activeTab} setActive={setActiveTab} />

        <div className="work-body">

          {activeTab === "лекции" && <Lectures />}

          {activeTab === "memory card" && <MemoryCard />}

          {activeTab === "конспект" && <Notes />}

          {activeTab === "тест" && <Tests />}

          {activeTab !== "лекции" && activeTab !== "memory card" && activeTab !== "конспект" && activeTab !== "тест" &&(
            <div className="placeholder-panel">
              <h2 className="placeholder-title">{activeTab}</h2>
              <p className="placeholder-text">
                здесь будет содержимое вкладки «{activeTab}».
              </p>
            </div>
          )}



        </div>
      </div>
    </div>
  );
}
