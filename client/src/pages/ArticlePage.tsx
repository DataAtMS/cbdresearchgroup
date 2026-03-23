import { Link, useParams } from "wouter";
import { articles, CATEGORIES } from "../data/articles";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

// Simple markdown renderer
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="' + '$1'.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/((?:^\|.+\|\n?)+)/gm, (tableBlock) => {
      const rows = tableBlock.trim().split('\n').filter(r => r.trim().startsWith('|'));
      if (rows.length < 2) return tableBlock;
      let html = '<table>';
      let inBody = false;
      let headerDone = false;
      rows.forEach((row) => {
        const cells = row.split('|').filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^[-:\s]+$/.test(c))) {
          if (!headerDone) { html += '</thead><tbody>'; headerDone = true; inBody = true; }
          return;
        }
        if (!headerDone) {
          html += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr>';
        } else {
          html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      if (inBody) html += '</tbody>';
      else if (!headerDone) html += '</thead>';
      html += '</table>';
      return html;
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(?!<[a-z]|\s*$)(.+)$/gm, '<p>$1</p>')
    .replace(/\n{2,}/g, '')
    .replace('<p>', '<p class="article-lede">');
}

function FaqItem({ question, answer, accentColor, borderColor }: { question: string; answer: string; accentColor: string; borderColor: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${borderColor}` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", background: "none", border: "none", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: "12px", textAlign: "left" }}
      >
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "16px", fontWeight: 700, color: "#1a1814", lineHeight: 1.4 }}>
          {question}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: accentColor, flexShrink: 0, lineHeight: 1 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#6b6258", lineHeight: 1.8, paddingBottom: "18px", paddingRight: "24px" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const article = articles.find((a) => a.slug === slug);
  const topicSections = CATEGORIES.filter((c) => c.slug !== "all").map((cat) => ({
    ...cat,
    items: articles.filter((a) => a.categorySlug === cat.slug),
  })).filter((s) => s.items.length > 0);

  const categoryArticles = article ? articles.filter((a) => a.categorySlug === article.categorySlug && a.slug !== article.slug) : [];
  const nextArticle = categoryArticles[0] || null;

  const categoryAllArticles = article ? articles.filter((a) => a.categorySlug === article.categorySlug) : [];
  const articleIndex = article ? categoryAllArticles.findIndex((a) => a.slug === article.slug) + 1 : 0;

  const furtherReading = article
    ? articles.filter((a) => a.categorySlug !== article.categorySlug && a.slug !== article.slug).slice(0, 3)
    : [];

  useEffect(() => {
    if (!article) return;

    document.title = article.title + ' | CBD Research Group';

    const setMeta = (selector: string, attr: string, value: string, attrName: string) => {
      let el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const pageUrl = 'https://cbdresearchgroup.com/articles/' + article.slug;
    const catUrl = 'https://cbdresearchgroup.com/' + article.categorySlug;

    setMeta('meta[name="description"]', 'description', article.metaDescription, 'name');
    setMeta('meta[property="og:title"]', 'og:title', article.title, 'property');
    setMeta('meta[property="og:description"]', 'og:description', article.metaDescription, 'property');
    setMeta('meta[property="og:image"]', 'og:image', article.thumbnail || '', 'property');
    setMeta('meta[property="og:url"]', 'og:url', pageUrl, 'property');
    setMeta('meta[property="og:type"]', 'og:type', 'article', 'property');
    setMeta('meta[property="og:site_name"]', 'og:site_name', 'CBD Research Group', 'property');
    setMeta('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image', 'name');
    setMeta('meta[name="twitter:title"]', 'twitter:title', article.title, 'name');
    setMeta('meta[name="twitter:description"]', 'twitter:description', article.metaDescription, 'name');
    setMeta('meta[name="twitter:image"]', 'twitter:image', article.thumbnail || '', 'name');

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', pageUrl);

    // JSON-LD Article
    const existingArticle = document.querySelector('script[data-schema="article"]');
    if (existingArticle) existingArticle.remove();
    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.setAttribute('data-schema', 'article');
    articleScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDescription,
      "image": article.thumbnail || undefined,
      "datePublished": article.datePublished,
      "dateModified": article.dateModified,
      "author": { "@type": "Organization", "name": 'CBD Research Group' },
      "publisher": { "@type": "Organization", "name": 'CBD Research Group', "url": 'https://cbdresearchgroup.com' },
      "url": pageUrl,
    });
    document.head.appendChild(articleScript);

    // JSON-LD BreadcrumbList
    const existingBreadcrumb = document.querySelector('script[data-schema="breadcrumb"]');
    if (existingBreadcrumb) existingBreadcrumb.remove();
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-schema', 'breadcrumb');
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": 'https://cbdresearchgroup.com' },
        { "@type": "ListItem", "position": 2, "name": article.category, "item": catUrl },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": pageUrl },
      ]
    });
    document.head.appendChild(breadcrumbScript);

    // JSON-LD FAQPage
    const existingFaq = document.querySelector('script[data-schema="faq"]');
    if (existingFaq) existingFaq.remove();
    if (article.faqItems && article.faqItems.length > 0) {
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-schema', 'faq');
      faqScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": article.faqItems.map((item: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      });
      document.head.appendChild(faqScript);
    }

    // JSON-LD Speakable
    const existingSpeakable = document.querySelector('script[data-schema="speakable"]');
    if (existingSpeakable) existingSpeakable.remove();
    const speakableScript = document.createElement('script');
    speakableScript.type = 'application/ld+json';
    speakableScript.setAttribute('data-schema', 'speakable');
    speakableScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": article.title,
      "url": pageUrl,
      "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".article-lede"] }
    });
    document.head.appendChild(speakableScript);
  }, [article]);

  useEffect(() => {
    if (!article || !contentRef.current) return;
    const h2s = contentRef.current.querySelectorAll('h2');
    const extracted: { id: string; text: string }[] = [];
    h2s.forEach((h) => {
      const id = h.id || h.textContent?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || '';
      if (!h.id) h.id = id;
      extracted.push({ id, text: h.textContent || '' });
    });
    setHeadings(extracted);
  }, [article]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveHeading(entry.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0;
      setReadProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: C.tertiary, fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>Article not found</p>
          <Link href="/"><span style={{ color: C.accent, fontFamily: "'Inter', sans-serif", fontSize: "13px", cursor: "pointer" }}>← Back to home</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.body, overflowX: "hidden", maxWidth: "100vw" }}>
      {/* Reading progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 100, background: C.borderLight }}>
        <div style={{ height: "100%", background: C.accent, width: `${readProgress}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* ── Header / Masthead ── */}
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
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: sec.slug === article.categorySlug ? C.accent : C.secondary, letterSpacing: "0.07em", textTransform: "uppercase", padding: "8px 14px", display: "inline-block", cursor: "pointer", borderBottom: sec.slug === article.categorySlug ? `2px solid ${C.accent}` : "2px solid transparent", transition: "color 0.15s, border-color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderBottomColor = C.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = sec.slug === article.categorySlug ? C.accent : C.secondary; e.currentTarget.style.borderBottomColor = sec.slug === article.categorySlug ? C.accent : "transparent"; }}
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

      {/* ── Article layout ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 60px)", display: "flex", gap: "56px", alignItems: "flex-start" }}>
        {/* Main content */}
        <article style={{ flex: 1, minWidth: 0, padding: "48px 0 96px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, marginBottom: "28px", flexWrap: "wrap" }}>
            <Link href="/"><span style={{ color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>Home</span></Link>
            <ChevronRight size={12} color={C.faint} />
            <Link href={`/${article.categorySlug}`}><span style={{ color: C.tertiary, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)} onMouseLeave={(e) => (e.currentTarget.style.color = C.tertiary)}>{article.category}</span></Link>
            <ChevronRight size={12} color={C.faint} />
            <span style={{ color: C.secondary }}>{article.title.slice(0, 45)}{article.title.length > 45 ? "…" : ""}</span>
          </div>

          {/* Category + article type */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {article.category}
            </span>
            {article.articleType && article.articleType !== 'blog' && (
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 600, color: C.bg, background: C.accent, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "20px" }}>
                {article.articleType === 'listicle' ? 'LISTICLE' : 'COMPARISON'}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: C.primary, lineHeight: 1.2, marginBottom: "20px" }}>
            {article.title}
          </h1>

          {/* Meta */}
          {(() => {
            const wordCount = article.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));
            return (
              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "'Inter', sans-serif", fontSize: "12px", color: C.tertiary, marginBottom: "32px", paddingBottom: "28px", borderBottom: `2px solid ${C.border}`, flexWrap: "wrap" }}>
                <span>Published {article.datePublished}</span>
                {article.dateModified !== article.datePublished && <span>Updated {article.dateModified}</span>}
                <span>{readTime} min read</span>
                {categoryAllArticles.length > 1 && (
                  <span style={{ marginLeft: "auto", color: C.faint }}>
                    {articleIndex} of {categoryAllArticles.length} in {article.category}
                  </span>
                )}
              </div>
            );
          })()}

          {/* Hero image */}
          {article.thumbnail && (
            <div className="thumb-hero" style={{ marginBottom: "36px", borderRadius: "6px", overflow: "hidden" }}>
              <img src={article.thumbnail} alt={article.altText} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          {/* Comparison: Quick Verdict Banner */}
          {article.articleType === 'comparison' && (() => {
            const tableMatch = article.content.match(/((?:^\|.+\|\n?)+)/m);
            const verdictHtml = tableMatch ? renderMarkdown(tableMatch[0]) : null;
            return verdictHtml ? (
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.accent}`, borderRadius: "6px", padding: "22px 28px", marginBottom: "36px" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Quick Verdict</div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: verdictHtml }} />
              </div>
            ) : null;
          })()}

          {/* Listicle: Quick-jump list */}
          {article.articleType === 'listicle' && (() => {
            const numberedH2s = article.content.match(/^## (\d+\.? .+)$/gm);
            if (!numberedH2s || numberedH2s.length < 3) return null;
            const items = numberedH2s.map(h => h.replace(/^## /, '').trim());
            return (
              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.accent}`, borderRadius: "6px", padding: "22px 28px", marginBottom: "36px" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>In This List</div>
                <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: "7px" }}>
                  {items.map((item, i) => {
                    const id = item.replace(/^\d+\.?\s*/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    return (
                      <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: C.secondary, lineHeight: 1.5 }}>
                        <a href={`#${id}`} style={{ color: C.secondary, textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = C.secondary)}>
                          {item.replace(/^\d+\.?\s*/, '')}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })()}

          {/* Content */}
          <div ref={contentRef} className="article-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />

          {/* Next article */}
          {nextArticle && (
            <div style={{ marginTop: "64px", paddingTop: "36px", borderTop: `2px solid ${C.border}` }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: C.tertiary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "18px" }}>
                Next in {article.category}
              </div>
              <Link href={`/articles/${nextArticle.slug}`}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "24px", cursor: "pointer", transition: "background 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.bgHover; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = C.bgCard; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: C.primary, marginBottom: "10px" }}>{nextArticle.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: C.secondary, lineHeight: 1.65, marginBottom: "14px" }}>{nextArticle.excerpt}</p>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: C.accent, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    Read article <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* FAQ */}
          {article.faqItems && article.faqItems.length > 0 && (
            <div style={{ marginTop: "56px", paddingTop: "36px", borderTop: `2px solid ${C.border}` }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 700, color: C.primary, marginBottom: "24px" }}>
                Frequently Asked Questions
              </h2>
              <div>
                {article.faqItems.map((faq: { question: string; answer: string }, idx: number) => (
                  <FaqItem key={idx} question={faq.question} answer={faq.answer} accentColor={C.accent} borderColor={C.border} />
                ))}
              </div>
            </div>
          )}

          {/* Further Reading */}
          {furtherReading.length > 0 && (
            <div style={{ marginTop: "56px", paddingTop: "36px", borderTop: `2px solid ${C.border}` }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: C.primary, marginBottom: "24px" }}>
                Further Reading
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {furtherReading.map((fr) => (
                  <Link key={fr.slug} href={`/articles/${fr.slug}`}>
                    <div style={{ borderBottom: `1px solid ${C.borderLight}`, padding: "18px 0", cursor: "pointer", transition: "padding-left 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"}
                    >
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "5px" }}>
                        {fr.category}
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: C.primary, lineHeight: 1.3, marginBottom: "5px" }}>
                        {fr.title}
                      </h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: C.secondary, lineHeight: 1.55 }}>
                        {fr.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* TOC Sidebar */}
        {headings.length > 2 && (
          <aside style={{ width: "230px", flexShrink: 0, position: "sticky", top: "80px", paddingTop: "48px" }} className="toc-sidebar">
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, color: C.tertiary, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
              Contents
            </div>
            <nav>
              {headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: activeHeading === h.id ? C.accent : C.secondary, textDecoration: "none", padding: "6px 0 6px 12px", borderLeft: `2px solid ${activeHeading === h.id ? C.accent : C.borderLight}`, marginBottom: "2px", transition: "color 0.15s, border-color 0.15s", lineHeight: 1.4 }}>
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
