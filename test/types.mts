import {getEmojiUrl,findEmoji,tokenize,type UrlOptions} from '../dist/index.js';
const options:UrlOptions={format:'webp',size:256};const url:string|null=getEmojiUrl('🤠',options);
const name:string|undefined=findEmoji('🤠')?.name;
for(const token of tokenize('Привет 🤠')){if(token.type==='emoji'){const unified:string=token.emoji.unified;void unified;}}
// @ts-expect-error PNG 512 is intentionally not included in the package.
getEmojiUrl('🤠',{format:'png',size:512});
void url;void name;
