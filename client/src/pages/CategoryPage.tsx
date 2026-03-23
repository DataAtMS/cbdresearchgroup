import { Link, useLocation } from "wouter";
import { articles, CATEGORIES } from "../data/articles";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

const CATEGORY_SEO: Record<string, { metaTitle: string; metaDescription: string; h1: string; intro: string }> = {
  "cannabinoid-studies": { metaTitle: 'Cannabinoid Studies | CBD Research Group', metaDescription: 'Browse 3 articles about cannabinoid studies on CBD Research Group.', h1: 'Cannabinoid Studies', intro: 'Browse 3 articles about cannabinoid studies on CBD Research Group.' },
  "product-lab-testing": { metaTitle: 'Product Lab Testing | CBD Research Group', metaDescription: 'Browse 3 articles about product lab testing on CBD Research Group.', h1: 'Product Lab Testing', intro: 'Browse 3 articles about product lab testing on CBD Research Group.' },
  "dosage-guides": { metaTitle: 'Dosage Guides | CBD Research Group', metaDescription: 'Browse 3 articles about dosage guides on CBD Research Group.', h1: 'Dosage Guides', intro: 'Browse 3 articles about dosage guides on CBD Research Group.' },
  "condition-research": { metaTitle: 'Condition Research | CBD Research Group', metaDescription: 'Browse 3 articles about condition research on CBD Research Group.', h1: 'Condition Research', intro: 'Browse 3 articles about condition research on CBD Research Group.' },
  "brand-reviews": { metaTitle: 'Brand Reviews | CBD Research Group', metaDescription: 'Browse 3 articles about brand reviews on CBD Research Group.', h1: 'Brand Reviews', intro: 'Browse 3 articles about brand reviews on CBD Research Group.' }
};

