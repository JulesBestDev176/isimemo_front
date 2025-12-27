// ============================================================================
// SERVICE DE RECHERCHE DE MÉMOIRES PAR SIMILARITÉ
// ============================================================================

const natural = require('natural');
const Memoire = require('../models/Memoire');

// Tokenizer et TF-IDF pour la recherche de similarité
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

/**
 * Recherche les mémoires similaires à une requête
 * @param {string} query - La question de l'utilisateur
 * @param {number} limit - Nombre de résultats à retourner
 * @returns {Array} - Liste des mémoires pertinents
 */
async function rechercherMemoiresSimilaires(query, limit = 5) {
  try {
    // Récupérer tous les mémoires
    const memoires = await Memoire.find({});

    if (!memoires || memoires.length === 0) {
      return [];
    }

    // Extraire les mots-clés de la requête
    const queryTokens = tokenizer.tokenize(query.toLowerCase());

    // Calculer le score de similarité pour chaque mémoire
    const memoiresAvecScore = memoires.map(memoire => {
      let score = 0;

      // Créer un texte combiné des métadonnées du mémoire
      const memoireTexte = [
        memoire.titre || '',
        memoire.resume || '',
        memoire.domaineEtude || '',
        (memoire.motsCles || []).join(' '),
        memoire.filiere || '',
        memoire.departement || '',
        memoire.auteurs || ''
      ].join(' ').toLowerCase();

      // Tokeniser le texte du mémoire
      const memoireTokens = tokenizer.tokenize(memoireTexte);

      // Calculer le score basé sur les mots-clés communs
      queryTokens.forEach(queryToken => {
        // Correspondance exacte
        if (memoireTokens.includes(queryToken)) {
          score += 2;
        }

        // Correspondance partielle (mot contenu)
        memoireTokens.forEach(memoireToken => {
          if (memoireToken.includes(queryToken) || queryToken.includes(memoireToken)) {
            score += 1;
          }
        });
      });

      // Bonus si le titre contient des mots-clés
      const titreTokens = tokenizer.tokenize((memoire.titre || '').toLowerCase());
      queryTokens.forEach(queryToken => {
        if (titreTokens.includes(queryToken)) {
          score += 5;
        }
      });

      // Bonus si les mots-clés du mémoire correspondent
      const motsClesMemoire = (memoire.motsCles || []).map(mc => mc.toLowerCase());
      queryTokens.forEach(queryToken => {
        if (motsClesMemoire.some(mc => mc.includes(queryToken))) {
          score += 3;
        }
      });

      return {
        memoire,
        score
      };
    });

    // Trier par score décroissant et prendre les N premiers
    const memoiresPertinents = memoiresAvecScore
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => m.memoire);

    return memoiresPertinents;
  } catch (error) {
    console.error('Erreur lors de la recherche de mémoires:', error);
    throw error;
  }
}

/**
 * Recherche les mémoires par mots-clés explicites
 * @param {Array<string>} motsCles - Liste de mots-clés
 * @returns {Array} - Liste des mémoires correspondants
 */
async function rechercherParMotsCles(motsCles) {
  try {
    const memoires = await Memoire.find({
      $or: [
        { motsCles: { $in: motsCles } },
        { titre: { $regex: motsCles.join('|'), $options: 'i' } },
        { domaineEtude: { $regex: motsCles.join('|'), $options: 'i' } }
      ]
    });

    return memoires;
  } catch (error) {
    console.error('Erreur lors de la recherche par mots-clés:', error);
    throw error;
  }
}

module.exports = {
  rechercherMemoiresSimilaires,
  rechercherParMotsCles
};
