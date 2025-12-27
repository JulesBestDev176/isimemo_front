/**
 * Utilitaire de recherche vectorielle simulée avec tolérance aux fautes de frappe
 */

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * (nombre minimum d'opérations pour transformer une chaîne en une autre)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialisation de la matrice
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Remplissage de la matrice
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // suppression
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calcule un score de similarité entre deux chaînes (0 à 1)
 * 1 = identique, 0 = complètement différent
 */
export function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 1;
  
  return 1 - (distance / maxLength);
}

/**
 * Vérifie si deux mots sont similaires avec une tolérance aux fautes
 * @param word1 Premier mot
 * @param word2 Deuxième mot
 * @param threshold Seuil de similarité (0 à 1), par défaut 0.7
 */
export function isFuzzyMatch(word1: string, word2: string, threshold: number = 0.7): boolean {
  // Correspondance exacte
  if (word1.toLowerCase() === word2.toLowerCase()) {
    return true;
  }

  // Si un mot est très court (< 3 caractères), exiger une correspondance exacte
  if (word1.length < 3 || word2.length < 3) {
    return word1.toLowerCase() === word2.toLowerCase();
  }

  // Vérifier la similarité
  const similarity = similarityScore(word1, word2);
  return similarity >= threshold;
}

/**
 * Calcule un score de pertinence vectorielle simulé pour un texte par rapport à une requête
 * @param text Le texte à analyser
 * @param query La requête de recherche
 * @returns Un score de pertinence (plus élevé = plus pertinent)
 */
export function calculateVectorScore(text: string, query: string): number {
  if (!text || !query) return 0;

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Mots de la requête
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  
  // Mots du texte
  const textWords = textLower.split(/\s+/).filter(w => w.length > 0);
  
  let score = 0;
  
  for (const queryWord of queryWords) {
    let bestMatchScore = 0;
    
    // Correspondance exacte dans le texte complet (bonus)
    if (textLower.includes(queryWord)) {
      bestMatchScore = 1.5;
    } else {
      // Recherche de correspondance floue dans les mots
      for (const textWord of textWords) {
        const wordSimilarity = similarityScore(queryWord, textWord);
        
        // Bonus si le mot commence par les mêmes lettres
        if (textWord.startsWith(queryWord.substring(0, Math.min(3, queryWord.length)))) {
          bestMatchScore = Math.max(bestMatchScore, wordSimilarity * 1.2);
        } else {
          bestMatchScore = Math.max(bestMatchScore, wordSimilarity);
        }
      }
    }
    
    // Seuil minimum de similarité pour compter
    if (bestMatchScore >= 0.65) {
      score += bestMatchScore;
    }
  }
  
  // Normaliser le score
  return score / Math.max(queryWords.length, 1);
}

/**
 * Recherche floue dans un tableau de chaînes
 * @param searchTerm Terme de recherche
 * @param items Tableau de chaînes à rechercher
 * @param threshold Seuil de similarité
 * @returns Tableau des items correspondants avec leur score
 */
export function fuzzySearchInArray(
  searchTerm: string,
  items: string[],
  threshold: number = 0.7
): Array<{ item: string; score: number }> {
  const results: Array<{ item: string; score: number }> = [];
  
  for (const item of items) {
    const score = calculateVectorScore(item, searchTerm);
    
    if (score >= threshold) {
      results.push({ item, score });
    }
  }
  
  // Trier par score décroissant
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Recherche vectorielle simulée pour les objets complexes
 * @param searchTerm Terme de recherche
 * @param items Tableau d'objets
 * @param fields Champs à rechercher dans chaque objet
 * @param weights Poids pour chaque champ (optionnel)
 * @returns Tableau des items avec leur score de pertinence
 */
export function fuzzyVectorSearch<T>(
  searchTerm: string,
  items: T[],
  fields: Array<keyof T>,
  weights?: Partial<Record<keyof T, number>>
): Array<{ item: T; score: number; matches: Partial<Record<keyof T, number>> }> {
  const results: Array<{ item: T; score: number; matches: Partial<Record<keyof T, number>> }> = [];
  
  for (const item of items) {
    let totalScore = 0;
    const matches: Partial<Record<keyof T, number>> = {};
    
    for (const field of fields) {
      const value = item[field];
      let fieldScore = 0;
      
      if (typeof value === 'string') {
        fieldScore = calculateVectorScore(value, searchTerm);
      } else if (Array.isArray(value)) {
        // Pour les tableaux (comme les étiquettes)
        const arrayScores = value.map(v => 
          typeof v === 'string' ? calculateVectorScore(v, searchTerm) : 0
        );
        fieldScore = Math.max(...arrayScores, 0);
      }
      
      // Appliquer le poids si défini
      const weight = weights?.[field] ?? 1;
      const weightedScore = fieldScore * weight;
      
      if (weightedScore > 0) {
        matches[field] = fieldScore;
        totalScore += weightedScore;
      }
    }
    
    if (totalScore > 0) {
      results.push({ item, score: totalScore, matches });
    }
  }
  
  // Trier par score décroissant
  return results.sort((a, b) => b.score - a.score);
}
