# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: configurator-skeletons.spec.ts >> Configurator skeleton dimensions >> product block skeleton matches product header layout
- Location: playwright\configurator-skeletons.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('skeleton-configurator-product')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('skeleton-configurator-product')

```

```yaml
- banner:
    - search:
        - button "Open search"
        - textbox "Search":
            - /placeholder: Type to search
    - combobox: Italiano
    - link "Logo":
        - /url: /
        - img "Logo"
    - button:
        - img
    - button:
        - img
- img "Logo"
- text: YOU
- paragraph: Made by YOU. Worn your way.
- banner:
    - tablist:
        - tab "Color" [selected]
        - tab "Design"
        - tab "Sfumatura"
        - tab "Nome"
        - tab "Numero"
        - tab "Logo"
- main:
    - complementary:
        - button "Maglia Federer Maglia Federer":
            - img "Maglia Federer"
            - paragraph: Maglia Federer
        - button "Aggiungi prodotto":
            - img
        - heading "Maglia Federer" [level=3]
        - paragraph: Prodotto 1
        - paragraph: Minimo 6 pz
        - paragraph: 100,00€
        - paragraph: '>10 pezzi +20% di sconto'
        - region:
            - heading "Front" [level=3]:
                - button "Front" [expanded]:
                    - paragraph: Front
            - region "Front":
                - button "Seleziona il colore":
                    - text: Seleziona il colore
                    - img
                - textbox "#ffffff": '#FFFFFF'
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
                - button
            - heading "Back" [level=3]:
                - button "Back":
                    - paragraph: Back
            - heading "Left Sleeve" [level=3]:
                - button "Left Sleeve":
                    - paragraph: Left Sleeve
            - heading "Right Sleeve" [level=3]:
                - button "Right Sleeve":
                    - paragraph: Right Sleeve
    - complementary:
        - button "Annulla" [disabled]:
            - img
            - text: Annulla
        - button "Ripristina":
            - text: Ripristina
            - img
- button "Condividi":
    - img
    - text: Condividi
- button "Prodotto":
    - img
    - text: Prodotto
- button "Duplica":
    - img
    - text: Duplica
- button "Info":
    - img
    - text: Info
- button "Completa Config.":
    - img
    - text: Completa Config.
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  |
  3  | import { expectBox } from './utils/expectBox';
  4  |
  5  | const showTransitionSkeleton = async (page: import('@playwright/test').Page, step: number) => {
  6  |   await page.evaluate((activeStep) => {
  7  |     window.__E2E__?.setActiveStep(activeStep);
  8  |     window.__E2E__?.setSceneTransitionLoading(true);
  9  |   }, step);
  10 | };
  11 |
  12 | test.describe('Configurator skeleton dimensions', () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     await page.goto('/configurator');
  15 |     await page.waitForSelector('aside h3', { timeout: 60_000 });
  16 |   });
  17 |
  18 |   test('product block skeleton matches product header layout', async ({ page }) => {
  19 |     await showTransitionSkeleton(page, 1);
  20 |
  21 |     const productSkeleton = page.getByTestId('skeleton-configurator-product');
> 22 |     await expect(productSkeleton).toBeVisible();
     |                                   ^ Error: expect(locator).toBeVisible() failed
  23 |
  24 |     await expectBox(page.getByTestId('skeleton-product-name'), { width: 200, height: 32 });
  25 |     await expectBox(page.getByTestId('skeleton-product-price'), { height: 40, minWidth: 80, maxWidth: 120 });
  26 |   });
  27 |
  28 |   test('color step skeleton matches accordion layout', async ({ page }) => {
  29 |     await showTransitionSkeleton(page, 1);
  30 |
  31 |     const accordionSkeleton = page.getByTestId('skeleton-step-accordion');
  32 |     await expect(accordionSkeleton).toBeVisible();
  33 |     await expectBox(accordionSkeleton, { minHeight: 280 });
  34 |   });
  35 |
  36 |   test('design step skeleton pattern tiles are 80px tall', async ({ page }) => {
  37 |     await showTransitionSkeleton(page, 2);
  38 |
  39 |     const designSkeleton = page.getByTestId('skeleton-step-design');
  40 |     await expect(designSkeleton).toBeVisible();
  41 |
  42 |     const patternTiles = page.getByTestId('skeleton-pattern-tile');
  43 |     await expect(patternTiles.first()).toBeVisible();
  44 |     await expectBox(patternTiles.first(), { height: 80, minWidth: 55 });
  45 |
  46 |     await expectBox(page.getByTestId('skeleton-pattern-none'), { height: 80 });
  47 |   });
  48 |
  49 |   test('pattern preview skeleton fills preview container', async ({ page }) => {
  50 |     await page.route('**/*.{png,jpg,jpeg,webp,avif}', async (route) => {
  51 |       await new Promise((resolve) => setTimeout(resolve, 5_000));
  52 |       await route.continue();
  53 |     });
  54 |
  55 |     await page.reload();
  56 |     await page.waitForSelector('aside h3', { timeout: 60_000 });
  57 |     await page.evaluate(() => {
  58 |       window.__E2E__?.setActiveStep(2);
  59 |       window.__E2E__?.setSceneTransitionLoading(false);
  60 |     });
  61 |
  62 |     const previewSkeleton = page.getByTestId('skeleton-pattern-preview').first();
  63 |     await expect(previewSkeleton).toBeVisible({ timeout: 10_000 });
  64 |
  65 |     const previewBox = await previewSkeleton.boundingBox();
  66 |     expect(previewBox).not.toBeNull();
  67 |     expect(previewBox!.width).toBeGreaterThan(40);
  68 |     expect(previewBox!.height).toBeGreaterThan(40);
  69 |   });
  70 |
  71 |   test('logo upload skeleton matches dropzone height', async ({ page }) => {
  72 |     await showTransitionSkeleton(page, 6);
  73 |
  74 |     const logoSkeleton = page.getByTestId('skeleton-logo-upload');
  75 |     await expect(logoSkeleton).toBeVisible();
  76 |     await expectBox(page.getByTestId('skeleton-logo-dropzone'), { height: 72 });
  77 |   });
  78 | });
  79 |
```
