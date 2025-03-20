import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Navbar.css";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import SettingsWindow from "./SettingsWindow";
import logo from "./logo.png";

export const Navbar = ({ user, googleLogged, handleLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDocumentClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setNavbarCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const openSettings = () => {
    setSettingsOpen(true);
    setDropdownOpen(false);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-dark color-bg1 fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand" onClick={() => navigate("/")}><img src={logo} className="mt-0 navLogo"></img></span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={!navbarCollapsed}
            aria-label="Toggle navigation"
            onClick={() => setNavbarCollapsed(!navbarCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${navbarCollapsed ? "" : "show"}`} id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/statisztika" className="nav-link fs-5">Statisztika</Link>
              </li>
              <li className="nav-item">
                <Link to="/feladat-valasztas" className="nav-link fs-5">Új feladatlap</Link>
              </li>
            </ul>
            {user ? (
              <div className="d-flex align-items-center position-relative">
                <span className="me-2 fs-5 text-white">{user.name || user.displayName}</span>
                <img
                  onClick={toggleDropdown}
                  src={
                    googleLogged
                      ? user.photoURL
                      : `https://res.cloudinary.com/drpkpopsq/image/upload/v1741078235/${user.profilePicturePath}`
                  }
                  alt="kep"
                  className="rounded-circle" style={{ maxHeight: "35px", cursor: "pointer" }}
                />
                {dropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-end color-bg1 show position-absolute menuButton" style={{ top: "100%", right: 0 }}>
                    <Link to="/profil" onClick={toggleDropdown} className="dropdown-item menuButton">
                      <FaUser className="me-2" /> Profilom
                    </Link>
                    <button onClick={openSettings} className="dropdown-item menuButton">
                      <FaCog className="me-2" /> Beállítások
                    </button>
                    <button className="dropdown-item menuButton" onClick={() => {
                      toggleDropdown();
                      handleLogout();
                    }}>
                      <FaSignOutAlt className="me-2" /> Kijelentkezés
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Link to="/belepes" className="btn btn-outline-light me-2">Bejelentkezés</Link>
                <Link to="/regisztracio" className="btn btn-light color-text2 me-2">Regisztráció</Link>
                <button onClick={openSettings} id="settings" className="fs-3 mb-2 bg-transparent border-0 text-white">
                  <FaCog className="me-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {settingsOpen && <SettingsWindow onClose={closeSettings} />}
    </>
  );
};