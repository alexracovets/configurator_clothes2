# Архітектура проєкту

3D-конфігуратор одягу на **Next.js 16** (App Router) з рендером через **React Three Fiber** і глобальним станом на **Zustand**.

Проєкт організований за **Atomic Design** для UI та за шарами відповідальності для бізнес-логіки, даних і 3D.

---

## Коренева структура

```
configurator_clothes3/
├── app/                    # Next.js App Router — тонкі маршрути, без бізнес-логіки
├── public/                 # Статика: моделі GLTF, текстури, WASM, логотипи
├── scripts/                # Node-скрипти для підготовки ассетів (див. нижче)
├── src/                    # Весь код застосунку
│   ├── constants/          # Незмінні конфігураційні значення
│   ├── data/               # JSON-каталоги продуктів і доступ до них
│   ├── fonts/              # Шрифти для UI та друку на одязі
│   ├── gizmo/              # 3D gizmo: hit-test, drag, побудова елементів
│   ├── hooks/              # React-хуки (єдине місце для custom hooks)
│   ├── providers/          # React Context-провайдери
│   ├── shaders/            # GLSL-шейдери для Three.js
│   ├── store/              # Zustand-стори (глобальний стан)
│   ├── types/              # Усі TypeScript-типи проєкту
│   ├── ui/                 # UI за Atomic Design
│   └── utils/              # Чисті функції: атласи, uniform-и, конвертери файлів
├── playwright/             # E2E-тести (Playwright)
└── ARCHITECTURE.md         # Цей документ
```

---

## Atomic Design (UI)

UI живе в `src/ui/` і ділиться на рівні атомарного дизайну.

| Рівень        | Шлях                                  | Alias        | Призначення                                                                           |
| ------------- | ------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| **Atoms**     | `src/ui/components/atomic/atoms/`     | `@atoms`     | Найменші блоки: `Button`, `AtomInput`, `ColorPicker`, `AtomSkeleton`                  |
| **Molecules** | `src/ui/components/atomic/molecules/` | `@molecules` | Комбінації атомів: кроки конфігурації, `LogoUpload`, `Search`                         |
| **Organisms** | `src/ui/components/atomic/organisms/` | `@organisms` | Великі секції: `Header`, `AsideConfiguration`, `Configurator` (3D canvas)             |
| **Templates** | `src/ui/components/atomic/templates/` | `@templates` | Макети сторінок без прив'язки до даних                                                |
| **Pages**     | `src/ui/components/atomic/pages/`     | `@pages`     | Сторінкові композиції: `ConfiguratorPage`, `HomePage`                                 |
| **Shared**    | `src/ui/components/shared/`           | `@shared`    | Примітиви на базі shadcn/Radix, спільні для atoms (`Dialog`, `Accordion`, `Skeleton`) |
| **Skeletons** | `src/ui/components/skeletons/`        | `@skeletons` | Скелетони завантаження, повторюють layout реальних компонентів                        |

### Правила UI

1. **Сторінки в `app/`** лише імпортують компонент з `@pages` — без логіки.
2. **Atoms** не знають про store, API чи 3D — лише props.
3. **Molecules** можуть читати store і викликати хуки з `@hooks`.
4. **Organisms** збирають molecules/atoms у цілісні блоки (sidebar, canvas, footer).
5. **Skeletons** дзеркалять розміри відповідних molecules/organisms; показ керується через `useShowConfigurationSkeleton`.
6. Компонент **не містить** власних `.ts`-типів у файлі — типи props виносяться в `src/types/ui/`.

---

## Шари поза UI

### `src/hooks/` (`@hooks`)

Єдине місце для **React custom hooks**:

- обгортки над store (`useConfigurationCartSync`);
- 3D/текстури (`useGarmentTextures`, `useGarmentPbrMaps`);
- gizmo (`useGizmoSelection`, `usePrintGizmoDrag`, `useGizmoIconAtlas`);
- UI-стан (`useSlidingIndicator`, `useControlledState`, `useShowConfigurationSkeleton`);
- доменні дії (`useLogoFileHandler`, `useStepLogo`);
- UI-селектори над store (`useStepLogo` — view-model для кроку Logo).

> Zustand-стори в `src/store/` теж мають префікс `use*`, але це **не React-хуки** — це глобальний стан. React-хуки, що комбінують кілька сторів або `useMemo`/`useCallback`, живуть у `src/hooks/`.

### `src/store/` (`@store`)

Zustand-стори за доменами:

