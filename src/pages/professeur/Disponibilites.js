import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Calendar, Clock, Save, Info, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSessionsOuvertes, getDisponibiliteForSession } from '../../models';
// Composant Badge
const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-orange-100 text-orange-800',
        info: 'bg-blue-100 text-blue-800',
        error: 'bg-red-100 text-red-800',
        primary: 'bg-primary-100 text-primary-800'
    };
    return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`, children: children }));
};
// Formatage des dates
const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
};
const Disponibilites = () => {
    const { user } = useAuth();
    const [sessionsOuvertes, setSessionsOuvertes] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [disponibilite, setDisponibilite] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempJoursDisponibles, setTempJoursDisponibles] = useState([]);
    // Charger les sessions ouvertes au montage
    useEffect(() => {
        const sessions = getSessionsOuvertes();
        setSessionsOuvertes(sessions);
        if (sessions.length > 0) {
            setSelectedSession(sessions[0]);
        }
    }, []);
    // Charger la disponibilité pour la session sélectionnée
    useEffect(() => {
        if (selectedSession && (user === null || user === void 0 ? void 0 : user.id)) {
            const existingDispo = getDisponibiliteForSession(parseInt(user.id), selectedSession.id);
            setDisponibilite(existingDispo || null);
            // Initialiser le formulaire avec les jours de la session
            if (existingDispo) {
                setTempJoursDisponibles(JSON.parse(JSON.stringify(existingDispo.joursDisponibles)));
            }
            else {
                // Générer tous les jours entre dateDebut et dateFin
                const jours = [];
                const debut = new Date(selectedSession.dateDebut);
                const fin = new Date(selectedSession.dateFin);
                const currentDate = new Date(debut);
                while (currentDate <= fin) {
                    jours.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                // Si pas de dispo existante, on initialise avec des tableaux vides pour chaque jour de la session
                setTempJoursDisponibles(jours.map(date => ({
                    date: date,
                    creneaux: []
                })));
            }
        }
    }, [selectedSession, user]);
    const handleAddCreneau = (dateIndex) => {
        const newJours = [...tempJoursDisponibles];
        // Si le jour n'existe pas encore dans tempJours (cas nouvelle dispo), on le crée
        if (!newJours[dateIndex]) {
            newJours[dateIndex] = {
                date: selectedSession.joursSession[dateIndex],
                creneaux: []
            };
        }
        newJours[dateIndex].creneaux.push({
            heureDebut: '09:00',
            heureFin: '12:00'
        });
        setTempJoursDisponibles(newJours);
    };
    const handleRemoveCreneau = (dateIndex, creneauIndex) => {
        const newJours = [...tempJoursDisponibles];
        newJours[dateIndex].creneaux.splice(creneauIndex, 1);
        setTempJoursDisponibles(newJours);
    };
    const handleUpdateCreneau = (dateIndex, creneauIndex, field, value) => {
        const newJours = [...tempJoursDisponibles];
        newJours[dateIndex].creneaux[creneauIndex][field] = value;
        setTempJoursDisponibles(newJours);
    };
    const handleSave = () => {
        // TODO: Appel API pour sauvegarder
        console.log('Sauvegarde des disponibilités:', {
            sessionId: selectedSession === null || selectedSession === void 0 ? void 0 : selectedSession.id,
            jours: tempJoursDisponibles
        });
        // Simulation de mise à jour locale
        if ((user === null || user === void 0 ? void 0 : user.id) && selectedSession) {
            const newDispo = {
                id: (disponibilite === null || disponibilite === void 0 ? void 0 : disponibilite.id) || Date.now(),
                professeurId: parseInt(user.id),
                sessionId: selectedSession.id,
                session: selectedSession,
                joursDisponibles: tempJoursDisponibles,
                dateMiseAJour: new Date()
            };
            setDisponibilite(newDispo);
        }
        setIsEditing(false);
    };
    if (sessionsOuvertes.length === 0) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto bg-white border border-gray-200 p-8 text-center", children: [_jsx(Calendar, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Aucune session ouverte" }), _jsx("p", { className: "text-gray-600", children: "Il n'y a actuellement aucune session de soutenance ouverte pour la saisie des disponibilit\u00E9s. Vous serez notifi\u00E9 par le d\u00E9partement lors de l'ouverture d'une session." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Disponibilit\u00E9s Jury" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Renseignez vos cr\u00E9neaux horaires pour les sessions de soutenance actives." })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(Badge, { variant: "success", children: "Session Ouverte" }) })] }) }), selectedSession && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3", children: [_jsx(Info, { className: "h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-blue-900", children: selectedSession.nom }), _jsx("p", { className: "text-sm text-blue-700 mt-1", children: "Veuillez indiquer vos disponibilit\u00E9s pour les jours suivants :" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-200 flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Planning de la session" }), !isEditing ? (_jsxs("button", { onClick: () => setIsEditing(true), className: "flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors", children: [_jsx(Clock, { className: "h-4 w-4" }), "Modifier mes disponibilit\u00E9s"] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setIsEditing(false), className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50", children: "Annuler" }), _jsxs("button", { onClick: handleSave, className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: [_jsx(Save, { className: "h-4 w-4" }), "Enregistrer"] })] }))] }), _jsx("div", { className: "divide-y divide-gray-200", children: selectedSession.joursSession.map((date, index) => {
                                        // Trouver les dispos pour ce jour
                                        // Si mode édition, on utilise tempJoursDisponibles, sinon disponibilite.joursDisponibles
                                        const jourData = isEditing
                                            ? tempJoursDisponibles[index]
                                            : disponibilite === null || disponibilite === void 0 ? void 0 : disponibilite.joursDisponibles.find(j => new Date(j.date).toDateString() === new Date(date).toDateString());
                                        const creneaux = (jourData === null || jourData === void 0 ? void 0 : jourData.creneaux) || [];
                                        return (_jsx("div", { className: "p-6 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-start gap-4", children: [_jsx("div", { className: "w-48 flex-shrink-0", children: _jsxs("div", { className: "flex items-center gap-2 text-gray-900 font-medium", children: [_jsx(Calendar, { className: "h-5 w-5 text-gray-500" }), _jsx("span", { className: "capitalize", children: formatDate(new Date(date)) })] }) }), _jsx("div", { className: "flex-1", children: isEditing ? (_jsxs("div", { className: "space-y-3", children: [creneaux.map((creneau, cIndex) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "time", value: creneau.heureDebut, onChange: (e) => handleUpdateCreneau(index, cIndex, 'heureDebut', e.target.value), className: "px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary" }), _jsx("span", { className: "text-gray-400", children: "\u00E0" }), _jsx("input", { type: "time", value: creneau.heureFin, onChange: (e) => handleUpdateCreneau(index, cIndex, 'heureFin', e.target.value), className: "px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary" }), _jsx("button", { onClick: () => handleRemoveCreneau(index, cIndex), className: "p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] }, cIndex))), _jsxs("button", { onClick: () => handleAddCreneau(index), className: "text-sm text-primary hover:text-primary-700 font-medium flex items-center gap-1", children: [_jsx(Plus, { className: "h-4 w-4" }), "Ajouter un cr\u00E9neau"] })] })) : (_jsx("div", { children: creneaux.length > 0 ? (_jsx("div", { className: "flex flex-wrap gap-2", children: creneaux.map((creneau, cIndex) => (_jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm border border-blue-100", children: [_jsx(Clock, { className: "h-3 w-3 mr-1.5" }), creneau.heureDebut, " - ", creneau.heureFin] }, cIndex))) })) : (_jsx("span", { className: "text-gray-400 text-sm italic", children: "Aucune disponibilit\u00E9 renseign\u00E9e" })) })) })] }) }, index));
                                    }) })] })] }))] }) }));
};
export default Disponibilites;
