// Script d'initialisation complète de la base de données MongoDB
// Pour être utilisé avec MongoDB Compass
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

const {
  Candidat,
  Dossier,
  DemandeEncadrement,
  Tache,
  Professeur,
  getNextId
} = require('../models');

const initDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    console.log('━'.repeat(60));

    // ========================================
    // 1. CRÉER LES CANDIDATS
    // ========================================
    console.log('\n📚 ÉTAPE 1: Création des candidats');
    console.log('━'.repeat(60));

    let souleymaneCand = await Candidat.findOne({ id: 'CAND001' });
    if (!souleymaneCand) {
      souleymaneCand = new Candidat({
        id: 'CAND001',
        etudiantId: 'ETU2025001',
        nom: 'Fall',
        prenom: 'Souleymane',
        email: 'souleymanefallisidk@groupeisi.com',
        telephone: '+221 77 123 45 67',
        dateNaissance: '2000-01-15',
        lieuNaissance: 'Dakar',
        classe: 'L3 Génie Logiciel',
        motDePasse: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password123
        dateInscription: '2025-09-15'
      });
      await souleymaneCand.save();
      console.log('✅ Candidat Souleymane Fall créé');
    } else {
      console.log('ℹ️  Candidat Souleymane Fall existe déjà');
    }

    let aliouCand = await Candidat.findOne({ id: 'CAND002' });
    if (!aliouCand) {
      aliouCand = new Candidat({
        id: 'CAND002',
        etudiantId: 'ETU2025002',
        nom: 'Ndour',
        prenom: 'Aliou',
        email: 'alioundour@groupeisidk.groupeisi.com',
        telephone: '+221 77 234 56 78',
        dateNaissance: '2001-03-20',
        lieuNaissance: 'Thiès',
        classe: 'L3 Génie Logiciel',
        motDePasse: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password123
        dateInscription: '2025-09-15'
      });
      await aliouCand.save();
      console.log('✅ Candidat Aliou Ndour créé');
    } else {
      console.log('ℹ️  Candidat Aliou Ndour existe déjà');
    }

    // ========================================
    // 2. CRÉER LE PROFESSEUR ENCADRANT
    // ========================================
    console.log('\n👨‍🏫 ÉTAPE 2: Création du professeur encadrant');
    console.log('━'.repeat(60));

    let professeur = await Professeur.findOne({ id: 11 });
    if (!professeur) {
      professeur = new Professeur({
        id: 11,
        nom: 'Diop',
        prenom: 'Mamadou',
        email: 'mamadou.diop@groupeisi.com',
        telephone: '+221 77 345 67 89',
        specialite: 'Intelligence Artificielle et Data Science',
        grade: 'Maître Assistant',
        departement: 'Informatique',
        bureau: 'B205',
        estEncadrant: true,
        estMembreJury: true,
        nombreEncadrementsEnCours: 1,
        nombreEncadrementsTotal: 8
      });
      await professeur.save();
      console.log('✅ Professeur Mamadou Diop créé');
    } else {
      console.log('ℹ️  Professeur Mamadou Diop existe déjà');
    }

    // ========================================
    // 3. CRÉER LE DOSSIER
    // ========================================
    console.log('\n📁 ÉTAPE 3: Création du dossier de mémoire');
    console.log('━'.repeat(60));

    let dossier = await Dossier.findOne({ id: 2 });
    if (!dossier) {
      dossier = new Dossier({
        id: 2,
        titre: 'Plateforme Intelligente de Gestion des Mémoires Académiques cas de l\'ISI',
        description: 'Ce projet de fin d\'études, réalisé dans le cadre de la Licence en Génie Informatique à l\'Institut Supérieur d\'Informatique (ISI), porte sur la conception et le développement de PIGMA, une Plateforme Intelligente de Gestion des Mémoires Académiques. Cette solution web a pour objectif de digitaliser et centraliser l\'ensemble du processus de gestion des mémoires, depuis la proposition de sujet jusqu\'à la soutenance finale.\n\nPIGMA vise à moderniser une gestion encore largement manuelle en automatisant les principales étapes du cycle académique, notamment le dépôt électronique des mémoires, la planification des soutenances, la coordination des jurys et la communication entre étudiants et encadrants.\n\nLa plateforme intègre également des fonctionnalités basées sur l\'Intelligence Artificielle, telles que la détection automatique de plagiat, la classification thématique des mémoires, la recommandation de sujets pertinents et un ChatBot d\'assistance. En offrant une solution innovante et adaptée aux besoins de l\'ISI, PIGMA contribue à améliorer la coordination académique, à valoriser le patrimoine universitaire à travers une médiathèque numérique intelligente et à renforcer la qualité, la transparence et le suivi des mémoires académiques.',
        statut: 'EN_COURS',
        etape: 'REDACTION',
        dateCreation: '2025-09-20',
        dateModification: new Date().toISOString().split('T')[0],
        anneeAcademique: '2025-2026',
        candidatIds: ['CAND001', 'CAND002'],
        progression: 75,
        sujetId: 13,
        encadrantId: 11,
        autorisePrelecture: false,
        prelectureEffectuee: false,
        autoriseSoutenance: false,
        scorePlagiat: 0
      });
      await dossier.save();
      console.log('✅ Dossier de mémoire créé (ID: 2)');
      console.log(`   Titre: ${dossier.titre}`);
      console.log(`   Candidats: ${dossier.candidatIds.join(', ')}`);
    } else {
      // Mettre à jour les candidatIds si nécessaire
      dossier.candidatIds = ['CAND001', 'CAND002'];
      dossier.encadrantId = 11;
      await dossier.save();
      console.log('ℹ️  Dossier existe déjà (mis à jour)');
    }

    // ========================================
    // 4. CRÉER LA DEMANDE D'ENCADREMENT
    // ========================================
    console.log('\n📝 ÉTAPE 4: Création de la demande d\'encadrement');
    console.log('━'.repeat(60));

    let demande = await DemandeEncadrement.findOne({ dossierId: 2 });
    if (!demande) {
      const demandeId = await getNextId('DemandeEncadrement');
      demande = new DemandeEncadrement({
        id: demandeId,
        dossierId: 2,
        encadrantId: 11,
        statut: 'ACCEPTEE',
        dateCreation: '2025-09-25',
        dateReponse: '2025-09-26',
        anneeAcademique: '2025-2026',
        message: 'Nous souhaitons vous avoir comme encadrant pour notre projet de fin d\'études sur PIGMA.'
      });
      await demande.save();
      console.log('✅ Demande d\'encadrement créée et acceptée');
      console.log(`   ID Demande: ${demande.id}`);
    } else {
      demande.statut = 'ACCEPTEE';
      await demande.save();
      console.log('ℹ️  Demande d\'encadrement existe déjà');
    }

    // ========================================
    // 5. CRÉER DES TÂCHES
    // ========================================
    console.log('\n✅ ÉTAPE 5: Création des tâches');
    console.log('━'.repeat(60));

    const tachesData = [
      {
        titre: 'Rédaction du chapitre 1 : Introduction',
        description: 'Rédiger l\'introduction générale du mémoire incluant le contexte, la problématique et les objectifs.',
        priorite: 'Haute',
        dateEcheance: '2025-10-15',
        statut: 'done',
        ordre: 1
      },
      {
        titre: 'Rédaction du chapitre 2 : État de l\'art',
        description: 'Effectuer une revue de la littérature sur les systèmes de gestion de mémoires existants.',
        priorite: 'Haute',
        dateEcheance: '2025-11-01',
        statut: 'done',
        ordre: 2
      },
      {
        titre: 'Conception de l\'architecture système',
        description: 'Concevoir l\'architecture complète du système PIGMA avec les diagrammes UML.',
        priorite: 'Critique',
        dateEcheance: '2025-11-20',
        statut: 'done',
        ordre: 3
      },
      {
        titre: 'Développement du module de gestion des utilisateurs',
        description: 'Implémenter le système d\'authentification et de gestion des rôles.',
        priorite: 'Haute',
        dateEcheance: '2025-12-10',
        statut: 'done',
        ordre: 4
      },
      {
        titre: 'Développement du module de détection de plagiat',
        description: 'Intégrer et configurer l\'outil de détection automatique de plagiat.',
        priorite: 'Critique',
        dateEcheance: '2025-12-20',
        statut: 'done',
        ordre: 5
      }
    ];

    let tachesCreees = 0;
    for (const tacheData of tachesData) {
      const existingTache = await Tache.findOne({
        titre: tacheData.titre,
        demandeId: demande.id
      });

      if (!existingTache) {
        const tacheId = await getNextId('Tache');
        const tache = new Tache({
          id: tacheId,
          anneeAcademique: '2025-2026',
          encadrantId: 11,
          demandeId: demande.id,
          ...tacheData,
          dateCreation: new Date().toISOString()
        });
        await tache.save();
        tachesCreees++;
      }
    }

    console.log(`✅ ${tachesCreees} tâche(s) créée(s) (toutes avec statut "done")`);

    // ========================================
    // RÉSUMÉ FINAL
    // ========================================
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('✅ INITIALISATION TERMINÉE AVEC SUCCÈS!');
    console.log('═'.repeat(60));
    console.log('\n📊 RÉSUMÉ:');
    console.log('━'.repeat(60));
    console.log('\n👥 CANDIDATS:');
    console.log(`   • Souleymane Fall (${souleymaneCand.email})`);
    console.log(`     ID: ${souleymaneCand.id}`);
    console.log(`     Mot de passe: password123`);
    console.log(`   • Aliou Ndour (${aliouCand.email})`);
    console.log(`     ID: ${aliouCand.id}`);
    console.log(`     Mot de passe: password123`);

    console.log('\n👨‍🏫 ENCADRANT:');
    console.log(`   • Prof. Mamadou Diop (${professeur.email})`);
    console.log(`     ID: ${professeur.id}`);
    console.log(`     Spécialité: ${professeur.specialite}`);

    console.log('\n📁 DOSSIER:');
    console.log(`   • ID: ${dossier.id}`);
    console.log(`   • Titre: ${dossier.titre.substring(0, 50)}...`);
    console.log(`   • Étape: ${dossier.etape}`);
    console.log(`   • Progression: ${dossier.progression}%`);

    console.log('\n📝 DEMANDE D\'ENCADREMENT:');
    console.log(`   • ID: ${demande.id}`);
    console.log(`   • Statut: ${demande.statut}`);

    console.log('\n✅ TÂCHES:');
    const allTaches = await Tache.find({ demandeId: demande.id });
    console.log(`   • Total: ${allTaches.length} tâches`);
    console.log(`   • Terminées: ${allTaches.filter(t => t.statut === 'done').length}`);
    console.log(`   • Toutes les tâches sont à "done" ✓`);

    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('━'.repeat(60));
    console.log('1. Démarrer le backend: cd backend && npm run dev');
    console.log('2. Démarrer le frontend: npm run dev');
    console.log('3. Se connecter en tant que professeur');
    console.log('4. Aller à: http://localhost:3000/professeur/encadrements');
    console.log('5. Onglet "Supervision" → Superviser Souleymane/Aliou');
    console.log('6. Le bouton "AUTORISER PRÉ-LECTURE" devrait apparaître! 🎉');
    console.log('━'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
};

initDatabase();
