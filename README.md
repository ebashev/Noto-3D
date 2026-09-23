# Noto 3D

Неофициальный набор **3 988 Noto 3D Emoji** для приложений: изображения, метаданные и небольшой JavaScript API. Автор графики — Google. Упаковка и интеграция — ebaweff.

Репозиторий: https://github.com/ebashev/Noto-3D

> Это подготовленный к публикации проект. Наличие этих файлов не означает, что пакет уже опубликован на npm. Примеры используют имя `emoji-datasource-noto3d`; если выберете другое имя, замените его в командах и URL. Условия лицензирования графики описаны в [LICENSE.md](LICENSE.md): у upstream есть противоречащие друг другу указания.

## Что внутри

| Содержимое | Назначение |
|---|---|
| `img/noto3d/png/64/` | 3 988 PNG, прозрачность, интерфейсы и совместимость |
| `img/noto3d/webp/128/` | 3 988 WebP, основной вариант для интерфейса |
| `img/noto3d/webp/256/` | 3 988 WebP для крупных реакций и превью |
| `emoji.json` | Плоский каталог всех 3 988 изображений, включая варианты |
| `emoji-datasource.json` | Каталог с вложенными `skin_variations`, похожий на emoji-data |
| `dist/` | Готовые ESM, CommonJS и TypeScript declarations |
| `data/source-catalog.csv` | Исходный CSV: имена, Unicode, URL, размер и SHA-256 |
| `manifest.json` | Перечень всех выходных изображений с размером и SHA-256 |

WebP имеет сжатие с потерями, quality=85; альфа сохраняется с alphaQuality=100. PNG 64 уменьшены из исходных 512 px. Исходники 512 px не включены в npm: они занимают примерно 570 МБ. Для них есть проверяемое восстановление из первоначальных архивов или CDN. Генерация 128/256 px из уменьшенных 64 px **не используется**.

**npm не является CDN.** Пакет хранит файлы в реестре; jsDelivr и UNPKG выдают отдельные файлы из опубликованной версии по HTTP. Веб-страница с `<img>` скачивает запрошенные изображения, а не все 3 988. `npm install`, напротив, скачивает весь npm tarball на машину разработчика.

## Установка в приложение после публикации

```sh
npm install emoji-datasource-noto3d
```

```js
import { findEmoji, getEmojiUrl, tokenize } from 'emoji-datasource-noto3d';

findEmoji('🤠');
getEmojiUrl('🤠'); // jsDelivr, точная версия пакета, WebP 128
getEmojiUrl('1F920', { format: 'png', size: 64 });
getEmojiUrl('👍🏽', { size: 256, cdn: 'unpkg' });
const tokens = tokenize('Привет 🤠!');
```

CommonJS: `const { getEmojiUrl } = require('emoji-datasource-noto3d');`.
Полный список: `import emojis from 'emoji-datasource-noto3d/emoji.json' with { type: 'json' };` (Node.js); способ импорта JSON в приложении зависит от сборщика.

Обычный HTML, без установки npm (URL начнёт работать **после публикации**):

```html
<img
  src="https://cdn.jsdelivr.net/npm/emoji-datasource-noto3d@1.0.0/img/noto3d/webp/128/1f920.webp"
  alt="🤠" width="32" height="32" loading="lazy" decoding="async"
>
```

У каждого варианта есть собственное имя файла. Например, последовательности разделены дефисами: `1f44d-1f3fd.webp`. Все буквы в именах файлов — строчные; селекторы FE0F сохраняются в канонических путях.

## Быстрый старт разработчика этого проекта

Нужны Node.js **22.14+** (рекомендуется 24), npm и Git. Изображения и `dist` уже подготовлены.

```sh
npm ci
npm run check
npm pack
npm run preview
```

Последняя команда открывает локальный сервер: http://127.0.0.1:8080/ . Откройте адрес в браузере; для остановки — Ctrl+C.

`npm run build` пересобирает каталоги и JS из CSV и сохранённых метаданных. Он не требует Python, компилятора C++, Google Drive, сетевого доступа или повторной загрузки графики. `npm ci` загружает инструменты разработки; `sharp` используется только для повторного изготовления изображений. У установленного потребительского пакета нет runtime-зависимостей и install-скриптов.

## Документация

- [INSTALL_BUILD_PUBLISH.md](docs/INSTALL_BUILD_PUBLISH.md) — установка инструментов, компиляция, GitHub, npm и обновления.
- [INTEGRATION.md](docs/INTEGRATION.md) — API, свой сервер, React, Unicode, lazy loading и кэш.
- [DATA.md](docs/DATA.md) — CSV, метаданные, совместимость с emoji-data.
- [LICENSE.md](LICENSE.md), [NOTICE.md](NOTICE.md) — авторство, лицензии и точные источники.

## Границы совместимости

Это не автоматическая замена `emoji-datasource-apple` для любой библиотеки. Здесь нет Apple-графики и spritesheets. `emoji-datasource.json` сохраняет полезную схему отдельных изображений и вариантов, но намеренно не содержит чужих `sheet_x`, `sheet_y` и vendor-флагов. Библиотека с настройкой `getEmojiUrl`/renderer обычно требует небольшого адаптера; библиотеке, жёстко привязанной к Apple-spritesheet, понадобится доработка.

## Источники

- [Галерея Noto](https://googlefonts.github.io/noto-emoji-files/), снимок изображений 21.09.2026.
- [Google Noto Emoji](https://github.com/googlefonts/noto-emoji), проверенный commit указан в `data/provenance.json`.
- [iamcal/emoji-data](https://github.com/iamcal/emoji-data) — дополнительные short names и группировка skin variations; лицензия метаданных MIT приложена.
- [jsDelivr](https://github.com/jsdelivr/jsdelivr#usage-documentation), [UNPKG](https://unpkg.com/).
