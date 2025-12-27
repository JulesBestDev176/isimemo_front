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
import { useState, useRef } from 'react';
import { Send, Video, MapPin, FileText, MessageSquare, X, Upload } from 'lucide-react';
import { MessageItem } from './MessageItem';
export const MessageList = ({ messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messageType, setMessageType] = useState('texte');
    const [showTypeForm, setShowTypeForm] = useState(false);
    const [titre, setTitre] = useState('');
    const [lienMeet, setLienMeet] = useState('');
    const [dateRendezVous, setDateRendezVous] = useState('');
    const [heureRendezVous, setHeureRendezVous] = useState('');
    const [lieu, setLieu] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [copiedLinkId, setCopiedLinkId] = useState(null);
    const fileInputRef = useRef(null);
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
    const handleFileChange = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleSend = () => {
        if (!newMessage.trim())
            return;
        const messageData = {
            contenu: newMessage,
            type: messageType,
            titre: titre.trim() || undefined,
            lienMeet: lienMeet.trim() || undefined,
            dateRendezVous: dateRendezVous || undefined,
            heureRendezVous: heureRendezVous || undefined,
            lieu: lieu.trim() || undefined,
            nomDocument: (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.name) || undefined,
            cheminDocument: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
            tailleDocument: selectedFile ? formatFileSize(selectedFile.size) : undefined,
        };
        onSendMessage(messageData);
        // Reset form
        setNewMessage('');
        setTitre('');
        setLienMeet('');
        setDateRendezVous('');
        setHeureRendezVous('');
        setLieu('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setMessageType('texte');
        setShowTypeForm(false);
    };
    const handleCopyLink = (link, messageId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(link);
            setCopiedLinkId(messageId);
            setTimeout(() => {
                setCopiedLinkId(null);
            }, 2000);
        }
        catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    });
    const resetTypeForm = () => {
        setLienMeet('');
        setDateRendezVous('');
        setHeureRendezVous('');
        setLieu('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleTypeChange = (type) => {
        setMessageType(type);
        resetTypeForm();
        setShowTypeForm(type !== 'texte');
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Messages envoy\u00E9s aux \u00E9tudiants" }) }), _jsx("div", { className: "space-y-4 max-h-[500px] overflow-y-auto", children: messages.map((message) => (_jsx(MessageItem, { message: message, onCopyLink: handleCopyLink, copiedLinkId: copiedLinkId }, message.id))) }), _jsx("div", { className: "border-t border-gray-200 pt-4", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Type de message:" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleTypeChange('texte'), className: `px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${messageType === 'texte'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: [_jsx(MessageSquare, { className: "h-3 w-3" }), "Texte"] }), _jsxs("button", { onClick: () => handleTypeChange('reunion-meet'), className: `px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${messageType === 'reunion-meet'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: [_jsx(Video, { className: "h-3 w-3" }), "R\u00E9union Meet"] }), _jsxs("button", { onClick: () => handleTypeChange('presentiel'), className: `px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${messageType === 'presentiel'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: [_jsx(MapPin, { className: "h-3 w-3" }), "Pr\u00E9sentiel"] }), _jsxs("button", { onClick: () => handleTypeChange('document'), className: `px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${messageType === 'document'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`, children: [_jsx(FileText, { className: "h-3 w-3" }), "Document"] })] })] }), showTypeForm && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4 rounded space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-900", children: [messageType === 'reunion-meet' && 'Détails de la réunion', messageType === 'presentiel' && 'Détails du rendez-vous', messageType === 'document' && 'Informations du document'] }), _jsx("button", { onClick: () => {
                                                setShowTypeForm(false);
                                                resetTypeForm();
                                                setMessageType('texte');
                                            }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Titre (optionnel)" }), _jsx("input", { type: "text", value: titre, onChange: (e) => setTitre(e.target.value), placeholder: "Titre du message", className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] }), messageType === 'reunion-meet' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Lien Meet *" }), _jsx("input", { type: "url", value: lienMeet, onChange: (e) => setLienMeet(e.target.value), placeholder: "https://meet.google.com/...", className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: dateRendezVous, onChange: (e) => setDateRendezVous(e.target.value), className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Heure" }), _jsx("input", { type: "time", value: heureRendezVous, onChange: (e) => setHeureRendezVous(e.target.value), className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] })] })] })), messageType === 'presentiel' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Lieu *" }), _jsx("input", { type: "text", value: lieu, onChange: (e) => setLieu(e.target.value), placeholder: "Salle, B\u00E2timent...", className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: dateRendezVous, onChange: (e) => setDateRendezVous(e.target.value), className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Heure" }), _jsx("input", { type: "time", value: heureRendezVous, onChange: (e) => setHeureRendezVous(e.target.value), className: "w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent" })] })] })] })), messageType === 'document' && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Document *" }), _jsxs("div", { className: "mt-1", children: [_jsx("input", { ref: fileInputRef, type: "file", onChange: handleFileChange, className: "hidden", id: "document-upload", accept: ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx" }), _jsx("label", { htmlFor: "document-upload", className: "flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors", children: _jsxs("div", { className: "flex flex-col items-center space-y-2", children: [_jsx(Upload, { className: "h-6 w-6 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: selectedFile ? selectedFile.name : 'Cliquez pour téléverser un document' }), selectedFile && (_jsx("span", { className: "text-xs text-gray-500", children: formatFileSize(selectedFile.size) }))] }) }), selectedFile && (_jsx("button", { type: "button", onClick: () => {
                                                        setSelectedFile(null);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }, className: "mt-2 text-xs text-red-600 hover:text-red-700", children: "Supprimer le fichier" }))] })] }))] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { value: newMessage, onChange: (e) => setNewMessage(e.target.value), placeholder: "Tapez votre message...", className: "flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none", rows: 3, onKeyDown: (e) => {
                                        if (e.key === 'Enter' && e.ctrlKey) {
                                            handleSend();
                                        }
                                    } }), _jsxs("button", { onClick: handleSend, disabled: !newMessage.trim() || (messageType === 'reunion-meet' && !lienMeet.trim()) || (messageType === 'presentiel' && !lieu.trim()) || (messageType === 'document' && !selectedFile), className: "px-3 py-2 bg-primary text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-sm", children: [_jsx(Send, { className: "h-4 w-4" }), "Envoyer"] })] })] }) })] }));
};
