const codeIndex = new Map(), aliasIndex = new Map(), characterIndex = new Map();
const stripPresentation = code => code.split('-').filter(p => p !== 'FE0F').join('-');
for (const e of emojis) {
  codeIndex.set(e.unified, e);
  if (!codeIndex.has(stripPresentation(e.unified))) codeIndex.set(stripPresentation(e.unified), e);
  characterIndex.set(e.emoji, e);
  const noVS=e.emoji.replaceAll('\uFE0F',''); if(!characterIndex.has(noVS)) characterIndex.set(noVS,e);
  if(!e.skin_tones.length)for(const name of e.short_names)if(!aliasIndex.has(name))aliasIndex.set(name,e);
}
function normalizeCode(input) {
  const candidate=input.replace(/^emoji_u/i,'').replace(/^U\+/i,'').replaceAll('_','-').toUpperCase();
  if(!/^[0-9A-F]{1,6}(?:-[0-9A-F]{1,6})*$/.test(candidate))return null;
  return candidate.split('-').map(x=>x.padStart(4,'0')).join('-');
}
function findEmoji(input) {
  if(typeof input!=='string')return undefined;
  if(characterIndex.has(input))return characterIndex.get(input);
  if(input.includes('\uFE0E'))return undefined;
  const noVS=input.replaceAll('\uFE0F','');
  if(characterIndex.has(noVS))return characterIndex.get(noVS);
  const code=normalizeCode(input);
  if(code){const match=codeIndex.get(code)||codeIndex.get(stripPresentation(code));if(match)return match;}
  return aliasIndex.get(input.replace(/^:|:$/g,''));
}
function getEmojiPath(input, options={}) {
  const e=findEmoji(input);if(!e)return null;
  const format=options.format??'webp',size=options.size??(format==='png'?64:128);
  if(!((format==='png'&&size===64)||(format==='webp'&&(size===128||size===256))))throw new RangeError('Supported: PNG 64, WebP 128 or 256');
  return `img/noto3d/${format}/${size}/${e.image.replace(/\.png$/,'.'+format)}`;
}
function getEmojiUrl(input, options={}) {
  const file=getEmojiPath(input,options);if(!file)return null;
  if(options.baseUrl!==undefined)return String(options.baseUrl).replace(/\/$/,'')+'/'+file;
  const version=options.version??VERSION;
  if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version))throw new TypeError('Use an exact semver version, not latest');
  const provider=options.cdn??'jsdelivr';
  if(!['jsdelivr','unpkg'].includes(provider))throw new RangeError('Unknown CDN');
  return (provider==='unpkg'?'https://unpkg.com/':'https://cdn.jsdelivr.net/npm/')+PACKAGE_NAME+'@'+version+'/'+file;
}
function getGoogleUrl(input, size=512) {
  const e=findEmoji(input);if(!e)return null;
  if(![128,512].includes(size))throw new RangeError('Google PNG size must be 128 or 512');
  return `https://fonts.gstatic.com/s/e/noto3demoji/latest/${e.rgi}/${size}.png`;
}
function searchEmojis(query,{limit=50,category}={}) {
  if(!Number.isInteger(limit)||limit<0)throw new RangeError('limit must be a nonnegative integer');
  const q=String(query).toLowerCase().trim();
  return emojis.filter(e=>(!category||e.category===category)&&(!q||[e.name,e.cldr_name,e.emoji,e.unified,...e.short_names].join(' ').toLowerCase().includes(q))).slice(0,limit);
}
let segmenter;
function tokenize(text) {
  if(typeof Intl.Segmenter!=='function')throw new Error('Intl.Segmenter is required; supply a grapheme polyfill for older runtimes.');
  segmenter??=new Intl.Segmenter(undefined,{granularity:'grapheme'});
  const tokens=[];
  for(const {segment} of segmenter.segment(String(text))) {
    const emoji=segment.includes('\uFE0E')?undefined:(characterIndex.get(segment)||characterIndex.get(segment.replaceAll('\uFE0F','')));
    if(emoji)tokens.push({type:'emoji',text:segment,emoji});
    else if(tokens.at(-1)?.type==='text')tokens[tokens.length-1].text+=segment;
    else tokens.push({type:'text',text:segment});
  }
  return tokens;
}
const api={emojis,VERSION,PACKAGE_NAME,findEmoji,getEmojiPath,getEmojiUrl,getGoogleUrl,searchEmojis,tokenize};
