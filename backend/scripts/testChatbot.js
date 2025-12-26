// ============================================================================
// SCRIPT DE TEST DU CHATBOT
// ============================================================================

require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api/chatbot';

async function testChatbot() {
  console.log('🧪 Test du Chatbot RAG\n');
  console.log('='.repeat(50));

  // Test 1: Health Check
  console.log('\n1️⃣  Test Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Service opérationnel');
    console.log('   API Key configurée:', healthResponse.data.apiKeyConfigured);
    if (healthResponse.data.warning) {
      console.log('   ⚠️  Warning:', healthResponse.data.warning);
    }
  } catch (error) {
    console.error('❌ Erreur Health Check:', error.message);
    return;
  }

  // Test 2: Recherche de mémoires
  console.log('\n2️⃣  Test Recherche de Mémoires...');
  try {
    const searchResponse = await axios.post(`${API_BASE_URL}/search-memoires`, {
      query: 'intelligence artificielle éducation',
      limit: 3
    });
    console.log(`✅ ${searchResponse.data.data.count} mémoire(s) trouvé(s)`);
    if (searchResponse.data.data.count > 0) {
      console.log('   Mémoires:');
      searchResponse.data.data.memoires.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.titre} (${m.annee})`);
      });
    } else {
      console.log('   ⚠️  Aucun mémoire trouvé. Exécutez d\'abord: node scripts/populateMemoiresExemples.js');
    }
  } catch (error) {
    console.error('❌ Erreur Recherche:', error.message);
  }

  // Test 3: Question au Chatbot
  console.log('\n3️⃣  Test Question au Chatbot...');
  try {
    const question = "Quelles sont les applications de l'intelligence artificielle dans l'éducation?";
    console.log(`   Question: "${question}"`);

    const chatResponse = await axios.post(`${API_BASE_URL}/ask`, {
      question: question,
      nbMemoires: 2
    });

    if (chatResponse.data.success) {
      console.log('✅ Réponse générée avec succès');
      console.log(`   Mémoires consultés: ${chatResponse.data.data.memoiresConsultes}`);
      console.log(`   Sources utilisées: ${chatResponse.data.data.sources.length}`);
      console.log('\n   Réponse:');
      console.log('   ' + '-'.repeat(48));
      console.log('   ' + chatResponse.data.data.reponse.substring(0, 300) + '...');
      console.log('   ' + '-'.repeat(48));
    } else {
      console.log('❌ Échec de la génération de réponse');
    }
  } catch (error) {
    console.error('❌ Erreur Question:', error.response?.data?.error || error.message);
    if (error.response?.data?.error?.includes('API_KEY')) {
      console.log('\n   💡 Conseil: Définissez votre clé API Gemini dans le fichier .env');
      console.log('      GEMINI_API_KEY=votre_cle_ici');
    }
  }

  // Test 4: Question Simple
  console.log('\n4️⃣  Test Question Simple (sans recherche)...');
  try {
    const simpleResponse = await axios.post(`${API_BASE_URL}/simple`, {
      message: 'Bonjour! Peux-tu te présenter en une phrase?'
    });

    if (simpleResponse.data.success) {
      console.log('✅ Réponse générée');
      console.log(`   ${simpleResponse.data.data.reponse}`);
    }
  } catch (error) {
    console.error('❌ Erreur Question Simple:', error.response?.data?.error || error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Tests terminés!\n');
}

// Vérifier que le serveur est démarré
console.log('⏳ Vérification que le serveur est démarré...');
console.log('   URL:', API_BASE_URL);
console.log('');

testChatbot().catch(error => {
  console.error('\n❌ Erreur fatale:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('\n💡 Le serveur n\'est pas démarré. Lancez-le d\'abord avec: npm start');
  }
});
