const express = require('express');
const router = express.Router();
const DocumentConsultation = require('../models/DocumentConsultation');

/**
 * POST /api/consultations
 * Enregistre une consultation de document
 */
router.post('/', async (req, res) => {
  try {
    console.log('📥 Requête POST /api/consultations reçue');
    console.log('Body:', req.body);
    
    const { sessionId, userId, documentId, documentType, metadata, duration } = req.body;

    if (!sessionId && !userId) {
      console.log('❌ Erreur: sessionId ou userId manquant');
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    if (!documentId) {
      console.log('❌ Erreur: documentId manquant');
      return res.status(400).json({ message: 'documentId requis' });
    }

    // Créer l'entrée de consultation
    const consultation = await DocumentConsultation.create({
      sessionId: sessionId || `user-${userId}`,
      userId: userId || null,
      documentId,
      documentType: documentType || 'memoire',
      metadata: metadata || {},
      duration: duration || 0
    });

    console.log('✅ Consultation enregistrée:', consultation._id);

    res.status(201).json({
      message: 'Consultation enregistrée',
      id: consultation._id
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la consultation:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/consultations/metadata
 * Récupère les métadonnées fréquentes basées sur les consultations
 */
router.get('/metadata', async (req, res) => {
  try {
    const { sessionId, userId, limit } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const metadata = await DocumentConsultation.getFrequentMetadata(
      sessionId,
      userId,
      parseInt(limit) || 20
    );

    res.json({
      metadata,
      hasData: Object.keys(metadata.departements).length > 0
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * GET /api/consultations/recent
 * Récupère les consultations récentes
 */
router.get('/recent', async (req, res) => {
  try {
    const { sessionId, userId, limit } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const consultations = await DocumentConsultation.getRecentConsultations(
      sessionId,
      userId,
      parseInt(limit) || 10
    );

    res.json({
      consultations,
      count: consultations.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des consultations:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

/**
 * DELETE /api/consultations
 * Supprime l'historique de consultations
 */
router.delete('/', async (req, res) => {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const query = userId ? { userId } : { sessionId };
    const result = await DocumentConsultation.deleteMany(query);

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
 * GET /api/consultations/stats
 * Statistiques de consultation
 */
router.get('/stats', async (req, res) => {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId ou userId requis' });
    }

    const query = userId ? { userId } : { sessionId };

    const [totalConsultations, metadata, recentConsultations] = await Promise.all([
      DocumentConsultation.countDocuments(query),
      DocumentConsultation.getFrequentMetadata(sessionId, userId, 20),
      DocumentConsultation.getRecentConsultations(sessionId, userId, 5)
    ]);

    res.json({
      totalConsultations,
      frequentMetadata: metadata,
      recentConsultations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
