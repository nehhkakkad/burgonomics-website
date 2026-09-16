const fs = require('fs');
const t = fs.readFileSync('style.css', 'utf8');
const i = t.indexOf('/* ABOUT US PAGE */');
const j = t.indexOf('/* IMMERSIVE SCROLL EXPERIENCE', i);

const newCSS = `/* ABOUT PAGE */
.about-hero {
  padding: 10rem 4rem 6rem;
  text-align: center;
}

.about-hero h1 {
  font-size: clamp(3rem, 6vw, 4.5rem);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
  color: var(--light-olive);
}

.about-hero p {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
  color: var(--grey);
}

/* ABOUT STORY */
.about-story {
  padding: 6rem 0;
  background: var(--main-background);
}
.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.story-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--main-white);
}
.story-lead {
  font-size: 1.3rem;
  color: var(--bright-olive);
  margin-bottom: 1.5rem;
  font-weight: 500;
}
.story-text p {
  font-size: 1.05rem;
  color: var(--soft-white);
  line-height: 1.7;
  margin-bottom: 1.25rem;
}
.story-visual {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--panel-black);
}
.story-visual-inner {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(102, 122, 53, 0.15) 0%, transparent 70%);
  background-image: url('./logo.jpg');
  background-position: center;
  background-size: 280px;
  background-repeat: no-repeat;
  opacity: 0.06;
  filter: grayscale(1);
}

/* STANDARDS */
.about-standards {
  padding: 8rem 0;
  background: var(--secondary-black);
  border-top: 1px solid var(--border-hairline);
  border-bottom: 1px solid var(--border-hairline);
}
.about-standards .section-title {
  text-align: center;
  margin-bottom: 4rem;
}
.standards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.standard-card {
  background: rgba(25, 28, 22, 0.6);
  border: 1px solid var(--border-hairline);
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.standard-card:hover {
  border-color: var(--brand-olive);
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.standard-num {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--brand-olive);
  margin-bottom: 1rem;
}
.standard-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: var(--main-white);
}
.standard-card p {
  font-size: 0.95rem;
  color: var(--soft-white);
  line-height: 1.6;
}

/* VALUES / MANIFESTO */
.about-values {
  padding: 8rem 0;
  background: var(--main-background);
}
.about-values .section-title {
  text-align: center;
  margin-bottom: 1rem;
}
.values-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.values-content > p {
  font-size: 1.1rem;
  color: var(--grey);
  margin-bottom: 3rem;
}
.values-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
}
.value-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: rgba(25, 28, 22, 0.5);
  border: 1px solid var(--border-hairline);
  border-radius: 8px;
  font-size: 1.05rem;
  color: var(--soft-white);
}
.value-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--brand-olive);
  flex-shrink: 0;
}
.values-cta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Responsive About */
@media (max-width: 1024px) {
  .story-grid { grid-template-columns: 1fr; gap: 3rem; }
  .story-visual { height: 300px; }
  .standards-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .about-hero { padding: 8rem 2rem 4rem; }
  .about-hero h1 { font-size: 2.5rem; }
  .standards-grid { grid-template-columns: 1fr; }
  .story-grid { gap: 2rem; }
  .story-visual { height: 250px; }
}

`;

fs.writeFileSync('style.css', t.slice(0, i) + newCSS + t.slice(j));
console.log('Done');