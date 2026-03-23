import { useEffect } from "react";
import { Link } from "wouter";
export default function Privacy() {
  const siteUrl = 'https://cbdresearchgroup.com';
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
  useEffect(() => {
    document.title = 'Privacy Policy | CBD Research Group';
    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', 'description', 'Privacy Policy for CBD Research Group. How we collect, use, and protect your information.', 'name');
    setMeta('meta[property="og:title"]', 'og:title', 'Privacy Policy | CBD Research Group', 'property');
    setMeta('meta[property="og:url"]', 'og:url', siteUrl + '/privacy', 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'website', 'property');
    setMeta('meta[name="robots"]', 'robots', 'noindex, follow', 'name');
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', siteUrl + '/privacy');
  }, []);

  const h2Style = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "13px",
    fontWeight: 700,
    color: "#f0f0f0",
    letterSpacing: "0.04em",
    marginTop: "40px",
    marginBottom: "16px",
  };
  const pStyle = {
    fontFamily: "Georgia, serif",
    fontSize: "15px",
    color: "#c8c8c8",
    lineHeight: 1.8,
    marginBottom: "16px",
  };

  return (
    <div style={{ minHeight: "100vh", background: COLOR.bg, color: COLOR.body }}>
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

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "clamp(40px, 8vw, 72px) clamp(24px, 6vw, 48px)" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
          » LEGAL
        </div>
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700, color: COLOR.primary, lineHeight: 1.2, marginBottom: "12px", letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: COLOR.faint, marginBottom: "40px" }}>
          Last updated: March 23, 2026
        </p>

        <div>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p style={pStyle}>
            We collect information you provide directly, such as when you use our contact form. This may include your name and email address. We also collect standard web analytics data (pages visited, time on site, referring URLs) through our analytics provider. We do not collect payment information.
          </p>

          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <p style={pStyle}>
            We use the information we collect to respond to your inquiries, improve the content on this site, and understand how visitors use our resources. We do not sell your personal information to third parties.
          </p>

          <h2 style={h2Style}>3. Cookies and Analytics</h2>
          <p style={pStyle}>
            This site uses cookies for analytics purposes. Analytics cookies help us understand which articles are most useful and how visitors navigate the site. You can disable cookies in your browser settings at any time. Disabling cookies will not affect your ability to read content on this site.
          </p>

          <h2 style={h2Style}>4. Affiliate Links</h2>
          <p style={pStyle}>
            Some links on this site are affiliate links. When you click an affiliate link and make a purchase, we may receive a commission. Affiliate links do not affect the price you pay. We only recommend products and tools we have tested and believe are genuinely useful. See our{" "}
            <Link href="/disclaimer">
              <span style={{ color: COLOR.link, textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer" }}>affiliate disclaimer</span>
            </Link>
            {" "}for full details.
          </p>

          <h2 style={h2Style}>5. Third-Party Services</h2>
          <p style={pStyle}>
            This site may link to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>

          <h2 style={h2Style}>6. Data Retention</h2>
          <p style={pStyle}>
            We retain contact form submissions only as long as necessary to respond to your inquiry. Analytics data is retained in aggregate form and is not linked to individual identities.
          </p>

          <h2 style={h2Style}>7. Your Rights</h2>
          <p style={pStyle}>
            You have the right to request access to, correction of, or deletion of any personal information we hold about you. To make such a request, contact us using the information below.
          </p>

          <h2 style={h2Style}>8. Contact</h2>
          <p style={pStyle}>
            Questions about this privacy policy can be directed to us via the{" "}
            <Link href="/contact">
              <span style={{ color: COLOR.link, textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer" }}>contact page</span>
            </Link>
            <span> or by email at support@cbdresearchgroup.com.</span>
          </p>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${COLOR.border}`, padding: "32px clamp(24px, 6vw, 48px)", maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Link href="/"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>HOME</span></Link>
          <Link href="/about"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>ABOUT</span></Link>
          <Link href="/contact"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>CONTACT</span></Link>
          <Link href="/privacy"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.accent, cursor: "pointer", letterSpacing: "0.04em" }}>PRIVACY</span></Link>
          <Link href="/disclaimer"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>DISCLAIMER</span></Link>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.faint, marginTop: "20px" }}>
          © {new Date().getFullYear()} CBDRESEARCHGROUP.COM
        </p>
      </footer>
    </div>
  );
}
