const express = require('express');
const router = express.Router();
const Memoire = require('../models/Memoire');
const MemoireContent = require('../models/MemoireContent');
const vectorSearchService = require('../services/vector-search.service');
const pdfExtractionService = require('../services/pdf-extraction.service');
const { rechercherAvecGemini } = require('../services/gemini-search.service');

/**
 * GET /api/memoires
 * Récupère tous les mémoires
 */
router.get('/', async (req, res) => {
  try {
    const memoires = await Memoire.find({}).sort({ annee: -1 });
    res.json(memoires);
  } catch (error) {
    console.error('Erreur lors de la récupération des mémoires:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/memoires/:id
 * Récupère un mémoire par son ID
 */
router.get('/:id', async (req, res) => {
  try {
    const memoire = await Memoire.findOne({ id: parseInt(req.params.id) });
    if (!memoire) {
      return res.status(404).json({ message: 'Mémoire non trouvé' });
    }
    res.json(memoire);
  } catch (error) {
    console.error('Erreur lors de la récupération du mémoire:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * POST /api/memoires/search-gemini
 * Recherche intelligente avec Gemini (lit les PDF directement)
 */
router.post('/search-gemini', async (req, res) => {
  try {
    const { query, limit } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'La requête de recherche est requise' });
    }

    console.log(`🔍 Recherche Gemini: "${query}"`);

    // Effectuer la recherche avec Gemini
    const results = await rechercherAvecGemini(query, limit || 10);

    res.json({
      query: query,
      count: results.length,
      results: results,
      method: 'gemini-ai'
    });

  } catch (error) {
    console.error('Erreur lors de la recherche Gemini:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la recherche Gemini', 
      error: error.message 
    });
  }
});

/**
 * POST /api/memoires/search
 * Recherche vectorielle dans le contenu des mémoires
 */
router.post('/search', async (req, res) => {
  try {
    const { query, memoireIds } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'La requête de recherche est requise' });
    }

    // Effectuer la recherche vectorielle
    const searchResults = await vectorSearchService.search(query, memoireIds);

    // Récupérer les mémoires correspondants
    const memoireIdsFound = searchResults.map(r => r.memoireId);
    const memoires = await Memoire.find({ id: { $in: memoireIdsFound } });

    // Combiner les résultats avec les scores
    const results = searchResults.map(result => {
      const memoire = memoires.find(m => m.id === result.memoireId);
      return {
        ...memoire.toObject(),
        searchScore: result.score
      };
    });

    res.json({
      query: query,
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
});

/**
 * POST /api/memoires/index/:id
 * Indexe un mémoire spécifique
 */
router.post('/index/:id', async (req, res) => {
  try {
    const memoireId = parseInt(req.params.id);
    
    // Récupérer le mémoire
    const memoire = await Memoire.findOne({ id: memoireId });
    if (!memoire) {
      return res.status(404).json({ message: 'Mémoire non trouvé' });
    }

    // Vérifier si déjà indexé
    const existing = await MemoireContent.findOne({ memoireId });
    if (existing) {
      return res.status(409).json({ 
        message: 'Mémoire déjà indexé',
        wordCount: existing.wordCount,
        extractedAt: existing.extractedAt
      });
    }

    // Extraire et indexer
    const pdfPath = pdfExtractionService.resolvePdfPath(memoire.cheminFichier);
    const { fullText, tokens, wordCount, pages } = await pdfExtractionService.extractAndProcess(pdfPath);

    const content = await MemoireContent.create({
      memoireId: memoire.id,
      fullText: fullText,
      tokens: tokens,
      wordCount: wordCount
    });

    res.json({
      message: 'Mémoire indexé avec succès',
      memoireId: memoire.id,
      titre: memoire.titre,
      pages: pages,
      wordCount: wordCount,
      tokensCount: tokens.length,
      extractedAt: content.extractedAt
    });

  } catch (error) {
    console.error('Erreur lors de l\'indexation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'indexation', error: error.message });
  }
});

/**
 * GET /api/memoires/index/status
 * Vérifie le statut d'indexation
 */
router.get('/index/status', async (req, res) => {
  try {
    const totalMemoires = await Memoire.countDocuments();
    const indexedCount = await MemoireContent.countDocuments();
    const indexed = await MemoireContent.find({}, 'memoireId wordCount extractedAt');

    res.json({
      total: totalMemoires,
      indexed: indexedCount,
      notIndexed: totalMemoires - indexedCount,
      percentage: totalMemoires > 0 ? Math.round((indexedCount / totalMemoires) * 100) : 0,
      details: indexed
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
