import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiVideo, FiUsers, FiEdit, FiTrash2, FiLink, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
const PageDetailEvenement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evenement, setEvenement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalSuppression, setModalSuppression] = useState(false);
    // Simuler le chargement des données de l'événement
    useEffect(() => {
        // Dans une application réelle, vous feriez une requête API ici
        const simulerChargement = () => {
            setTimeout(() => {
                // Événement fictif pour la démonstration
                if (id === 'evt-001') {
                    setEvenement({
                        id: 'evt-001',
                        titre: 'Réunion des chefs de département',
                        description: 'Réunion mensuelle pour discuter des objectifs et suivre l\'avancement des projets en cours. Chaque chef de département présentera un rapport sur les activités de son département.',
                        dateDebut: new Date(2025, 4, 15, 10, 0), // 15 mai 2025, 10:00
                        dateFin: new Date(2025, 4, 15, 12, 0), // 15 mai 2025, 12:00
                        type: 'enligne',
                        lienVisio: 'https://meet.isimemo.edu.sn/reunion-mensuelle',
                        participants: ['Directeur', 'Chef Informatique', 'Chef Administration'],
                        couleur: '#3b82f6' // Bleu
                    });
                }
                else if (id === 'evt-002') {
                    setEvenement({
                        id: 'evt-002',
                        titre: 'Séminaire de formation',
                        description: 'Formation sur les nouvelles technologies de l\'information et de la communication appliquées à l\'enseignement. Prévoir un ordinateur portable pour les exercices pratiques.',
                        dateDebut: new Date(2025, 4, 17, 9, 0), // 17 mai 2025, 9:00
                        dateFin: new Date(2025, 4, 17, 17, 0), // 17 mai 2025, 17:00
                        type: 'presentiel',
                        lieu: 'Amphithéâtre A, Bâtiment Principal',
                        participants: ['Tous les enseignants', 'Personnel administratif'],
                        couleur: '#10b981' // Vert
                    });
                }
                else if (id === 'evt-003') {
                    setEvenement({
                        id: 'evt-003',
                        titre: 'Entretien de recrutement',
                        description: 'Entretien pour le poste de responsable informatique. Le candidat fera une présentation de 20 minutes sur sa vision pour le département informatique, suivie d\'une séance de questions-réponses.',
                        dateDebut: new Date(2025, 4, 20, 14, 30), // 20 mai 2025, 14:30
                        dateFin: new Date(2025, 4, 20, 16, 0), // 20 mai 2025, 16:00
                        type: 'presentiel',
                        lieu: 'Salle de conférence, 2ème étage',
                        participants: ['DRH', 'Directeur', 'Chef Informatique'],
                        couleur: '#8b5cf6' // Violet
                    });
                }
                else {
                    // Événement non trouvé
                    navigate('/calendrier');
                }
                setLoading(false);
            }, 800); // Simuler un délai de chargement
        };
        simulerChargement();
    }, [id, navigate]);
    // Formater la date pour l'affichage
    const formaterDateHeure = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Formater la date (sans l'heure)
    const formaterDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    // Formater l'heure
    const formaterHeure = (date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Supprimer l'événement
    const supprimerEvenement = () => {
        // Dans une application réelle, vous feriez une requête API ici
        console.log('Suppression de l\'événement', id);
        // Simuler la suppression
        alert('Événement supprimé avec succès!');
        // Rediriger vers le calendrier
        navigate('/calendrier');
    };
    // Calculer la durée de l'événement
    const calculerDuree = (debut, fin) => {
        const diffMs = fin.getTime() - debut.getTime();
        const diffHeures = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHeures > 0) {
            return `${diffHeures}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
        }
        else {
            return `${diffMinutes}min`;
        }
    };
    // Afficher un état de chargement
    if (loading) {
        return (_jsx("div", { className: "container mx-auto px-4 py-6 flex justify-center items-center min-h-[400px]", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2" }), _jsx("p", { children: "Chargement des d\u00E9tails de l'\u00E9v\u00E9nement..." })] }) }));
    }
    // Si l'événement n'est pas trouvé
    if (!evenement) {
        return (_jsx("div", { className: "container mx-auto px-4 py-6", children: _jsxs("div", { className: "bg-red-50 p-4 rounded-md text-red-700", children: ["\u00C9v\u00E9nement non trouv\u00E9. ", _jsx(Link, { to: "/calendrier", className: "underline", children: "Retourner au calendrier" })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs(Link, { to: "/calendrier", className: "flex items-center text-gray-600 hover:text-gray-800", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " Retour au calendrier"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Link, { to: `/calendrier/modifier/${id}`, className: "px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center", children: [_jsx(FiEdit, { className: "mr-1" }), " Modifier"] }), _jsxs("button", { onClick: () => setModalSuppression(true), className: "px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center", children: [_jsx(FiTrash2, { className: "mr-1" }), " Supprimer"] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, children: [_jsxs("div", { className: "rounded-t-lg p-6 text-white", style: { backgroundColor: evenement.couleur }, children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: evenement.titre }), _jsxs("div", { className: "flex items-center text-white text-opacity-90", children: [_jsx(FiCalendar, { className: "mr-2" }), _jsxs("span", { children: [formaterDate(evenement.dateDebut), evenement.dateDebut.toDateString() !== evenement.dateFin.toDateString() &&
                                                ` - ${formaterDate(evenement.dateFin)}`] })] })] }), _jsxs("div", { className: "bg-white rounded-b-lg shadow-sm p-6", children: [_jsxs("div", { className: "mb-6 grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "font-medium text-gray-600 mb-1 flex items-center", children: [_jsx(FiClock, { className: "mr-2 text-primary" }), " Horaire"] }), _jsxs("div", { className: "text-lg", children: [formaterHeure(evenement.dateDebut), " - ", formaterHeure(evenement.dateFin)] }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: ["Dur\u00E9e: ", calculerDuree(evenement.dateDebut, evenement.dateFin)] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("div", { className: "font-medium text-gray-600 mb-1 flex items-center", children: evenement.type === 'presentiel' ? (_jsxs(_Fragment, { children: [_jsx(FiMapPin, { className: "mr-2 text-green-600" }), " Lieu"] })) : (_jsxs(_Fragment, { children: [_jsx(FiVideo, { className: "mr-2 text-blue-500" }), " Type"] })) }), _jsx("div", { className: "text-lg", children: evenement.type === 'presentiel' ? (evenement.lieu) : ('Réunion en ligne') }), evenement.type === 'enligne' && (_jsxs("a", { href: evenement.lienVisio, target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 hover:underline flex items-center mt-1", children: [_jsx(FiLink, { className: "mr-1" }), " Rejoindre la r\u00E9union"] }))] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "font-medium text-gray-600 mb-1 flex items-center", children: [_jsx(FiUsers, { className: "mr-2 text-primary" }), " Participants"] }), _jsx("div", { children: evenement.participants.map((participant, index) => (_jsx("span", { className: "inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2 mb-2", children: participant }, index))) })] })] }), evenement.description && (_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold mb-3 flex items-center", children: [_jsx(FiMessageSquare, { className: "mr-2 text-primary" }), " Description"] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsx("p", { className: "whitespace-pre-line", children: evenement.description }) })] })), _jsx("div", { className: "flex justify-center mt-8", children: evenement.type === 'enligne' ? (_jsxs("a", { href: evenement.lienVisio, target: "_blank", rel: "noopener noreferrer", className: "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center", children: [_jsx(FiVideo, { className: "mr-2" }), " Rejoindre la r\u00E9union"] })) : (_jsxs("button", { className: "px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center", children: [_jsx(FiCalendar, { className: "mr-2" }), " Ajouter \u00E0 mon agenda"] })) })] })] }), modalSuppression && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full mx-4", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Confirmer la suppression" }), _jsxs("p", { className: "mb-6", children: ["\u00CAtes-vous s\u00FBr de vouloir supprimer l'\u00E9v\u00E9nement ", _jsxs("span", { className: "font-semibold", children: ["\"", evenement.titre, "\""] }), " ? Cette action est irr\u00E9versible."] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setModalSuppression(false), className: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50", children: "Annuler" }), _jsx("button", { onClick: supprimerEvenement, className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700", children: "Supprimer" })] })] }) }))] }));
};
export default PageDetailEvenement;
