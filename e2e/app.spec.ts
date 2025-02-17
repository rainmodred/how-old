import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('smoke', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Popular Movies', level: 1 }),
  ).toBeVisible();

  const search = page.getByPlaceholder('Search for a movie or tv');

  await search.click();
  await search.fill('Firefly');
  await search.click();
  let option = page.getByRole('option', {
    name: 'Firefly (2002)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'Firefly',
      level: 1,
    }),
  ).toHaveText('Firefly');

  await search.click();
  await search.fill('Lord of the');
  await search.click();
  option = page.getByRole('option', {
    name: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'The Lord of the Rings',
      level: 1,
    }),
  ).toHaveText('The Lord of the Rings: The Fellowship of the Ring');

  await page.getByRole('link', { name: 'Ian McKellen' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Ian McKellen',
      level: 1,
    }),
  ).toHaveText('Ian McKellen');
});

test('shold change theme', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute(
    'data-mantine-color-scheme',
    'light',
  );
  await page.getByRole('button').click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-mantine-color-scheme',
    'dark',
  );
  await page.getByRole('button').click();

  await expect(page.locator('html')).toHaveAttribute(
    'data-mantine-color-scheme',
    'light',
  );
});
