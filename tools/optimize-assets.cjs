const sharp = require('../.qa/node_modules/sharp');
const path = require('node:path');
const fs = require('node:fs/promises');

const images = {
  '709a3': ['hero-forside', 1800], '04bc8': ['hero-kom-i-gang', 1600],
  'b1181': ['hero-forste-tur', 1800], '06870': ['guide-cykel', 700],
  '429a9': ['guide-rute', 700], '6e1d5': ['guide-udstyr', 700],
  '4c1c3': ['trin-cykel', 700], '6f6a7': ['trin-rute', 700],
  '5d730': ['trin-udstyr', 700], '3a6a6': ['trin-afsted', 700],
  '18099': ['rute-kyst', 700], 'a0e10': ['rute-landsby', 700],
  '9cfde': ['rute-skov', 700]
};

async function main() {
  for (const [source, [name, width]] of Object.entries(images)) {
    const input = path.join('design-references/source-assets', source + '.png');
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`assets/images/${name}.webp`);
    if (name.startsWith('hero-')) {
      await sharp(input).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`assets/images/${name}-900.webp`);
    }
  }
  await sharp('design-references/source-assets/a9eae.png').trim().resize({ width: 600 }).png().toFile('assets/images/milemark-logo.png');
  for (const [source, name] of Object.entries({ d09a1: 'cykel', '93acd': 'rute', c3938: 'faellesskab', c43e4: 'natur' })) {
    await sharp(`design-references/source-assets/${source}.png`).resize({ width: 96 }).webp({ lossless: true }).toFile(`assets/images/ikon-${name}.webp`);
  }
  const files = (await fs.readdir('assets/images')).filter(file => !/^[a-f0-9]{5}\.png$/.test(file));
  for (const file of files) {
    const meta = await sharp(`assets/images/${file}`).metadata();
    const stat = await fs.stat(`assets/images/${file}`);
    console.log(`${file}: ${meta.width} x ${meta.height}, ${Math.round(stat.size / 1024)} KB`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
