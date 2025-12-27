import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Users, Download, Filter, Edit, Check, X, Eye, BarChart3, FileText, School, Mail, Calendar, Clock, Shuffle, Plus, CalendarDays, Timer, Building, ArrowUp, ArrowDown } from 'lucide-react';
// Mock du contexte d'authentification pour tester
const useAuth = () => ({
    user: {
        id: '1',
        name: 'Dr. Amadou Diop',
        email: 'chef.informatique@isimemo.edu.sn',
        department: 'Informatique',
        estChef: true
    }
});
// Données fictives des professeurs
const PROFESSEURS_DATA = [
    {
        id: 1,
        nom: "Diop",
        prenom: "Dr. Ahmed",
        email: "ahmed.diop@isi.edu.sn",
        grade: "Professeur Titulaire",
        gradeNiveau: 5,
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        disponible: true
    },
    {
        id: 2,
        nom: "Fall",
        prenom: "Dr. Ousmane",
        email: "ousmane.fall@isi.edu.sn",
        grade: "Professeur",
        gradeNiveau: 4,
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        disponible: true
    },
    {
        id: 3,
        nom: "Ndiaye",
        prenom: "Dr. Ibrahima",
        email: "ibrahima.ndiaye@isi.edu.sn",
        grade: "Maître de Conférences",
        gradeNiveau: 3,
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        disponible: true
    }
];
// Données fictives des étudiants
const ETUDIANTS_DATA = [
    {
        id: 1,
        nom: "Diallo",
        prenom: "Amadou",
        email: "amadou.diallo@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        encadrantId: 3,
        sessionChoisie: "septembre",
        memoire: {
            titre: "Système de gestion des étudiants avec IA",
            fichier: "memoire_diallo.pdf",
            etat: "soumis"
        }
    },
    {
        id: 2,
        nom: "Sarr",
        prenom: "Mariama",
        email: "mariama.sarr@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        encadrantId: 2,
        sessionChoisie: "septembre",
        memoire: {
            titre: "Machine Learning pour la détection de fraudes",
            fichier: "memoire_sarr.pdf",
            etat: "valide"
        }
    },
    {
        id: 3,
        nom: "Ba",
        prenom: "Moussa",
        email: "moussa.ba@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        encadrantId: 1,
        sessionChoisie: "septembre",
        memoire: {
            titre: "Application mobile de e-commerce",
            fichier: "memoire_ba.pdf",
            etat: "soumis"
        }
    },
    {
        id: 4,
        nom: "Kane",
        prenom: "Abdoulaye",
        email: "abdoulaye.kane@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        encadrantId: 1,
        sessionChoisie: "septembre",
        memoire: {
            titre: "Intelligence artificielle et vision",
            fichier: "memoire_kane.pdf",
            etat: "valide"
        }
    },
    {
        id: 5,
        nom: "Sow",
        prenom: "Fatou",
        email: "fatou.sow@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        encadrantId: 2,
        sessionChoisie: "septembre",
        memoire: {
            titre: "Réseaux de neurones profonds",
            fichier: "memoire_sow.pdf",
            etat: "valide"
        }
    }
];
// Données fictives des jurys
const JURYS_DATA = [
    {
        id: 1,
        nom: "Jury Informatique Master 2 - Session Septembre 2025",
        type: "master",
        specialite: "Informatique",
        department: "Informatique",
        session: "septembre",
        anneeAcademique: "2024-2025",
        membres: [
            { professeur: PROFESSEURS_DATA[0], role: "president" },
            { professeur: PROFESSEURS_DATA[1], role: "rapporteur" },
            { professeur: PROFESSEURS_DATA[2], role: "examinateur" }
        ],
        etudiants: ETUDIANTS_DATA,
        dateCreation: "15/01/2025",
        statut: "actif",
        generationAuto: true
    }
];
// Données fictives des salles
const SALLES_DATA = [
    {
        id: 1,
        nom: "Amphithéâtre A",
        capacite: 50,
        equipements: ["Projecteur", "Micro", "Tableau", "Climatisation"],
        disponible: true
    },
    {
        id: 2,
        nom: "Salle 101",
        capacite: 30,
        equipements: ["Projecteur", "Tableau", "Climatisation"],
        disponible: true
    },
    {
        id: 3,
        nom: "Salle 102",
        capacite: 25,
        equipements: ["Projecteur", "Tableau"],
        disponible: true
    },
    {
        id: 4,
        nom: "Salle de Conférence",
        capacite: 40,
        equipements: ["Projecteur", "Micro", "Tableau", "Climatisation", "Visio"],
        disponible: true
    }
];
// Créneaux prédéfinis
const CRENEAUX_PREDEFINIS = [
    { id: 1, nom: "Créneau 1", heureDebut: "08:00", heureFin: "12:00" },
    { id: 2, nom: "Pause déjeuner", heureDebut: "12:00", heureFin: "14:00" },
    { id: 3, nom: "Créneau 2", heureDebut: "14:00", heureFin: "18:00" }
];
// Données fictives des soutenances de jury
const SOUTENANCES_DATA = [
    {
        id: 1,
        jury: JURYS_DATA[0],
        date: "2025-02-15",
        salle: "Amphithéâtre A",
        creneaux: [CRENEAUX_PREDEFINIS[0], CRENEAUX_PREDEFINIS[2]], // Créneau 1 et Créneau 2
        ordrePassage: [
            { etudiantId: 1, ordre: 1, creneauId: 1 },
            { etudiantId: 2, ordre: 2, creneauId: 1 },
            { etudiantId: 3, ordre: 3, creneauId: 3 },
            { etudiantId: 4, ordre: 4, creneauId: 3 },
            { etudiantId: 5, ordre: 5, creneauId: 3 }
        ],
        statut: "planifiee",
        observations: "Session de septembre - 5 étudiants à faire soutenir",
        dateCreation: "20/01/2025"
    }
];
// Composants UI réutilisables avec style navy
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        planifiee: "bg-blue-50 text-blue-700 border border-blue-200",
        en_cours: "bg-orange-50 text-orange-700 border border-orange-200",
        terminee: "bg-green-50 text-green-700 border border-green-200",
        reportee: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        annulee: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        auto: "bg-purple-50 text-purple-700 border border-purple-200",
        session: "bg-blue-50 text-blue-700 border border-blue-200",
        mention: "bg-indigo-50 text-indigo-700 border border-indigo-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`, children: children }));
};
// Modal pour afficher les détails d'une soutenance de jury
const SoutenanceDetailsModal = ({ soutenance, isOpen, onClose }) => {
    if (!isOpen || !soutenance)
        return null;
    const getStatusLabel = (statut) => {
        switch (statut) {
            case 'planifiee': return 'Planifiée';
            case 'en_cours': return 'En cours';
            case 'terminee': return 'Terminée';
            case 'reportee': return 'Reportée';
            case 'annulee': return 'Annulée';
            default: return statut;
        }
    };
    const getRoleLabel = (role) => {
        switch (role) {
            case 'president': return 'Président';
            case 'rapporteur': return 'Rapporteur';
            case 'examinateur': return 'Examinateur';
            default: return role;
        }
    };
    const getEtudiantById = (etudiantId) => {
        return soutenance.jury.etudiants.find(e => e.id === etudiantId);
    };
    const getCreneauById = (creneauId) => {
        return soutenance.creneaux.find(c => c.id === creneauId);
    };
    // Grouper les étudiants par créneau
    const etudiantsParCreneau = soutenance.creneaux.map(creneau => {
        const etudiantsDuCreneau = soutenance.ordrePassage
            .filter(ordre => ordre.creneauId === creneau.id)
            .sort((a, b) => a.ordre - b.ordre)
            .map(ordre => (Object.assign(Object.assign({}, ordre), { etudiant: getEtudiantById(ordre.etudiantId) })));
        return {
            creneau,
            etudiants: etudiantsDuCreneau
        };
    });
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["Soutenance - ", soutenance.jury.nom] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: soutenance.statut, children: getStatusLabel(soutenance.statut) }), _jsx(Badge, { variant: "primary", children: soutenance.jury.type }), _jsxs(Badge, { variant: "session", children: ["Session ", soutenance.jury.session] })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400 mr-2" }), new Date(soutenance.date).toLocaleDateString('fr-FR')] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Salle" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Building, { className: "h-4 w-4 text-gray-400 mr-2" }), soutenance.salle] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Nombre d'\u00E9tudiants" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Users, { className: "h-4 w-4 text-gray-400 mr-2" }), soutenance.jury.etudiants.length, " \u00E9tudiants"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Cr\u00E9neaux utilis\u00E9s" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-400 mr-2" }), soutenance.creneaux.length, " cr\u00E9neaux"] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Membres du jury" }), _jsx("div", { className: "space-y-3", children: soutenance.jury.membres.map((membre, index) => (_jsxs("div", { className: "border border-gray-200 p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(Badge, { variant: "primary", children: getRoleLabel(membre.role) }), _jsx(Badge, { variant: "success", children: membre.professeur.grade })] }), _jsxs("p", { className: "text-gray-900 font-medium", children: [membre.professeur.prenom, " ", membre.professeur.nom] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(Mail, { className: "h-3 w-3 mr-1" }), membre.professeur.email] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(School, { className: "h-3 w-3 mr-1" }), membre.professeur.institution] })] }, index))) })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Planning et ordre de passage" }), _jsx("div", { className: "space-y-4", children: etudiantsParCreneau.map((creneauData, index) => (_jsxs("div", { className: "border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h4", { className: "font-medium text-gray-900 flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-navy mr-2" }), creneauData.creneau.nom] }), _jsxs(Badge, { variant: "info", children: [creneauData.creneau.heureDebut, " - ", creneauData.creneau.heureFin] })] }), creneauData.etudiants.length > 0 ? (_jsx("div", { className: "space-y-2", children: creneauData.etudiants.map((ordreData) => {
                                            var _a, _b, _c, _d, _e, _f;
                                            return (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-3 border border-gray-200", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3", children: ordreData.ordre }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [(_a = ordreData.etudiant) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = ordreData.etudiant) === null || _b === void 0 ? void 0 : _b.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: (_d = (_c = ordreData.etudiant) === null || _c === void 0 ? void 0 : _c.memoire) === null || _d === void 0 ? void 0 : _d.titre })] })] }), _jsx(Badge, { variant: "success", children: (_f = (_e = ordreData.etudiant) === null || _e === void 0 ? void 0 : _e.memoire) === null || _f === void 0 ? void 0 : _f.etat })] }, ordreData.etudiantId));
                                        }) })) : (_jsx("p", { className: "text-sm text-gray-500 italic", children: "Aucun \u00E9tudiant assign\u00E9 \u00E0 ce cr\u00E9neau" }))] }, creneauData.creneau.id))) })] }), soutenance.observations && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Observations" }), _jsx("div", { className: "bg-gray-50 border border-gray-200 p-4", children: _jsx("p", { className: "text-gray-900", children: soutenance.observations }) })] })), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Modal pour planifier/modifier une soutenance de jury
