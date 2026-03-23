import { useEffect, useState } from "react";
import { Link } from "wouter";
export default function Contact() {
  const siteUrl = 'https://cbdresearchgroup.com';
  const contactEmail = 'support@cbdresearchgroup.com';
  const fallbackUrl = 'https://1906.shop';
  const COLOR = {
    primary: "#f0f0f0",
    body: "#c8c8c8",
    secondary: "#999",
    tertiary: "#777",
    faint: "#555",
    accent: "#ffcc00",
    link: "#ffcc00",
    bg: "#0a0a0a",
    bgCard: "#0d0d0d",
    border: "#1a1a1a",
  };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact | CBD Research Group';
    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    const desc = 'Get in touch with the CBD Research Group team. We read every message.';
    setMeta('meta[name="description"]', 'description', desc, 'name');
    setMeta('meta[property="og:title"]', 'og:title', 'Contact | CBD Research Group', 'property');
    setMeta('meta[property="og:description"]', 'og:description', desc, 'property');
    setMeta('meta[property="og:url"]', 'og:url', siteUrl + '/contact', 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'website', 'property');
    setMeta('meta[property="og:site_name"]', 'og:site_name', 'CBD Research Group', 'property');
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', siteUrl + '/contact');
    const existingBc = document.querySelector('script[data-schema="breadcrumb-contact"]');
    if (existingBc) existingBc.remove();
    const bcScript = document.createElement('script');
    bcScript.type = 'application/ld+json';
    bcScript.setAttribute('data-schema', 'breadcrumb-contact');
    bcScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": siteUrl + '/contact' },
      ]
    });
    document.head.appendChild(bcScript);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    if (contactEmail) {
      const subject = encodeURIComponent('Message from ' + name + ' via CBD Research Group');
      const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:' + contactEmail + '?subject=' + subject + '&body=' + body;
    } else {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #1a1a1a",
    borderRadius: "4px",
    padding: "12px 14px",
    fontFamily: "Georgia, serif",
    fontSize: "14px",
    color: "#c8c8c8",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100vh", background: COLOR.bg, color: COLOR.body }}>
      {/* ── Nav ── */}
      <header style={{ borderBottom: `1px solid ${COLOR.border}`, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: COLOR.bg }}>
        <Link href="/">
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "13px", color: COLOR.accent, letterSpacing: "0.05em", cursor: "pointer" }}>
            CBD RESEARCH GROUP
          </span>
        </Link>
        <Link href="/">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.06em" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}
          >
            ← ALL ARTICLES
          </span>
        </Link>
      </header>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "clamp(40px, 8vw, 72px) clamp(24px, 6vw, 48px)" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
          » CONTACT
        </div>
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700, color: COLOR.primary, lineHeight: 1.2, marginBottom: "12px", letterSpacing: "-0.02em" }}>
          Get in Touch
        </h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "15px", color: COLOR.secondary, lineHeight: 1.7, marginBottom: "40px" }}>
          Have a question, a correction, or data from your own store you want to share? We read everything.
        </p>

        {submitted ? (
          <div style={{ background: "#0d1a0d", border: "1px solid #1a4a1a", borderRadius: "4px", padding: "24px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#44ff88", letterSpacing: "0.08em", marginBottom: "8px" }}>
              ✓ MESSAGE SENT
            </div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: COLOR.secondary }}>
              Your email client should have opened. If it did not, email us directly at{" "}
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} style={{ color: COLOR.link }}>{contactEmail}</a>
              ) : (
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.link }}>1906</a>
              )}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
                YOUR NAME <span style={{ color: COLOR.accent }}>*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = COLOR.accent)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
                YOUR EMAIL <span style={{ color: COLOR.accent }}>*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourstore.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = COLOR.accent)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
                MESSAGE <span style={{ color: COLOR.accent }}>*</span>
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your question, correction, or data..."
                rows={6}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "Georgia, serif" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = COLOR.accent)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
              />
            </div>
            <button
              type="submit"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                background: COLOR.accent,
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                cursor: "pointer",
                alignSelf: "flex-start",
                borderRadius: "3px",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              SEND MESSAGE →
            </button>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.faint, marginTop: "-8px" }}>
              {contactEmail
                ? 'Clicking send will open your email client pre-filled with your message.'
                : 'Clicking send will redirect you to our contact page.'}
            </p>
          </form>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${COLOR.border}`, padding: "32px clamp(24px, 6vw, 48px)", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Link href="/"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>HOME</span></Link>
          <Link href="/about"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>ABOUT</span></Link>
          <Link href="/contact"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.accent, cursor: "pointer", letterSpacing: "0.04em" }}>CONTACT</span></Link>
          <Link href="/privacy"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>PRIVACY</span></Link>
          <Link href="/disclaimer"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>DISCLAIMER</span></Link>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.faint, marginTop: "20px" }}>
          © {new Date().getFullYear()} CBDRESEARCHGROUP.COM
        </p>
      </footer>
    </div>
  );
}
