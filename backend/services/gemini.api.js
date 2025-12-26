// ============================================================================
// SERVICE DIRECT POUR L'API GEMINI (via REST)
// ============================================================================

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models';

/**
 * Appel direct à l'API Gemini via REST
 * @param {string} prompt - Le prompt à envoyer
 * @param {string} model - Le modèle à utiliser (par défaut: gemini-1.5-flash)
 * @returns {Promise<string>} - La réponse générée
 */
async function callGeminiAPI(prompt, model = 'gemini-2.5-flash') {
  try {
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    console.log(`Appel à l'API Gemini avec le modèle: ${model}`);

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extraire le texte de la réponse
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return text;
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Gemini:', error.response?.data || error.message);

    // Essayer des modèles alternatifs si le premier échoue
    if (error.response?.status === 404 && model === 'gemini-2.5-flash') {
      console.log('Tentative avec d\'autres modèles...');
      return callGeminiAPIFallback(prompt);
    }

    throw new Error(`Erreur API Gemini: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Fallback avec différents modèles
 */
async function callGeminiAPIFallback(prompt) {
  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash-lite'
  ];

  for (const model of modelsToTry) {
    try {
      console.log(`Essai avec le modèle: ${model}`);
      const url = `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log(`✅ Succès avec le modèle: ${model}`);
      return text;
    } catch (error) {
      console.log(`❌ Échec avec ${model}: ${error.response?.data?.error?.message || error.message}`);
      continue;
    }
  }

  throw new Error('Aucun modèle Gemini disponible. Vérifiez votre clé API et votre quota.');
}

module.exports = {
  callGeminiAPI,
  callGeminiAPIFallback
};