| Store                                                    | Відповідальність            |
| -------------------------------------------------------- | --------------------------- |
| `useConfiguratorProduct`                                 | Активний продукт з каталогу |
| `useConfigurationControl`                                | Кроки майстра, навігація    |
| `useConfigurationCart`                                   | Кошик сесій конфігурації    |
| `useGarmentColor`                                        | Кольори частин і градієнти  |
| `useGarmentDesign`                                       | Патерни дизайну             |
| `useGarmentName` / `useGarmentNumber` / `useGarmentLogo` | Текст і логотипи на одязі   |
| `useConfiguratorSceneLoad`                               | Стан завантаження 3D-сцени  |
| `useInfoDialog`                                          | Модальні вікна info/FAQ     |

Кожен store — папка з `use*.ts` (стан + actions) і допоміжними `map*.ts` (маппінг з entity-даних).

### `src/types/` (`@types`)

**Усі типи проєкту** зосереджені тут:

```
src/types/
├── cart/           # cartItemType, cartItemConfigurationType, snapshot-типи garment-стану
├── entities/       # Типи з JSON-каталогів (джерело правди для продуктів)
├── garment/        # Runtime-типи одягу, похідні від entities
├── gizmo/          # Типи gizmo і drag-стану
├── ui/             # Props, variant-union і допоміжні типи UI-компонентів
├── utils/          # PbrMaps, GarmentPrintState, PatternMaskPair…
└── index.ts        # Barrel-експорт
```

#### Правила типів

1. **Іменування:** camelCase + суфікс `Type` — `garmentConfigType`, `nameInstanceType`, `colorTabControlPropsType`.
2. **Форма:** об'єктні shape — `interface`; union / intersection / generic / tuple — `type`.
3. **Entity-типи** (`garmentConfigType`, `namePositionConfigType`, `uvPointType`…) описують JSON у `src/data/` і живуть у `src/types/entities/`.
4. **Runtime-типи** (`nameInstanceType`, `logoPositionType`, `partGradientType`…) **успадковують або компонують** entity-типи через `Pick`, `Omit`, `extends` — **не дублюють** поля вручну.
5. Типи props компонентів — у `src/types/ui/`, не в `.tsx`-файлах.
6. `@data` експортує **лише дані й функції** (`getProduct`, `faqContent`…). Типи імпортуються напряму з `@types` — без проміжних `types.ts` у `data/`, `gizmo/` тощо.

### `src/data/` (`@data`)

JSON-каталоги (`crewneck/crewneck.json`), FAQ-контент і функції доступу: `getProduct`, `getStyle`, `listCatalogProducts`. Без UI-логіки.

### `src/utils/` (`@utils`)

Чисті функції без React:

- композиція атласів друку (`composePrintAtlas`, `composeNameAtlas`);
- uniform builders і застосування друку (`garmentPrint/`);
- конвертація логотипів (`logoFile/`);
- PBR-матеріали (`createGarmentMaterial/`).

**Не реекспортує** константи з `@constants` — споживачі імпортують `LOGO_SLOT_COUNT`, `FULL_UV_BOUNDS` тощо напряму з `@constants`.

Внутрішні допоміжні типи utils, що не є доменними сутностями, можуть залишатися поруч із модулем; доменні типи — у `src/types/`.

### `src/shaders/` (`@shaders`)

Усі GLSL-фрагменти та vertex-шейдери:

- `garmentShaders` — UV, normal, roughness, gizmo lights (патчі MeshStandardMaterial);
- `garmentPrintShaders`, `garmentLogoShaders`, `garmentNameShaders`, `garmentNumberShaders` — шари друку;
- `garmentGradientShaders` — градієнт частин;
- `printAtlasTintShaders` — FBO-тінтування атласу.

Структура: `moduleName/moduleName.ts` + `index.ts`, barrel — `src/shaders/index.ts`.

### `src/gizmo/` (`@gizmo`)

Логіка 3D gizmo без React: hit-test, drag, побудова mesh-елементів. React-хуки gizmo — у `@hooks`.

### `src/constants/` (`@constants`)

Константи: кроки конфігурації, палітра, розмір print-atlas, шрифти.

### `src/providers/` (`@providers`)

React Context: `GarmentMaterialRegistry`, `PbrMapsProvider`.

### `src/fonts/` (`@fonts`)

Завантаження шрифтів для UI (`inter`) і спортивних шрифтів для друку.

---

## Next.js (`app/`)

```
app/
├── layout.tsx                          # Кореневий layout
└── (application)/
    ├── layout.tsx                      # Layout застосунку
    ├── (default_pages)/
    │   ├── page.tsx                    # Головна
    │   └── uv-debug/page.tsx           # Debug UV
    └── configurator/
        ├── layout.tsx
        └── page.tsx                    # → ConfiguratorPage з @pages
```

