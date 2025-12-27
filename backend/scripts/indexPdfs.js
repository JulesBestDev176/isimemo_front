const mongoose = require('mongoose');
const Memoire = require('../models/Memoire');
const MemoireContent = require('../models/MemoireContent');
const pdfExtractionService = require('../services/pdf-extraction.service');
require('dotenv').config();

/**
 * Script d'indexation des PDF de mémoires
 * Extrait le texte de tous les PDF et les stocke dans MongoDB
 */
async function indexAllPdfs() {
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo');
    console.log('✓ Connecté à MongoDB\n');

    // Récupérer tous les mémoires
    const memoires = await Memoire.find({});
    console.log(`Trouvé ${memoires.length} mémoires à indexer\n`);

    let indexed = 0;
    let skipped = 0;
    let errors = 0;

    for (const memoire of memoires) {
      try {
        console.log(`[${indexed + skipped + errors + 1}/${memoires.length}] Traitement: ${memoire.titre}`);
        
        // Vérifier si déjà indexé
        const existing = await MemoireContent.findOne({ memoireId: memoire.id });
        if (existing) {
          console.log(`  ⊘ Déjà indexé (${existing.wordCount} mots)\n`);
          skipped++;
          continue;
        }

        // Résoudre le chemin du PDF
        const pdfPath = pdfExtractionService.resolvePdfPath(memoire.cheminFichier);
        console.log(`  📄 Extraction du PDF: ${memoire.cheminFichier}`);

        // Extraire et traiter le contenu
        const { fullText, tokens, wordCount, pages } = await pdfExtractionService.extractAndProcess(pdfPath);
        
        console.log(`  ✓ Extrait: ${pages} pages, ${wordCount} mots, ${tokens.length} tokens uniques`);

        // Sauvegarder dans MongoDB
        await MemoireContent.create({
          memoireId: memoire.id,
          fullText: fullText,
          tokens: tokens,
          wordCount: wordCount
        });

        console.log(`  ✓ Indexé avec succès\n`);
        indexed++;

      } catch (error) {
        console.error(`  ✗ Erreur: ${error.message}\n`);
        errors++;
      }
    }

    // Résumé
    console.log('═══════════════════════════════════════');
    console.log('RÉSUMÉ DE L\'INDEXATION');
    console.log('═══════════════════════════════════════');
    console.log(`Total de mémoires: ${memoires.length}`);
    console.log(`✓ Indexés: ${indexed}`);
    console.log(`⊘ Déjà indexés: ${skipped}`);
    console.log(`✗ Erreurs: ${errors}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('Erreur fatale:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécuter le script
console.log('═══════════════════════════════════════');
console.log('INDEXATION DES PDF DE MÉMOIRES');
console.log('═══════════════════════════════════════\n');

indexAllPdfs();
