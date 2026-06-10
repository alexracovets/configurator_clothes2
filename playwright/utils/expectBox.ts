import { expect, type Locator } from '@playwright/test';

type BoxExpectation = {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
};

const expectBox = async (locator: Locator, expected: BoxExpectation, tolerance = 8) => {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();

  const { width, height, minWidth, minHeight, maxWidth, maxHeight } = expected;

  if (width != null) {
    expect(box!.width).toBeGreaterThanOrEqual(width - tolerance);
    expect(box!.width).toBeLessThanOrEqual(width + tolerance);
  }

  if (height != null) {
    expect(box!.height).toBeGreaterThanOrEqual(height - tolerance);
    expect(box!.height).toBeLessThanOrEqual(height + tolerance);
  }

  if (minWidth != null) {
    expect(box!.width).toBeGreaterThanOrEqual(minWidth - tolerance);
  }

  if (minHeight != null) {
    expect(box!.height).toBeGreaterThanOrEqual(minHeight - tolerance);
  }

  if (maxWidth != null) {
    expect(box!.width).toBeLessThanOrEqual(maxWidth + tolerance);
  }

  if (maxHeight != null) {
    expect(box!.height).toBeLessThanOrEqual(maxHeight + tolerance);
  }
};

export { expectBox };
