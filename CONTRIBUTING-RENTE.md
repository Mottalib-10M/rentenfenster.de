# Seiten von Rentenfenster (de-rente) schreiben und erweitern

Notice pour les agents qui prolongent le site (retraite légale allemande : âge de départ, Abschlag, montant, net, Witwenrente, EM, réforme ; de + en).
À lire avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §3, §5, §6, §7, §9.3, §11, §17.4, §21, §26) et **`research/fakten.md`** (seuls faits autorisés).

## Principe : une page = un fichier

- `src/content/guides/<id>.ts` : guide (champ `mini`, ≥ 1 100 mots resume + FAQ + corps par langue) ;
- `src/content/rechner/<id>.ts` : page outil (champ `tool`, ≥ 450 mots) ;
- `src/content/jahrgang/jahrgang-<année>.ts` : page Jahrgang (outil `fenster` + `toolPreset: { jahr }`, ≥ 700 mots).

Liste fermée des pages prévues (id, dossier, slugs, groupe, mini/outil, requêtes KP) : `tests/planned-ids.json`.
Modèles : guide `src/content/guides/rente-mit-63.ts`, Jahrgang `src/content/jahrgang/jahrgang-1964.ts`, outil `src/content/rechner/rentenrechner-brutto-netto.ts`.
Copier la **structure**, jamais les phrases (`check-unique` ≤ 30 % entre pages ; une question de FAQ n'existe qu'une fois sur le site).

Le cœur (routes, menus, sitemap, hreflang, schémas, pied de page) lit ces fichiers seul : ne pas modifier `src/components`, `src/layouts`, `src/i18n`, `src/lib/*.ts` hors `minis/`, `src/pages`.

## Données et moteur

| Fichier | Contenu |
|---|---|
| `src/data/params-2026.json` | Toutes les valeurs (âges, Zugangsfaktor, Rentenwert, Rechengrößen, KV, PV, impôt 2026, Witwe, EM, réforme) + `sources` |
| `research/fakten.md` | Faits lus le 2026-10-15, avec la clé de source ; liste des interdits |
| `research/_cfg-de-rente.json` | Config passée à `new-site.py` |

Moteur (`src/lib/engine/`) : `alter.ts` (âges, début au mois, Abschlag, fenêtre, scénario réforme, break-even), `geld.ts` (EP, rente brute, net, impôt § 32a, Besteuerungsanteil, lacune, Ausgleich), `hinterbliebene.ts` (Witwenrente, EM, Hinzuverdienst). Tests : `tests/engine.test.ts`.
Calculateurs : `src/components/calc/*Rechner.tsx` ; mini-simulateurs : `src/lib/minis/<kind>.ts` (chargés automatiquement, appellent le moteur).

## Règles propres à ce site

- **Aucune valeur réglementaire en dur** : `h.P` dans `body`, `P` et `DE`/`EN` (`src/lib/fmt.ts`) ailleurs ; les exemples sont des appels au moteur en tête de fichier. Les seuls nombres écrits en clair sont des hypothèses d'exemple (1 500 €, 15 juin) et les âges/années de lois citées.
- **Réforme 2026** (Alterssicherungskommission, 23.6.2026) : toujours « Vorschlag / proposal », jamais droit en vigueur ; aucun projet de loi publié ; ne jamais citer de Jahrgänge protégés ni de fuite.
- **Jamais la DRV** comme nom ou logo : le site est indépendant ; pas de conseil personnalisé ; renvoyer aux Auskunfts- und Beratungsstellen.
- **Pas de lead, pas de téléphone, aucun produit nommé**, aucun lien vers un autre site du portefeuille.
- **Allemand** : pas de tiret cadratin ; guillemets „…“. **Anglais** : pour un expatrié qui travaille en Allemagne ; terme allemand entre parenthèses à la première occurrence ; montants en euros ; angle UE/étranger quand il est pertinent.
- **FAQ** : 4 à 8 (3 minimum sur une page outil), réponses 40 à 90 mots ; question unique sur tout le site.
- **Snippets** : titre 50-60 car., description 150-160, 2026 dans les deux, terme-clé en tête (jamais pays, « Rechner », question).
- `resume` : UN paragraphe ≥ 120 mots, citable, avec les chiffres.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/de-rente
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=<id> npx vitest run tests/pages.test.ts   # une page
npm run build && npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py . ; python3 scripts/check-cookies.py . ; python3 scripts/check-snippets.py dist
node scripts/check-legal.mjs . ; node scripts/check-sources.mjs . ; node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check ; node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs .
node scripts/check-layout.mjs dist
```

Serveur local : port 4381 (`npm run preview`). Arrêt : `lsof -ti tcp:4381 | xargs kill`.

## Mise à jour annuelle

1. 1er juillet : nouveau Rentenwert (`rentenwert`), Freibetrag Witwenrente suit automatiquement.
2. Janvier : Rechengrößen (Durchschnittsentgelt, BBG, Bezugsgröße), tarif § 32a, Grundfreibetrag, Soli, Zusatzbeitrag moyen, Zurechnungszeit.
3. Réforme : n'intégrer au moteur qu'après promulgation (avec la date d'effet et les Jahrgänge concernés, testés des deux côtés).

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS. Ne toucher ni `_trame` ni la RECETTE. Aucune identité personnelle : l'éditeur est Radif Partners.

## État au 2026-10-15

- 40 pages de contenu (9 outils, 24 guides, 7 Jahrgänge 1960-1966) × 2 langues + accueil, méthode, à propos = 86 pages indexables ; pages de service, widget et `/embed/` en noindex.
- Rédaction répartie entre sept agents sur `research/fakten.md`, intégrée et contrôlée ici.
- Points laissés de côté faute de source lue : Abschlag de la Witwenrente quand l'assuré meurt avant 65 (§ 77 Abs. 2 Nr. 4, à chiffrer), Gleichstellung GdB 30/40, fiscalité de l'Ausgleichszahlung, durée de l'ALG I selon l'âge, imposition des retraités non résidents et conventions fiscales, KV des retraités privés, Mütterrente III, Jahrgänge protégés par la future loi.
- Valeurs de loi écrites en clair dans certains textes (0,3 % par mois, 0,5 %, 10 ans, 18 ans, GdB 50, 24 mois) : ce sont des constantes du SGB VI ; les taux de cotisation et montants annuels passent par `params-2026.json`.
- Pistes : section Autriche (étude 2026-10-14), page Waisenrente, page Grundrente si une source chiffrée est lue, mise à jour dès publication d'un projet de loi.
