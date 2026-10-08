# MILEMARK — implementeringsnoter

## Grundlag og faktisk workflow

Codex læste projektets `AGENTS.md` og custom skillen i **roden som `SKILL.md`**.
Den oprindeligt angivne sti `.agents/skills/milemark-figma-to-code/SKILL.md` findes ikke.
Skillen blev fundet via filinventaret; den blev ikke opfundet eller erstattet.
Derudover blev `implement-design-figma-jb` og Figma-serverens `figma-design-to-code` læst i den første session.

Figma MCP blev brugt til metadata, framehierarki, designkontekst, screenshots,
typografi og asset-URL'er i den første session. Starter-planens kaldgrænse blev nået.
Efter brugerens opdaterede instruktion blev **ingen yderligere Figma MCP-kald foretaget**.
De allerede hentede data blev kombineret med fem lokale referencebilleder, som alle blev åbnet og gennemgået.
Hele referencebilleder er ikke brugt som baggrunde eller websiteindhold.

| Side / specifikation | Figma MCP-designkontekst | Lokal screenshotreference |
| --- | --- | --- |
| Forside | Desktop `1:420`, mobil `1:597` | `design-references/Forside.png` |
| Kom i gang | Mobil `1:782`; desktoplayout rekonstrueret fra screenshot | `design-references/Kom i gang.png` |
| Cykel & udstyr | Mobil `7:79`; desktoplayout rekonstrueret fra screenshot | `design-references/Cykel og udstyr.png` |
| Din første tur | Desktop `8:178`; mobillayout rekonstrueret fra screenshot | `design-references/Din første tur.png` |
| Style Tile | Metadata tidligere hentet; komplet designkontekst var blokeret | `design-references/Styletile.png` |

Metadata identificerede også desktopframes `1:713`, `7:10`, mobilframe `8:286`
og Style Tile `1:177`. Metadata er ikke det samme som en komplet designinspektion.
Inspiration og præsentationsmoodboard er ikke visuelt gennemgået; præsentationsmoodboardets designkontekst blev blokeret.

### Målte værdier og rekonstruktion

- Desktopframes: 1440 × 1024. Mobilframes: 402px brede med forskellige højder.
- Figma-data for forsiden: desktopheader cirka 121px, herooverskrift Manrope ExtraBold 96px,
  sektionsoverskrift 48px, grøn `#344B3F`, accent `#D9A36C`, billedkortradius 16px.
- Mobildata: herooverskrift cirka 40px og flere korttekster ned til 8–10px.
- Style Tile og data angiver Manrope til overskrifter og DM Sans til brødtekst/UI.
- Paletten er bevaret. Hvid er hovedbaggrund, som i screenshots; varm neutral og sage er sekundære tokens.
- Desktopkompositionerne uden designkontekst er fortolket fra screenshots. Spacing dér er
  implementeringsvalg, **ikke påståede Figma-målinger**.

## Implementeringsbeslutninger

- Præcis fire HTML-sider med relative links; ingen router, framework eller backend.
- Navigation og footer står direkte i hver HTML-fil, så de virker uden JavaScript.
  CSS og interaktionskode deles. Gentaget navigation er bevidst for en enkel statisk løsning.
- Originalt MILEMARK-logo hentet fra Figma; transparent yderkant trimmet uden at ændre wordmarken.
- Fotografi hentet fra tidligere asset-URL'er. Sharp blev brugt til størrelsestilpasning og WebP.
  Heroerne findes i stor og 900px-variant, valgt med `picture`.
- Manrope og DM Sans er hentet lokalt fra Google Fonts med deres OFL-licenser.
  Der er ingen eksterne fontrequests ved brug af websitet.
- Billeder i heroer og kort er dekorative, fordi tekstindholdet forklarer funktionen;
  logoet har alternativ tekst og hjemlinket et tilgængeligt navn.
- Figma viser spejlede fotos på Forside og Kom i gang. Retningen bevares med CSS.
- Simple kort-hovereffekter, pilbevægelse og glidende ankerlinks er implementeret.
  Reduced motion deaktiverer bevægelser. Intet indhold skjules bag revealanimationer.
