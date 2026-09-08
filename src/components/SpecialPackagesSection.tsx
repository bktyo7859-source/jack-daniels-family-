import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const SpecialPackagesSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expression: 'connoisseur',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="special-packages" className="section-packages" aria-label="Special Packages">
      <div className="section-header">
        <div className="section-eyebrow">COMMEMORATIVE & BESPOKE</div>
        <h2 className="section-title">SPECIAL PACKAGES</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          For moments worth keeping.
        </p>
      </div>

      <div className="packages-layout">
        {/* Visual Column */}
        <div className="packages-visual">
          <div className="packages-img-container">
            <img
              src="/assets/packages/special-packages.jpg"
              alt="Jack Daniel's Special Presentation Packages and Gift Chests"
              className="packages-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* Details & Concierge Form Column */}
        <div className="packages-content">
          <span className="package-badge">LIMITED DISTILLERY ALLOCATION</span>
          <h3 className="package-title">Master Connoisseur Gift Chest</h3>
          <p className="package-summary">
            Housed in a bespoke presentation case crafted from genuine charred barrel staves. Includes two weighted crystal rocks glasses, personalized bottle engraving, and a certificate of distillery provenance.
          </p>

          <div className="package-highlights">
            <div className="highlight-item">
              <Check size={18} color="#c5a059" />
              <span>Personalized Laser Engraved Inscription</span>
            </div>
            <div className="highlight-item">
              <Check size={18} color="#c5a059" />
              <span>Authentic Charred White Oak Case & Provenance Seal</span>
            </div>
            <div className="highlight-item">
              <Check size={18} color="#c5a059" />
              <span>Matched Twin Hand-Cut Crystal Rocks Tumblers</span>
            </div>
          </div>

          {/* Concierge Form */}
          <div className="concierge-card">
            <h4 className="concierge-heading">CONCIERGE ALLOCATION REQUEST</h4>

            {submitted ? (
              <div className="form-success-box">
                ✓ Thank you. Your concierge allocation request has been registered. Our private allocation specialist will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="concierge-form">
                <div className="form-grid">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="luxury-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="luxury-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="luxury-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <select
                    className="luxury-field"
                    value={formData.expression}
                    onChange={(e) => setFormData({ ...formData, expression: e.target.value })}
                  >
                    <option value="connoisseur">Master Connoisseur Gift Chest</option>
                    <option value="single-barrel">Personalized Single Barrel Edition</option>
                    <option value="heritage-vault">Distillery 1866 Heritage Vault</option>
                  </select>
                </div>

                <textarea
                  placeholder="Special Request or Personal Engraving Note (Optional)"
                  rows={2}
                  className="luxury-field"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>

                <button type="submit" className="btn btn-primary btn-block">
                  <span>Request Allocation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
