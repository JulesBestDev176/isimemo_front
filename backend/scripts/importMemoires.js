const mongoose = require('mongoose');
const Memoire = require('../models/Memoire');
require('dotenv').config();

/**
 * Script pour importer les 20 mémoires dans MongoDB
 */

const memoiresData = [
  {
    id: 1,
    titre: "Mémoire - Abdou Fatah Ndiaye",
    auteurs: "Abdou Fatah Ndiaye",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Abdou Fatah Ndiaye.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 2,
    titre: "Portail Web pour la Gestion Dématérialisée des Services Municipaux",
    auteurs: "Étudiant",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf",
    motsCles: ["Web", "Gestion", "Services Municipaux", "Génie Logiciel"],
    resume: "Conception et réalisation d'un portail web pour la gestion dématérialisée des services municipaux",
    domaineEtude: "Développement Web & Systèmes d'Information",
    description: "Portail web de gestion des services municipaux"
  },
  {
    id: 3,
    titre: "Mémoire - Fall Ndour",
    auteurs: "Fall Ndour",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/FallNdour.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 4,
    titre: "Mémoire - Fatou Diop",
    auteurs: "Fatou Diop",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Fatou Diop.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 5,
    titre: "Mémoire - Khadija Sow",
    auteurs: "Khadija Sow",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Khadija Sow.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 6,
    titre: "Mémoire - Mamadou Diallo",
    auteurs: "Mamadou Diallo",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Mamadou Diallo.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 7,
    titre: "Mémoire - Moussa Ndiaye",
    auteurs: "Moussa Ndiaye",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Moussa Ndiaye.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 8,
    titre: "Mémoire - Oumou Khairy Sall",
    auteurs: "Oumou Khairy Sall",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Oumou Khairy Sall.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 9,
    titre: "Mémoire - Ousmane Sarr",
    auteurs: "Ousmane Sarr",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Ousmane Sarr.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 10,
    titre: "Mémoire - Rokhaya Gueye",
    auteurs: "Rokhaya Gueye",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Rokhaya Gueye.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 11,
    titre: "Système de Gestion des Entreprises Immobilières",
    auteurs: "Étudiant",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Système de Gestion des Entreprises Immobilières.pdf",
    motsCles: ["Gestion", "Immobilier", "Système", "Génie Logiciel"],
    resume: "Système de gestion pour les entreprises immobilières",
    domaineEtude: "Systèmes d'Information & Gestion",
    description: "Système de gestion des entreprises immobilières"
  },
  {
    id: 12,
    titre: "Mémoire - Yacine Dieng",
    auteurs: "Yacine Dieng",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Yacine Dieng.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 13,
    titre: "Mémoire - Youssou Ndour",
    auteurs: "Youssou Ndour",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Youssou Ndour.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 14,
    titre: "Mémoire - Zahra Ndiaye",
    auteurs: "Zahra Ndiaye",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Zahra Ndiaye.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 15,
    titre: "Mémoire - Zeynabou Sow",
    auteurs: "Zeynabou Sow",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Zeynabou Sow.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 16,
    titre: "Mémoire - Zoubeir Diop",
    auteurs: "Zoubeir Diop",
    annee: "2024",
    filiere: "Licence",
    departement: "Génie Logiciel",
    fichierPdf: "/assets/documents/Zoubeir Diop.pdf",
    motsCles: ["Génie Logiciel", "Licence", "2024"],
    resume: "Mémoire de fin d'études en Génie Logiciel",
    domaineEtude: "Génie Logiciel",
    description: "Mémoire de Licence en Génie Logiciel - 2024"
  },
  {
    id: 1001,
    titre: "Intelligence Artificielle dans l'Éducation : Applications et Défis",
    auteurs: "Diop Amadou, Sall Fatou",
    annee: "2023",
    filiere: "Informatique",
    departement: "Sciences et Technologies",
    fichierPdf: "uploads/memoires/ia_education_2023.pdf",
    motsCles: ["Intelligence Artificielle", "Éducation", "Machine Learning", "Pédagogie", "Innovation"],
    resume: "Ce mémoire explore l'utilisation de l'intelligence artificielle dans l'éducation, analysant ses applications pratiques et les défis associés à son intégration dans les systèmes éducatifs.",
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
    motsCles: ["LMS", "E-learning", "Gestion", "Plateforme", "Éducation"],
    resume: "Cette étude présente la conception et l'implémentation d'un système de gestion de l'apprentissage moderne, adapté aux besoins des établissements d'enseignement supérieur.",
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
    motsCles: ["Blockchain", "Certification", "Diplômes", "Sécurité", "Décentralisation"],
    resume: "Ce travail propose un système de certification académique basé sur la blockchain, garantissant l'authenticité et la traçabilité des diplômes universitaires.",
    domaineEtude: "Blockchain & Sécurité"
  },
  // Ajouter le canevas comme document important
  {
    id: 101,
    titre: "Canevas de mémoire officiel 2024-2025",
    auteurs: "Administration ISI",
    annee: "2024-2025",
    filiere: "Tous",
    departement: "Administration",
    fichierPdf: "/assets/documents/canevas_memoire.pdf",
    motsCles: ["Canevas", "Modèle", "Format", "Officiel"],
    resume: "Format officiel à utiliser pour tous les mémoires de fin d'études pour l'année académique 2024-2025.",
    domaineEtude: "Documentation Officielle",
    description: "Canevas officiel pour les mémoires 2024-2025"
  }
];

async function importMemoires() {
  try {
    console.log('═══════════════════════════════════════');
    console.log('IMPORTATION DES MÉMOIRES DANS MONGODB');
    console.log('═══════════════════════════════════════\n');

    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo');
    console.log('✓ Connecté à MongoDB\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const memoireData of memoiresData) {
      try {
        // Vérifier si le mémoire existe déjà
        const existing = await Memoire.findOne({ id: memoireData.id });

        if (existing) {
          console.log(`[${memoireData.id}] Déjà existant: ${memoireData.titre}`);
          skipped++;
        } else {
          // Créer le nouveau mémoire
          await Memoire.create(memoireData);
          console.log(`[${memoireData.id}] ✓ Importé: ${memoireData.titre}`);
          imported++;
        }
      } catch (error) {
        console.error(`[${memoireData.id}] ✗ Erreur: ${error.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('RÉSUMÉ DE L\'IMPORTATION');
    console.log('═══════════════════════════════════════');
    console.log(`Total: ${memoiresData.length} mémoires`);
    console.log(`✓ Importés: ${imported}`);
    console.log(`⊘ Déjà existants: ${skipped}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('Erreur fatale:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécuter l'importation
importMemoires();
