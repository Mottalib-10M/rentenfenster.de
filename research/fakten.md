# Faits vérifiés (lus le 2026-10-15) — seule base autorisée pour rédiger

Chaque chiffre publié vient d'ici **et** se tire de `src/data/params-2026.json` (via `h.P`, `P`, `DE`/`EN`) ou du moteur (`src/lib/engine/*.ts`). Clé de source entre crochets = clé de `params-2026.json > sources`.

## Âges (SGB VI, version modifiée en dernier par la loi du 24.7.2026)
- Regelaltersgrenze : 67 dès Jahrgang 1964 [sgb6_35]. 1958 → 66 ; 1959 → 66+2 ; 1960 → 66+4 ; 1961 → 66+6 ; 1962 → 66+8 ; 1963 → 66+10 [sgb6_235]. Fonction `regelalter(j)`.
- Langjährig Versicherte (35 ans de rentenrechtliche Zeiten) : dès 63 pour tous ; sans Abschlag seulement à la Regelaltersgrenze [sgb6_36, sgb6_236]. Pour 1949-1963 la limite « 65 » relevée suit la même table que la Regelaltersgrenze.
- Besonders langjährig (45 ans) : jamais avant la limite, sans Abschlag ; 1958 → 64 ; 1959 → 64+2 ; 1960 → 64+4 ; 1961 → 64+6 ; 1962 → 64+8 ; 1963 → 64+10 ; 1964+ → 65 [sgb6_38, sgb6_236b]. 1953 → 63+2 (la vraie « Rente mit 63 » sans Abschlag : nés avant 1953).
- Schwerbehinderte (GdB ≥ 50 au début, 35 ans) : 1964+ → 65 sans Abschlag, dès 62 ; 1958 → 64 / 61 ; 1959 → 64+2 / 61+2 ; 1960 → 64+4 / 61+4 ; 1961 → 64+6 / 61+6 ; 1962 → 64+8 / 61+8 ; 1963 → 64+10 / 61+10 [sgb6_37, sgb6_236a]. Abschlag max 10,8 %.
- Altersrente für Frauen et wegen Arbeitslosigkeit : seulement nés avant 1952 (ne pas détailler).
- Début : mois suivant l'âge atteint, si demande dans les 3 mois civils suivant ; sinon dès le mois de la demande [sgb6_99]. L'âge est atteint la veille de l'anniversaire [bgb_187] → né le 1er = un mois plus tôt. Demande possible au plus tôt un an avant (DRV) [drvReform].
- Wartezeit 5 ans (Regelaltersrente, EM, Hinterbliebene) [sgb6_50]. 35 ans : toutes les rentenrechtliche Zeiten [sgb6_51 Abs. 3]. 45 ans : Pflichtbeiträge, Berücksichtigungszeiten (Kindererziehung jusqu'à 10 ans, Pflege), ALG/Krankengeld/Übergangsgeld, mais ALG des 2 dernières années exclu sauf insolvabilité ou cessation totale de l'employeur ; freiwillige Beiträge si ≥ 18 ans de Pflichtbeiträge (exclus 2 dernières années s'il y a en même temps chômage) ; Versorgungsausgleich/Rentensplitting exclus [sgb6_51 Abs. 3a]. Bürgergeld/ALG II, école, études : ne comptent pas pour 45.
- Pas de changement de type de rente de vieillesse après octroi définitif (sauf vers Regelaltersrente dans un cas) [sgb6_34] — ne pas citer sans nécessité.

## Abschlag / Zuschlag [sgb6_77]
- 0,3 % par mois avant le début sans Abschlag ; 24 mois = 7,2 % ; 36 = 10,8 % ; 48 = 14,4 %. À vie, et reporté sur la Hinterbliebenenrente issue de cette rente (Zugangsfaktor maintenu, § 77 Abs. 3).
- 0,5 % par mois de report après la Regelaltersgrenze.
- EM : référence 65, minimum 62 → max 36 mois, 10,8 %.
- Ausgleichszahlung [sgb6_187a, sgb6_187] : jusqu'à la Regelaltersgrenze ; préalable : Auskunft (intérêt légitime dès 50 ans) avec déclaration de vouloir partir tôt ; paiements partiels admis, aucun remboursement ; prix d'un EP 2026 = 18,6 % × 51 944 € = 9 661,58 €, divisé par le Zugangsfaktor. Fonction `ausgleich()`.

## Montant
- Monatsrente = EP × Zugangsfaktor × Rentenartfaktor × aktueller Rentenwert [sgb6_64]. Rentenartfaktor : vieillesse 1,0 ; EM partielle 0,5 ; pleine 1,0 ; große Witwenrente 0,55 (0,6 ancien droit) ; kleine 0,25 ; 3 premiers mois 1,0 ; Halbwaise 0,1 ; Vollwaise 0,2 [sgb6_67, sgb6_255].
- Rentenwert : 42,52 € dès 1.7.2026 ; 40,79 € avant ; hausse 4,24 % [drvWerte, bmasAnpassung].
- EP = salaire soumis / Durchschnittsentgelt ; 2026 vorläufig 51 944 € ; 2024 définitif 47 085 € ; BBG RV 8 450 €/mois (101 400 €/an) ; Bezugsgröße 3 955 €/mois ; taux RV 18,6 % [sgb6_70, drvRechengroessen, drvWerte].
- Kindererziehung : 0,0833 EP/mois ; 36 mois pour enfant né dès 1992, 30 mois avant 1992 [sgb6_56, sgb6_249, sgb6_70].
- Teilrente : au moins 10 % de la Vollrente [sgb6_42]. Hinzuverdienst : aucune limite pour les rentes de vieillesse depuis 2023 [drvWerte].
- Zuschläge pour cotisations après le début de la rente : intégrés chaque 1er juillet (§ 66 Abs. 3a) — formuler « au 1er juillet suivant ».
- Aktivrente : salaire d'emploi après la Regelaltersgrenze exonéré jusqu'à 24 000 €/an (dès le mois suivant ; salariés seulement ; réduit d'1/12 par mois sans condition) [estg_3].

## Net
- KV : 14,6 % général + Zusatzbeitrag de la caisse, moitié payée par la DRV [sgb5_241, sgb5_247, sgb5_249a] ; Zusatzbeitrag moyen 2026 = 2,9 % (BMG, Bundesanzeiger 10.11.2025) → part du retraité 7,3 % + 1,45 %. Changement du Zusatzbeitrag appliqué au 2e mois suivant [sgb5_247].
- PV : 3,6 % ; sans enfant 4,2 % (dès 23 ans, nés après 1939) ; payée seul par le retraité [sgb11_55, sgb11_59, drvWerte]. Réduction 0,25 point par enfant du 2e au 5e tant qu'il a moins de 25 ans.
- Impôt : Besteuerungsanteil selon l'année de début : 2005 50 %, 2020 80 %, 2021 81, 2022 82, 2023 82,5, 2024 83, 2025 83,5, 2026 84, 2027 84,5, 2028 85, 2029 85,5, 2030 86, 2031 86,5 … 2058 100 % [estg_22]. Partie exonérée figée en euros l'année suivant le début ; hausses ultérieures entièrement imposables ; rentes successives (EM puis vieillesse, Witwenrente après rente) : règle § 22 Satz 8. Fonction `besteuerungsanteil()`.
- Tarif 2026 : Grundfreibetrag 12 348 € ; formules § 32a [estg_32a]. Werbungskosten-Pauschbetrag rentes 102 € [estg_9a] ; Sonderausgaben 36 € (72 couple) [estg_10c] ; KV/PV déductibles [estg_10]. Soli 5,5 %, Freigrenze 20 350 € (40 700 couple), zone 11,9 % [solzg_3, solzg_4]. Kirchensteuer 8 % BY/BW, 9 % ailleurs. La DRV ne retient pas d'impôt : déclaration.
- `steuerfreieGrenze(2026)` donne la rente brute à partir de laquelle l'impôt apparaît (cas standard).

## Hinterbliebene
- Witwenrente [sgb6_46] : mariage ≥ 1 an (sauf cas) ; kleine = 25 %, max 24 mois (sans limite si décès avant 2002 ou ancien droit) ; große = 55 % si enfant < 18, âge ≥ seuil, ou erwerbsgemindert. Seuil d'âge de la große selon l'année du décès : 2024 46+2, 2025 46+4, 2026 46+6, 2027 46+8, 2028 46+10, dès 2029 47 [sgb6_242a]. Ancien droit 60 % : mariage avant 2002 et un conjoint né avant le 2.1.1962 [sgb6_255]. Sterbevierteljahr : 3 mois à 100 % sans imputation [sgb6_67, sgb6_97]. Remariage : droit perdu ; s'applique aussi au partenariat enregistré.
- Imputation [sgb6_97] : Freibetrag 26,4 × Rentenwert (= 1 122,53 € dès 7/2026 ; 1 076,86 € avant) + 5,6 × Rentenwert par enfant ayant droit à Waisenrente ; 40 % de l'excédent imputé. Revenu net forfaitaire [sgb4_18b] : salaire −40 % ; Beamte −27,5 % ; indépendant −39,8 % ; propre rente DRV (début après 2010) −14 %, avant 2011 −13 % ; pension de fonctionnaire (après 2010) −25 %, avant −23,7 % ; Betriebsrente imposée en aval (après 2010) −23 % ; privée −12,7 % ; Vermögen −25 %. Revenus pris en compte [sgb4_18a] : Riester (§ 10a) exclu.
- Début : du mois où les conditions sont remplies ; rétroactif au plus 12 mois avant la demande [sgb6_99].

## Erwerbsminderung [sgb6_43, sgb6_253a, sgb6_96a]
- Pleine : < 3 h/jour ; partielle : 3 à < 6 h ; 3 ans de Pflichtbeiträge dans les 5 ans + 5 ans de Wartezeit.
- Zurechnungszeit : fin 2024 66+1, 2025 66+2, 2026 66+3, 2027 66+4, 2028 66+6, 2029 66+8, 2030 66+10 ; puis Regelaltersgrenze.
- Hinzuverdienst 2026 : pleine 3/8 × 14 × 3 955 = 20 763,75 €/an ; partielle 9,72 × Bezugsgröße × EP de la meilleure année des 15 dernières, au moins 6/8 × 14 × 3 955 = 41 527,50 €. Dépassement : 40 % d'1/12 de l'excédent retenu [sgb6_96a].
- Moteur : `emRente()` simplifié (moyenne EP/mois depuis 17 ans) — le dire.

## Étranger [vo883, sgb6_210]
- UE/EEE/Suisse : périodes additionnées pour les Wartezeiten ; chaque pays paie sa part ; pas de réduction pour résidence dans un autre État membre (règlement 883/2004).
- Hors UE : dépend du pays et d'un accord ; renvoyer à la DRV ; ne pas affirmer de règle précise.
- Beitragserstattung : si pas d'obligation d'assurance ni droit à l'assurance volontaire, Wartezeit de 5 ans non remplie, après 24 mois ; remboursement de la part salariale (moitié des cotisations), l'affiliation est dissoute ensuite [sgb6_210].

## Réforme (projet, JAMAIS droit en vigueur)
- Rapport de l'Alterssicherungskommission remis le 23.6.2026, 33 recommandations [bmasKommission, bregReform].
- Recommandations : supprimer la Rente für besonders langjährig Versicherte (45 ans sans Abschlag), le plus tôt possible avec Vertrauensschutz ; langjährig de 63 à 64 puis suivre la Regelaltersgrenze (fenêtre de 3 ans) ; Regelaltersgrenze couplée à l'espérance de vie dès 2031 (2:1, environ 67 → 67,5 d'ici 2041) ; Abschläge et Zuschläge réexaminés régulièrement ; Altersteilzeit de 55 à 58, fin du Blockmodell ; Haltelinie 48 % jusqu'en 2031 puis Nachhaltigkeitsfaktor réactivé ; gesetzliche Kapitalrente +2 % ; « Schutzrente » santé : métier exercé longtemps devenu impossible → 2 ans avant la Regelaltersgrenze sans Abschlag + jusqu'à 3 ans de plus avec Abschlag, 35 ans requis [drvReform, bmasKommission].
- Koalitionsausschuss du 2.7.2026 : veut appliquer les 33 recommandations ; objectif loi fin 2026 [bregReform].
- DRV (Stand août 2026) : aucune valeur de loi ; seul le droit en vigueur s'applique ; le droit applicable est celui du début de la rente ; demande au plus tôt 1 an avant → impossible de « verrouiller » l'ancien droit [drvReform].
- Aucun projet de loi publié au 15.10.2026. **Interdit** : citer des Jahrgänge protégés, un « Referentenentwurf », des fuites, un changement de ministre.

## Interdits (non vérifiés)
Mütterrente III, historique des Rentenwerte avant 2025, montants Grundrente, Rentenniveau chiffré hors Haltelinie 48 %, KV des retraités privés (PKV-Zuschuss chiffré), règles des pays tiers, Knappschaft, Beamtenversorgung chiffrée, Witwenrente nach dem vorletzten Ehegatten, Waisenrente chiffrée, Flexirente avant 2023, toute statistique (nombre de bénéficiaires, coût « 10 milliards »).
