// Script pour créer la demande d'encadrement manquante
const mongoose = require('mongoose');
const { DemandeEncadrement, Dossier, getNextId } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

async function createMissingDemande() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier le dossier 2
    const dossier = await Dossier.findOne({ id: 2 });
    if (!dossier) {
      console.log('❌ Dossier 2 non trouvé');
      process.exit(1);
    }
    
    console.log(`📁 Dossier trouvé: "${dossier.titre}"`);
    console.log(`   EncadrantId: ${dossier.encadrantId}`);
    console.log(`   CandidatIds: ${dossier.candidatIds}`);

    // Vérifier si une demande existe déjà
    const existing = await DemandeEncadrement.findOne({ 
      dossierId: 2,
      encadrantId: 11 
    });
    
    if (existing) {
      console.log(`✓ Demande existante trouvée (ID: ${existing.id}, statut: ${existing.statut})`);
      if (existing.statut !== 'ACCEPTEE') {
        existing.statut = 'ACCEPTEE';
        existing.dateReponse = new Date();
        await existing.save();
        console.log('✅ Statut mis à jour vers ACCEPTEE');
      }
    } else {
      // Créer une nouvelle demande
      const nextId = await getNextId('DemandeEncadrement');
      const newDemande = new DemandeEncadrement({
        id: nextId,
        candidatId: dossier.candidatIds[0], // Premier candidat
        candidatNom: 'Fall Souleymane & Ndour Aliou',
        encadrantId: 11,
        encadrantNom: 'Encadrant',
        dossierId: 2,
        message: 'Demande créée automatiquement pour corriger les données',
        statut: 'ACCEPTEE',
        dateDemande: new Date(),
        dateReponse: new Date(),
        anneeAcademique: dossier.anneeAcademique
      });
      
      await newDemande.save();
      console.log(`✅ Nouvelle demande créée (ID: ${newDemande.id})`);
    }

    await mongoose.disconnect();
    console.log('✅ Terminé');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createMissingDemande();
