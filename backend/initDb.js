// ============================================================================
// SCRIPT D'INITIALISATION DE LA BASE MONGODB - VERSION 2
// ============================================================================

const mongoose = require('mongoose');
const {
  Etudiant,
  Professeur,
  Candidat,
  Dossier,
  Encadrant,
  Sujet,
  User,
  Session,
  Salle,
  Counter
} = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

// Données initiales
const initialData = {
  // Étudiants (base de référence - liste complète)
  etudiants: [
    { id: "ETU001", nom: "Ndiaye", prenom: "Abdou Fatah", email: "abdoufatahndiayeisidk@groupeisi.com", telephone: "+221 77 123 45 01", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU002", nom: "Diallo", prenom: "Al Hassane", email: "alhassanedialloisidk@groupeisi.com", telephone: "+221 77 123 45 02", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU003", nom: "Fall", prenom: "Souleymane", email: "souleymanefallisidk@groupeisi.com", telephone: "+221 77 715 10 61", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU004", nom: "Ndour", prenom: "Aliou", email: "alioundourisidk@groupeisi.com", telephone: "+221 76 561 68 68", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU005", nom: "Bocoum", prenom: "Ibrahima Amadou", email: "ibrahimaamadoubocoumisidk@groupeisi.com", telephone: "+221 77 123 45 05", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU006", nom: "Diallo", prenom: "Houleymatou", email: "houleymatoudialloisidk@groupeisi.com", telephone: "+221 77 123 45 06", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU007", nom: "Traore", prenom: "Cheikh Tidiane", email: "cheikhtidianetraoreisidk@groupeisi.com", telephone: "+221 77 123 45 07", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU008", nom: "Thiam", prenom: "Awa", email: "awathiamisidk@groupeisi.com", telephone: "+221 77 123 45 08", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU009", nom: "Diallo", prenom: "Bassine", email: "bassinedialloisidk@groupeisi.com", telephone: "+221 77 123 45 09", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU010", nom: "Sakho", prenom: "Mama Aichatou", email: "mamaaichatousakhoisidk@groupeisi.com", telephone: "+221 77 123 45 10", niveau: "L3", departement: "Génie Informatique", filiere: "Génie Logiciel" },
    { id: "ETU020", nom: "Ba", prenom: "Mamadou", email: "mamadoubaisidk@groupeisi.com", telephone: "+221 77 222 00 01", niveau: "L2", departement: "Génie Informatique", filiere: "Développement Web" },
    { id: "ETU021", nom: "Sy", prenom: "Fatou", email: "fatousyisidk@groupeisi.com", telephone: "+221 77 222 00 02", niveau: "L1", departement: "Génie Civil", filiere: "BTP" }
  ],
  
  // Professeurs (base de référence - liste complète avec emails @groupeisi.com)
  professeurs: [
    { id: "PROF001", nom: "Diop", prenom: "Moussa", email: "moussadiopisidk@groupeisi.com", telephone: "+221 77 500 01 01", bureau: "Bâtiment A - Bureau 201", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Intelligence Artificielle & Machine Learning", domainesRecherche: ["Deep Learning", "Vision par ordinateur", "NLP"] },
    { id: "PROF002", nom: "Ndiaye", prenom: "Fatou", email: "fatoundiayeisidk@groupeisi.com", telephone: "+221 77 500 01 02", bureau: "Bâtiment A - Bureau 205", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Développement Web & Mobile", domainesRecherche: ["React", "Node.js", "Applications mobiles"] },
    { id: "PROF003", nom: "Sow", prenom: "Abdoulaye", email: "abdoulayesowisidk@groupeisi.com", telephone: "+221 77 500 01 03", bureau: "Bâtiment B - Bureau 102", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Bases de données & Big Data", domainesRecherche: ["MongoDB", "PostgreSQL", "Data Mining"] },
    { id: "PROF004", nom: "Ba", prenom: "Mariama", email: "mariamabaisidk@groupeisi.com", telephone: "+221 77 500 01 04", bureau: "Bâtiment B - Bureau 108", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Cybersécurité & Cryptographie", domainesRecherche: ["Sécurité des applications", "Blockchain", "Audit sécurité"] },
    { id: "PROF005", nom: "Faye", prenom: "Ousmane", email: "ousmanefayeisidk@groupeisi.com", telephone: "+221 77 500 01 05", bureau: "Bâtiment A - Bureau 302", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "Data Science & Analytics", domainesRecherche: ["Python", "R", "Visualisation de données"] },
    { id: "PROF006", nom: "Gueye", prenom: "Aissatou", email: "aissatougueyeisidk@groupeisi.com", telephone: "+221 77 500 01 06", bureau: "Bâtiment C - Bureau 101", grade: "Maître Assistant", departement: "Génie Informatique", specialite: "Réseaux & Télécommunications", domainesRecherche: ["IoT", "5G", "Réseaux sans fil"] },
    { id: "PROF007", nom: "Sarr", prenom: "Ibrahima", email: "ibrahimasarrisidk@groupeisi.com", telephone: "+221 77 500 01 07", bureau: "Bâtiment A - Bureau 210", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Génie Logiciel & Architecture", domainesRecherche: ["Microservices", "DevOps", "Clean Architecture"] },
    { id: "PROF008", nom: "Mbaye", prenom: "Cheikh Anta", email: "cheikhmmbayeisidk@groupeisi.com", telephone: "+221 77 500 01 08", bureau: "Bâtiment B - Bureau 201", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Systèmes Embarqués", domainesRecherche: ["Arduino", "Raspberry Pi", "Robotique"] },
    { id: "PROF009", nom: "Diouf", prenom: "Amadou Bamba", email: "amadoudioufisidk@groupeisi.com", telephone: "+221 77 500 01 09", bureau: "Bâtiment C - Bureau 205", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "Cloud Computing", domainesRecherche: ["AWS", "Azure", "Kubernetes"] },
    { id: "PROF010", nom: "Cissé", prenom: "Aminata", email: "aminatacisseisidk@groupeisi.com", telephone: "+221 77 500 01 10", bureau: "Bâtiment A - Bureau 105", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Traitement du langage naturel", domainesRecherche: ["Wolof NLP", "Traduction automatique", "Chatbots"] },
    { id: "PROF011", nom: "Wade", prenom: "Moussa", email: "moussawadeisidk@groupeisi.com", telephone: "+221 77 500 01 11", bureau: "Bâtiment B - Bureau 305", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "DevOps & Infrastructure", domainesRecherche: ["DevOps", "CI/CD", "Docker", "Kubernetes", "Infrastructure as Code"] }
  ],
  
  // Encadrants (professeurs inscrits sur la plateforme - créés à partir des professeurs)
  encadrants: [
    { id: 1, professeurId: "PROF001", nom: "Diop", prenom: "Moussa", email: "moussadiopisidk@groupeisi.com", telephone: "+221 77 500 01 01", bureau: "Bâtiment A - Bureau 201", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Intelligence Artificielle & Machine Learning", domainesRecherche: ["Deep Learning", "Vision par ordinateur", "NLP"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 },
    { id: 2, professeurId: "PROF002", nom: "Ndiaye", prenom: "Fatou", email: "fatoundiayeisidk@groupeisi.com", telephone: "+221 77 500 01 02", bureau: "Bâtiment A - Bureau 205", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Développement Web & Mobile", domainesRecherche: ["React", "Node.js", "Applications mobiles"], estDisponible: true, capaciteEncadrement: 4, nombreEncadrementsActuels: 0 },
    { id: 3, professeurId: "PROF003", nom: "Sow", prenom: "Abdoulaye", email: "abdoulayesowisidk@groupeisi.com", telephone: "+221 77 500 01 03", bureau: "Bâtiment B - Bureau 102", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Bases de données & Big Data", domainesRecherche: ["MongoDB", "PostgreSQL", "Data Mining"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 },
    { id: 4, professeurId: "PROF004", nom: "Ba", prenom: "Mariama", email: "mariamabaisidk@groupeisi.com", telephone: "+221 77 500 01 04", bureau: "Bâtiment B - Bureau 108", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Cybersécurité & Cryptographie", domainesRecherche: ["Sécurité des applications", "Blockchain", "Audit sécurité"], estDisponible: true, capaciteEncadrement: 4, nombreEncadrementsActuels: 0 },
    { id: 5, professeurId: "PROF005", nom: "Faye", prenom: "Ousmane", email: "ousmanefayeisidk@groupeisi.com", telephone: "+221 77 500 01 05", bureau: "Bâtiment A - Bureau 302", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "Data Science & Analytics", domainesRecherche: ["Python", "R", "Visualisation de données"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 },
    { id: 6, professeurId: "PROF006", nom: "Gueye", prenom: "Aissatou", email: "aissatougueyeisidk@groupeisi.com", telephone: "+221 77 500 01 06", bureau: "Bâtiment C - Bureau 101", grade: "Maître Assistant", departement: "Génie Informatique", specialite: "Réseaux & Télécommunications", domainesRecherche: ["IoT", "5G", "Réseaux sans fil"], estDisponible: true, capaciteEncadrement: 3, nombreEncadrementsActuels: 0 },
    { id: 7, professeurId: "PROF007", nom: "Sarr", prenom: "Ibrahima", email: "ibrahimasarrisidk@groupeisi.com", telephone: "+221 77 500 01 07", bureau: "Bâtiment A - Bureau 210", grade: "Professeur Titulaire", departement: "Génie Informatique", specialite: "Génie Logiciel & Architecture", domainesRecherche: ["Microservices", "DevOps", "Clean Architecture"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 },
    { id: 8, professeurId: "PROF008", nom: "Mbaye", prenom: "Cheikh Anta", email: "cheikhmmbayeisidk@groupeisi.com", telephone: "+221 77 500 01 08", bureau: "Bâtiment B - Bureau 201", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Systèmes Embarqués", domainesRecherche: ["Arduino", "Raspberry Pi", "Robotique"], estDisponible: true, capaciteEncadrement: 4, nombreEncadrementsActuels: 0 },
    { id: 9, professeurId: "PROF009", nom: "Diouf", prenom: "Amadou Bamba", email: "amadoudioufisidk@groupeisi.com", telephone: "+221 77 500 01 09", bureau: "Bâtiment C - Bureau 205", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "Cloud Computing", domainesRecherche: ["AWS", "Azure", "Kubernetes"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 },
    { id: 10, professeurId: "PROF010", nom: "Cissé", prenom: "Aminata", email: "aminatacisseisidk@groupeisi.com", telephone: "+221 77 500 01 10", bureau: "Bâtiment A - Bureau 105", grade: "Maître de Conférences", departement: "Génie Informatique", specialite: "Traitement du langage naturel", domainesRecherche: ["Wolof NLP", "Traduction automatique", "Chatbots"], estDisponible: true, capaciteEncadrement: 4, nombreEncadrementsActuels: 0 },
    { id: 11, professeurId: "PROF011", nom: "Wade", prenom: "Moussa", email: "moussawadeisidk@groupeisi.com", telephone: "+221 77 500 01 11", bureau: "Bâtiment B - Bureau 305", grade: "Professeur Agrégé", departement: "Génie Informatique", specialite: "DevOps & Infrastructure", domainesRecherche: ["DevOps", "CI/CD", "Docker", "Kubernetes", "Infrastructure as Code"], estDisponible: true, capaciteEncadrement: 5, nombreEncadrementsActuels: 0 }
  ],
  
  // Sujets de mémoire
  sujets: [
    { id: 1, titre: "Système de recommandation pour e-commerce sénégalais", description: "Développer un système de recommandation personnalisé utilisant le machine learning pour améliorer l'expérience utilisateur sur les plateformes de commerce électronique locales.", motsCles: ["IA", "Machine Learning", "E-commerce"], objectifs: ["Analyser les données clients", "Implémenter l'algorithme de filtrage collaboratif", "Créer une API de recommandation"], encadrantId: 1, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-09-01" },
    { id: 2, titre: "Application mobile de suivi de santé communautaire", description: "Créer une application mobile permettant le suivi médical de proximité dans les zones rurales du Sénégal.", motsCles: ["Mobile", "Santé", "React Native"], objectifs: ["Développer l'interface mobile", "Implémenter le mode hors-ligne", "Créer le tableau de bord médecin"], encadrantId: 2, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-09-05" },
    { id: 3, titre: "Plateforme de gestion académique intelligente", description: "Développement d'une plateforme complète de gestion des parcours académiques intégrant l'analyse prédictive.", motsCles: ["Web", "Gestion", "Analytics"], objectifs: ["Concevoir l'architecture", "Implémenter le module de prédiction", "Développer le dashboard"], encadrantId: 3, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-09-10" },
    { id: 4, titre: "Système de détection de fraude mobile money", description: "Concevoir un système utilisant le deep learning pour détecter les transactions frauduleuses sur Orange Money et Wave.", motsCles: ["Sécurité", "Deep Learning", "Mobile Money"], objectifs: ["Collecter les données", "Entraîner le modèle", "Créer l'interface d'alerte"], encadrantId: 4, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-09-15" },
    { id: 5, titre: "Chatbot bilingue Français-Wolof pour services publics", description: "Développer un assistant conversationnel capable de répondre en français et en wolof.", motsCles: ["NLP", "Chatbot", "Wolof"], objectifs: ["Développer le corpus wolof", "Implémenter le modèle NLP", "Intégrer avec les APIs"], encadrantId: 10, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-09-20" },
    { id: 6, titre: "Solution IoT pour l'agriculture intelligente", description: "Concevoir un système de capteurs connectés pour l'irrigation intelligente au Sénégal.", motsCles: ["IoT", "Agriculture", "Capteurs"], objectifs: ["Concevoir le réseau de capteurs", "Développer l'app de monitoring", "Automatiser l'irrigation"], encadrantId: 6, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-01" },
    { id: 7, titre: "Plateforme de microservices pour fintech", description: "Architecturer une plateforme basée sur les microservices pour une startup fintech.", motsCles: ["Microservices", "Docker", "Fintech"], objectifs: ["Concevoir l'architecture", "Implémenter les services core", "Mettre en place CI/CD"], encadrantId: 7, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-05" },
    { id: 8, titre: "Robot éducatif pour l'apprentissage du code", description: "Concevoir et programmer un robot éducatif low-cost pour initier les enfants à la programmation.", motsCles: ["Robotique", "Éducation", "Arduino"], objectifs: ["Concevoir le prototype", "Développer la plateforme visuelle", "Créer le curriculum"], encadrantId: 8, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-10" },
    { id: 9, titre: "Infrastructure cloud pour PME sénégalaises", description: "Concevoir une solution cloud adaptée aux besoins et contraintes des PME sénégalaises.", motsCles: ["Cloud", "AWS", "PME"], objectifs: ["Analyser les besoins des PME", "Concevoir l'architecture", "Implémenter les outils"], encadrantId: 9, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-15" },
    { id: 10, titre: "Analyse prédictive du trafic urbain à Dakar", description: "Développer un système d'analyse et de prédiction du trafic routier à Dakar.", motsCles: ["Data Science", "Trafic", "Prédiction"], objectifs: ["Collecter les données", "Développer les modèles", "Créer le dashboard"], encadrantId: 5, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-20" },
    { id: 11, titre: "Système de vote électronique sécurisé", description: "Concevoir un système de vote électronique utilisant la blockchain.", motsCles: ["Blockchain", "Sécurité", "Vote"], objectifs: ["Concevoir le smart contract", "Implémenter l'interface", "Développer la vérification"], encadrantId: 4, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-10-25" },
    { id: 12, titre: "Application de gestion des déchets intelligente", description: "Développer une application pour optimiser la collecte des déchets en ville.", motsCles: ["IoT", "Smart City", "Environnement"], objectifs: ["Installer les capteurs", "Développer l'algorithme", "Créer le dashboard municipal"], encadrantId: 6, niveau: "L3", statut: "approuve", disponible: true, nombreMaxEtudiants: 2, nombreEtudiantsActuels: 0, dateCreation: "2025-11-01" }
  ],
  
  // Users (admin seulement - les profs se connectent via leur compte encadrant)
  users: [
    { id: "ADMIN001", email: "admin@isi.edu.sn", password: "admin123", nom: "Admin", prenom: "System", role: "ADMIN" }
  ],
  
  sessions: [
    { id: 1, nom: "Session Juin 2026", typeSession: "JUIN", anneeAcademique: "2025-2026", dateDebut: "2026-06-01", dateFin: "2026-06-30", statut: "PLANIFIEE", dateCreation: "2025-12-01" }
  ],
  
  salles: [
    { id: 1, nom: "Amphi A", batiment: "Bâtiment Principal", capacite: 200, estDisponible: true },
    { id: 2, nom: "Salle 101", batiment: "Bâtiment Informatique", capacite: 30, estDisponible: true },
    { id: 3, nom: "Salle 102", batiment: "Bâtiment Informatique", capacite: 30, estDisponible: true },
    { id: 4, nom: "Salle de soutenance", batiment: "Bâtiment Principal", capacite: 20, estDisponible: true }
  ],
  
  counters: [
    { _id: 'candidat', seq: 0 },
    { _id: 'encadrant', seq: 10 },
    { _id: 'dossier', seq: 0 },
    { _id: 'demandeBinome', seq: 0 },
    { _id: 'demandeEncadrement', seq: 0 },
    { _id: 'document', seq: 0 },
    { _id: 'message', seq: 0 },
    { _id: 'notification', seq: 0 },
    { _id: 'sujet', seq: 12 }
  ]
};

async function initDatabase() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🗑️ Nettoyage des collections existantes...');
    await Etudiant.deleteMany({});
    await Professeur.deleteMany({});
    await Candidat.deleteMany({});
    await Dossier.deleteMany({});
    await Encadrant.deleteMany({});
    await Sujet.deleteMany({});
    await User.deleteMany({});
    await Session.deleteMany({});
    await Salle.deleteMany({});
    await Counter.deleteMany({});

    console.log('📥 Insertion des données initiales...');
    
    await Etudiant.insertMany(initialData.etudiants);
    console.log(`   ✓ ${initialData.etudiants.length} étudiants (base de référence)`);
    
    await Professeur.insertMany(initialData.professeurs);
    console.log(`   ✓ ${initialData.professeurs.length} professeurs (base de référence)`);
    
    await Encadrant.insertMany(initialData.encadrants);
    console.log(`   ✓ ${initialData.encadrants.length} encadrants (professeurs inscrits)`);
    
    await Sujet.insertMany(initialData.sujets);
    console.log(`   ✓ ${initialData.sujets.length} sujets de mémoire`);
    
    await User.insertMany(initialData.users);
    console.log(`   ✓ ${initialData.users.length} administrateurs`);
    
    await Session.insertMany(initialData.sessions);
    console.log(`   ✓ ${initialData.sessions.length} sessions`);
    
    await Salle.insertMany(initialData.salles);
    console.log(`   ✓ ${initialData.salles.length} salles`);
    
    await Counter.insertMany(initialData.counters);
    console.log(`   ✓ Compteurs initialisés`);

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   ✅ Base de données ISIMemo initialisée avec succès !');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   📊 Résumé:');
    console.log(`      • ${initialData.etudiants.length} étudiants (base)`);
    console.log(`      • ${initialData.professeurs.length} professeurs (base)`);
    console.log(`      • 0 candidats (inscription via l'app)`);
    console.log(`      • ${initialData.encadrants.length} encadrants (profs inscrits)`);
    console.log(`      • ${initialData.sujets.length} sujets de mémoire`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('   📧 Format emails: nomprenom + isidk@groupeisi.com');
    console.log('   🔑 Étudiant → Candidat (après inscription)');
    console.log('   🔑 Professeur → Encadrant (après inscription)');
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

initDatabase();
