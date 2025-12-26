const mongoose = require('mongoose');
const { Tache } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

async function checkTaskStatuses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer les tâches avec dossierId = 2
    const taches = await Tache.find({ dossierId: 2 });
    
    console.log(`📋 TÂCHES POUR DOSSIER 2 (${taches.length} trouvées):\n`);
    
    taches.forEach(t => {
      console.log(`Tâche ${t.id}:`);
      console.log(`  Titre: "${t.titre}"`);
      console.log(`  Statut: "${t.statut}" (type: ${typeof t.statut})`);
      console.log(`  DossierId: ${t.dossierId}`);
      console.log('');
    });
    
    // Vérifier les conditions du bouton
    console.log('🔍 VÉRIFICATION CONDITIONS BOUTON:');
    console.log(`  taches.length > 0: ${taches.length > 0}`);
    console.log(`  every(t => t.statut === 'done'): ${taches.every(t => t.statut === 'done')}`);
    console.log(`  every(t => t.statut === 'DONE'): ${taches.every(t => t.statut === 'DONE')}`);
    console.log(`  every(t => t.statut.toLowerCase() === 'done'): ${taches.every(t => t.statut?.toLowerCase() === 'done')}`);
    
    // Afficher les valeurs uniques de statut
    const uniqueStatuts = [...new Set(taches.map(t => t.statut))];
    console.log(`\n  Valeurs uniques de statut: ${JSON.stringify(uniqueStatuts)}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkTaskStatuses();
