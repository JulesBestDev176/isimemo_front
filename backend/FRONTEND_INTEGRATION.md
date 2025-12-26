# Intégration Frontend - Chatbot RAG

## Service API pour React

Créez un fichier `src/services/chatbot.service.ts` :

```typescript
// src/services/chatbot.service.ts
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
  // Poser une question au chatbot
  async ask(question: string, nbMemoires: number = 3): Promise<ChatbotResponse> {
    try {
      const response = await axios.post(`${API_URL}/ask`, {
        question,
        nbMemoires
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la communication avec le chatbot');
    }
  }

  // Rechercher des mémoires
  async searchMemoires(query: string, limit: number = 5): Promise<MemoireSearchResult> {
    try {
      const response = await axios.post(`${API_URL}/search-memoires`, {
        query,
        limit
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la recherche');
    }
  }

  // Question simple
  async simpleQuestion(message: string): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/simple`, {
        message
      });
      return response.data.data.reponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la communication');
    }
  }

  // Health check
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
```

## Composant React - Chatbot UI

Créez un fichier `src/components/chatbot/Chatbot.tsx` :

```typescript
// src/components/chatbot/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import chatbotService, { ChatbotResponse } from '../../services/chatbot.service';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  sources?: ChatbotResponse['sources'];
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.ask(input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.reponse,
        sources: response.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Désolé, une erreur s'est produite: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="font-semibold">Assistant Mémoires</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">Posez une question sur les mémoires!</p>
            <p className="text-sm">Exemples:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Applications de l'IA dans l'éducation?</li>
              <li>• Blockchain pour les diplômes?</li>
              <li>• Bonnes pratiques mobile learning?</li>
            </ul>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold mb-2 text-gray-600">Sources consultées:</p>
                  {message.sources.map((source, idx) => (
                    <div key={source.id} className="text-xs text-gray-600 mb-1">
                      {idx + 1}. {source.titre} ({source.annee})
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white rounded-lg px-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Utilisation dans l'application

Dans votre `App.tsx` ou composant principal:

```typescript
import { Chatbot } from './components/chatbot/Chatbot';

function App() {
  return (
    <div className="App">
      {/* Votre contenu existant */}

      {/* Chatbot flottant */}
      <Chatbot />
    </div>
  );
}
```

## Styles supplémentaires (optionnel)

Si vous n'utilisez pas Tailwind CSS, ajoutez ces styles CSS:

```css
/* chatbot.css */
.chatbot-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 24rem;
  height: 600px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chatbot-toggle {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: #2563eb;
  color: white;
  border-radius: 9999px;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: none;
  z-index: 1000;
}

.chatbot-toggle:hover {
  background: #1d4ed8;
}

/* ... autres styles ... */
```

## Fonctionnalités supplémentaires possibles

1. **Historique persistant** : Sauvegarder dans localStorage
2. **Suggestions de questions** : Afficher des questions courantes
3. **Export de conversation** : Bouton pour télécharger la conversation
4. **Mode sombre** : Toggle pour thème sombre
5. **Feedback** : Pouces haut/bas pour chaque réponse
6. **Typing indicator** : Animation pendant la génération

## Configuration CORS

Si vous avez des problèmes CORS, assurez-vous que le backend autorise votre origine frontend:

```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:3000', // URL de votre frontend
  credentials: true
}));
```
