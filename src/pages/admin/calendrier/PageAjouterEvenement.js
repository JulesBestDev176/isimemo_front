import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUsers, FiMapPin, FiVideo, FiAlertCircle, FiUserPlus, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
const PageAjouterEvenement = () => {
    const navigate = useNavigate();
    // État du formulaire
    const [formulaire, setFormulaire] = useState({
        titre: '',
        description: '',
        dateDebut: '',
        heureDebut: '',
        dateFin: '',
        heureFin: '',
        typeEvenement: 'presentiel',
        lieu: '',
        lienVisio: '',
        couleur: '#3b82f6', // Bleu par défaut
        participantsSelectionnes: []
    });
    // État de soumission et erreurs
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    // Liste de couleurs disponibles pour les événements
    const couleurs = [
        { valeur: '#3b82f6', nom: 'Bleu' },
        { valeur: '#10b981', nom: 'Vert' },
        { valeur: '#ef4444', nom: 'Rouge' },
        { valeur: '#f59e0b', nom: 'Orange' },
        { valeur: '#8b5cf6', nom: 'Violet' },
        { valeur: '#ec4899', nom: 'Rose' },
        { valeur: '#6b7280', nom: 'Gris' },
    ];
    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};
        if (!formulaire.titre.trim()) {
            newErrors.titre = "Le titre de l'événement est obligatoire";
        }
        else if (formulaire.titre.length < 3) {
            newErrors.titre = "Le titre doit contenir au moins 3 caractères";
        }
        if (!formulaire.dateDebut) {
            newErrors.dateDebut = "La date de début est obligatoire";
        }
        if (!formulaire.heureDebut) {
            newErrors.heureDebut = "L'heure de début est obligatoire";
        }
        if (!formulaire.dateFin) {
            newErrors.dateFin = "La date de fin est obligatoire";
        }
        if (!formulaire.heureFin) {
            newErrors.heureFin = "L'heure de fin est obligatoire";
        }
        if (formulaire.typeEvenement === 'presentiel' && !formulaire.lieu.trim()) {
            newErrors.lieu = "Le lieu est obligatoire pour un événement présentiel";
        }
        if (formulaire.typeEvenement === 'enligne' && !formulaire.lienVisio.trim()) {
            newErrors.lienVisio = "Le lien de visioconférence est obligatoire pour un événement en ligne";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Gérer les changements dans le formulaire
    const handleChangement = (e) => {
        const { name, value } = e.target;
        setFormulaire(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Effacer l'erreur pour ce champ si elle existe
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = Object.assign({}, prev);
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    // Gérer les changements de type d'événement
    const handleChangementType = (type) => {
        setFormulaire(prev => (Object.assign(Object.assign(Object.assign({}, prev), { typeEvenement: type }), (type === 'enligne' ? { lieu: '' } : { lienVisio: '' }))));
        // Effacer les erreurs associées
        setErrors(prev => {
            const newErrors = Object.assign({}, prev);
            delete newErrors.lieu;
            delete newErrors.lienVisio;
            return newErrors;
        });
    };
    // Gérer les changements de participants
    const toggleParticipant = (id) => {
        setFormulaire(prev => {
            const estDejaSelectionne = prev.participantsSelectionnes.includes(id);
            if (estDejaSelectionne) {
                return Object.assign(Object.assign({}, prev), { participantsSelectionnes: prev.participantsSelectionnes.filter(p => p !== id) });
            }
            else {
                return Object.assign(Object.assign({}, prev), { participantsSelectionnes: [...prev.participantsSelectionnes, id] });
            }
        });
    };
    // Soumettre le formulaire
    const soumettreFormulaire = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Logique pour soumettre le formulaire
            console.log('Événement créé:', formulaire);
            setFormSubmitted(true);
            // Simuler un délai puis rediriger
            setTimeout(() => {
                navigate('/calendrier');
            }, 2000);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ajouter un \u00E9v\u00E9nement" }), _jsxs(Link, { to: "/calendrier", className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " Retour au calendrier"] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: formSubmitted ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "flex flex-col items-center justify-center py-8", children: [_jsx("div", { className: "h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4", children: _jsx(FiCheck, { className: "h-8 w-8" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "\u00C9v\u00E9nement ajout\u00E9 avec succ\u00E8s!" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "L'\u00E9v\u00E9nement a \u00E9t\u00E9 cr\u00E9\u00E9 et est maintenant disponible dans le calendrier." }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Link, { to: "/calendrier", className: "btn-outline", children: "Retour au calendrier" }), _jsx(Link, { to: "/calendrier/ajouter", className: "btn-primary", onClick: () => {
                                        setFormulaire({
                                            titre: '',
                                            description: '',
                                            dateDebut: '',
                                            heureDebut: '',
                                            dateFin: '',
                                            heureFin: '',
                                            typeEvenement: 'presentiel',
                                            lieu: '',
                                            lienVisio: '',
                                            couleur: '#3b82f6',
                                            participantsSelectionnes: []
                                        });
                                        setFormSubmitted(false);
                                    }, children: "Ajouter un autre \u00E9v\u00E9nement" })] })] })) : (_jsxs("form", { onSubmit: soumettreFormulaire, children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "titre", className: "block text-sm font-medium text-gray-700", children: "Titre de l'\u00E9v\u00E9nement*" }), errors.titre && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.titre] }))] }), _jsx("input", { type: "text", id: "titre", name: "titre", required: true, value: formulaire.titre, onChange: handleChangement, className: `w-full rounded-md border ${errors.titre ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "Ex: R\u00E9union hebdomadaire" }), errors.titre && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.titre }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { id: "description", name: "description", rows: 3, value: formulaire.description, onChange: handleChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Description de l'\u00E9v\u00E9nement..." }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Fournissez une description d\u00E9taill\u00E9e pour aider les participants \u00E0 comprendre l'objectif de cet \u00E9v\u00E9nement." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "dateDebut", className: "block text-sm font-medium text-gray-700", children: "Date de d\u00E9but*" }), errors.dateDebut && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.dateDebut] }))] }), _jsx("input", { type: "date", id: "dateDebut", name: "dateDebut", required: true, value: formulaire.dateDebut, onChange: handleChangement, className: `w-full rounded-md border ${errors.dateDebut ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "heureDebut", className: "block text-sm font-medium text-gray-700", children: "Heure de d\u00E9but*" }), errors.heureDebut && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.heureDebut] }))] }), _jsx("input", { type: "time", id: "heureDebut", name: "heureDebut", required: true, value: formulaire.heureDebut, onChange: handleChangement, className: `w-full rounded-md border ${errors.heureDebut ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "dateFin", className: "block text-sm font-medium text-gray-700", children: "Date de fin*" }), errors.dateFin && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.dateFin] }))] }), _jsx("input", { type: "date", id: "dateFin", name: "dateFin", required: true, value: formulaire.dateFin, onChange: handleChangement, className: `w-full rounded-md border ${errors.dateFin ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "heureFin", className: "block text-sm font-medium text-gray-700", children: "Heure de fin*" }), errors.heureFin && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.heureFin] }))] }), _jsx("input", { type: "time", id: "heureFin", name: "heureFin", required: true, value: formulaire.heureFin, onChange: handleChangement, className: `w-full rounded-md border ${errors.heureFin ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Type d'\u00E9v\u00E9nement" }), _jsxs("div", { className: "flex space-x-4 mb-4", children: [_jsxs("button", { type: "button", onClick: () => handleChangementType('presentiel'), className: `flex-1 py-3 px-4 rounded-md border flex items-center justify-center transition-colors ${formulaire.typeEvenement === 'presentiel'
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-gray-300 hover:bg-gray-50'}`, children: [_jsx(FiMapPin, { className: "mr-2" }), " Pr\u00E9sentiel"] }), _jsxs("button", { type: "button", onClick: () => handleChangementType('enligne'), className: `flex-1 py-3 px-4 rounded-md border flex items-center justify-center transition-colors ${formulaire.typeEvenement === 'enligne'
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-gray-300 hover:bg-gray-50'}`, children: [_jsx(FiVideo, { className: "mr-2" }), " En ligne"] })] }), formulaire.typeEvenement === 'presentiel' && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "lieu", className: "block text-sm font-medium text-gray-700", children: "Lieu*" }), errors.lieu && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.lieu] }))] }), _jsx("input", { type: "text", id: "lieu", name: "lieu", required: true, value: formulaire.lieu, onChange: handleChangement, className: `w-full rounded-md border ${errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "Ex: Salle de conf\u00E9rence, B\u00E2timent A" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Sp\u00E9cifiez un lieu pr\u00E9cis pour faciliter l'orientation des participants." })] })), formulaire.typeEvenement === 'enligne' && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("label", { htmlFor: "lienVisio", className: "block text-sm font-medium text-gray-700", children: "Lien de visioconf\u00E9rence*" }), _jsxs("a", { href: "https://meet.isimemo.edu.sn", target: "_blank", rel: "noopener noreferrer", className: "text-primary text-sm flex items-center hover:underline", children: [_jsx(FiVideo, { className: "mr-1 h-4 w-4" }), " Cr\u00E9er une nouvelle visioconf\u00E9rence"] })] }), _jsx("input", { type: "url", id: "lienVisio", name: "lienVisio", required: true, value: formulaire.lienVisio, onChange: handleChangement, className: `w-full rounded-md border ${errors.lienVisio ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "Ex: https://meet.isimemo.edu.sn/reunion" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Assurez-vous que les participants ont les droits d'acc\u00E8s n\u00E9cessaires." })] }))] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "text-lg font-semibold flex items-center", children: [_jsx(FiUsers, { className: "mr-2" }), " Participants"] }), _jsxs(Link, { to: "/staff/add", className: "text-primary text-sm flex items-center hover:underline", children: [_jsx(FiUserPlus, { className: "mr-1 h-4 w-4" }), " Ajouter un nouveau participant"] })] }), _jsx("p", { className: "mt-2 text-xs text-gray-500", children: "S\u00E9lectionnez tous les participants qui doivent \u00EAtre invit\u00E9s \u00E0 cet \u00E9v\u00E9nement." })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Couleur de l'\u00E9v\u00E9nement" }), _jsx("div", { className: "flex flex-wrap gap-3", children: couleurs.map(couleur => (_jsx("button", { type: "button", onClick: () => setFormulaire(prev => (Object.assign(Object.assign({}, prev), { couleur: couleur.valeur }))), className: `w-10 h-10 rounded-full border-2 ${formulaire.couleur === couleur.valeur ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'}`, style: { backgroundColor: couleur.valeur }, title: couleur.nom }, couleur.valeur))) }), _jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Choisissez une couleur pour identifier facilement cet \u00E9v\u00E9nement dans le calendrier." })] }), _jsx("div", { className: "flex justify-end pt-4 border-t border-gray-100", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Link, { to: "/calendrier", className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center", children: "Annuler" }), _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer"] })] }) })] })) })] }));
};
export default PageAjouterEvenement;
