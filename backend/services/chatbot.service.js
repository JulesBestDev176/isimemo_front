// ============================================================================
// SERVICE CHATBOT AVEC GEMINI AI
// ============================================================================

const { rechercherMemoiresSimilaires } = require('./memoire.service');
const { extraireTexteDuPDF, extrairePassagesPertinents, limiterTailleTexte } = require('./pdf.service');
const { callGeminiAPI } = require('./gemini.api');
const path = require('path');

/**
 * Génère une réponse du chatbot basée sur les mémoires pertinents
 * @param {string} question - Question de l'utilisateur
 * @param {number} nbMemoires - Nombre de mémoires à consulter
 * @returns {Promise<Object>} - Réponse du chatbot avec sources
 */
async function genererReponse(question, nbMemoires = 3) {
  try {
    // Étape 1: Rechercher les mémoires similaires
    console.log('Recherche de mémoires similaires...');
    const memoiresPertinents = await rechercherMemoiresSimilaires(question, nbMemoires);

    if (!memoiresPertinents || memoiresPertinents.length === 0) {
      return {
        reponse: "Désolé, je n'ai pas trouvé de mémoires pertinents pour répondre à votre question.",
        sources: [],
        memoiresConsultes: []
      };
    }

    // Étape 2: Récupérer le contenu des PDFs
    console.log(`${memoiresPertinents.length} mémoire(s) trouvé(s). Extraction du contenu...`);
    const contenusMemoires = [];

    for (const memoire of memoiresPertinents) {
      try {
        // Construire le chemin complet vers le PDF
        const cheminPDF = path.join(__dirname, '..', memoire.fichierPdf || '');

        // Extraire le texte du PDF
        let contenuPDF = '';
        try {
          contenuPDF = await extraireTexteDuPDF(cheminPDF);

          // Extraire les passages pertinents
          const passages = extrairePassagesPertinents(contenuPDF, question);

          contenusMemoires.push({
            memoire: memoire,
            contenu: passages.join('\n\n'),
            contenuComplet: limiterTailleTexte(contenuPDF, 5000)
          });
        } catch (pdfError) {
          console.warn(`Impossible de lire le PDF pour le mémoire ${memoire.id}:`, pdfError.message);

          // Utiliser les métadonnées si le PDF n'est pas accessible
          contenusMemoires.push({
            memoire: memoire,
            contenu: `${memoire.titre}\n\nRésumé: ${memoire.resume || 'Non disponible'}\n\nMots-clés: ${(memoire.motsCles || []).join(', ')}`,
            contenuComplet: ''
          });
        }
      } catch (error) {
        console.error(`Erreur pour le mémoire ${memoire.id}:`, error);
      }
    }

    if (contenusMemoires.length === 0) {
      return {
        reponse: "Les mémoires pertinents ont été trouvés, mais je n'ai pas pu accéder à leur contenu.",
        sources: memoiresPertinents,
        memoiresConsultes: []
      };
    }

    // Étape 3: Construire le prompt pour Gemini
    const contexte = contenusMemoires.map((cm, index) => {
      return `
=== MÉMOIRE ${index + 1} ===
Titre: ${cm.memoire.titre}
Auteurs: ${cm.memoire.auteurs}
Année: ${cm.memoire.annee}
Domaine: ${cm.memoire.domaineEtude || 'Non spécifié'}
Filière: ${cm.memoire.filiere}

Contenu pertinent:
${cm.contenu}
`;
    }).join('\n\n---\n\n');

    const prompt = `Tu es un assistant intelligent spécialisé dans l'analyse de mémoires académiques.

CONTEXTE:
Voici ${contenusMemoires.length} mémoire(s) pertinent(s) que j'ai trouvé(s) en relation avec la question de l'utilisateur:

${contexte}

QUESTION DE L'UTILISATEUR:
${question}

INSTRUCTIONS:
1. Analyse attentivement les mémoires fournis ci-dessus
2. Réponds à la question en te basant UNIQUEMENT sur le contenu des mémoires
3. Cite explicitement les mémoires que tu utilises dans ta réponse (ex: "Selon le mémoire de [Auteurs] ([Année])...")
4. Si les mémoires ne contiennent pas assez d'informations pour répondre complètement, indique-le clairement
5. Structure ta réponse de manière claire et professionnelle
6. Ne fais pas de suppositions au-delà du contenu fourni

Réponds maintenant à la question:`;

    // Étape 4: Appeler l'API Gemini
    console.log('Génération de la réponse avec Gemini...');
    const reponseTexte = await callGeminiAPI(prompt);

    // Étape 5: Retourner la réponse avec les sources
    return {
      reponse: reponseTexte,
      sources: memoiresPertinents.map(m => ({
        id: m.id,
        titre: m.titre,
        auteurs: m.auteurs,
        annee: m.annee,
        filiere: m.filiere,
        fichierPdf: m.fichierPdf
      })),
      memoiresConsultes: contenusMemoires.length
    };

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);

    // Vérifier si c'est une erreur d'API Key
    if (error.message && error.message.includes('API_KEY')) {
      throw new Error('Clé API Gemini non configurée. Veuillez définir la variable d\'environnement GEMINI_API_KEY');
    }

    throw error;
  }
}

/**
 * Génère une réponse simple sans recherche de mémoires (pour tests)
 * @param {string} message - Message de l'utilisateur
 * @returns {Promise<string>} - Réponse du chatbot
 */
async function genererReponseSimple(message) {
  try {
    return await callGeminiAPI(message);
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse simple:', error);
    throw error;
  }
}

module.exports = {
  genererReponse,
  genererReponseSimple
};
