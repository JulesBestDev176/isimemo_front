import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
const modules = [
    {
        id: 'users',
        title: 'Gestion des utilisateurs et des rôles',
        icon: 'manage_accounts',
        features: [
            'Étudiants, professeurs (encadreurs, jury), chefs de département, secrétaires',
            'Système d\'authentification et de gestion des permissions',
            'Profils personnalisés pour chaque type d\'utilisateur',
            'Tableau de bord adapté aux rôles'
        ]
    },
    {
        id: 'memoires',
        title: 'Dépôt et gestion des mémoires',
        icon: 'upload_file',
        features: [
            'Consultation de la bibliothèque des anciens sujets',
            'Soumission des fiches de dépôt et des canevas',
            'Suivi de l\'état d\'avancement du mémoire',
            'Système de notification pour les étapes clés'
        ]
    },
    {
        id: 'encadrement',
        title: 'Système intelligent d\'encadrement',
        icon: 'supervisor_account',
        features: [
            'Sélection et attribution des encadreurs',
            'Planification automatisée des séances d\'encadrement',
            'Suivi et évaluation des interactions',
            'Rapports de progression automatiques'
        ]
    },
    {
        id: 'ia',
        title: 'Module d\'analyse IA',
        icon: 'smart_toy',
        features: [
            'Analyse de la pertinence des sujets proposés',
            'Recommandation d\'encadreurs en fonction des domaines d\'expertise',
            'Détection de plagiat et validation de la qualité',
            'Classification automatique par domaine et thématique',
            'Comparaison avec les mémoires précédents'
        ]
    },
    {
        id: 'jury',
        title: 'Gestion des jurys et soutenances',
        icon: 'groups',
        features: [
            'Configuration des jurys par les chefs de département',
            'Planification des pré-soutenances et soutenances',
            'Gestion du calendrier et des notifications',
            'Évaluation numérique et feedback'
        ]
    },
    {
        id: 'bibliotheque',
        title: 'Bibliothèque numérique intelligente',
        icon: 'auto_stories',
        features: [
            'Indexation sémantique des mémoires passés',
            'Recherche avancée par concepts et thématiques',
            'Génération de recommandations personnalisées',
            'Statistiques et analyses des tendances'
        ]
    },
    {
        id: 'assistant',
        title: 'Assistant virtuel (chatbot)',
        icon: 'support_agent',
        features: [
            'Réponse aux questions fréquentes des étudiants',
            'Aide à la navigation dans la plateforme',
            'Support pour la compréhension des règles académiques',
            'Assistance 24/7 pour les utilisateurs'
        ]
    }
];
const FunctionalModules = () => {
    return (_jsx("section", { className: "section bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 py-20 mb-3", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.5 }, className: "inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium", children: [_jsx("span", { className: "material-icons text-yellow-300 text-xs mr-1", style: { verticalAlign: 'middle' }, children: "auto_awesome" }), "Fonctionnalit\u00E9s avanc\u00E9es"] }), _jsx("h2", { className: "text-4xl font-bold mb-4 text-white", children: "Modules Fonctionnels" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-lg text-gray-300", children: "D\u00E9couvrez les fonctionnalit\u00E9s innovantes qui font d'ISIMemo une solution compl\u00E8te pour la gestion des m\u00E9moires acad\u00E9miques." })] }), _jsxs(Tabs, { defaultValue: "users", className: "w-full", children: [_jsx("div", { className: "flex justify-center mb-12", children: _jsx(TabsList, { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-transparent", children: modules.map((module) => (_jsxs(TabsTrigger, { value: module.id, className: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm text-gray-200 hover:bg-white/20 transition-all", children: [_jsx("span", { className: "material-icons mb-1", children: module.icon }), _jsx("span", { className: "text-xs font-medium text-center", children: module.title.split(' ')[0] })] }, module.id))) }) }), modules.map((module, moduleIndex) => {
                            const totalModules = modules.length;
                            return (_jsx(TabsContent, { value: module.id, className: "mt-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.5 }, className: "bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-xl" }), _jsx("div", { className: "absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-black/10 blur-lg" }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-6 relative z-10", children: [_jsx("div", { className: "w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl", children: _jsx("span", { className: "material-icons text-4xl", children: module.icon }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-bold mb-2", children: module.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-white" }), _jsxs("p", { className: "text-white/90 font-medium", children: ["Module ", _jsx("span", { className: "font-bold", children: moduleIndex + 1 }), " sur ", _jsx("span", { children: totalModules })] })] })] })] })] }), _jsx("div", { className: "p-8", children: _jsx("ul", { className: "space-y-5", children: module.features.map((feature, index) => (_jsxs(motion.li, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, className: "flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary-400", children: "check_circle" }) }), _jsx("span", { className: "text-gray-200 font-medium", children: feature })] }, index))) }) })] }) }, module.id));
                        })] })] }) }));
};
export default FunctionalModules;
