import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-column">
            <span className="footer-logo-main">JACK DANIEL'S</span>
            <span className="footer-logo-sub">TENNESSEE WHISKEY</span>
            <p className="footer-distillery-text">
              Crafted with pride in Lynchburg, Tennessee. Registered Distillery No. 1.
            </p>
          </div>

          <div className="footer-column">
            <h4>EXPLORE</h4>
            <div className="footer-links">
              <a href="#hero">Heritage</a>
              <a href="#pour-experience">The Experience</a>
              <a href="#premium">Premium</a>
              <a href="#collection">The Collection</a>
              <a href="#special-packages">Special Packages</a>
              <a href="#history">History</a>
              <a href="#serve">How to Serve</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>THE CRAFT</h4>
            <div className="footer-links">
              <a href="#pour-experience">Cave Spring Water</a>
              <a href="#pour-experience">Charcoal Mellowing</a>
              <a href="#premium">Coopering & Barrels</a>
              <a href="#premium">Single Barrel Reserve</a>
            </div>
          </div>

          <div className="footer-column">
            <h4>RESPONSIBILITY</h4>
            <p className="age-statement">
              JACK DANIEL'S REMINDS YOU TO DRINK RESPONSIBLY. <br />
              TENNESSEE WHISKEY • 40%–47% ALC./VOL. (80–94 PROOF). <br />
              JACK DANIEL DISTILLERY, LYNCHBURG, TENN.
            </p>
            <span className="age-pill">21+ ONLY</span>
          </div>
        </div>

        <div className="footer-legal-bar">
          <p>© 2026 Jack Daniel's. All rights reserved. JACK DANIEL'S and OLD NO. 7 are registered trademarks.</p>
          <div className="legal-anchors">
            <a href="#hero">Privacy Policy</a>
            <span>•</span>
            <a href="#hero">Terms of Service</a>
            <span>•</span>
            <a href="#hero">Responsibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
