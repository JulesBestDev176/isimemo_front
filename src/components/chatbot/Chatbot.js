var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// COMPOSANT CHATBOT AVEC ICÔNE FLOTTANTE
// ============================================================================
import { useState, useRef, useEffect } from 'react';
import chatbotService from '../../services/chatbot.service';
import './Chatbot.css';
export const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);
    const handleSendMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        // Message de chargement
        const loadingMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: 'Recherche dans les mémoires...',
            timestamp: new Date(),
            isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);
        try {
            const response = yield chatbotService.ask(input);
            // Retirer le message de chargement
            setMessages(prev => prev.filter(m => !m.isLoading));
            const botMessage = {
                id: (Date.now() + 2).toString(),
                type: 'bot',
                content: response.reponse,
                sources: response.sources,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }
        catch (error) {
            // Retirer le message de chargement
            setMessages(prev => prev.filter(m => !m.isLoading));
            const err = error;
            const errorMessage = {
                id: (Date.now() + 2).toString(),
                type: 'bot',
                content: `Désolé, une erreur s'est produite: ${err.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleKeyPress = (e) => {
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
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    if (!isOpen) {
        return (_jsxs("button", { onClick: handleOpenChat, className: "chatbot-toggle", title: "Ouvrir l'assistant m\u00E9moires", children: [_jsx("svg", { className: "chatbot-icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }), messages.length > 0 && (_jsx("span", { className: "chatbot-badge", children: messages.length }))] }));
    }
    return (_jsxs("div", { className: `chatbot-container ${isMinimized ? 'minimized' : ''}`, children: [_jsxs("div", { className: "chatbot-header", children: [_jsxs("div", { className: "chatbot-header-left", children: [_jsx("div", { className: "chatbot-avatar", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }) }), _jsxs("div", { className: "chatbot-title", children: [_jsx("h3", { children: "Assistant M\u00E9moires" }), _jsx("span", { className: "chatbot-status", children: "En ligne" })] })] }), _jsxs("div", { className: "chatbot-header-actions", children: [_jsx("button", { onClick: clearChat, className: "chatbot-btn", title: "Effacer la conversation", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: "20", height: "20", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }), _jsx("button", { onClick: handleMinimize, className: "chatbot-btn", title: isMinimized ? "Agrandir" : "Réduire", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: "20", height: "20", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) }) }), _jsx("button", { onClick: handleCloseChat, className: "chatbot-btn chatbot-btn-close", title: "Fermer", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: "20", height: "20", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })] }), !isMinimized && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "chatbot-messages", children: [messages.length === 0 && (_jsxs("div", { className: "chatbot-welcome", children: [_jsx("div", { className: "chatbot-welcome-icon", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }), _jsx("h4", { children: "Posez une question sur les m\u00E9moires!" }), _jsx("p", { children: "Je peux vous aider \u00E0 trouver des informations dans notre base de m\u00E9moires acad\u00E9miques." }), _jsxs("div", { className: "chatbot-suggestions", children: [_jsx("p", { className: "suggestions-title", children: "Exemples de questions:" }), suggestions.map((suggestion, index) => (_jsx("button", { className: "suggestion-btn", onClick: () => handleSuggestionClick(suggestion), children: suggestion }, index)))] })] })), messages.map(message => (_jsxs("div", { className: `chatbot-message ${message.type === 'user' ? 'user' : 'bot'} ${message.isLoading ? 'loading' : ''}`, children: [message.type === 'bot' && (_jsx("div", { className: "message-avatar", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }) })), _jsx("div", { className: "message-content", children: message.isLoading ? (_jsxs("div", { className: "loading-dots", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "message-text", children: message.content }), message.sources && message.sources.length > 0 && (_jsxs("div", { className: "message-sources", children: [_jsx("p", { className: "sources-title", children: "Sources consult\u00E9es:" }), message.sources.map((source, idx) => (_jsxs("div", { className: "source-item", children: [_jsxs("span", { className: "source-number", children: [idx + 1, "."] }), _jsxs("div", { className: "source-info", children: [_jsx("div", { className: "source-title", children: source.titre }), _jsxs("div", { className: "source-meta", children: [source.auteurs, " \u2022 ", source.annee, " \u2022 ", source.filiere] })] })] }, source.id)))] })), _jsx("div", { className: "message-time", children: message.timestamp.toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) })] })) })] }, message.id))), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "chatbot-input-container", children: [_jsx("textarea", { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Posez votre question...", className: "chatbot-input", rows: 2, disabled: isLoading }), _jsx("button", { onClick: handleSendMessage, disabled: !input.trim() || isLoading, className: "chatbot-send-btn", title: "Envoyer", children: _jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) }) })] })] }))] }));
};
