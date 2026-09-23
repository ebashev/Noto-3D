# Разработка и публикация

## Сборка

```sh
git clone https://github.com/ebashev/Noto-3D.git
cd Noto-3D
npm ci
npm run check
```

`check` собирает JS и JSON из сохранённых данных, запускает тесты Unicode/API, проверку типов и SHA-256 всех 11 964 изображений. `npm run preview` запускает локальную галерею. ESM/CJS и декларации TypeScript находятся в `dist/`.

## Обновление изображений

Исходный реестр - `data/source-catalog.csv`; дополнительные названия и порядок - `data/site-metadata.json` и `data/emoji-data.upstream.json`. `data/provenance.json` содержит источники. `data/assets-lock.json` фиксирует параметры обработки и контрольные суммы.

Для повторной генерации из исходных PNG 512 px:

```sh
npm run fetch:originals
npm run images
npm run check
```

Исходники загружаются в `.cache/originals`, проверяются по SHA-256 и не входят в Git/npm. При изменении CDN `latest` несовпадающий файл отклоняется. Для нового снимка обновляйте каталог осознанно, сохраняя источники и уведомления об авторских правах. Можно передать `npm run images -- /path/to/originals`; каталог должен содержать `<rgi>.png` с ожидаемыми контрольными суммами.

## Имя npm-пакета

Публикатору нужен собственный аккаунт npm с доступом к выбранному имени. Владельцы GitHub-репозитория и npm-пакета могут быть разными людьми.

```sh
npm login
npm whoami
npm view emoji-datasource-noto3d name
```

E404 означает, что имя сейчас не найдено, но не резервирует его. Если нужен собственный scope, замените `username` на логин npm:

```sh
npm run configure -- @username/emoji-datasource-noto3d
npm run check
```

`configure` обновляет package.json и lockfile, а сборка - имя в JS API и manifest. Сохраните эти изменения в репозитории до выпуска и обновите примеры установки в README. Поле `repository` может продолжать ссылаться на `ebashev/Noto-3D` независимо от владельца npm-пакета.

## Выпуск

Сохраните изменения отдельным коммитом. При обновлении уже выпущенного пакета увеличьте версию через `npm version patch`, `minor` или `major` в соответствии с изменениями; имя и версия в npm не могут быть повторно использованы.

```sh
npm run check
npm pack
npm publish --access public
```

Публикация требует доступа к имени пакета и подтверждения npm/2FA. Перед распространением графики учитывайте условия в LICENSE.md. npm-секреты и `.npmrc` с токенами не коммитятся.

Готовый `.tgz` можно установить без реестра или опубликовать напрямую:

```sh
npm install ./emoji-datasource-noto3d-1.1.0.tgz
npm publish ./emoji-datasource-noto3d-1.1.0.tgz --access public
```

Архив содержит готовый пакет, а исходный репозиторий содержит также инструменты сборки. Для изменения имени или содержимого собирайте новый архив из исходников. ZIP/TGZ распространяйте как файлы GitHub Release, не добавляя их в дерево исходников.

Для неизменяемых CDN-ссылок используйте точную npm-версию либо Git commit SHA/тег. Публикация npm и GitHub push независимы: обновление одной площадки не обновляет другую.

## GitHub Actions

`ci.yml` проверяет push и pull request. `publish.yml` запускается вручную по тегу `v<version>` и проверяет соответствие package.json.

Для OIDC-публикации сначала создайте пакет ручной публикацией, затем настройте в npm Settings → Trusted Publisher:

- Provider: GitHub Actions.
- User/repository: `ebashev` / `Noto-3D`.
- Workflow: `publish.yml`.
- Environment: пустое, если workflow не использует environment.

Разрешите прямую публикацию, если npm предлагает выбор действий. Workflow использует Node.js 24, npm 11.9.0 и `id-token: write`; постоянный NPM_TOKEN не нужен. См. [документацию npm](https://docs.npmjs.com/trusted-publishers/).
