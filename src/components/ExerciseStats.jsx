import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import "../css/taskStyle.css";

export const ExerciseStats = () => {
  const { state } = useLocation();
  const { taskValues, exercises } = state || {};
  const sortedTaskValues = Object.values(taskValues || {}).sort((a, b) => a.taskId - b.taskId);

  const getCorrectAnswers = (task) => task.answers.split(";").filter((_, i) => task.isCorrect.split(";")[i] === "1").join(", ");
  const getUserAnswers = (task) => task.answers.split(";").filter((_, i) => task.values[i] === "1").join(", ") || "Nem válaszoltál";

  useEffect(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new Tooltip(el));
  }, []);

  return (
    <div className="page-wrapper bg-image">
    <div className="container col-md-8 exercise-stats-container mt-3">
      <h2 className="mb-4 text-center text-white">Feladatok összegzése</h2>
      <div className="table-responsive">
        <table className="table color-bg2  ">
          <thead className="thead-dark">
            <tr>
              {["Feladat", "Megoldás", "Válaszaid", "Értékelés"].map((h, i) => (
                <th key={i} className="text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTaskValues.map((task, i) => (
              <tr key={i}>
                <td className="color-bg3">{task.taskId}</td>
                <td className="color-bg3">{getCorrectAnswers(task)}</td>
                <td className="color-bg3">{getUserAnswers(task)}</td>
                <td className="text-center color-bg3">
                  {getCorrectAnswers(task) === getUserAnswers(task) ? (
                    <span className="text-success">✅</span>
                  ) : (
                    <span className="text-danger">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};