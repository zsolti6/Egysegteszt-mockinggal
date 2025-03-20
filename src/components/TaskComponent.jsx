import React, { useState, useEffect } from "react";
import { Card, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/taskStyle.css";

export const TaskComponent = ({ elem, values, updateValues }) => {
  const [taskValues, setTaskValues] = useState(Array.isArray(values) ? values : [values]);
  const [showModal, setShowModal] = useState(false);  // To manage modal visibility
  const [imageSrc, setImageSrc] = useState("");  // To store image source for modal

  useEffect(() => {
    setTaskValues(Array.isArray(values) ? values : [values]);
  }, [elem.id, values]);

  const handleTextboxChange = (index, value) => {
    const newValues = [...taskValues];
    newValues[index] = value;
    setTaskValues(newValues);
    updateValues(newValues);
  };

  const handleRadioChange = (index) => {
    const newValues = taskValues.map((_, i) => (i === index ? "1" : "0"));
    setTaskValues(newValues);
    updateValues(newValues);
  };

  const handleCheckboxChange = (index) => {
    const newValues = [...taskValues];
    newValues[index] = newValues[index] === "1" ? "0" : "1";
    setTaskValues(newValues);
    updateValues(newValues);
  };

  // Open modal with the image source
  const openModal = (imgSrc) => {
    setImageSrc(imgSrc);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setImageSrc("");
  };

  return (
    <div>
      <Card id="taskCard" className="shadow-sm p-3 mb-4 color-bg2 rounded w-100 mx-auto">
        <Card.Body>
          <Card.Title className="text-center text-white">
            {elem.taskId}. feladat<br></br> {elem.description}
          </Card.Title>
          <Card.Text className="text-center text-white">{elem.text}</Card.Text>
          
          {elem.picName && (
            <div className="d-flex justify-content-center">
              <img
                id="taskImg"
                className="img-fluid rounded clickable-img w-100"
                src={`https://res.cloudinary.com/drpkpopsq/image/upload/v1741078235/${elem.picName}`}
                alt={elem.picName}
                onClick={() => openModal(`https://res.cloudinary.com/drpkpopsq/image/upload/v1741078235/${elem.picName}`)}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}

          <div className="mt-auto color-bg2" id="taskInputs">
            {/* Modern Styled Textbox */}
            {elem.type.name === "textbox" &&
              elem.isCorrect.split(";").map((_, index) => (
                <input
                  key={index}
                  className="textbox-style mb-3 w-50 ml-3 color-bg3"
                  type="text"
                  value={taskValues[index] || ""}
                  onChange={(e) => handleTextboxChange(index, e.target.value)}
                />
              ))}

            {/* Modern Radio Buttons (2x2 Grid) */}
            {elem.type.name === "radio" && (
              <div className="radio-container">
                {elem.isCorrect.split(";").map((_, index) => (
                  <div key={index} className="form-check color-bg2">
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`radio-${elem.id}-${index}`}
                      name={`radio-${elem.id}`}
                      checked={taskValues[index] === "1"}
                      onChange={() => handleRadioChange(index)}
                    />
                    <label htmlFor={`radio-${elem.id}-${index}`} className="radio-label color-bg3">
                      {elem.answers.split(";")[index]}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Modern Checkboxes (Toggle Style) */}
            {elem.type.name === "checkbox" && (
              <div className="checkbox-container justify-content-center color-bg2">
                {elem.isCorrect.split(";").map((_, index) => (
                  <div key={index} className="form-check color-bg2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${elem.id}-${index}`}
                      checked={taskValues[index] === "1"}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label htmlFor={`checkbox-${elem.id}-${index}`} className="checkbox-label color-bg3">
                      {elem.answers.split(";")[index]}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modal for displaying image */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
        </Modal.Header> 
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <img
              className="img-fluid rounded"
              src={imageSrc}
              alt="Enlarged view"
              style={{ maxHeight: '80vh', maxWidth: '100%' }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
