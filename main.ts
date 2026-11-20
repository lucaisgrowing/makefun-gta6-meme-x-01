// GTA 6 meme entry — make.fun gta6-meme-x-01.
// The entry is the X post itself: a GTA 6 meme (gta6-meme.jpg, generated for
// this entry) posted from @0xm0reyu with make.fun written out, @makefunai,
// and the play code in its text. POST.json (next to this file) names the post; this program copies it
// to the grader's output directory, where the gate reads the post from X
// (its first picture and its text) and hands that to the judge.
// Locally, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
const src = join(BOT_DIR, 'POST.json');
const dest = join(OUTPUT_DIR, 'POST.json');

let entry: { url?: string };
try {
  entry = JSON.parse(readFileSync(src, 'utf8')) as { url?: string };
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (!entry.url || !/^https:\/\/x\.com\/\w+\/status\/\d+$/.test(entry.url)) {
  console.error(`POST.json holds no real post URL: ${JSON.stringify(entry)}`);
  process.exit(1);
}

copyFileSync(src, dest);
const digest = createHash('sha256').update(readFileSync(dest)).digest('hex').slice(0, 12);
console.log(`POST.json -> ${dest} (${entry.url}, sha256 ${digest})`);