Маршрути **тонкі**: імпортують page-компонент з `@pages`.

---

## Головні бібліотеки

| Бібліотека                                                        | Роль                                     |
| ----------------------------------------------------------------- | ---------------------------------------- |
| **Next.js 16**                                                    | SSR/SSG, App Router, маршрутизація       |
| **React 19**                                                      | UI                                       |
| **TypeScript 5**                                                  | Типізація                                |
| **Tailwind CSS 4**                                                | Стилі                                    |
| **Zustand**                                                       | Глобальний стан                          |
| **React Three Fiber + drei**                                      | 3D canvas, GLTF, controls                |
| **Three.js**                                                      | Рендер, текстури, шейдери                |
| **Radix UI / Base UI**                                            | Доступні примітиви (shadcn)              |
| **Motion**                                                        | Анімації                                 |
| **@uiw/react-color**                                              | Color picker                             |
| **pdfjs-dist, @okathira/ghostpdl-wasm, @imagemagick/magick-wasm** | Конвертація PDF/EPS логотипів у браузері |
| **sharp** (dev)                                                   | Обробка зображень у Node-скриптах        |
| **Playwright** (dev)                                              | E2E-тести                                |
| **ESLint + Prettier + Husky**                                     | Лінт, форматування, pre-commit           |

---

## Скрипти (`package.json`)

| Скрипт                            | Призначення                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `dev`                             | Локальний dev-сервер Next.js                                                  |
| `build`                           | Production-збірка                                                             |
| `start`                           | Запуск production-сервера                                                     |
| `lint` / `lint:fix`               | ESLint для `src/` і `scripts/`                                                |
| `format` / `format:check`         | Prettier                                                                      |
| `validate`                        | `format:check` + `lint` + `verify:design-assets` — перевірка перед CI/комітом |
| `verify:design-assets`            | Перевіряє наявність файлів дизайнів і thumbnails згідно з `crewneck.json`     |
| `convert:design-assets`           | Конвертує важкі SVG-дизайни (base64 PNG) у WebP 4096px для runtime            |
| `generate:design-thumbnails`      | Генерує WebP-превʼю (~100px) для UI вибору патернів                           |
| `copy:logo-assets`                | Копіює WASM/pdf.worker/ghostscript і логотипи в `public/`                     |
| `postinstall`                     | Автоматично викликає `copy:logo-assets` після `pnpm install`                  |
| `prepare`                         | Ініціалізує Husky git-hooks                                                   |
| `test:e2e` / `test:e2e:skeletons` | Playwright E2E-тести                                                          |

### Node-скрипти (`scripts/`)

| Файл                             | Що робить                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `copy-logo-assets.mjs`           | Копіює `magick.wasm`, `pdf.worker`, `gs.js/wasm` і PNG-логотипи в `public/ghostscript/` та `public/logo/` |
| `verify-design-assets.mjs`       | Валідує, що кожен `path_name` з JSON має файл дизайну і thumbnail                                         |
| `convert-design-assets.mjs`      | Растеризує design SVG → WebP (4096px) через sharp; зберігає оригінали для export                          |
| `generate-design-thumbnails.mjs` | Створює `designs/thumbs/*.webp` з повнорозмірних WebP                                                     |

---

## Alias-и (`tsconfig.json`)

| Alias        | Шлях                                 |
| ------------ | ------------------------------------ |
| `@styles`    | `src/ui/styles/globals.css`          |
| `@atoms`     | `src/ui/components/atomic/atoms`     |
| `@molecules` | `src/ui/components/atomic/molecules` |
| `@organisms` | `src/ui/components/atomic/organisms` |
| `@templates` | `src/ui/components/atomic/templates` |
| `@pages`     | `src/ui/components/atomic/pages`     |
| `@shared`    | `src/ui/components/shared`           |
| `@skeletons` | `src/ui/components/skeletons`        |
| `@hooks`     | `src/hooks`                          |
| `@store`     | `src/store`                          |
| `@types`     | `src/types`                          |
| `@utils`     | `src/utils`                          |
| `@data`      | `src/data`                           |
| `@constants` | `src/constants`                      |
| `@gizmo`     | `src/gizmo`                          |
| `@providers` | `src/providers`                      |
| `@fonts`     | `src/fonts`                          |
| `@shaders`   | `src/shaders`                        |

