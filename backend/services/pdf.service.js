// ============================================================================
// SERVICE DE RÉCUPÉRATION ET PARSING DE PDFs
// ============================================================================

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Récupère et parse le contenu d'un PDF
 * @param {string} pdfPath - Chemin vers le fichier PDF
 * @returns {Promise<string>} - Contenu textuel du PDF
 */
async function extraireTexteDuPDF(pdfPath) {
  try {
    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Le fichier PDF n'existe pas: ${pdfPath}`);
    }

    // Lire le fichier PDF
    const dataBuffer = fs.readFileSync(pdfPath);

    // Parser le PDF
    const data = await pdfParse(dataBuffer);

    // Retourner le texte extrait
    return data.text;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error);
    throw error;
  }
}

/**
 * Récupère le contenu de plusieurs PDFs
 * @param {Array<string>} pdfPaths - Liste des chemins vers les PDFs
 * @returns {Promise<Array<{path: string, content: string}>>} - Contenu des PDFs
 */
async function extraireTexteDesPDFs(pdfPaths) {
  const resultats = [];

  for (const pdfPath of pdfPaths) {
    try {
      const contenu = await extraireTexteDuPDF(pdfPath);
      resultats.push({
        path: pdfPath,
        content: contenu
      });
    } catch (error) {
      console.error(`Erreur pour le PDF ${pdfPath}:`, error);
      resultats.push({
        path: pdfPath,
        content: '',
        error: error.message
      });
    }
  }

  return resultats;
}

/**
 * Récupère un extrait pertinent du PDF basé sur la requête
 * @param {string} texteComplet - Texte complet du PDF
 * @param {string} query - Requête de recherche
 * @param {number} tailleExtrait - Nombre de caractères autour de chaque match
 * @returns {Array<string>} - Extraits pertinents
 */
function extrairePassagesPertinents(texteComplet, query, tailleExtrait = 500) {
  const mots = query.toLowerCase().split(' ');
  const passages = [];

  // Diviser le texte en phrases ou paragraphes
  const paragraphes = texteComplet.split(/\n\n|\.\s+/);

  paragraphes.forEach(paragraphe => {
    const paragrapheLower = paragraphe.toLowerCase();
    let score = 0;

    // Compter combien de mots de la requête apparaissent dans ce paragraphe
    mots.forEach(mot => {
      if (paragrapheLower.includes(mot)) {
        score++;
      }
    });

    // Si au moins un mot correspond, ajouter ce passage
    if (score > 0) {
      passages.push({
        texte: paragraphe.trim(),
        score
      });
    }
  });

  // Trier par score et prendre les meilleurs passages
  return passages
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(p => p.texte);
}

/**
 * Limite la taille du texte pour l'API Gemini
 * @param {string} texte - Texte à limiter
 * @param {number} maxChars - Nombre maximum de caractères
 * @returns {string} - Texte limité
 */
function limiterTailleTexte(texte, maxChars = 10000) {
  if (texte.length <= maxChars) {
    return texte;
  }

  return texte.substring(0, maxChars) + '...';
}

module.exports = {
  extraireTexteDuPDF,
  extraireTexteDesPDFs,
  extrairePassagesPertinents,
  limiterTailleTexte
};
