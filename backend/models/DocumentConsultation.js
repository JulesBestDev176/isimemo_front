const mongoose = require('mongoose');

/**
 * Schéma pour les consultations de documents
 */
const documentConsultationSchema = new mongoose.Schema({
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
  
  // ID du document consulté
  documentId: {
    type: Number,
    required: true
  },
  
  // Type de document
  documentType: {
    type: String,
    enum: ['memoire', 'document'],
    default: 'memoire'
  },
  
  // Métadonnées du document (pour calcul rapide de similarité)
  metadata: {
    departement: String,
    annee: String,
    etiquettes: [String],
    formation: String,
    category: String,
    titre: String
  },
  
  // Date de consultation
  consultationDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Durée de consultation (en ms)
  duration: Number
}, {
  timestamps: true
});

// Index composé pour recherches rapides
documentConsultationSchema.index({ sessionId: 1, consultationDate: -1 });
documentConsultationSchema.index({ userId: 1, consultationDate: -1 });

// Index TTL pour supprimer les anciennes consultations après 90 jours
documentConsultationSchema.index({ consultationDate: 1 }, { expireAfterSeconds: 7776000 });

/**
 * Méthode statique pour obtenir les métadonnées fréquentes
 */
documentConsultationSchema.statics.getFrequentMetadata = async function(sessionId, userId, limit = 20) {
  const query = userId ? { userId } : { sessionId };
  
  const consultations = await this.find(query)
    .sort({ consultationDate: -1 })
    .limit(limit)
    .lean();
  
  // Agréger les métadonnées
  const metadata = {
    departements: {},
    annees: {},
    etiquettes: {},
    formations: {},
    categories: {}
  };
  
  consultations.forEach(consultation => {
    if (consultation.metadata) {
      // Compter les départements
      if (consultation.metadata.departement) {
        const dept = consultation.metadata.departement;
        metadata.departements[dept] = (metadata.departements[dept] || 0) + 1;
      }
      
      // Compter les années
      if (consultation.metadata.annee) {
        const annee = consultation.metadata.annee;
        metadata.annees[annee] = (metadata.annees[annee] || 0) + 1;
      }
      
      // Compter les étiquettes
      if (Array.isArray(consultation.metadata.etiquettes)) {
        consultation.metadata.etiquettes.forEach(tag => {
          metadata.etiquettes[tag] = (metadata.etiquettes[tag] || 0) + 1;
        });
      }
      
      // Compter les formations
      if (consultation.metadata.formation) {
        const formation = consultation.metadata.formation;
        metadata.formations[formation] = (metadata.formations[formation] || 0) + 1;
      }
      
      // Compter les catégories
      if (consultation.metadata.category) {
        const category = consultation.metadata.category;
        metadata.categories[category] = (metadata.categories[category] || 0) + 1;
      }
    }
  });
  
  return metadata;
};

/**
 * Méthode statique pour obtenir les consultations récentes
 */
documentConsultationSchema.statics.getRecentConsultations = async function(sessionId, userId, limit = 10) {
  const query = userId ? { userId } : { sessionId };
  
  return this.find(query)
    .sort({ consultationDate: -1 })
    .limit(limit)
    .select('documentId documentType metadata consultationDate')
    .lean();
};

module.exports = mongoose.model('DocumentConsultation', documentConsultationSchema);
