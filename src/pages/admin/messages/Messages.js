import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiSend, FiMoreVertical, FiPaperclip, FiImage, FiSmile, FiFile, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
// Données fictives
const users = [
    { id: 1, name: 'Admin', role: 'Administrateur', status: 'online' },
    { id: 2, name: 'Dr. Ahmed Diop', role: 'Chef de département', department: 'Informatique', status: 'online' },
    { id: 3, name: 'Fatou Sow', role: 'Secrétaire', department: 'Génie Civil', status: 'away', lastSeen: new Date(2025, 4, 11, 15, 45) },
    { id: 4, name: 'Dr. Ousmane Fall', role: 'Chef de département', department: 'Management', status: 'offline', lastSeen: new Date(2025, 4, 10, 9, 20) },
    { id: 5, name: 'Marie Faye', role: 'Secrétaire', department: 'Informatique', status: 'online' },
    { id: 6, name: 'Dr. Ibrahima Ndiaye', role: 'Chef de département', department: 'Mécanique', status: 'offline', lastSeen: new Date(2025, 4, 9, 16, 30) },
];
// Générateur simple de conversations fictives
const generateConversations = () => {
    return users.filter(user => user.id !== 1).map(user => {
        const messages = Array.from({ length: Math.floor(Math.random() * 20) + 3 }, (_, i) => {
            const isAdmin = i % 2 === 0;
            const date = new Date();
            date.setHours(date.getHours() - i * 2);
            return {
                id: i + 1,
                senderId: isAdmin ? 1 : user.id,
                recipientId: isAdmin ? user.id : 1,
                content: isAdmin
                    ? `Message administratif ${i + 1} pour ${user.name}. Veuillez confirmer la réception.`
                    : `Réponse ${i + 1} de ${user.name}. Message bien reçu, merci pour l'information.`,
                timestamp: date,
                read: i > 2, // Les 3 derniers messages sont non lus
                attachments: i === 1 ? [
                    { id: 1, name: 'document.pdf', type: 'pdf', url: '#' }
                ] : undefined
            };
        });
        // Trier les messages par timestamp (du plus récent au plus ancien)
        messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return {
            id: user.id,
            participants: [1, user.id], // Admin (id:1) et l'utilisateur
            messages,
            unreadCount: messages.filter(msg => !msg.read && msg.senderId !== 1).length,
            lastMessageTimestamp: messages[0].timestamp
        };
    });
};
const conversations = generateConversations();
// Composant principal
const Messages = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [activeConversation, setActiveConversation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    // Filtrer les conversations en fonction de la recherche
    const filteredConversations = conversations.filter(conversation => {
        var _a;
        const otherParticipant = users.find(user => user.id === conversation.participants.find(id => id !== 1));
        return (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            ((_a = otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.department) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    // Défiler vers le bas des messages lors de la sélection d'une conversation
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeConversation]);
    // Gérer l'envoi d'un message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation)
            return;
        // Simuler l'ajout d'un nouveau message
        const updatedConversation = Object.assign({}, activeConversation);
        const newMsg = {
            id: Date.now(),
            senderId: 1, // Admin
            recipientId: activeConversation.participants.find(id => id !== 1) || 0,
            content: newMessage.trim(),
            timestamp: new Date(),
            read: false
        };
        updatedConversation.messages = [newMsg, ...updatedConversation.messages];
        updatedConversation.lastMessageTimestamp = new Date();
        setActiveConversation(updatedConversation);
        setNewMessage('');
    };
    // Obtenir l'utilisateur correspondant à un ID
    const getUserById = (userId) => {
        return users.find(user => user.id === userId);
    };
    // Obtenir l'autre participant dans une conversation
    const getOtherParticipant = (conversation) => {
        const otherId = conversation.participants.find(id => id !== 1);
        return getUserById(otherId || 0);
    };
    // Formater la date du dernier message
    const formatMessageTime = (date) => {
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: fr
        });
    };
    return (_jsx("div", { className: "h-full", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("h1", { className: "text-2xl font-bold pb-4", children: "Messages" }), _jsxs("div", { className: "flex flex-1 overflow-hidden bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "w-80 border-r border-gray-200 flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher une conversation...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" }), _jsx(FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: filteredConversations.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: "Aucune conversation trouv\u00E9e" })) : (filteredConversations.map(conversation => {
                                        const otherUser = getOtherParticipant(conversation);
                                        const lastMessage = conversation.messages[0];
                                        return (_jsx("div", { onClick: () => setActiveConversation(conversation), className: `p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${(activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.id) === conversation.id ? 'bg-gray-50' : ''}`, children: _jsxs("div", { className: "flex items-start", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600", children: (otherUser === null || otherUser === void 0 ? void 0 : otherUser.avatar) ? (_jsx("img", { src: otherUser.avatar, alt: otherUser.name, className: "h-10 w-10 rounded-full" })) : (_jsx("span", { children: otherUser === null || otherUser === void 0 ? void 0 : otherUser.name.slice(0, 2) })) }), _jsx("div", { className: `absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${(otherUser === null || otherUser === void 0 ? void 0 : otherUser.status) === 'online' ? 'bg-green-500' :
                                                                    (otherUser === null || otherUser === void 0 ? void 0 : otherUser.status) === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}` })] }), _jsxs("div", { className: "ml-3 flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 truncate", children: otherUser === null || otherUser === void 0 ? void 0 : otherUser.name }), _jsx("span", { className: "text-xs text-gray-500", children: formatMessageTime(conversation.lastMessageTimestamp) })] }), _jsxs("p", { className: "text-xs text-gray-500", children: [otherUser === null || otherUser === void 0 ? void 0 : otherUser.role, (otherUser === null || otherUser === void 0 ? void 0 : otherUser.department) ? ` - ${otherUser.department}` : ''] }), _jsxs("p", { className: "text-sm text-gray-600 truncate mt-1", children: [lastMessage.senderId === 1 ? 'Vous: ' : '', lastMessage.content] })] }), conversation.unreadCount > 0 && (_jsx("div", { className: "ml-2 bg-primary text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1", children: conversation.unreadCount }))] }) }, conversation.id));
                                    })) })] }), _jsx("div", { className: "flex-1 flex flex-col", children: activeConversation ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-4 border-b border-gray-200 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3", children: ((_a = getOtherParticipant(activeConversation)) === null || _a === void 0 ? void 0 : _a.avatar) ? (_jsx("img", { src: (_b = getOtherParticipant(activeConversation)) === null || _b === void 0 ? void 0 : _b.avatar, alt: (_c = getOtherParticipant(activeConversation)) === null || _c === void 0 ? void 0 : _c.name, className: "h-10 w-10 rounded-full" })) : (_jsx("span", { children: (_d = getOtherParticipant(activeConversation)) === null || _d === void 0 ? void 0 : _d.name.slice(0, 2) })) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: (_e = getOtherParticipant(activeConversation)) === null || _e === void 0 ? void 0 : _e.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [(_f = getOtherParticipant(activeConversation)) === null || _f === void 0 ? void 0 : _f.role, ((_g = getOtherParticipant(activeConversation)) === null || _g === void 0 ? void 0 : _g.department) ?
                                                                        ` - ${(_h = getOtherParticipant(activeConversation)) === null || _h === void 0 ? void 0 : _h.department}` : ''] })] })] }), _jsx("div", { className: "flex items-center", children: _jsx("button", { className: "p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100", children: _jsx(FiMoreVertical, { className: "h-5 w-5" }) }) })] }), _jsxs("div", { className: "flex-1 p-4 overflow-y-auto", style: { minHeight: '500px', maxHeight: 'calc(100vh - 180px)' }, children: [_jsx("div", { ref: messagesEndRef }), activeConversation.messages.map((message, index) => {
                                                const isAdmin = message.senderId === 1;
                                                const sender = getUserById(message.senderId);
                                                return (_jsx("div", { className: `mb-4 max-w-[80%] ${isAdmin ? 'self-end' : 'self-start'}`, style: { minHeight: '200px' }, children: _jsxs("div", { className: `flex items-start ${isAdmin ? 'flex-row-reverse' : ''}`, children: [!isAdmin && (_jsx("div", { className: "h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2", children: (sender === null || sender === void 0 ? void 0 : sender.avatar) ? (_jsx("img", { src: sender.avatar, alt: sender.name, className: "h-8 w-8 rounded-full" })) : (_jsx("span", { className: "text-xs", children: sender === null || sender === void 0 ? void 0 : sender.name.slice(0, 2) })) })), _jsx("div", { className: `${isAdmin ? 'mr-2' : 'ml-2'}`, children: _jsxs("div", { className: `p-3 ${isAdmin ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`, style: { borderRadius: 0 }, children: [_jsx("p", { children: message.content }), message.attachments && message.attachments.length > 0 && (_jsx("div", { className: "mt-2 space-y-2", children: message.attachments.map(attachment => (_jsxs("div", { className: `flex items-center p-2 rounded ${isAdmin ? 'bg-blue-600' : 'bg-gray-200'}`, children: [_jsx(FiFile, { className: `mr-2 ${isAdmin ? 'text-white' : 'text-gray-500'}` }), _jsx("span", { className: "text-sm", children: attachment.name })] }, attachment.id))) }))] }) })] }) }, message.id));
                                            })] }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("form", { onSubmit: handleSendMessage, className: "flex items-end space-x-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("textarea", { placeholder: "\u00C9crivez votre message...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none min-h-[70px] max-h-[150px]", onKeyDown: (e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleSendMessage(e);
                                                                }
                                                            } }), _jsxs("div", { className: "absolute bottom-2 left-2 flex space-x-2", children: [_jsxs("div", { className: "relative", children: [_jsx("button", { type: "button", onClick: () => setShowAttachmentOptions(!showAttachmentOptions), className: "p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100", children: _jsx(FiPaperclip, { className: "h-5 w-5" }) }), _jsx(AnimatePresence, { children: showAttachmentOptions && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute bottom-10 left-0 bg-white rounded-lg shadow-lg p-2 w-40", children: [_jsxs("button", { type: "button", onClick: () => {
                                                                                            var _a;
                                                                                            (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
                                                                                            setShowAttachmentOptions(false);
                                                                                        }, className: "flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded", children: [_jsx(FiFile, { className: "mr-2 text-gray-500" }), _jsx("span", { children: "Document" })] }), _jsxs("button", { type: "button", onClick: () => {
                                                                                            var _a;
                                                                                            (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
                                                                                            setShowAttachmentOptions(false);
                                                                                        }, className: "flex items-center w-full p-2 text-left text-sm hover:bg-gray-100 rounded", children: [_jsx(FiImage, { className: "mr-2 text-gray-500" }), _jsx("span", { children: "Image" })] })] })) }), _jsx("input", { type: "file", ref: fileInputRef, className: "hidden", onChange: () => { } })] }), _jsxs("div", { className: "relative", children: [_jsx("button", { type: "button", onClick: () => setShowEmojiPicker(!showEmojiPicker), className: "p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100", children: _jsx(FiSmile, { className: "h-5 w-5" }) }), _jsx(AnimatePresence, { children: showEmojiPicker && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute bottom-10 left-0 bg-white rounded-lg shadow-lg p-2 w-64 h-48 overflow-y-auto", children: _jsx("div", { className: "grid grid-cols-8 gap-1", children: ["���", "���", "���", "���", "���", "���", "���", "❤️", "���", "���", "���", "���", "���", "���", "���", "✅", "❌", "⭐", "���", "���", "���", "���", "���", "���"].map(emoji => (_jsx("button", { type: "button", onClick: () => {
                                                                                            setNewMessage(prev => prev + emoji);
                                                                                            setShowEmojiPicker(false);
                                                                                        }, className: "p-1 text-xl hover:bg-gray-100 rounded", children: emoji }, emoji))) }) })) })] })] })] }), _jsx("button", { type: "submit", disabled: !newMessage.trim(), className: `p-3 rounded-full ${newMessage.trim()
                                                        ? 'bg-primary text-white hover:bg-primary-700'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`, children: _jsx(FiSend, { className: "h-5 w-5" }) })] }) })] })) : (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-4 text-center", children: [_jsx("div", { className: "h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4", children: _jsx(FiMessageSquare, { className: "h-10 w-10" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-700", children: "Centre de messages" }), _jsx("p", { className: "text-gray-500 max-w-md mt-2", children: "S\u00E9lectionnez une conversation pour commencer \u00E0 discuter avec les chefs de d\u00E9partement et les secr\u00E9taires." })] })) })] })] }) }));
};
export default Messages;
