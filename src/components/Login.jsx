import React, { useState, useEffect } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";  // Import reCAPTCHA
import sha256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebaseConfig";
import { BASE_URL } from '../config';
import "../css/Login.css"; // Import the CSS file

export const LoginPage = ({ user, handleLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // New state variable for error message
  const navigator = useNavigate();

  useEffect(() => {
      if (user != null) {
        navigator("/profil");
      }
    }, [navigator, user]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleLogin = async () => {
    setLoading(true); // Show loading spinner
    setErrorMessage(""); // Clear previous error message
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      if(rememberMe){
        localStorage.setItem("googleUser", JSON.stringify(user));
      }else{
        sessionStorage.setItem("googleUser", JSON.stringify(user));
      }
      
      const url = `${BASE_URL}/erettsegizzunk/Registry/googleLogin`;
      await axios.post(url, JSON.stringify(user.email), {
        headers: { "Content-Type": "application/json" },
      }).then(response => {
        if (response.status === 200) {
          const userData = response.data;
          userData.photoURL = user.photoURL;
          if(rememberMe){
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("googleLogged", true);
          }else{
            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("googleLogged", true);
          }
          handleLogin(userData, true); // Update the App state
        }
      });
      localStorage.setItem("rememberMe", rememberMe);
      navigator("/");
    } catch (error) {
      setErrorMessage("Google login failed: " + error.message);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner
    setErrorMessage(""); // Clear previous error message
    
    if (!captchaToken) {
      setErrorMessage("Kérjük, igazolja, hogy nem robot!");
      setLoading(false); // Hide loading spinner
      return;
    }

    try {
      const saltUrl = `${BASE_URL}/erettsegizzunk/Login/SaltRequest`;
      const saltResponse = await axios.post(saltUrl, JSON.stringify(username), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const salt = saltResponse.data;
      const tmpHash = sha256(password + salt.toString()).toString();
      const loginUrl = `${BASE_URL}/erettsegizzunk/Auth/Login`;
      const body = {
        username: username,
        password: tmpHash,
        captchaToken: captchaToken
      };
        
      const loginResponse = await axios.post(loginUrl, body);
      if (loginResponse.status === 200) {
        const userData = loginResponse.data;
        if(rememberMe){
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("googleLogged", false);
        }else{
          sessionStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem("googleLogged", false);
        }
        
        localStorage.setItem("rememberMe", rememberMe);
        handleLogin(userData, false); // Update the App state
        navigator("/");
      } else {
        setErrorMessage("Hiba történt a bejelentkezéskor!");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
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
        <div className="login-card overflow-scroll">
          <h2 className="text-center mb-4">Bejelentkezés</h2>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Conditionally render error message */}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group mb-3">
              <input
                placeholder="Felhasználónév"
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <input
                  placeholder="Jelszó"
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                </button>
              </div>
            </div>
            
            <div className="form-group mb-2 d-flex justify-content-left">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">Emlékezz rám</label>
            </div>

            <div className="form-group mb-3 d-flex justify-content-center recaptcha-container">
              <ReCAPTCHA
                sitekey="6LeQqdkqAAAAABst5YpaC2RfBcOKWb6sShvYGBqO"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>
            
            <button type="submit" className="btn color-bg2 text-white w-100">Belépés</button>
          
            <div className="d-flex justify-content-between mt-3">
              <a href="/elfelejtett-jelszo" className="text-muted">Elfelejtett jelszó</a>
              <a href="/regisztracio" className="text-muted">Még nincs fiókod?</a>
            </div>
            <div className="d-flex justify-content-center">
              <button className="googleLogin mt-3 btn border" onClick={handleGoogleLogin}>
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                Folytatás Google-fiókkal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};