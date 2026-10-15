/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://rentenfenster.de";
export const SITE_NAMES: Record<string, string> = {"de": "Rentenfenster", "en": "Rentenfenster"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-15';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber von Rentenrechnern: Rentenbeginn nach Jahrgang, Abschläge, Nettorente, Hinterbliebenenrente", "en": "Publisher of German pension calculators: start date by year of birth, reductions, net pension, survivor's pension"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners rechnet die gesetzliche Rente nach dem Sechsten Buch Sozialgesetzbuch und dem Einkommensteuergesetz nach, Monat für Monat und Jahrgang für Jahrgang, und nennt bei jedem Wert die Vorschrift und das Datum, an dem sie gelesen wurde.", "en": "Radif Partners works through the German statutory pension under Book VI of the Social Code and the Income Tax Act, month by month and birth year by birth year, and names the rule behind every figure together with the date it was read."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Altersgrenzen der gesetzlichen Rente (§§ 35 bis 38, 235 bis 236b SGB VI)", "Zugangsfaktor und Rentenabschlag (§ 77 SGB VI)", "Besteuerung von Renten (§ 22 EStG)", "Witwenrente und Einkommensanrechnung (§§ 46, 97 SGB VI)"], "en": ["German statutory pension ages (sections 35 to 38 and 235 to 236b SGB VI)", "Early retirement reductions (section 77 SGB VI)", "Taxation of German pensions (section 22 EStG)", "Survivor's pension and income test (sections 46 and 97 SGB VI)"]};
export const CONTACT_EMAIL = "kontakt@rentenfenster.de";
export const THEME_COLOR = '#A16207';
export const LOGO_SYMBOL = 'RE';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yy6addbq1b';
export const INDEXNOW_KEY = 'd41e7a93c2b85f60a1e4c7d9b3f2a816';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
