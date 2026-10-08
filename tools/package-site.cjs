const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const root = path.resolve(__dirname, '..');
  const destination = path.join(root, 'dist');
  await fs.mkdir(destination, { recursive: true });
  for (const file of ['index.html', 'kom-i-gang.html', 'cykel-og-udstyr.html', 'din-forste-tur.html']) {
    await fs.copyFile(path.join(root, file), path.join(destination, file));
  }
  for (const directory of ['css', 'js', 'assets']) {
    await fs.cp(path.join(root, directory), path.join(destination, directory), { recursive: true });
  }
  console.log('Static upload files ready in ' + destination);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
