// ============================================================================
// SERVICE API CHATBOT - FRONTEND
// ============================================================================

import axios from 'axios';

const API_URL = 'http://localhost:3001/api/chatbot';

export interface ChatbotResponse {
  reponse: string;
  sources: Array<{
    id: number;
    titre: string;
    auteurs: string;
    annee: string;
    filiere: string;
    fichierPdf: string;
  }>;
  memoiresConsultes: number;
}

export interface MemoireSearchResult {
  memoires: any[];
  count: number;
}

class ChatbotService {
  /**
   * Poser une question au chatbot avec recherche dans les mémoires
   */
  async ask(question: string, nbMemoires: number = 3): Promise<ChatbotResponse> {
    try {
      const response = await axios.post(`${API_URL}/ask`, {
        question,
        nbMemoires
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la communication avec le chatbot');
    }
  }

  /**
   * Rechercher des mémoires
   */
  async searchMemoires(query: string, limit: number = 5): Promise<MemoireSearchResult> {
    try {
      const response = await axios.post(`${API_URL}/search-memoires`, {
        query,
        limit
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur recherche:', error);
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la recherche');
    }
  }

  /**
   * Question simple sans recherche de mémoires
   */
  async simpleQuestion(message: string): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/simple`, {
        message
      });
      return response.data.data.reponse;
    } catch (error) {
      console.error('Erreur question simple:', error);
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur lors de la communication');
    }
  }

  /**
   * Vérifier l'état du service
   */
  async health(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data;
    } catch (error) {
      throw new Error('Le service chatbot n\'est pas disponible');
    }
  }
}

export default new ChatbotService();
