# V12 — Portail centre de formation

## Trois espaces
- Formateur : `ZESE2027`
- Responsable de centre : `ZESECENTRE27` (mot de passe provisoire choisi pour disposer d'un troisième accès distinct)
- Élève / candidat bac français : `ZESE27`

Les mots de passe temporaires se modifient dans `auth-config.js`.

## Important
Cette version utilise un contrôle d'accès côté navigateur (`localStorage` + JavaScript).
Sur un hébergement statique public comme GitHub Pages, ce dispositif n'est **pas une protection forte** :
le code source et les mots de passe peuvent être inspectés.

Pour la mise en production, chiffrer les pages (par exemple avec StatiCrypt) ou utiliser une authentification côté serveur.

## Hiérarchie
- Élève : parcours, suivi, carnet, annales, ressources.
- Formateur : tout le contenu élève + guide, planning, comparatif et ouvrages.
- Responsable : tout le contenu formateur + tableau de pilotage responsable.

## Mots de passe sans espaces
- Formateur : `ZESE2027`
- Responsable de centre : `ZESECENTRE27`
- Élève / candidat : `ZESE27`
