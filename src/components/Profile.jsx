import axios from "axios";
import sha256 from "crypto-js/sha256";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../config";
import "../css/Profile.css";

export const Profile = ({ user, setUser, googleLogged, handleLogout }) => {
  const [userData, setUserData] = useState({
    id: 0,
    name: "string",
    email: "string",
    permission: 0,
    newsletter: false,
    profilePicture: "string",
    profilePicturePath: "string",
    token: "string",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state variable for error message
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (user == null) {
      navigate("/belepes");
    }
  }, [navigate, user]);

  const [formData, setFormData] = useState({
    token: "",
    loginName: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        newsletter: user.newsletter || false,
        id: user.id || 0,
        permission: user.permission || 0,
        profilePicture: user.profilePicture || null,
        profilePicturePath: user.profilePicturePath || "string",
        token: user.token || "string",
      });

      setFormData({
        token: user.token || "string",
        loginName: user.name || "string",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user, changePassword]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    if (changePassword) {
      try {
        const saltUrl = `${BASE_URL}/erettsegizzunk/Login/SaltRequest`;
        const saltResponse = await axios.post(
          saltUrl,
          JSON.stringify(formData.loginName),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const salt = saltResponse.data;
        const tmpHashOldPswd = sha256(
          formData.oldPassword + salt.toString()
        ).toString();
        const tmpHashNewPswd = sha256(
          formData.newPassword + salt.toString()
        ).toString();

        const updatedFormData = {
          ...formData,
          oldPassword: tmpHashOldPswd,
          newPassword: tmpHashNewPswd,
        };

        await axios.post(
          `${BASE_URL}/erettsegizzunk/Password/jelszo-modositas`,
          updatedFormData
        );
      } catch (error) {
        setErrorMessage(error.response.data.message);
        return;
      }
    }

    try {
      await axios.put(
        `${BASE_URL}/erettsegizzunk/User/sajat-felhasznalo-modosit`,
        userData
      ).then((response) => {
        if (response.status === 200) {
          setChangePassword(false);
          setUser(userData);
        }
      });
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="profile-container d-flex flex-column min-vh-100 bg-image">
      <div className="container mt-5 mb-5">
        <h1 className="text-center mb-3 mt-5 text-white">Adataim</h1>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}{" "}
        {/* Conditionally render error message */}
        <form
          onSubmit={handleSubmit}
          className="profile-card bg-light p-4 rounded shadow mx-auto mt-4"
        >
          <div className="mb-1">
            <label htmlFor="name" className="form-label">
              Felhasználónév
            </label>
            <input
              maxLength={10}
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email cím
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="form-control"
              disabled={googleLogged}
              required
            />
          </div>
          {!googleLogged && (
            <div>
              <div className="mb-3 mt-1 d-flex align-items-center">
                <input
                  type="checkbox"
                  id="passwordChange"
                  name="passwordChange"
                  checked={changePassword}
                  onChange={() => {
                    setChangePassword(!changePassword);
                    setFormData({
                      ...formData,
                      oldPassword: "",
                      newPassword: "",
                    });
                    setPasswordVisible(false);
                  }}
                  className="form-check-input me-2"
                />
                <label
                  htmlFor="passwordChange"
                  style={{ lineHeight: "1" }}
                  className="form-check-label"
                >
                  Szeretnék jelszavat változtatni
                </label>
              </div>
              <div className="form-group mb-3">
                <input
                  placeholder="Régi jelszó"
                  type="password"
                  className="form-control"
                  id="password"
                  disabled={!changePassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                  value={formData.oldPassword}
                />
              </div>
              <div className="form-group mb-3">
                <div className="input-group">
                  <input
                    placeholder="Új jelszó"
                    type={passwordVisible ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    disabled={!changePassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    value={formData.newPassword}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                    disabled={!changePassword}
                  >
                    {passwordVisible ? (
                      <i className="bi bi-eye"></i>
                    ) : (
                      <i className="bi bi-eye-slash"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mb-3 mt-1">
            <input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={userData.newsletter === true}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label htmlFor="newsletter" className="form-check-label ms-2">
              Feliratkozom a hírlevélre
            </label>
          </div>
          <button type="submit" className="btn color-bg1 text-white w-100 mb-2">
            Mentés
          </button>
        </form>
      </div>
    </div>
  );
};
