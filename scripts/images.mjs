import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT, FORMATS, catalog, sha256, toUnified, imagePath, write, writeJson, pool } from './common.mjs';
const source = path.resolve(process.argv[2] || path.join(ROOT, '.cache/originals'));
const rows = await catalog(); let finished = 0;
sharp.concurrency(1);
const results = await pool(rows, 4, async row => {
  const input = await readFile(path.join(source, row.rgi + '.png'));
  if (input.length !== row.bytes || sha256(input) !== row.sha256) throw new Error(`Source checksum mismatch: ${row.rgi}`);
  const records = [];
  for (const {format, size} of FORMATS) {
    const file = imagePath(toUnified(row.rgi), format, size);
    const pipeline = sharp(input).resize(size, size, {fit:'fill', kernel:'lanczos3'});
    const bytes = await (format === 'png' ? pipeline.png({compressionLevel:9}) : pipeline.webp({quality:85, alphaQuality:100, effort:4})).toBuffer();
    await write(file, bytes); records.push({file,format,size,bytes:bytes.length,sha256:sha256(bytes)});
  }
  if (++finished % 250 === 0) console.log(`Images: ${finished}/${rows.length}`);
  return {rgi:row.rgi, assets:records};
});
await writeJson('data/assets-lock.json', {sharp:sharp.versions.sharp, vips:sharp.versions.vips, policy:{png64:'RGBA, Lanczos3, compression=9',webp:'lossy q85, alphaQuality=100, effort=4'}, images:results});
console.log('Built all 11,964 images. Run npm run build.');