Усі alias-и — **плоскі** (`@hooks`, `@types`…), без `/*`. Імпорти лише з barrel-файлів сутності (`index.ts`), не з вкладених шляхів (`@constants/printAtlas` — заборонено).

### Структура модуля (folder / file / index)

Кожен модуль — **папка з тією ж назвою**, що й головний файл, плюс barrel:

```
featureName/
├── featureName.ts    # реалізація, типи або константи
└── index.ts          # export * from './featureName'
```

**Іменування:** папки й файли — **camelCase** (`atomTabsProps`, `useStepLogo`). Виняток — **React-компоненти** (PascalCase) і **`@constants`**: папки/файли та ідентифікатори констант — **SCREAMING_SNAKE_CASE** (`PALETTE_COLORS/PALETTE_COLORS.ts`, `LOGO_SLOT_COUNT`). Функції-утиліти — camelCase (`activateCartItem.ts`).

Приклади: `useStepLogo/useStepLogo.ts`, `PALETTE_COLORS/PALETTE_COLORS.ts`, `cart/cart/cart.ts`, `logoUploadProps/logoUploadProps.ts`.

**Заборонено** «гуляючі» файли поруч із `index.ts` без вкладеної папки (`FONT_FAMILY_BY_NAME.ts` біля `constants/index.ts` — ні; лише `FONT_FAMILY_BY_NAME/FONT_FAMILY_BY_NAME.ts`). Усі конфігураційні константи — лише в `@constants`.

Barrel `index.ts` на рівні шару (`src/types/ui/index.ts`, `src/constants/index.ts`) лише реекспортує дочірні модулі.

### Barrel-и та React Server Components (Next.js)

Server Components (`app/**/layout.tsx`, server pages) **не повинні** через barrel підвантажувати client-граф:

| Модуль                      | Server-safe barrel                                              | Client-only (імпорт напряму, без barrel)                                    |
| --------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `@constants`                | `STEPS_CONFIGURATION`, `FONT_FAMILY_BY_NAME`, `PALETTE_COLORS`… | —                                                                           |
| `@fonts`                    | `inter`, `anton`, `oswald`… (next/font instances)               | `src/fonts/fontsConfiguration/` (`'use client'`, залежить від `sportFonts`) |
| `@hooks`                    | —                                                               | увесь barrel лише для Client Components                                     |
| `@organisms` / `@molecules` | лише top-level експорти                                         | внутрішні Configurator-частини — відносні імпорти всередині папки           |

Правила:

1. **Не реекспортувати** client-модулі (`'use client'`, хуки, `next/font` UI-конфіги) з server-safe barrel (`@constants`, `@fonts/index.ts`).
2. **Хуки не через component-barrel** — `useLogoFileHandler` імпортується з `@hooks`, не з `LogoUpload/index.ts`.
3. **`FONT_FAMILY_BY_NAME`** (`@constants`) — CSS-рядки для canvas/utils на сервері; **`FONTS_CONFIGURATION`** (`src/fonts/`) — список для UI-селекту з реальними `fontFamily` з `next/font`.
4. Barrel `@organisms` і `@molecules` — **вузькі**: без внутрішніх Configurator-модулів і без re-export хуків.

---

## Потік даних конфігуратора

```
crewneck.json (entities)
       ↓
@data → getProduct()
       ↓
@store (useGarment*) ← initForProduct()
       ↓
@hooks (useGarmentTextures) → compose atlases
       ↓
@shaders + @utils (createGarmentMaterial) → патчі шейдера на mesh
       ↓
@organisms/Configurator (R3F)
       ↑
@molecules (UI кроки) → actions у store
```

---

## Чеклист відповідності архітектурі

