import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "Services", "About", "Gallery", "Contact"];

const SERVICES = [
  { icon: "✦", title: "General Dentistry", desc: "Comprehensive check-ups, fillings, extractions, and preventive care to keep your smile healthy for life." },
  { icon: "◈", title: "Teeth Whitening", desc: "Professional-grade whitening treatments for a brighter, more confident smile — visible results in just one visit." },
  { icon: "⬡", title: "Dental Implants", desc: "Permanent, natural-looking implants that restore full function and aesthetics of missing teeth." },
  { icon: "◇", title: "Orthodontics & Aligners", desc: "Braces and clear aligners for children and adults. Straighten your teeth comfortably and discreetly." },
  { icon: "✧", title: "Cosmetic Dentistry", desc: "Veneers, bonding, smile makeovers, and laminates tailored precisely to your facial aesthetics." },
  { icon: "◉", title: "Root Canal Therapy", desc: "Painless, modern root canal treatment that saves your natural tooth with lasting, reliable results." },
  { icon: "❋", title: "Smile Design", desc: "A complete personalised smile transformation — combining art and science to create your perfect smile." },
  { icon: "◐", title: "Gum Care & Periodontics", desc: "Scaling, root planning, laser gum surgery and advanced periodontal treatments for healthy gums." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", area: "Mohali", text: "The team at Shivaay Dentals transformed my smile completely. The veneers look so natural — I get compliments every single day!", stars: 5 },
  { name: "Rajiv Mehta", area: "Chandigarh", text: "Had severe dental anxiety but the doctor made me feel completely at ease. Painless root canal — something I never thought possible.", stars: 5 },
  { name: "Ananya Bose", area: "Sector 70", text: "Brought my whole family here. The kids actually look forward to their appointments. Says everything about the warmth of this clinic.", stars: 5 },
  { name: "Harpreet Singh", area: "Mohali", text: "Best dental implant experience. The result is seamless — no one can tell the difference. Highly recommend for implant work.", stars: 5 },
];

// Free-to-use images from Unsplash (no attribution required for display)
const GALLERY_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",
    label: "Modern Clinic",
    desc: "State-of-the-art facility"
  },
  {
    url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80",
    label: "Teeth Whitening",
    desc: "Professional whitening treatment"
  },
  {
    url: "https://images.unsplash.com/photo-1588776814546-1ffedbe47f88?w=600&q=80",
    label: "Dental Examination",
    desc: "Comprehensive check-ups"
  },
  {
    url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    label: "Perfect Smile",
    desc: "Smile makeover results"
  },
  {
    url: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
    label: "Dental Tools",
    desc: "Precision instruments"
  },
  {
    url: "https://images.unsplash.com/photo-1645842021684-b40e35009b73?w=600&q=80",
    label: "Orthodontics",
    desc: "Clear aligner treatments"
  },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function ImgWithFallback({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <div style={{ ...style, background: "linear-gradient(135deg, #c8e6d9, #e8f4ef)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 36, opacity: 0.5 }}>🦷</span></div>;
  }
  return <img src={src} alt={alt} style={{ ...style, objectFit: "cover" }} onError={() => setErrored(true)} />;
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 👇 REPLACE THIS URL with your Formspree endpoint e.g. https://formspree.io/f/xxxxxxxx
  const FORMSPREE_URL = "https://formspree.io/f/xgonyezv";
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", color: "#1a1a1a", overflowX: "hidden" }}>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" }}>
          <div style={{ position: "relative", maxWidth: 900, width: "100%" }}>
            <img src={GALLERY_PHOTOS[lightbox].url.replace("w=600", "w=1200")} alt={GALLERY_PHOTOS[lightbox].label} style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }} />
            <div style={{ position: "absolute", bottom: -48, left: 0, color: "rgba(255,255,255,0.7)", fontSize: 14, letterSpacing: "0.1em" }}>{GALLERY_PHOTOS[lightbox].label} — {GALLERY_PHOTOS[lightbox].desc}</div>
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: -44, right: 0, background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
            {lightbox > 0 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }} style={{ position: "absolute", left: -56, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 22, width: 44, height: 44, cursor: "pointer" }}>‹</button>}
            {lightbox < GALLERY_PHOTOS.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }} style={{ position: "absolute", right: -56, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 22, width: 44, height: 44, cursor: "pointer" }}>›</button>}
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(250,249,247,0.97)" : "transparent", borderBottom: scrolled ? "1px solid #e8e0d4" : "none", backdropFilter: scrolled ? "blur(12px)" : "none", transition: "all 0.4s ease", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", lineHeight: 1.1, padding: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.08em", color: "#2c5f4a" }}>SHIVAAY</span>
            <span style={{ fontSize: 10, letterSpacing: "0.22em", color: "#8b7355", textTransform: "uppercase" }}>Dentals & Aesthetics</span>
          </button>
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, letterSpacing: "0.14em", color: scrolled ? "#4a4a4a" : "rgba(255,255,255,0.85)", textTransform: "uppercase", fontFamily: "inherit", padding: "4px 0", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#2c5f4a"}
                onMouseLeave={e => e.currentTarget.style.color = scrolled ? "#4a4a4a" : "rgba(255,255,255,0.85)"}>
                {l}
              </button>
            ))}
            <button onClick={() => scrollTo("contact")} style={{ background: "#2c5f4a", color: "#fff", border: "none", padding: "10px 22px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1a3d2e"}
              onMouseLeave={e => e.currentTarget.style.background = "#2c5f4a"}>
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO with background image ── */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80"
            alt="Modern dental clinic"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,22,16,0.92) 0%, rgba(26,46,36,0.88) 40%, rgba(44,95,74,0.75) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "140px 2rem 100px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(168,213,194,0.35)", padding: "7px 18px", marginBottom: 36, letterSpacing: "0.18em", fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#a8d5c2", display: "inline-block" }} />
                SCO 1070, Sector 70, Mohali · Punjab
              </div>
              <h1 style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)", color: "#fff", lineHeight: 1.08, marginBottom: 26, fontWeight: 400 }}>
                Your Smile,<br />
                <em style={{ fontStyle: "italic", color: "#a8d5c2" }}>Perfected.</em>
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 44, maxWidth: 480 }}>
                At Shivaay Dentals & Aesthetics, we blend clinical precision with artistic sensibility — delivering world-class dental care with the warmth of a neighbourhood clinic.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <button onClick={() => scrollTo("contact")} style={{ background: "#fff", color: "#2c5f4a", border: "none", padding: "15px 36px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#a8d5c2"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  Book Appointment
                </button>
                <button onClick={() => scrollTo("services")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "15px 36px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"}>
                  Our Services
                </button>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", padding: "14px 22px", border: "1px solid rgba(168,213,194,0.2)" }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f5c842", fontSize: 15 }}>{s}</span>)}
                </div>
                <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>5.0 on Google</div>
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>54 Verified Reviews</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {[
                { n: "5.0★", l: "Google Rating", sub: "54 Reviews" },
                { n: "10+", l: "Years of Care", sub: "Serving Mohali" },
                { n: "8+", l: "Specialisations", sub: "All treatments" },
                { n: "24hr", l: "Emergency Care", sub: "Same-day slots" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", padding: "2rem", borderTop: "2px solid transparent", transition: "border-color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderTopColor = "#a8d5c2"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderTopColor = "transparent"}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a8d5c2", marginBottom: 4 }}>{s.n}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STRIP ── */}
      <div style={{ background: "#2c5f4a", padding: "14px 2rem", display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
        {["📍 SCO 1070, Near SBI Bank, Opp. Vivek High School, Sector 70, Mohali", "👩‍⚕️ Dr. Aradhana Sharma", "🕐 Mon – Sat: 9 AM – 8 PM", "⚡ Same-day Emergency Slots"].map((t, i) => (
          <span key={i} style={{ fontSize: 12, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}>{t}</span>
        ))}
      </div>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "100px 2rem", background: "#faf9f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ marginBottom: 64, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#8b7355", textTransform: "uppercase", marginBottom: 12 }}>What We Offer</div>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.2 }}>Comprehensive<br /><em style={{ color: "#2c5f4a", fontStyle: "italic" }}>Dental Care</em></h2>
              </div>
              <p style={{ maxWidth: 400, color: "#666", lineHeight: 1.75, fontSize: 15 }}>From routine check-ups to complete smile transformations — every treatment delivered with precision and care.</p>
            </div>
          </FadeIn>

          {/* Feature image strip */}
          <FadeIn delay={100}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginBottom: 3 }}>
              {[
                { url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80", label: "Whitening" },
                { url: "https://images.unsplash.com/photo-1588776814546-1ffedbe47f88?w=500&q=80", label: "Examination" },
                { url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80", label: "Perfect Smile" },
              ].map((img, i) => (
                <div key={i} style={{ position: "relative", height: 200, overflow: "hidden", cursor: "pointer" }} onClick={() => setLightbox(i + 1)}>
                  <ImgWithFallback src={img.url} alt={img.label} style={{ width: "100%", height: "100%" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(26,46,36,0)", transition: "background 0.3s", display: "flex", alignItems: "flex-end", padding: "1rem" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(26,46,36,0.5)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(26,46,36,0)"}>
                    <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#fff", opacity: 0 }} className="img-label">{img.label}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.45))", padding: "1.5rem 1rem 0.75rem" }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2, marginTop: 24 }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "2.5rem", background: "#fff", borderLeft: "3px solid transparent", transition: "all 0.3s", height: "100%", boxSizing: "border-box" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderLeftColor = "#2c5f4a"; el.style.background = "#f4f8f6"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderLeftColor = "transparent"; el.style.background = "#fff"; }}>
                  <div style={{ fontSize: 24, marginBottom: 14, color: "#2c5f4a" }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: "#777", lineHeight: 1.75, fontSize: 14 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT with image ── */}
      <section id="about" style={{ padding: "100px 2rem", background: "#1a2e24", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <FadeIn>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#a8d5c2", textTransform: "uppercase", marginBottom: 16 }}>About the Clinic</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.25, marginBottom: 28 }}>
                Dentistry with<br /><em style={{ color: "#a8d5c2", fontStyle: "italic" }}>Heart & Precision</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, fontSize: 15, marginBottom: 22 }}>
                Shivaay Dentals & Aesthetics is a trusted dental clinic in the heart of Sector 70, Mohali — located at SCO 1070, 1st Floor, near SBI Bank, opposite Vivek High School.
              </p>
              <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, fontSize: 15, marginBottom: 36 }}>
                With a perfect 5.0 rating on Google and 54 verified reviews, we've earned the trust of thousands of families across Mohali, Chandigarh, and Punjab. Our approach: clinical excellence delivered with genuine warmth.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[["5.0 ★", "Perfect Google Rating"], ["54+", "Verified Reviews"], ["State-of-the-art", "Equipment & Technology"], ["Pain-free", "Modern Techniques"]].map(([bold, sub], i) => (
                  <div key={i} style={{ borderLeft: "2px solid rgba(168,213,194,0.3)", paddingLeft: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#a8d5c2", marginBottom: 3 }}>{bold}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Feature image */}
              <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
                <ImgWithFallback
                  src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80"
                  alt="Dental clinic equipment"
                  style={{ width: "100%", height: "100%" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,46,36,0.6), transparent)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Our Modern Facility</div>
              </div>
              {[
                { accent: "#a8d5c2", label: "Our Location", text: "1st Floor, SCO 1070, near SBI Bank, opposite Vivek High School, Sector 70, Mohali – 160071" },
                { accent: "#c4a882", label: "Clinic Hours", text: "Monday to Saturday: 9:00 AM – 8:00 PM. Emergency slots available same-day." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", padding: "1.5rem 2rem", borderLeft: `3px solid ${item.accent}` }}>
                  <div style={{ fontSize: 11, color: item.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{item.label}</div>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 14 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PHOTO GALLERY ── */}
      <section id="gallery" style={{ padding: "100px 2rem", background: "#f5f2ee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#8b7355", textTransform: "uppercase", marginBottom: 12 }}>Our Clinic & Work</div>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400 }}>Photo <em style={{ color: "#2c5f4a", fontStyle: "italic" }}>Gallery</em></h2>
              <p style={{ color: "#999", fontSize: 13, marginTop: 8, letterSpacing: "0.05em" }}>Click any image to enlarge</p>
            </div>
          </FadeIn>

          {/* Masonry-style grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "240px 240px", gap: 4 }}>
            {GALLERY_PHOTOS.map((photo, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div
                  onClick={() => setLightbox(i)}
                  style={{ height: "100%", overflow: "hidden", cursor: "zoom-in", position: "relative", gridColumn: i === 0 ? "span 2" : undefined }}
                >
                  <ImgWithFallback src={photo.url} alt={photo.label} style={{ width: "100%", height: "100%", transition: "transform 0.5s ease" }} />
                  <div
                    style={{ position: "absolute", inset: 0, background: "rgba(26,46,36,0)", transition: "background 0.3s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.25rem" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(26,46,36,0.55)";
                      const img = (e.currentTarget as HTMLDivElement).previousElementSibling as HTMLImageElement;
                      if (img) img.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(26,46,36,0)";
                      const img = (e.currentTarget as HTMLDivElement).previousElementSibling as HTMLImageElement;
                      if (img) img.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.5))", position: "absolute", inset: 0 }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{photo.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{photo.desc}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "90px 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#8b7355", textTransform: "uppercase", marginBottom: 12 }}>Patient Stories</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400 }}>What Our <em style={{ color: "#2c5f4a", fontStyle: "italic" }}>Patients Say</em></h2>
              <p style={{ marginTop: 12, color: "#888", fontSize: 14 }}>5.0 ★ on Google · 54 Verified Reviews</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{ padding: "2.5rem", background: "#faf9f7", borderTop: "3px solid #2c5f4a", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ color: "#f5c842", fontSize: 16, marginBottom: 16, letterSpacing: 3 }}>{"★".repeat(t.stars)}</div>
                  <p style={{ color: "#555", lineHeight: 1.8, fontSize: 14, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{t.area}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 2rem", background: "#faf9f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          <FadeIn>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#8b7355", textTransform: "uppercase", marginBottom: 16 }}>Get In Touch</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: 28 }}>Book Your<br /><em style={{ color: "#2c5f4a", fontStyle: "italic" }}>Appointment</em></h2>
              <p style={{ color: "#666", lineHeight: 1.8, fontSize: 15, marginBottom: 40 }}>Fill in the form and our team will confirm your appointment. Walk-ins also welcome at our Sector 70 clinic.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {[
                  { icon: "📍", label: "Address", val: "1st Floor, SCO 1070, near SBI Bank,\nOpp. Vivek High School, Sector 70,\nMohali – 160071", href: null },
                  { icon: "👩‍⚕️", label: "Doctor", val: "Dr. Aradhana Sharma", href: null },
                  { icon: "📞", label: "Phone", val: "+91 8968065067", href: "tel:+918968065067" },
                  { icon: "💬", label: "WhatsApp", val: "+91 8968065067", href: "https://wa.me/918968065067" },
                  { icon: "🕐", label: "Hours", val: "Monday – Saturday: 9:00 AM – 8:00 PM", href: null },
                  { icon: "⭐", label: "Rating", val: "5.0 on Google · 54 Verified Reviews", href: null },
                ].map(({ icon, label, val, href }) => (
                  <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 42, height: 42, background: label === "WhatsApp" ? "#e8f8ef" : "#e8f4ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: 4 }}>{label}</div>
                      {href ? (
                        <a href={href} target={label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer"
                          style={{ fontSize: 14, color: label === "WhatsApp" ? "#25D366" : "#2c5f4a", lineHeight: 1.65, textDecoration: "none", fontWeight: 600 }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                          {val}
                        </a>
                      ) : (
                        <div style={{ fontSize: 14, color: "#333", lineHeight: 1.65, whiteSpace: "pre-line" }}>{val}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Smile image */}
              <div style={{ marginTop: 36, height: 200, overflow: "hidden" }}>
                <ImgWithFallback
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80"
                  alt="Beautiful smile"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            {submitted ? (
              <div style={{ padding: "3rem", background: "#e8f4ef", textAlign: "center", borderTop: "3px solid #2c5f4a" }}>
                <div style={{ fontSize: 40, marginBottom: 18, color: "#2c5f4a" }}>✦</div>
                <h3 style={{ fontSize: 22, fontWeight: 400, marginBottom: 14, color: "#2c5f4a" }}>Thank you, {formData.name}!</h3>
                <p style={{ color: "#555", lineHeight: 1.75, fontSize: 15 }}>We've received your request. Our team at Shivaay Dentals will confirm your appointment shortly. See you at Sector 70!</p>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  await fetch(FORMSPREE_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                      "Patient Name": formData.name,
                      "Phone Number": formData.phone,
                      "Treatment": formData.service,
                      "Message": formData.message || "—",
                      "Clinic": "Shivaay Dentals & Aesthetics, Sector 70 Mohali",
                    }),
                  });
                } catch (_) {}
                setSubmitting(false);
                setSubmitted(true);
              }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { label: "Full Name", key: "name", type: "text", ph: "Your full name" },
                  { label: "Phone Number", key: "phone", type: "tel", ph: "+91 XXXXX XXXXX" },
                ].map(({ label, key, type, ph }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: 8 }}>{label}</label>
                    <input type={type} required placeholder={ph} value={(formData as any)[key]} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "13px 16px", border: "1px solid #e0d8ce", background: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.currentTarget.style.borderColor = "#2c5f4a"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e0d8ce"} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: 8 }}>Treatment Needed</label>
                  <select required value={formData.service} onChange={e => setFormData(f => ({ ...f, service: e.target.value }))}
                    style={{ width: "100%", padding: "13px 16px", border: "1px solid #e0d8ce", background: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                    <option value="">Select a treatment...</option>
                    {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    <option value="General Check-up">General Check-up / Consultation</option>
                    <option value="Emergency">Dental Emergency</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8b7355", marginBottom: 8 }}>Message (Optional)</label>
                  <textarea rows={4} placeholder="Any concerns or preferred appointment time..." value={formData.message} onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                    style={{ width: "100%", padding: "13px 16px", border: "1px solid #e0d8ce", background: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                    onFocus={e => e.currentTarget.style.borderColor = "#2c5f4a"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e0d8ce"} />
                </div>
                <button type="submit" disabled={submitting} style={{ background: submitting ? "#7aab96" : "#2c5f4a", color: "#fff", border: "none", padding: "16px 36px", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#1a3d2e"; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#2c5f4a"; }}>
                  {submitting ? "Sending..." : "Request Appointment"}
                </button>
                <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>For urgent care, walk-in to SCO 1070, Sector 70.</p>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0c1510", padding: "48px 2rem 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.1em", color: "#a8d5c2", marginBottom: 6 }}>SHIVAAY</div>
              <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "#8b7355", textTransform: "uppercase", marginBottom: 18 }}>Dentals & Aesthetics</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 300 }}>1st Floor, SCO 1070, near SBI Bank, opposite Vivek High School, Sector 70, Mohali – 160071</p>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#8b7355", textTransform: "uppercase", marginBottom: 16 }}>Treatments</div>
              {["General Dentistry", "Dental Implants", "Cosmetic Dentistry", "Orthodontics", "Root Canal", "Smile Design"].map(t => (
                <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#8b7355", textTransform: "uppercase", marginBottom: 16 }}>Visit Us</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.9 }}>
                Mon – Sat: 9 AM – 8 PM<br /><br />
                <span style={{ color: "#a8d5c2" }}>5.0 ★ on Google</span><br />
                54 Verified Reviews
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.18)" }}>
            © 2025 Shivaay Dentals & Aesthetics, Sector 70, Mohali. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/918968065067"
        target="_blank"
        rel="noreferrer"
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 58, height: 58, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transition: "transform 0.2s, box-shadow 0.2s", textDecoration: "none" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,0.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)"; }}
        title="Chat on WhatsApp with Dr. Aradhana Sharma"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
