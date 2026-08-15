import { AssessmentQuestion } from '../managerAssessment';

export const FR_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    dimension: 'reality',
    title: 'Écart de rendement de production',
    scenario: 'Le tableau de bord mensuel affiche 92% de rendement sur la ligne d\'emballage, mais le magasin expédition signale des ruptures sur des commandes prioritaires.',
    options: [
      { id: 'a', score: 3, text: 'Faire confiance au rapport digital et demander des comptes au responsable logistique pour des marchandises égarées.' },
      { id: 'b', score: 2, text: 'Demander au directeur de production de recalculer et de corriger les tableaux de rendement.' },
      { id: 'c', score: 0, text: 'Aller personnellement sur le terrain et en entrepôt pour observer directement les micro-arrêts non déclarés et les rebuts masqués.' },
      { id: 'd', score: 1, text: 'Organiser une réunion de cadrage entre production, logistique et ventes pour rapprocher les chiffres.' }
    ]
  },
  {
    id: 2,
    dimension: 'reality',
    title: 'Réclamation qualité critique d\'un client clé',
    scenario: 'Un client majeur envoie une réclamation urgente affirmant que la qualité du dernier lot livré s\'est brutalement dégradée.',
    options: [
      { id: 'a', score: 2, text: 'Réprimander ou sanctionner immédiatement l\'équipe de contrôle qualité.' },
      { id: 'b', score: 0, text: 'Examiner les échantillons du lot, les relevés d\'audit qualité, les fiches de poste et échanger directement avec l\'acheteur.' },
      { id: 'c', score: 3, text: 'Demander aux commerciaux d\'accorder une remise sur la prochaine commande pour apaiser le client.' },
      { id: 'd', score: 1, text: 'Ordonner l\'arrêt temporaire de la ligne jusqu\'à ce qu\'une vérification informelle soit menée.' }
    ]
  },
  {
    id: 3,
    dimension: 'reality',
    title: 'Lot de matière première à prix réduit sans validation labo',
    scenario: 'Un fournisseur historique propose un lot de matière première à -15%, mais la validation technique du laboratoire est toujours en attente.',
    options: [
      { id: 'a', score: 3, text: 'Autoriser l\'achat en masse immédiat pour saisir une économie de trésorerie substantielle.' },
      { id: 'b', score: 2, text: 'Autoriser l\'achat d\'un tonnage limité sans essai industriel sous la responsabilité du responsable des achats.' },
      { id: 'c', score: 0, text: 'Bloquer tout achat en volume jusqu\'à la réalisation d\'essais pilotes et la mesure exacte des impacts sur le taux de rebut.' },
      { id: 'd', score: 1, text: 'Exiger un engagement écrit de garantie qualité de la part du fournisseur et procéder à l\'achat.' }
    ]
  },
  {
    id: 4,
    dimension: 'execution',
    title: 'Décisions de direction restées sans suite',
    scenario: 'Lors du comité de direction, 5 décisions majeures ont été votées pour réduire les gaspillages, mais 15 jours plus tard aucune action concrète n\'a débuté.',
    options: [
      { id: 'a', score: 3, text: 'Adresser un avertissement sévère aux managers lors de la réunion suivante et fixer des ultimatums d\'urgence.' },
      { id: 'b', score: 0, text: 'Attribuer un pilote unique habilité, des délais stricts, des indicateurs chiffrés et un point d\'étape hebdomadaire.' },
      { id: 'c', score: 2, text: 'Prendre directement en main le pilotage des 5 dossiers pour forcer la cadence.' },
      { id: 'd', score: 1, text: 'Déléguer le suivi à un consultant externe ou à une commission spéciale ad hoc.' }
    ]
  },
  {
    id: 5,
    dimension: 'execution',
    title: 'Dérive de calendrier sur le projet d\'extension d\'usine',
    scenario: 'La mise en service d\'une nouvelle ligne industrielle accuse 3 mois de retard et un dépassement budgétaire de 20%.',
    options: [
      { id: 'a', score: 3, text: 'Résilier le contrat du prestataire et remplacer l\'équipe de déploiement.' },
      { id: 'b', score: 2, text: 'Repousser les échéances indéfiniment pour réduire le niveau de stress des équipes.' },
      { id: 'c', score: 0, text: 'Nommer un chef de projet doté de réels pouvoirs, auditer le chemin critique, recadrer les jalons et tenir un point hebdomadaire.' },
      { id: 'd', score: 1, text: 'Imposer des réunions quotidiennes debout en exigeant des comptes-rendus oraux de chacun.' }
    ]
  },
  {
    id: 6,
    dimension: 'execution',
    title: 'Crise opérationnelle soudaine',
    scenario: 'Une panne critique d\'équipement ou une fuite de produit dangereux menace la production, la sécurité des opérateurs ou la réputation de l\'entreprise.',
    options: [
      { id: 'a', score: 0, text: 'Sécuriser d\'abord le danger physique ; isoler les faits établis ; désigner un responsable unique, des actions ciblées et un retour d\'expérience.' },
      { id: 'b', score: 3, text: 'Prendre toutes les décisions unilatéralement et publier des décrets d\'urgence successifs.' },
      { id: 'c', score: 2, text: 'Différer les mesures d\'endiguement jusqu\'à l\'obtention de 100% des données scientifiques.' },
      { id: 'd', score: 1, text: 'Appliquer un bricolage provisoire et renvoyer l\'analyse des causes à plus tard.' }
    ]
  },
  {
    id: 7,
    dimension: 'systems',
    title: 'Augmentation isolée de cadence d\'un poste',
    scenario: 'Un poste d\'emboutissage en amont augmente sa cadence de 30%, provoquant un engorgement d\'en-cours et des retards sur l\'assemblage en aval.',
    options: [
      { id: 'a', score: 3, text: 'Féliciter publiquement l\'équipe d\'emboutissage et sommer l\'assemblage en aval d\'accélérer.' },
      { id: 'b', score: 2, text: 'Brider la vitesse du poste d\'emboutissage pour revenir aux cadences antérieures.' },
      { id: 'c', score: 0, text: 'Analyser l\'ensemble de la chaîne de valeur, repérer le goulot d\'étranglement réel et piloter selon le débit global du système.' },
      { id: 'd', score: 1, text: 'Instaurer des heures supplémentaires temporaires en aval tout en étudiant le déséquilibre.' }
    ]
  },
  {
    id: 8,
    dimension: 'systems',
    title: 'Pression budgétaire sur la maintenance préventive',
    scenario: 'Face à des tensions passagères de trésorerie, il est proposé de réduire le budget de maintenance préventive de 30%.',
    options: [
      { id: 'a', score: 3, text: 'Arrêter immédiatement toute maintenance non urgente jusqu\'au rétablissement de la trésorerie.' },
      { id: 'b', score: 2, text: 'Ordonner au responsable maintenance de couper 10% à l\'aveugle dans tous ses postes de dépense.' },
      { id: 'c', score: 0, text: 'Évaluer la probabilité de panne, le coût des arrêts, la sécurité, la dette technique et l\'impact global sur la fabrication.' },
      { id: 'd', score: 1, text: 'Différer les opérations à faible risque sous surveillance avec date de révision ferme.' }
    ]
  },
  {
    id: 9,
    dimension: 'systems',
    title: 'Vente à crédit à un client historique débiteur',
    scenario: 'Un client historique passe une commande massive. Ses encours présentent d\'importantes créances impayées au-delà des échéances.',
    options: [
      { id: 'a', score: 2, text: 'Valider la commande en se basant uniquement sur son volume d\'achat récent.' },
      { id: 'b', score: 3, text: 'Se reposer sur la relation de confiance personnelle et l\'ancienneté du partenariat.' },
      { id: 'c', score: 0, text: 'Auditer l\'encours total, les effets de commerce, l\'historique de règlement, la marge et la capacité de tolérance au risque.' },
      { id: 'd', score: 1, text: 'Fixer un plafond de crédit strict et conditionner les livraisons suivantes au règlement du premier terme.' }
    ]
  },
  {
    id: 10,
    dimension: 'memory',
    title: 'Absence imprévue d\'un collaborateur clé',
    scenario: 'Un chef d\'équipe chevronné est soudainement hospitalisé pour deux semaines sans remplaçant formé ni procédures formalisées.',
    options: [
      { id: 'a', score: 3, text: 'Le solliciter en permanence sur son téléphone personnel pour ne pas bloquer l\'usine.' },
      { id: 'b', score: 2, text: 'Répartir ses tâches au jour le jour entre collègues selon l\'intuition du moment.' },
      { id: 'c', score: 0, text: 'S\'appuyer sur des procédures formalisées (SOP), des listes de contrôle, des accès délégués et des suppléants formés.' },
      { id: 'd', score: 1, text: 'Nommer un responsable par intérim et lancer immédiatement la rédaction des savoir-faire informels.' }
    ]
  },
  {
    id: 11,
    dimension: 'memory',
    title: 'Défaut récurrent de calibration par lot',
    scenario: 'Une dérive de calibration réapparaît pour la 3e fois cette année malgré plusieurs sessions de formation antérieures.',
    options: [
      { id: 'a', score: 3, text: 'Sanctionner formellement l\'opérateur pour envoyer un signal disciplinaire fort.' },
      { id: 'b', score: 2, text: 'Réorganiser exactement la même formation théorique en salle.' },
      { id: 'c', score: 0, text: 'Auditer le processus, l\'outillage, les instructions de travail, les incitations et les mécanismes anti-erreur (Poka-Yoke).' },
      { id: 'd', score: 1, text: 'Ajouter un poste de contrôle manuel temporaire en amont et en aval pendant l\'analyse.' }
    ]
  },
  {
    id: 12,
    dimension: 'memory',
    title: 'Innovation technique remarquable d\'un technicien',
    scenario: 'Un technicien de maintenance met au point une astuce réduisant le temps de changement d\'outillage de 45 à 12 minutes.',
    options: [
      { id: 'a', score: 2, text: 'Le remercier oralement et refermer le dossier.' },
      { id: 'b', score: 1, text: 'Publier une note d\'information générale pour l\'ensemble du personnel.' },
      { id: 'c', score: 3, text: 'Confier systématiquement les changements de série à ce technicien puisqu\'il maîtrise la méthode.' },
      { id: 'd', score: 0, text: 'Documenter, tester, standardiser, former toutes les équipes et définir des indicateurs de pérennité.' }
    ]
  },
  {
    id: 13,
    dimension: 'culture',
    title: 'Suggestion d\'amélioration du personnel de terrain',
    scenario: 'Un opérateur d\'assemblage propose une modification de découpe qui permettrait d\'éliminer 10% de chutes de tôle.',
    options: [
      { id: 'a', score: 0, text: 'Analyser l\'idée, réaliser un essai pilote, communiquer les résultats et récompenser la valeur économique créée.' },
      { id: 'b', score: 2, text: 'L\'inviter à consigner sa proposition dans la boîte à idées numérique de l\'entreprise.' },
      { id: 'c', score: 1, text: 'Décider selon sa propre intuition managériale si l\'idée mérite d\'être étudiée.' },
      { id: 'd', score: 3, text: 'Rappeler aux opérateurs de s\'en tenir strictement à leurs tâches d\'exécution.' }
    ]
  },
  {
    id: 14,
    dimension: 'culture',
    title: 'Signalement honnête d\'une erreur avant livraison',
    scenario: 'Un collaborateur signale spontanément une erreur de dosage avant expédition, évitant de lourds litiges clients.',
    options: [
      { id: 'a', score: 3, text: 'Sanctionner l\'opérateur pour démontrer que l\'erreur est inadmissible dans l\'entreprise.' },
      { id: 'b', score: 0, text: 'Valoriser le signalement précoce, isoler le lot et différencier l\'erreur de bonne foi de la faute délibérée.' },
      { id: 'c', score: 2, text: 'Étouffer l\'affaire en interne pour éviter des soucis au collaborateur.' },
      { id: 'd', score: 1, text: 'Adresser un simple rappel à l\'ordre verbal et classer l\'incident.' }
    ]
  },
  {
    id: 15,
    dimension: 'culture',
    title: 'Commissions commerciales vs créances douteuses et retours',
    scenario: 'Le système de commissionnement dope le chiffre d\'affaires facturé, mais les impayés, chèques sans provision et retours explosent.',
    options: [
      { id: 'a', score: 3, text: 'Relever les objectifs de vente pour compenser les pertes de trésorerie par le volume.' },
      { id: 'b', score: 2, text: 'Conserver le système actuel en haussant le ton auprès des commerciaux sur les encaissements.' },
      { id: 'c', score: 0, text: 'Indexer les primes sur le chiffre d\'affaires effectivement encaissé, la rentabilité nette et la fidélisation saine.' },
      { id: 'd', score: 1, text: 'Soumettre toute vente à risque à l\'accord préalable du Directeur Général.' }
    ]
  },
  {
    id: 16,
    dimension: 'data',
    title: 'Forte production et hausse des réclamations clients',
    scenario: 'Le tableau de bord indique +20% de volume produit, mais les rebuts et réclamations de garantie atteignent un pic historique.',
    options: [
      { id: 'a', score: 3, text: 'Célébrer la performance de volume et traiter les litiges au cas par cas au SAV.' },
      { id: 'b', score: 2, text: 'Accuser le service qualité de ne pas être capable de suivre le rythme soutenu des lignes.' },
      { id: 'c', score: 0, text: 'Auditer la qualité des données et croiser production conforme, rebuts, retours, rentabilité et réclamations.' },
      { id: 'd', score: 1, text: 'Plafonner temporairement le volume de production jusqu\'à clarification de la situation.' }
    ]
  },
  {
    id: 17,
    dimension: 'data',
    title: 'Recommandation d\'un système automatisé ou IA',
    scenario: 'Un algorithme d\'évaluation du risque financier préconise de suspendre les lignes de crédit d\'un distributeur historique majeur.',
    options: [
      { id: 'a', score: 3, text: 'Appliquer aveuglément la décision de la machine sous prétexte qu\'elle traite plus de paramètres.' },
      { id: 'b', score: 2, text: 'Ignorer l\'algorithme et accorder le crédit en faisant confiance à son intuition.' },
      { id: 'c', score: 0, text: 'Considérer le modèle comme une aide à la décision, confronter les données aux règles de gouvernance et assumer le choix final.' },
      { id: 'd', score: 1, text: 'Transmettre le dossier au Directeur Financier pour signature manuelle sans analyse.' }
    ]
  },
  {
    id: 18,
    dimension: 'data',
    title: 'Métriques contradictoires entre départements',
    scenario: 'La Finance, les Ventes et l\'Entrepôt présentent trois montants radicalement divergents pour la valorisation du stock.',
    options: [
      { id: 'a', score: 3, text: 'Adopter la valeur de la Finance en raison de sa position hiérarchique supérieure.' },
      { id: 'b', score: 2, text: 'Retenir la moyenne arithmétique des trois montants comme base de calcul.' },
      { id: 'c', score: 0, text: 'Formaliser les définitions, désigner la source unique de vérité (SSOT), aligner les horodatages et analyser les causes d\'écart.' },
      { id: 'd', score: 1, text: 'Retenir une estimation prudente et fixer une date butoir pour réconcilier les bases de données.' }
    ]
  },
  {
    id: 19,
    dimension: 'operations',
    title: 'Croissance du chiffre d\'affaires et baisse de marge',
    scenario: 'Les ventes globales augmentent de 25%, mais la marge opérationnelle et les liquidités disponibles diminuent dangereusement.',
    options: [
      { id: 'a', score: 3, text: 'Pousser encore la production et les volumes pour absorber les charges fixes.' },
      { id: 'b', score: 2, text: 'Augmenter uniformément de 10% l\'ensemble des tarifs du catalogue sans analyse.' },
      { id: 'c', score: 0, text: 'Analyser la rentabilité par référence, typologie client, ligne, taux de rebut, barèmes de remise et délais de paiement.' },
      { id: 'd', score: 1, text: 'Geler la production des références manifestement déficitaires en attendant les conclusions de l\'étude.' }
    ]
  },
  {
    id: 20,
    dimension: 'operations',
    title: 'Défaut mineur chronique toléré par habitude',
    scenario: 'Une imperfection esthétique mineure apparaît régulièrement sur les produits, et les équipes banalisent la situation : « C\'est comme ça depuis des années ».',
    options: [
      { id: 'a', score: 3, text: 'Laisser courir tant que les clients finaux ne formulent pas de réclamations officielles.' },
      { id: 'b', score: 2, text: 'Renforcer le nombre de contrôleurs visuels en bout de chaîne.' },
      { id: 'c', score: 0, text: 'Remonter à la cause racine dans le process amont, opérer une modification maîtrisée et actualiser les standards.' },
      { id: 'd', score: 1, text: 'Mettre les lots imparfaits en quarantaine et planifier un point technique avec échéance.' }
    ]
  },
  {
    id: 21,
    dimension: 'operations',
    title: 'Micro-arrêts récurrents de 5 minutes',
    scenario: 'La ligne principale s\'arrête 6 à 8 fois par poste pendant environ 5 minutes sans que personne ne s\'en alarme.',
    options: [
      { id: 'a', score: 3, text: 'Puisque les arrêts sont brefs, les considérer comme négligeables et ne rien changer.' },
      { id: 'b', score: 2, text: 'Rattraper la production perdue en programmant des heures supplémentaires le week-end.' },
      { id: 'c', score: 0, text: 'Consigner la fréquence, la durée, les causes et le coût global, en mesurant l\'effet destructeur sur le goulot.' },
      { id: 'd', score: 1, text: 'Mettre en place une ligne tampon provisoire et assigner une date limite stricte à la maintenance.' }
    ]
  },
  {
    id: 22,
    dimension: 'market',
    title: 'Demande agressive de remise d\'un distributeur clé',
    scenario: 'Un distributeur stratégique exige 15% de remise supplémentaire immédiate sous peine de basculer tous ses volumes vers la concurrence.',
    options: [
      { id: 'a', score: 2, text: 'Céder immédiatement pour sécuriser le volume d\'affaires.' },
      { id: 'b', score: 1, text: 'Refuser catégoriquement la requête pour maintenir la dignité tarifaire de l\'entreprise.' },
      { id: 'c', score: 0, text: 'Analyser les coûts de transfert du client, la valeur perçue, la marge sur coûts variables et proposer des contreparties de service non tarifaires.' },
      { id: 'd', score: 3, text: 'Accorder la remise demandée mais dégrader discrètement la qualité du service ou du produit.' }
    ]
  },
  {
    id: 23,
    dimension: 'market',
    title: 'Contrat majeur avec un client mauvais payeur',
    scenario: 'Un client connu pour ses retards de paiement chroniques propose un contrat de fabrication volumineux avec une marge faciale élevée.',
    options: [
      { id: 'a', score: 3, text: 'Signer immédiatement le contrat ; l\'expansion des ventes profite toujours à l\'entreprise.' },
      { id: 'b', score: 1, text: 'Rejeter l\'offre sans chercher à négocier.' },
      { id: 'c', score: 0, text: 'Étudier la marge réelle, l\'impact capacitaire, l\'historique d\'impayés et exiger des acomptes ou des livraisons échelonnées sécurisées.' },
      { id: 'd', score: 2, text: 'Accepter sur la base d\'une promesse verbale et d\'une poignée de main avec le directeur commercial.' }
    ]
  },
  {
    id: 24,
    dimension: 'market',
    title: 'Promesse de délai irréaliste pour remporter le contrat',
    scenario: 'Un grand compte exige une livraison dans un délai divisé par deux alors que l\'usine tourne déjà à 100% de sa capacité.',
    options: [
      { id: 'a', score: 3, text: 'Accepter la date impossible et mettre une pression maximale sur l\'usine pour essayer de tenir.' },
      { id: 'b', score: 1, text: 'Refuser net l\'appel d\'offres et couper court à toute discussion.' },
      { id: 'c', score: 0, text: 'Exposer avec transparence la capacité réelle, proposer un cadencement fiable, des lots partiels ou des solutions prioritaires viables.' },
      { id: 'd', score: 2, text: 'Déclarer au client qu\'on va essayer et espérer un imprévu favorable dans le planning.' }
    ]
  }
];
