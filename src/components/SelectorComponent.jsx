import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "../css/Selector.css";
import { BASE_URL } from '../config';

export const SelectorComponent = () => {
  const [formData, setFormData] = useState({
    subject: "",
    difficulty: "közép",
  });

  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [themes, setThemes] = useState({});
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [themeFilter, setThemeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/erettsegizzunk/Themes/get-temak-feladatonkent`)
      .then((response) => {
        const themesData = response.data;
        setThemes(themesData);
      })
      .catch((error) => {
        console.error("Error fetching themes:", error);
      });

    axios.get(`${BASE_URL}/erettsegizzunk/Tantargyak/get-tantargyak`)
      .then((response) => {
        const formattedSubjects = response.data.map((subject) => ({
          id: subject.id,
          name: subject.name,
          value: String(subject.id),
          label: subject.name,
        }));

        setSubjects(formattedSubjects);

        if (formattedSubjects.length > 0) {
          setSubjectId(formattedSubjects[0].id);
          setFormData((prev) => ({
            ...prev,
            subject: formattedSubjects[0].name,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedExercises = localStorage.getItem("exercises");
    const savedTaskValues = localStorage.getItem("taskValues");

    if (savedExercises && savedTaskValues) {
      setShowModal(true);
    }
  }, []);

  const handleContinue = () => {
    const savedExercises = JSON.parse(localStorage.getItem("exercises"));
    const savedTaskValues = JSON.parse(localStorage.getItem("taskValues"));
    navigate("/gyakorlas", {
      state: {
        subject: formData.subject,
        difficulty: formData.difficulty,
        subjectId,
        savedExercises,
        savedTaskValues,
      },
    });
  };

  const handleNewAttempt = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "subject") {
      const selectedSubject = subjects.find((subject) => subject.id.toString() === value);
      if (selectedSubject) {
        setSubjectId(selectedSubject.id);
        setFormData((prev) => ({
          ...prev,
          subject: selectedSubject.name,
        }));
        setSelectedThemes([]); // Clear selected themes when a new subject is selected

        // Log the filtered themes for the selected subject
        const filteredThemes = themes[selectedSubject.name.toLowerCase()];
        if (filteredThemes) {
          console.log(filteredThemes.map(theme => ({ name: theme.theme.name, count: theme.count })));
        } else {
          console.log([]);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThemeFilterChange = (e) => {
    setThemeFilter(e.target.value);
  };

  const handleThemeSelect = (themeId) => {
    if (!selectedThemes.includes(themeId)) {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };

  const handleThemeRemove = (themeId) => {
    setSelectedThemes(selectedThemes.filter(t => t !== themeId));
  };

  const handleStartExercise = () => {
    navigate("/gyakorlas", { state: { ...formData, subjectId, themeIds: selectedThemes } });
  };

  const filteredThemes = themes[formData.subject.toLowerCase()]?.filter(theme =>
    theme.theme.name.toLowerCase().includes(themeFilter.toLowerCase())
  ) || [];

  return (
    <div className="page-wrapper bg-image">
    {loading ? (
      <div className="spinner-container" role="status">
        <div className="spinner"></div>
      </div>
    ) : (
      <>
        <div className="content-container">
          <div className="row">
            {/* Left Column: Subject and Difficulty Selection */}
            <div className="col-lg-6 col-12">
              <h4>Válassz tantárgyat</h4>
              <form className="exercise-form">
                <div className="radio-group">
                  {subjects.map(({ id, name }) => (
                    <label className="radio-option" key={id}>
                      <input
                        type="radio"
                        name="subject"
                        value={id}
                        checked={subjectId === id}
                        onChange={handleChange}
                      />
                      <span className="name">{name}</span>
                    </label>
                  ))}
                </div>

                <p>Középszintű vagy emelt szintű érettségi feladatokat szeretnél gyakorolni?</p>

                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="difficulty"
                      value="közép"
                      checked={formData.difficulty === "közép"}
                      onChange={handleChange}
                    />
                    <span className="name">Közép szint</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="difficulty"
                      value="emelt"
                      checked={formData.difficulty === "emelt"}
                      onChange={handleChange}
                    />
                    <span className="name">Emelt szint</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Right Column: Theme Selection */}
            <div className="col-lg-6 col-12">
              <h4>Témák</h4>
              <div className="theme-filter-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Szűrés témák szerint"
                  value={themeFilter}
                  onChange={handleThemeFilterChange}
                  className="theme-filter-input"
                />
              </div>
              <div className="checkbox-group">
                {filteredThemes.map((theme, index) => (
                  <label className="checkbox-option" key={index}>
                    <input
                      type="checkbox"
                      checked={selectedThemes.includes(theme.theme.id)}
                      onChange={() => handleThemeSelect(theme.theme.id)}
                    />
                    <span className="name">{theme.theme.name} ({theme.count})</span>
                  </label>
                ))}
              </div>
              <div className="selected-themes">
                {selectedThemes.map((themeId, index) => {
                  const theme = filteredThemes.find(t => t.theme.id === themeId);
                  return (
                    <button
                      key={index}
                      type="button"
                      className="theme-button"
                      onClick={() => handleThemeRemove(themeId)}
                    >
                      {theme?.theme.name} &times;
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Start Exercise Button - Moved Outside the Columns */}
          <div className="start-button-container">
            <button
              type="button"
              className="select-button"
              onClick={handleStartExercise}
            >
              Feladatlap megkezdése
            </button>
          </div>
        </div>
      </>
    )}

    {/* Modal for Continuing Previous Attempt */}
    <Modal show={showModal} onHide={handleNewAttempt} centered>
      <Modal.Header closeButton>
        <Modal.Title>Folytatni szeretnéd?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Van egy korábbi próbálkozásod. Szeretnéd folytatni?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleNewAttempt}>
          Új próbálkozás
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          Folytatás
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  );
};