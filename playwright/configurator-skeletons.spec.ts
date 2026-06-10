import { expect, test } from '@playwright/test';

const waitForConfiguratorReady = async (page: import('@playwright/test').Page) => {
  await page.goto('/configurator');
  await page.waitForSelector('aside h3', { timeout: 60_000 });
};

const goToStep = async (page: import('@playwright/test').Page, label: string) => {
  await page.getByRole('tab', { name: label }).click();
};

test.describe('Configurator skeleton dimensions', () => {
  test('pattern preview skeleton fills preview container while images load', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,webp,avif}', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      await route.continue();
    });

    await waitForConfiguratorReady(page);
    await goToStep(page, 'Design');

    const previewSkeleton = page.getByTestId('skeleton-pattern-preview').first();
    await expect(previewSkeleton).toBeVisible({ timeout: 10_000 });

    const previewBox = await previewSkeleton.boundingBox();
    expect(previewBox).not.toBeNull();
    expect(previewBox!.width).toBeGreaterThan(40);
    expect(previewBox!.height).toBeGreaterThan(40);
  });

  test('switching design pattern does not replace aside panel with skeletons', async ({ page }) => {
    await waitForConfiguratorReady(page);
    await goToStep(page, 'Design');

    const patternButtons = page.getByRole('button').filter({ has: page.locator('img') });
    await patternButtons.nth(1).click();

    await expect(page.getByTestId('skeleton-step-design')).toHaveCount(0);
    await expect(page.getByTestId('skeleton-configurator-product')).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Design' })).toBeVisible();
  });
});
