// ============================================================================
// ROUTES API POUR LE CHATBOT
// ============================================================================

const express = require('express');
const router = express.Router();
const { genererReponse, genererReponseSimple } = require('../services/chatbot.service');
const { rechercherMemoiresSimilaires } = require('../services/memoire.service');

/**
 * POST /api/chatbot/ask
 * Pose une question au chatbot qui recherchera dans les mémoires
 *
 * Body: {
 *   question: string,
 *   nbMemoires?: number (default: 3)
 * }
 *
 * Response: {
 *   success: boolean,
 *   data: {
 *     reponse: string,
 *     sources: Array<{id, titre, auteurs, annee, filiere, fichierPdf}>,
 *     memoiresConsultes: number
 *   }
 * }
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, nbMemoires = 3 } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'La question est requise et doit être une chaîne de caractères non vide'
      });
    }

    console.log(`[CHATBOT] Question reçue: ${question}`);

    const resultat = await genererReponse(question, nbMemoires);

    res.json({
      success: true,
      data: resultat
    });

  } catch (error) {
    console.error('[CHATBOT] Erreur:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la génération de la réponse'
    });
  }
});

/**
 * POST /api/chatbot/simple
 * Pose une question simple au chatbot sans recherche de mémoires
 *
 * Body: {
 *   message: string
 * }
 *
 * Response: {
 *   success: boolean,
 *   data: {
 *     reponse: string
 *   }
 * }
 */
router.post('/simple', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le message est requis'
      });
    }

    console.log(`[CHATBOT SIMPLE] Message reçu: ${message}`);

    const reponse = await genererReponseSimple(message);

    res.json({
      success: true,
      data: {
        reponse
      }
    });

  } catch (error) {
    console.error('[CHATBOT SIMPLE] Erreur:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la génération de la réponse'
    });
  }
});

/**
 * POST /api/chatbot/search-memoires
 * Recherche les mémoires similaires à une requête (sans générer de réponse)
 *
 * Body: {
 *   query: string,
 *   limit?: number (default: 5)
 * }
 *
 * Response: {
 *   success: boolean,
 *   data: {
 *     memoires: Array<Memoire>,
 *     count: number
 *   }
 * }
 */
router.post('/search-memoires', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'La requête est requise'
      });
    }

    console.log(`[CHATBOT] Recherche de mémoires pour: ${query}`);

    const memoires = await rechercherMemoiresSimilaires(query, limit);

    res.json({
      success: true,
      data: {
        memoires,
        count: memoires.length
      }
    });

  } catch (error) {
    console.error('[CHATBOT] Erreur de recherche:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la recherche de mémoires'
    });
  }
});

/**
 * GET /api/chatbot/health
 * Vérifie l'état du service chatbot
 *
 * Response: {
 *   success: boolean,
 *   message: string,
 *   apiKeyConfigured: boolean
 * }
 */
router.get('/health', (req, res) => {
  const apiKeyConfigured = !!process.env.GEMINI_API_KEY;

  res.json({
    success: true,
    message: 'Service chatbot opérationnel',
    apiKeyConfigured,
    warning: !apiKeyConfigured ? 'Clé API Gemini non configurée. Définissez la variable d\'environnement GEMINI_API_KEY' : null
  });
});

module.exports = router;
