import { useState, useEffect, useRef } from "react";
import profilePic from "./assets/profilepic.jpg"; // 👈 rename this to your actual photo filename

const glowStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cyan: #00f5ff;
    --purple: #bf00ff;
    --pink: #ff0080;
    --bg: #050510;
    --bg2: #0a0a1a;
    --glass: rgba(255,255,255,0.04);
    --border: rgba(0,245,255,0.15);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: #e0e0ff;
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none; z-index: 0;
  }
  .grid-bg::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%);
  }

  .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; animation: floatOrb 8s ease-in-out infinite; }
  .orb1 { width: 400px; height: 400px; background: rgba(0,245,255,0.06); top: -100px; right: -100px; }
  .orb2 { width: 300px; height: 300px; background: rgba(191,0,255,0.08); bottom: 20%; left: -100px; animation-delay: -3s; }
  .orb3 { width: 200px; height: 200px; background: rgba(255,0,128,0.06); top: 50%; right: 20%; animation-delay: -5s; }

  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  .scanline {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    pointer-events: none; z-index: 1;
  }

  .navbar {
    position: sticky; top: 0; z-index: 100;
    padding: 16px 40px;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(5,5,16,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 20px;
    color: var(--cyan); text-shadow: 0 0 20px rgba(0,245,255,0.5);
    letter-spacing: 2px; display: flex; align-items: center; gap: 10px;
  }

  .logo-dot {
    width: 8px; height: 8px; background: var(--cyan); border-radius: 50%;
    box-shadow: 0 0 10px var(--cyan); animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 10px var(--cyan); }
    50% { box-shadow: 0 0 25px var(--cyan), 0 0 50px rgba(0,245,255,0.3); }
  }

  .nav-links { display: flex; gap: 32px; }
  .nav-link {
    font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(224,224,255,0.6); text-decoration: none;
    transition: all 0.3s; position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan); transition: width 0.3s;
  }
  .nav-link:hover { color: var(--cyan); }
  .nav-link:hover::after { width: 100%; }

  .section { max-width: 900px; margin: 0 auto; padding: 80px 24px; position: relative; z-index: 2; }

  .section-title {
    font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase; color: var(--cyan);
    text-shadow: 0 0 15px rgba(0,245,255,0.4);
    display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

  .glass-card {
    background: var(--glass); border: 1px solid var(--border);
    border-radius: 16px; backdrop-filter: blur(10px);
    transition: all 0.4s; position: relative; overflow: hidden;
  }
  .glass-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,245,255,0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  .glass-card:hover {
    border-color: rgba(0,245,255,0.4);
    box-shadow: 0 0 30px rgba(0,245,255,0.08), inset 0 0 30px rgba(0,245,255,0.02);
    transform: translateY(-3px);
  }

  .hero {
    min-height: 90vh; display: flex; align-items: center;
    max-width: 900px; margin: 0 auto; padding: 0 24px;
    position: relative; z-index: 2; gap: 48px;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    color: var(--cyan); border: 1px solid rgba(0,245,255,0.3);
    padding: 6px 16px; border-radius: 100px;
    background: rgba(0,245,255,0.05); margin-bottom: 24px;
  }

  .hero-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(32px, 5vw, 56px); font-weight: 900;
    line-height: 1.1; color: #fff; margin-bottom: 8px;
  }
  .hero-title-accent {
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; display: block;
    filter: drop-shadow(0 0 20px rgba(0,245,255,0.3));
  }

  .hero-sub {
    font-size: 17px; line-height: 1.8; color: rgba(224,224,255,0.6);
    max-width: 520px; margin-bottom: 40px;
  }

  .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }

  .btn-primary {
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--cyan), #0080ff);
    color: #000; font-family: 'Orbitron', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    border: none; border-radius: 8px; cursor: pointer; text-decoration: none;
    transition: all 0.3s; box-shadow: 0 0 25px rgba(0,245,255,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(0,245,255,0.5); }

  .btn-secondary {
    padding: 14px 32px; background: transparent; color: var(--cyan);
    font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    border: 1px solid rgba(0,245,255,0.4); border-radius: 8px;
    cursor: pointer; text-decoration: none; transition: all 0.3s;
  }
  .btn-secondary:hover { background: rgba(0,245,255,0.08); border-color: var(--cyan); box-shadow: 0 0 20px rgba(0,245,255,0.15); transform: translateY(-2px); }

  /* Photo */
  .hero-photo-wrapper {
    flex-shrink: 0; position: relative; width: 220px; height: 220px;
  }
  .hero-photo-ring {
    position: absolute; inset: -10px; border-radius: 50%;
    border: 1px solid rgba(0,245,255,0.3);
    animation: spin 10s linear infinite;
  }
  .hero-photo-ring2 {
    position: absolute; inset: -20px; border-radius: 50%;
    border: 1px dashed rgba(191,0,255,0.2);
    animation: spin 16s linear infinite reverse;
  }
  .hero-photo {
    width: 220px; height: 220px; border-radius: 50%;
    object-fit: cover; object-position: top;
    border: 3px solid rgba(0,245,255,0.4);
    box-shadow: 0 0 40px rgba(0,245,255,0.2);
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px; }
  .project-card { padding: 28px; }
  .project-tag {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--cyan);
    background: rgba(0,245,255,0.08); border: 1px solid rgba(0,245,255,0.2);
    padding: 3px 10px; border-radius: 4px; margin-bottom: 14px;
  }
  .project-title { font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .project-desc { font-size: 14px; line-height: 1.7; color: rgba(224,224,255,0.55); margin-bottom: 24px; }
  .project-links { display: flex; gap: 16px; }
  .project-link {
    font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--cyan); text-decoration: none; transition: all 0.3s;
  }
  .project-link:hover { text-shadow: 0 0 10px var(--cyan); }

  .exp-card { padding: 24px 28px; display: flex; gap: 20px; align-items: flex-start; margin-bottom: 16px; }
  .exp-icon {
    width: 44px; height: 44px; background: rgba(0,245,255,0.08);
    border: 1px solid rgba(0,245,255,0.2); border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .exp-role { font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .exp-company { font-size: 12px; font-weight: 600; letter-spacing: 1px; color: var(--cyan); margin-bottom: 8px; }
  .exp-desc { font-size: 13px; color: rgba(224,224,255,0.5); line-height: 1.6; }

  .skills-grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .skill-pill {
    padding: 8px 18px; background: var(--glass); border: 1px solid var(--border);
    border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 1px;
    color: rgba(224,224,255,0.7); transition: all 0.3s; cursor: default;
  }
  .skill-pill:hover {
    border-color: var(--cyan); color: var(--cyan);
    background: rgba(0,245,255,0.06); box-shadow: 0 0 15px rgba(0,245,255,0.1);
    transform: translateY(-2px);
  }

  .contact-card { padding: 48px; text-align: center; max-width: 600px; margin: 0 auto; }
  .contact-title { font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 16px; }
  .contact-sub { font-size: 15px; color: rgba(224,224,255,0.5); line-height: 1.7; margin-bottom: 36px; }
  .contact-links { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .contact-link {
    padding: 12px 28px; border: 1px solid var(--border); border-radius: 8px;
    color: rgba(224,224,255,0.7); text-decoration: none;
    font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    transition: all 0.3s; background: var(--glass);
  }
  .contact-link:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 20px rgba(0,245,255,0.15); transform: translateY(-2px); }

  .footer {
    border-top: 1px solid var(--border); padding: 28px; text-align: center;
    font-size: 11px; letter-spacing: 2px; color: rgba(224,224,255,0.2);
    font-family: 'Orbitron', sans-serif; position: relative; z-index: 2;
  }

  .about-card { padding: 36px; }
  .about-text { font-size: 16px; line-height: 1.9; color: rgba(224,224,255,0.65); }
  .about-text strong { color: var(--cyan); font-weight: 600; }
`;

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease` }}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <>
      <style>{glowStyle}</style>
      <div className="grid-bg" />
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      <div className="scanline" />

      <nav className="navbar">
        <div className="logo"><div className="logo-dot" />LAIBA</div>
        <div className="nav-links">
          {["About","Projects","Experience","Skills","Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: 'rgba(0,245,255,0.4)', letterSpacing: 2 }}>
          {time.toLocaleTimeString()}
        </div>
      </nav>

      <header className="hero">
        <div style={{ flex: 1 }}>
          <div className="hero-badge">
            <span style={{ width: 6, height: 6, background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 8px var(--cyan)' }} />
            IT Student & Developer
          </div>
          <h1 className="hero-title">
            Hi, I'm Laiba
            <span className="hero-title-accent">a Web Developer</span>
          </h1>
          <p className="hero-sub">
            I specialize in building clean, modern, and high-performance web applications using React, JavaScript, and Tailwind CSS.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">Hire Me</a>
            <a href="#projects" className="btn-secondary">View Projects</a>
          </div>
        </div>

        {/* 👇 Your photo goes here */}
        <div className="hero-photo-wrapper">
          <div className="hero-photo-ring" />
          <div className="hero-photo-ring2" />
          <img src={profilePic} alt="Laiba" className="hero-photo" />
        </div>
      </header>

      <section id="about" className="section">
        <FadeIn>
          <div className="section-title">// About Me</div>
          <div className="glass-card about-card">
            <p className="about-text">
              I am a <strong>6th-semester Information Technology</strong> student with hands-on experience in full-stack development and modern UI/UX design.
              I have completed multiple internships and certifications, including training from <strong>PITP Sindh</strong>, and I am passionate about creating accessible and user-friendly digital experiences.
              My technical focus is on <strong>React</strong>, <strong>Tailwind CSS</strong>, and backend integration.
            </p>
          </div>
        </FadeIn>
      </section>

      <section id="projects" className="section">
        <FadeIn><div className="section-title">// Projects</div></FadeIn>
        <div className="project-grid">
          {[
            { tag: "React · Node.js · Tailwind", title: "Full-Stack Gym App", desc: "A comprehensive gym management and tracking application with user dashboards, exercise tracking, and responsive design.", code: "YOUR_GITHUB_LINK_HERE", demo: "YOUR_LIVE_LINK_HERE" },
            { tag: "React · Tailwind CSS", title: "Developer Portfolio", desc: "A minimalist portfolio designed for maximum readability and professional appearance for remote job applications.", code: "YOUR_GITHUB_LINK_HERE", demo: "YOUR_LIVE_LINK_HERE" },
          ].map((p, i) => (
            <FadeIn key={p.title} delay={i * 100}>
              <div className="glass-card project-card">
                <div className="project-tag">{p.tag}</div>
                <div className="project-title">{p.title}</div>
                <div className="project-desc">{p.desc}</div>
                <div className="project-links">
                  <a href={p.code} className="project-link">⌥ Code →</a>
                  <a href={p.demo} className="project-link">⎋ Live →</a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="experience" className="section">
        <FadeIn><div className="section-title">// Experience & Certifications</div></FadeIn>
        {[
          { icon: "💼", role: "Web Development Intern", company: "Icreativz · 6 Months", desc: "Assisted in the development and maintenance of company web assets, ensuring modern layouts and mobile responsiveness." },
          { icon: "⚡", role: "Web Development Intern", company: "Hexsoftware · 6 Weeks", desc: "Focused on component-driven React development and optimizing user interface speeds." },
          { icon: "🎓", role: "Certification in Web Development", company: "PITP Sindh · 2 Months", desc: "Intensive training on modern JavaScript, HTML5/CSS3, and web ecosystems." },
        ].map((e, i) => (
          <FadeIn key={e.company} delay={i * 100}>
            <div className="glass-card exp-card">
              <div className="exp-icon">{e.icon}</div>
              <div>
                <div className="exp-role">{e.role}</div>
                <div className="exp-company">{e.company}</div>
                <div className="exp-desc">{e.desc}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      <section id="skills" className="section">
        <FadeIn>
          <div className="section-title">// Skills</div>
          <div className="skills-grid">
            {["JavaScript (ES6+)", "React.js", "Tailwind CSS", "HTML5 & CSS3", "Git & GitHub", "Node.js", "UI/UX Design", "REST APIs"].map((s) => (
              <span key={s} className="skill-pill">{s}</span>
            ))}
          </div>
        </FadeIn>
      </section>

      <section id="contact" className="section">
        <FadeIn>
          <div className="section-title">// Get In Touch</div>
          <div className="glass-card contact-card">
            <div className="contact-title">Let's Build Together</div>
            <div className="contact-sub">Currently open to freelance projects and remote frontend/full-stack opportunities. Let's create something extraordinary.</div>
            <div className="contact-links">
              {[
                ["⌥ GitHub", "YOUR_GITHUB_LINK_HERE"],
                ["⎋ LinkedIn", "YOUR_LINKEDIN_LINK_HERE"],
                ["◈ Fiverr", "YOUR_FIVERR_LINK_HERE"]
              ].map(([label, href]) => (
                <a key={label} href={href} className="contact-link">{label}</a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} · LAIBA · BUILT WITH REACT & TAILWIND CSS
      </footer>
    </>
  );
}