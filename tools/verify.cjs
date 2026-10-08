const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('../.qa/node_modules/playwright');
const AxeBuilder = require('../.qa/node_modules/@axe-core/playwright').default;
const { HtmlValidate } = require('../.qa/node_modules/html-validate');
const server = require('./preview.cjs');

const pages = ['index.html', 'kom-i-gang.html', 'cykel-og-udstyr.html', 'din-forste-tur.html'];
const widths = [320, 375, 390, 402, 768, 1024, 1440];
const results = [];

async function main() {
  await fs.mkdir('.qa/screenshots', { recursive: true });
  const validator = new HtmlValidate({ extends: ['html-validate:recommended'], rules: { 'void-style': ['error', { style: 'omit' }], 'no-inline-style': 'error' } });
  for (const file of pages) {
    const report = await validator.validateFile(file);
    assert.ok(report.valid, `${file}: ${JSON.stringify(report.results.flatMap(r => r.messages))}`);
    results.push(`${file}: HTML validation passed`);
  }
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    let stage = 'layouts';
    page.on('pageerror', error => errors.push(`${stage} ${page.url()}: ${error.message}`));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const file of pages) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`http://127.0.0.1:4173/${file}`);
        await page.evaluate(() => document.fonts.ready);
        await page.locator('img').evaluateAll(images => Promise.all(images.map(image => {
          image.loading = 'eager';
          return image.decode();
        })));
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('nav a[aria-current="page"]').count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file}: overflow at ${width}`);
        assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), `${file}: broken image`);
        const links = await page.locator('a').evaluateAll(anchors => anchors.map(a => ({ href: a.getAttribute('href'), url: a.href })));
        for (const link of links) {
          assert.ok(link.href && link.href !== '#', 'Placeholder link');
          const url = new URL(link.url);
          const response = await context.request.get(url.href.split('#')[0]);
          assert.equal(response.status(), 200, link.url);
          if (url.hash) {
            const markup = await response.text();
            assert.ok(markup.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor ${link.url}`);
          }
        }
        if ([402, 1440].includes(width)) {
          const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
          assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${file}: accessibility at ${width}`);
          await page.screenshot({ path: `.qa/screenshots/${file.replace('.html', '')}-${width}.png`, fullPage: true });
        }
        results.push(`${file} @ ${width}: layout, assets and links passed`);
      }
    }
    stage = 'menu';
    await page.setViewportSize({ width: 402, height: 900 });
    await page.goto('http://127.0.0.1:4173/index.html');
    const menu = page.locator('.nav-toggle');
    await menu.focus();
    await page.keyboard.press('Enter');
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Tab');
    assert.ok(await page.locator('nav a').first().evaluate(el => el === document.activeElement));
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.ok(await menu.evaluate(el => el === document.activeElement));
    await menu.click();
    await page.locator('nav a').nth(1).click();
    assert.ok(page.url().endsWith('kom-i-gang.html'));
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    await menu.click();
    await page.locator('.hero-actions .button').click({ position: { x: 8, y: 8 } });
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await menu.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'false');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.ok(await page.locator('.site-nav').isVisible());
    results.push('Mobile menu: keyboard open, Tab, Escape/focus, link close, outside close, resize passed');

    stage = 'checklist';
    await page.goto('http://127.0.0.1:4173/din-forste-tur.html');
    const boxes = page.locator('[data-checklist] input');
    await boxes.first().focus();
    await page.keyboard.press('Space');
    assert.ok(await boxes.first().isChecked());
    for (const box of await boxes.all()) await box.check();
    assert.match(await page.locator('[data-checklist-status]').textContent(), /Alt er krydset af/);
    await page.reload();
    for (const box of await boxes.all()) assert.ok(await box.isChecked());
    await boxes.first().uncheck();
    assert.match(await page.locator('[data-checklist-status]').textContent(), /5 af 6/);
    await page.locator('summary').first().click();
    assert.ok(await page.locator('details').first().getAttribute('open') !== null);
    results.push('Checklist: Space toggle, all-complete state, reload persistence, uncheck passed; route details open');

    const blocked = await browser.newContext();
    await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage disabled'); } }); });
    const blockedPage = await blocked.newPage();
    await blockedPage.goto('http://127.0.0.1:4173/din-forste-tur.html');
    await blockedPage.locator('input[type="checkbox"]').first().check();
    assert.match(await blockedPage.locator('[data-checklist-status]').textContent(), /1 af 6/);
    assert.match(await blockedPage.locator('[data-storage-note]').textContent(), /kan ikke gemme/);
    results.push('Checklist remains usable with blocked localStorage');

    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    const noJsPage = await noJs.newPage();
    await noJsPage.goto('http://127.0.0.1:4173/din-forste-tur.html');
    assert.ok(await noJsPage.locator('.site-nav').isVisible());
    await noJsPage.locator('input[type="checkbox"]').first().check();
    assert.ok(await noJsPage.locator('input[type="checkbox"]').first().isChecked());
    assert.ok(await noJsPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    results.push('Without JS: mobile navigation and native checklist usable, no overflow');

    // Let an incoming native transition finish before changing its opt-in media query.
    await page.evaluate(async () => {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await page.locator('.button').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    stage = 'text resize';
    await page.setViewportSize({ width: 720, height: 900 });
    for (const file of pages) {
      await page.goto(`http://127.0.0.1:4173/${file}`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file}: text resize overflow`);
    }
    results.push('Reduced motion and 200% text size at 720px: passed');
    for (const file of pages) {
      await page.goto('file:///' + path.resolve(file).replaceAll('\\', '/'));
      await page.locator('img').evaluateAll(images => Promise.all(images.map(image => {
        image.loading = 'eager';
        return image.decode();
      })));
      assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
    }
    results.push('All four direct file:// pages load assets without a server');
    assert.deepEqual(errors, [], 'Browser or resource errors');
    results.push('No page errors or HTTP resource failures observed');
    await fs.writeFile('.qa/results.json', JSON.stringify({ date: new Date().toISOString(), results }, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
