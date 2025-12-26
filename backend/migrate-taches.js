// Script de migration pour ajouter dossierId aux tâches existantes
const mongoose = require('mongoose');
const { Tache, DemandeEncadrement } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

async function migrateTaches() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer toutes les tâches
    const taches = await Tache.find({});
    console.log(`📋 ${taches.length} tâches trouvées`);

    let updated = 0;
    let skipped = 0;

    for (const tache of taches) {
      // Si la tâche a déjà un dossierId, on skip
      if (tache.dossierId) {
        skipped++;
        continue;
      }

      // Si la tâche a un demandeId, on peut retrouver le dossierId via DemandeEncadrement
      if (tache.demandeId) {
        const demande = await DemandeEncadrement.findOne({ id: tache.demandeId });
        if (demande && demande.dossierId) {
          tache.dossierId = demande.dossierId;
          await tache.save();
          console.log(`✓ Tâche ${tache.id} mise à jour avec dossierId=${demande.dossierId}`);
          updated++;
        } else {
          console.log(`⚠ Tâche ${tache.id}: demande ${tache.demandeId} non trouvée ou sans dossierId`);
        }
      } else {
        console.log(`⚠ Tâche ${tache.id}: pas de demandeId, impossible de déterminer le dossierId`);
      }
    }

    console.log(`\n=== RÉSUMÉ ===`);
    console.log(`Tâches mises à jour: ${updated}`);
    console.log(`Tâches déjà à jour: ${skipped}`);
    console.log(`Tâches non migrées: ${taches.length - updated - skipped}`);

    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrateTaches();
