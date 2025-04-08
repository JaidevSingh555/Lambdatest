// login.spec.js
const { test, expect } = require('@playwright/test');

//valid credentials
test('✅ Valid login shows success message', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await page.pause();
  const message = await page.locator('#flash').textContent();
  expect(message).toContain('You logged into a secure area!');
});

//invalid credentials
test('❌ Invalid login shows error message', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.fill('#username', 'invaliduser');
  await page.fill('#password', 'invalidpass');
  await page.click('button[type="submit"]');
  await page.pause();
  const message = await page.locator('#flash').textContent();
  expect(message).toContain('Your username is invalid!');
});

//JS Alert  
test('🚨 Handles JS Alert', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  await page.waitForSelector('button:has-text("Click for JS Alert")');

  const dialogPromise = page.waitForEvent('dialog');


  const dialog = await dialogPromise;
  expect(dialog.message()).toBe('I am a JS Alert');
  await dialog.accept();

  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});

//JS Confirm  
test('🟡 Handles JS Confirm Alert', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // Handle dialog
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('I am a JS Confirm');
    await dialog.dismiss(); // You can also try `accept()`
  });

  await page.click('button:has-text("Click for JS Confirm")');
  await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
});

//JS Prompt  
test('🟢 Handles JS Prompt Alert', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('I am a JS prompt');
    await dialog.accept('Playwright'); // Sending text into prompt
  });

  await page.click('button:has-text("Click for JS Prompt")');
  await expect(page.locator('#result')).toHaveText('You entered: Playwright');
});

