import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const FORMATS = [{ format: 'png', size: 64 }, { format: 'webp', size: 128 }, { format: 'webp', size: 256 }];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const readJson = async name => JSON.parse(await readFile(path.join(ROOT, name), 'utf8'));
export async function write(name, value) {
  const dest = path.join(ROOT, name); await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, value);
}
export const writeJson = (name, value) => write(name, JSON.stringify(value) + '\n');
// CSV state machine: quoted commas, escaped quotes, BOM and CRLF are supported.
export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  return rows.map(r => { if (r.length !== headers.length) throw new Error('CSV column mismatch'); return Object.fromEntries(headers.map((h,i)=>[h,r[i]])); });
}
export async function catalog() {
  const rows = parseCsv(await readFile(path.join(ROOT, 'data/source-catalog.csv'), 'utf8'));
  if (rows.length !== 3988 || new Set(rows.map(r => r.rgi)).size !== 3988) throw new Error('Expected 3988 unique source records');
  for (const r of rows) {
    if (!/^[a-f0-9]{4,6}(?:_[a-f0-9]{4,6})*$/.test(r.rgi) || !/^[a-f0-9]{64}$/.test(r.sha256)) throw new Error('Invalid source record');
    r.bytes = Number(r.bytes); r.width = Number(r.width); r.height = Number(r.height);
  }
  return rows;
}
export const toUnified = rgi => rgi.replaceAll('_', '-').toUpperCase();
export const imagePath = (unified, format, size) => `img/${format}${size}/${unified.toLowerCase()}.${format}`;
export async function pool(items, concurrency, fn) {
  let cursor = 0; const results = new Array(items.length);
  await Promise.all(Array.from({ length: concurrency }, async () => { while (cursor < items.length) { const i = cursor++; results[i] = await fn(items[i], i); } }));
  return results;
}
