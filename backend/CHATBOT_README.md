# Chatbot RAG - Documentation API

## Description

Ce chatbot utilise un système RAG (Retrieval-Augmented Generation) qui :
1. Recherche les mémoires pertinents dans la base de données en fonction de la question
2. Extrait le contenu des PDFs correspondants
3. Utilise l'API Gemini pour générer une réponse basée sur le contenu des mémoires

## Configuration

### 1. Variables d'environnement

Ajoutez cette variable dans votre fichier `.env` :

```env
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

Pour obtenir une clé API Gemini :
1. Visitez https://ai.google.dev/
2. Créez un compte ou connectez-vous
3. Générez une clé API gratuite

### 2. Structure de la base de données

Le schéma `Memoire` a été enrichi avec les champs suivants pour la recherche sémantique :

```javascript
{
  id: Number,
  titre: String,
  auteurs: String,
  annee: String,
  filiere: String,
  departement: String,
  fichierPdf: String,        // Chemin vers le PDF
  motsCles: [String],        // Mots-clés pour la recherche
  resume: String,            // Résumé du mémoire
  domaineEtude: String,      // Domaine d'étude
  contenuTexte: String       // Contenu extrait du PDF (optionnel)
}
```

## Endpoints API

### 1. POST `/api/chatbot/ask`

Pose une question au chatbot qui recherchera dans les mémoires et générera une réponse.

**Request:**
```json
{
  "question": "Quelles sont les méthodes d'apprentissage automatique utilisées dans l'éducation?",
  "nbMemoires": 3  // Optionnel, défaut: 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reponse": "Selon les mémoires consultés...",
    "sources": [
      {
        "id": 1,
        "titre": "Titre du mémoire",
        "auteurs": "Nom des auteurs",
        "annee": "2023",
        "filiere": "Informatique",
        "fichierPdf": "uploads/memoire1.pdf"
      }
    ],
    "memoiresConsultes": 3
  }
}
```

### 2. POST `/api/chatbot/simple`

Pose une question simple au chatbot sans recherche de mémoires.

**Request:**
```json
{
  "message": "Bonjour, comment ça va?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reponse": "Bonjour! Je vais bien, merci..."
  }
}
```

### 3. POST `/api/chatbot/search-memoires`

Recherche les mémoires similaires sans générer de réponse.

**Request:**
```json
{
  "query": "intelligence artificielle",
  "limit": 5  // Optionnel, défaut: 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "memoires": [...],
    "count": 3
  }
}
```

### 4. GET `/api/chatbot/health`

Vérifie l'état du service chatbot.

**Response:**
```json
{
  "success": true,
  "message": "Service chatbot opérationnel",
  "apiKeyConfigured": true,
  "warning": null
}
```

## Exemples d'utilisation

### Avec cURL

```bash
# Poser une question
curl -X POST http://localhost:3001/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Quelles sont les applications de l'\''IA dans l'\''éducation?",
    "nbMemoires": 5
  }'

# Vérifier l'état du service
curl http://localhost:3001/api/chatbot/health
```

### Avec JavaScript (Frontend)

```javascript
// Poser une question
async function poserQuestion(question) {
  const response = await fetch('http://localhost:3001/api/chatbot/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question: question,
      nbMemoires: 3
    })
  });

  const data = await response.json();

  if (data.success) {
    console.log('Réponse:', data.data.reponse);
    console.log('Sources:', data.data.sources);
  }
}

poserQuestion("Quels sont les défis de l'IA dans l'éducation?");
```

## Architecture du système

```
1. User Question
   ↓
2. Search Service (memoire.service.js)
   - Recherche par mots-clés dans titre, résumé, domaine, motsCles
   - Score de similarité avec TF-IDF
   ↓
3. PDF Service (pdf.service.js)
   - Extraction du texte des PDFs
   - Extraction des passages pertinents
   ↓
4. Chatbot Service (chatbot.service.js)
   - Construction du prompt avec contexte
   - Appel à l'API Gemini
   - Génération de la réponse
   ↓
5. Response avec sources
```

## Optimisations possibles

1. **Mise en cache** : Stocker le contenu extrait des PDFs dans la base de données
2. **Embeddings** : Utiliser des embeddings vectoriels pour une meilleure recherche sémantique
3. **Pagination** : Pour les longues réponses
4. **Historique** : Sauvegarder les conversations
5. **Rate limiting** : Limiter le nombre de requêtes par utilisateur

## Dépendances

- `@google/generative-ai` : SDK pour l'API Gemini
- `pdf-parse` : Parser de fichiers PDF
- `natural` : Bibliothèque NLP pour la tokenisation et TF-IDF

## Notes importantes

- Les PDFs doivent être accessibles dans le système de fichiers
- La clé API Gemini est requise pour le fonctionnement
- Le service utilise le modèle `gemini-pro` par défaut
- La taille des PDFs est limitée pour éviter de surcharger l'API
