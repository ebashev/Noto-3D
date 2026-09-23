# Noto 3D

3 988 эмодзи Google Noto 3D для приложений: прозрачные PNG и WebP, Unicode-каталог и JavaScript API без runtime-зависимостей.

Неофициальный проект сообщества. Автор изображений - Google.

## Изображения

| Каталог | Размер | Файлов |
| --- | --- | ---: |
| [`img/png64`](img/png64) | PNG 64 × 64 | 3 988 |
| [`img/webp128`](img/webp128) | WebP 128 × 128 | 3 988 |
| [`img/webp256`](img/webp256) | WebP 256 × 256 | 3 988 |

Имя файла - Unicode-код в нижнем регистре, с дефисами между code points. Например, `1f920.webp` для 🤠 и `1f44d-1f3fd.webp` для 👍🏽. PNG уменьшены из оригиналов 512 px. WebP использует quality 85 и сохраняет прозрачность.

Все изображения доступны через **Code → Download ZIP** или `git clone`. GitHub показывает не более 1 000 файлов в списке большого каталога; остальные доступны по прямому пути и входят в полную загрузку.

## Использование без npm

Скопируйте нужные каталоги `img/` в статические файлы приложения:

```html
<img src="/img/webp128/1f920.webp" alt="🤠" width="32" height="32"
     loading="lazy" decoding="async">
```

Для публичного репозитория jsDelivr поддерживает отдельные файлы по commit SHA:

```text
https://cdn.jsdelivr.net/gh/ebashev/Noto-3D@COMMIT_SHA/img/webp128/1f920.webp
```

Замените `COMMIT_SHA` на SHA выбранного коммита. Такой URL фиксирует версию изображения. Приватные репозитории недоступны через публичный CDN.

## Установка пакета

Из исходников репозитория:

```sh
git clone https://github.com/ebashev/Noto-3D.git
cd Noto-3D
npm ci
npm run check
npm pack
```

В приложении установите получившийся архив:

```sh
npm install /path/to/emoji-datasource-noto3d-1.1.0.tgz
```

Имя пакета в этом проекте - `emoji-datasource-noto3d`. Установка командой `npm install emoji-datasource-noto3d` и npm CDN URL доступны после публикации пакета в реестре npm. Если владелец выберет scope, используйте опубликованное имя вида `@username/emoji-datasource-noto3d`.

## JavaScript API

```js
import { findEmoji, getEmojiPath, getEmojiUrl, searchEmojis, tokenize }
  from 'emoji-datasource-noto3d';

findEmoji('🤠');
findEmoji('1F44D-1F3FD');
findEmoji(':grinning:');

getEmojiPath('🤠'); // img/webp128/1f920.webp
getEmojiPath('🤠', { format: 'png', size: 64 }); // img/png64/1f920.png
getEmojiUrl('🤠', { baseUrl: '/assets' }); // /assets/img/webp128/1f920.webp
searchEmojis('cowboy', { limit: 20 });
tokenize('Привет 🤠!'); // текстовые и emoji-токены
```

Поддерживаются ESM, CommonJS и TypeScript. Для CommonJS используйте `require('emoji-datasource-noto3d')`.

| Функция | Назначение |
| --- | --- |
| `findEmoji(input)` | Поиск по символу, Unicode-коду или short name; неизвестный код возвращает `undefined` |
| `getEmojiPath(input, options)` | Относительный путь к PNG/WebP или `null` |
| `getEmojiUrl(input, options)` | URL jsDelivr, UNPKG или собственного хостинга |
| `searchEmojis(query, {limit, category})` | Поиск по английским именам, short names, Unicode и категориям |
| `tokenize(text)` | Разделение на текст и целые emoji-последовательности |
| `getGoogleUrl(input, size)` | URL исходного PNG Google размером 128 или 512 px |
| `emojis` | Полный каталог из 3 988 записей |

Варианты изображений: `{format:'png', size:64}`, `{format:'webp', size:128}`, `{format:'webp', size:256}`. По умолчанию - WebP 128. Неверный формат вызывает исключение.

После публикации в npm:

```js
getEmojiUrl('🤠'); // jsDelivr, имя и точная версия установленного пакета
getEmojiUrl('🤠', { cdn: 'unpkg', size: 256 });
```

`getEmojiUrl` использует точную версию из package.json. Для собственного хостинга передайте `baseUrl` и сохраните под ним структуру `img/`. `getGoogleUrl` зависит от внешнего каталога Google `latest`, а не от версии этого пакета.

## Unicode и интеграция

Храните в сообщениях исходный Unicode, а изображения подставляйте при отображении. `tokenize` использует `Intl.Segmenter` и обрабатывает ZWJ-последовательности, флаги, клавиши и оттенки кожи целиком. Для старых сред требуется grapheme polyfill. Явная текстовая форма с FE0E остаётся текстом.

Загружайте изображения по мере появления на экране и используйте кэш. Веб-страница скачивает запрошенные изображения; `npm install` скачивает весь пакет на машину разработчика. При ошибке загрузки показывайте исходный символ из `alt`.

Каталоги данных:

- `emoji.json` - плоский список всех вариантов с полями `emoji`, `unified`, `rgi`, `name`, `category`, `short_names`, `image`.
- `emoji-datasource.json` - базовые записи с вложенными `skin_variations`, по схеме отдельных изображений emoji-data.
- `manifest.json` - пути, размеры и SHA-256 всех файлов изображений.

`image` в метаданных обозначает PNG basename; для WebP меняется расширение. Поля `rgi` используют `_`, поля `unified` - `-` и верхний регистр. API также распознаёт допустимые варианты с FE0F и без него.

Это не готовый адаптер для любого emoji-picker: spritesheets и координаты `sheet_x`/`sheet_y` не включены. Если picker передаёт `unified` или Unicode-символ, его можно сопоставить с изображением через `getEmojiUrl` или `getEmojiPath`.

## Разработка

Нужны Node.js 22.14+ и npm; рекомендуется Node.js 24.

```sh
npm ci
npm run check
npm run preview
```

Пример галереи откроется по адресу http://127.0.0.1:8080/ . `npm run build` пересобирает каталог и ESM/CJS-модули; готовые изображения уже находятся в репозитории. [Сборка изображений и публикация пакета](CONTRIBUTING.md).

## Лицензии и источники

Код этого проекта - MIT. Дополнительные метаданные [iamcal/emoji-data](https://github.com/iamcal/emoji-data) - MIT. Изображения принадлежат Google и не перелицензируются под MIT: в документации upstream есть расхождение относительно применимой лицензии статических 3D PNG. Подробности и исходные тексты - в [LICENSE.md](LICENSE.md) и [NOTICE.md](NOTICE.md).

Источник изображений: [Google Noto Emoji](https://googlefonts.github.io/noto-emoji-files/). Набор зафиксирован в каталоге данных; новые emoji добавляются отдельным обновлением.
