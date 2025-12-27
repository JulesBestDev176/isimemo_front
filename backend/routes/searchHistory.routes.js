const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

/**
 * POST /api/search-history
 * Enregistre une recherche
 */
router.post('/', async (req, res) => {
  try {
    console.log('📥 Requête POST /api/search-history reçue');
    console.log('Body:', req.body);
    
    const { sessionId, userId, query, resultsCount, searchMethod } = req.body;

    if (!sessionId && !userId) {
      console.log('❌ Erreur: sessionId ou userId manquant');
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    if (!query || query.trim().length === 0) {
      console.log('❌ Erreur: query manquant');
      return res.status(400).json({ message: 'query requis' });
    }

    // Extraire les mots-clés
    const keywords = SearchHistory.extractKeywords(query);
    console.log('🔑 Mots-clés extraits:', keywords);

    // Créer l'entrée d'historique
    const history = await SearchHistory.create({
      sessionId: sessionId || `user-${userId}`,
      userId: userId || null,
      query: query.trim(),
      keywords,
      resultsCount: resultsCount || 0,
      searchMethod: searchMethod || 'local',
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    console.log('✅ Recherche enregistrée avec succès:', history._id);

    res.status(201).json({
      message: 'Recherche enregistrée',
      id: history._id,
      keywords
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la recherche:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/search-history/keywords
 * Récupère les mots-clés populaires de l'utilisateur
 */
router.get('/keywords', async (req, res) => {
  try {
    const { sessionId, userId, limit } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const keywords = await SearchHistory.getPopularKeywords(
      sessionId,
      userId,
      parseInt(limit) || 10
    );

    res.json({
      keywords,
      count: keywords.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des mots-clés:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/search-history/recent
 * Récupère les recherches récentes
 */
router.get('/recent', async (req, res) => {
  try {
    const { sessionId, userId, limit } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const searches = await SearchHistory.getRecentSearches(
      sessionId,
      userId,
      parseInt(limit) || 20
    );

    res.json({
      searches,
      count: searches.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * POST /api/search-history/:id/click
 * Enregistre un clic sur un mémoire après une recherche
 */
router.post('/:id/click', async (req, res) => {
  try {
    const { memoireId } = req.body;

    if (!memoireId) {
      return res.status(400).json({ message: 'memoireId requis' });
    }

    const history = await SearchHistory.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { clickedMemoires: memoireId } },
      { new: true }
    );

    if (!history) {
      return res.status(404).json({ message: 'Historique non trouvé' });
    }

    res.json({
      message: 'Clic enregistré',
      clickedMemoires: history.clickedMemoires
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du clic:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * DELETE /api/search-history
 * Supprime l'historique d'un utilisateur
 */
router.delete('/', async (req, res) => {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const query = userId ? { userId } : { sessionId };
    const result = await SearchHistory.deleteMany(query);

    res.json({
      message: 'Historique supprimé',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/search-history/stats
 * Statistiques de recherche
 */
router.get('/stats', async (req, res) => {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const query = userId ? { userId } : { sessionId };

    const [totalSearches, keywords, recentSearches] = await Promise.all([
      SearchHistory.countDocuments(query),
      SearchHistory.getPopularKeywords(sessionId, userId, 5),
      SearchHistory.getRecentSearches(sessionId, userId, 5)
    ]);

    res.json({
      totalSearches,
      topKeywords: keywords,
      recentSearches
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
