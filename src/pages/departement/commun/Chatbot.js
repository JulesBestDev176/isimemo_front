import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, Trash2, MessageSquare, Menu, X, Search } from 'lucide-react';
const Chatbot = () => {
    const [input, setInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState([
        {
            id: 1,
            title: "Discussion sur les soutenances",
            messages: [
                {
                    id: 1,
                    type: 'bot',
                    content: "Bonjour ! Je suis votre assistant virtuel du département. Comment puis-je vous aider aujourd'hui ?",
                    timestamp: new Date('2024-07-10 10:00'),
                },
                {
                    id: 2,
                    type: 'user',
                    content: "J'aimerais des informations sur les soutenances",
                    timestamp: new Date('2024-07-10 10:05'),
                },
                {
                    id: 3,
                    type: 'bot',
                    content: "Je peux vous aider avec les informations sur les soutenances. Voici les étapes principales :\n\n1. Dépôt du mémoire\n2. Validation par le directeur\n3. Planification de la soutenance\n4. Présentation devant le jury\n\nAvez-vous des questions spécifiques sur l'une de ces étapes ?",
                    timestamp: new Date('2024-07-10 10:06'),
                }
            ],
            lastMessage: "Je peux vous aider avec les informations sur les soutenances...",
            timestamp: new Date('2024-07-10 10:06'),
            isRead: true,
        },
        {
            id: 2,
            title: "Gestion des étudiants",
            messages: [
                {
                    id: 1,
                    type: 'bot',
                    content: "Bonjour ! Comment puis-je vous aider ?",
                    timestamp: new Date('2024-07-09 14:30'),
                }
            ],
            lastMessage: "Bonjour ! Comment puis-je vous aider ?",
            timestamp: new Date('2024-07-09 14:30'),
            isRead: true,
        }
    ]);
    const [currentConversation, setCurrentConversation] = useState(conversations[0]);
    const [isTyping, setIsTyping] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.messages]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.trim() || !currentConversation)
            return;
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: input,
            timestamp: new Date(),
        };
        const updatedConversation = Object.assign(Object.assign({}, currentConversation), { messages: [...currentConversation.messages, userMessage], lastMessage: input, timestamp: new Date(), isRead: true });
        setCurrentConversation(updatedConversation);
        setConversations(prev => prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv));
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const botResponses = [
                "Je peux vous aider à gérer vos cours et classes.",
                "Vous pouvez me demander des informations sur les étudiants et professeurs.",
                "Je peux vous rappeler les événements à venir dans le calendrier.",
                "Pour les soutenances et mémoires, je peux vous fournir les étapes à suivre.",
                "N'hésitez pas à me demander les dernières statistiques du département.",
            ];
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: botResponses[Math.floor(Math.random() * botResponses.length)],
                timestamp: new Date(),
            };
            const finalConversation = Object.assign(Object.assign({}, updatedConversation), { messages: [...updatedConversation.messages, botMessage], lastMessage: botMessage.content, timestamp: new Date(), isRead: true });
            setCurrentConversation(finalConversation);
            setConversations(prev => prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv));
            setIsTyping(false);
        }, 1500);
    };
    const startNewConversation = () => {
        const newConversation = {
            id: Date.now(),
            title: "Nouvelle discussion",
            messages: [
                {
                    id: 1,
                    type: 'bot',
                    content: "Bonjour ! Je suis votre assistant virtuel du département. Comment puis-je vous aider aujourd'hui ?",
                    timestamp: new Date(),
                }
            ],
            lastMessage: "Bonjour ! Je suis votre assistant virtuel du département...",
            timestamp: new Date(),
            isRead: true,
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
    };
    const deleteConversation = (conversationId) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if ((currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversationId) {
            const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
            setCurrentConversation(remainingConversations[0] || null);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const formatDate = (date) => {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1)
            return 'Aujourd\'hui';
        if (diffDays === 2)
            return 'Hier';
        if (diffDays <= 7)
            return `Il y a ${diffDays - 1} jours`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };
    const filteredConversations = conversations.filter(conversation => conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("div", { className: `${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`, children: [_jsxs("div", { className: "px-4 py-2 border-b border-gray-100", children: [_jsxs("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    startNewConversation();
                                }, className: "w-full flex items-center justify-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-medium shadow-sm mb-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Nouvelle discussion"] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Rechercher des discussions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: filteredConversations.map((conversation) => (_jsx("div", { className: `group relative p-3 mb-1 cursor-pointer rounded-lg transition-all duration-200 ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-50'}`, onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentConversation(conversation);
                            }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id ? 'bg-white/20' : 'bg-primary/10'}`, children: _jsx(MessageSquare, { className: `h-4 w-4 ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id ? 'text-white' : 'text-primary'}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: `text-sm font-semibold truncate ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id ? 'text-white' : 'text-gray-900'}`, children: conversation.title }), _jsx("button", { onClick: (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            deleteConversation(conversation.id);
                                                        }, className: `opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id
                                                            ? 'text-white/70 hover:text-white hover:bg-white/20'
                                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`, children: _jsx(Trash2, { className: "h-3 w-3" }) })] }), _jsx("p", { className: `text-xs leading-relaxed line-clamp-2 ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id ? 'text-white/70' : 'text-gray-500'}`, children: conversation.lastMessage }), _jsx("p", { className: `text-xs mt-2 ${(currentConversation === null || currentConversation === void 0 ? void 0 : currentConversation.id) === conversation.id ? 'text-white/60' : 'text-gray-400'}`, children: formatDate(conversation.timestamp) })] })] }) }, conversation.id))) })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowSidebar(!showSidebar);
                                    }, className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: showSidebar ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) }), _jsx("div", { children: currentConversation ? (_jsxs(_Fragment, { children: [_jsxs("h1", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [currentConversation.title, _jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-primary/10 text-primary", children: "Assistant" })] }), _jsx("p", { className: "text-sm text-gray-500", children: "ISIMemo Assistant virtuel" })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "ISIMemo Assistant" }), _jsx("p", { className: "text-sm text-gray-500", children: "S\u00E9lectionnez une conversation" })] })) })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: currentConversation ? (_jsxs("div", { children: [currentConversation.messages.map((message) => (_jsx("div", { className: `w-full ${message.type === 'user' ? 'bg-white' : 'bg-gray-50'}`, children: _jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                                            ? 'bg-gray-600 text-white'
                                                            : 'bg-primary text-white'}`, children: message.type === 'user' ? (_jsx(User, { className: "h-4 w-4" })) : (_jsx(Bot, { className: "h-4 w-4" })) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 mb-1", children: message.type === 'user' ? 'Vous' : 'Assistant' }), _jsx("div", { className: "text-gray-700 whitespace-pre-wrap", children: message.content }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: formatTime(message.timestamp) })] })] }) }) }, message.id))), isTyping && (_jsx("div", { className: "w-full bg-gray-50", children: _jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white", children: _jsx(Bot, { className: "h-4 w-4" }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 mb-1", children: "Assistant" }), _jsxs("div", { className: "typing-animation", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] })] })] }) }) })), _jsx("div", { ref: messagesEndRef })] })) : (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageSquare, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Aucune conversation s\u00E9lectionn\u00E9e" }), _jsx("p", { className: "text-gray-500", children: "Cr\u00E9ez une nouvelle discussion pour commencer" })] }) })) }), currentConversation && (_jsx("div", { className: "bg-white border-t border-gray-200 p-6", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Tapez votre message...", rows: 1, className: "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm hover:border-gray-400", style: { minHeight: '52px', maxHeight: '120px' } }) }), _jsx("button", { onClick: (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSendMessage(e);
                                        }, disabled: !input.trim(), className: "bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md", children: _jsx(Send, { className: "h-5 w-5" }) })] }) }) }))] }), _jsx("style", { children: `
        .typing-animation {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-animation span {
          height: 6px;
          width: 6px;
          background: #6366f1;
          border-radius: 50%;
          display: block;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-animation span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-animation span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      ` })] }));
};
export default Chatbot;