export default function CategoryPage() {
  const [location] = useLocation();
  const slug = location.replace(/^\//, "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const catInfo = CATEGORIES.find((c) => c.slug === slug);
  const seo = CATEGORY_SEO[slug] || {};
  const categoryArticles = articles.filter((a) => a.categorySlug === slug);
  const topicSections = CATEGORIES.filter((c) => c.slug !== "all").map((cat) => ({
    ...cat,
    items: articles.filter((a) => a.categorySlug === cat.slug),
  })).filter((s) => s.items.length > 0);

  useEffect(() => {
    if (!catInfo) return;

    document.title = seo.metaTitle || catInfo.label;

    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const desc = seo.metaDescription || '';
    const pageUrl = 'https://cbdresearchgroup.com/' + slug;

    setMeta('meta[name="description"]', 'description', desc, 'name');
    setMeta('meta[property="og:title"]', 'og:title', seo.metaTitle || catInfo.label, 'property');
    setMeta('meta[property="og:description"]', 'og:description', desc, 'property');
    setMeta('meta[property="og:url"]', 'og:url', pageUrl, 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'website', 'property');
    setMeta('meta[property="og:site_name"]', 'og:site_name', 'CBD Research Group', 'property');
    setMeta('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image', 'name');
    setMeta('meta[name="twitter:title"]', 'twitter:title', seo.metaTitle || catInfo.label, 'name');
    setMeta('meta[name="twitter:description"]', 'twitter:description', desc, 'name');

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', pageUrl);

    const existingScript = document.querySelector('script[data-schema="collection"]');
    if (existingScript) existingScript.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'collection');
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seo.h1 || catInfo.label,
      "description": desc,
      "url": pageUrl,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": 'https://cbdresearchgroup.com' },
          { "@type": "ListItem", "position": 2, "name": catInfo.label, "item": pageUrl },
        ]
      }
    });
    document.head.appendChild(script);
  }, [slug, catInfo]);

  const C = {
    accent: "#ffcc00",
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

  if (!catInfo) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.tertiary, fontFamily: "'Inter', sans-serif" }}>Category not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.body, overflowX: "hidden", maxWidth: "100vw" }}>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ borderBottom: `1px solid ${C.borderLight}`, padding: "14px clamp(20px, 5vw, 60px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1.2rem", color: C.primary, cursor: "pointer" }}>
              CBD Research Group
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: "0" }} className="hidden-mobile">
            {topicSections.map((sec) => (
              <Link key={sec.slug} href={`/${sec.slug}`}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: sec.slug === slug ? C.accent : C.secondary, letterSpacing: "0.07em", textTransform: "uppercase", padding: "8px 14px", display: "inline-block", cursor: "pointer", borderBottom: sec.slug === slug ? `2px solid ${C.accent}` : "2px solid transparent", transition: "color 0.15s, border-color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderBottomColor = C.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = sec.slug === slug ? C.accent : C.secondary; e.currentTarget.style.borderBottomColor = sec.slug === slug ? C.accent : "transparent"; }}
                >
                  {sec.label}
                </span>
              </Link>
            ))}
          </nav>
          <button className="mobile-only" onClick={() => setMobileNavOpen((v) => !v)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.secondary, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif", fontSize: "11px", padding: "6px 12px", borderRadius: "4px" }}>
            {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
            <span>{mobileNavOpen ? "Close" : "Topics"}</span>
          </button>
        </div>
        {mobileNavOpen && (
          <div className="mobile-only" style={{ borderTop: `1px solid ${C.border}`, background: C.bg, flexDirection: "column" }}>
            {topicSections.map((sec) => (
              <Link key={sec.slug} href={`/${sec.slug}`}>
                <div onClick={() => setMobileNavOpen(false)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.body, borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer" }}>
                  <span>{sec.label}</span>
                  <ChevronRight size={14} color={C.faint} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Category hero */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "48px clamp(20px, 5vw, 60px) 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, marginBottom: "20px" }}>
            <Link href="/"><span style={{ color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Home</span></Link>
            <ChevronRight size={12} color={C.faint} />
            <span style={{ color: C.secondary }}>{catInfo.label}</span>
          </div>

          {/* Accent rule + title */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <div style={{ width: "4px", height: "32px", background: C.accent, borderRadius: "2px", flexShrink: 0 }} />
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: C.primary, lineHeight: 1.2 }}>
              {seo.h1 || catInfo.label}
            </h1>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.75, color: C.secondary, maxWidth: "600px", marginLeft: "18px" }}>
            {seo.intro}
          </p>
          <div style={{ marginTop: "14px", marginLeft: "18px", fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.faint, letterSpacing: "0.06em" }}>
            {categoryArticles.length} article{categoryArticles.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Articles list */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px clamp(20px, 5vw, 60px) 96px" }}>
        {categoryArticles.length === 0 ? (
          <p style={{ color: C.tertiary, fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>No articles in this category yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {categoryArticles.map((article, idx) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <div
                  style={{ borderBottom: `1px solid ${C.borderLight}`, padding: "22px 0", cursor: "pointer", transition: "padding-left 0.15s, background 0.15s", borderRadius: "4px" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.bgHover; (e.currentTarget as HTMLDivElement).style.paddingLeft = "10px"; (e.currentTarget as HTMLDivElement).style.paddingRight = "10px"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; (e.currentTarget as HTMLDivElement).style.paddingRight = "0"; }}
                >
                  <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    {/* Number */}
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: C.faint, minWidth: "28px", paddingTop: "2px", flexShrink: 0, fontStyle: "italic" }}>
                      {idx + 1}
                    </span>
                    {/* Thumbnail */}
                    {article.thumbnail && (
                      <div className="thumb-list" style={{ flexShrink: 0, overflow: "hidden", borderRadius: "3px" }}>
                        <img src={article.thumbnail} alt={article.altText || article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                      </div>
                    )}
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: C.primary, lineHeight: 1.35, margin: 0 }}>
                          {article.title}
                        </h2>
                        {article.articleType && article.articleType !== 'blog' && (
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 600, color: "#ffffff", background: C.accent, letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "20px", flexShrink: 0 }}>
                            {article.articleType === 'listicle' ? 'LISTICLE' : 'VS'}
                          </span>
                        )}
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: C.secondary, lineHeight: 1.6, marginBottom: "10px" }}>
                        {article.excerpt}
                      </p>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: C.accent, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        Read article <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bgCard, padding: "32px clamp(20px, 5vw, 60px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <Link href="/">
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: C.primary, cursor: "pointer" }}>
              CBD Research Group
            </span>
          </Link>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/about"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>About</span></Link>
            <Link href="/contact"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Contact</span></Link>
            <Link href="/privacy"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Privacy</span></Link>
            <Link href="/disclaimer"><span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Disclaimer</span></Link>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.faint }}>
            © {new Date().getFullYear()} cbdresearchgroup.com
          </p>
        </div>
      </footer>
    </div>
  );
}
