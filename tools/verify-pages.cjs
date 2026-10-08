// Serve only the production package at the same project prefix as GitHub Pages.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('../.qa/node_modules/playwright');
const root = path.resolve(__dirname, '..', 'dist');
const prefix = '/milemark/';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf' };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(prefix)) { response.writeHead(404).end(); return; }
    const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const data = await fs.readFile(target);
    response.writeHead(200, { 'Content-Type': (types[path.extname(target)] || 'application/octet-stream') + '; charset=utf-8' }).end(data);
  } catch { response.writeHead(404).end(); }
});
async function main() {
  await new Promise(resolve => server.listen(4174, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  const results = [];
  const errors = [];
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.addEventListener('pagereveal', event => {
        window.pagesTransitionDone = event.viewTransition?.finished.catch(() => {});
      });
    });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => {
      // Picture source selection/navigation may cancel superseded requests normally.
      if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(request.url());
    });
    for (const file of ['index.html', 'kom-i-gang.html', 'cykel-og-udstyr.html', 'din-forste-tur.html']) {
      for (const width of [402, 1440]) {
        await page.goto('about:blank');
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(`http://127.0.0.1:4174${prefix}${file}`);
        assert.equal(response.status(), 200);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await window.pagesTransitionDone;
          await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
        });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.naturalWidth > 0)));
        assert.ok(await page.evaluate(() => document.fonts.check('800 16px Manrope') && document.fonts.check('400 16px "DM Sans"')));
        for (const url of await page.locator('a').evaluateAll(links => links.map(link => link.href))) {
          const target = new URL(url);
          assert.ok(target.pathname.startsWith('/milemark/'), url);
          const destination = await context.request.get(target.href.split('#')[0]);
          assert.equal(destination.status(), 200, url);
          if (target.hash) assert.ok((await destination.text()).includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), url);
        }
        results.push(`${file} @ ${width}: /milemark/ assets, fonts, all links/anchors and layout passed`);
      }
    }
    await page.goto('about:blank');
    await page.setViewportSize({ width: 402, height: 900 });
    await page.goto('http://127.0.0.1:4174/milemark/');
    await page.locator('.nav-toggle').click();
    await Promise.all([page.waitForURL('**/milemark/din-forste-tur.html'), page.locator('.site-nav a').nth(3).click()]);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await window.pagesTransitionDone;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    await page.locator('[data-checklist] input').first().check();
    await page.reload();
    assert.ok(await page.locator('[data-checklist] input').first().isChecked());
    await page.locator('.footer-section > summary').first().click();
    await page.locator('.footer-section nav a').first().waitFor({ state: 'visible' });
    assert.deepEqual(errors, []);
    results.push('Project root, mobile navigation, checklist reload persistence and footer passed; no browser/resource errors');
    await fs.mkdir('.qa/pages', { recursive: true });
    await fs.writeFile('.qa/pages/results.json', JSON.stringify(results, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
