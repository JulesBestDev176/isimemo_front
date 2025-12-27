import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Service pour gérer l'historique de recherche
 */
class SearchHistoryService {
  private sessionId: string;

  constructor() {
    // Générer ou récupérer un ID de session unique
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Génère ou récupère l'ID de session depuis localStorage
   */
  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('search_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('search_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Enregistre une recherche
   */
  async saveSearch(query: string, resultsCount: number, searchMethod: string = 'local'): Promise<void> {
    try {
      await axios.post(`${API_URL}/search-history`, {
        sessionId: this.sessionId,
        query,
        resultsCount,
        searchMethod
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la recherche:', error);
    }
  }

  /**
   * Récupère les mots-clés populaires
   */
  async getPopularKeywords(limit: number = 10): Promise<Array<{keyword: string, count: number, lastSearched: string}>> {
    try {
      const response = await axios.get(`${API_URL}/search-history/keywords`, {
        params: { sessionId: this.sessionId, limit }
      });
      return response.data.keywords || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des mots-clés:', error);
      return [];
    }
  }

  /**
   * Récupère les recherches récentes
   */
  async getRecentSearches(limit: number = 20): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/search-history/recent`, {
        params: { sessionId: this.sessionId, limit }
      });
      return response.data.searches || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  /**
   * Enregistre un clic sur un mémoire
   */
  async recordClick(searchHistoryId: string, memoireId: number): Promise<void> {
    try {
      await axios.post(`${API_URL}/search-history/${searchHistoryId}/click`, {
        memoireId
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du clic:', error);
    }
  }

  /**
   * Supprime l'historique
   */
  async clearHistory(): Promise<void> {
    try {
      await axios.delete(`${API_URL}/search-history`, {
        params: { sessionId: this.sessionId }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
    }
  }

  /**
   * Récupère les statistiques de recherche
   */
  async getStats(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/search-history/stats`, {
        params: { sessionId: this.sessionId }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  /**
   * Calcule un score de recommandation pour un mémoire
   * basé sur les mots-clés populaires
   */
  calculateRecommendationScore(memoire: any, popularKeywords: Array<{keyword: string, count: number}>): number {
    if (!memoire || !popularKeywords || popularKeywords.length === 0) return 0;

    let score = 0;
    
    // Construire le texte du mémoire en gérant les valeurs undefined/null
    const titre = memoire.titre || '';
    const description = memoire.description || '';
    const resume = memoire.resume || '';
    const etiquettes = Array.isArray(memoire.etiquettes) ? memoire.etiquettes.join(' ') : '';
    
    const memoireText = `${titre} ${description} ${resume} ${etiquettes}`.toLowerCase();

    popularKeywords.forEach((kw, index) => {
      if (memoireText.includes(kw.keyword.toLowerCase())) {
        // Score décroissant selon le rang du mot-clé
        const weight = (popularKeywords.length - index) / popularKeywords.length;
        score += kw.count * weight;
      }
    });

    return score;
  }
}

export default new SearchHistoryService();
