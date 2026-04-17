import { useEffect, useRef } from "react";

const services = [
  {
    title: "Design-Build Delivery",
    summary: "One integrated stream from planning and approvals to procurement, execution, and final commissioning.",
  },
  {
    title: "Commercial Construction",
    summary: "Corporate campuses, office towers, retail environments, and premium hospitality built for long-term performance.",
  },
  {
    title: "Infrastructure & Civil",
    summary: "Roads, utility corridors, enabling works, and structural packages managed with tight sequencing and field precision.",
  },
  {
    title: "Renovation & Fit-Out",
    summary: "Adaptive reuse, interior transformation, and phased upgrades that keep operations moving while spaces evolve.",
  },
];

const projects = [
  {
    label: "Metro Business District",
    headline: "47-story workplace tower with integrated transit podium",
    summary: "Fast-track sequencing, intelligent façade coordination, and premium lobby delivery.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Industrial Logistics Hub",
    headline: "High-capacity distribution campus with continuous operations planning",
    summary: "Structural steel execution, loading optimization, and infrastructure tie-ins with zero disruption.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Private Coastal Residence",
    headline: "Concrete, glass, and landscape composition built with gallery-level detailing",
    summary: "Luxury craftsmanship, site-sensitive engineering, and finish control from shell to interiors.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
];

const galleryPosts = [
  {
    label: "On-site coordination",
    headline: "Site operations synced with model-based execution",
    summary: "Real images from active jobsites reinforce the clarity of our planning and delivery process.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Operational clarity",
    headline: "Logistics and staging designed around completion milestones",
    summary: "Every material, crane movement, and milestone is visible in the same unified delivery system.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Signature design",
    headline: "Premium finishes delivered with the highest execution standards",
    summary: "Complex detail and premium deliveries move through site validation and handover without rework.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function App() {
  const heroRef = useRef(null);
  const heroCopyRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroEl = heroRef.current;
    const heroCopyEl = heroCopyRef.current;
    const tiltNodes = document.querySelectorAll("[data-tilt]");
    const depthScopes = document.querySelectorAll("[data-depth-scope]");

    const setTransformCache = (node) => {
      const baseTransform = getComputedStyle(node).transform;
      node.dataset.transformBase = baseTransform === "none" ? "" : baseTransform;
    };

    tiltNodes.forEach((node) => {
      setTransformCache(node);
      if (prefersReducedMotion) return;
      const handleMove = (event) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 18;
        const rotateX = (0.5 - py) * 18;
        node.style.transform = `${node.dataset.transformBase} rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      };
      const reset = () => {
        node.style.transform = node.dataset.transformBase;
      };
      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerleave", reset);
      node.addEventListener("pointerup", reset);
    });

    depthScopes.forEach((scope) => {
      const depthNodes = scope.querySelectorAll("[data-depth]");
      depthNodes.forEach(setTransformCache);
      if (prefersReducedMotion) return;
      const updateDepth = (event) => {
        const rect = scope.getBoundingClientRect();
        const px = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
        const py = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;

        depthNodes.forEach((node) => {
          const depth = Number(node.dataset.depth || 0);
          const moveX = px * depth;
          const moveY = py * depth;
          node.style.transform = `${node.dataset.transformBase} translate3d(${moveX}px, ${moveY}px, 0)`;
        });
      };
      const resetDepth = () => {
        depthNodes.forEach((node) => {
          node.style.transform = node.dataset.transformBase;
        });
      };
      scope.addEventListener("pointermove", updateDepth);
      scope.addEventListener("pointerleave", resetDepth);
    });

    if (!prefersReducedMotion && heroEl && heroCopyEl) {
      let ticking = false;
      const updateScroll = () => {
        const offset = window.scrollY;
        const progress = clamp(offset / (window.innerHeight * 1.1), 0, 1);
        const move = progress * 54;
        const scale = 1 + progress * 0.03;
        const rotation = progress * 7;

        heroEl.style.transform = `translateY(${move}px) scale(${scale}) rotateX(${rotation}deg)`;
        heroCopyEl.style.transform = `translateY(${move * 0.33}px)`;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", updateScroll);
      updateScroll();
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", updateScroll);
      };
    }
  }, []);

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SAS Construction home">
          <span className="brand-mark">SAS</span>
          <span className="brand-copy">
            <strong>SAS Construction</strong>
            <small>Built for scale. Managed with precision.</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button button-ghost" href="#contact">Book Consultation</a>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="hero-copy reveal" ref={heroCopyRef}>
            <p className="eyebrow">Modern Construction Leadership</p>
            <h1>3D project thinking for real-world builds that move fast and stay exact.</h1>
            <p className="hero-text">
              SAS Construction brings architecture, engineering coordination, and on-site execution into one fluid delivery system for commercial, industrial, and signature residential projects.
            </p>
            <div className="hero-actions">
              <a className="button" href="#projects">Explore Projects</a>
              <a className="button button-ghost" href="#services">View Capabilities</a>
            </div>
            <dl className="hero-metrics">
              <div>
                <dt>120+</dt>
                <dd>projects completed</dd>
              </div>
              <div>
                <dt>18 yrs</dt>
                <dd>execution experience</dd>
              </div>
              <div>
                <dt>99.2%</dt>
                <dd>delivery compliance</dd>
              </div>
            </dl>
          </div>

          <div className="hero-visual reveal" data-depth-scope ref={heroRef}>
            <div className="visual-orbit orbit-one"></div>
            <div className="visual-orbit orbit-two"></div>
            <div className="visual-grid"></div>

            <div className="command-chip chip-left" data-depth="28">
              <span>Live Site</span>
              <strong>Structural phase active</strong>
            </div>
            <div className="command-chip chip-right" data-depth="22">
              <span>Control Layer</span>
              <strong>Budget, safety, scheduling synced</strong>
            </div>

            <div className="site-model tilt-surface" data-tilt>
              <div className="site-model__glow"></div>
              <div className="site-model__frame frame-front"></div>
              <div className="site-model__frame frame-side"></div>
              <div className="site-model__base"></div>

              <div className="tower tower-a">
                <span className="tower-face tower-front"></span>
                <span className="tower-face tower-side"></span>
                <span className="tower-face tower-top"></span>
              </div>
              <div className="tower tower-b">
                <span className="tower-face tower-front"></span>
                <span className="tower-face tower-side"></span>
                <span className="tower-face tower-top"></span>
              </div>
              <div className="tower tower-c">
                <span className="tower-face tower-front"></span>
                <span className="tower-face tower-side"></span>
                <span className="tower-face tower-top"></span>
              </div>

              <div className="beam beam-a"></div>
              <div className="beam beam-b"></div>
              <div className="beam beam-c"></div>

              <div className="scan-card plan-card">
                <span>Digital Model</span>
                <strong>Clash detection before ground execution</strong>
              </div>
              <div className="scan-card logistics-card">
                <span>Logistics</span>
                <strong>Material routing optimized in real time</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="trusted reveal">
          <p>Trusted by developers, industrial operators, and premium property teams.</p>
          <div className="trusted-strip">
            <span>Commercial Towers</span>
            <span>Industrial Plants</span>
            <span>Urban Infrastructure</span>
            <span>Luxury Residences</span>
            <span>Mixed-Use Campuses</span>
          </div>
        </section>

        <section className="gallery-section reveal">
          <div className="section-heading">
            <p className="eyebrow">Real Project Gallery</p>
            <h2>Built environments captured from real sites, models, and execution phases.</h2>
          </div>
          <div className="gallery-grid">
            {galleryPosts.map((item) => (
              <article key={item.label} className="gallery-card reveal">
                <img src={item.image} alt={item.headline} />
                <div className="gallery-copy">
                  <span>{item.label}</span>
                  <h3>{item.headline}</h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="insight-band reveal">
          <article>
            <p className="eyebrow">Why Teams Choose SAS</p>
            <h2>We make complex construction feel visible, measurable, and calm.</h2>
          </article>
          <article>
            <p>
              Our teams operate with live reporting, design-aware execution, milestone discipline, and site coordination that keeps every stakeholder aligned from concept to handover.
            </p>
          </article>
        </section>

        <section id="services" className="content-section">
          <div className="section-heading reveal">
            <p className="eyebrow">Capabilities</p>
            <h2>Construction systems designed for speed, strength, and total oversight.</h2>
          </div>
          <div className="service-grid">
            {services.map((item, index) => (
              <article key={item.title} className="service-card reveal tilt-surface" data-tilt>
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="content-section projects-section">
          <div className="section-heading reveal">
            <p className="eyebrow">Signature Work</p>
            <h2>Built environments that balance ambition with exact control.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.label} className="project-card reveal tilt-surface" data-tilt>
                <div className="project-visual">
                  <img src={project.image} alt={project.headline} />
                </div>
                <div className="project-copy">
                  <span>{project.label}</span>
                  <h3>{project.headline}</h3>
                  <p>{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="content-section process-section">
          <div className="section-heading reveal">
            <p className="eyebrow">Execution Flow</p>
            <h2>A clear delivery rhythm from first briefing to final handover.</h2>
          </div>
          <div className="flow-line" aria-hidden="true"></div>
          <div className="process-grid">
            <article className="process-step reveal">
              <span>01</span>
              <h3>Discovery & Planning</h3>
              <p>We define scope, feasibility, budget logic, and milestone paths before construction momentum begins.</p>
            </article>
            <article className="process-step reveal">
              <span>02</span>
              <h3>3D Coordination</h3>
              <p>Design data, structure, services, and site constraints are aligned into a workable execution model.</p>
            </article>
            <article className="process-step reveal">
              <span>03</span>
              <h3>Field Delivery</h3>
              <p>Supervision, safety, procurement, and quality checkpoints stay active through every stage on site.</p>
            </article>
            <article className="process-step reveal">
              <span>04</span>
              <h3>Commissioning & Handover</h3>
              <p>Closeout, testing, final detailing, and documentation are wrapped into a confident client-ready finish.</p>
            </article>
          </div>
        </section>

        <section className="stats-panel reveal">
          <article>
            <strong>2.8M sq ft</strong>
            <p>built across commercial, industrial, and residential programs</p>
          </article>
          <article>
            <strong>360deg</strong>
            <p>project visibility with schedule, quality, financial, and field reporting</p>
          </article>
          <article>
            <strong>24/7</strong>
            <p>stakeholder communication loops for mission-critical delivery windows</p>
          </article>
        </section>

        <section id="contact" className="contact-section reveal">
          <div className="contact-copy">
            <p className="eyebrow">Start Your Build</p>
            <h2>Let's shape a construction experience that looks sharp and performs even better.</h2>
            <p>
              Whether you are planning a landmark commercial development or a high-detail private build, SAS Construction can create a delivery plan built around quality, transparency, and momentum.
            </p>
          </div>
          <form className="contact-card">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="name@company.com" />
            </label>
            <label>
              Project Type
              <input type="text" placeholder="Commercial, civil, residential..." />
            </label>
            <label>
              Project Brief
              <textarea rows="4" placeholder="Tell us about the project scope and timeline."></textarea>
            </label>
            <button className="button" type="button">Request Strategy Call</button>
          </form>
        </section>
      </main>
    </div>
  );
}
