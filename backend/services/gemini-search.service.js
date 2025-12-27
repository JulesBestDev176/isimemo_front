// ============================================================================
// SERVICE DE RECHERCHE INTELLIGENTE AVEC GEMINI
// ============================================================================

const { callGeminiAPI } = require('./gemini.api');
const Memoire = require('../models/Memoire');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extrait le texte d'un PDF (version simplifiée)
 */
async function extraireTextePDF(pdfPath) {
  try {
    if (!fs.existsSync(pdfPath)) {
      return null;
    }
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.warn(`Impossible de lire le PDF ${pdfPath}:`, error.message);
    return null;
  }
}

/**
 * Recherche intelligente dans les mémoires avec Gemini
 * @param {string} query - Requête de recherche
 * @param {number} limit - Nombre maximum de résultats
 * @returns {Promise<Array>} - Mémoires pertinents
 */
async function rechercherAvecGemini(query, limit = 10) {
  try {
    console.log(`🔍 Recherche Gemini: "${query}"`);
    
    // Étape 1: Récupérer tous les mémoires
    const memoires = await Memoire.find({});
    console.log(`📚 ${memoires.length} mémoires trouvés dans la base`);
    
    // Étape 2: Extraire le contenu des PDF (limité pour performance)
    const memoiresAvecContenu = [];
    
    for (const memoire of memoires.slice(0, 20)) { // Limiter à 20 pour la performance
      try {
        const pdfPath = path.join(__dirname, '../../public', memoire.cheminFichier);
        const contenuPDF = await extraireTextePDF(pdfPath);
        
        memoiresAvecContenu.push({
          id: memoire.id,
          titre: memoire.titre,
          auteur: memoire.auteur,
          annee: memoire.annee,
          departement: memoire.departement,
          description: memoire.description,
          resume: memoire.resume,
          etiquettes: memoire.etiquettes,
          cheminFichier: memoire.cheminFichier,
          contenuPDF: contenuPDF ? contenuPDF.substring(0, 3000) : null // Limiter à 3000 caractères
        });
      } catch (error) {
        console.warn(`Erreur pour ${memoire.titre}:`, error.message);
      }
    }
    
    console.log(`✓ ${memoiresAvecContenu.length} mémoires avec contenu extrait`);
    
    // Étape 3: Construire le prompt pour Gemini
    const memoiresInfo = memoiresAvecContenu.map((m, index) => {
      return `
MÉMOIRE ${index + 1}:
ID: ${m.id}
Titre: ${m.titre}
Auteur: ${m.auteur}
Année: ${m.annee}
Département: ${m.departement}
Description: ${m.description || 'N/A'}
Résumé: ${m.resume || 'N/A'}
Étiquettes: ${m.etiquettes?.join(', ') || 'N/A'}
${m.contenuPDF ? `Extrait du contenu: ${m.contenuPDF.substring(0, 500)}...` : 'Contenu PDF non disponible'}
---`;
    }).join('\n\n');
    
    const prompt = `Tu es un assistant de recherche académique. Voici une liste de mémoires avec leurs métadonnées et extraits de contenu.

${memoiresInfo}

REQUÊTE DE L'UTILISATEUR: "${query}"

INSTRUCTIONS:
1. Analyse tous les mémoires ci-dessus
2. Identifie les mémoires les PLUS PERTINENTS par rapport à la requête
3. Retourne UNIQUEMENT une liste d'IDs séparés par des virgules, du plus pertinent au moins pertinent
4. Maximum ${limit} IDs
5. Si aucun mémoire n'est pertinent, retourne "AUCUN"

FORMAT DE RÉPONSE (IMPORTANT - RESPECTE CE FORMAT EXACTEMENT):
IDS: 1,5,3,7
ou
IDS: AUCUN

Réponds maintenant:`;

    // Étape 4: Appeler Gemini
    console.log('🤖 Appel à Gemini pour analyse...');
    const reponse = await callGeminiAPI(prompt);
    
    console.log('📝 Réponse Gemini:', reponse);
    
    // Étape 5: Parser la réponse
    const match = reponse.match(/IDS:\s*(.+)/i);
    if (!match) {
      console.warn('⚠️ Format de réponse Gemini invalide');
      return [];
    }
    
    const idsString = match[1].trim();
    if (idsString === 'AUCUN' || idsString === 'NONE') {
      console.log('ℹ️ Aucun mémoire pertinent trouvé');
      return [];
    }
    
    const ids = idsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    console.log(`✓ IDs pertinents: ${ids.join(', ')}`);
    
    // Étape 6: Récupérer les mémoires correspondants
    const resultats = [];
    for (const id of ids) {
      const memoire = await Memoire.findOne({ id: id });
      if (memoire) {
        resultats.push(memoire);
      }
    }
    
    console.log(`✅ ${resultats.length} mémoires retournés`);
    return resultats;
    
  } catch (error) {
    console.error('❌ Erreur recherche Gemini:', error);
    throw error;
  }
}

module.exports = {
  rechercherAvecGemini
};