- [x] Custom React-хуки лише в `src/hooks/` (`useGizmoIconAtlas`, `useLogoFileHandler` перенесено)
- [x] Zustand-стори лише в `src/store/`
- [x] Entity- і garment-типи в `src/types/`; UI-типи в `src/types/ui/`
- [x] Runtime garment-типи (`namePositionType`, `logoInstanceType`, `partGradientType`…) компонують entity-типи
- [x] `app/` — тонкі маршрути
- [x] Skeletons відповідають layout реальних компонентів
- [x] Atoms без store (перевірено: жоден atom не імпортує `@store`)
- [x] Props-типи доменних компонентів у `src/types/ui/` (винятки: `AtomInput`, `AtomSelect`, `Range`, `AtomDialog`, `AtomPopover`, `@shared` Dialog/Popover/Input — тісно зв'язані з Radix/Base UI + cva)
- [x] Gizmo runtime-типи (`PrintDragMoveState`, `GizmoButtonHit`…) — у `src/types/gizmo/runtime.ts`
- [x] Типи імпортуються з `@types`, не з `@store` / `@data`
- [x] У `gizmo/` і `hooks/` немає відносних імпортів у `utils/` — лише `@utils`
- [x] Utils-типи (`PbrMaps`, `GarmentPrintState`, `PatternMaskPair`…) — у `src/types/utils/`
- [x] `useStepLogo` — перенесено в `@hooks`
- [x] Entity-типи, FAQ і `CatalogProductRef` — у `src/types/entities/`; `@data` не реекспортує типи
- [x] RSC: client-only модулі не в server-safe barrel (`FONTS_CONFIGURATION` → `src/fonts/`, не `@constants`)
- [x] `pnpm build`, `tsc --noEmit`, `lint` проходять
- [x] Playwright skeleton E2E (`test:e2e:skeletons`) — 2/2
- [x] Прибрано мертвий `DEFAULT_TEXT_CONFIGURATION`, зайвий re-export `useConfiguratorProduct` з `@hooks`
- [x] `@gizmo` не реекспортує `useGizmoIconAtlas`; `PALETTE_COLORS` — server-safe (без `'use client'`)
- [x] `cartItemType`, `cartItemConfigurationType`, snapshot-типи — у `src/types/cart/`
- [x] Props-типи винесено в `src/types/ui/` (layout, atoms, molecules, organisms, skeletons, configuration tools/steps)
- [x] `@store/index.ts` не реекспортує типи — лише `@types`
- [x] GLSL-шейдери в `src/shaders/` (`@shaders`), не в `@utils`
- [x] `@utils` не реекспортує константи з `@constants`
- [x] Self-import через barrel усунено в `utils/`, `gizmo/`, `store/` (лише relative всередині шару)
- [x] `useStepLogo` — у `@hooks`, не в `@store`
- [x] Усі модулі `@utils` (garmentPrint, logoFile, compose\*, drawNameOnAtlas…) — `folder/file/index`
- [x] UI typo виправлено: `AtomDialog`, `FooterConfiguration`, `ShadingControl`
- [x] Доменні inline-типи винесено: `filePickContextType`, `colorTabType`, `garmentMaterialRegistryValueType` → `@types`
- [x] Усі типи `@types`: camelCase + суфікс `Type`; object shape — `interface`

### Результати аудиту (черговий прохід)

**Пройдено без зауважень**

| Перевірка                                                        | Результат          |
| ---------------------------------------------------------------- | ------------------ |
| Вкладені alias (`@hooks/foo`, `@types/*`)                        | не знайдено        |
| `import type` з `@store` / `@data` у `src/`                      | не знайдено        |
| Atoms імпортують `@store`                                        | ні                 |
| `app/**` — тонкі маршрути (`@pages`)                             | так                |
| `@data` експортує лише дані/функції                              | так                |
| `hooks/` і `gizmo/` → `@utils` (не відносні `../utils`)          | так                |
| Self-import `@utils` / `@gizmo` / `@store` всередині того ж шару | ні (лише relative) |
| Константи імпортуються з `@constants`, не через `@utils`         | так                |

**Свідомі винятки (допустимо)**

| Пункт                                       | Деталі                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Props у `@shared` / cva-atoms               | `Dialog`, `Popover`, `Input`, `AtomInput`, `AtomSelect`, `Range`, `AtomDialog` — типи залишаються поруч із Radix/Base UI + cva |
| `STEPS_CONFIGURATION`                       | імпортує molecules відносним шляхом `../../ui/...` — уникає циклу `@constants` ↔ `@molecules`                                  |
| Store submodules                            | окремі `export type` у `useGarment*` — re-export з `@types` для внутрішнього використання                                      |
| Molecules → `createNameInstance` з `@store` | map-фабрики експортуються з `@store` barrel за доменом garment                                                                 |

**Dev-зауваження (не prod)**

- `THREE.Clock` deprecated — попередження з drei/three, не критично
- `allowedDevOrigins: ['127.0.0.1']` у `next.config.ts` — для HMR при доступі через IP

### Правило композиції типів (приклад)

```ts
// entity (з JSON)
interface textPositionConfigType { label: string; uv: uvPointType; rotation: number; fontSize: number; ... }

// runtime — не дублює поля, а компонує
type textPrintPositionType = { key: string; partId: string; uv: uvPointType }
  & Pick<textPositionConfigType, 'label' | 'rotation' | 'fontSize'>
  & mappedGizmoFlagsType;
```
