const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('../.qa/node_modules/playwright');
const AxeBuilder = require('../.qa/node_modules/@axe-core/playwright').default;
const server = require('./preview.cjs');

const pages = ['index.html', 'kom-i-gang.html', 'cykel-og-udstyr.html', 'din-forste-tur.html'];
const results = [];

async function frames(page, selector, pseudo = null, count = 24) {
  return page.locator(selector).first().evaluate((element, { pseudo, count }) => new Promise(resolve => {
    const samples = [];
    function sample() {
      const style = getComputedStyle(element, pseudo);
      samples.push({ opacity: Number(style.opacity), transform: style.transform, background: style.backgroundColor });
      if (samples.length === count) resolve(samples);
      else requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }), { pseudo, count });
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
  });
}

async function main() {
  await fs.mkdir('.qa/motion', { recursive: true });
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: '.qa/motion', size: { width: 1440, height: 1000 } } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.addInitScript(() => {
      window.motionEvidence = { reveals: [], transitions: [], layoutShifts: [], shiftDetails: [] };
      document.addEventListener('animationstart', event => {
        if (event.target.classList?.contains('reveal-enter')) {
          window.motionEvidence.reveals.push({ text: event.target.textContent.trim().slice(0, 50), duration: getComputedStyle(event.target).animationDuration });
        }
      });
      window.addEventListener('pagereveal', event => {
        if (!event.viewTransition) return;
        event.viewTransition.ready.then(() => {
          window.motionEvidence.transitions.push({
            names: document.getAnimations().map(animation => animation.animationName),
            heroAnimation: getComputedStyle(document.querySelector('.hero-content')).animationName
          });
        }).catch(() => {});
      });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.motionEvidence.layoutShifts.push(entry.value);
            window.motionEvidence.shiftDetails.push({ value: entry.value, time: entry.startTime, sources: entry.sources.map(source => ({ tag: source.node?.tagName, className: source.node?.className, before: source.previousRect.toJSON(), after: source.currentRect.toJSON() })) });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // The previous deployment package is the layout baseline until this pass is packaged.
    for (const file of pages) {
      for (const width of [320, 402, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const geometry = async url => {
          await page.goto(url);
          await settle(page);
          return page.locator('.header-inner, .hero, .hero h1, .page-section, .cards, .card, .checklist').evaluateAll(elements =>
            elements.map(element => {
              const rect = element.getBoundingClientRect();
              return { x: Math.round(rect.x + scrollX), y: Math.round(rect.y + scrollY), width: Math.round(rect.width), height: Math.round(rect.height) };
            }));
        };
        const baseline = await geometry('http://127.0.0.1:4173/dist/' + file);
        const current = await geometry('http://127.0.0.1:4173/' + file);
        assert.deepEqual(current, baseline, file + ': layout changed at ' + width);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.ok(await page.locator('main h1, main h2, main h3, main p, main a, main label').evaluateAll(elements =>
          elements.every(element => getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).display !== 'none' && Number(getComputedStyle(element).opacity) > 0)));
      }
    }
    results.push('All four pages @ 320/402/768/1440: preserved header/main geometry identical to dist; no overflow or hidden essential content');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://127.0.0.1:4173/index.html');
    await settle(page);
    await page.locator('.site-nav a').nth(1).hover();
    const underline = await frames(page, 'nav li:nth-child(2) a', '::after');
    assert.ok(underline.some(sample => sample.transform !== 'matrix(1, 0, 0, 1, 0, 0)'));
    assert.equal(underline.at(-1).transform, 'matrix(1, 0, 0, 1, 0, 0)');
    assert.equal(await page.locator('.site-nav a[aria-current]').evaluate(element => getComputedStyle(element, '::after').transform), 'matrix(1, 0, 0, 1, 0, 0)');
    await page.screenshot({ path: '.qa/motion/navigation-hover.png' });
    await page.mouse.move(1, 1);
    await frames(page, 'nav li:nth-child(2) a', '::after');
    assert.equal(await page.locator('.site-nav li:nth-child(2) a').evaluate(element => getComputedStyle(element, '::after').transform), 'matrix(0, 0, 0, 1, 0, 0)');
    await page.locator('.site-nav li:nth-child(2) a').focus();
    assert.equal(await page.locator('.site-nav li:nth-child(2) a').evaluate(element => getComputedStyle(element).outlineStyle), 'solid');
    results.push('Navigation: live underline interpolation and return; active underline persists; keyboard focus visible');

    const button = page.locator('.hero .button');
    await button.hover();
    const buttonSamples = await frames(page, '.hero .button');
    assert.equal(buttonSamples.at(-1).transform, 'matrix(1, 0, 0, 1, 0, -1)');
    assert.equal(await button.locator('.arrow').evaluate(element => getComputedStyle(element).transform), 'matrix(1, 0, 0, 1, 3, 0)');
    await page.screenshot({ path: '.qa/motion/button-hover.png' });
    await page.mouse.move(1, 1);
    await frames(page, '.hero .button');
    assert.equal(await button.evaluate(element => getComputedStyle(element).transform), 'none');
    await page.locator('.photo-card').first().hover();
    await frames(page, '.photo-card');
    assert.equal(await page.locator('.photo-card').first().evaluate(element => getComputedStyle(element).transform), 'matrix(1, 0, 0, 1, 0, -3)');
    assert.equal(await page.locator('.photo-card > img').first().evaluate(element => getComputedStyle(element).transform), 'matrix(1.025, 0, 0, 1.025, 0, 0)');
    await page.screenshot({ path: '.qa/motion/card-hover.png' });
    results.push('Primary button and photo card: live lift, arrow, clipped image zoom and return checked');

    await page.goto('http://127.0.0.1:4173/kom-i-gang.html');
    await settle(page);
    await page.locator('.button-outline').hover();
    await frames(page, '.button-outline');
    assert.equal(await page.locator('.button-outline').evaluate(element => getComputedStyle(element).backgroundColor), 'rgba(255, 255, 255, 0.12)');
    await page.mouse.move(1, 1);
    await page.locator('.card').first().hover();
    await frames(page, '.card');
    assert.equal(await page.locator('.card-photo img').first().evaluate(element => getComputedStyle(element).transform), 'matrix(1.025, 0, 0, 1.025, 0, 0)');
    results.push('Secondary button and standard guide card match shared interaction timing');

    await page.setViewportSize({ width: 402, height: 900 });
    await page.goto('http://127.0.0.1:4173/kom-i-gang.html');
    await settle(page);
    const before = await page.evaluate(() => window.motionEvidence.reveals.length);
    await page.locator('.card').nth(2).scrollIntoViewIfNeeded();
    const revealSamples = await frames(page, '.card:nth-child(3)');
    assert.ok(revealSamples.some(sample => sample.opacity >= .94 && sample.opacity < 1));
    assert.equal(revealSamples.at(-1).opacity, 1);
    const revealed = await page.evaluate(() => window.motionEvidence.reveals.length);
    assert.ok(revealed > before);
    await page.locator('h1').scrollIntoViewIfNeeded();
    await page.locator('.card').nth(2).scrollIntoViewIfNeeded();
    await frames(page, '.card:nth-child(3)');
    assert.equal(await page.evaluate(() => window.motionEvidence.reveals.length), revealed);
    await page.screenshot({ path: '.qa/motion/mobile-reveal-finished.png', fullPage: true });
    results.push('Scroll reveal: sampled opacity/transform during entry, final opacity 1, no repeat on scroll back');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://127.0.0.1:4173/index.html');
    await settle(page);
    await Promise.all([
      page.waitForURL('**/kom-i-gang.html'),
      page.locator('.site-nav a').nth(1).click()
    ]);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => window.motionEvidence.transitions.length > 0, null, { timeout: 5000 });
    await settle(page);
    const native = await page.evaluate(() => window.motionEvidence.transitions);
    assert.ok(native.length && native.some(transition => transition.names.includes('page-enter')), 'Native MPA transition not observed');
    assert.ok(native.every(transition => transition.heroAnimation === 'none'), 'Entry fallback played during native transition');
    results.push('Native cross-document View Transition observed via pagereveal; no navigation interception or double hero animation');

    await page.goto('http://127.0.0.1:4173/din-forste-tur.html');
    await settle(page);
    const boxes = await page.locator('.checklist input').all();
    await boxes[0].check();
    const checkSamples = await frames(page, '#klar-cykel', '::after');
    assert.ok(checkSamples.some(sample => sample.opacity > 0 && sample.opacity < 1));
    assert.equal(checkSamples.at(-1).opacity, 1);
    for (const box of boxes) await box.check();
    await settle(page);
    assert.ok(await page.locator('.checklist').evaluate(element => element.classList.contains('is-complete')));
    assert.equal(await page.locator('.checklist').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(245, 242, 234)');
    await page.screenshot({ path: '.qa/motion/checklist-complete.png' });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(violation => violation.id), []);
    await boxes[0].uncheck();
    await settle(page);
    assert.ok(!(await page.locator('.checklist').evaluate(element => element.classList.contains('is-complete'))));
    results.push('Checkmark animation sampled; completion treatment and reversal work; axe passes completed state');

    const touchContext = await browser.newContext({ viewport: { width: 402, height: 900 }, isMobile: true, hasTouch: true });
    const touchPage = await touchContext.newPage();
    await touchPage.goto('http://127.0.0.1:4173/index.html');
    await settle(touchPage);
    await touchPage.locator('.nav-toggle').tap();
    assert.equal(await touchPage.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
    await Promise.all([touchPage.waitForURL('**/din-forste-tur.html'), touchPage.locator('.site-nav a').nth(3).tap()]);
    await touchPage.locator('.checklist label').first().tap();
    assert.ok(await touchPage.locator('.checklist input').first().isChecked());
    await touchPage.locator('summary').first().tap();
    assert.notEqual(await touchPage.locator('details').first().getAttribute('open'), null);
    await settle(touchPage);
    assert.equal(await touchPage.locator('.hero .button').evaluate(element => getComputedStyle(element).transform), 'none');
    assert.ok(await touchPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await touchPage.screenshot({ path: '.qa/motion/touch-402.png', fullPage: true });
    await touchContext.close();
    results.push('402px touch emulation: menu, navigation, checkbox and route details work; no sticky hover lift');

    // Freeze the real CSS transition at its midpoint for visual inspection.
    await page.goto('http://127.0.0.1:4173/index.html');
    await settle(page);
    await page.evaluate(() => { window.motionEvidence.layoutShifts = []; });
    await page.mouse.move(1, 1);
    await page.locator('.site-nav a').nth(1).hover();
    await page.locator('.site-nav a').nth(1).evaluate(element => {
      element.getAnimations({ subtree: true }).forEach(animation => {
        animation.pause();
        animation.currentTime = 120;
      });
    });
    await page.screenshot({ path: '.qa/motion/underline-midpoint.png' });
    await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));
    await page.locator('.hero .button').hover();
    await page.locator('.hero .button').evaluate(element => {
      element.getAnimations({ subtree: true }).forEach(animation => {
        animation.pause();
        animation.currentTime = 120;
      });
    });
    await page.screenshot({ path: '.qa/motion/button-midpoint.png' });
    await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));
    await settle(page);
    await fs.writeFile('.qa/motion/layout-shifts.json', JSON.stringify(await page.evaluate(() => window.motionEvidence.shiftDetails), null, 2));
    assert.deepEqual(await page.evaluate(() => window.motionEvidence.layoutShifts), [], 'Hover motion introduced layout shift');
    results.push('Live CSS transition midpoint screenshots saved; no layout shifts during hover observed');

    const fallbacks = [
      { name: 'No JavaScript', options: { javaScriptEnabled: false } },
      { name: 'No IntersectionObserver', init: () => { delete window.IntersectionObserver; } },
      { name: 'Observer throws', init: () => { window.IntersectionObserver = class { constructor() { throw new Error('Unavailable'); } }; } },
      { name: 'Reduced motion', options: { reducedMotion: 'reduce' } }
    ];
    for (const fallback of fallbacks) {
      const fallbackContext = await browser.newContext({ viewport: { width: 402, height: 900 }, ...fallback.options });
      if (fallback.init) await fallbackContext.addInitScript(fallback.init);
      const fallbackPage = await fallbackContext.newPage();
      for (const file of pages) {
        await fallbackPage.goto('http://127.0.0.1:4173/' + file);
        if (fallback.options?.javaScriptEnabled !== false) await settle(fallbackPage);
        assert.equal(await fallbackPage.locator('.reveal-enter').count(), 0);
        assert.ok(await fallbackPage.locator('main').evaluate(element => getComputedStyle(element).opacity === '1'));
        assert.ok(await fallbackPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      if (fallback.name === 'No JavaScript') {
        for (const box of await fallbackPage.locator('.checklist input').all()) await box.check();
        await fallbackPage.screenshot({ path: '.qa/motion/no-js-checklist.png', animations: 'disabled' });
        assert.equal(await fallbackPage.locator('.checklist').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(245, 242, 234)');
      }
      if (fallback.name === 'Reduced motion') {
        assert.equal(await fallbackPage.locator('.hero-content').evaluate(element => getComputedStyle(element).animationName), 'none');
        await fallbackPage.locator('.checklist input').first().check();
        assert.equal(await fallbackPage.locator('.checklist input').first().evaluate(element => getComputedStyle(element, '::after').transitionDuration), '0s');
      }
      await fallbackContext.close();
      results.push(fallback.name + ': all pages visible, no reveal dependency or overflow');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.card').first().hover();
    assert.equal(await page.locator('.card').first().evaluate(element => getComputedStyle(element).transform), 'none');
    assert.equal(await page.locator('.reveal-enter').count(), 0);
    results.push('Runtime reduced-motion change removes reveal animations and hover movement');
    assert.deepEqual(errors, [], 'Console or page errors');
    results.push('No browser JavaScript or console errors observed');
    await context.close();
    await fs.writeFile('.qa/motion/results.json', JSON.stringify({ date: new Date().toISOString(), results, evidence: { underline, buttonSamples, revealSamples, checkSamples, native } }, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
