import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Service pour gérer les consultations de documents
 */
class DocumentConsultationService {
  private sessionId: string;

  constructor() {
    // Générer ou récupérer un ID de session unique
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Génère ou récupère l'ID de session depuis localStorage
   */
  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('consultation_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('consultation_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Enregistre une consultation de document
   */
  async recordConsultation(
    documentId: number,
    documentType: string,
    metadata: any,
    duration?: number
  ): Promise<void> {
    try {
      console.log('📝 Enregistrement consultation:', documentId);
      await axios.post(`${API_URL}/consultations`, {
        sessionId: this.sessionId,
        documentId,
        documentType,
        metadata: {
          departement: metadata.departement,
          annee: metadata.annee,
          etiquettes: metadata.etiquettes,
          formation: metadata.formation,
          category: metadata.category,
          titre: metadata.titre
        },
        duration
      });
      console.log('✅ Consultation enregistrée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de la consultation:', error);
    }
  }

  /**
   * Récupère les métadonnées fréquentes
   */
  async getFrequentMetadata(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/consultations/metadata`, {
        params: { sessionId: this.sessionId, limit: 20 }
      });
      return response.data.metadata || {
        departements: {},
        annees: {},
        etiquettes: {},
        formations: {},
        categories: {}
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      return {
        departements: {},
        annees: {},
        etiquettes: {},
        formations: {},
        categories: {}
      };
    }
  }

  /**
   * Récupère les consultations récentes
   */
  async getRecentConsultations(limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/consultations/recent`, {
        params: { sessionId: this.sessionId, limit }
      });
      return response.data.consultations || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des consultations:', error);
      return [];
    }
  }

  /**
   * Supprime l'historique de consultations
   */
  async clearHistory(): Promise<void> {
    try {
      await axios.delete(`${API_URL}/consultations`, {
        params: { sessionId: this.sessionId }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
    }
  }

  /**
   * Calcule un score de similarité pour un document
   * basé sur les métadonnées fréquentes
   */
  calculateSimilarityScore(document: any, frequentMetadata: any): number {
    if (!document || !frequentMetadata) return 0;

    let score = 0;

    // Département (3 points par occurrence)
    if (document.departement && frequentMetadata.departements[document.departement]) {
      score += 3 * frequentMetadata.departements[document.departement];
    }

    // Année (2 points par occurrence)
    if (document.annee && frequentMetadata.annees[document.annee]) {
      score += 2 * frequentMetadata.annees[document.annee];
    }

    // Étiquettes (1 point par occurrence de chaque tag)
    if (Array.isArray(document.etiquettes)) {
      document.etiquettes.forEach((tag: string) => {
        if (frequentMetadata.etiquettes[tag]) {
          score += frequentMetadata.etiquettes[tag];
        }
      });
    }

    // Formation (1 point par occurrence)
    if (document.formation && frequentMetadata.formations[document.formation]) {
      score += frequentMetadata.formations[document.formation];
    }

    // Catégorie (1 point par occurrence)
    if (document.category && frequentMetadata.categories[document.category]) {
      score += frequentMetadata.categories[document.category];
    }

    return score;
  }

  /**
   * Récupère les statistiques de consultation
   */
  async getStats(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/consultations/stats`, {
        params: { sessionId: this.sessionId }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }
}

export default new DocumentConsultationService();
