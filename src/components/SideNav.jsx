import React from "react";
import "../css/Sidenav.css";

export const Sidenav = ({ tasks, setActiveComponent, activeIndex, isOpen, setIsOpen, taskValues }) => {
  return (
    <div className={`sidenav ${isOpen ? "open" : "closed"}`}>
      {/* Task Buttons */}
      {tasks.map((task, index) => (
        <button
          key={task.id}
          className={`task-button btn btn-outline-primary w-100 text-start mb-2 ${
            activeIndex === index ? "active" : ""
          }`}
          onClick={() => setActiveComponent(task.taskId - 1)}
        >
          Feladat {task.taskId}
          <span className={`answer-indicator ${taskValues[task.id]?.values.some(value => value !== "0" && value !== "") ? "answered" : "not-answered"}`}></span>
        </button>
      ))}
    </div>
  );
};