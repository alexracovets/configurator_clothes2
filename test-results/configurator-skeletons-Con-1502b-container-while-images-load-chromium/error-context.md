# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: configurator-skeletons.spec.ts >> Configurator skeleton dimensions >> pattern preview skeleton fills preview container while images load
- Location: playwright\configurator-skeletons.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Design' })
    - locator resolved to <button role="tab" type="button" tabindex="-1" aria-disabled="false" aria-selected="false" data-slot="tabs-trigger" id="base-ui-_R_iat5rl5rlb_" data-orientation="horizontal" class="relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap font-inter h-auto flex-none rounded-none border-transparent bg-transparent shadow-none hover:bg-transparent data-active:bg-transparent after:hidden focus-visible:ring-0 focus-visible:outline-none">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div aria-busy="true" aria-hidden="false" class="absolute inset-0 z-50 flex items-center justify-center overflow-hidden">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div aria-busy="true" aria-hidden="false" class="absolute inset-0 z-50 flex items-center justify-center overflow-hidden">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    54 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div aria-busy="true" aria-hidden="false" class="absolute inset-0 z-50 flex items-center justify-center overflow-hidden">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - banner [ref=e3]:
        - generic [ref=e5]:
            - generic [ref=e6]:
                - search [ref=e7]:
                    - generic [ref=e8]:
                        - button "Open search" [ref=e9]:
                            - img [ref=e10] [cursor=pointer]
                        - textbox "Search":
                            - /placeholder: Type to search
                - combobox [ref=e12] [cursor=pointer]:
                    - generic [ref=e13]: Italiano
                - textbox [ref=e14]: it
            - link "Logo" [ref=e16] [cursor=pointer]:
                - /url: /
                - img "Logo" [ref=e18]
            - generic [ref=e19]:
                - button [ref=e20] [cursor=pointer]:
                    - img [ref=e21]
                - button [ref=e23] [cursor=pointer]:
                    - img [ref=e24]
    - generic [ref=e26]:
        - generic [ref=e27]:
            - generic:
                - generic:
                    - img
            - generic [ref=e29]:
                - generic [ref=e30]:
                    - img "Logo" [ref=e32]
                    - generic [ref=e33]: YOU
                - paragraph [ref=e34]: Made by YOU. Worn your way.
        - banner [ref=e35]:
            - tablist [ref=e38]:
                - tab "Color" [selected] [ref=e40] [cursor=pointer]:
                    - generic [ref=e41]: Color
                - tab "Design" [ref=e44] [cursor=pointer]:
                    - generic [ref=e45]: Design
                - tab "Sfumatura" [ref=e48] [cursor=pointer]:
                    - generic [ref=e49]: Sfumatura
                - tab "Nome" [ref=e52] [cursor=pointer]:
                    - generic [ref=e53]: Nome
                - tab "Numero" [ref=e56] [cursor=pointer]:
                    - generic [ref=e57]: Numero
                - tab "Logo" [ref=e60] [cursor=pointer]:
                    - generic [ref=e61]: Logo
        - main [ref=e62]:
            - complementary [ref=e63]:
                - generic [ref=e64]:
                    - button "Maglia Federer Maglia Federer" [ref=e67]:
                        - img "Maglia Federer" [ref=e71]
                        - paragraph [ref=e72]: Maglia Federer
                    - button "Aggiungi prodotto" [ref=e73]:
                        - img [ref=e75]
                - generic [ref=e78]:
                    - generic [ref=e79]:
                        - generic [ref=e80]:
                            - heading "Maglia Federer" [level=3] [ref=e81]
                            - generic [ref=e82]:
                                - paragraph [ref=e83]: Prodotto 1
                                - paragraph [ref=e84]: Minimo 6 pz
                        - generic [ref=e85]:
                            - paragraph [ref=e86]: 100,00€
                            - paragraph [ref=e87]: '>10 pezzi +20% di sconto'
                    - region [ref=e93]:
                        - generic [ref=e94]:
                            - heading "Front" [level=3] [ref=e95]:
                                - button "Front" [expanded] [ref=e96] [cursor=pointer]:
                                    - paragraph [ref=e99]: Front
                                    - img [ref=e100]
                            - region "Front" [ref=e102]:
                                - generic [ref=e104]:
                                    - generic [ref=e105]:
                                        - button "Seleziona il colore" [ref=e106] [cursor=pointer]:
                                            - generic [ref=e107]: Seleziona il colore
                                            - img [ref=e109]
                                        - textbox "#ffffff" [ref=e111]: '#FFFFFF'
                                    - generic [ref=e112]:
                                        - button [ref=e113] [cursor=pointer]
                                        - button [ref=e114] [cursor=pointer]
                                        - button [ref=e115] [cursor=pointer]
                                        - button [ref=e116] [cursor=pointer]
                                        - button [ref=e117] [cursor=pointer]
                                        - button [ref=e118] [cursor=pointer]
                                        - button [ref=e119] [cursor=pointer]
                                        - button [ref=e120] [cursor=pointer]
                                        - button [ref=e121] [cursor=pointer]
                                        - button [ref=e122] [cursor=pointer]
                                        - button [ref=e123] [cursor=pointer]
                                        - button [ref=e124] [cursor=pointer]
                                        - button [ref=e125] [cursor=pointer]
                                        - button [ref=e126] [cursor=pointer]
                                        - button [ref=e127] [cursor=pointer]
                                        - button [ref=e128] [cursor=pointer]
                                        - button [ref=e129] [cursor=pointer]
                                        - button [ref=e130] [cursor=pointer]
                                        - button [ref=e131] [cursor=pointer]
                                        - button [ref=e132] [cursor=pointer]
                        - heading "Back" [level=3] [ref=e134]:
                            - button "Back" [ref=e135] [cursor=pointer]:
                                - paragraph [ref=e138]: Back
                                - img [ref=e139]
                        - heading "Left Sleeve" [level=3] [ref=e142]:
                            - button "Left Sleeve" [ref=e143] [cursor=pointer]:
                                - paragraph [ref=e146]: Left Sleeve
                                - img [ref=e147]
                        - heading "Right Sleeve" [level=3] [ref=e150]:
                            - button "Right Sleeve" [ref=e151] [cursor=pointer]:
                                - paragraph [ref=e154]: Right Sleeve
                                - img [ref=e155]
            - generic [ref=e157]:
                - generic:
                    - generic:
                        - generic:
                            - generic:
                                - generic:
                                    - img
                                - generic: YOU
                            - paragraph: Made by YOU. Worn your way.
            - complementary [ref=e161]:
                - generic [ref=e162]:
                    - button "Annulla" [disabled]:
                        - img
                        - text: Annulla
                    - button "Ripristina" [ref=e163] [cursor=pointer]:
                        - text: Ripristina
                        - img [ref=e164]
        - generic [ref=e167]:
            - button "Condividi" [ref=e168] [cursor=pointer]:
                - img [ref=e170]
                - text: Condividi
            - button "Prodotto" [ref=e172] [cursor=pointer]:
                - img [ref=e174]
                - text: Prodotto
            - button "Duplica" [ref=e177] [cursor=pointer]:
                - img [ref=e179]
                - text: Duplica
            - button "Info" [ref=e182] [cursor=pointer]:
                - img [ref=e184]
                - text: Info
            - button "Completa Config." [ref=e186] [cursor=pointer]:
                - generic [ref=e187]:
                    - img [ref=e189]
                    - text: Completa Config.
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  |
  3  | const waitForConfiguratorReady = async (page: import('@playwright/test').Page) => {
  4  |   await page.goto('/configurator');
  5  |   await page.waitForSelector('aside h3', { timeout: 60_000 });
  6  | };
  7  |
  8  | const goToStep = async (page: import('@playwright/test').Page, label: string) => {
> 9  |   await page.getByRole('tab', { name: label }).click();
     |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  10 | };
  11 |
  12 | test.describe('Configurator skeleton dimensions', () => {
  13 |   test('pattern preview skeleton fills preview container while images load', async ({ page }) => {
  14 |     await page.route('**/*.{png,jpg,jpeg,webp,avif}', async (route) => {
  15 |       await new Promise((resolve) => setTimeout(resolve, 5_000));
  16 |       await route.continue();
  17 |     });
  18 |
  19 |     await waitForConfiguratorReady(page);
  20 |     await goToStep(page, 'Design');
  21 |
  22 |     const previewSkeleton = page.getByTestId('skeleton-pattern-preview').first();
  23 |     await expect(previewSkeleton).toBeVisible({ timeout: 10_000 });
  24 |
  25 |     const previewBox = await previewSkeleton.boundingBox();
  26 |     expect(previewBox).not.toBeNull();
  27 |     expect(previewBox!.width).toBeGreaterThan(40);
  28 |     expect(previewBox!.height).toBeGreaterThan(40);
  29 |   });
  30 |
  31 |   test('switching design pattern does not replace aside panel with skeletons', async ({ page }) => {
  32 |     await waitForConfiguratorReady(page);
  33 |     await goToStep(page, 'Design');
  34 |
  35 |     const patternButtons = page.getByRole('button').filter({ has: page.locator('img') });
  36 |     await patternButtons.nth(1).click();
  37 |
  38 |     await expect(page.getByTestId('skeleton-step-design')).toHaveCount(0);
  39 |     await expect(page.getByTestId('skeleton-configurator-product')).toHaveCount(0);
  40 |     await expect(page.getByRole('tab', { name: 'Design' })).toBeVisible();
  41 |   });
  42 | });
  43 |
```