- Tjeklisten bruger native checkbokse i en fieldset. Den har ingen submitfunktion og er derfor
  ikke et formularindsendelsesflow.
- Git-check viste, at mappen ikke er et repository. Der er ikke initialiseret Git, oprettet commits eller deployet.

## Begrundede forskelle fra Figma

1. **Mobiltekst og kort:** meget små tekster og forskudte, smalle kort er erstattet med læsbare kort i én kolonne.
   Forsidens fordele er et 2 × 2-grid på mobil. Touchmål er mindst cirka 44px.
2. **Heroer:** tekst styrer højden; billeder beskæres responsivt, og mørk overlay forbedrer kontrasten.
   Overskriften på Kom i gang følger desktopbudskabet på begge størrelser frem for mobilmockuppens gentagelse af forsiden.
3. **Introvideo:** ingen video er leveret. Kontrollen er erstattet af relevant guide- eller rådlink.
4. **Rutekort:** mockuppens præcise afstande, højdemeter, tider og sværhedsgrader er fjernet.
   Kortene er tydeligt mærket Ruteidé og åbner konkrete planlægningsråd med native `details`.
5. **Udstyrpanel:** påstande om løbende produktopdateringer og prisbaserede anbefalinger er erstattet
   med faktiske råd om komfort, budget og vedligeholdelse.
6. **Guidedestinationer:** kompakt uddybende tekst på Cykel & udstyr og Din første tur giver kortenes
   links reelle destinationer inden for de fire sider. Det tilføjer ingen primære sider.
7. **Desktophero Cykel & udstyr:** hjulbilledets originale asset er ikke blandt de hentede filer.
   Den samme godkendte cykelrytter som i sidens mobilreference bruges. Dette er den største billedafvigelse.
8. **Footer og afsluttende CTA:** en enkel footer og et reelt næste skridt understøtter navigationen.
9. **Forsidens kortfotos:** de eksporterede billedfiler er kun cirka 180–200px brede.
   De er bevaret frem for at indsætte andre motiver; de kan virke bløde ved større visning.

## Responsive beslutninger

Fluid gutter, `clamp()`-typografi, Flexbox og CSS Grid erstatter absolut positioneret Figma-layout.
Ved 48rem får kort og rådtekst flere kolonner; ved 72rem får navigationen fuld desktopvisning
og oversigterne deres sidepaneler. Breakpoints er samlet i den fælles CSS og kommenteret,
fordi CSS-custom properties ikke kan bruges direkte i media query-betingelser.
Ingen faste teksthøjder. Mobilmenuens links er synlige uden JS; JS forbedrer dem til en foldbar menu.

## Interaktioner

- Aktiv navigation med `aria-current="page"`.
- Menu med `aria-expanded`, Åbn/Luk-label, Escape, fokus tilbage til knappen,
  lukning ved linkvalg, klik udenfor, fokus udenfor og desktopresize.
- Seks tjeklistepunkter, synligt flueben, overstreget tekst og live-status med antal.
- Alle punkter krydset af giver en opmuntrende slutstatus uden at love sikkerhed.
- Lokal lagring i denne browser, med fallback ved blokeret eller ugyldig lagring.
- Tastaturbetjente native ruteforklaringer, ankerlinks, skip-link og synlig fokusmarkering.

## Problemer og iterationer

- Figma-kaldgrænse: løst med brugerens accepterede screenshotfallback og tidligere assetdata.
- Custom skill på forkert sti: fundet og læst i roden; ikke flyttet.
- Windows blokerede direkte kørsel af asset-downloadscriptet: de lokale scriptkommandoer blev
  kørt via den aktive PowerShell-session uden at ændre maskinens execution policy.
- HTML-validator fandt doctypeformat, whitespace, et råt ampersand og en formular uden indsendelse:
  rettet til ensartet HTML og en tjeklistecontainer med fieldset.
