const MemoireContent = require('../models/MemoireContent');

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calcule un score de similarité entre deux chaînes (0 à 1)
 */
function similarityScore(str1, str2) {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 1;
  
  return 1 - (distance / maxLength);
}

/**
 * Calcule un score de pertinence pour un texte par rapport à une requête
 */
function calculateRelevanceScore(text, query, tokens = []) {
  if (!text || !query) return 0;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  
  let score = 0;
  
  for (const queryWord of queryWords) {
    let bestMatchScore = 0;
    
    // Correspondance exacte dans le texte complet (bonus élevé)
    if (textLower.includes(queryWord)) {
      bestMatchScore = 2.0;
    } else {
      // Recherche de correspondance floue dans les tokens
      for (const token of tokens) {
        const wordSimilarity = similarityScore(queryWord, token);
        
        // Bonus si le token commence par les mêmes lettres
        if (token.startsWith(queryWord.substring(0, Math.min(3, queryWord.length)))) {
          bestMatchScore = Math.max(bestMatchScore, wordSimilarity * 1.5);
        } else {
          bestMatchScore = Math.max(bestMatchScore, wordSimilarity);
        }
      }
    }
    
    // Seuil minimum de similarité
    if (bestMatchScore >= 0.65) {
      score += bestMatchScore;
    }
  }
  
  // Normaliser le score
  return score / Math.max(queryWords.length, 1);
}

/**
 * Service de recherche vectorielle
 */
class VectorSearchService {
  /**
   * Recherche dans le contenu des mémoires
   * @param {string} query - Requête de recherche
   * @param {number[]} memoireIds - IDs des mémoires à rechercher (optionnel)
   * @returns {Promise<Array>}
   */
  async search(query, memoireIds = null) {
    try {
      // Construire le filtre
      const filter = {};
      if (memoireIds && memoireIds.length > 0) {
        filter.memoireId = { $in: memoireIds };
      }

      // Récupérer tous les contenus de mémoires
      const contents = await MemoireContent.find(filter);

      if (contents.length === 0) {
        return [];
      }

      // Calculer les scores de pertinence
      const results = contents.map(content => {
        const score = calculateRelevanceScore(
          content.fullText,
          query,
          content.tokens
        );

        return {
          memoireId: content.memoireId,
          score: score,
          wordCount: content.wordCount
        };
      });

      // Filtrer les résultats avec un score > 0 et trier par score décroissant
      return results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

    } catch (error) {
      console.error('Erreur lors de la recherche vectorielle:', error);
      throw error;
    }
  }

  /**
   * Recherche avec MongoDB text search (fallback)
   * @param {string} query - Requête de recherche
   * @returns {Promise<Array>}
   */
  async textSearch(query) {
    try {
      const results = await MemoireContent.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });

      return results.map(r => ({
        memoireId: r.memoireId,
        score: r.score,
        wordCount: r.wordCount
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche textuelle:', error);
      throw error;
    }
  }

  /**
   * Obtient le contenu d'un mémoire
   * @param {number} memoireId - ID du mémoire
   * @returns {Promise<Object|null>}
   */
  async getContent(memoireId) {
    try {
      return await MemoireContent.findOne({ memoireId });
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un mémoire est indexé
   * @param {number} memoireId - ID du mémoire
   * @returns {Promise<boolean>}
   */
  async isIndexed(memoireId) {
    try {
      const count = await MemoireContent.countDocuments({ memoireId });
      return count > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'indexation:', error);
      throw error;
    }
  }
}

module.exports = new VectorSearchService();
