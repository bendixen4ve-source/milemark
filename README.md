# MILEMARK

En statisk, begyndervenlig dansk guide til landevejscykling. Bygget med HTML, CSS og vanilla JavaScript.

## Sider

- `index.html` — Forside
- `kom-i-gang.html` — fire trin til første tur
- `cykel-og-udstyr.html` — cykelvalg, nødvendigt udstyr og vedligeholdelse
- `din-forste-tur.html` — tjekliste, ruteidéer og praktisk turvejledning

## Lokal visning

Åbn `index.html` direkte i en browser. Alle sider og assets bruger relative stier.
For en preview over HTTP, hvis Node.js er installeret:

```sh
node tools/preview.cjs
```

Åbn derefter http://127.0.0.1:4173. Stop serveren med Ctrl+C.
Lokal lagring kan opføre sig forskelligt ved `file://`; tjeklisten fungerer også uden lagring.

## Struktur

- `css/tokens.css` — centrale designværdier
- `css/styles.css` — fælles komponenter og responsive layouts
- `js/main.js` — menu og tjekliste
- `assets/images/` — optimerede godkendte Figma-billeder og logo
- `assets/fonts/` — lokale fonte og SIL Open Font License-filer
- `design-references/` — brugerens screenshots, Figma-originaler og assetkilder
- `tools/` — preview, assetoptimering, kontrol og klargøring til upload
- `IMPLEMENTATION_NOTES.md` — designbeslutninger og faktisk gennemførte checks

Der er ingen runtime-dependencies, tracking, API-integration eller backend.

## Kontrol

Testværktøjerne er kun til udvikling og ligger i den ignorerede `.qa/`-mappe.
Ved en ny installation:

```sh
npm install --prefix .qa --no-audit --no-fund playwright sharp @axe-core/playwright html-validate
.qa/node_modules/.bin/playwright install chromium
node tools/verify.cjs
```

På Windows kan `npm.cmd` og `.qa/node_modules/.bin/playwright.cmd` bruges.
Kontrollen gemmer resultater i `.qa/results.json` og screenshots i `.qa/screenshots/`.

Motion og interaktioner kontrolleres desuden med `node tools/verify-motion.cjs`.
Resultater og browseroptagelser gemmes i `.qa/motion/`. Kør før genpakning, hvis
den eksisterende `dist/` skal bruges som baseline for uændrede layouts.

Footerens accordion, links, tilgængelighed og responsive layout kontrolleres med
`node tools/verify-footer.cjs`. Resultater og billeder gemmes i `.qa/footer/`.

## GitHub Pages

Workflowen `.github/workflows/pages.yml` uploader kun indholdet af den versionsstyrede
`dist/`-mappe ved push til `main` eller manuel workflowstart. Den følger
[GitHubs officielle Pages-workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
Source, designreferencer og dokumentation bevares i repositoryet, men indgår ikke
i den publicerede webside. `.qa/`, IDE-filer og lokale credentials ignoreres.

GitHub CLI var ikke tilgængelig ved klargøringen. Repository og live Pages-site er
derfor endnu ikke oprettet. Installer CLI i PowerShell:

```powershell
winget install --id GitHub.cli --exact
```

Genstart terminalen, og log ind via browseren (vælg din ønskede GitHub-konto):

```sh
gh auth login --hostname github.com --git-protocol https --web
gh auth status
```

Når login er klar, kan repositoryet oprettes uden et for tidligt workflowpush:

```sh
gh repo create milemark --public --source=. --remote=origin
```

Åbn repositoryets **Settings → Pages → Build and deployment → Source** og vælg
**GitHub Actions**. Push derefter den eksisterende lokale commit:

```sh
git push -u origin main
```

Workflowens deployment-output viser den faktiske URL. Projektstien er `/milemark/`;
alle HTML-links, billeder, fonte, CSS og JavaScript er relative. Ingen custom domain,
`CNAME` eller DNS er konfigureret. Log aldrig adgangstokens i repositoryet.

Ved senere ændringer: opdater source, genpak og kontrollér produktionspakken før push:

```sh
node tools/package-site.cjs
node tools/verify-pages.cjs
git add .
git commit -m "Update MILEMARK website"
git push
```

`verify-pages.cjs` bruger de eksisterende lokale Playwright-devværktøjer og serverer
kun `dist/` under `/milemark/`; resultater ligger i `.qa/pages/`. GitHub Actions
publicerer den committede dist-pakke og foretager ikke et skjult build.
Live workflow, URL og sider skal kontrolleres efter første push.

## Simply.com — alternativ upload

Klargør en mappe med kun produktionsfiler:

```sh
node tools/package-site.cjs
```

Upload **indholdet** af `dist/` til webhotellets dokumentrod eller den ønskede undermappe.
Intet build eller Node.js er nødvendigt på serveren. De fire HTML-filer skal ligge sammen,
med `assets/`, `css/` og `js/` ved siden af. Ingen URL-rewrite er nødvendig.
Undlad at uploade `.qa/`, `.idea/`, designreferencer og udviklingsværktøjer.

Efter upload: åbn hver HTML-adresse direkte, test mobilmenu og tjekliste, og kontrollér billeder.
Der er ikke deployet fra denne session.

## Kendt billedbegrænsning

Desktopheroen på Cykel & udstyr bruger den godkendte mobilreferences cykelrytter.
Det oprindelige nærbillede af hjul var ikke tilgængeligt som asset. Forsidens tre guidebilleder
er lavopløselige Figma-eksporter. Erstat med de samme motiver i højere opløsning, hvis originalerne bliver tilgængelige.