- Første billedtest behandlede endnu ikke hentede lazy-billeder som fejl:
  testen henter og dekoder alle billeder før kontrol.
- Testklik på en overskrift dækket af menu: test rettet til et synligt område udenfor.
- Resizeevent er asynkron: testen venter nu på det faktiske menu-state.
- Visuel gennemgang fandt for høj beskæring af cykelrytter i desktopheroen:
  object-position rettet, og screenshots genereret igen.
- Kortlinks på desktop flugtede ikke: flex i kortenes indhold holder dem ved bunden.

## Gennemført verifikation

Kørt lokalt i Chromium via Playwright den 8. oktober 2026:

- HTML-Validate: alle fire sider passerer den anbefalede regelkonfiguration.
- `node --check js/main.js`: passeret.
- 4 sider × 7 bredder: 320, 375, 390, 402, 768, 1024 og 1440px.
  Ingen vandret overflow; alle billedfiler blev indlæst og dekodet.
- Alle linkdestinationer blev kontrolleret med HTTP, og alle ankre fundet i destinationsfilen.
- Axe-core ved 402 og 1440px på hver side: ingen rapporterede WCAG A/AA-overtrædelser
  inden for de valgte WCAG 2/2.1/2.2-tags. Dette er ikke en fuld WCAG-certificering.
- Menu: Enter, Tab, Escape/fokus, destinationslink, klik udenfor og resize.
- Tjekliste: Space, alle afkrydset, status, genindlæsning, fravalg og blokeret localStorage.
- Ruteforklaring åbnes korrekt.
- JavaScript slået fra ved 320px: navigation og native checkbokse virker.
- Reduced motion og 200% tekststørrelse ved 720px: ingen overflow.
- Alle fire sider åbnet via `file://`, og billeder indlæst.
- Ingen observerede page errors eller fejlede HTTP-resourcekald.
- Produktionspakken i `dist/`: 37 filer, cirka 1,63 MB i alt. Alle pakkede filer blev
  sammenlignet byte for byte med de testede kildefiler. Ingen midlertidige Figma-URL'er,
  inline styles eller placeholderlinks blev fundet i HTML/CSS/JS.

Otte browserscreenshots ved 402 og 1440px blev åbnet og visuelt sammenholdt med lokale designreferencer.
Ikke en pixelmåling: større tekst og kort øger sidernes højder i forhold til mockups.
Testresultater og screenshots ligger lokalt i `.qa/`; de er ikke opdigtede eller deployet.

### Ikke verificeret

Safari, Firefox, fysisk mobiltelefon, egentlig skærmlæserbetjening og et live Simply.com-webhotel.
Test før publicering: åbn alle fire live-URL'er, brug menu med touch, tab gennem siderne,
prøv listen og route-details i Safari/Firefox, og kontrollér 200% zoom samt font/billedindlæsning.

## Tre nyttige instruktioner fra de faktiske prompts

Dette er uddrag af brugerens faktiske instruktioner, ikke tre fiktive separate prompts:

1. Masterprompt: “Do not create fake video players, fake maps, or dead-end buttons.”
   Resultat: videoalternativer og ruteforklaringer uden opdigtet rutedata.
2. Fortsættelsesprompt: “Screenshots are an acceptable fallback.”
   Resultat: de manglende desktop/mobillayouts kunne bygges fra de lokale referencebilleder.
3. Fortsættelsesprompt: “Improve the mobile layouts where text, spacing, or cards are too small.”
   Resultat: læsbar mobiltekst, større touchmål og stablede kort.

## HTML-eksempel til linjevis forklaring

Fra `din-forste-tur.html`:

```html
<fieldset>
  <legend class="sr-only">Forberedelse før din første tur</legend>
  <label>
    <input type="checkbox" id="klar-cykel" name="cykel">
    <span>Cyklen er klar og i god stand</span>
  </label>
</fieldset>
```

Fieldset grupperer kontrollerne; legend giver gruppen et navn; label forbinder teksten
med den indlejrede native checkbox; id bruges til den lokale lagring.
Native tastaturbetjening fungerer også uden JavaScript.

