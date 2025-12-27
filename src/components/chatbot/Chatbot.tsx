// ============================================================================
// COMPOSANT CHATBOT AVEC ICÔNE FLOTTANTE
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import chatbotService, { ChatbotResponse } from '../../services/chatbot.service';
import './Chatbot.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  sources?: ChatbotResponse['sources'];
  timestamp: Date;
  isLoading?: boolean;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

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

    // Message de chargement
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: 'Recherche dans les mémoires...',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await chatbotService.ask(input);

      // Retirer le message de chargement
      setMessages(prev => prev.filter(m => !m.isLoading));

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: response.reponse,
        sources: response.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Retirer le message de chargement
      setMessages(prev => prev.filter(m => !m.isLoading));

      const err = error as Error;
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: `Désolé, une erreur s'est produite: ${err.message}`,
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

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Suggestions de questions
  const suggestions = [
    "Quelles sont les applications de l'IA dans l'éducation?",
    "Comment la blockchain peut sécuriser les diplômes?",
    "Bonnes pratiques pour le mobile learning?",
    "Qu'est-ce qu'un système LMS?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenChat}
        className="chatbot-toggle"
        title="Ouvrir l'assistant mémoires"
      >
        <svg className="chatbot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {messages.length > 0 && (
          <span className="chatbot-badge">{messages.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <div className="chatbot-avatar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="chatbot-title">
            <h3>Assistant Mémoires</h3>
            <span className="chatbot-status">En ligne</span>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button
            onClick={clearChat}
            className="chatbot-btn"
            title="Effacer la conversation"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={handleMinimize}
            className="chatbot-btn"
            title={isMinimized ? "Agrandir" : "Réduire"}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleCloseChat}
            className="chatbot-btn chatbot-btn-close"
            title="Fermer"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="chatbot-welcome-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4>Posez une question sur les mémoires!</h4>
                <p>Je peux vous aider à trouver des informations dans notre base de mémoires académiques.</p>

                <div className="chatbot-suggestions">
                  <p className="suggestions-title">Exemples de questions:</p>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-btn"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`chatbot-message ${message.type === 'user' ? 'user' : 'bot'} ${message.isLoading ? 'loading' : ''}`}
              >
                {message.type === 'bot' && (
                  <div className="message-avatar">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}

                <div className="message-content">
                  {message.isLoading ? (
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <>
                      <div className="message-text">{message.content}</div>

                      {message.sources && message.sources.length > 0 && (
                        <div className="message-sources">
                          <p className="sources-title">Sources consultées:</p>
                          {message.sources.map((source, idx) => (
                            <div key={source.id} className="source-item">
                              <span className="source-number">{idx + 1}.</span>
                              <div className="source-info">
                                <div className="source-title">{source.titre}</div>
                                <div className="source-meta">
                                  {source.auteurs} • {source.annee} • {source.filiere}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="chatbot-input"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="chatbot-send-btn"
              title="Envoyer"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
