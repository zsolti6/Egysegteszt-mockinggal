import React from "react";
import { TaskComponent } from "./TaskComponent";
import "../css/SubPage.css";

export const ExerciseWindow = ({ activeTask, taskValues, updateTaskValues }) =>  {
  return (
    <div className="exercise">
      {activeTask ? (
        <TaskComponent
          elem={activeTask}
          values={taskValues[activeTask.id]?.values || []}
          updateValues={(newValues) => updateTaskValues(activeTask.id, newValues)}
        />
      ) : (
        <p>Válassz feladatot.</p>
      )}
    </div>
  );
}