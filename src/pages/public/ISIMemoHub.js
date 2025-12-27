import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
const ISIMemoHub = () => {
    const [activeSection, setActiveSection] = useState('accueil');
    useEffect(() => {
        // Gérer l'URL hash pour la navigation
        const hash = window.location.hash.substring(1);
        if (hash && ['accueil', 'soumission', 'consultation', 'analyse-ia', 'detection-plagiat', 'assistance'].includes(hash)) {
            setActiveSection(hash);
        }
        // Écouter les changements de hash
        const handleHashChange = () => {
            const newHash = window.location.hash.substring(1);
            if (newHash && ['accueil', 'soumission', 'consultation', 'analyse-ia', 'detection-plagiat', 'assistance'].includes(newHash)) {
                setActiveSection(newHash);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const sections = [
        { id: 'accueil', label: 'Accueil', icon: 'home' },
        { id: 'soumission', label: 'Soumission', icon: 'upload_file' },
        { id: 'consultation', label: 'Consultation Intelligente', icon: 'search' },
        { id: 'analyse-ia', label: 'Analyse IA', icon: 'psychology' },
        { id: 'detection-plagiat', label: 'Détection Plagiat', icon: 'security' },
        { id: 'assistance', label: 'Assistance 24/7', icon: 'support_agent' }
    ];
    const renderSection = () => {
        switch (activeSection) {
            case 'accueil':
                return _jsx(AccueilSection, {});
            case 'soumission':
                return _jsx(SoumissionSection, {});
            case 'consultation':
                return _jsx(ConsultationSection, {});
            case 'analyse-ia':
                return _jsx(AnalyseIASection, {});
            case 'detection-plagiat':
                return _jsx(DetectionPlagiatSection, {});
            case 'assistance':
                return _jsx(AssistanceSection, {});
            default:
                return _jsx(AccueilSection, {});
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "bg-gradient-to-r from-primary to-primary-700 text-white py-16", children: _jsx("div", { className: "container-fluid", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center", children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "ISIMemo Hub" }), _jsx("p", { className: "text-xl text-primary-100 max-w-3xl mx-auto", children: "Plateforme intelligente de gestion des m\u00E9moires acad\u00E9miques avec IA int\u00E9gr\u00E9e" })] }) }) }), _jsx("div", { className: "bg-white shadow-sm sticky top-16 z-40", children: _jsx("div", { className: "container-fluid", children: _jsx("div", { className: "flex overflow-x-auto", children: sections.map((section) => (_jsxs("button", { onClick: () => {
                                setActiveSection(section.id);
                                window.location.hash = section.id;
                            }, className: `flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeSection === section.id
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300'}`, children: [_jsx("span", { className: "material-icons text-xl", children: section.icon }), _jsx("span", { children: section.label })] }, section.id))) }) }) }), _jsx("div", { className: "container-fluid py-12", children: renderSection() }), _jsx(Footer, {})] }));
};
// Section Accueil
const AccueilSection = () => {
    const features = [
        {
            icon: "upload_file",
            title: "Soumission Simplifiée",
            description: "Déposez vos mémoires en quelques clics avec validation automatique des formats",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: "search",
            title: "Consultation Intelligente",
            description: "Explorez la bibliothèque avec une recherche sémantique avancée alimentée par l'IA",
            color: "from-green-500 to-green-600"
        },
        {
            icon: "psychology",
            title: "Analyse IA Avancée",
            description: "Analyses de pertinence, recommandations d'encadreurs et validation automatique",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: "security",
            title: "Détection de Plagiat",
            description: "Vérification d'originalité avec système de détection alimenté par l'intelligence artificielle",
            color: "from-red-500 to-red-600"
        },
        {
            icon: "support_agent",
            title: "Assistant Virtuel",
            description: "Assistance 24/7 avec chatbot intelligent et support personnalisé",
            color: "from-orange-500 to-orange-600"
        }
    ];
    const stats = [
        { number: "2,500+", label: "Mémoires archivés", icon: "library_books" },
        { number: "150+", label: "Professeurs actifs", icon: "school" },
        { number: "95%", label: "Taux de satisfaction", icon: "thumb_up" },
        { number: "24/7", label: "Assistance disponible", icon: "support" }
    ];
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 mb-12", children: stats.map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow", children: [_jsx("span", { className: "material-icons text-3xl text-primary-600 mb-2 block", children: stat.icon }), _jsx("div", { className: "text-2xl font-bold text-gray-800 mb-1", children: stat.number }), _jsx("div", { className: "text-gray-600 text-sm", children: stat.label })] }, index))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: index * 0.1 }, className: "bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group", children: [_jsx("div", { className: `w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`, children: _jsx("span", { className: "material-icons text-white text-2xl", children: feature.icon }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: feature.title }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: feature.description })] }, index))) })] }));
};
// Section Soumission
const SoumissionSection = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Processus de Soumission des M\u00E9moires" }), _jsx("p", { className: "text-gray-600", children: "D\u00E9couvrez comment les \u00E9tudiants soumettent leurs documents avec validation automatique et analyse IA" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "material-icons text-primary-600 mr-2", children: "description" }), "Types de Documents"] }), _jsx("div", { className: "space-y-4", children: [
                                    {
                                        type: "Fiche de dépôt",
                                        description: "Formulaire initial de soumission",
                                        icon: "assignment"
                                    },
                                    {
                                        type: "Mémoire complet",
                                        description: "Document final au format PDF",
                                        icon: "picture_as_pdf"
                                    },
                                    {
                                        type: "Annexes",
                                        description: "Documents complémentaires",
                                        icon: "attach_file"
                                    },
                                    {
                                        type: "Reçu de paiement",
                                        description: "Justificatif de frais de soutenance",
                                        icon: "receipt"
                                    }
                                ].map((doc, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors", children: [_jsx("span", { className: "material-icons text-primary-600 mr-3 mt-1", children: doc.icon }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-800", children: doc.type }), _jsx("div", { className: "text-sm text-gray-600", children: doc.description })] })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "material-icons text-primary-600 mr-2", children: "timeline" }), "\u00C9tapes de Soumission"] }), _jsx("div", { className: "space-y-6", children: [
                                    {
                                        step: "1",
                                        title: "Création du dossier",
                                        description: "Remplissage du formulaire initial"
                                    },
                                    {
                                        step: "2",
                                        title: "Upload des documents",
                                        description: "Téléchargement des fichiers requis"
                                    },
                                    {
                                        step: "3",
                                        title: "Validation automatique",
                                        description: "Vérification par l'IA des formats et contenus"
                                    },
                                    {
                                        step: "4",
                                        title: "Soumission finale",
                                        description: "Confirmation et notification"
                                    }
                                ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-4", children: item.step }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-gray-800 mb-1", children: item.title }), _jsx("div", { className: "text-sm text-gray-600", children: item.description })] })] }, index))) })] })] }), _jsx("div", { className: "mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8", children: _jsxs("div", { className: "flex items-start", children: [_jsx("span", { className: "material-icons text-primary-600 text-4xl mr-4", children: "verified" }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-2", children: "Validation Automatique par IA" }), _jsx("p", { className: "text-gray-700 mb-4", children: "Notre syst\u00E8me d'intelligence artificielle v\u00E9rifie automatiquement :" }), _jsx("ul", { className: "space-y-2", children: [
                                        "Conformité des formats de fichiers",
                                        "Présence de toutes les sections requises",
                                        "Respect des normes de rédaction",
                                        "Détection préliminaire de plagiat"
                                    ].map((item, index) => (_jsxs("li", { className: "flex items-center text-gray-700", children: [_jsx("span", { className: "material-icons text-green-600 text-sm mr-2", children: "check_circle" }), item] }, index))) })] })] }) })] }));
};
// Section Consultation
const ConsultationSection = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Consultation Intelligente des M\u00E9moires" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Explorez notre biblioth\u00E8que num\u00E9rique avec des outils de recherche avanc\u00E9s aliment\u00E9s par l'IA" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12", children: [_jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6", children: _jsx("span", { className: "material-icons text-white text-2xl", children: "search" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Recherche S\u00E9mantique" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Trouvez des m\u00E9moires par concepts et id\u00E9es, pas seulement par mots-cl\u00E9s" }), _jsx("ul", { className: "space-y-2", children: [
                                    "Compréhension du contexte",
                                    "Suggestions intelligentes",
                                    "Recherche multilingue"
                                ].map((item, index) => (_jsxs("li", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-blue-600 text-sm mr-2", children: "check" }), item] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-6", children: _jsx("span", { className: "material-icons text-white text-2xl", children: "filter_list" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Filtres Avanc\u00E9s" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Affinez vos recherches avec de multiples crit\u00E8res" }), _jsx("ul", { className: "space-y-2", children: [
                                    "Par département",
                                    "Par année académique",
                                    "Par encadrant",
                                    "Par mention"
                                ].map((item, index) => (_jsxs("li", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-green-600 text-sm mr-2", children: "check" }), item] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6", children: _jsx("span", { className: "material-icons text-white text-2xl", children: "recommend" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Recommandations IA" }), _jsx("p", { className: "text-gray-600 mb-4", children: "D\u00E9couvrez des m\u00E9moires pertinents bas\u00E9s sur vos int\u00E9r\u00EAts" }), _jsx("ul", { className: "space-y-2", children: [
                                    "Suggestions personnalisées",
                                    "Mémoires similaires",
                                    "Tendances de recherche"
                                ].map((item, index) => (_jsxs("li", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-purple-600 text-sm mr-2", children: "check" }), item] }, index))) })] })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-6 text-center", children: "Fonctionnalit\u00E9s Disponibles pour Tous" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                            {
                                icon: "bookmark",
                                title: "Ressources Sauvegardées",
                                description: "Sauvegardez vos mémoires favoris pour y accéder rapidement",
                                color: "text-yellow-600"
                            },
                            {
                                icon: "folder",
                                title: "Mes Ressources",
                                description: "Gérez vos propres documents et mémoires",
                                color: "text-blue-600"
                            },
                            {
                                icon: "library_books",
                                title: "Médiathèque",
                                description: "Accédez à la bibliothèque complète de ressources",
                                color: "text-green-600"
                            },
                            {
                                icon: "visibility",
                                title: "Consulter Ressources",
                                description: "Visualisez et téléchargez les mémoires disponibles",
                                color: "text-purple-600"
                            }
                        ].map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors", children: [_jsx("span", { className: `material-icons text-4xl ${feature.color} mb-3 block`, children: feature.icon }), _jsx("h4", { className: "font-bold text-gray-800 mb-2", children: feature.title }), _jsx("p", { className: "text-sm text-gray-600", children: feature.description })] }, index))) })] }), _jsxs("div", { className: "mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-6 text-center", children: "Exemple de Recherche Intelligente" }), _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm mb-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "material-icons text-gray-400 mr-3", children: "search" }), _jsx("input", { type: "text", placeholder: "Ex: Intelligence artificielle dans la sant\u00E9...", className: "flex-1 outline-none text-gray-700", disabled: true }), _jsx("button", { className: "bg-primary-600 text-white px-6 py-2 rounded-lg ml-4", children: "Rechercher" })] }) }), _jsxs("div", { className: "text-sm text-gray-600 text-center", children: [_jsx("span", { className: "material-icons text-sm align-middle mr-1", children: "lightbulb" }), "L'IA comprend votre intention et trouve les m\u00E9moires les plus pertinents"] })] })] })] }));
};
// Section Analyse IA
const AnalyseIASection = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Analyse IA Avanc\u00E9e" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Notre syst\u00E8me d'intelligence artificielle offre des analyses approfondies pour am\u00E9liorer la qualit\u00E9 des m\u00E9moires" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12", children: [_jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "analytics" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Analyse de Pertinence" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "\u00C9valuation automatique de la qualit\u00E9 et de la pertinence du contenu" }), _jsx("div", { className: "space-y-3", children: [
                                    "Cohérence du sujet",
                                    "Qualité de la méthodologie",
                                    "Pertinence des sources",
                                    "Originalité de la recherche"
                                ].map((item, index) => (_jsxs("div", { className: "flex items-center p-3 bg-blue-50 rounded-lg", children: [_jsx("span", { className: "material-icons text-blue-600 text-sm mr-3", children: "check_circle" }), _jsx("span", { className: "text-sm text-gray-700", children: item })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "person_search" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Recommandation d'Encadreurs" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Suggestions intelligentes de professeurs selon le domaine de recherche" }), _jsx("div", { className: "space-y-3", children: [
                                    "Analyse des spécialités",
                                    "Disponibilité des professeurs",
                                    "Historique d'encadrement",
                                    "Taux de réussite"
                                ].map((item, index) => (_jsxs("div", { className: "flex items-center p-3 bg-green-50 rounded-lg", children: [_jsx("span", { className: "material-icons text-green-600 text-sm mr-3", children: "check_circle" }), _jsx("span", { className: "text-sm text-gray-700", children: item })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "verified" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Validation Automatique" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "V\u00E9rification automatique de la conformit\u00E9 aux normes acad\u00E9miques" }), _jsx("div", { className: "space-y-3", children: [
                                    "Structure du document",
                                    "Citations et références",
                                    "Format bibliographique",
                                    "Respect des normes ISI"
                                ].map((item, index) => (_jsxs("div", { className: "flex items-center p-3 bg-purple-50 rounded-lg", children: [_jsx("span", { className: "material-icons text-purple-600 text-sm mr-3", children: "check_circle" }), _jsx("span", { className: "text-sm text-gray-700", children: item })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "bar_chart" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Analyse Statistique" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: "Statistiques d\u00E9taill\u00E9es sur le contenu et la structure" }), _jsx("div", { className: "space-y-3", children: [
                                    "Nombre de pages",
                                    "Densité du contenu",
                                    "Répartition des chapitres",
                                    "Qualité de la rédaction"
                                ].map((item, index) => (_jsxs("div", { className: "flex items-center p-3 bg-orange-50 rounded-lg", children: [_jsx("span", { className: "material-icons text-orange-600 text-sm mr-3", children: "check_circle" }), _jsx("span", { className: "text-sm text-gray-700", children: item })] }, index))) })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-8 text-center", children: "Processus d'Analyse IA" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                            {
                                step: "1",
                                title: "Upload",
                                description: "Téléchargement du document",
                                icon: "upload_file"
                            },
                            {
                                step: "2",
                                title: "Extraction",
                                description: "Analyse du contenu",
                                icon: "description"
                            },
                            {
                                step: "3",
                                title: "Traitement",
                                description: "Analyse par l'IA",
                                icon: "psychology"
                            },
                            {
                                step: "4",
                                title: "Rapport",
                                description: "Génération du rapport",
                                icon: "assessment"
                            }
                        ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4", children: item.step }), _jsx("span", { className: "material-icons text-primary-600 text-3xl mb-2 block", children: item.icon }), _jsx("h4", { className: "font-bold text-gray-800 mb-2", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] }, index))) })] })] }));
};
// Section Détection de Plagiat
const DetectionPlagiatSection = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "D\u00E9tection de Plagiat par IA" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Syst\u00E8me avanc\u00E9 de d\u00E9tection de plagiat utilisant l'intelligence artificielle pour garantir l'originalit\u00E9" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12", children: [_jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "material-icons text-red-600 mr-2", children: "info" }), "Comment \u00E7a marche ?"] }), _jsx("div", { className: "space-y-6", children: [
                                    {
                                        title: "Analyse du texte",
                                        description: "Extraction et analyse du contenu textuel",
                                        icon: "text_fields"
                                    },
                                    {
                                        title: "Comparaison intelligente",
                                        description: "Comparaison avec notre base de données et sources en ligne",
                                        icon: "compare"
                                    },
                                    {
                                        title: "Détection sémantique",
                                        description: "Identification de similarités au-delà des mots exacts",
                                        icon: "psychology"
                                    },
                                    {
                                        title: "Rapport détaillé",
                                        description: "Génération d'un rapport avec pourcentage de similarité",
                                        icon: "assessment"
                                    }
                                ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "flex items-start", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-4 flex-shrink-0", children: _jsx("span", { className: "material-icons text-red-600 text-sm", children: item.icon }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 mb-1", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "material-icons text-red-600 mr-2", children: "security" }), "Types de Plagiat D\u00E9tect\u00E9s"] }), _jsx("div", { className: "space-y-4", children: [
                                    {
                                        type: "Plagiat direct",
                                        description: "Copie mot à mot sans citation",
                                        severity: "high"
                                    },
                                    {
                                        type: "Paraphrase",
                                        description: "Reformulation sans attribution",
                                        severity: "medium"
                                    },
                                    {
                                        type: "Auto-plagiat",
                                        description: "Réutilisation de ses propres travaux",
                                        severity: "medium"
                                    },
                                    {
                                        type: "Plagiat mosaïque",
                                        description: "Assemblage de sources multiples",
                                        severity: "high"
                                    }
                                ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-gray-800", children: item.type }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${item.severity === 'high'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-orange-100 text-orange-700'}`, children: item.severity === 'high' ? 'Élevé' : 'Moyen' })] }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] }, index))) })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-8 text-center", children: "Avantages de Notre Syst\u00E8me" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                            {
                                icon: "speed",
                                title: "Rapide",
                                description: "Résultats en quelques minutes"
                            },
                            {
                                icon: "precision_manufacturing",
                                title: "Précis",
                                description: "Taux de détection élevé"
                            },
                            {
                                icon: "language",
                                title: "Multilingue",
                                description: "Support de plusieurs langues"
                            }
                        ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "text-center bg-white rounded-lg p-6", children: [_jsx("span", { className: "material-icons text-red-600 text-4xl mb-3 block", children: item.icon }), _jsx("h4", { className: "font-bold text-gray-800 mb-2", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] }, index))) })] }), _jsxs("div", { className: "mt-8 bg-white rounded-xl p-8 shadow-md", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-6 text-center", children: "Exemple de Rapport de Plagiat" }), _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Taux de similarit\u00E9" }), _jsx("div", { className: "text-3xl font-bold text-gray-800", children: "12%" })] }), _jsx("div", { className: "w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center", children: _jsx("span", { className: "material-icons text-green-500 text-4xl", children: "check_circle" }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center p-3 bg-white rounded", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Sources identifi\u00E9es" }), _jsx("span", { className: "font-semibold text-gray-800", children: "3" })] }), _jsxs("div", { className: "flex justify-between items-center p-3 bg-white rounded", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Passages similaires" }), _jsx("span", { className: "font-semibold text-gray-800", children: "5" })] }), _jsxs("div", { className: "flex justify-between items-center p-3 bg-white rounded", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Statut" }), _jsx("span", { className: "px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium", children: "Acceptable" })] })] })] }) })] })] }));
};
// Section Assistance
const AssistanceSection = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Assistance 24/7" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Notre assistant virtuel intelligent est disponible \u00E0 tout moment pour vous aider" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12", children: [_jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "smart_toy" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Chatbot Intelligent" })] }), _jsx("p", { className: "text-gray-600 mb-6", children: "Notre assistant virtuel peut vous aider avec :" }), _jsx("div", { className: "space-y-3", children: [
                                    "Questions sur le processus de soumission",
                                    "Aide à la navigation sur la plateforme",
                                    "Informations sur les normes de rédaction",
                                    "Support technique",
                                    "Conseils méthodologiques"
                                ].map((item, index) => (_jsxs("div", { className: "flex items-start p-3 bg-blue-50 rounded-lg", children: [_jsx("span", { className: "material-icons text-blue-600 text-sm mr-3 mt-0.5", children: "chat" }), _jsx("span", { className: "text-sm text-gray-700", children: item })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-8 shadow-md", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4", children: _jsx("span", { className: "material-icons text-white", children: "psychology" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: "Fonctionnalit\u00E9s Avanc\u00E9es" })] }), _jsx("div", { className: "space-y-4", children: [
                                    {
                                        title: "Compréhension contextuelle",
                                        description: "L'IA comprend le contexte de vos questions",
                                        icon: "lightbulb"
                                    },
                                    {
                                        title: "Historique des conversations",
                                        description: "Accédez à vos discussions précédentes",
                                        icon: "history"
                                    },
                                    {
                                        title: "Archivage des discussions",
                                        description: "Sauvegardez les conversations importantes",
                                        icon: "archive"
                                    },
                                    {
                                        title: "Rappels personnalisés",
                                        description: "Activez des rappels pour vos échéances",
                                        icon: "notifications"
                                    }
                                ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, delay: index * 0.1 }, className: "flex items-start", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0", children: _jsx("span", { className: "material-icons text-purple-600 text-sm", children: item.icon }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 mb-1", children: item.title }), _jsx("p", { className: "text-sm text-gray-600", children: item.description })] })] }, index))) })] })] }), _jsxs("div", { className: "bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-6 text-center", children: "Exemple de Conversation" }), _jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [_jsx("div", { className: "flex justify-end", children: _jsx("div", { className: "bg-primary-600 text-white rounded-lg p-4 max-w-md", children: _jsx("p", { className: "text-sm", children: "Comment puis-je soumettre mon m\u00E9moire ?" }) }) }), _jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "bg-white rounded-lg p-4 max-w-md shadow-sm", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("span", { className: "material-icons text-primary-600 text-sm mr-2", children: "smart_toy" }), _jsx("span", { className: "text-xs font-semibold text-gray-600", children: "Assistant ISIMemo" })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Pour soumettre votre m\u00E9moire, suivez ces \u00E9tapes :", _jsx("br", {}), "1. Connectez-vous \u00E0 votre compte", _jsx("br", {}), "2. Acc\u00E9dez \u00E0 \"Mes Dossiers\"", _jsx("br", {}), "3. Cliquez sur \"Nouveau Dossier\"", _jsx("br", {}), "4. Remplissez le formulaire et t\u00E9l\u00E9chargez vos documents"] })] }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-xl p-6 shadow-md", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "material-icons text-blue-600 mr-2", children: "support_agent" }), "Contact Support"] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Besoin d'aide personnalis\u00E9e ? Contactez notre \u00E9quipe de support." }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-primary-600 mr-2 text-sm", children: "email" }), "support@isimemo.edu"] }), _jsxs("div", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-primary-600 mr-2 text-sm", children: "phone" }), "+221 33 822 19 81"] }), _jsxs("div", { className: "flex items-center text-sm text-gray-700", children: [_jsx("span", { className: "material-icons text-primary-600 mr-2 text-sm", children: "schedule" }), "Lun-Ven: 8h00-18h00"] })] }), _jsxs("div", { className: "w-full mt-4 py-2 bg-primary-600 text-white rounded-lg text-center text-sm", children: [_jsx("span", { className: "material-icons mr-1", children: "chat" }), "Contacter le support"] })] }), _jsxs("div", { className: "bg-white rounded-xl p-6 shadow-md", children: [_jsxs("h3", { className: "text-lg font-bold text-gray-800 mb-4 flex items-center", children: [_jsx("span", { className: "material-icons text-green-600 mr-2", children: "menu_book" }), "Guides & Ressources"] }), _jsx("div", { className: "space-y-3", children: [
                                    { title: "Guide de soumission", icon: "upload_file" },
                                    { title: "Normes de rédaction", icon: "edit" },
                                    { title: "Tutoriel vidéo", icon: "play_circle" },
                                    { title: "Modèles de canevas", icon: "description" }
                                ].map((guide, index) => (_jsxs(motion.div, { className: "flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors", whileHover: { scale: 1.02 }, children: [_jsx("span", { className: "material-icons text-green-600 mr-3 text-sm", children: guide.icon }), _jsx("span", { className: "text-sm text-gray-800", children: guide.title }), _jsx("span", { className: "material-icons text-gray-400 ml-auto text-sm", children: "arrow_forward_ios" })] }, index))) })] })] })] }));
};
export default ISIMemoHub;
