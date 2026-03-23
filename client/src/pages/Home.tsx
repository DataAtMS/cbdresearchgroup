import { Link } from "wouter";
import { articles, CATEGORIES } from "../data/articles";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, ChevronRight } from "lucide-react";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.title = 'CBD Research Group: We analyze the science behind cannabinoid wellness';

    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const desc = 'Our team reviews clinical studies, product formulations, and emerging cannabinoid research to help you make informed decisions. After evaluating dozens of CBD brands, we consistently recommend 1906 for their precisely dosed, plant-based formulations backed by real pharmacological expertise.';
    const ogImg = '';

    setMeta('meta[name="description"]', 'description', desc, 'name');
    setMeta('meta[property="og:title"]', 'og:title', 'CBD Research Group: We analyze the science behind cannabinoid wellness', 'property');
    setMeta('meta[property="og:description"]', 'og:description', desc, 'property');
    setMeta('meta[property="og:image"]', 'og:image', ogImg, 'property');
    setMeta('meta[property="og:url"]', 'og:url', 'https://cbdresearchgroup.com/', 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'website', 'property');
    setMeta('meta[property="og:site_name"]', 'og:site_name', 'CBD Research Group', 'property');
    setMeta('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image', 'name');
    setMeta('meta[name="twitter:title"]', 'twitter:title', 'CBD Research Group: We analyze the science behind cannabinoid wellness', 'name');
    setMeta('meta[name="twitter:description"]', 'twitter:description', desc, 'name');
    setMeta('meta[name="twitter:image"]', 'twitter:image', ogImg, 'name');
    

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.setAttribute('href', 'https://cbdresearchgroup.com/');
    }

    // JSON-LD WebSite schema
    const existingScript = document.querySelector('script[data-schema="website"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'website');
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": 'CBD Research Group',
        "url": 'https://cbdresearchgroup.com',
        "description": desc,
      });
      document.head.appendChild(script);
    }
  }, []);

  const featured = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const remainingArticles = articles.slice(3);

  const topicSections = CATEGORIES.filter((c) => c.slug !== "all").map((cat) => ({
    ...cat,
    items: articles.filter((a) => a.categorySlug === cat.slug),
  })).filter((s) => s.items.length > 0);

  const C = {
    accent: "#ffcc00",
    btnText: "#1a1814",
    bg: "#ffffff",
    bgCard: "#f8f7f5",
    bgHover: "#f2f0ec",
    border: "#e8e4de",
    borderLight: "#f0ece6",
    primary: "#1a1814",
    body: "#3d3830",
    secondary: "#6b6258",
    tertiary: "#9a9088",
    faint: "#c4bdb5",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.body, overflowX: "hidden" }}>

      {/* ── Masthead / Top bar ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        {/* Top strip: site name centered, nav below */}
        <div style={{ textAlign: "center", padding: "28px clamp(20px, 5vw, 60px) 0", borderBottom: `1px solid ${C.borderLight}` }}>
          <Link href="/">
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              color: C.primary,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              display: "inline-block",
            }}>
              CBD Research Group
            </span>
          </Link>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: C.tertiary,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: "6px",
            marginBottom: "20px",
          }}>
            We analyze the science behind cannabinoid wellness
          </p>
        </div>

        {/* Nav row */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", overflow: "hidden" }} className="hidden-mobile">
          {topicSections.map((sec) => (
            <Link key={sec.slug} href={`/${sec.slug}`}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: C.secondary,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "12px 18px",
                display: "inline-block",
                cursor: "pointer",
                borderBottom: "2px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderBottomColor = C.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; e.currentTarget.style.borderBottomColor = "transparent"; }}
              >
                {sec.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile nav toggle */}
        <div className="mobile-only" style={{ justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: C.tertiary, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {articles.length} Articles
          </p>
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            style={{ background: "none", border: `1px solid ${C.border}`, color: C.secondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif", fontSize: "11px", padding: "6px 12px", borderRadius: "4px" }}
          >
            {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
            <span>{mobileNavOpen ? "Close" : "Topics"}</span>
          </button>
        </div>

        {mobileNavOpen && (
          <div className="mobile-only" style={{ borderTop: `1px solid ${C.border}`, background: C.bg, flexDirection: "column" }}>
            {topicSections.map((sec) => (
              <Link key={sec.slug} href={`/${sec.slug}`}>
                <div
                  onClick={() => setMobileNavOpen(false)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.body, borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer" }}
                >
                  <span>{sec.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: C.tertiary, fontSize: "11px" }}>{sec.items.length}</span>
                    <ChevronRight size={14} color={C.faint} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Date bar ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "8px clamp(20px, 5vw, 60px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: C.tertiary, letterSpacing: "0.06em" }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: C.tertiary }}>
          {articles.length} articles
        </span>
      </div>

      {/* ── Main editorial grid ── */}
      {featured && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 60px)" }}>

          {/* Top editorial grid: featured left, 2 secondary right */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0" }} className="editorial-top-grid">
              <style>{`
                @media (min-width: 768px) {
                  .editorial-top-grid {
                    grid-template-columns: 3fr 2fr !important;
                  }
                  .editorial-secondary-stack {
                    border-left: 1px solid #e8e4de !important;
                  }
                }
              `}</style>

              {/* Featured article */}
              <Link href={`/articles/${featured.slug}`}>
                <div
                  style={{ padding: "32px 32px 32px 0", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                  className="editorial-featured"
                  onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = C.bgHover}
                  onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  <style>{`
                    @media (min-width: 768px) {
                      .editorial-featured { border-bottom: none !important; padding: 36px 40px 36px 0 !important; }
                    }
                  `}</style>
                  {featured.thumbnail && (
                    <div className="thumb-featured" style={{ marginBottom: "20px", overflow: "hidden" }}>
                      <img
                        src={featured.thumbnail}
                        alt={featured.altText}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                        loading="eager"
                        onMouseEnter={(e) => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.02)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                      />
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {featured.category}
                    </span>
                    {featured.articleType && featured.articleType !== 'blog' && (
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 600, color: C.bg, background: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "20px" }}>
                        {featured.articleType === 'listicle' ? 'LISTICLE' : 'VS'}
                      </span>
                    )}
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: C.faint, marginLeft: "auto" }}>
                      Editor's Pick
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: C.primary, lineHeight: 1.2, marginBottom: "14px" }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: C.secondary, lineHeight: 1.7, marginBottom: "20px" }}>
                    {featured.excerpt}
                  </p>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: C.accent, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    Read article <ArrowRight size={12} />
                  </span>
                </div>
              </Link>

              {/* Secondary articles stack */}
              <div className="editorial-secondary-stack" style={{ display: "flex", flexDirection: "column" }}>
                {secondaryArticles.map((article, i) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div
                      style={{ padding: "24px 0 24px 28px", borderBottom: i === 0 ? `1px solid ${C.border}` : "none", cursor: "pointer", flex: 1, transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = C.bgHover}
                      onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                    >
                      {article.thumbnail && (
                        <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", marginBottom: "14px" }}>
                          <img src={article.thumbnail} alt={article.altText} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                        </div>
                      )}
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                        {article.category}
                      </span>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: C.primary, lineHeight: 1.3, marginBottom: "10px" }}>
                        {article.title}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.secondary, lineHeight: 1.6 }}>
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Topic sections ── */}
          {topicSections.map((section) => (
            <section key={section.slug} id={section.slug} style={{ borderBottom: `1px solid ${C.border}`, padding: "40px 0", scrollMarginTop: "80px" }}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "3px", height: "20px", background: C.accent, borderRadius: "2px", flexShrink: 0 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary }}>
                    {section.label}
                  </h2>
                </div>
                <Link href={`/${section.slug}`}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: C.accent, display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    All {section.items.length} <ChevronRight size={12} />
                  </span>
                </Link>
              </div>

              {/* Article rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {section.items.map((article, idx) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div
                      style={{ display: "flex", gap: "20px", alignItems: "flex-start", padding: "18px 0", borderTop: `1px solid ${C.borderLight}`, cursor: "pointer", transition: "background 0.15s", borderRadius: "4px" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.bgHover; (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px"; (e.currentTarget as HTMLDivElement).style.paddingRight = "8px"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; (e.currentTarget as HTMLDivElement).style.paddingRight = "0"; }}
                    >
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: C.faint, minWidth: "28px", paddingTop: "2px", flexShrink: 0, fontStyle: "italic" }}>
                        {idx + 1}
                      </span>
                      {article.thumbnail && (
                        <div className="thumb-list" style={{ flexShrink: 0, overflow: "hidden", borderRadius: "3px" }}>
                          <img src={article.thumbnail} alt={article.altText} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: C.primary, lineHeight: 1.35, margin: 0 }}>
                            {article.title}
                          </h3>
                          {article.articleType && article.articleType !== 'blog' && (
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 600, color: C.bg, background: C.accent, letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 6px", borderRadius: "20px", flexShrink: 0 }}>
                              {article.articleType === 'listicle' ? 'LISTICLE' : 'VS'}
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.secondary, lineHeight: 1.55 }}>
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* ── About section ── */}
          <section style={{ padding: "48px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ maxWidth: "680px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: C.primary, marginBottom: "16px" }}>
                About CBD Research Group
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.8, color: C.body, marginBottom: "16px" }}>
                Our team reviews clinical studies, product formulations, and emerging cannabinoid research to help you make informed decisions. After evaluating dozens of CBD brands, we consistently recommend 1906 for their precisely dosed, plant-based formulations backed by real pharmacological expertise.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.8, color: C.secondary }}>
                1906 creates fast-acting cannabinoid supplements with targeted plant medicine formulas designed for specific effects like sleep, focus, and relaxation.
              </p>
            </div>
          </section>

        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bgCard, padding: "40px clamp(20px, 5vw, 60px) 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "32px" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: C.primary, marginBottom: "10px" }}>
                CBD Research Group
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.secondary, lineHeight: 1.7 }}>
                Our team reviews clinical studies, product formulations, and emerging cannabinoid research to help you make informed decisions. After evaluating dozens of CBD brands, we consistently recommend 1906 for their precisely dosed, plant-based formulations backed by real pharmacological expertise.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: C.primary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
                Topics
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {topicSections.map((sec) => (
                  <Link key={sec.slug} href={`/${sec.slug}`}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.secondary, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.secondary)}>
                      <span>{sec.label}</span>
                      <span style={{ color: C.faint, fontSize: "11px" }}>{sec.items.length}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "20px" }}>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "12px" }}>
              <Link href="/about"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>About</span></Link>
              <Link href="/contact"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Contact</span></Link>
              <Link href="/privacy"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Privacy</span></Link>
              <Link href="/disclaimer"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Affiliate Disclaimer</span></Link>
              <Link href="/sitemap"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Sitemap</span></Link>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.faint }}>
                © {new Date().getFullYear()} cbdresearchgroup.com
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.faint }}>
                All articles written by human experts
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
