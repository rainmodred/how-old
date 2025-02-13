import { test, expect, Page } from '@playwright/test';

async function searchAndSelect(
  page: Page,
  searchInput: string,
  optionName: string,
) {
  const search = page.getByPlaceholder('Search for a movie or tv');
  await search.click();
  await search.fill(searchInput);
  await search.click();

  const option = page.getByRole('option', { name: optionName });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', { name: optionName, level: 1 }),
  ).toHaveText(optionName);
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('smoke', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Popular Movies', level: 1 }),
  ).toBeVisible();

  // await searchAndSelect(
  //   page,
  //   'The Lord of the Rings',
  //   'The Lord of the Rings: The Fellowship of the Ring (2001)',
  // );

  const search = page.getByPlaceholder('Search for a movie or tv');
  await search.click();
  await search.fill('Lord of the');
  await search.click();
  let option = page.getByRole('option', {
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

  await search.click();
  await search.fill('Firefly');
  await search.click();
  option = page.getByRole('option', {
    name: 'Firefly (2002)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'Firefly (2002)',
      level: 1,
    }),
  ).toHaveText('Firefly (2002)');

  await search.click();
  await search.fill('House');
  await search.click();
  option = page.getByRole('option', {
    name: 'House (2004)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'House (2004)',
      level: 1,
    }),
  ).toHaveText('House (2004)');

  // await page.getByRole('link', { name: 'Ian McKellen' }).click()
});

test.skip('should work with movies', async ({ page }) => {
  const search = await page.getByPlaceholder('Search for a movie or tv');
  await search.click();
  await search.fill('Lord of the');
  await search.click();
  const option = page.getByRole('option', {
    name: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'The Lord of the Rings',
    }),
  ).toHaveText('The Lord of the Rings: The Fellowship of the Ring (2001)');

  const rows = page.getByRole('row');
  const rowsCount = await rows.count();

  expect(rowsCount).toBe(4);

  // const data = [];
  // for (let i = 1; i < rowsCount; i++) {
  //   const row = rows.nth(i);
  //   const actor = await row.locator('td:nth-child(1)').allInnerTexts();
  //   const ageThen = await row.locator('td:nth-child(2)').allInnerTexts();
  //   const ageNow = await row.locator('td:nth-child(3)').allInnerTexts();

  //   data.push({ actor, ageNow: ageNow[0], ageThen: ageThen[0] });
  // }
});

test.skip('should work with tv series', async ({ page }) => {
  const search = await page.getByPlaceholder('Search for a movie or tv');
  await search.click();
  await search.fill('Lord of the');
  await search.click();

  const option = page.getByRole('option', {
    name: 'The Lord of the Rings: The Rings of Power (2022)',
  });
  await expect(option).toBeVisible();
  await option.click();

  await expect(
    page.getByRole('heading', {
      name: 'The Lord of the Rings: The Rings of Power (2022)',
    }),
  ).toBeVisible();
  const rows = page.getByRole('row');
  const rowsCount = await rows.count();

  expect(rowsCount).toBe(3);

  await expect(page.getByRole('link', { name: '1' })).toBeVisible();
});

test.skip('should show popular movies', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Popular Movies' }),
  ).toBeVisible();
  await expect(page.getByTestId('movie-card')).toHaveCount(3);
});

test.skip('shold change theme', async ({ page }) => {
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
