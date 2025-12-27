// Configuration centralisée de l'API
// Utilise automatiquement l'URL de production si définie, sinon localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_URL = `${API_BASE_URL}/api`;
// Export pour compatibilité avec le code existant
export default API_BASE_URL;
