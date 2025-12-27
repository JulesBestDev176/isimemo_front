import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, Menu, X, Search, Users, GraduationCap, UserCheck, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const Messagerie = () => {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('conversations');
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedVisitorMessage, setSelectedVisitorMessage] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    // Données de démonstration
    const [contacts] = useState([
        {
            id: '1',
            name: 'Dr. Amadou Fall',
            email: 'amadou.fall@isi.sn',
            type: 'encadrant',
            lastMessage: 'Nous devons discuter de votre projet',
            lastMessageTime: new Date('2024-07-10 14:30'),
            unreadCount: 2,
            isOnline: true
        },
        {
            id: '2',
            name: 'Fatou Diop',
            email: 'fatou.diop@etudiant.isi.sn',
            type: 'etudiant_master',
            lastMessage: 'Merci pour les corrections',
            lastMessageTime: new Date('2024-07-10 12:15'),
            unreadCount: 0,
            isOnline: false
        },
        {
            id: '3',
            name: 'Moussa Sy',
            email: 'moussa.sy@etudiant.isi.sn',
            type: 'etudiant_licence',
            lastMessage: 'Pouvez-vous m\'aider avec l\'exercice 3?',
            lastMessageTime: new Date('2024-07-09 16:45'),
            unreadCount: 1,
            isOnline: true
        },
        {
            id: '4',
            name: 'Dr. Aissatou Ndiaye',
            email: 'aissatou.ndiaye@isi.sn',
            type: 'encadrant',
            lastMessage: 'La soutenance est prévue pour jeudi',
            lastMessageTime: new Date('2024-07-09 10:20'),
            unreadCount: 0,
            isOnline: true
        }
    ]);
    const [visitorMessages] = useState([
        {
            id: 'v1',
            fullName: 'Mamadou Ba',
            email: 'mamadou.ba@gmail.com',
            message: 'Bonjour, je souhaiterais avoir des informations sur les conditions d\'admission en Master. Quels sont les prérequis et les dates limites d\'inscription?',
            timestamp: new Date('2024-07-10 15:30'),
            isRead: false
        },
        {
            id: 'v2',
            fullName: 'Aminata Sow',
            email: 'aminata.sow@yahoo.fr',
            message: 'Salut! Je suis une ancienne étudiante et j\'aimerais savoir s\'il y a des opportunités de stage ou d\'emploi disponibles dans votre département.',
            timestamp: new Date('2024-07-09 11:20'),
            isRead: true
        },
        {
            id: 'v3',
            fullName: 'Ousmane Diallo',
            email: 'ousmane.diallo@hotmail.com',
            message: 'Bonjour, je représente une entreprise tech et nous cherchons à établir un partenariat avec votre institution. Pourriez-vous me dire qui contacter?',
            timestamp: new Date('2024-07-08 14:45'),
            isRead: false
        }
    ]);
    const [conversations, setConversations] = useState({
        '1': [
            {
                id: 1,
                senderId: '1',
                senderName: 'Dr. Amadou Fall',
                content: 'Bonjour, j\'ai examiné votre projet. Il y a quelques points à améliorer.',
                timestamp: new Date('2024-07-10 14:25')
            },
            {
                id: 2,
                senderId: 'me',
                senderName: 'Vous',
                content: 'Merci professeur, quels sont les points à améliorer?',
                timestamp: new Date('2024-07-10 14:27')
            },
            {
                id: 3,
                senderId: '1',
                senderName: 'Dr. Amadou Fall',
                content: 'Nous devons discuter de votre projet en détail. Pouvez-vous passer à mon bureau demain?',
                timestamp: new Date('2024-07-10 14:30')
            }
        ]
    });
    const messagesEndRef = useRef(null);
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, selectedContact]);
    const getUserTypeIcon = (type) => {
        switch (type) {
            case 'encadrant':
                return _jsx(UserCheck, { className: "h-4 w-4" });
            case 'etudiant_licence':
            case 'etudiant_master':
            case 'etudiant_doctorat':
                return _jsx(GraduationCap, { className: "h-4 w-4" });
            case 'visiteur':
                return _jsx(User, { className: "h-4 w-4" });
            default:
                return _jsx(User, { className: "h-4 w-4" });
        }
    };
    const getUserTypeColor = (type) => {
        switch (type) {
            case 'encadrant':
                return 'text-blue-600 bg-blue-100';
            case 'etudiant_licence':
                return 'text-green-600 bg-green-100';
            case 'etudiant_master':
                return 'text-purple-600 bg-purple-100';
            case 'etudiant_doctorat':
                return 'text-red-600 bg-red-100';
            case 'visiteur':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };
    const getUserTypeLabel = (type) => {
        switch (type) {
            case 'encadrant':
                return 'Encadrant';
            case 'etudiant_licence':
                return 'Licence';
            case 'etudiant_master':
                return 'Master';
            case 'etudiant_doctorat':
                return 'Doctorat';
            case 'visiteur':
                return 'Visiteur';
            default:
                return 'Utilisateur';
        }
    };
    const handleSendMessage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.trim() || !selectedContact)
            return;
        const newMessage = {
            id: Date.now(),
            senderId: 'me',
            senderName: 'Vous',
            content: input,
            timestamp: new Date()
        };
        setConversations(prev => (Object.assign(Object.assign({}, prev), { [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage] })));
        setInput('');
        setIsTyping(true);
        // Simuler une réponse
        setTimeout(() => {
            const responses = [
                'Merci pour votre message.',
                'Je vais examiner cela et vous revenir.',
                'C\'est une bonne question, laissez-moi réfléchir.',
                'Je vous recontacte bientôt avec plus de détails.',
                'Parfait, nous pouvons organiser une réunion.'
            ];
            const response = {
                id: Date.now() + 1,
                senderId: selectedContact.id,
                senderName: selectedContact.name,
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date()
            };
            setConversations(prev => (Object.assign(Object.assign({}, prev), { [selectedContact.id]: [...(prev[selectedContact.id] || []), response] })));
            setIsTyping(false);
        }, 2000);
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
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredVisitorMessages = visitorMessages.filter(message => message.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsxs("div", { className: `${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`, children: [_jsxs("div", { className: "p-4 border-b border-gray-100", children: [_jsxs("div", { className: "flex gap-2 mb-4", children: [_jsxs("button", { onClick: () => setActiveTab('conversations'), className: `flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'conversations'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [_jsx(MessageSquare, { className: "h-4 w-4" }), "Conversations"] }), _jsxs("button", { onClick: () => setActiveTab('visiteurs'), className: `flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'visiteurs'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [_jsx(Users, { className: "h-4 w-4" }), "Visiteurs", visitorMessages.filter(m => !m.isRead).length > 0 && (_jsx("span", { className: "bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center", children: visitorMessages.filter(m => !m.isRead).length }))] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: activeTab === 'conversations' ? 'Rechercher des contacts...' : 'Rechercher des messages...', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: activeTab === 'conversations' ? (
                        /* Contacts List */
                        _jsx("div", { className: "p-2", children: filteredContacts.map((contact) => (_jsx("div", { className: `group relative p-3 mb-1 cursor-pointer rounded-lg transition-all duration-200 ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-50'}`, onClick: () => {
                                    setSelectedContact(contact);
                                    setSelectedVisitorMessage(null);
                                }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id ? 'bg-white/20' : getUserTypeColor(contact.type)}`, children: getUserTypeIcon(contact.type) }), contact.isOnline && (_jsx("div", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: `text-sm font-semibold truncate ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id ? 'text-white' : 'text-gray-900'}`, children: contact.name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id
                                                                        ? 'bg-white/20 text-white'
                                                                        : getUserTypeColor(contact.type)}`, children: getUserTypeLabel(contact.type) }), contact.unreadCount && contact.unreadCount > 0 && (_jsx("span", { className: "bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center", children: contact.unreadCount }))] })] }), _jsx("p", { className: `text-xs truncate ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id ? 'text-white/80' : 'text-gray-500'}`, children: contact.lastMessage }), _jsx("p", { className: `text-xs mt-1 ${(selectedContact === null || selectedContact === void 0 ? void 0 : selectedContact.id) === contact.id ? 'text-white/60' : 'text-gray-400'}`, children: contact.lastMessageTime && formatDate(contact.lastMessageTime) })] })] }) }, contact.id))) })) : (
                        /* Visitor Messages */
                        _jsx("div", { className: "p-2", children: filteredVisitorMessages.map((message) => (_jsx("div", { className: `group relative p-3 mb-2 cursor-pointer rounded-lg border transition-all duration-200 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id
                                    ? 'bg-primary text-white border-primary'
                                    : message.isRead
                                        ? 'bg-white border-gray-200 hover:bg-gray-50'
                                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`, onClick: () => {
                                    setSelectedVisitorMessage(message);
                                    setSelectedContact(null);
                                }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'bg-white/20' : 'bg-gray-200'}`, children: _jsx(User, { className: `h-4 w-4 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white' : 'text-gray-600'}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: `text-sm font-semibold truncate ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white' : 'text-gray-900'}`, children: message.fullName }), _jsxs("div", { className: "flex items-center gap-2", children: [!message.isRead && (_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" })), _jsx(Eye, { className: `h-3 w-3 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white/60' : 'text-gray-400'}` })] })] }), _jsx("p", { className: `text-xs mb-1 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white/80' : 'text-gray-600'}`, children: message.email }), _jsx("p", { className: `text-xs leading-relaxed line-clamp-2 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white/70' : 'text-gray-500'}`, children: message.message }), _jsx("p", { className: `text-xs mt-2 ${(selectedVisitorMessage === null || selectedVisitorMessage === void 0 ? void 0 : selectedVisitorMessage.id) === message.id ? 'text-white/60' : 'text-gray-400'}`, children: formatDate(message.timestamp) })] })] }) }, message.id))) })) })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setShowSidebar(!showSidebar), className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: showSidebar ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) }), _jsx("div", { children: selectedContact ? (_jsxs(_Fragment, { children: [_jsxs("h1", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [selectedContact.name, _jsx("span", { className: `text-xs px-2 py-1 rounded-full ${getUserTypeColor(selectedContact.type)}`, children: getUserTypeLabel(selectedContact.type) }), selectedContact.isOnline && (_jsxs("span", { className: "flex items-center gap-1 text-sm text-green-600", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), "En ligne"] }))] }), _jsx("p", { className: "text-sm text-gray-500", children: selectedContact.email })] })) : selectedVisitorMessage ? (_jsxs(_Fragment, { children: [_jsxs("h1", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [selectedVisitorMessage.fullName, _jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600", children: "Visiteur" })] }), _jsx("p", { className: "text-sm text-gray-500", children: selectedVisitorMessage.email })] })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Messagerie" }), _jsx("p", { className: "text-sm text-gray-500", children: "S\u00E9lectionnez une conversation" })] })) })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: selectedContact ? (_jsxs("div", { children: [(conversations[selectedContact.id] || []).map((message) => (_jsx("div", { className: `w-full ${message.senderId === 'me' ? 'bg-white' : 'bg-gray-50'}`, children: _jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${message.senderId === 'me'
                                                            ? 'bg-gray-600 text-white'
                                                            : 'bg-primary text-white'}`, children: message.senderId === 'me' ? (_jsx(User, { className: "h-4 w-4" })) : (getUserTypeIcon(selectedContact.type)) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 mb-1", children: message.senderName }), _jsx("div", { className: "text-gray-700 whitespace-pre-wrap", children: message.content }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: formatTime(message.timestamp) })] })] }) }) }, message.id))), isTyping && (_jsx("div", { className: "w-full bg-gray-50", children: _jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white", children: getUserTypeIcon(selectedContact.type) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-gray-900 mb-1", children: selectedContact.name }), _jsxs("div", { className: "typing-animation", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] })] })] }) }) })), _jsx("div", { ref: messagesEndRef })] })) : selectedVisitorMessage ? (_jsx("div", { className: "max-w-4xl mx-auto p-6", children: _jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(User, { className: "h-6 w-6 text-gray-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: selectedVisitorMessage.fullName }), _jsxs("span", { className: "text-sm text-gray-500", children: [formatDate(selectedVisitorMessage.timestamp), " \u00E0 ", formatTime(selectedVisitorMessage.timestamp)] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: selectedVisitorMessage.email }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: _jsx("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap", children: selectedVisitorMessage.message }) }), _jsx("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx(Eye, { className: "inline h-4 w-4 mr-1" }), "Message de visiteur - Lecture seule. Vous ne pouvez pas r\u00E9pondre directement."] }) })] })] }) }) })) : (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageSquare, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Aucune conversation s\u00E9lectionn\u00E9e" }), _jsx("p", { className: "text-gray-500", children: "Choisissez un contact ou un message de visiteur pour commencer" })] }) })) }), selectedContact && (_jsx("div", { className: "bg-white border-t border-gray-200 p-6", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Tapez votre message...", rows: 1, className: "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm hover:border-gray-400", style: { minHeight: '52px', maxHeight: '120px' } }) }), _jsx("button", { onClick: handleSendMessage, disabled: !input.trim(), className: "bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md", children: _jsx(Send, { className: "h-5 w-5" }) })] }) }) }))] }), _jsx("style", { children: `
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
export default Messagerie;
