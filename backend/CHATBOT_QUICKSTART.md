# Chatbot RAG - Guide de Démarrage Rapide

## Ce qui a été créé

Un chatbot intelligent utilisant RAG (Retrieval-Augmented Generation) qui :
1. Recherche les mémoires pertinents dans MongoDB selon votre question
2. Extrait le contenu des PDFs correspondants
3. Génère une réponse basée sur ces mémoires via l'API Gemini

## Fichiers créés

```
backend/
├── services/
│   ├── memoire.service.js      # Recherche de similarité dans les mémoires
│   ├── pdf.service.js          # Extraction de contenu des PDFs
│   └── chatbot.service.js      # Intégration Gemini + génération réponses
│
├── routes/
│   └── chatbot.routes.js       # API endpoints du chatbot
│
├── scripts/
│   ├── populateMemoiresExemples.js  # Peuplement base de données
│   └── testChatbot.js               # Tests automatiques
│
├── models.js                    # Schéma Memoire enrichi
├── server.js                    # Routes chatbot intégrées
├── .env                         # Clé API Gemini configurée
├── CHATBOT_README.md            # Documentation complète
├── CHATBOT_QUICKSTART.md        # Ce guide
└── test-chatbot-simple.http    # Tests HTTP
```

## Démarrage en 3 étapes

### 1. Les dépendances sont déjà installées
```bash
# Déjà fait:
npm install @google/generative-ai pdf-parse natural axios
```

### 2. La clé API Gemini est déjà configurée
```bash
# Déjà dans .env:
GEMINI_API_KEY=AIzaSyD3ARc5cld3VS1eeXuKcr4KXjE_QY9sPws
```

### 3. La base de données est déjà peuplée
```bash
# Déjà exécuté:
node scripts/populateMemoiresExemples.js
# ✅ 5 mémoires d'exemple ajoutés
```

## Tester le chatbot

### Option 1: Démarrer le serveur et tester
```bash
# Démarrer le serveur backend
npm start

# Dans un autre terminal, lancer les tests
node scripts/testChatbot.js
```

### Option 2: Test avec cURL
```bash
# Health check
curl http://localhost:3001/api/chatbot/health

# Rechercher des mémoires
curl -X POST http://localhost:3001/api/chatbot/search-memoires \
  -H "Content-Type: application/json" \
  -d '{"query":"intelligence artificielle","limit":3}'

# Poser une question
curl -X POST http://localhost:3001/api/chatbot/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"Quelles sont les applications de l'\''IA dans l'\''éducation?","nbMemoires":2}'
```

### Option 3: Utiliser le fichier .http
Ouvrez `test-chatbot-simple.http` dans VS Code avec l'extension REST Client et cliquez sur "Send Request"

## Endpoints API disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/chatbot/health` | GET | Vérifier l'état du service |
| `/api/chatbot/search-memoires` | POST | Rechercher des mémoires |
| `/api/chatbot/ask` | POST | Poser une question (RAG) |
| `/api/chatbot/simple` | POST | Question simple sans RAG |

## Exemples de questions à tester

1. "Quelles sont les applications de l'intelligence artificielle dans l'éducation?"
2. "Comment la blockchain peut-elle sécuriser les diplômes académiques?"
3. "Quels sont les avantages du m-learning par rapport à l'e-learning traditionnel?"
4. "Comment analyser les données académiques pour prédire les performances?"
5. "Quelles sont les meilleures pratiques pour développer un LMS?"

## Architecture simplifiée

```
┌─────────────┐
│   Question  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│ 1. Recherche Similarité         │
│    (memoire.service.js)         │
│    - Tokenisation               │
│    - Score TF-IDF               │
│    - Top N mémoires             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ 2. Extraction PDF               │
│    (pdf.service.js)             │
│    - Parse PDF                  │
│    - Extraire passages          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ 3. Génération Réponse           │
│    (chatbot.service.js)         │
│    - Construire prompt          │
│    - Appeler Gemini API         │
│    - Formater réponse           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────┐
│  Réponse +  │
│   Sources   │
└─────────────┘
```

## Mémoires d'exemple dans la base

1. **IA dans l'Éducation** (2023) - Applications et défis
2. **LMS** (2023) - Conception et implémentation
3. **Blockchain** (2024) - Certification académique
4. **Big Data** (2023) - Analyse performances académiques
5. **Mobile Learning** (2024) - Applications éducatives

## Notes importantes

- Les PDFs ne sont pas créés physiquement, le chatbot utilise les métadonnées (titre, résumé, mots-clés)
- Pour une utilisation réelle, ajoutez les vrais PDFs dans `uploads/memoires/`
- La clé API Gemini est déjà configurée et prête à l'emploi
- Le modèle utilisé est `gemini-pro` (gratuit jusqu'à 60 requêtes/minute)

## Prochaines étapes

1. Ajouter de vrais mémoires dans la base de données
2. Uploader les fichiers PDF correspondants
3. Créer une interface frontend pour le chatbot
4. Implémenter un historique des conversations
5. Ajouter un système de cache pour les réponses

## Support

Pour plus de détails, consultez [CHATBOT_README.md](./CHATBOT_README.md)
