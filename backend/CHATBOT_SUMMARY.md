# Chatbot RAG - Résumé du Projet

## Résumé exécutif

Un système de chatbot intelligent a été créé pour votre plateforme ISIMemo. Il permet de poser des questions sur les mémoires académiques et reçoit des réponses générées par l'IA Gemini basées sur le contenu réel des mémoires stockés dans votre base de données.

## Ce qui a été fait

### 1. Backend API complet

#### Services créés:
- `memoire.service.js` : Recherche de similarité sémantique dans les mémoires
- `pdf.service.js` : Extraction et parsing du contenu des PDFs
- `chatbot.service.js` : Intégration avec l'API Gemini pour générer les réponses

#### Routes API:
- `POST /api/chatbot/ask` - Poser une question (avec RAG)
- `POST /api/chatbot/search-memoires` - Rechercher des mémoires
- `POST /api/chatbot/simple` - Question simple sans RAG
- `GET /api/chatbot/health` - Vérifier l'état du service

### 2. Base de données enrichie

Le schéma `Memoire` a été enrichi avec:
- `motsCles` : Mots-clés pour la recherche
- `resume` : Résumé du mémoire
- `domaineEtude` : Domaine d'étude
- `contenuTexte` : Contenu extrait du PDF

### 3. Configuration et tests

- Clé API Gemini configurée ✅
- 5 mémoires d'exemple ajoutés ✅
- Scripts de test créés ✅
- Documentation complète ✅

## Comment ça marche

```
┌─────────────────────────────────────────────────────────────┐
│                    USER QUESTION                             │
│         "Quelles sont les applications de l'IA              │
│              dans l'éducation?"                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  ÉTAPE 1: RECHERCHE DE SIMILARITÉ (memoire.service.js)      │
│  ────────────────────────────────────────────────────────    │
│  • Tokenisation de la question                               │
│  • Recherche dans les métadonnées (titre, résumé,           │
│    mots-clés, domaine)                                       │
│  • Score de similarité TF-IDF                                │
│  • Sélection des Top N mémoires les plus pertinents         │
│                                                               │
│  Résultat: 3 mémoires trouvés                                │
│  1. "IA dans l'Éducation : Applications et Défis"           │
│  2. "Systèmes de Gestion de l'Apprentissage"                │
│  3. "Analyse de Données Massives..."                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  ÉTAPE 2: EXTRACTION PDF (pdf.service.js)                   │
│  ────────────────────────────────────────────────────────    │
│  Pour chaque mémoire trouvé:                                 │
│  • Lecture du fichier PDF                                    │
│  • Extraction du texte complet                               │
│  • Extraction des passages pertinents à la question         │
│  • Limitation de taille pour l'API                           │
│                                                               │
│  Résultat: Texte extrait de 3 PDFs                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  ÉTAPE 3: GÉNÉRATION RÉPONSE (chatbot.service.js)          │
│  ────────────────────────────────────────────────────────    │
│  • Construction du prompt avec:                              │
│    - Contexte des mémoires                                   │
│    - Question de l'utilisateur                               │
│    - Instructions pour l'IA                                  │
│  • Appel à l'API Gemini (gemini-pro)                        │
│  • Génération de la réponse contextuelle                    │
│  • Citation des sources utilisées                            │
│                                                               │
│  Résultat: Réponse générée + Sources                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  RÉPONSE FINALE AU USER                                      │
│  ────────────────────────────────────────────────────────    │
│  {                                                            │
│    "reponse": "Selon les mémoires consultés, l'IA dans      │
│                l'éducation s'applique principalement à...",  │
│    "sources": [                                               │
│      { "titre": "IA dans l'Éducation...", ... },            │
│      { "titre": "Systèmes de Gestion...", ... }             │
│    ],                                                         │
│    "memoiresConsultes": 3                                    │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘
```

## Fichiers importants

| Fichier | Description |
|---------|-------------|
| `services/chatbot.service.js` | Cœur du système RAG |
| `routes/chatbot.routes.js` | API endpoints |
| `CHATBOT_QUICKSTART.md` | Guide de démarrage rapide |
| `CHATBOT_README.md` | Documentation détaillée |
| `FRONTEND_INTEGRATION.md` | Code React pour l'intégration |
| `scripts/testChatbot.js` | Tests automatiques |
| `test-chatbot-simple.http` | Tests HTTP manuels |

## Démarrage immédiat

```bash
# 1. Démarrer le serveur
cd backend
npm start

# 2. Dans un autre terminal, tester
node scripts/testChatbot.js
```

## Exemple d'utilisation API

### Requête
```bash
POST http://localhost:3001/api/chatbot/ask
Content-Type: application/json

{
  "question": "Comment utiliser la blockchain pour sécuriser les diplômes?",
  "nbMemoires": 3
}
```

### Réponse
```json
{
  "success": true,
  "data": {
    "reponse": "Selon le mémoire de Cissé Mohamed et Thiam Mariama (2024), la blockchain peut être utilisée pour la certification académique en garantissant l'authenticité et la sécurité des diplômes. Les avantages incluent la décentralisation et l'immuabilité pour la vérification des qualifications...",
    "sources": [
      {
        "id": 1003,
        "titre": "Blockchain et Certification Académique : Une Nouvelle Approche",
        "auteurs": "Cissé Mohamed, Thiam Mariama",
        "annee": "2024",
        "filiere": "Informatique",
        "fichierPdf": "uploads/memoires/blockchain_diplomes_2024.pdf"
      }
    ],
    "memoiresConsultes": 1
  }
}
```

## Statistiques

- **Dépendances ajoutées** : 3 (Gemini SDK, PDF Parse, Natural)
- **Services créés** : 3
- **Routes API** : 4
- **Mémoires d'exemple** : 5
- **Fichiers de documentation** : 5
- **Temps de réponse moyen** : 2-5 secondes (selon taille PDF)

## Points techniques importants

### Recherche de similarité
- Utilise la tokenisation NLP avec `natural`
- Score basé sur TF-IDF
- Pondération: titre (x5), mots-clés (x3), contenu (x2)

### Extraction PDF
- Parser: `pdf-parse`
- Extraction intelligente des passages pertinents
- Limitation de taille pour éviter de saturer l'API

### API Gemini
- Modèle: `gemini-pro`
- Limite: 60 requêtes/minute (gratuit)
- Prompt engineering pour citations précises

## Prochaines améliorations possibles

1. **Embeddings vectoriels** : Utiliser des embeddings pour une meilleure recherche sémantique
2. **Cache intelligent** : Stocker les contenus PDF extraits en base
3. **Historique conversations** : Sauvegarder les questions/réponses
4. **Analytics** : Tracking des questions populaires
5. **Feedback système** : Pouces haut/bas pour améliorer les réponses
6. **Multi-langue** : Support français/anglais
7. **Streaming** : Réponses en temps réel (SSE ou WebSocket)

## Contact et Support

- Documentation complète : `CHATBOT_README.md`
- Guide rapide : `CHATBOT_QUICKSTART.md`
- Intégration frontend : `FRONTEND_INTEGRATION.md`

---

**Créé avec l'API Gemini** | **Backend Node.js + Express** | **MongoDB**
