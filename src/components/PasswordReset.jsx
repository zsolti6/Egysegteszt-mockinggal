import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from '../config';
import "../css/Login.css"; // Import the CSS file

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}/erettsegizzunk/Password/elfelejtett-jelszo-keres`,
        JSON.stringify(email),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Sikeres jelszó visszaállítási kérelem. Ellenőrizze az email fiókját!");
      } else {
        setMessage("Hiba történt a kérés feldolgozásakor. Próbálja újra később.");
      }
    } catch (error) {
      console.error("Password reset request failed", error);
      setMessage("Nem sikerült elküldeni a kérést. Ellenőrizze az email címet és próbálja újra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container d-flex justify-content-center align-items-center bg-image" style={{ height: "100vh" }}>
        <div className="card p-4" style={{ width: "400px" }}>
          <h2 className="text-center mb-4">Jelszó visszaállítása</h2>
          <form onSubmit={handlePasswordReset}>
            <div className="form-group mb-3">
              <input
                placeholder="Email cím"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Küldés..." : "Jelszó visszaállítási link küldése"}
            </button>

            {message && (
              <div className="alert alert-info text-center mt-3" role="alert">
                {message}
              </div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <a href="/belepes" className="text-muted">Vissza a bejelentkezéshez</a>
              <a href="/regisztracio" className="text-muted">Még nincs fiókod?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}