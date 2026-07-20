#!/usr/bin/env node
// scripts/check-new-chapter.mjs
//
// Run on a schedule (see .github/workflows/check-new-chapter.yml). Calls
// the Claude API with web search enabled, under strict source rules, to
// check whether a new official One Piece chapter has been confirmed
// since the last check — and if so, proposes a structured diff against
// this repo's schema. It never writes directly to the data files: it
// writes a draft to draft-updates/ and the workflow opens a PR, so a
// human always reviews before anything merges.
//
// Requires an ANTHROPIC_API_KEY environment variable (set as a repo
// secret in GitHub Actions — never commit a real key to this file).

import { writeFile, mkdir, readFile } from 'node:fs/promises';

const STATE_FILE = 'scripts/.chapter-check-state.json';

async function readState(){
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf-8'));
  } catch {
    return { lastDraftedChapter: 0 };
  }
}

async function writeState(state){
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set. Add it as a GitHub Actions secret.');
  process.exit(1);
}

const SYSTEM_PROMPT = `
You are a fact-checking assistant for a fan-made One Piece data project.
Your ONLY job this run: determine whether a new, OFFICIALLY RELEASED
chapter of the One Piece manga exists that this project doesn't yet
account for, using ONLY sources that meet the bar below.

SOURCES YOU MAY TREAT AS CONFIRMATION:
- Viz Media's official website or app (viz.com)
- MangaPlus / Shueisha's official app or site
- Shonen Jump's official social media accounts
- Established licensed news outlets reporting on an ALREADY-PUBLISHED
  official chapter (e.g. Anime News Network, Crunchyroll News) — only
  when they cite the official release, not a leak.

SOURCES YOU MUST NEVER TREAT AS CONFIRMATION, EVEN IF THEY SEEM CREDIBLE
OR HAVE A HISTORY OF ACCURACY:
- Any account or site whose content is a "leak," "raw," or "spoiler"
  posted before or without an official release. This fandom specifically
  has a known problem with troll accounts posting fabricated, convincing
  fake leaks — treat ALL leak-tier sources as untrustworthy regardless of
  follower count, "verified" badges, or past track record.
- Fan wikis' "upcoming" or "rumored" sections.
- Any single source acting alone. Require at least two independent
  sources that meet the bar above before concluding a chapter is
  officially confirmed.

RULES FOR YOUR OUTPUT:
- If you cannot confirm a new officially-released chapter from at least
  two qualifying sources, output exactly: NO_UPDATE
- If confirmed, output ONLY a JSON object (no prose, no markdown fences)
  with this shape:
  {
    "chapterNumber": number,
    "confirmedBy": [ "source name — one line why it qualifies", ... ],
    "newLocations": [ { "name": string, "note": "one factual sentence, your own words" } ],
    "newCharacters": [ { "name": string, "affiliation": string, "note": "one factual sentence, your own words" } ],
    "crewChanges": [ "one factual sentence describing a status change, your own words" ]
  }
- Every string you write must be your own original wording describing a
  fact — never a copied sentence, and never manga dialogue or narration.
- If there is genuinely nothing new, NO_UPDATE is the correct and
  expected result most weeks. Do not invent content to have something
  to report.
`.trim();

async function main(){
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: 'Check for a new officially-released One Piece chapter since last week, following the source rules exactly. Today\'s date context should come from your search results, not assumption.',
      }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });

  if (!response.ok) {
    console.error(`API request failed: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const data = await response.json();
  const text = data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n')
    .trim();

  if (text === 'NO_UPDATE' || !text.startsWith('{')) {
    console.log('No confirmed update this run. Nothing to draft.');
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.log('Model did not return valid JSON — treating as no confirmed update.');
    console.log('Raw output for review:', text);
    return;
  }

  const state = await readState();
  if (parsed.chapterNumber <= state.lastDraftedChapter) {
    console.log(`Chapter ${parsed.chapterNumber} was already drafted in a previous run (last: ${state.lastDraftedChapter}). Skipping to avoid a duplicate PR.`);
    return;
  }

  await mkdir('draft-updates', { recursive: true });
  const filename = `draft-updates/chapter-${parsed.chapterNumber}.json`;
  await writeFile(filename, JSON.stringify(parsed, null, 2), 'utf-8');
  await writeState({ lastDraftedChapter: parsed.chapterNumber });
  console.log(`Draft written to ${filename}. Review it, then merge facts into the schema files by hand or ask Claude Code to do it following CLAUDE.md.`);
}

main().catch(err => {
  console.error('Check failed:', err.message);
  process.exit(1);
});
