#!/usr/bin/env node
/**
 * prerender.mjs — runs after vite build to generate per-article static HTML.
 * Executed by: node prerender.mjs (from netlify.toml build command)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const SITE_URL = 'https://cbdresearchgroup.com';
const SITE_NAME = 'CBD Research Group';
const TWITTER_HANDLE = '';

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderMarkdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((<li>[\s\S]+?<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(?!<[a-z]|\s*$)(.+)$/gm, '<p>$1</p>');
}

let articles = [];
let categories = [];

try {
  const srcPath = join(__dirname, 'client', 'src', 'data', 'articles.ts');
  const src = readFileSync(srcPath, 'utf8');

  // Extract CATEGORIES array
  const catMatch = src.match(/export const CATEGORIES = (\[[\s\S]*?\]);/);
  if (catMatch) {
    categories = Function('"use strict"; return ' + catMatch[1])();
  }

  // Extract article metadata via regex (avoids eval of template literals)
  const articleMatches = [...src.matchAll(
    /\{\s*id:\s*(\d+),\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*categorySlug:\s*"([^"]+)",\s*articleType:\s*"([^"]+)"[^]*?metaDescription:\s*"((?:[^"\\]|\\.)*)",\s*excerpt:\s*"((?:[^"\\]|\\.)*)",\s*thumbnail:\s*"([^"]*)",\s*altText:\s*"((?:[^"\\]|\\.)*)",\s*datePublished:\s*"([^"]+)",\s*dateModified:\s*"([^"]+)",/g
  )];

  for (const m of articleMatches) {
    articles.push({
      id: parseInt(m[1]),
      slug: m[2],
      title: m[3].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
      category: m[4].replace(/\\"/g, '"'),
      categorySlug: m[5],
      articleType: m[6],
      metaDescription: m[7].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
      excerpt: m[8].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
      thumbnail: m[9],
      altText: m[10].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
      datePublished: m[11],
      dateModified: m[12],
      content: '',
      faqItems: [],
    });
  }

  // Extract content for each article (between content: ` and `, faqItems:)
  for (const article of articles) {
    const escapedSlug = article.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const marker = 'slug: "' + article.slug + '"';
    const startIdx = src.indexOf(marker);
    if (startIdx === -1) continue;
    const chunk = src.slice(startIdx);
    // Find content: ` start
    const contentStart = chunk.indexOf('content: `');
    if (contentStart === -1) continue;
    const contentBodyStart = contentStart + 'content: `'.length;
    // Find the closing backtick followed by , faqItems:
    const closingIdx = chunk.indexOf('`,\n    faqItems:', contentBodyStart);
    if (closingIdx === -1) continue;
    article.content = chunk.slice(contentBodyStart, closingIdx)
      .replace(/\\`/g, '`')
      .replace(/\\\\/g, '\\')
      .replace(/\\\$/g, '$');

    // Extract faqItems JSON
    const faqStart = chunk.indexOf('faqItems: [', contentBodyStart);
    if (faqStart !== -1) {
      const faqBodyStart = faqStart + 'faqItems: '.length;
      // Find matching closing bracket
      let depth = 0;
      let faqEnd = faqBodyStart;
      for (let i = faqBodyStart; i < chunk.length; i++) {
        if (chunk[i] === '[') depth++;
        else if (chunk[i] === ']') { depth--; if (depth === 0) { faqEnd = i + 1; break; } }
      }
      try {
        article.faqItems = JSON.parse(chunk.slice(faqBodyStart, faqEnd));
      } catch { article.faqItems = []; }
    }
  }

  console.log('[prerender] Loaded ' + articles.length + ' articles, ' + categories.length + ' categories');
} catch (err) {
  console.error('[prerender] Failed to load articles:', err.message);
  console.log('[prerender] Skipping prerender — site will work as SPA only');
  process.exit(0);
}

// ── Read the base index.html from dist ─────────────────────────────────────
const baseHtmlPath = join(DIST, 'index.html');
if (!existsSync(baseHtmlPath)) {
  console.error('[prerender] dist/index.html not found — did vite build run?');
  process.exit(1);
}
const baseHtml = readFileSync(baseHtmlPath, 'utf8');

let generated = 0;
let failed = 0;

// ── Generate per-article HTML ───────────────────────────────────────────────
for (const article of articles) {
  try {
    const articleUrl = SITE_URL + '/articles/' + article.slug;
    const catUrl = SITE_URL + '/' + article.categorySlug;

    const articleSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.metaDescription,
      image: article.thumbnail || undefined,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: { '@type': 'Organization', name: SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      url: articleUrl,
    });

    const breadcrumbSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: article.category, item: catUrl },
        { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
      ],
    });

    const faqSchema = article.faqItems && article.faqItems.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        })
      : null;

    const speakableSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: article.title,
      url: articleUrl,
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.article-lede'] },
    });

    const ogImageTags = article.thumbnail
      ? '\n    <meta property="og:image" content="' + escHtml(article.thumbnail) + '" />'
        + '\n    <meta property="og:image:width" content="1200" />'
        + '\n    <meta property="og:image:height" content="630" />'
        + '\n    <meta name="twitter:image" content="' + escHtml(article.thumbnail) + '" />'
      : '';

    const twitterSiteTag = TWITTER_HANDLE
      ? '\n    <meta name="twitter:site" content="' + escHtml(TWITTER_HANDLE) + '" />'
      : '';

    const headInjection = [
      '    <title>' + escHtml(article.title) + ' | ' + escHtml(SITE_NAME) + '</title>',
      '    <meta name="description" content="' + escHtml(article.metaDescription) + '" />',
      '    <link rel="canonical" href="' + escHtml(articleUrl) + '" />',
      '    <meta property="og:type" content="article" />',
      '    <meta property="og:site_name" content="' + escHtml(SITE_NAME) + '" />',
      '    <meta property="og:title" content="' + escHtml(article.title) + '" />',
      '    <meta property="og:description" content="' + escHtml(article.metaDescription) + '" />',
      '    <meta property="og:url" content="' + escHtml(articleUrl) + '" />' + ogImageTags,
      '    <meta name="twitter:card" content="summary_large_image" />',
      '    <meta name="twitter:title" content="' + escHtml(article.title) + '" />',
      '    <meta name="twitter:description" content="' + escHtml(article.metaDescription) + '" />' + twitterSiteTag,
      '    <script type="application/ld+json">' + articleSchema + '</script>',
      '    <script type="application/ld+json">' + breadcrumbSchema + '</script>',
      faqSchema ? '    <script type="application/ld+json">' + faqSchema + '</script>' : '',
      '    <script type="application/ld+json">' + speakableSchema + '</script>',
    ].filter(Boolean).join('\n');

    const contentHtml = renderMarkdownToHtml(article.content || article.excerpt || '');
    const faqHtml = article.faqItems && article.faqItems.length > 0
      ? '<section class="faq-prerender"><h2>Frequently Asked Questions</h2>'
        + article.faqItems.map((item) =>
            '<div class="faq-item"><h3>' + escHtml(item.question) + '</h3><p>' + escHtml(item.answer) + '</p></div>'
          ).join('')
        + '</section>'
      : '';

    const crawlerBlock = '<div id="prerender-content" aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">'
      + '<h1>' + escHtml(article.title) + '</h1>'
      + '<p>' + escHtml(article.metaDescription) + '</p>'
      + contentHtml
      + faqHtml
      + '</div>';

    let html = baseHtml
      .replace(/<title>[^<]*<\/title>/, '')
      .replace('</head>', headInjection + '\n  </head>')
      .replace('<body>', '<body>' + crawlerBlock);

    const outDir = join(DIST, 'articles', article.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    generated++;
    console.log('[prerender] ✓ /articles/' + article.slug);
  } catch (err) {
    console.error('[prerender] ✗ ' + article.slug + ':', err.message);
    failed++;
  }
}

// ── Generate per-category HTML ──────────────────────────────────────────────
for (const cat of categories.filter((c) => c.slug !== 'all')) {
  try {
    const catUrl = SITE_URL + '/' + cat.slug;
    const catArticles = articles.filter((a) => a.categorySlug === cat.slug);
    const catTitle = cat.label + ' | ' + SITE_NAME;
    const catDescription = catArticles.slice(0, 3).map((a) => a.title).join(', ');

    const headInjection = [
      '    <title>' + escHtml(catTitle) + '</title>',
      '    <meta name="description" content="' + escHtml(catDescription) + '" />',
      '    <link rel="canonical" href="' + escHtml(catUrl) + '" />',
      '    <meta property="og:type" content="website" />',
      '    <meta property="og:site_name" content="' + escHtml(SITE_NAME) + '" />',
      '    <meta property="og:title" content="' + escHtml(catTitle) + '" />',
      '    <meta property="og:description" content="' + escHtml(catDescription) + '" />',
      '    <meta property="og:url" content="' + escHtml(catUrl) + '" />',
    ].join('\n');

    const crawlerBlock = '<div id="prerender-content" aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">'
      + '<h1>' + escHtml(cat.label) + '</h1>'
      + '<ul>' + catArticles.map((a) => '<li><a href="' + escHtml(SITE_URL + '/articles/' + a.slug) + '">' + escHtml(a.title) + '</a></li>').join('') + '</ul>'
      + '</div>';

    let html = baseHtml
      .replace(/<title>[^<]*<\/title>/, '')
      .replace('</head>', headInjection + '\n  </head>')
      .replace('<body>', '<body>' + crawlerBlock);

    const outDir = join(DIST, cat.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    generated++;
    console.log('[prerender] ✓ /' + cat.slug);
  } catch (err) {
    console.error('[prerender] ✗ category ' + cat.slug + ':', err.message);
    failed++;
  }
}

console.log('[prerender] Done — ' + generated + ' pages generated, ' + failed + ' failed');
if (failed > 0) {
  console.warn('[prerender] Some pages failed but site will still work as SPA');
}
