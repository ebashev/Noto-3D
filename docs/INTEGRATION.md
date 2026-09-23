# Интеграция в клиент

Во всех примерах имя `emoji-datasource-noto3d` заменяется на реально опубликованное имя.

## API

| Функция | Результат |
|---|---|
| `findEmoji('🤠')` | Запись каталога или `undefined` |
| `findEmoji('1F920')`, `findEmoji('1f920')` | Поиск по code points; `_` тоже допустим |
| `findEmoji(':grinning:')` | Поиск по short name |
| `getEmojiPath('🤠')` | `img/noto3d/webp/128/1f920.webp` или `null` |
| `getEmojiUrl('🤠')` | Версионированный jsDelivr URL |
| `getEmojiUrl('🤠', {cdn:'unpkg'})` | UNPKG URL |
| `getEmojiUrl('🤠', {baseUrl:'/emoji/'})` | URL своих статических файлов |
| `getGoogleUrl('🤠',512)` | Оригинальный PNG на официальном CDN Google |
| `searchEmojis('cowboy',{limit:20})` | Массив результатов; имена/shortcodes английские |
| `tokenize('Привет 🤠')` | Текстовые и emoji-токены с исходным текстом |

Допустимые локальные форматы: `{format:'png',size:64}`, `{format:'webp',size:128}`, `{format:'webp',size:256}`. По умолчанию WebP 128. Неизвестный эмодзи возвращает `null`/`undefined`; неверный формат или неприкреплённая версия CDN вызывает исключение.

`getEmojiUrl` поддерживает `version:'1.0.1'`; `latest` намеренно запрещён. Если нужна смена CDN при отказе, обработайте `onerror` в компоненте; API сам сетевых запросов не делает.

## React: отображение текста

```jsx
import {tokenize,getEmojiUrl} from 'emoji-datasource-noto3d';

export function EmojiText({text}) {
  return <span>{tokenize(text).map((part,i)=>
    part.type==='text' ? part.text :
      <img key={i} src={getEmojiUrl(part.text)} alt={part.text}
        className="inline-emoji" loading="lazy" decoding="async" />
  )}</span>;
}
```

```css
.inline-emoji { width:1.25em; height:1.25em; vertical-align:-.25em; object-fit:contain; }
```

Для production добавьте обработку ошибки изображения: заменяйте его `document.createTextNode(img.alt)` или переключайте состояние React на текст. Не присваивайте пользовательский текст `innerHTML`. `alt` нужен для доступности; точное поведение копирования картинки из браузера зависит от редактора. Модель сообщения должна хранить исходный Unicode, а не HTML с изображениями.

## CDN или свой сервер

**CDN:** страницу можно подключить без npm. Укажите точные URL картинок; каталог загрузите отдельно, если нужен поиск/выбор. Не скачивайте/декодируйте все изображения при запуске приложения. Для большого picker используйте виртуализацию списка, lazy loading и кэш по полному URL с версией.

**npm в сборщике:** npm install скачает весь пакет на машину разработчика. Обычный импорт JS не заставляет автоматически включить `img/` в browser bundle. Для офлайна/своего сервера скопируйте каталог `img` из `node_modules/emoji-datasource-noto3d` в `public/emoji-assets/img` средствами вашей сборки и передайте `{baseUrl:'/emoji-assets'}`. Не копируйте только basename без структуры каталогов.

**Собственный CDN:** отдавайте корректные `image/png` / `image/webp`, используйте версионированный префикс и `Cache-Control: public,max-age=31536000,immutable` только для неизменяемых версий. CORS нужен для программного fetch/canvas между origin, а не для простого `<img>`.

**Нативный клиент:** JSON + обычный загрузчик изображений с дисковым/оперативным кэшем. JavaScript API необязателен. Храните Unicode в постах и меняйте renderer по пользовательской настройке.

## Составные эмодзи

Нельзя перебирать строку обычным `split('')` или посимвольным `[...text]` для замены всех эмодзи: семейства, флаги, ZWJ и оттенки кожи состоят из нескольких code points. `tokenize` использует `Intl.Segmenter` с `granularity:'grapheme'` и сопоставляет целую последовательность с каталогом. Для старых сред нужен grapheme polyfill. Явная текстовая форма с FE0E остаётся текстом.

## Подключение к существующей emoji-библиотеке

Если picker отдаёт `unified`, например `1f44d-1f3fd`, передайте его в `getEmojiUrl`. Если библиотека поддерживает callback для источника изображений, подключите эту функцию в callback в соответствии с API её конкретной версии. Имена prop у разных библиотек отличаются: универсального `emojiStyle='noto3d'` нет.

`emoji-datasource.json` использует base rows + `skin_variations`; `emoji.json` плоский. Здесь нет spritesheets, поэтому не используйте координаты листа от `emoji-datasource-apple`. Если нужен spritesheet, его нужно отдельно генерировать и отдать picker собственные координаты.

## Локальный пример

`npm run preview` → http://127.0.0.1:8080/ . Галерея использует только подготовленные локальные файлы, поиск и проверку вывода составных эмодзи; сетевые CDN для этого не нужны. Страница предназначена для просмотра через HTTP, не через `file://`.