## CSS-eksempel til linjevis forklaring

Fra `css/styles.css`:

```css
.container {
  width: min(calc(100% - 2 * var(--page-gutter)), var(--content-width));
  margin-inline: auto;
}

@media (min-width: 48rem) {
  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

Containeren bruger viewportens plads minus to gutters, men aldrig over maksimalbredde.
Automatiske inline-margener centrerer den. Grid får tre lige brede kolonner, når der er plads;
`minmax(0, 1fr)` lader dem krympe uden at tekst tvinger grid'et ud over viewporten.

## Interaction- og motionforfinelse — 8. oktober 2026

AGENTS.md, den lokale SKILL.md og disse noter blev læst før ændringerne.
Ingen nye Figma MCP-kald, billeder, fonte eller dependencies. HTML, tekst og layouts
er bevaret. AI-arbejdet bestod af kodeinspektion, CSS/JavaScript-forfinelse og faktisk
browserkontrol med de eksisterende Playwright-, HTMLValidate- og axe-værktøjer.

- `css/tokens.css`: fælles varigheder på 150/240/360ms, easing og 10px revealafstand.
- `css/styles.css`: desktopunderstregning fra venstre, vedvarende aktiv markering,
  knapfarver og pilebevægelse, små kortløft og beskåret billedzoom. Hoverbevægelse
  gælder kun enheder med hover og fin pointer; eksisterende fokusmarkering bevares.
- CSS View Transitions er valgfri forbedring ved normal navigation mellem sider.
  Ingen navigation opsnappes. Heroindhold har en kort CSS-indgang som fallback.
  Implementeringen følger [MDN om @view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition).
- `js/main.js`: IntersectionObserver starter enkelte sektions-/kortanimationer én
  gang, med 60ms kortstagger på desktop. Der findes ingen skjult ventetilstand:
  indholdet er synligt uden JavaScript, uden observer og hvis observeren fejler.
- Native checkbokse får en kort checkmarktransition. CSS fremhæver den fuldførte
  liste også uden JavaScript; JavaScript fremhæver desuden den eksisterende status.
  De seks punkter, statustekst, lagring og håndtering af blokeret storage er bevaret.
- Reduceret bevægelse slår animationer og hoverbevægelse fra, også ved ændring af
  indstillingen under brug. Ingen loadinglag, kunstige forsinkelser eller biblioteker.

En første opacity på 0,86 gav en forbigående kontrastfejl i axe. Den blev ændret
til 0,94, hvorefter kontrastkontrollen bestod. Layoutskifttesten registrerede et
meget lille indlæsningsskift (0,000156) i navigation/tekst ved cirka 38ms; årsagen
er ikke endeligt isoleret. Der blev ikke registreret layoutskift under de målte
hoverinteraktioner. Der hævdes derfor ikke nul CLS for hele indlæsningen.

### Faktisk verificering af forfinelsen

`node tools/verify.cjs` bestod: alle fire sider ved syv bredder, HTML-validering,
axe ved mobil/desktop, links, billeder, menu, tastatur, checklistelagring inklusive
blokeret storage, ingen JavaScript, reduceret bevægelse, 200% tekst og direkte filer.

`node tools/verify-motion.cjs` bestod: alle fire sider ved 320/402/768/1440px,
samme endelige elementgeometri som den tidligere dist-pakke, ingen overflow eller
usynligt essentielt indhold. Live CSS-animationer blev målt undervejs og ved retur;
native sideovergang, engangsreveals, aktiv navigation, fokus, completion og reversal
blev kontrolleret. Fuldført tjekliste bestod axe. Touch ved 402px blev emuleret.
Manglende/fejlende IntersectionObserver og ændring til reduced motion blev testet.
Ingen observerede JavaScript- eller consolefejl. Browserscreenshots af animationernes
mellemstadier og mobilinteraktion blev åbnet og visuelt inspiceret.

Resultater, screenshots og video ligger i `.qa/motion/`. Testværktøjet sammenligner
med den eksisterende dist-pakke, så kør det før pakningen, hvis en tidligere version
skal bruges som layoutbaseline. `dist/` genbygges med de opdaterede produktionsfiler.

Safari, Firefox, fysisk telefon og live Simply.com er fortsat ikke testet.
Kontrollér især native sideovergange og touch/fokus i disse browsere før upload.
Ingen deployment er foretaget. De eksisterende HTML- og CSS-eksempler ovenfor
er fortsat egnede til rapportens linjevise forklaring.

## Endelig footer fra nye Figma-screenshots — 8. oktober 2026

AGENTS.md, SKILL.md, implementeringsnoter og eksisterende kode blev gennemgået.
Begge nye referencer, `Footer - Desktop.png` og `Footer - Mobile.png`, blev åbnet.
Ingen nye Figma MCP-kald: mål og proportioner er rekonstrueret fra screenshots,
ikke udgivet som målte Figma-nodeværdier. Den lokale skill og Figma-to-Code-skillen
guidede genbrug af komponenter, assetinventar og render–compare–verify-processen.

Alle fire HTML-filer deler nu den samme footerstruktur: grøn baggrund, eksisterende
wordmark vist hvid med CSS-filter, copyright/studieprojekt, tre kategorier og sociale
ikoner. Ved 64rem vises fem kolonner; ved mindre bredder vises native details/summary.
Kun footer-CSS og footerinitialisering er tilføjet. Header, heroer, indhold, assets,
checklistelogik og sideovergange er bevaret. HTML før footer er sammenlignet byte for
byte med den tidligere dist-pakke og er identisk.

### Bevidste forskelle og funktionel ærlighed

- Amber er lokalt lysnet til `#e4b888`, fordi den oprindelige accent gav en axe-kontrastfejl
  på de små overskrifter. Mobile overskrifter har mindst 44px touchhøjde; dette giver
  en lidt højere footer end mobilreferencen. Links er læsbare og ikke screenshot-skalerede.
