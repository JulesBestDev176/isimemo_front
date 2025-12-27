const mongoose = require('mongoose');
const Memoire = require('../models/Memoire');
require('dotenv').config();

// Données des 20 mémoires basées sur memoires.data.ts
const memoiresData = [
  {
    id: 1,
    titre: "Etude et Réalisation d'une plateforme de gestion de rendez-vous médicale : Cas du Centre Hospitalier Abass Ndao",
    auteur: "Abdou Fatah Ndiaye",
    auteurs: "Abdou Fatah Ndiaye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur l'étude et la réalisation d'une plateforme de gestion de rendez-vous médicale pour le Centre Hospitalier Abass Ndao.",
    resume: "La santé reste l'un des plus grands défis pour les pays en voie de développement. Dans la Région africaine de l'OMS, on compte en moyenne seulement 2 médecins pour 10 000 habitants. Ce déséquilibre entraîne plusieurs problèmes : difficulté à prendre des rendez-vous, longues attentes, et manque de coordination. Nous avons développé une plateforme de gestion des rendez-vous médicaux visant à améliorer l'efficacité des services de santé.",
    etiquettes: ["Santé", "Gestion", "Web"],
    contacts: [
      { nom: "Abdou Fatah Ndiaye", email: "abdoufatahndiayeisidk@groupeisi.com", telephone: "+221 77 123 45 01" }
    ],
    cheminFichier: "/assets/documents/Abdou Fatah Ndiaye.pdf",
    fichierPdf: "public/assets/documents/Abdou Fatah Ndiaye.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["santé", "rendez-vous", "médical", "plateforme", "gestion"]
  },
  {
    id: 2,
    titre: "Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux",
    auteur: "Al Hassane Diallo",
    auteurs: "Al Hassane Diallo",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle",
    description: "Mémoire portant sur la conception d'un système de dématérialisation des services municipaux adapté au contexte sénégalais.",
    resume: "La dématérialisation des services publics représente un enjeu majeur pour les administrations modernes. Ce projet répond à la problématique : Comment concevoir un système inclusif, sécurisé et efficace ? Le portail E-Municipalité représente une étape importante vers la transformation numérique des services municipaux au Sénégal.",
    etiquettes: ["Administration publique", "Dématérialisation", "Web"],
    contacts: [
      { nom: "Al Hassane Diallo", email: "alhassanedialloisidk@groupeisi.com", telephone: "+221 77 123 45 02" }
    ],
    cheminFichier: "/assets/documents/Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf",
    fichierPdf: "public/assets/documents/Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle",
    motsCles: ["dématérialisation", "services municipaux", "administration", "portail web"]
  },
  {
    id: 3,
    titre: "Etude et Réalisation d'une plateforme intelligente de gestion des mémoires académiques : Cas ISI",
    auteur: "Souleymane Fall & Aliou Ndour",
    auteurs: "Souleymane Fall, Aliou Ndour",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur la conception et réalisation de PIGMA, une plateforme intelligente de gestion des mémoires académiques pour l'ISI.",
    resume: "Ce projet de fin d'études, réalisé dans le cadre de la Licence en Génie Informatique à l'Institut Supérieur d'Informatique (ISI), présente PIGMA (Plateforme Intelligente de Gestion des Mémoires Académiques), une solution web conçue pour digitaliser et centraliser l'ensemble du processus de gestion des mémoires académiques. La plateforme vise à moderniser une gestion encore largement manuelle, en automatisant les principales étapes, depuis la proposition de sujet jusqu'à la soutenance finale. Elle permet la gestion électronique des dépôts, la planification des soutenances, la coordination des jurys, ainsi que la communication fluide entre étudiants et encadrants. PIGMA intègre également des fonctionnalités d'Intelligence Artificielle telles que la détection automatique de plagiat, la classification thématique des mémoires, la recommandation de sujets pertinents et un ChatBot d'assistance.",
    etiquettes: ["Éducation", "IA", "Gestion académique"],
    contacts: [
      { nom: "Souleymane Fall", email: "souleymanefallisidk@groupeisi.com", telephone: "+221 77 715 10 61" },
      { nom: "Aliou Ndour", email: "alioundourisidk@groupeisi.com", telephone: "+221 76 561 68 68" }
    ],
    cheminFichier: "/assets/documents/FallNdour.pdf",
    fichierPdf: "public/assets/documents/FallNdour.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["PIGMA", "mémoires académiques", "IA", "plagiat", "chatbot", "ISI"]
  },
  {
    id: 4,
    titre: "Conception et réalisation d'une Plateforme de Réservation de Voyage pour BOCOUM TRANSPORT",
    auteur: "Ibrahima Amadou Bocoum",
    auteurs: "Ibrahima Amadou Bocoum",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur la conception et réalisation d'une plateforme de réservation de voyage.",
    resume: "Le développement d'une plateforme de réservation en ligne pour BOCOUM TRANSPORT représente une réponse innovante aux attentes des voyageurs modernes. La plateforme est conçue avec PHP/Laravel pour le backend et Angular pour le frontend.",
    etiquettes: ["Transport", "Réservation", "Web"],
    contacts: [
      { nom: "Ibrahima Amadou Bocoum", email: "ibrahimaamadoubocoumisidk@groupeisi.com", telephone: "+221 77 123 45 05" }
    ],
    cheminFichier: "/assets/documents/Ibrahim Bocoum[4].pdf",
    fichierPdf: "public/assets/documents/Ibrahim Bocoum[4].pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["transport", "réservation", "voyage", "Laravel", "Angular"]
  },
  {
    id: 5,
    titre: "Conception et réalisation d'une Application mobile de covoiturage pour la ville de Dakar",
    auteur: "Houleymatou Diallo & Cheikh Tidiane Traore",
    auteurs: "Houleymatou Diallo, Cheikh Tidiane Traore",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur la conception d'une application mobile de covoiturage pour Dakar.",
    resume: "Ce projet de fin d'étude présente TYVAA, une application mobile de covoiturage urbain destinée à faciliter les déplacements à Dakar. Elle met en relation des conducteurs disposant de places libres et des passagers souhaitant effectuer un trajet, dans une logique de partage et de réduction des coûts de transport. L'application permet de proposer ou rechercher un trajet, qu'il soit ponctuel ou régulier, avec la possibilité pour un utilisateur d'être à la fois conducteur et passager.",
    etiquettes: ["Transport", "Mobile", "Covoiturage"],
    contacts: [
      { nom: "Houleymatou Diallo", email: "houleymatou.diallo@groupeisi.com", telephone: "+221 77 123 45 06" },
      { nom: "Cheikh Tidiane Traore", email: "cheikhtidiane.traore@groupeisi.com", telephone: "+221 77 123 45 07" }
    ],
    cheminFichier: "/assets/documents/MEMOIRE_CHEIKH_HOULEYMATOU.pdf",
    fichierPdf: "public/assets/documents/MEMOIRE_CHEIKH_HOULEYMATOU.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["TYVAA", "covoiturage", "Dakar", "mobile", "transport urbain"]
  },
  {
    id: 6,
    titre: "Etude et réalisation d'une application de gestion de ressources humaines : cas de Gainde Talent Provider",
    auteur: "Awa Thiam",
    auteurs: "Awa Thiam",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion RH pour les ESN.",
    resume: "Ce projet se concentre sur une application de gestion des ressources humaines pour optimiser le recrutement au sein des ESN. L'application renforce l'efficacité et la transparence dans le recrutement des talents IT.",
    etiquettes: ["Ressources humaines", "Recrutement", "ESN"],
    contacts: [
      { nom: "Awa Thiam", email: "awa.thiam@groupeisi.com", telephone: "+221 77 123 45 08" }
    ],
    cheminFichier: "/assets/documents/Memoire Awa THIAM.pdf",
    fichierPdf: "public/assets/documents/Memoire Awa THIAM.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["RH", "recrutement", "ESN", "talents IT"]
  },
  {
    id: 7,
    titre: "Conception et réalisation d'une application Desktop pour la gestion des congés de l'entreprise STAM",
    auteur: "Bassine Diallo",
    auteurs: "Bassine Diallo",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application Desktop pour la gestion des congés et télétravail.",
    resume: "Notre projet de fin d'étude vise à concevoir et réaliser une plateforme desktop dédiée à la gestion des congés, des absences et du télétravail des employés, répondant aux besoins croissants des entreprises modernes. Cette plateforme permettra aux employés de soumettre facilement des demandes de congé, aux gestionnaires de les approuver ou de les rejeter, et aux départements des ressources humaines de suivre et de gérer les absences de manière transparente.",
    etiquettes: ["Ressources humaines", "Desktop", "Gestion congés"],
    contacts: [
      { nom: "Bassine Diallo", email: "bassine.diallo@groupeisi.com", telephone: "+221 77 123 45 09" }
    ],
    cheminFichier: "/assets/documents/Memoire Bassine DIALLO2.pdf",
    fichierPdf: "public/assets/documents/Memoire Bassine DIALLO2.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["congés", "absences", "télétravail", "desktop", "STAM"]
  },
  {
    id: 8,
    titre: "Etude et Réalisation d'une Plateforme Web de Location et Vente Immobilière pour DSI",
    auteur: "Mama Aichatou Sakho",
    auteurs: "Mama Aichatou Sakho",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une plateforme web de location et vente immobilière.",
    resume: "Dans le cadre de l'obtention de notre diplôme de licence en Génie Logiciel à l'ISI, nous avons réalisé un projet de fin d'études afin de compléter notre formation du premier cycle universitaire. Notre objectif était de concevoir et de mettre à disposition de Djibril Sakho Immobilier une plateforme web de location et de vente de biens immobiliers. Pour concevoir cette application, nous avons utilisé le langage de modélisation UML, le langage de programmation PHP avec le Framework Laravel pour le backend et Angular pour le frontend, et le SGBD MySQL.",
    etiquettes: ["Immobilier", "Web", "Location"],
    contacts: [
      { nom: "Mama Aichatou Sakho", email: "mamaaichatou.sakho@groupeisi.com", telephone: "+221 77 123 45 10" }
    ],
    cheminFichier: "/assets/documents/Memoire MAMA AICHATOU SAKHO L3.pdf",
    fichierPdf: "public/assets/documents/Memoire MAMA AICHATOU SAKHO L3.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["immobilier", "location", "vente", "Laravel", "Angular"]
  },
  {
    id: 9,
    titre: "Conception et réalisation d'un site e-commerce & système de recommandation IA : Cas de Souq",
    auteur: "Kissima Tandia",
    auteurs: "Kissima Tandia",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur un site e-commerce avec système de recommandation basé sur l'IA.",
    resume: "Face à un marché du commerce électronique de plus en plus saturé, ce mémoire vise à concevoir un système de recommandation intelligent qui dépasse les modèles traditionnels centrés sur la surconsommation. Le projet se distingue par son approche innovante, basée sur quatre piliers de recommandation avancée : la consommation responsable, le cycle de vie des produits, la recommandation multi-étapes et l'interaction conversationnelle.",
    etiquettes: ["Commerce", "IA", "E-commerce"],
    contacts: [
      { nom: "Kissima Tandia", email: "kissima.tandia@groupeisi.com", telephone: "+221 77 123 45 11" }
    ],
    cheminFichier: "/assets/documents/Memoire-Reco4i(1).pdf",
    fichierPdf: "public/assets/documents/Memoire-Reco4i(1).pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["e-commerce", "IA", "recommandation", "Souq", "consommation responsable"]
  },
  {
    id: 10,
    titre: "Développement d'une application de gestion de la facturation pour une ESN",
    auteur: "Sokhna Dieye",
    auteurs: "Sokhna Dieye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur le développement d'une application de gestion de facturation.",
    resume: "Ce rapport de stage se concentre sur la conception et le développement d'une application de gestion de la facturation pour Atos Sénégal, une entreprise de services numériques (ESN) de premier plan. L'objectif principal est de créer une solution numérique qui optimise les processus de facturation, améliore l'efficacité opérationnelle, et renforce la transparence financière. Le backend sera géré par Laravel et le frontend par Angular, avec PostgreSQL comme SGBD.",
    etiquettes: ["Finance", "Facturation", "ESN"],
    contacts: [
      { nom: "Sokhna Dieye", email: "sokhna.dieye@groupeisi.com", telephone: "+221 77 123 45 12" }
    ],
    cheminFichier: "/assets/documents/MemoireSokhnaDieye.pdf",
    fichierPdf: "public/assets/documents/MemoireSokhnaDieye.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["facturation", "ESN", "Atos", "Laravel", "Angular", "PostgreSQL"]
  },
  {
    id: 11,
    titre: "Conception d'une application de diffusion des notifications pédagogiques pour l'ISI",
    auteur: "Moussa Abakar Hassane",
    auteurs: "Moussa Abakar Hassane",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une application de diffusion des notifications pédagogiques et administratives.",
    resume: "La diffusion des informations pédagogiques et administratives à l'ISI repose encore sur des moyens traditionnels. Pour répondre à ces limites, ce projet vise à concevoir et à réaliser une application centralisée de diffusion des notifications. Elle permet aux administrateurs, enseignants et assistants de créer et gérer des annonces ciblées. Le système repose sur une architecture à trois niveaux avec Laravel pour le backend, Angular pour l'interface web et Flutter pour l'application mobile.",
    etiquettes: ["Éducation", "Notifications", "Mobile"],
    contacts: [
      { nom: "Moussa Abakar Hassane", email: "moussa.abakar@groupeisi.com", telephone: "+221 77 123 45 13" }
    ],
    cheminFichier: "/assets/documents/PFE-MoussaAbakar.pdf",
    fichierPdf: "public/assets/documents/PFE-MoussaAbakar.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["notifications", "ISI", "pédagogique", "Flutter", "Laravel"]
  },
  {
    id: 12,
    titre: "Etude et Réalisation d'une plateforme de gestion des mémoires : Cas de l'ISI",
    auteur: "Samba Gueye",
    auteurs: "Samba Gueye",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une plateforme de gestion des mémoires pour l'ISI.",
    resume: "Ce projet vise à concevoir une plateforme de gestion des mémoires académiques, digitalisant le processus depuis le dépôt initial jusqu'à l'archivage final.",
    etiquettes: ["Éducation", "Gestion académique"],
    contacts: [
      { nom: "Samba Gueye", email: "samba.gueye@groupeisi.com", telephone: "+221 77 123 45 14" }
    ],
    cheminFichier: "/assets/documents/REPUBLIQUE DU SENEGAL.pdf",
    fichierPdf: "public/assets/documents/REPUBLIQUE DU SENEGAL.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["mémoires", "ISI", "gestion académique", "digitalisation"]
  },
  {
    id: 13,
    titre: "Conception d'une application de gestion des notes sur tableau numérique interactif : Cas ISI",
    auteur: "Harsy Barry",
    auteurs: "Harsy Barry",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle IAGE",
    description: "Rapport portant sur une application de gestion des notes sur tableau numérique interactif.",
    resume: "Ce projet de fin de cycle porte sur la création d'une application pour gérer les notes sur Tableau Numérique Interactif (TNI) à l'ISI Sénégal. L'objectif était de faciliter et sécuriser la gestion des notes pour les enseignants, les étudiants et le service administratif. L'application a été développée en Laravel avec une base de données MySQL locale.",
    etiquettes: ["Éducation", "TNI", "Gestion notes"],
    contacts: [
      { nom: "Harsy Barry", email: "harsy.barry@groupeisi.com", telephone: "+221 77 123 45 15" }
    ],
    cheminFichier: "/assets/documents/Rapport de Harsy Barry.pdf",
    fichierPdf: "public/assets/documents/Rapport de Harsy Barry.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle IAGE",
    motsCles: ["TNI", "notes", "ISI", "Laravel", "MySQL"]
  },
  {
    id: 14,
    titre: "Développement d'une plateforme Web SIG avec Laravel et PostGIS",
    auteur: "Cheikh Djidere Diao",
    auteurs: "Cheikh Djidere Diao",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Géomatique",
    description: "Rapport portant sur une plateforme Web SIG pour la gestion des données géospatiales.",
    resume: "Ce travail porte sur la conception et le développement d'une plateforme web permettant la visualisation, l'analyse et la gestion de données géographiques en ligne. Le projet intègre une architecture trois-tiers avec un frontend en React, un backend en Laravel et une base de données PostgreSQL/PostGIS. Les fonctionnalités clés incluent la création de comptes, la gestion des couches, le dessin et l'édition de géométries, l'export de données au format GeoJSON.",
    etiquettes: ["Géomatique", "SIG", "Web"],
    contacts: [
      { nom: "Cheikh Djidere Diao", email: "cheikh.diao@groupeisi.com", telephone: "+221 77 123 45 16" }
    ],
    cheminFichier: "/assets/documents/Rapport final Cheikh Djidere DIAO.pdf",
    fichierPdf: "public/assets/documents/Rapport final Cheikh Djidere DIAO.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Géomatique",
    motsCles: ["SIG", "géospatial", "PostGIS", "Laravel", "React", "cartographie"]
  },
  {
    id: 15,
    titre: "Etude et Réalisation d'une plateforme de gestion des mémoires : Cas de l'ISI",
    auteur: "Samba Gueye",
    auteurs: "Samba Gueye",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une plateforme de gestion des mémoires pour l'ISI.",
    resume: "Ce projet vise à concevoir une plateforme de gestion des mémoires académiques pour l'ISI.",
    etiquettes: ["Éducation", "Gestion académique"],
    contacts: [
      { nom: "Samba Gueye", email: "samba.gueye@groupeisi.com", telephone: "+221 77 123 45 14" }
    ],
    cheminFichier: "/assets/documents/Samba_Gueye (1).pdf",
    fichierPdf: "public/assets/documents/Samba_Gueye (1).pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["mémoires", "ISI", "gestion académique"]
  },
  {
    id: 16,
    titre: "Conception d'un site web de réservation de voyage pour une agence",
    auteur: "Soudaiss Elfayadine",
    auteurs: "Soudaiss Elfayadine",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur un site web de réservation de voyage.",
    resume: "Ce projet vise à concevoir un site web de réservation de voyage permettant la recherche de destinations, la réservation en ligne et les paiements sécurisés.",
    etiquettes: ["Transport", "Réservation", "Web"],
    contacts: [
      { nom: "Soudaiss Elfayadine", email: "soudaiss.elfayadine@groupeisi.com", telephone: "+221 77 123 45 17" }
    ],
    cheminFichier: "/assets/documents/Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf",
    fichierPdf: "public/assets/documents/Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["voyage", "réservation", "agence", "web"]
  },
  {
    id: 17,
    titre: "Etude et Réalisation d'une Application de Gestion D'Immobilisation de ISI",
    auteur: "N'diaye Amy",
    auteurs: "N'diaye Amy",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion d'immobilisation pour l'ISI.",
    resume: "Le présent projet de mémoire vise à mettre en place une solution innovante pour améliorer les opérations logistiques. L'objectif principal est de concevoir et de déployer une application de gestion de la logistique qui simplifiera les processus de gestion des stocks, le suivi des expéditions, la coordination des fournisseurs, la traçabilité des produits, la gestion des retours, la prévision de la demande.",
    etiquettes: ["Logistique", "Gestion", "ISI"],
    contacts: [
      { nom: "N'diaye Amy", email: "amy.ndiaye@groupeisi.com", telephone: "+221 77 123 45 18" }
    ],
    cheminFichier: "/assets/documents/memoire_licence.pdf",
    fichierPdf: "public/assets/documents/memoire_licence.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["logistique", "immobilisation", "ISI", "stocks", "gestion"]
  },
  {
    id: 18,
    titre: "Conception d'une Application de Gestion Scolaire : Cas de l'ECNM",
    auteur: "Anoir Ibniyamine",
    auteurs: "Anoir Ibniyamine",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion scolaire.",
    resume: "Ce projet vise à concevoir et développer une application informatique dédiée à la gestion complète des activités au sein de l'École Communautaire de Nioumamilima Mboinkou. En incluant des fonctionnalités telles que la gestion des inscriptions des étudiants, la gestion des notes et des résultats, la gestion des absences et des retards, ainsi que la gestion des emplois du temps, cette application bureau offrira une solution intégrée.",
    etiquettes: ["Éducation", "Gestion scolaire", "Desktop"],
    contacts: [
      { nom: "Anoir Ibniyamine", email: "anoir.ibniyamine@groupeisi.com", telephone: "+221 77 123 45 19" }
    ],
    cheminFichier: "/assets/documents/my_memory_final.pdf",
    fichierPdf: "public/assets/documents/my_memory_final.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["gestion scolaire", "ECNM", "inscriptions", "notes", "absences"]
  },
  {
    id: 19,
    titre: "Développement d'une application CRM pour les entreprises immobilières",
    auteur: "Ndeye Ngoundje Mbaye",
    auteurs: "Ndeye Ngoundje Mbaye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application CRM pour l'immobilier.",
    resume: "Cette mémoire porte sur le développement d'une application de gestion de la relation client pour les entreprises de services immobiliers. Le but est de concevoir une solution qui facilite la gestion des interactions avec les clients, améliore la gestion des transactions, et optimise la qualité du service dans le secteur immobilier. La conception utilise UML, PHP avec Laravel pour le backend, Angular pour le frontend, et PostgreSQL comme SGBD.",
    etiquettes: ["Immobilier", "CRM", "Web"],
    contacts: [
      { nom: "Ndeye Ngoundje Mbaye", email: "ndeyengoundje.mbaye@groupeisi.com", telephone: "+221 77 123 45 20" }
    ],
    cheminFichier: "/assets/documents/ndeye ngoundje og (4).pdf",
    fichierPdf: "public/assets/documents/ndeye ngoundje og (4).pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["CRM", "immobilier", "relation client", "Laravel", "Angular"]
  },
  {
    id: 20,
    titre: "Etude et réalisation d'une application de déclaration et suivi de pièces perdues",
    auteur: "Baye Bara Diop",
    auteurs: "Baye Bara Diop",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de déclaration et suivi de pièces perdues.",
    resume: "La gestion des pièces perdues est un défi majeur dans de nombreuses communautés. Nous proposons une plateforme numérique dédiée à la déclaration et au suivi des pièces perdues. Cette application permettra aux utilisateurs de déclarer la perte de leurs pièces et de suivre l'évolution de leur demande. Elle facilitera également le travail des agents étatiques en leur fournissant une base de données centralisée.",
    etiquettes: ["Administration publique", "Gestion", "Web"],
    contacts: [
      { nom: "Baye Bara Diop", email: "bayebara.diop@groupeisi.com", telephone: "+221 77 123 45 21" }
    ],
    cheminFichier: "/assets/documents/rapport_de_stage _baye_bara_diop.pdf",
    fichierPdf: "public/assets/documents/rapport_de_stage _baye_bara_diop.pdf",
    domaineEtude: "Génie Informatique",
    filiere: "Licence Professionnelle Génie Logiciel",
    motsCles: ["pièces perdues", "déclaration", "suivi", "administration"]
  }
];

