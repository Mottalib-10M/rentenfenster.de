import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Nachgerechnet von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Pfad', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Was Versicherte fragen', relatedCalculators: 'Passend dazu', sourcesTitle: 'Paragrafen und Quellen', writtenBy: 'Herausgegeben von',
  asOf: 'Rechtsstand', lastUpdated: 'gelesen am', footerValidated: 'Altersgrenzen aller Jahrgänge, Steuertarif 2026 und Witwenrenten-Anrechnung als Tests nachgerechnet', footerBrowser: 'Gerechnet wird in Ihrem Browser · keine Anmeldung · keine Daten an uns',
  footerDisclaimer: 'Rentenfenster ist ein unabhängiges Angebot von Radif Partners. Wir sind nicht die Deutsche Rentenversicherung, kein Rentenberater und keine Versicherung, und wir verkaufen nichts. Die Ergebnisse sind Schätzungen nach SGB VI und EStG und keine persönliche Beratung; verbindlich ist allein Ihr Rentenbescheid. Vorschläge der Alterssicherungskommission sind kein geltendes Recht.', footerPopular: '', notFound: 'Unter dieser Adresse gibt es keine Seite.',
  readMore: 'Ganzen Absatz lesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Worked through by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Path', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'What people working in Germany ask', relatedCalculators: 'Related', sourcesTitle: 'Sections and sources', writtenBy: 'Published by',
  asOf: 'Law as of', lastUpdated: 'read on', footerValidated: 'Retirement ages for every birth year, the 2026 tax schedule and the survivor income test run as tests', footerBrowser: 'Calculated in your browser · no sign-up · nothing sent to us',
  footerDisclaimer: 'Rentenfenster is an independent service by Radif Partners. We are not the German Pension Insurance (Deutsche Rentenversicherung), not a pension adviser and not an insurer, and we sell nothing. Results are estimates under Book VI of the Social Code and the Income Tax Act and not financial advice; only your pension decision letter is binding. Proposals of the pension commission are not law.', footerPopular: '', notFound: 'There is no page at this address.',
  readMore: 'Read the whole paragraph',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
