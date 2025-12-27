// Script pour ajouter Souleymane et Aliou dans la base de données
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

// Importer les modèles
const { Candidat, Dossier } = require('../models');

const ajouterEtudiants = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Créer ou mettre à jour Souleymane Fall
    let souleymaneCand = await Candidat.findOne({ email: 'souleymanefallisidk@groupeisi.com' });

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
        motDePasse: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password: "password123"
        dateInscription: new Date().toISOString().split('T')[0]
      });
      await souleymaneCand.save();
      console.log('✅ Candidat Souleymane créé:', souleymaneCand.id);
    } else {
      // Mettre à jour l'email si nécessaire
      souleymaneCand.email = 'souleymanefallisidk@groupeisi.com';
      await souleymaneCand.save();
      console.log('✅ Candidat Souleymane existe déjà (mis à jour):', souleymaneCand.id);
    }

    // 2. Créer ou mettre à jour Aliou Ndour
    let aliouCand = await Candidat.findOne({ email: 'alioundour@groupeisidk.groupeisi.com' });

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
        motDePasse: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password: "password123"
        dateInscription: new Date().toISOString().split('T')[0]
      });
      await aliouCand.save();
      console.log('✅ Candidat Aliou créé:', aliouCand.id);
    } else {
      // Mettre à jour l'email si nécessaire
      aliouCand.email = 'alioundour@groupeisidk.groupeisi.com';
      await aliouCand.save();
      console.log('✅ Candidat Aliou existe déjà (mis à jour):', aliouCand.id);
    }

    // 3. Mettre à jour le dossier existant avec les IDs des candidats
    const dossier = await Dossier.findOne({ id: 2 });

    if (dossier) {
      dossier.candidatIds = [souleymaneCand.id, aliouCand.id];
      await dossier.save();
      console.log('✅ Dossier mis à jour avec les candidats:', dossier.candidatIds);
      console.log('   Titre:', dossier.titre);
    } else {
      console.log('⚠️ Aucun dossier avec id=2 trouvé');
    }

    console.log('\n✅ TERMINÉ!');
    console.log('━'.repeat(60));
    console.log('Souleymane Fall:', {
      candidatId: souleymaneCand.id,
      email: 'souleymanefallisidk@groupeisi.com',
      nom: 'Fall',
      prenom: 'Souleymane'
    });
    console.log('Aliou Ndour:', {
      candidatId: aliouCand.id,
      email: 'alioundour@groupeisidk.groupeisi.com',
      nom: 'Ndour',
      prenom: 'Aliou'
    });
    console.log('━'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

ajouterEtudiants();
