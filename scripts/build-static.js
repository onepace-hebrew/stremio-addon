#!/usr/bin/env node
/**
 * build-static.js — generate the static Stremio addon served by GitHub Pages.
 *
 * A Stremio addon is just HTTP GET endpoints returning JSON, so it can be fully static:
 *   docs/manifest.json                       — the addon manifest
 *   docs/subtitles/series/<ID>.json          — the subtitles response per episode id
 * GitHub Pages (source: main /docs) serves these with CORS, so users install
 *   https://onepace-hebrew.github.io/stremio-addon/manifest.json
 * and never download or run anything. Regenerated from mapping.json on every push.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'mapping.json'), 'utf8'));

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.1',
  name: 'One Pace Hebrew Subtitles',
  description:
    'Hebrew subtitles for One Pace — the fan-made recut of One Piece. Pick the Hebrew ' +
    'track and watch. AI-generated; may contain errors.',
  logo: 'https://onepace-hebrew.github.io/stremio-addon/icon.png',
  resources: ['subtitles'],
  types: ['series'],
  catalogs: [],
  behaviorHints: { configurable: false },
};

// Reset docs/ subtitle output (keep index.html if present is fine — we rewrite it).
fs.rmSync(path.join(DOCS, 'subtitles'), { recursive: true, force: true });
fs.mkdirSync(path.join(DOCS, 'subtitles', 'series'), { recursive: true });

// .nojekyll: stop GitHub Pages' Jekyll from touching our files/paths.
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

fs.writeFileSync(path.join(DOCS, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

const ids = Object.keys(mapping).sort();
for (const id of ids) {
  const e = mapping[id];
  const subtitles = [];
  if (e.srt) subtitles.push({ id: `${id}-he-srt`, url: e.srt, lang: 'heb' });
  if (e.ass) subtitles.push({ id: `${id}-he-ass`, url: e.ass, lang: 'heb' });
  fs.writeFileSync(
    path.join(DOCS, 'subtitles', 'series', `${id}.json`),
    JSON.stringify({ subtitles, cacheMaxAge: 86400 }, null, 2) + '\n',
  );
}

const MANIFEST_URL = 'https://onepace-hebrew.github.io/stremio-addon/manifest.json';
const STREMIO_DEEPLINK = 'stremio://onepace-hebrew.github.io/stremio-addon/manifest.json';

fs.writeFileSync(
  path.join(DOCS, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>One Pace Hebrew Subtitles — Stremio addon</title>
  <meta name="description" content="Hebrew subtitles for One Pace — the fan-made recut of One Piece. Install as a Stremio addon." />
  <style>
    :root {
      --ink: #10243e;
      --sea: #0e4d92;
      --sea-deep: #08305c;
      --gold: #f4b41a;
      --paper: #fbf6ea;
      --card: #ffffff;
      --muted: #5b6b7d;
      --line: #e4dccb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: var(--ink);
      background:
        radial-gradient(1200px 500px at 50% -200px, #1a6fc4 0%, var(--sea) 45%, var(--sea-deep) 100%) no-repeat,
        var(--paper);
      line-height: 1.6;
    }
    .wrap { max-width: 720px; margin: 0 auto; padding: 0 1.1rem 3rem; }
    header {
      text-align: center;
      color: #fff;
      padding: 2.6rem 1rem 2.2rem;
    }
    header .logo {
      width: 104px; height: 104px;
      object-fit: contain;
      margin: 0 auto .6rem;
      display: block;
      filter: drop-shadow(0 6px 14px rgba(0,0,0,.35));
    }
    header .flag { font-size: 3rem; line-height: 1; display: block; margin-bottom: .4rem; }
    header h1 { font-size: 1.9rem; margin: .2rem 0 .35rem; letter-spacing: .2px; }
    header .tag { margin: 0 auto; max-width: 34rem; opacity: .95; }
    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 1.4rem 1.3rem;
      margin: 1.1rem 0;
      box-shadow: 0 10px 30px rgba(8, 48, 92, .12);
    }
    .card h2 { margin: 0 0 .7rem; font-size: 1.25rem; }
    .warn {
      background: #fff7e0;
      border: 1px solid var(--gold);
      border-radius: 14px;
      padding: .85rem 1.1rem;
      margin: 1.1rem 0;
      font-weight: 600;
      color: #7a5800;
    }
    .urlbox {
      display: flex; gap: .5rem; flex-wrap: wrap; align-items: center;
      margin: .6rem 0 1rem;
    }
    code.url {
      flex: 1 1 240px;
      background: #f3f0e7;
      border: 1px dashed #c9bfa6;
      border-radius: 10px;
      padding: .7em .8em;
      font-size: .92rem;
      word-break: break-all;
      user-select: all;
    }
    button.copy, a.btn {
      cursor: pointer;
      border: none;
      border-radius: 10px;
      padding: .72em 1.1em;
      font-size: .95rem;
      font-weight: 700;
      text-decoration: none;
      display: inline-block;
      white-space: nowrap;
    }
    button.copy { background: #e9eef4; color: var(--sea-deep); }
    a.btn {
      background: var(--gold);
      color: #3a2c00;
      box-shadow: 0 6px 16px rgba(244, 180, 26, .4);
    }
    a.btn:hover { filter: brightness(1.04); }
    ol { margin: .4rem 0 0; padding-inline-start: 1.3rem; }
    ol li { margin: .35rem 0; }
    .muted { color: var(--muted); font-size: .95rem; }
    a { color: var(--sea); }
    .credits { font-size: .95rem; }
    hr.sep { border: none; border-top: 1px solid var(--line); margin: 1.6rem 0; }
    [dir="rtl"] { text-align: right; }
    [dir="rtl"] ol { padding-inline-start: 0; padding-inline-end: 1.3rem; }
    [dir="rtl"] .urlbox { flex-direction: row-reverse; }
    footer { text-align: center; color: rgba(255,255,255,.85); padding: 1.4rem 1rem 0; font-size: .9rem; }
  </style>
</head>
<body>
  <header>
    <img class="logo" src="icon.png" alt="One Pace Hebrew logo"
         onerror="this.style.display='none'; document.getElementById('flag-fallback').style.display='block';" />
    <span class="flag" id="flag-fallback" style="display:none">🏴‍☠️</span>
    <h1>One Pace Hebrew Subtitles</h1>
    <p class="tag">Hebrew subtitles for One Pace — the fan-made recut of One Piece — as a Stremio addon.</p>
  </header>

  <main class="wrap">
    <!-- English -->
    <div class="warn">⚠️ These Hebrew subtitles are AI-generated and may contain errors.</div>

    <section class="card">
      <h2>Install</h2>
      <p>Copy this URL into Stremio → <strong>Add-ons</strong> → <strong>"Add-on Repository URL"</strong>:</p>
      <div class="urlbox">
        <code class="url" id="url-en">${MANIFEST_URL}</code>
        <button class="copy" type="button" data-copy="${MANIFEST_URL}">Copy</button>
      </div>
      <p><a class="btn" href="${STREMIO_DEEPLINK}">➕ Install in Stremio</a></p>
      <ol>
        <li>Add the URL above in Stremio.</li>
        <li>Play a One Pace episode (you need the One Pace stream addon installed).</li>
        <li>Pick the <strong>Hebrew</strong> subtitle track.</li>
      </ol>
      <p class="muted">The plain track works in Stremio's player; for fancier styling use <a href="https://mpv.io/">mpv</a>.</p>
    </section>

    <p class="credits">Based on the English subtitles from the
      <a href="https://onepace.net">One Pace project</a>. Hebrew translation by <strong>That One Gerbil</strong>.</p>

    <hr class="sep" />

    <!-- Hebrew -->
    <div dir="rtl" lang="he">
      <div class="warn">⚠️ הכתוביות בעברית נוצרו על־ידי בינה מלאכותית ועלולות להכיל טעויות.</div>

      <section class="card">
        <h2>התקנה</h2>
        <p>העתיקו את הכתובת הזו והדביקו אותה בתוסף <bdi>Stremio</bdi>:</p>
        <div class="urlbox">
          <code class="url" id="url-he">${MANIFEST_URL}</code>
          <button class="copy" type="button" data-copy="${MANIFEST_URL}">העתקה</button>
        </div>
        <p><a class="btn" href="${STREMIO_DEEPLINK}">➕ התקנה ב־<bdi>Stremio</bdi></a></p>
        <ol>
          <li>פתחו את <bdi>Stremio</bdi>, ואז עברו אל מסך התוספים <bdi>Add-ons</bdi>.</li>
          <li>הדביקו את הכתובת שלמעלה בתיבה <bdi>"Add-on Repository URL"</bdi> ולחצו על <bdi>Install</bdi> (התקנה).</li>
          <li>הפעילו פרק של <bdi>One Pace</bdi> (צריך שיהיה מותקן תוסף הסטרימינג של <bdi>One Pace</bdi>).</li>
          <li>בחרו ב<strong>כתוביות בעברית</strong>.</li>
        </ol>
        <p class="muted">הכתוביות הרגילות עובדות בנגן של <bdi>Stremio</bdi>; לעיצוב מושקע יותר השתמשו ב־<a href="https://mpv.io/"><bdi>mpv</bdi></a>.</p>
      </section>

      <p class="credits">מבוסס על הכתוביות באנגלית של
        <a href="https://onepace.net">פרויקט <bdi>One Pace</bdi></a>. תרגום לעברית: <strong>That One Gerbil</strong>.</p>
    </div>
  </main>

  <footer>🏴‍☠️ One Pace Hebrew</footer>

  <script>
    document.querySelectorAll('button.copy').forEach(function (b) {
      b.addEventListener('click', function () {
        var text = b.getAttribute('data-copy');
        var done = function () { var t = b.textContent; b.textContent = '✓'; setTimeout(function () { b.textContent = t; }, 1200); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else { done(); }
      });
    });
  </script>
</body>
</html>
`,
);

console.log(`build-static: wrote docs/manifest.json + ${ids.length} subtitle responses (${ids.join(', ')})`);
