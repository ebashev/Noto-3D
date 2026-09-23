import test from 'node:test';import assert from 'node:assert/strict';import {parseCsv} from '../scripts/common.mjs';
test('CSV import preserves quoted names and Unicode',()=>{
 const records=parseCsv('\uFEFFemoji,name,note\r\n🤠,"cowboy, face","quote ""yes"""\r\n');
 assert.deepEqual(records,[{emoji:'🤠',name:'cowboy, face',note:'quote "yes"'}]);
 assert.throws(()=>parseCsv('a,b\n"unfinished'));
});
