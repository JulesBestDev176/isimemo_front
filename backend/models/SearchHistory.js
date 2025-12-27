const mongoose = require('mongoose');

/**
 * Schéma pour l'historique de recherche
 */
const searchHistorySchema = new mongoose.Schema({
  // Identifiant de session (pour utilisateurs non connectés)
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // ID utilisateur (optionnel, pour utilisateurs connectés)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    index: true
  },
  
  // Requête de recherche
  query: {
    type: String,
    required: true,
    trim: true
  },
  
  // Mots-clés extraits de la requête
  keywords: [{
    type: String,
    lowercase: true
  }],
  
  // Nombre de résultats trouvés
  resultsCount: {
    type: Number,
    default: 0
  },
  
  // IDs des mémoires cliqués après cette recherche
  clickedMemoires: [{
    type: Number,
    ref: 'Memoire'
  }],
  
  // Méthode de recherche utilisée
  searchMethod: {
    type: String,
    enum: ['gemini', 'vector', 'fuzzy', 'local'],
    default: 'local'
  },
  
  // Date de la recherche
  searchDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Métadonnées
  metadata: {
    userAgent: String,
    ipAddress: String,
    duration: Number // Durée de la recherche en ms
  }
}, {
  timestamps: true
});

// Index composé pour recherches rapides
searchHistorySchema.index({ sessionId: 1, searchDate: -1 });
searchHistorySchema.index({ userId: 1, searchDate: -1 });
searchHistorySchema.index({ keywords: 1 });

// Index TTL pour supprimer les anciennes recherches après 90 jours
searchHistorySchema.index({ searchDate: 1 }, { expireAfterSeconds: 7776000 }); // 90 jours

/**
 * Méthode statique pour obtenir les mots-clés populaires d'un utilisateur
 */
searchHistorySchema.statics.getPopularKeywords = async function(sessionId, userId, limit = 10) {
  const query = userId ? { userId } : { sessionId };
  
  const results = await this.aggregate([
    { $match: query },
    { $unwind: '$keywords' },
    { $group: {
      _id: '$keywords',
      count: { $sum: 1 },
      lastSearched: { $max: '$searchDate' }
    }},
    { $sort: { count: -1, lastSearched: -1 } },
    { $limit: limit }
  ]);
  
  return results.map(r => ({
    keyword: r._id,
    count: r.count,
    lastSearched: r.lastSearched
  }));
};

/**
 * Méthode statique pour obtenir les recherches récentes
 */
searchHistorySchema.statics.getRecentSearches = async function(sessionId, userId, limit = 20) {
  const query = userId ? { userId } : { sessionId };
  
  return this.find(query)
    .sort({ searchDate: -1 })
    .limit(limit)
    .select('query keywords resultsCount searchDate searchMethod')
    .lean();
};

/**
 * Méthode pour extraire les mots-clés d'une requête
 */
searchHistorySchema.statics.extractKeywords = function(query) {
  // Mots vides à ignorer
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'au',
    'en', 'pour', 'par', 'sur', 'dans', 'avec', 'sans', 'ce', 'cette', 'ces',
    'est', 'sont', 'a', 'ont', 'être', 'avoir', 'faire', 'plus', 'moins',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'
  ]);
  
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .map(word => word.replace(/[^a-zàâäéèêëïîôùûüÿç]/g, ''))
    .filter(word => word.length > 0);
};

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
