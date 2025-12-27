import axios from 'axios';
import { Memoire } from '../data/memoires.data';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Service de recherche de mémoires avec recherche vectorielle backend
 */
class MemoireSearchService {
  /**
   * Récupère tous les mémoires depuis MongoDB
   */
  async getAllMemoires(): Promise<Memoire[]> {
    try {
      const response = await axios.get(`${API_URL}/memoires`);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des mémoires:', error);
      return [];
    }
  }

  /**
   * Recherche intelligente avec Gemini (lit les PDF)
   * @param query - Requête de recherche
   * @param limit - Nombre maximum de résultats
   * @returns Promise avec les résultats
   */
  async geminiSearch(query: string, limit: number = 10): Promise<Memoire[]> {
    try {
      const response = await axios.post(`${API_URL}/memoires/search-gemini`, { query, limit });
      return response.data.results;
    } catch (error) {
      console.error('Erreur lors de la recherche Gemini:', error);
      throw error;
    }
  }

  /**
   * Recherche vectorielle dans le contenu complet des PDF
   * @param query - Requête de recherche
   * @param memoireIds - IDs des mémoires à filtrer (optionnel)
   * @returns Promise avec les résultats de recherche
   */
  async vectorSearch(query: string, memoireIds?: number[]): Promise<Memoire[]> {
    try {
      const response = await axios.post(`${API_URL}/memoires/search`, {
        query,
        memoireIds
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Erreur lors de la recherche vectorielle:', error);
      throw error;
    }
  }


  /**
   * Récupère un mémoire par son ID
   */
  async getMemoireById(id: number): Promise<Memoire | null> {
    try {
      const response = await axios.get(`${API_URL}/memoires/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du mémoire ${id}:`, error);
      return null;
    }
  }

  /**
   * Vérifie le statut d'indexation des PDF
   */
  async getIndexStatus() {
    try {
      const response = await axios.get(`${API_URL}/memoires/index/status`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'indexation:', error);
      throw error;
    }
  }

  /**
   * Indexe un mémoire spécifique
   */
  async indexMemoire(id: number) {
    try {
      const response = await axios.post(`${API_URL}/memoires/index/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'indexation du mémoire ${id}:`, error);
      throw error;
    }
  }
}

export default new MemoireSearchService();