async function initMemoires() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo');
    console.log('✅ Connecté à MongoDB');

    // Supprimer les mémoires existants
    console.log('🗑️  Suppression des mémoires existants...');
    await Memoire.deleteMany({});
    console.log('✅ Mémoires existants supprimés');

    // Insérer les nouveaux mémoires
    console.log('📝 Insertion des 20 mémoires...');
    const result = await Memoire.insertMany(memoiresData);
    console.log(`✅ ${result.length} mémoires insérés avec succès`);

    // Créer les index
    console.log('🔍 Création des index...');
    await Memoire.createIndexes();
    console.log('✅ Index créés avec succès');

    // Afficher un résumé
    console.log('\n📊 Résumé:');
    console.log(`   - Total de mémoires: ${result.length}`);
    console.log(`   - Années: ${[...new Set(memoiresData.map(m => m.annee))].join(', ')}`);
    console.log(`   - Départements: ${[...new Set(memoiresData.map(m => m.departement))].join(', ')}`);
    
    const etiquettesUniques = [...new Set(memoiresData.flatMap(m => m.etiquettes))];
    console.log(`   - Étiquettes (${etiquettesUniques.length}): ${etiquettesUniques.join(', ')}`);

    console.log('\n✅ Initialisation des mémoires terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des mémoires:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initMemoires()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { initMemoires };