const PlanifierSoutenanceModal = ({ isOpen, onClose, onSave, jurys, salles, soutenanceToEdit }) => {
    const [formData, setFormData] = useState({
        juryId: '',
        date: '',
        salle: '',
        observations: ''
    });
    const [selectedJury, setSelectedJury] = useState(null);
    const [creneauxSelectionnes, setCreneauxSelectionnes] = useState([]);
    const [ordrePassage, setOrdrePassage] = useState([]);
    const isEditing = Boolean(soutenanceToEdit);
    React.useEffect(() => {
        if (soutenanceToEdit) {
            setFormData({
                juryId: soutenanceToEdit.jury.id.toString(),
                date: soutenanceToEdit.date,
                salle: soutenanceToEdit.salle,
                observations: soutenanceToEdit.observations || ''
            });
            setSelectedJury(soutenanceToEdit.jury);
            setCreneauxSelectionnes(soutenanceToEdit.creneaux);
            setOrdrePassage(soutenanceToEdit.ordrePassage);
        }
        else {
            setFormData({
                juryId: '',
                date: '',
                salle: '',
                observations: ''
            });
            setSelectedJury(null);
            setCreneauxSelectionnes([]);
            setOrdrePassage([]);
        }
    }, [soutenanceToEdit]);
    const handleJuryChange = (juryId) => {
        const jury = jurys.find(j => j.id.toString() === juryId);
        setSelectedJury(jury || null);
        setFormData(prev => (Object.assign(Object.assign({}, prev), { juryId })));
        // Réinitialiser les créneaux et l'ordre quand on change de jury
        if (jury && !isEditing) {
            setCreneauxSelectionnes([]);
            setOrdrePassage([]);
        }
    };
    const handleCreneauToggle = (creneau) => {
        setCreneauxSelectionnes(prev => {
            const exists = prev.find(c => c.id === creneau.id);
            if (exists) {
                // Retirer le créneau et nettoyer l'ordre de passage associé
                setOrdrePassage(prevOrdre => prevOrdre.filter(o => o.creneauId !== creneau.id));
                return prev.filter(c => c.id !== creneau.id);
            }
            else {
                return [...prev, creneau];
            }
        });
    };
    // Remplacer la fonction genererCreneauxAuto par la version Tailwind-friendly et sans pause déjeuner :
    const genererCreneauxAuto = () => {
        if (!selectedJury)
            return;
        const nombreEtudiants = selectedJury.etudiants.length;
        const nouveauxCreneaux = [];
        let heure = 8;
        let minute = 0;
        for (let i = 0; i < nombreEtudiants; i++) {
            const heureDebut = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            minute += 30;
            if (minute >= 60) {
                heure += 1;
                minute = 0;
            }
            heure += 1;
            const heureFin = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            nouveauxCreneaux.push({
                id: Date.now() + i,
                nom: `Créneau ${i + 1}`,
                heureDebut,
                heureFin
            });
        }
        setCreneauxSelectionnes(nouveauxCreneaux);
    };
    const deplacerEtudiant = (etudiantId, direction) => {
        setOrdrePassage(prev => {
            const currentIndex = prev.findIndex(o => o.etudiantId === etudiantId);
            if (currentIndex === -1)
                return prev;
            const newOrder = [...prev];
            const current = newOrder[currentIndex];
            if (direction === 'up' && currentIndex > 0) {
                const previous = newOrder[currentIndex - 1];
                // Échanger les ordres
                const tempOrdre = current.ordre;
                current.ordre = previous.ordre;
                previous.ordre = tempOrdre;
                // Réorganiser le tableau
                newOrder[currentIndex] = previous;
                newOrder[currentIndex - 1] = current;
            }
            else if (direction === 'down' && currentIndex < newOrder.length - 1) {
                const next = newOrder[currentIndex + 1];
                // Échanger les ordres
                const tempOrdre = current.ordre;
                current.ordre = next.ordre;
                next.ordre = tempOrdre;
                // Réorganiser le tableau
                newOrder[currentIndex] = next;
                newOrder[currentIndex + 1] = current;
            }
            return newOrder;
        });
    };
    const changerCreneauEtudiant = (etudiantId, nouveauCreneauId) => {
        setOrdrePassage(prev => prev.map(ordre => ordre.etudiantId === etudiantId
            ? Object.assign(Object.assign({}, ordre), { creneauId: nouveauCreneauId }) : ordre));
    };
    const handleSubmit = () => {
        if (!formData.juryId || !formData.date || !formData.salle) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        if (creneauxSelectionnes.length === 0) {
            alert('Veuillez sélectionner au moins un créneau');
            return;
        }
        if (ordrePassage.length === 0) {
            alert('Veuillez définir l\'ordre de passage des étudiants');
            return;
        }
        const jury = jurys.find(j => j.id.toString() === formData.juryId);
        if (!jury) {
            alert('Jury invalide');
            return;
        }
        const soutenanceData = Object.assign(Object.assign({}, formData), { jury, creneaux: creneauxSelectionnes, ordrePassage, statut: 'planifiee' });
        onSave(soutenanceData);
        onClose();
    };
    if (!isOpen)
        return null;
    // Grouper les étudiants par créneau pour l'affichage
    const etudiantsParCreneau = creneauxSelectionnes.map(creneau => {
        const etudiantsDuCreneau = ordrePassage
            .filter(ordre => ordre.creneauId === creneau.id)
            .sort((a, b) => a.ordre - b.ordre)
            .map(ordre => (Object.assign(Object.assign({}, ordre), { etudiant: selectedJury === null || selectedJury === void 0 ? void 0 : selectedJury.etudiants.find(e => e.id === ordre.etudiantId) })));
        return {
            creneau,
            etudiants: etudiantsDuCreneau
        };
    });
    const creneauxActifs = creneauxSelectionnes.filter(c => c.nom !== "Pause déjeuner");
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: isEditing ? 'Modifier la soutenance de jury' : 'Planifier une soutenance de jury' }), _jsx("p", { className: "text-sm text-gray-500", children: isEditing ? 'Modifiez les détails de la soutenance' : 'Organisez une nouvelle soutenance pour un jury complet' })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Jury *" }), _jsxs("select", { value: formData.juryId, onChange: (e) => handleJuryChange(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", disabled: isEditing, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un jury" }), jurys.filter(j => j.statut === 'actif').map(jury => (_jsxs("option", { value: jury.id, children: [jury.nom, " (", jury.etudiants.length, " \u00E9tudiants)"] }, jury.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date *" }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { date: e.target.value }))), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Salle *" }), _jsxs("select", { value: formData.salle, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { salle: e.target.value }))), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "", children: "S\u00E9lectionner une salle" }), salles.filter(s => s.disponible).map(salle => (_jsxs("option", { value: salle.nom, children: [salle.nom, " (Capacit\u00E9: ", salle.capacite, ")"] }, salle.id)))] })] })] }), selectedJury && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-2", children: "Jury s\u00E9lectionn\u00E9 :" }), _jsxs("div", { className: "text-sm text-blue-800 space-y-1", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nom :" }), " ", selectedJury.nom] }), _jsxs("p", { children: [_jsx("strong", { children: "Type :" }), " ", selectedJury.type] }), _jsxs("p", { children: [_jsx("strong", { children: "Session :" }), " ", selectedJury.session] }), _jsxs("p", { children: [_jsx("strong", { children: "\u00C9tudiants :" }), " ", selectedJury.etudiants.length] }), _jsxs("p", { children: [_jsx("strong", { children: "Membres :" }), " ", selectedJury.membres.map(m => m.professeur.prenom + ' ' + m.professeur.nom).join(', ')] })] })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Cr\u00E9neaux disponibles" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: CRENEAUX_PREDEFINIS.map(creneau => {
                                        const isSelected = creneauxSelectionnes.some(c => c.id === creneau.id);
                                        const isPause = creneau.nom === "Pause déjeuner";
                                        return (_jsxs("div", { className: `
                      border p-4 cursor-pointer transition-colors
                      ${isPause
                                                ? 'bg-orange-50 border-orange-200 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-navy bg-opacity-10 border-navy'
                                                    : 'border-gray-300 hover:border-navy'}
                    `, onClick: () => !isPause && handleCreneauToggle(creneau), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: creneau.nom }), !isPause && (_jsx("div", { className: `
                          w-4 h-4 border-2 rounded
                          ${isSelected ? 'bg-navy border-navy' : 'border-gray-300'}
                        `, children: isSelected && _jsx(Check, { className: "h-3 w-3 text-white" }) }))] }), _jsxs("p", { className: "text-sm text-gray-600", children: [creneau.heureDebut, " - ", creneau.heureFin] }), isPause && (_jsx(Badge, { variant: "warning", className: "mt-2", children: "Pause" }))] }, creneau.id));
                                    }) })] }), selectedJury && creneauxSelectionnes.length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Ordre de passage des \u00E9tudiants" }), _jsx(SimpleButton, { variant: "success", onClick: genererCreneauxAuto, icon: _jsx(Shuffle, { className: "h-4 w-4" }), children: "G\u00E9n\u00E9rer automatiquement" })] }), ordrePassage.length === 0 ? (_jsxs("div", { className: "border border-gray-200 p-8 text-center", children: [_jsx(Users, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "Aucun ordre d\u00E9fini" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Organisez l'ordre de passage des \u00E9tudiants" }), _jsxs(SimpleButton, { variant: "primary", onClick: genererCreneauxAuto, icon: _jsx(Shuffle, { className: "h-4 w-4" }), children: ["G\u00E9n\u00E9rer automatiquement l'ordre pour ", selectedJury.etudiants.length, " \u00E9tudiants"] })] })) : (_jsx("div", { className: "space-y-4", children: etudiantsParCreneau.map((creneauData) => (_jsxs("div", { className: "border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h4", { className: "font-medium text-gray-900 flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-navy mr-2" }), creneauData.creneau.nom] }), _jsxs(Badge, { variant: "info", children: [creneauData.creneau.heureDebut, " - ", creneauData.creneau.heureFin] })] }), creneauData.etudiants.length > 0 ? (_jsx("div", { className: "space-y-2", children: creneauData.etudiants.map((ordreData, index) => {
                                                    var _a, _b, _c, _d;
                                                    return (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-3 border border-gray-200", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3", children: ordreData.ordre }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [(_a = ordreData.etudiant) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = ordreData.etudiant) === null || _b === void 0 ? void 0 : _b.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: (_d = (_c = ordreData.etudiant) === null || _c === void 0 ? void 0 : _c.memoire) === null || _d === void 0 ? void 0 : _d.titre })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("select", { value: ordreData.creneauId, onChange: (e) => changerCreneauEtudiant(ordreData.etudiantId, parseInt(e.target.value)), className: "text-sm px-2 py-1 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: creneauxActifs.map(creneau => (_jsx("option", { value: creneau.id, children: creneau.nom }, creneau.id))) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("button", { onClick: () => deplacerEtudiant(ordreData.etudiantId, 'up'), disabled: index === 0, className: "p-1 text-gray-600 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(ArrowUp, { className: "h-3 w-3" }) }), _jsx("button", { onClick: () => deplacerEtudiant(ordreData.etudiantId, 'down'), disabled: index === creneauData.etudiants.length - 1, className: "p-1 text-gray-600 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(ArrowDown, { className: "h-3 w-3" }) })] })] })] }, ordreData.etudiantId));
                                                }) })) : (_jsx("p", { className: "text-sm text-gray-500 italic", children: "Aucun \u00E9tudiant assign\u00E9 \u00E0 ce cr\u00E9neau" }))] }, creneauData.creneau.id))) }))] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Observations" }), _jsx("textarea", { value: formData.observations, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { observations: e.target.value }))), placeholder: "Observations particuli\u00E8res sur cette session de soutenances...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleSubmit, icon: _jsx(Calendar, { className: "h-4 w-4" }), children: isEditing ? 'Modifier' : 'Planifier' })] })] }) }));
};
// Onglet Liste des soutenances de jury
const SoutenanceListTab = ({ soutenances, onViewDetails, onEditSoutenance, onPlanifierSoutenance, onGenerateAll }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const filteredSoutenances = soutenances.filter(soutenance => {
        const matchesSearch = soutenance.jury.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            soutenance.salle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            soutenance.jury.etudiants.some(e => e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.prenom.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || soutenance.statut === statusFilter;
        const matchesDate = !dateFilter || soutenance.date === dateFilter;
        return matchesSearch && matchesStatus && matchesDate;
    });
    const getStatusLabel = (statut) => {
        switch (statut) {
            case 'planifiee': return 'Planifiée';
            case 'en_cours': return 'En cours';
            case 'terminee': return 'Terminée';
            case 'reportee': return 'Reportée';
            case 'annulee': return 'Annulée';
            default: return statut;
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "success", icon: _jsx(Shuffle, { className: "h-4 w-4" }), onClick: onGenerateAll, children: "G\u00E9n\u00E9rer toutes les soutenances" }), _jsx(SimpleButton, { variant: "primary", icon: _jsx(Plus, { className: "h-4 w-4" }), onClick: onPlanifierSoutenance, children: "Planifier une soutenance de jury" }), _jsx(SimpleButton, { variant: "secondary", icon: _jsx(Download, { className: "h-4 w-4" }), children: "Exporter le planning" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtres et recherche" }), _jsxs(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-4 w-4" }), children: [showFilters ? 'Masquer' : 'Afficher', " les filtres"] })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher une soutenance de jury...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "overflow-hidden", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Statut" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "planifiee", children: "Planifi\u00E9e" }), _jsx("option", { value: "en_cours", children: "En cours" }), _jsx("option", { value: "terminee", children: "Termin\u00E9e" }), _jsx("option", { value: "reportee", children: "Report\u00E9e" }), _jsx("option", { value: "annulee", children: "Annul\u00E9e" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date" }), _jsx("input", { type: "date", value: dateFilter, onChange: (e) => setDateFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] })] }) })) })] }), filteredSoutenances.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-8 text-center", children: [_jsx(CalendarDays, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-600 mb-2", children: "Aucune soutenance trouv\u00E9e" }), _jsx("p", { className: "text-gray-500", children: "Essayez de modifier vos crit\u00E8res de recherche ou filtres." })] })) : (_jsx("div", { className: "bg-white border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Jury" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Salle" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiants" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cr\u00E9neaux" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredSoutenances.map((soutenance, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3", children: _jsx(Users, { className: "h-5 w-5 text-gray-600" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: soutenance.jury.nom.split(' - ')[0] }), _jsxs("div", { className: "text-sm text-gray-500", children: [soutenance.jury.type, " - ", soutenance.jury.session] })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-navy mr-2" }), _jsx("span", { className: "text-sm text-gray-900", children: new Date(soutenance.date).toLocaleDateString('fr-FR') })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Building, { className: "h-4 w-4 text-gray-400 mr-2" }), _jsx("span", { className: "text-sm text-gray-900", children: soutenance.salle })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "h-4 w-4 text-green-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: soutenance.jury.etudiants.length })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-blue-600 mr-1" }), _jsx("span", { className: "text-sm text-gray-900", children: soutenance.creneaux.length })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: soutenance.statut, children: getStatusLabel(soutenance.statut) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => onViewDetails(soutenance), className: "p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => onEditSoutenance(soutenance), className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, soutenance.id))) })] }) }) }))] }));
};
// Onglet Statistiques
const StatisticsTab = ({ soutenances }) => {
    const soutenancesTerminees = soutenances.filter(s => s.statut === 'terminee');
    const soutenancesPlanifiees = soutenances.filter(s => s.statut === 'planifiee');
    const totalEtudiants = soutenances.reduce((total, s) => total + s.jury.etudiants.length, 0);
    const totalCreneaux = soutenances.reduce((total, s) => total + s.creneaux.length, 0);
    const statsParStatut = ['planifiee', 'en_cours', 'terminee', 'reportee', 'annulee'].map(statut => {
        const soutenancesByStatut = soutenances.filter(s => s.statut === statut);
        return {
            name: statut.charAt(0).toUpperCase() + statut.slice(1),
            count: soutenancesByStatut.length
        };
    }).filter(stat => stat.count > 0);
    const statsParSalle = SALLES_DATA.map(salle => {
        const soutenancesBySalle = soutenances.filter(s => s.salle === salle.nom);
        return {
            name: salle.nom,
            count: soutenancesBySalle.length,
            capacite: salle.capacite
        };
    }).filter(stat => stat.count > 0);
    const prochaineSoutenance = soutenances
        .filter(s => s.statut === 'planifiee' && new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Soutenances Jurys", value: soutenances.length, icon: CalendarDays, color: "bg-navy-light text-navy" },
                    { title: "Planifiées", value: soutenancesPlanifiees.length, icon: Clock, color: "bg-blue-100 text-blue-600" },
                    { title: "Total Étudiants", value: totalEtudiants, icon: Users, color: "bg-green-100 text-green-600" },
                    { title: "Total Créneaux", value: totalCreneaux, icon: Timer, color: "bg-orange-100 text-orange-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), prochaineSoutenance && (_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Prochaine soutenance de jury" }), _jsx("div", { className: "bg-blue-50 border border-blue-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-900", children: prochaineSoutenance.jury.nom.split(' - ')[0] }), _jsxs("p", { className: "text-sm text-blue-800", children: [new Date(prochaineSoutenance.date).toLocaleDateString('fr-FR'), " - Salle: ", prochaineSoutenance.salle] }), _jsxs("p", { className: "text-sm text-blue-700", children: [prochaineSoutenance.jury.etudiants.length, " \u00E9tudiants - ", prochaineSoutenance.creneaux.length, " cr\u00E9neaux"] })] }), _jsx(Badge, { variant: "planifiee", children: "Planifi\u00E9e" })] }) })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par statut" }), _jsx("div", { className: "space-y-3", children: statsParStatut.map(stat => {
                                    const percentage = soutenances.length > 0 ? Math.round((stat.count / soutenances.length) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: stat.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-navy h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: stat.count })] })] }, stat.name));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Utilisation des salles" }), _jsx("div", { className: "space-y-3", children: statsParSalle.map(salle => {
                                    const maxCount = Math.max(...statsParSalle.map(s => s.count));
                                    const percentage = maxCount > 0 ? Math.round((salle.count / maxCount) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-gray-600", children: salle.name }), _jsxs("span", { className: "text-xs text-gray-500 ml-2", children: ["(Cap. ", salle.capacite, ")"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-green-500 h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: salle.count })] })] }, salle.name));
                                }) })] })] })] }));
};
// Composant principal
const SoutenanceChef = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedSoutenance, setSelectedSoutenance] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [soutenancesState, setSoutenancesState] = useState(SOUTENANCES_DATA);
    const [showPlanifierModal, setShowPlanifierModal] = useState(false);
    const [soutenanceToEdit, setSoutenanceToEdit] = useState(null);
    const { user } = useAuth();
    const openSoutenanceDetails = (soutenance) => {
        setSelectedSoutenance(soutenance);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedSoutenance(null);
        setIsModalOpen(false);
    };
    const handleEditSoutenance = (soutenance) => {
        setSoutenanceToEdit(soutenance);
        setShowPlanifierModal(true);
    };
    const handlePlanifierSoutenance = () => {
        setSoutenanceToEdit(null);
        setShowPlanifierModal(true);
    };
    const handleSaveSoutenance = (soutenanceData) => {
        if (soutenanceToEdit) {
            // Modification
            setSoutenancesState(prev => prev.map(s => s.id === soutenanceToEdit.id
                ? Object.assign(Object.assign(Object.assign({}, s), soutenanceData), { id: soutenanceToEdit.id }) : s));
            alert('Soutenance de jury modifiée avec succès !');
        }
        else {
            // Nouvelle soutenance de jury
            const nouvelleSoutenance = Object.assign(Object.assign({}, soutenanceData), { id: Math.max(...soutenancesState.map(s => s.id), 0) + 1, dateCreation: new Date().toLocaleDateString('fr-FR') });
            setSoutenancesState(prev => [...prev, nouvelleSoutenance]);
            alert('Soutenance de jury planifiée avec succès !');
        }
        setSoutenanceToEdit(null);
    };
    const handleGenerateAll = () => {
        // Simulation de génération automatique pour tous les jurys
        alert(`Génération automatique des soutenances en cours...\n\nCette fonctionnalité va :\n\n1. Analyser tous les jurys actifs\n2. Vérifier les créneaux de disponibilité des professeurs\n3. Trouver les salles disponibles\n4. Créer automatiquement les plannings pour chaque jury\n5. Assigner des créneaux optimaux pour chaque étudiant\n\nLe système respectera :\n- Les contraintes de disponibilité des membres du jury\n- La capacité des salles\n- Les sessions choisies par les étudiants\n- Une répartition équilibrée sur les créneaux disponibles`);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-light rounded-full p-3 mr-4", children: _jsx(CalendarDays, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des Soutenances" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["D\u00E9partement ", user.department, " - Organisez les soutenances par jury complet"] })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => setActiveTab('list'), icon: _jsx(FileText, { className: "h-4 w-4" }), children: "Soutenances de jury" }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'list' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(SoutenanceListTab, { soutenances: soutenancesState, onViewDetails: openSoutenanceDetails, onEditSoutenance: handleEditSoutenance, onPlanifierSoutenance: handlePlanifierSoutenance, onGenerateAll: handleGenerateAll }) })), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { soutenances: soutenancesState }) }))] })] }), _jsx(SoutenanceDetailsModal, { soutenance: selectedSoutenance, isOpen: isModalOpen, onClose: closeModal }), _jsx(PlanifierSoutenanceModal, { isOpen: showPlanifierModal, onClose: () => {
                        setShowPlanifierModal(false);
                        setSoutenanceToEdit(null);
                    }, onSave: handleSaveSoutenance, jurys: JURYS_DATA, salles: SALLES_DATA, soutenanceToEdit: soutenanceToEdit })] }) }));
};
// Définition des couleurs navy manquantes pour Tailwind
const additionalStyles = `
  .bg-navy { background-color: #1e293b; }
  .text-navy { color: #1e293b; }
  .border-navy { border-color: #1e293b; }
  .bg-navy-light { background-color: #e2e8f0; }
  .bg-navy-dark { background-color: #0f172a; }
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
  .hover\\:border-navy:hover { border-color: #1e293b; }
  .focus\\:border-navy:focus { border-color: #1e293b; }
  .focus\\:ring-navy:focus { --tw-ring-color: #1e293b; }
`;
// Injection des styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = additionalStyles;
    document.head.appendChild(styleElement);
}
export default SoutenanceChef;