- Privatlivspolitik og Terms of service er designplaceholders. Der er ikke oprettet
  juridiske dokumenter eller ekstra sider. Det minimale alternativ er tre små native
  disclosures under POLITIK: Privatliv og lagring, Cookies og Om studieprojektet.
  De beskriver kun den inspicerede kode: seks checkboxvalg under localStorage-nøglen
  `milemark-checklist-v1`, ingen indsendelse, ingen cookies/analytics og ingen konti/webshop.
  Browserens webstedsdata kan fjerne den gemte tjekliste. Dette er praktisk information,
  ikke en påstand om juridisk godkendelse eller webhotellets eventuelle serverlogs.
- Sociale profiladresser mangler. Instagram/Facebook/YouTube er ikke links eller
  fokusmål. Gruppen har et tilgængeligt navn, der forklarer, at profiler ikke er tilknyttet.
  Simple inline SVG-ikoner er rekonstrueret fra referencen; logoet er det eksisterende asset.
- Hurtig adgang bruger `index.html#guider`, `din-forste-tur.html#ruteideer`,
  `cykel-og-udstyr.html#vedligeholdelse` og `kom-i-gang.html#trin`.
- Uden JavaScript starter alle tre kategorier åbne, så indhold er tilgængeligt på
  desktop. På mobil kan de stadig foldes med native kontroller. JavaScript starter
  mobilsektionerne lukkede og holder desktopkolonnerne åbne uden fokus på overskrifterne.
- Åbne/lukkede tilstande annonceres af native details. CSS-details-animation og
  chevronrotation genbruger motiontokens; unsupported browsers får native instant
  toggles. Reduced motion deaktiverer overgangene.

### Faktiske checks

- `node --check js/main.js` bestod.
- `node tools/verify-footer.cjs` bestod på alle fire sider ved 320/402/768/1024/1440px:
  tastatur Enter/Space, synligt fokus, alle kategorier og politikforklaringer, axe i
  fuldt udvidet tilstand, ingen overflow. Alle otte navigationslinks blev klikket og
  ankre nået. No-JS, reduced motion, desktopresize og 402px touch-emulering bestod.
  Ingen observerede console- eller JavaScript-fejl. Resultater i `.qa/footer/`.
