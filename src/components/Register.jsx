import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReCAPTCHA from "react-google-recaptcha";
import sha256 from "crypto-js/sha256";
import { BASE_URL } from '../config';
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

export const GenerateSalt = (SaltLength) => {
  const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < SaltLength; i++) {
    const randomIndex = Math.floor(Math.random() * karakterek.length);
    salt += karakterek[randomIndex];
  }
  return salt;
}

function GenerateRandomPassword(length = 16) {
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/";
  const allChars = lowerCaseChars + upperCaseChars + digits + specialChars;
  let password = "";
  password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
  password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return password;
}

export const RegisterPage = ({ user }) => {
  const [formData, setFormData] = useState({
    loginName: "",
    password: "",
    confirmPassword: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigator = useNavigate();
  
    useEffect(() => {
        if (user != null) {
          navigator("/profil");
        }
      }, [navigator, user]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGeneratePassword = () => {
    const newPassword = GenerateRandomPassword();
    setFormData({ ...formData, password: newPassword, confirmPassword: newPassword });
  };

  const validateForm = () => {
    if (!formData.loginName) return "Kérjük, adja meg a felhasználónevet!";
    if (!formData.email) return "Kérjük, adja meg az email címét!";
    if (!formData.password) return "Kérjük, adjon meg egy jelszót!";
    if (formData.password !== formData.confirmPassword) return "A jelszavak nem egyeznek!";
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Kérjük, igazolja, hogy nem robot!");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true); // Show loading spinner
    try {
      const salt = GenerateSalt(64);
      const body = {
        loginName: formData.loginName,
        hash: sha256(formData.password + salt).toString(),
        salt: salt,
        permissionId: 1,
        active: true,
        email: formData.email,
        profilePicturePath: "default.jpg"
      };
      const user = {
        User: body,
        CaptchaToken: captchaToken
      }
      const url = `${BASE_URL}/erettsegizzunk/Auth/regisztracio`;
      await axios.post(url, user);
    } catch (error) {
      setError('Hiba történt a regisztráció során: ' + (error.response ? error.response.data : error.message));
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  return (
    <div className="login-container bg-image">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="login-content">
        <div className="login-image">
          <img
            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern Clean Background"
            className="login-image"
          />
        </div>
        <div className="login-card">
          <h2 className="text-center mb-4">Fiók létrehozása</h2>
          {error && <div className="alert alert-danger">{error}</div>} {/* Conditionally render error message */}
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <input placeholder="Felhasználónév" type="text" className="form-control" id="loginName" maxLength={10} value={formData.loginName} onChange={handleChange} />
            </div>
            <div className="form-group mb-3">
              <input placeholder="Email cím" type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input placeholder="Jelszó" type={passwordVisible ? "text" : "password"} className="form-control" id="password" value={formData.password} onChange={handleChange} />
                <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>{passwordVisible ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleGeneratePassword} title="Jelszó generálása"><i className="bi bi-shuffle"></i></button>
              </div>
            </div>
            <div className="form-group mb-3">
              <input placeholder="Jelszó megerősítése" type="password" className="form-control" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
            <div className="form-group mb-3 d-flex justify-content-center recaptcha-container">
              <ReCAPTCHA
                sitekey="6LeQqdkqAAAAABst5YpaC2RfBcOKWb6sShvYGBqO"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>
            <button type="submit" className="btn color-bg2 text-white w-100">Regisztrálás</button>
            <div className="d-flex justify-content-center mt-2">
              <a href="/belepes" className="text-muted">Van már fiókod? Jelentkezz be!</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}