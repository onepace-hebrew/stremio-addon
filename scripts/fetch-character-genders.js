#!/usr/bin/env node
'use strict';

/**
 * fetch-character-genders.js
 *
 * Scrapes the One Piece Fandom wiki's gender CATEGORIES into a flat
 * English-name -> gender map: docs/character-genders.json. The wiki categorizes
 * (almost) every named character under "Category:Male Characters" or
 * "Category:Female Characters", so this is a clean, complete gender source.
 *
 * This cache is the gender ORACLE for the gender/number QA pass: when a name
 * appears in an episode's English source, look it up here. The curated
 * docs/characters.json (Hebrew spelling + gender + aliases) remains the source
 * of truth for the lint and for canonical Hebrew spellings; this just lets the
 * QA pass resolve ANY English name without hand-adding it first.
 *
 * Re-run to refresh:  node scripts/fetch-character-genders.js
 */

const fs = require('fs');
const path = require('path');

const API = 'https://onepiece.fandom.com/api.php';
const OUT = path.join(__dirname, '..', 'docs', 'character-genders.json');

async function categoryMembers(category) {
  const names = [];
  let cmcontinue;
  do {
    const u = new URL(API);
    u.search = new URLSearchParams({
      action: 'query', list: 'categorymembers', cmtitle: `Category:${category}`,
      cmlimit: '500', cmtype: 'page', format: 'json', ...(cmcontinue ? { cmcontinue } : {}),
    }).toString();
    const res = await fetch(u, { headers: { 'User-Agent': 'onepace-hebrew-subs/1.0 (gender registry build)' } });
    if (!res.ok) throw new Error(`${category}: HTTP ${res.status}`);
    const j = await res.json();
    for (const m of j.query.categorymembers || []) names.push(m.title);
    cmcontinue = j.continue && j.continue.cmcontinue;
    process.stdout.write(`\r${category}: ${names.length}`);
  } while (cmcontinue);
  process.stdout.write('\n');
  return names;
}

(async () => {
  const female = await categoryMembers('Female_Characters');
  const male = await categoryMembers('Male_Characters');

  const map = {};
  const conflicts = [];
  for (const n of female) map[n] = 'f';
  for (const n of male) {
    if (map[n] === 'f') { conflicts.push(n); continue; } // keep first (rare; manual review)
    map[n] = 'm';
  }

  const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
  const out = {
    _doc: 'English character name -> gender (m|f), scraped from the One Piece Fandom wiki gender categories. Gender ORACLE for the gender/number QA pass. Curated Hebrew spellings live in characters.json. Rebuild: node scripts/fetch-character-genders.js',
    _counts: { total: Object.keys(sorted).length, female: female.length, male: male.length, conflicts: conflicts.length },
    genders: sorted,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 0).replace(/,"/g, ',\n"') + '\n');
  console.log(`wrote ${Object.keys(sorted).length} names (F:${female.length} M:${male.length}, conflicts:${conflicts.length})`);
  if (conflicts.length) console.log('conflicts (in both categories, kept female):', conflicts.slice(0, 20).join(', '));
})();
