# Audit complet du site — 4 octobre 2026

## Périmètre
- 29 pages HTML avant audit, plus CSS/JS et sources.
- Vérification structurelle de tous les liens internes, IDs, formulaires de progression et navigation.
- Relecture réglementaire ciblée des points sensibles avec les textes officiels disponibles au 4 octobre 2026.

## Problèmes détectés et corrigés
1. Navigation incohérente entre les pages Première et Terminale ; le lien vers le parcours Terminale n’apparaissait pas partout.
2. Sur mobile, la navigation disparaissait entièrement sous 900 px. Ajout d’un menu mobile.
3. Aucun tableau de bord global de progression malgré plus de 500 cases de validation. Ajout de `progression.html`, export/import et remise à zéro.
4. Pas de recherche globale. Ajout de `recherche.html`.
5. Absence de métadescriptions, repère de page active, lien d’évitement et focus clavier visible.
6. Enseignement scientifique de Première : le site incluait à tort le complément de mathématiques spécifique alors que ce candidat suit la spécialité Mathématiques. Corrigé.
7. Langues Terminale : le site ne distinguait pas suffisamment les axes de l’écrit 2028 et le périmètre plus large de l’oral. Ajout des axes oraux manquants.
8. Mathématiques anticipées, spécialité Maths et écrit de PC : ajout explicite de la prise en compte de la maîtrise de la langue (2 points sur 20 dans les définitions 2026 concernées).
9. Grand oral : clarification des trois combinaisons réglementaires possibles pour les deux questions et du support de préparation.
10. Deux liens externes obsolètes ou imprécis ont été actualisés (PCCL Terminale, Math93 Terminale).
11. Footer et mentions de version étaient restés à la « version initiale ». Harmonisés.

## Contrôles structurels
- Aucun lien local manquant après audit.
- Aucun ID HTML dupliqué.
- Toutes les pages autonomes conservent une progression locale.
- La progression peut désormais être sauvegardée dans un fichier JSON pour passer d’un navigateur ou d’un ordinateur à l’autre.

## Améliorations encore souhaitables
- Ajouter, chapitre par chapitre, des liens profonds directement vers une fiche de cours ou une série d’exercices précise au lieu d’une page d’accueil de ressource.
- Construire un planning hebdomadaire de novembre à mai qui sélectionne automatiquement les modules à traiter.
- Ajouter des devoirs PDF/HTML propres au site avec corrigés et barèmes, notamment en HG, langues et EMC où les annales publiques sont moins abondantes.
- Ajouter une page administrative « inscription / convocations / documents à fournir ».
- Mettre en place une veille annuelle des liens et textes officiels.
