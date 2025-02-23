import React, { useState } from 'react';
import '../assets/styles/Home.css';
import Navbar from '../components/Navbar';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    username: 'Max Mustermann',
    profilePicture: '/assets/img/profile-pic.jpg',
    hasTickets: true,
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({
      username: '',
      profilePicture: '',
      hasTickets: false,
    });
  };

  return (
    <div className="layout-container"> {/* Wrapper for Layout */}
      {/* Header */}
      <header className="layout-header">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          user={user} 
          onLogout={handleLogout} 
        />
      </header>

      {/* Main Content */}
      <main className="layout-main">
        {/* Hero Background */}
        <div className="hero-background">
          <div className="hero-text">
            <h1>Willkommen bei LifeVerse</h1>
            <p>Erlebe das realistischste Open-World-Erlebnis, das jemals erschaffen wurde.</p>
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-title">Features von LifeVerse</h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Realistische Welt</h3>
              <p className="feature-description">
                Entdecke eine offene Welt, die das echte Leben widerspiegelt.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎮</div>
              <h3 className="feature-title">Multiplayer</h3>
              <p className="feature-description">
                Spiel zusammen mit anderen Spielern in einer dynamischen, lebendigen Welt.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚙️</div>
              <h3 className="feature-title">Tiefgehende Mechaniken</h3>
              <p className="feature-description">
                Erlebe komplexe Simulationen, die jede Aktion beeinflussen.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="testimonials-title">Was die Spieler sagen</h2>
          <div className="testimonial-item">
            <p>"LifeVerse bietet eine so realistische Erfahrung, wie ich sie mir immer gewünscht habe!"</p>
            <p className="testimonial-author">- Alex, Spieler</p>
          </div>
          <div className="testimonial-item">
            <p>"Ich habe noch nie eine so dynamische Open-World-Simulation erlebt!"</p>
            <p className="testimonial-author">- Maria, Spielerin</p>
          </div>
        </section>

        {/* Partner Section */}
        <section className="partner-section">
          <div className="partner-logo">
            <img src="../assets/img/partner-logo1.png" alt="Partner 1" />
          </div>
          <div className="partner-logo">
            <img src="../assets/img/partner-logo2.png" alt="Partner 2" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 LifeVerse Studios. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}

export default Home;
