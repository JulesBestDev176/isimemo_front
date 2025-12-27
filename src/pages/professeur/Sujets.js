import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Plus, Eye, Calendar, Users, X, Target, Save, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// Données mockées
export const TOUS_LES_SUJETS = [
    {
        id: 1,
        titre: "Intelligence Artificielle pour la Détection de Fraudes",
        description: "Développement d'un système de détection de fraudes utilisant des algorithmes d'apprentissage automatique et de deep learning.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "IAGE"],
        nombreMaxEtudiants: 2,
        nombreEtudiantsActuels: 1,
        statut: "soumis",
        dateSoumission: "2024-09-15",
        anneeAcademique: "2024-2025",
        motsCles: ["IA", "Machine Learning", "Sécurité", "Détection"],
        prerequis: "Bonnes connaissances en Python, statistiques et algorithmes",
        objectifs: "Maîtriser les techniques de ML pour la sécurité informatique",
        dateCreation: "2024-09-10",
        dateModification: "2024-09-15",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois",
        etudiants: [
            {
                id: 1,
                nom: "Diallo",
                prenom: "Amadou",
                email: "amadou.diallo@isi.edu.sn",
                numeroEtudiant: "ETU2024001",
                dateAttribution: "2024-09-25",
                documentMemoire: {
                    id: 1,
                    titre: "Mémoire - Intelligence Artificielle pour la Détection de Fraudes",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-11-15",
                    tailleFichier: 2548793,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 2,
        titre: "Application Mobile de Gestion de Bibliothèque",
        description: "Conception et développement d'une application mobile cross-platform pour la gestion automatisée d'une bibliothèque universitaire.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "Multimedia"],
        nombreMaxEtudiants: 3,
        nombreEtudiantsActuels: 3,
        statut: "soumis",
        dateSoumission: "2024-10-01",
        dateApprobation: "2024-10-05",
        anneeAcademique: "2024-2025",
        motsCles: ["Mobile", "React Native", "Base de données", "UX/UI"],
        prerequis: "Connaissances en développement mobile et bases de données",
        objectifs: "Développer une solution mobile complète",
        dateCreation: "2024-09-25",
        dateModification: "2024-10-01",
        professeurId: 2,
        professeurNom: "Prof. Sophie Martin",
        etudiants: [
            {
                id: 2,
                nom: "Ndiaye",
                prenom: "Fatou",
                email: "fatou.ndiaye@isi.edu.sn",
                numeroEtudiant: "ETU2024002",
                dateAttribution: "2024-10-10",
                documentMemoire: {
                    id: 2,
                    titre: "Rapport de Projet - Application Mobile Bibliothèque",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2024-11-10",
                    tailleFichier: 1856234,
                    format: "pdf"
                }
            },
            {
                id: 3,
                nom: "Ba",
                prenom: "Ibrahima",
                email: "ibrahima.ba@isi.edu.sn",
                numeroEtudiant: "ETU2024003",
                dateAttribution: "2024-10-10",
                documentMemoire: {
                    id: 3,
                    titre: "Rapport de Projet - Application Mobile Bibliothèque",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-11-12",
                    tailleFichier: 1923456,
                    format: "pdf"
                }
            },
            {
                id: 4,
                nom: "Sarr",
                prenom: "Aissatou",
                email: "aissatou.sarr@isi.edu.sn",
                numeroEtudiant: "ETU2024004",
                dateAttribution: "2024-10-10",
                documentMemoire: {
                    id: 4,
                    titre: "Rapport de Projet - Application Mobile Bibliothèque",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2024-11-14",
                    tailleFichier: 1789123,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 3,
        titre: "Optimisation des Réseaux de Neurones pour IoT",
        description: "Recherche sur l'optimisation des architectures de réseaux de neurones pour les dispositifs IoT avec contraintes de ressources.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "IAGE", "GDA"],
        nombreMaxEtudiants: 1,
        nombreEtudiantsActuels: 1,
        statut: "soumis",
        dateSoumission: "2024-11-10",
        dateApprobation: "2024-11-15",
        anneeAcademique: "2024-2025",
        motsCles: ["IoT", "Réseaux de neurones", "Optimisation", "Edge Computing"],
        prerequis: "Solides bases en IA et programmation embarquée",
        objectifs: "Optimiser les performances des IA sur dispositifs contraints",
        dateCreation: "2024-11-05",
        dateModification: "2024-11-10",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois",
        etudiants: [
            {
                id: 5,
                nom: "Kane",
                prenom: "Moussa",
                email: "moussa.kane@isi.edu.sn",
                numeroEtudiant: "ETU2024005",
                dateAttribution: "2024-11-20",
                documentMemoire: {
                    id: 5,
                    titre: "Mémoire - Optimisation des Réseaux de Neurones pour IoT",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-12-10",
                    tailleFichier: 3124567,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 4,
        titre: "Stage en Cybersécurité - Audit de Sécurité",
        description: "Stage de 6 mois dans une entreprise spécialisée en cybersécurité pour réaliser des audits de sécurité et tests de pénétration.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL"],
        nombreMaxEtudiants: 1,
        nombreEtudiantsActuels: 1,
        statut: "soumis",
        dateSoumission: "2024-08-20",
        dateApprobation: "2024-08-25",
        anneeAcademique: "2024-2025",
        motsCles: ["Cybersécurité", "Audit", "Pentesting", "Entreprise"],
        prerequis: "Certification en sécurité informatique souhaitée",
        objectifs: "Acquérir une expérience professionnelle en cybersécurité",
        dateCreation: "2024-08-15",
        dateModification: "2024-08-20",
        professeurId: 3,
        professeurNom: "Prof. Jean Dupont",
        etudiants: [
            {
                id: 6,
                nom: "Thiam",
                prenom: "Awa",
                email: "awa.thiam@isi.edu.sn",
                numeroEtudiant: "ETU2024006",
                dateAttribution: "2024-09-01",
                documentMemoire: {
                    id: 6,
                    titre: "Rapport de Stage - Cybersécurité et Audit de Sécurité",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2024-12-05",
                    tailleFichier: 4289123,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 5,
        titre: "Blockchain pour la Traçabilité Alimentaire",
        description: "Conception d'une solution blockchain pour assurer la traçabilité des produits alimentaires de la production à la consommation.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["IAGE", "GDA"],
        nombreMaxEtudiants: 2,
        nombreEtudiantsActuels: 0,
        statut: "brouillon",
        anneeAcademique: "2024-2025",
        motsCles: ["Blockchain", "Traçabilité", "Smart Contracts", "Supply Chain"],
        prerequis: "Connaissances en blockchain et cryptographie",
        objectifs: "Maîtriser la technologie blockchain appliquée à l'industrie",
        dateCreation: "2024-11-15",
        dateModification: "2024-11-18",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois"
    },
    // Sujets des années précédentes (Historique)
    {
        id: 6,
        titre: "Système de Recommandation E-Commerce",
        description: "Développement d'un système de recommandation basé sur le filtrage collaboratif pour une plateforme e-commerce.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "IAGE"],
        nombreMaxEtudiants: 2,
        nombreEtudiantsActuels: 2,
        statut: "soumis",
        dateSoumission: "2023-09-10",
        dateApprobation: "2023-09-15",
        anneeAcademique: "2023-2024",
        motsCles: ["Recommandation", "E-commerce", "Machine Learning", "Filtrage collaboratif"],
        prerequis: "Connaissances en algorithmes et bases de données",
        objectifs: "Développer un système de recommandation performant",
        dateCreation: "2023-09-05",
        dateModification: "2023-09-10",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois",
        etudiants: [
            {
                id: 7,
                nom: "Fall",
                prenom: "Moustapha",
                email: "moustapha.fall@isi.edu.sn",
                numeroEtudiant: "ETU2023001",
                dateAttribution: "2023-09-20",
                documentMemoire: {
                    id: 7,
                    titre: "Mémoire - Système de Recommandation E-Commerce",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-06-10",
                    tailleFichier: 2856123,
                    format: "pdf"
                }
            },
            {
                id: 8,
                nom: "Seck",
                prenom: "Aminata",
                email: "aminata.seck@isi.edu.sn",
                numeroEtudiant: "ETU2023002",
                dateAttribution: "2023-09-20",
                documentMemoire: {
                    id: 8,
                    titre: "Mémoire - Système de Recommandation E-Commerce",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2024-06-10",
                    tailleFichier: 2745891,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 7,
        titre: "Application de Gestion Hospitalière",
        description: "Conception et développement d'un système de gestion hospitalière incluant la gestion des patients, rendez-vous et dossiers médicaux.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "GDA"],
        nombreMaxEtudiants: 3,
        nombreEtudiantsActuels: 1,
        statut: "soumis",
        dateSoumission: "2023-10-01",
        dateApprobation: "2023-10-08",
        anneeAcademique: "2023-2024",
        motsCles: ["Santé", "Gestion", "Base de données", "Sécurité"],
        prerequis: "Maîtrise des bases de données et développement web",
        objectifs: "Développer une application de gestion complète et sécurisée",
        dateCreation: "2023-09-25",
        dateModification: "2023-10-01",
        professeurId: 2,
        professeurNom: "Prof. Sophie Martin",
        etudiants: [
            {
                id: 9,
                nom: "Cisse",
                prenom: "Omar",
                email: "omar.cisse@isi.edu.sn",
                numeroEtudiant: "ETU2023003",
                dateAttribution: "2023-10-15",
                documentMemoire: {
                    id: 9,
                    titre: "Mémoire - Application de Gestion Hospitalière",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-06-15",
                    tailleFichier: 3245678,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 8,
        titre: "Plateforme d'Apprentissage en Ligne",
        description: "Développement d'une plateforme LMS (Learning Management System) avec fonctionnalités de suivi des apprenants et gestion de contenu.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "Multimedia"],
        nombreMaxEtudiants: 2,
        nombreEtudiantsActuels: 2,
        statut: "soumis",
        dateSoumission: "2022-09-15",
        dateApprobation: "2022-09-20",
        anneeAcademique: "2022-2023",
        motsCles: ["E-learning", "LMS", "Education", "Web"],
        prerequis: "Développement web fullstack",
        objectifs: "Créer une plateforme d'apprentissage complète et interactive",
        dateCreation: "2022-09-10",
        dateModification: "2022-09-15",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois",
        etudiants: [
            {
                id: 10,
                nom: "Gueye",
                prenom: "Cheikh",
                email: "cheikh.gueye@isi.edu.sn",
                numeroEtudiant: "ETU2022001",
                dateAttribution: "2022-09-25",
                documentMemoire: {
                    id: 10,
                    titre: "Mémoire - Plateforme d'Apprentissage en Ligne",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2023-06-10",
                    tailleFichier: 2934567,
                    format: "pdf"
                }
            },
            {
                id: 11,
                nom: "Ly",
                prenom: "Mariama",
                email: "mariama.ly@isi.edu.sn",
                numeroEtudiant: "ETU2022002",
                dateAttribution: "2022-09-25",
                documentMemoire: {
                    id: 11,
                    titre: "Mémoire - Plateforme d'Apprentissage en Ligne",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2023-06-10",
                    tailleFichier: 3012345,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 9,
        titre: "Système de Détection d'Intrusion Réseau",
        description: "Conception d'un système IDS (Intrusion Detection System) utilisant l'apprentissage automatique pour détecter les comportements anormaux dans le trafic réseau.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "IAGE"],
        nombreMaxEtudiants: 2,
        nombreEtudiantsActuels: 2,
        statut: "soumis",
        dateSoumission: "2023-08-25",
        dateApprobation: "2023-09-01",
        anneeAcademique: "2023-2024",
        motsCles: ["Cybersécurité", "IDS", "Machine Learning", "Réseau"],
        prerequis: "Connaissances en réseaux informatiques et sécurité",
        objectifs: "Maîtriser les techniques de détection d'intrusion modernes",
        dateCreation: "2023-08-20",
        dateModification: "2023-08-25",
        professeurId: 1,
        professeurNom: "Prof. Martin Dubois",
        etudiants: [
            {
                id: 12,
                nom: "Ndoye",
                prenom: "Salif",
                email: "salif.ndoye@isi.edu.sn",
                numeroEtudiant: "ETU2023004",
                dateAttribution: "2023-09-10",
                documentMemoire: {
                    id: 12,
                    titre: "Mémoire - Système de Détection d'Intrusion Réseau",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2024-06-05",
                    tailleFichier: 3456789,
                    format: "pdf"
                }
            },
            {
                id: 13,
                nom: "Faye",
                prenom: "Khady",
                email: "khady.faye@isi.edu.sn",
                numeroEtudiant: "ETU2023005",
                dateAttribution: "2023-09-10",
                documentMemoire: {
                    id: 13,
                    titre: "Mémoire - Système de Détection d'Intrusion Réseau",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2024-06-05",
                    tailleFichier: 3398765,
                    format: "pdf"
                }
            }
        ]
    },
    {
        id: 10,
        titre: "Application Mobile de Suivi Agricole",
        description: "Développement d'une application mobile pour aider les agriculteurs à suivre leurs cultures, prévoir les rendements et optimiser l'irrigation grâce à l'IoT.",
        type: "memoire",
        niveau: "Licence 3",
        departement: "Génie Informatique",
        filieres: ["GL", "Multimedia", "GDA"],
        nombreMaxEtudiants: 3,
        nombreEtudiantsActuels: 3,
        statut: "soumis",
        dateSoumission: "2022-10-05",
        dateApprobation: "2022-10-10",
        anneeAcademique: "2022-2023",
        motsCles: ["Agriculture", "IoT", "Mobile", "Smart Farming"],
        prerequis: "Développement mobile et connaissances en IoT",
        objectifs: "Créer une solution innovante pour l'agriculture intelligente",
        dateCreation: "2022-10-01",
        dateModification: "2022-10-05",
        professeurId: 2,
        professeurNom: "Prof. Sophie Martin",
        etudiants: [
            {
                id: 14,
                nom: "Sow",
                prenom: "Modou",
                email: "modou.sow@isi.edu.sn",
                numeroEtudiant: "ETU2022003",
                dateAttribution: "2022-10-15",
                documentMemoire: {
                    id: 14,
                    titre: "Mémoire - Application Mobile de Suivi Agricole",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2023-06-08",
                    tailleFichier: 2789456,
                    format: "pdf"
                }
            },
            {
                id: 15,
                nom: "Mbaye",
                prenom: "Sokhna",
                email: "sokhna.mbaye@isi.edu.sn",
                numeroEtudiant: "ETU2022004",
                dateAttribution: "2022-10-15",
                documentMemoire: {
                    id: 15,
                    titre: "Mémoire - Application Mobile de Suivi Agricole",
                    cheminFichier: "/assets/documents/doc.pdf",
                    dateDepot: "2023-06-08",
                    tailleFichier: 2845123,
                    format: "pdf"
                }
            },
            {
                id: 16,
                nom: "Diouf",
                prenom: "Malick",
                email: "malick.diouf@isi.edu.sn",
                numeroEtudiant: "ETU2022005",
                dateAttribution: "2022-10-15",
                documentMemoire: {
                    id: 16,
                    titre: "Mémoire - Application Mobile de Suivi Agricole",
                    cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
                    dateDepot: "2023-06-08",
                    tailleFichier: 2912678,
                    format: "pdf"
                }
            }
        ]
    }
];
const FILIERES = ["GL", "Multimedia", "IAGE", "GDA"];
// Composants utilitaires
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        approuve: "bg-blue-50 text-blue-700 border border-blue-200",
        soumis: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        brouillon: "bg-gray-50 text-gray-700 border border-gray-200",
        rejete: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        primary: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`, children: children }));
};
const Button = ({ children, onClick, variant = 'primary', icon, disabled = false, type = 'button' }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Modal pour voir les détails d'un sujet
const ModalDetailsSujet = ({ sujet, isOpen, onClose }) => {
    if (!isOpen || !sujet)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: sujet.titre }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: sujet.statut, children: sujet.statut === 'soumis' ? 'Soumis' :
                                                    sujet.statut === 'brouillon' ? 'Brouillon' : 'Rejeté' }), _jsx(Badge, { variant: "primary", children: sujet.niveau }), sujet.filieres && sujet.filieres.length > 0 && (_jsx(_Fragment, { children: sujet.filieres.map((filiere, index) => (_jsx(Badge, { variant: "info", children: filiere }, index))) }))] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Description" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: sujet.description })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Objectifs" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: sujet.objectifs })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Pr\u00E9requis" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: sujet.prerequis })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Mots-cl\u00E9s" }), _jsx("div", { className: "flex flex-wrap gap-2", children: sujet.motsCles.map((mot, index) => (_jsx("span", { className: "inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700", children: mot }, index))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "D\u00E9partement" }), _jsx("p", { className: "text-gray-900", children: sujet.departement })] }), sujet.filieres && sujet.filieres.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Fili\u00E8res" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: sujet.filieres.map((filiere, index) => (_jsx(Badge, { variant: "info", className: "text-xs", children: filiere }, index))) })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Professeur" }), _jsx("p", { className: "text-gray-900", children: sujet.professeurNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Ann\u00E9e acad\u00E9mique" }), _jsx("p", { className: "text-gray-900", children: sujet.anneeAcademique })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-gray-900", children: sujet.dateCreation })] }), sujet.dateSoumission && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de soumission" }), _jsx("p", { className: "text-gray-900", children: sujet.dateSoumission })] })), sujet.dateApprobation && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date d'approbation" }), _jsx("p", { className: "text-gray-900", children: sujet.dateApprobation })] }))] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Utilisations" }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-blue-600 mb-2", children: sujet.nombreEtudiantsActuels }), _jsx("p", { className: "text-sm text-blue-700", children: "Nombre d'utilisations" })] })] })] })] }), sujet.etudiants && sujet.etudiants.length > 0 && (_jsxs("div", { className: "mt-8 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tudiants ayant utilis\u00E9 ce sujet" }), _jsx("div", { className: "space-y-4", children: sujet.etudiants.map((etudiant) => (_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start space-x-3 flex-1", children: [_jsxs("div", { className: "w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-semibold", children: [etudiant.prenom[0], etudiant.nom[0]] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: [etudiant.prenom, " ", etudiant.nom] }), _jsx(Badge, { variant: "info", className: "text-xs", children: etudiant.numeroEtudiant })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: etudiant.email }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Attribu\u00E9 le ", etudiant.dateAttribution] }), etudiant.documentMemoire && (_jsx("div", { className: "mt-3 pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FileText, { className: "h-4 w-4 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: etudiant.documentMemoire.titre }), _jsxs("p", { className: "text-xs text-gray-500", children: ["D\u00E9pos\u00E9 le ", etudiant.documentMemoire.dateDepot, " \u2022", (etudiant.documentMemoire.tailleFichier / 1024 / 1024).toFixed(2), " Mo \u2022", etudiant.documentMemoire.format.toUpperCase()] })] })] }), _jsx(Button, { variant: "primary", onClick: () => {
                                                                            // Simuler le téléchargement/consultation
                                                                            window.open(etudiant.documentMemoire.cheminFichier, '_blank');
                                                                        }, icon: _jsx(Eye, { className: "h-4 w-4" }), children: "Consulter" })] }) }))] })] }) }) }, etudiant.id))) })] })), (!sujet.etudiants || sujet.etudiants.length === 0) && (_jsxs("div", { className: "mt-8 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tudiants ayant utilis\u00E9 ce sujet" }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 p-8 text-center", children: [_jsx(Users, { className: "h-12 w-12 mx-auto text-gray-400 mb-3" }), _jsx("p", { className: "text-gray-600", children: "Aucun \u00E9tudiant n'a encore utilis\u00E9 ce sujet" })] })] })), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(Button, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }) }));
};
// Modal pour soumettre un nouveau sujet
const ModalNouveauSujet = ({ isOpen, onClose, onSubmit }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        filieres: [],
        motsCles: '',
        prerequis: '',
        objectifs: '',
        anneeAcademique: '2024-2025',
        statut: 'brouillon'
    });
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFiliereChange = (filiere) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { filieres: prev.filieres.includes(filiere)
                ? prev.filieres.filter(f => f !== filiere)
                : [...prev.filieres, filiere] })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.titre || !formData.description || !formData.objectifs || !formData.prerequis || formData.filieres.length === 0) {
            setAlertMessage('Veuillez remplir tous les champs obligatoires et sélectionner au moins une filière.');
            setShowAlertModal(true);
            return;
        }
        const nouveauSujet = Object.assign(Object.assign({ type: 'memoire', niveau: 'Licence 3', departement: 'Génie Informatique' }, formData), { statut: 'soumis', nombreMaxEtudiants: 0, nombreEtudiantsActuels: 0, motsCles: formData.motsCles.split(',').map(m => m.trim()).filter(m => m.length > 0), dateSoumission: new Date().toISOString().split('T')[0], dateApprobation: undefined });
        onSubmit(nouveauSujet);
        setFormData({
            titre: '',
            description: '',
            filieres: [],
            motsCles: '',
            prerequis: '',
            objectifs: '',
            anneeAcademique: '2024-2025',
            statut: 'brouillon'
        });
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Nouveau sujet" }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Titre du sujet *" }), _jsx("input", { name: "titre", value: formData.titre, onChange: handleChange, placeholder: "Ex: Intelligence Artificielle pour la D\u00E9tection de Fraudes", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fili\u00E8res * (s\u00E9lectionnez au moins une)" }), _jsx("div", { className: "space-y-2 border border-gray-300 p-3", children: FILIERES.map(filiere => (_jsxs("label", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.filieres.includes(filiere), onChange: () => handleFiliereChange(filiere), className: "w-4 h-4 text-navy border-gray-300 focus:ring-navy" }), _jsx("span", { className: "text-sm text-gray-700", children: filiere })] }, filiere))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Mots-cl\u00E9s (s\u00E9par\u00E9s par des virgules)" }), _jsx("input", { name: "motsCles", value: formData.motsCles, onChange: handleChange, placeholder: "Ex: IA, Machine Learning, S\u00E9curit\u00E9", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description *" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description d\u00E9taill\u00E9e du sujet...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objectifs *" }), _jsx("textarea", { name: "objectifs", value: formData.objectifs, onChange: handleChange, placeholder: "Objectifs p\u00E9dagogiques et comp\u00E9tences \u00E0 acqu\u00E9rir...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9requis *" }), _jsx("textarea", { name: "prerequis", value: formData.prerequis, onChange: handleChange, placeholder: "Connaissances et comp\u00E9tences requises...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-gray-200", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(Button, { type: "button", variant: "secondary", onClick: () => {
                                                    if (!formData.titre || !formData.description || !formData.objectifs || !formData.prerequis || formData.filieres.length === 0) {
                                                        setAlertMessage('Veuillez remplir tous les champs obligatoires et sélectionner au moins une filière.');
                                                        setShowAlertModal(true);
                                                        return;
                                                    }
                                                    const nouveauSujet = Object.assign(Object.assign({ type: 'memoire', niveau: 'Licence 3', departement: 'Génie Informatique' }, formData), { statut: 'brouillon', nombreMaxEtudiants: 0, nombreEtudiantsActuels: 0, motsCles: formData.motsCles.split(',').map(m => m.trim()).filter(m => m.length > 0), dateSoumission: undefined, dateApprobation: undefined });
                                                    onSubmit(nouveauSujet);
                                                    setFormData({
                                                        titre: '',
                                                        description: '',
                                                        filieres: [],
                                                        motsCles: '',
                                                        prerequis: '',
                                                        objectifs: '',
                                                        anneeAcademique: '2024-2025',
                                                        statut: 'brouillon'
                                                    });
                                                    onClose();
                                                }, icon: _jsx(Save, { className: "h-4 w-4" }), children: "Sauvegarder brouillon" }), _jsx(Button, { type: "submit", variant: "primary", icon: _jsx(Target, { className: "h-4 w-4" }), children: "Soumettre le sujet" })] })] })] }) }) }), _jsx(AnimatePresence, { children: showAlertModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-md w-full", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start space-x-4 mb-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(Info, { className: "h-5 w-5 text-blue-600" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Information" }), _jsx("p", { className: "text-gray-700 text-sm", children: alertMessage })] }), _jsx("button", { onClick: () => setShowAlertModal(false), className: "p-1 hover:bg-gray-100 transition-colors flex-shrink-0", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsx("div", { className: "flex justify-end mt-6", children: _jsx(Button, { onClick: () => setShowAlertModal(false), variant: "primary", children: "Compris" }) })] }) }) })) })] }));
};
// Composant principal
const Sujets = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('mes-sujets');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filiereFilter, setFiliereFilter] = useState('all');
    const [selectedSujet, setSelectedSujet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalNouveauSujetOpen, setIsModalNouveauSujetOpen] = useState(false);
    // Simuler l'ID du professeur connecté (dans un vrai app, cela viendrait de l'auth)
    const professeurId = 1; // user?.id ou similaire
    const [sujets, setSujets] = useState(TOUS_LES_SUJETS);
    // Filtrer les sujets selon l'onglet actif
    const anneeCourante = '2024-2025';
    const mesSujets = sujets.filter(s => s.professeurId === professeurId && s.anneeAcademique === anneeCourante);
    const sujetsDisponibles = sujets.filter(s => s.statut === 'soumis' && s.anneeAcademique === anneeCourante);
    const sujetsHistorique = sujets.filter(s => s.anneeAcademique !== anneeCourante);
    const sujetsAffiches = activeTab === 'mes-sujets' ? mesSujets :
        activeTab === 'historique' ? sujetsHistorique :
            sujetsDisponibles;
    const filteredSujets = sujetsAffiches.filter(sujet => {
        const matchesSearch = sujet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sujet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sujet.motsCles.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFiliere = filiereFilter === 'all' || (sujet.filieres && sujet.filieres.includes(filiereFilter));
        return matchesSearch && matchesFiliere;
    });
    const openSujetDetails = (sujet) => {
        // Récupérer le sujet complet avec tous ses étudiants depuis la liste originale
        const sujetComplet = sujets.find(s => s.id === sujet.id) || sujet;
        setSelectedSujet(sujetComplet);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedSujet(null);
        setIsModalOpen(false);
    };
    const handleNouveauSujet = (nouveauSujet) => {
        const sujetComplet = Object.assign(Object.assign({}, nouveauSujet), { id: Math.max(...sujets.map(s => s.id), 0) + 1, dateCreation: new Date().toISOString().split('T')[0], dateModification: new Date().toISOString().split('T')[0], professeurId: professeurId, professeurNom: (user === null || user === void 0 ? void 0 : user.name) || 'Prof. Inconnu' });
        setSujets([...sujets, sujetComplet]);
        setIsModalNouveauSujetOpen(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Sujets" }), _jsx("p", { className: "text-gray-600", children: "G\u00E9rez vos sujets de m\u00E9moires, projets et stages" })] }), _jsx(Button, { variant: "primary", onClick: () => setIsModalNouveauSujetOpen(true), icon: _jsx(Plus, { className: "h-4 w-4" }), children: "Nouveau sujet" })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsxs("button", { onClick: () => setActiveTab('mes-sujets'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'mes-sujets'
                                            ? 'border-navy text-navy'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: ["Mes sujets (", mesSujets.length, ")"] }), _jsxs("button", { onClick: () => setActiveTab('sujets-disponibles'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'sujets-disponibles'
                                            ? 'border-navy text-navy'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: ["Liste des sujets disponibles (", sujetsDisponibles.length, ")"] }), _jsxs("button", { onClick: () => setActiveTab('historique'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'historique'
                                            ? 'border-navy text-navy'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: ["Historique (", sujetsHistorique.length, ")"] })] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4", children: [_jsxs("div", { className: "relative w-full md:w-1/2", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Rechercher un sujet...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx(Button, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-5 w-5" }), children: showFilters ? 'Masquer' : 'Filtres' })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fili\u00E8re" }), _jsxs("select", { value: filiereFilter, onChange: (e) => setFiliereFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Toutes les fili\u00E8res" }), FILIERES.map(filiere => (_jsx("option", { value: filiere, children: filiere }, filiere)))] })] }) })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredSujets.length, " sujet", filteredSujets.length !== 1 ? 's' : '', " trouv\u00E9", filteredSujets.length !== 1 ? 's' : ''] }) }), filteredSujets.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center", children: [_jsx(FileText, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucun sujet trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche" })] })) : (_jsx("div", { className: "grid grid-cols-1 gap-6", children: filteredSujets.map((sujet, index) => {
                                        return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: sujet.titre }), _jsx(Badge, { variant: sujet.statut, children: sujet.statut === 'soumis' ? 'Soumis' :
                                                                                sujet.statut === 'brouillon' ? 'Brouillon' : 'Rejeté' })] }), _jsxs("div", { className: "flex items-center gap-2 mb-3 flex-wrap", children: [_jsx(Badge, { variant: "primary", children: sujet.niveau }), _jsx(Badge, { variant: "info", children: sujet.departement }), sujet.filieres && sujet.filieres.length > 0 && (_jsx(_Fragment, { children: sujet.filieres.map((filiere, idx) => (_jsx(Badge, { variant: "info", children: filiere }, idx))) })), activeTab === 'sujets-disponibles' && (_jsx(Badge, { variant: "info", children: sujet.professeurNom }))] }), _jsx("p", { className: "text-gray-600 text-sm mb-3 line-clamp-2", children: sujet.description }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [sujet.nombreEtudiantsActuels, " utilisation", sujet.nombreEtudiantsActuels > 1 ? 's' : ''] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: ["Cr\u00E9\u00E9 le ", sujet.dateCreation] })] })] })] }), _jsx("div", { className: "ml-6 text-center", children: _jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 mb-1", children: sujet.nombreEtudiantsActuels }), _jsx("div", { className: "text-xs text-blue-700", children: "Utilisations" })] }) })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-1", children: [sujet.motsCles.slice(0, 4).map((mot, idx) => (_jsx("span", { className: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600", children: mot }, idx))), sujet.motsCles.length > 4 && (_jsxs("span", { className: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600", children: ["+", sujet.motsCles.length - 4] }))] }) }), _jsx("div", { className: "flex justify-end space-x-2 pt-4 border-t border-gray-200", children: _jsx(Button, { variant: "ghost", onClick: () => openSujetDetails(sujet), icon: _jsx(Eye, { className: "h-4 w-4" }), children: "D\u00E9tails" }) })] }, sujet.id));
                                    }) }))] })] }), _jsx(ModalDetailsSujet, { sujet: selectedSujet, isOpen: isModalOpen, onClose: closeModal }), _jsx(ModalNouveauSujet, { isOpen: isModalNouveauSujetOpen, onClose: () => setIsModalNouveauSujetOpen(false), onSubmit: handleNouveauSujet })] }) }));
};
export default Sujets;
