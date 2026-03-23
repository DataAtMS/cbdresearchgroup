import { useEffect } from "react";
import { Link } from "wouter";
export default function Disclaimer() {
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
    document.title = 'Affiliate Disclaimer | CBD Research Group';
    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', 'description', 'Affiliate and earnings disclaimer for CBD Research Group.', 'name');
    setMeta('meta[property="og:title"]', 'og:title', 'Affiliate Disclaimer | CBD Research Group', 'property');
    setMeta('meta[property="og:url"]', 'og:url', siteUrl + '/disclaimer', 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'website', 'property');
    setMeta('meta[name="robots"]', 'robots', 'noindex, follow', 'name');
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', siteUrl + '/disclaimer');
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
          Affiliate Disclaimer
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: COLOR.faint, marginBottom: "40px" }}>
          Last updated: March 23, 2026
        </p>

        {/* FTC-required prominent disclosure at the top */}
        <div style={{ background: "#0d0d0d", border: `1px solid ${COLOR.accent}33`, borderLeft: `3px solid ${COLOR.accent}`, borderRadius: "4px", padding: "20px 24px", marginBottom: "40px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "15px", color: "#c8c8c8", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#f0f0f0" }}>Disclosure:</strong> Some links on CBD Research Group are affiliate links. If you click one and make a purchase, we may earn a commission at no extra cost to you. We only recommend tools we have personally tested.
          </p>
        </div>

        <div>
          <h2 style={h2Style}>What Is an Affiliate Link?</h2>
          <p style={pStyle}>
            An affiliate link is a tracked URL that identifies us as the referring source when you visit a product or service website. If you purchase through that link, the vendor pays us a referral fee. The price you pay is identical whether or not you use our affiliate link.
          </p>

          <h2 style={h2Style}>Our Affiliate Relationships</h2>
          <p style={pStyle}>
            We have affiliate relationships with various tools and services mentioned on this site. Where a link is an affiliate link, we have tested the product and believe it delivers genuine value to our readers.
          </p>

          <h2 style={h2Style}>Editorial Independence</h2>
          <p style={pStyle}>
            Affiliate relationships do not influence our editorial recommendations. We do not accept payment for positive reviews, and we do not alter our findings based on affiliate status. If a tool does not perform well in our testing, we say so — regardless of whether we have an affiliate relationship with the vendor.
          </p>

          <h2 style={h2Style}>FTC Compliance</h2>
          <p style={pStyle}>
            This disclosure is made in accordance with the Federal Trade Commission's guidelines on endorsements and testimonials (16 CFR Part 255). We are committed to transparency about our commercial relationships.
          </p>

          <h2 style={h2Style}>No Guarantees</h2>
          <p style={pStyle}>
            Results mentioned in articles on this site represent specific cases and are not guarantees of typical outcomes. Your results will vary based on your store, traffic, and implementation. We recommend testing any tool on your own data before making a long-term commitment.
          </p>

          <h2 style={h2Style}>Questions</h2>
          <p style={pStyle}>
            If you have questions about our affiliate relationships or editorial process, please use the{" "}
            <Link href="/contact">
              <span style={{ color: COLOR.link, textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer" }}>contact page</span>
            </Link>
            .
          </p>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${COLOR.border}`, padding: "32px clamp(24px, 6vw, 48px)", maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Link href="/"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>HOME</span></Link>
          <Link href="/about"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>ABOUT</span></Link>
          <Link href="/contact"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>CONTACT</span></Link>
          <Link href="/privacy"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.tertiary, cursor: "pointer", letterSpacing: "0.04em" }} onMouseEnter={(e) => (e.currentTarget.style.color = COLOR.body)} onMouseLeave={(e) => (e.currentTarget.style.color = COLOR.tertiary)}>PRIVACY</span></Link>
          <Link href="/disclaimer"><span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.accent, cursor: "pointer", letterSpacing: "0.04em" }}>DISCLAIMER</span></Link>
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: COLOR.faint, marginTop: "20px" }}>
          © {new Date().getFullYear()} CBDRESEARCHGROUP.COM
        </p>
      </footer>
    </div>
  );
}
