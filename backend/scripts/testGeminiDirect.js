// Test direct de l'API Gemini
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiDirect() {
  console.log('🔑 Clé API:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NON DÉFINIE');
  console.log('\n📡 Test de l\'API Gemini...\n');

  const models = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro'
  ];

  for (const model of models) {
    try {
      console.log(`\nTest avec ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${API_KEY}`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{
            text: 'Bonjour! Réponds en une phrase.'
          }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
      console.log(`✅ SUCCÈS avec ${model}`);
      console.log(`Réponse: ${text.substring(0, 100)}...`);
      break;

    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      const status = error.response?.status;
      console.log(`❌ ÉCHEC avec ${model} (${status}): ${errorMsg.substring(0, 150)}`);
    }
  }
}

testGeminiDirect();