- Browserscreenshots ved 1440, 402 og 320px blev åbnet og visuelt sammenholdt med
  de to referencer; både lukket design og udvidet indhold blev inspiceret.
- `node tools/verify.cjs` bestod igen: HTML-validering, 28 side/bredde-kombinationer,
  links/billeder, mobilmenu, checklistelagring og blokeret storage, no-JS, reduced motion,
  200% tekst og direkte file-URL'er. Tests bruger nu eksplicit headernavigationen.
  Testens viewportændring afbrød først en native transition; den venter nu på den
  faktiske animation inden resize i stedet for at undertrykke fejlen.
- `node tools/verify-motion.cjs` bestod. Baselinekontrollen sammenligner nu kun de
  bevarede header-/mainkomponenter, fordi footerens layout er bevidst ændret.
  Ingen regression i eksisterende motion/checkliste, ingen observerede browserfejl.
- `dist/` er genbygget med de fire HTML-filer, fælles CSS/JS og uændrede assets.
  Alle 37 produktionsfiler er sammenlignet byte for byte med kildefilerne.

Ingen nye dependencies, Git-commits eller deployment. Safari, Firefox, fysisk telefon,
egentlig skærmlæser og live Simply.com er fortsat ikke verificeret. Kontrollér især
native disclosures og animationfallback i disse browsere før publicering.

## GitHub Pages-klargøring — 8. oktober 2026

AGENTS.md, SKILL.md, README og disse noter blev gennemgået. Git er initialiseret på
`main` med den eksisterende Git-forfatterkonfiguration. Source, assets, designreferencer,
fontlicenser og dokumentation bevares. `.gitignore` udelader QA-installation/optagelser,
IDE-filer, node_modules, midlertidige filer og lokale credentials. `dist/` versionsstyres
nu, så deployment publicerer den eksisterende, kontrollerede pakke.

`.github/workflows/pages.yml` starter på push til `main` eller manuel start. Den bruger
GitHubs officielle checkout/configure-pages/upload-pages-artifact/deploy-pages-actions,
uploader kun `dist/` og angiver Pages-/OIDC-permissions, deploymentenvironment og
concurrency. Der bygges ikke på serveren; genpak source lokalt før commit/push.
Ingen ændringer i HTML, design, runtime-JavaScript, CSS, assets eller DNS/CNAME.

`node tools/verify-pages.cjs` bestod med produktionspakken serveret under `/milemark/`:
alle fire sider ved 402/1440px, direkte URL'er, fonts, dekodede billeder, alle
linkdestinationer/ankre, ingen overflow, mobilnavigation, footer og lagring efter reload.
Ingen observerede browser-/resourcefejl. Testen venter på native overgangens finished
promise før reload; normalt afbrudte, erstattede picture-requests tælles ikke som 404'er.
Resultater er gemt i den ignorerede `.qa/pages/`.

115 staged filer er inspiceret via filinventar og en lokal mønsterscanning for almindelige
credentials/private keys. Ingen mistænkte secretmatches, filer over 50MB eller staged
QA-/IDE-filer blev fundet. Dette er en begrænset lokal scanning, ikke en sikkerhedscertificering.
Git whitespacekontrol bestod for kode/dokumentation; originalernes OFL-licenstekster
har eksisterende trailing whitespace og er bevaret uændret. Workflowen er manuelt
gennemgået mod GitHub Docs; ingen lokal YAML-parser er installeret.

GitHub CLI (`gh`) findes hverken på PATH eller i de kontrollerede standardmapper.
Autentifikation, public repository-oprettelse, push, remote Pages-konfiguration,
Actions-kørsel og live URL kan derfor ikke verificeres endnu. README beskriver CLI-
installation, browserlogin og GitHub Actions som Pages-source. Ingen tokens er
oprettet/gemt, og intet remote repository eller deployment påstås gennemført.
