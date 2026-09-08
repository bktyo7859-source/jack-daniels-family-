import React from 'react';

interface ProductItem {
  number: string;
  name: string;
  tagline: string;
  abv: string;
  description: string;
  tasting: string;
}

const products: ProductItem[] = [
  {
    number: '01',
    name: 'OLD NO. 7',
    tagline: 'The Iconic Original',
    abv: '40% ABV • 80 PROOF',
    description: 'Mellowed drop by drop through 10 feet of sugar maple charcoal, then matured in handcrafted barrels.',
    tasting: 'Sweet Oak • Vanilla • Caramel • Crisp Clean Finish',
  },
  {
    number: '02',
    name: 'GENTLEMAN JACK',
    tagline: 'Double Charcoal Filtered',
    abv: '40% ABV • 80 PROOF',
    description: 'Undergoes a second charcoal mellowing after barrel maturation for exceptional smoothness and velvet finish.',
    tasting: 'Silky Vanilla • Warm Honey • Delicate Apple • Toasted Oak',
  },
  {
    number: '03',
    name: 'SINGLE BARREL SELECT',
    tagline: 'Master Distiller Barrel',
    abv: '47% ABV • 94 PROOF',
    description: 'Drawn from individual barrels resting on the highest floors of our barrelhouses, reaching peak intensity.',
    tasting: 'Heavy Charred Oak • Rich Spice • Deep Amber • Dark Caramel',
  },
  {
    number: '04',
    name: 'TENNESSEE HONEY',
    tagline: 'Whiskey & Pure Honey',
    abv: '35% ABV • 70 PROOF',
    description: 'A blend of Old No. 7 Tennessee Whiskey and proprietary honey liqueur for a smooth, complex finish.',
    tasting: 'Real Clover Honey • Roasted Praline • Toasted Nut • Subtle Oak',
  },
];

export const CollectionSection: React.FC = () => {
  return (
    <section id="collection" className="section-collection" aria-label="The Jack Daniel's Collection">
      <div className="section-header">
        <div className="section-eyebrow">DISTILLERY PORTFOLIO</div>
        <h2 className="section-title">THE COLLECTION</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Four expressions. One Tennessee tradition.
        </p>
      </div>

      {/* Main Hero Showcase */}
      <div className="collection-hero">
        <div className="collection-img-wrap">
          <img
            src="/assets/collection/collection.jpg"
            alt="The Complete Collection of Jack Daniel's Tennessee Whiskeys"
            className="collection-img"
            loading="lazy"
          />
          <div className="collection-overlay"></div>
        </div>

        <div className="collection-hero-meta">
          <div className="collection-tag">HANDCRAFTED IN LYNCHBURG</div>
          <h3 className="collection-headline">DISTINCT CHARACTERS. ONE HERITAGE.</h3>
          <p className="collection-desc">
            Whether enjoyed neat, on carved ice, or in a classic cocktail, each bottle carries the uncompromising standard established in 1866.
          </p>
        </div>
      </div>

      {/* 4 Interactive Product Cards */}
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.number} className="product-card">
            <div className="product-meta-header">
              <span className="product-abv">{p.abv}</span>
              <span className="product-num">{p.number}</span>
            </div>
            <h3 className="product-name">{p.name}</h3>
            <p className="product-tagline">{p.tagline}</p>
            <p className="product-description">{p.description}</p>
            <div className="product-taste-notes">{p.tasting}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
