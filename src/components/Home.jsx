import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/SubPage.css";
import axios from "axios";
import { FaDiscord } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import { FooterComponent } from "./Footer";

export const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        const response = await axios.get(
          "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://eduline.hu/rss")
        );

        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, "application/xml");
        const items = xml.querySelectorAll("item");

        const articleList = Array.from(items).map((item) => ({
          title: item.querySelector("title")?.textContent || "No title",
          link: item.querySelector("link")?.textContent || "#",
          description: item.querySelector("description")?.textContent || "No description available.",
        }));

        setArticles(articleList);
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
      }
    };

    fetchRSS();
  }, []);

  return (
    <div id="mainDiv" className="d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <section
        className="hero-section text-center text-white d-flex justify-content-center align-items-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <div className="container">
          <h1 className="display-4">Üdvözöllek az Érettségi Gyakorló Oldalon!</h1>
          <p className="lead text-white">
            Készülj fel az érettségire hatékonyan és szórakoztatóan. Kezdd el a gyakorlást még ma!
          </p>
          <a href="#featured" className="btn btn-primary btn-lg color-bg2 border-0">
            Kezdjük!
          </a>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section py-5" id="featured">
        <div className="container">
          <h2 className="text-center mb-5">Miért válassz minket?</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-item p-4 shadow-sm">
                <i className="fas fa-book-open fa-3x mb-3 text-primary"></i>
                <h3 className="text-primary">Széles választék</h3>
                <p>Rengeteg feladat és segédanyag elérhető különböző tantárgyakból.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item p-4 shadow-sm">
                <i className="fas fa-user-friends fa-3x mb-3 text-info"></i>
                <h3 className="text-info">Közösség</h3>
                <p>Csatlakozz más diákokhoz és osszd meg tapasztalataidat a <a href="https://discord.gg/uR3uvaY5tp" target="_blank" className="discord-link"><FaDiscord className="fs-4"/> Discord</a> szerverünkön.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item p-4 shadow-sm">
                <i className="fas fa-chart-line fa-3x mb-3 text-success"></i>
                <h3 className="text-success">Statisztikák</h3>
                <p>Kövesd a fejlődésed és lásd, hol érdemes még gyakorolnod.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="cta-section text-center text-white py-5"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h2 className="mb-4">Készen állsz az érettségire?</h2>
          <p className="lead mb-4 text-white">
            Regisztrálj most, és kezdd el a gyakorlást azonnal!
          </p>
          <a href="/regisztracio" className="btn btn-light btn-lg color-bg3 border-0">
            Regisztráció
          </a>
        </div>
      </section>
      <FooterComponent />
    </div>
  );
};