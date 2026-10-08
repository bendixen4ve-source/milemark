const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('../.qa/node_modules/playwright');
const AxeBuilder = require('../.qa/node_modules/@axe-core/playwright').default;
const server = require('./preview.cjs');
const files = ['index.html', 'kom-i-gang.html', 'cykel-og-udstyr.html', 'din-forste-tur.html'];
const results = [];
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(document.getAnimations().map(a => a.finished.catch(() => {})));
  });
}
async function main() {
  await fs.mkdir('.qa/footer', { recursive: true });
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  const errors = [];
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    for (const file of files) {
      for (const width of [320, 402, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`http://127.0.0.1:4173/${file}`);
        await page.locator('.site-footer').scrollIntoViewIfNeeded();
        await settle(page);
        assert.equal(await page.locator('.footer-section').count(), 3);
        assert.equal(await page.locator('.footer-social a, .footer-social button, .footer-social [tabindex]').count(), 0);
        if (width < 1024) {
          for (const column of await page.locator('.footer-section').all()) {
            assert.equal(await column.getAttribute('open'), null);
            const summary = column.locator(':scope > summary');
            await summary.focus();
            assert.equal(await summary.evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
            await page.keyboard.press('Enter');
            await settle(page);
            assert.notEqual(await column.getAttribute('open'), null);
          }
        } else {
          assert.equal(await page.locator('.footer-section[open]').count(), 3);
          assert.equal(await page.locator('.footer-section > summary[tabindex="-1"]').count(), 3);
        }
        for (const note of await page.locator('.footer-note').all()) {
          await note.locator('summary').click();
          assert.ok(await note.locator('p').isVisible());
        }
        await settle(page);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
        if ([320, 402, 1024, 1440].includes(width) && file === 'index.html') {
          await page.locator('.site-footer').screenshot({ path: `.qa/footer/expanded-${width}.png` });
        }
        for (const note of await page.locator('.footer-note').all()) await note.locator('summary').click();
        if (width < 1024) {
          for (const column of await page.locator('.footer-section').all()) {
            await column.locator(':scope > summary').focus();
            await page.keyboard.press('Space');
            await settle(page);
            assert.equal(await column.getAttribute('open'), null);
          }
        }
        if (file === 'index.html' && [402, 1440].includes(width)) await page.locator('.site-footer').screenshot({ path: `.qa/footer/reference-${width}.png` });
        results.push(`${file} @ ${width}: footer layout, keyboard, disclosures, expanded axe and overflow passed`);
      }
    }
    // Links are exercised through the real footer, including destination hashes.
    await page.setViewportSize({ width: 1440, height: 900 });
    for (let i = 0; i < 8; i++) {
      await page.goto('http://127.0.0.1:4173/index.html');
      const link = page.locator('.footer-section nav a').nth(i);
      const target = await link.getAttribute('href');
      await Promise.all([page.waitForURL(`**/${target}`), link.click()]);
      await settle(page);
      if (target.includes('#')) assert.ok(await page.locator(`#${target.split('#')[1]}`).isVisible());
    }
    results.push('Eight footer navigation links clicked; destination pages and anchors reached');
    // Resize preserves accessible desktop state and returns to native mobile controls.
    await page.setViewportSize({ width: 402, height: 900 });
    await page.locator('.footer-section > summary').first().click();
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.waitForFunction(() => [...document.querySelectorAll('.footer-section')].every(d => d.open));
    await page.locator('.footer-section > summary').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.footer-section[open]').count(), 3);
    for (const mode of ['no-js', 'reduced']) {
      const fallback = await browser.newContext({ javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
      const test = await fallback.newPage();
      for (const width of [320, 1440]) {
        await test.setViewportSize({ width, height: 900 });
        await test.goto('http://127.0.0.1:4173/index.html');
        if (mode === 'no-js') {
          assert.equal(await test.locator('.footer-section[open]').count(), 3);
          if (width === 320) {
            await test.locator('.footer-section > summary').first().click();
            assert.equal(await test.locator('.footer-section[open]').count(), 2);
            await test.locator('.footer-section > summary').first().click();
          }
        } else {
          assert.equal(await test.locator('.footer-chevron').first().evaluate(e => getComputedStyle(e).transitionDuration), '0s');
          if (width === 320) await test.locator('.footer-section > summary').first().click();
        }
        await test.locator('.footer-section nav a').first().waitFor({ state: 'visible' });
        assert.ok(await test.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      await fallback.close();
      results.push(`${mode}: native controls and visible links at mobile and desktop`);
    }
    const touch = await browser.newContext({ viewport: { width: 402, height: 900 }, hasTouch: true, isMobile: true });
    const mobile = await touch.newPage();
    await mobile.goto('http://127.0.0.1:4173/index.html');
    await mobile.locator('.footer-section > summary').first().tap();
    assert.equal(await mobile.locator('.footer-section[open]').count(), 1);
    await touch.close();
    assert.deepEqual(errors, []);
    results.push('Touch emulation and desktop resize passed; no console or JavaScript errors');
    await fs.writeFile('.qa/footer/results.json', JSON.stringify(results, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
