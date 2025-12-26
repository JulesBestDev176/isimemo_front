// ============================================================================
// SCRIPT DE PEUPLEMENT - EXEMPLES DE MÉMOIRES
// ============================================================================
// Ce script ajoute des exemples de mémoires dans la base de données
// pour tester le chatbot

require('dotenv').config();
const mongoose = require('mongoose');
const { Memoire } = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

// Exemples de mémoires à insérer
const memoiresExemples = [
  {
    id: 1001,
    titre: "Intelligence Artificielle dans l'Éducation : Applications et Défis",
    auteurs: "Diop Amadou, Sall Fatou",
    annee: "2023",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/ia_education_2023.pdf",
    motsCles: ["intelligence artificielle", "éducation", "apprentissage automatique", "machine learning", "e-learning"],
    resume: "Ce mémoire explore l'utilisation de l'intelligence artificielle dans le domaine de l'éducation. Il examine les différentes applications telles que les systèmes de tutorat intelligents, la personnalisation de l'apprentissage, et l'analyse prédictive des performances étudiantes.",
    domaineEtude: "Intelligence Artificielle & Éducation"
  },
  {
    id: 1002,
    titre: "Systèmes de Gestion de l'Apprentissage : Conception et Implémentation",
    auteurs: "Ndiaye Cheikh, Ba Aissatou",
    annee: "2023",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/lms_2023.pdf",
    motsCles: ["LMS", "e-learning", "gestion apprentissage", "plateforme éducative", "web"],
    resume: "Cette étude présente la conception et l'implémentation d'un système de gestion de l'apprentissage (LMS) adapté aux besoins des établissements d'enseignement supérieur sénégalais. Le système intègre des fonctionnalités modernes de gestion de cours, de suivi des étudiants et d'évaluation.",
    domaineEtude: "Systèmes d'Information & Éducation"
  },
  {
    id: 1003,
    titre: "Blockchain et Certification Académique : Une Nouvelle Approche",
    auteurs: "Cissé Mohamed, Thiam Mariama",
    annee: "2024",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/blockchain_diplomes_2024.pdf",
    motsCles: ["blockchain", "certification", "diplômes", "sécurité", "décentralisation"],
    resume: "Ce travail propose un système de certification académique basé sur la blockchain pour garantir l'authenticité et la sécurité des diplômes. L'étude examine les avantages de la décentralisation et de l'immuabilité pour la vérification des qualifications.",
    domaineEtude: "Blockchain & Sécurité"
  },
  {
    id: 1004,
    titre: "Analyse de Données Massives pour l'Amélioration des Performances Académiques",
    auteurs: "Fall Ibrahima, Gueye Awa",
    annee: "2023",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/big_data_education_2023.pdf",
    motsCles: ["big data", "analyse de données", "performance académique", "data mining", "prédiction"],
    resume: "Cette recherche utilise les techniques de big data et de data mining pour analyser les performances académiques des étudiants. Le système développé permet d'identifier les facteurs de réussite et de prédire les risques d'échec pour une intervention précoce.",
    domaineEtude: "Big Data & Analyse Prédictive"
  },
  {
    id: 1005,
    titre: "Développement Mobile pour l'Éducation : Applications et Bonnes Pratiques",
    auteurs: "Sy Ousmane, Diallo Khady",
    annee: "2024",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/mobile_learning_2024.pdf",
    motsCles: ["mobile", "application mobile", "m-learning", "Android", "iOS", "éducation"],
    resume: "Ce mémoire présente le développement d'applications mobiles éducatives pour Android et iOS. Il explore les meilleures pratiques en matière d'ergonomie, d'accessibilité et de pédagogie mobile pour créer des expériences d'apprentissage efficaces.",
    domaineEtude: "Développement Mobile & Éducation"
  }
];

async function populerMemoires() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les exemples existants si nécessaire
    await Memoire.deleteMany({ id: { $gte: 1001, $lte: 1005 } });
    console.log('🗑️  Anciens exemples supprimés');

    // Insérer les nouveaux exemples
    await Memoire.insertMany(memoiresExemples);
    console.log(`✅ ${memoiresExemples.length} mémoires d'exemple ajoutés avec succès!`);

    // Afficher les mémoires ajoutés
    console.log('\nMémoires ajoutés:');
    memoiresExemples.forEach((m, index) => {
      console.log(`${index + 1}. ${m.titre} (${m.annee})`);
    });

    console.log('\n✨ Peuplement terminé!');
    console.log('\n💡 Note: Les fichiers PDF ne sont pas créés. Assurez-vous de les ajouter manuellement');
    console.log('   dans le dossier uploads/memoires/ ou le chatbot utilisera uniquement les métadonnées.\n');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script
populerMemoires();
