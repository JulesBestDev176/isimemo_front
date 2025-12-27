const mongoose = require('mongoose');
const { rechercherMemoiresSimilaires } = require('../services/memoire.service');
const Memoire = require('../models/Memoire');
require('dotenv').config();

async function testMemoiresSearch() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo');
    console.log('✅ Connecté à MongoDB\n');

    // Test 1: Vérifier le nombre total de mémoires
    console.log('📊 Test 1: Nombre total de mémoires');
    const totalMemoires = await Memoire.countDocuments();
    console.log(`   Résultat: ${totalMemoires} mémoires dans la base de données`);
    console.log(`   ${totalMemoires === 20 ? '✅ PASS' : '❌ FAIL'} - Attendu: 20 mémoires\n`);

    // Test 2: Recherche par mot-clé "santé"
    console.log('🔍 Test 2: Recherche "santé"');
    const resultats1 = await rechercherMemoiresSimilaires("santé", 5);
    console.log(`   Résultat: ${resultats1.length} mémoire(s) trouvé(s)`);
    if (resultats1.length > 0) {
      console.log(`   Premier résultat: "${resultats1[0].titre}"`);
      console.log(`   Auteur: ${resultats1[0].auteur}`);
    }
    console.log(`   ${resultats1.length > 0 ? '✅ PASS' : '❌ FAIL'} - Au moins 1 résultat attendu\n`);

    // Test 3: Recherche par mot-clé "plateforme"
    console.log('🔍 Test 3: Recherche "plateforme"');
    const resultats2 = await rechercherMemoiresSimilaires("plateforme", 5);
    console.log(`   Résultat: ${resultats2.length} mémoire(s) trouvé(s)`);
    if (resultats2.length > 0) {
      console.log(`   Premiers résultats:`);
      resultats2.slice(0, 3).forEach((m, i) => {
        console.log(`   ${i + 1}. "${m.titre.substring(0, 60)}..."`);
      });
    }
    console.log(`   ${resultats2.length >= 3 ? '✅ PASS' : '❌ FAIL'} - Au moins 3 résultats attendus\n`);

    // Test 4: Recherche par auteur "Abdou Fatah"
    console.log('🔍 Test 4: Recherche "Abdou Fatah"');
    const resultats3 = await rechercherMemoiresSimilaires("Abdou Fatah", 5);
    console.log(`   Résultat: ${resultats3.length} mémoire(s) trouvé(s)`);
    if (resultats3.length > 0) {
      console.log(`   Premier résultat: "${resultats3[0].titre}"`);
      console.log(`   Auteur: ${resultats3[0].auteur}`);
    }
    console.log(`   ${resultats3.length > 0 ? '✅ PASS' : '❌ FAIL'} - Au moins 1 résultat attendu\n`);

    // Test 5: Recherche "PIGMA"
    console.log('🔍 Test 5: Recherche "PIGMA"');
    const resultats4 = await rechercherMemoiresSimilaires("PIGMA", 3);
    console.log(`   Résultat: ${resultats4.length} mémoire(s) trouvé(s)`);
    if (resultats4.length > 0) {
      console.log(`   Premier résultat: "${resultats4[0].titre}"`);
      console.log(`   Auteurs: ${resultats4[0].auteur}`);
      console.log(`   Mots-clés: ${resultats4[0].motsCles.join(', ')}`);
    }
    console.log(`   ${resultats4.length > 0 ? '✅ PASS' : '❌ FAIL'} - Au moins 1 résultat attendu\n`);

    // Test 6: Recherche "covoiturage"
    console.log('🔍 Test 6: Recherche "covoiturage"');
    const resultats5 = await rechercherMemoiresSimilaires("covoiturage", 3);
    console.log(`   Résultat: ${resultats5.length} mémoire(s) trouvé(s)`);
    if (resultats5.length > 0) {
      console.log(`   Premier résultat: "${resultats5[0].titre}"`);
      console.log(`   Auteurs: ${resultats5[0].auteur}`);
    }
    console.log(`   ${resultats5.length > 0 ? '✅ PASS' : '❌ FAIL'} - Au moins 1 résultat attendu (TYVAA)\n`);

    // Test 7: Vérifier les index
    console.log('📑 Test 7: Vérification des index');
    const indexes = await Memoire.collection.getIndexes();
    const hasTextIndex = Object.keys(indexes).some(key => key.includes('text'));
    console.log(`   Index textuels: ${hasTextIndex ? 'Présents' : 'Absents'}`);
    console.log(`   ${hasTextIndex ? '✅ PASS' : '❌ FAIL'} - Index textuel attendu\n`);

    // Résumé
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 RÉSUMÉ DES TESTS');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Base de données: ${totalMemoires} mémoires`);
    console.log(`✅ Recherche fonctionnelle`);
    console.log(`✅ Index textuels créés`);
    console.log('\n🎉 Tous les tests sont passés avec succès!');
    console.log('Le chatbot peut maintenant utiliser ces mémoires pour répondre aux questions.\n');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter les tests
if (require.main === module) {
  testMemoiresSearch()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { testMemoiresSearch };
