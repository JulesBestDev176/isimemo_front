import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
// Hook personnalisé pour l'animation de compteur
const useCounter = (end, duration = 2, delay = 0) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const inView = useInView(nodeRef, { once: true, amount: 0.5 });
    useEffect(() => {
        if (!inView)
            return;
        let startTime = null;
        let animationFrame;
        const updateCount = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const elapsed = timestamp - startTime;
            // Attendre le délai avant de commencer
            if (elapsed < delay * 1000) {
                animationFrame = requestAnimationFrame(updateCount);
                return;
            }
            const progress = Math.min((elapsed - delay * 1000) / (duration * 1000), 1);
            // Fonction d'easing pour ralentir vers la fin
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easedProgress * end));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
            else {
                setCount(end);
            }
        };
        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, delay, inView]);
    return { count, ref: nodeRef };
};
import CarteMemoire from "../../components/CarteMemoire";
import Footer from "../../components/Footer";
import AffichageMemoire from "../../components/AffichageMemoire";
import { memoiresData } from "../../data/memoires.data";
const Memoires = () => {
    const [memoires, setMemoires] = useState(memoiresData);
    const [memoiresFiltres, setMemoiresFiltres] = useState(memoiresData);
    const [memoireSelectionne, setMemoireSelectionne] = useState(null);
    const [vueDetaillee, setVueDetaillee] = useState(false);
    // Pagination
    const memoiresParPage = 5;
    const [pageCourante, setPageCourante] = useState(1);
    const indexDernierMemoire = pageCourante * memoiresParPage;
    const indexPremierMemoire = indexDernierMemoire - memoiresParPage;
    const memoiresCourants = memoiresFiltres.slice(indexPremierMemoire, indexDernierMemoire);
    const nombreTotalPages = Math.ceil(memoiresFiltres.length / memoiresParPage);
    // Filtres
    const [requeteRecherche, setRequeteRecherche] = useState("");
    const [departementSelectionne, setDepartementSelectionne] = useState("");
    const [anneeSelectionnee, setAnneeSelectionnee] = useState("");
    const [etiquetteSelectionnee, setEtiquetteSelectionnee] = useState("");
    // Données pour les filtres
    const departements = [...new Set(memoires.map(m => m.departement))];
    const annees = [...new Set(memoires.map(m => m.annee))].sort((a, b) => b.localeCompare(a));
    // Récupérer toutes les etiquettes uniques
    const toutesEtiquettes = [...new Set(memoires.flatMap(m => m.etiquettes))];
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "memoires - ISIMemo";
    }, []);
    // Effet pour la filtration
    useEffect(() => {
        let resultat = [...memoires];
        // Filtrer par recherche (titre, auteur, description, etiquettes)
        if (requeteRecherche) {
            const requete = requeteRecherche.toLowerCase();
            resultat = resultat.filter(memoire => memoire.titre.toLowerCase().includes(requete) ||
                memoire.auteur.toLowerCase().includes(requete) ||
                memoire.description.toLowerCase().includes(requete) ||
                memoire.etiquettes.some(etiquette => etiquette.toLowerCase().includes(requete)));
        }
        // Filtrer par département
        if (departementSelectionne) {
            resultat = resultat.filter(memoire => memoire.departement === departementSelectionne);
        }
        // Filtrer par année
        if (anneeSelectionnee) {
            resultat = resultat.filter(memoire => memoire.annee === anneeSelectionnee);
        }
        // Filtrer par étiquette
        if (etiquetteSelectionnee) {
            resultat = resultat.filter(memoire => memoire.etiquettes.includes(etiquetteSelectionnee));
        }
        // Trier par année académique (les plus récents en premier)
        resultat.sort((a, b) => b.annee.localeCompare(a.annee));
        setMemoiresFiltres(resultat);
        // Réinitialiser à la première page lors d'un changement de filtre
        setPageCourante(1);
    }, [requeteRecherche, departementSelectionne, anneeSelectionnee, etiquetteSelectionnee, memoires]);
    const gererClicMemoire = (memoire) => {
        setMemoireSelectionne(memoire);
        setVueDetaillee(true);
        window.scrollTo(0, 0);
    };
    const fermerVueDetaillee = () => {
        setVueDetaillee(false);
        setMemoireSelectionne(null);
    };
    const reinitialiserFiltres = () => {
        setRequeteRecherche("");
        setDepartementSelectionne("");
        setAnneeSelectionnee("");
        setEtiquetteSelectionnee("");
    };
    const changerPage = (numeroPage) => {
        setPageCourante(numeroPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const pagePrecedente = () => {
        if (pageCourante > 1) {
            setPageCourante(pageCourante - 1);
            window.scrollTo(0, 0);
        }
    };
    const pageSuivante = () => {
        if (pageCourante < nombreTotalPages) {
            setPageCourante(pageCourante + 1);
            window.scrollTo(0, 0);
        }
    };
    // Composant de pagination
    const Pagination = () => {
        return (_jsxs("div", { className: "flex justify-center items-center space-x-2 mt-8", children: [_jsx("button", { onClick: pagePrecedente, disabled: pageCourante === 1, className: `flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'}`, children: _jsx("span", { className: "material-icons text-sm", children: "chevron_left" }) }), [...Array(nombreTotalPages)].map((_, index) => (_jsx("button", { onClick: () => changerPage(index + 1), className: `w-10 h-10 rounded-full flex items-center justify-center transition-colors ${pageCourante === index + 1
                        ? 'bg-primary text-white font-medium'
                        : 'bg-gray-100 text-navy-700 hover:bg-primary-50'}`, children: index + 1 }, index))), _jsx("button", { onClick: pageSuivante, disabled: pageCourante === nombreTotalPages, className: `flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === nombreTotalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'}`, children: _jsx("span", { className: "material-icons text-sm", children: "chevron_right" }) })] }));
    };
    return (_jsxs("div", { children: [_jsx("div", { className: "min-h-screen pb-16", children: vueDetaillee && memoireSelectionne ? (_jsx(AffichageMemoire, { memoire: memoireSelectionne, onRetour: fermerVueDetaillee })) : (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, children: [_jsx(motion.div, { className: "absolute top-1/3 right-10 w-80 h-80 rounded-full bg-white opacity-10", animate: {
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360],
                                    }, transition: {
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: "linear"
                                    } }), _jsx(motion.div, { className: "absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-blue-300 opacity-10", animate: {
                                        scale: [1.2, 1, 1.2],
                                        x: [0, 30, 0]
                                    }, transition: {
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    } }), _jsx(motion.div, { className: "absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200 opacity-20", animate: {
                                        y: [0, -50, 0],
                                        x: [0, 30, 0],
                                    }, transition: {
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    } }), _jsx(motion.div, { className: "absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-primary-300 opacity-20", animate: {
                                        y: [0, 40, 0],
                                        x: [0, -20, 0],
                                    }, transition: {
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    } }), _jsx("div", { className: "container-fluid relative z-10 flex-grow flex flex-col justify-center items-center", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: _jsxs("span", { className: "inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4", children: [_jsx("span", { className: "material-icons text-yellow-200 text-xs mr-1", style: { verticalAlign: 'middle' }, children: "auto_awesome" }), "Enrichissez votre savoir acad\u00E9mique"] }) }), _jsxs(motion.h1, { className: "text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 }, children: ["Biblioth\u00E8que de ", _jsxs(motion.span, { className: "relative inline-block", whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, children: ["m\u00E9moires", _jsx(motion.div, { className: "absolute bottom-0 left-0 w-full h-1 bg-yellow-300", initial: { width: 0 }, animate: { width: "100%" }, transition: { duration: 1, delay: 0.8 } })] })] }), _jsx(motion.p, { className: "text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.3 }, children: "D\u00E9couvrez l'excellence acad\u00E9mique \u00E0 travers notre collection de travaux de recherche innovants r\u00E9alis\u00E9s par nos \u00E9tudiants." }), _jsx(motion.div, { className: "bg-white/10 backdrop-blur-lg p-1.5 rounded-2xl shadow-2xl max-w-2xl mx-auto", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.5 }, whileHover: { scale: 1.02 }, children: _jsxs("div", { className: "bg-white rounded-xl flex items-center overflow-hidden", children: [_jsx("div", { className: "bg-primary-50 p-4", children: _jsx("span", { className: "material-icons text-primary", children: "search" }) }), _jsx("input", { type: "text", placeholder: "Rechercher par titre, auteur, mot-cl\u00E9...", className: "w-full py-4 px-5 outline-none bg-transparent text-navy-700", value: requeteRecherche, onChange: (e) => setRequeteRecherche(e.target.value) })] }) }), _jsxs(motion.div, { className: "flex justify-center gap-8 mt-10 text-white", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.7 }, children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "font-bold text-3xl", children: memoiresFiltres.length }), _jsx("span", { className: "text-blue-100 text-sm", children: "M\u00E9moires disponibles" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "font-bold text-3xl", children: departements.length }), _jsx("span", { className: "text-blue-100 text-sm", children: "D\u00E9partements" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "font-bold text-3xl", children: toutesEtiquettes.length }), _jsx("span", { className: "text-blue-100 text-sm", children: "Th\u00E9matiques" })] })] })] }) }), _jsx(motion.div, { className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10", initial: { opacity: 0 }, animate: { opacity: 1, y: [0, 10, 0] }, transition: {
                                        opacity: { delay: 1.5, duration: 1 },
                                        y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }, onClick: () => {
                                        // Faire défiler vers la section suivante (conteneur de filtrage)
                                        window.scrollTo({
                                            top: window.innerHeight,
                                            behavior: 'smooth'
                                        });
                                    }, children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-white text-sm mb-2", children: "Explorer les m\u00E9moires" }), _jsx("span", { className: "material-icons text-white", children: "expand_more" })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full overflow-hidden", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1440 110", className: "fill-gray-50", children: _jsx("path", { d: "M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" }) }) })] }), _jsx("div", { className: "container-fluid py-12", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsx(motion.div, { className: "md:col-span-1", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, children: _jsxs("div", { className: "bg-white rounded-xl shadow-md p-5 sticky top-24 border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-lg font-bold text-navy flex items-center", children: [_jsx("span", { className: "material-icons text-primary mr-2 text-xl", children: "filter_list" }), "Filtres"] }), _jsxs("button", { onClick: reinitialiserFiltres, className: "text-primary hover:text-primary-700 text-sm flex items-center gap-1 transition-colors rounded-full bg-primary-50 px-2 py-1", children: [_jsx("span", { className: "material-icons text-sm", children: "refresh" }), "R\u00E9initialiser"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-3 mb-3", children: [_jsxs("p", { className: "text-navy-700 font-medium", children: [_jsx("span", { className: "text-primary font-bold", children: memoiresFiltres.length }), " m\u00E9moire", memoiresFiltres.length !== 1 ? 's' : '', " trouv\u00E9", memoiresFiltres.length !== 1 ? 's' : ''] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Page ", pageCourante, " sur ", nombreTotalPages || 1] })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "departement", className: "block text-navy-700 font-medium text-sm mb-1 flex items-center", children: [_jsx("span", { className: "material-icons text-gray-400 mr-1 text-sm", children: "business" }), "D\u00E9partement"] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { id: "departement", className: "w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white", value: departementSelectionne, onChange: (e) => setDepartementSelectionne(e.target.value), children: [_jsx("option", { value: "", children: "Tous les d\u00E9partements" }), departements.map((dept, index) => (_jsx("option", { value: dept, children: dept }, index)))] }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400", children: _jsx("span", { className: "material-icons text-sm", children: "expand_more" }) })] })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "annee", className: "block text-navy-700 font-medium text-sm mb-1 flex items-center", children: [_jsx("span", { className: "material-icons text-gray-400 mr-1 text-sm", children: "calendar_today" }), "Ann\u00E9e"] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { id: "annee", className: "w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white", value: anneeSelectionnee, onChange: (e) => setAnneeSelectionnee(e.target.value), children: [_jsx("option", { value: "", children: "Toutes les ann\u00E9es" }), annees.map((annee, index) => (_jsx("option", { value: annee, children: annee }, index)))] }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400", children: _jsx("span", { className: "material-icons text-sm", children: "expand_more" }) })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-navy-700 font-medium text-sm mb-2 flex items-center", children: [_jsx("span", { className: "material-icons text-gray-400 mr-1 text-sm", children: "sell" }), "Th\u00E9matiques"] }), _jsxs("div", { className: "relative mb-2", children: [_jsxs("select", { id: "etiquette", className: "w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white", value: etiquetteSelectionnee, onChange: (e) => setEtiquetteSelectionnee(e.target.value), children: [_jsx("option", { value: "", children: "Toutes les th\u00E9matiques" }), toutesEtiquettes.map((etiquette, index) => (_jsx("option", { value: etiquette, children: etiquette }, index)))] }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400", children: _jsx("span", { className: "material-icons text-sm", children: "expand_more" }) })] })] })] })] }) }), _jsxs("div", { className: "md:col-span-3 space-y-6", children: [_jsx(AnimatePresence, { children: memoiresCourants.length > 0 ? (memoiresCourants.map(memoire => (_jsx(CarteMemoire, { memoire: memoire, onClick: gererClicMemoire }, memoire.id)))) : (_jsxs(motion.div, { className: "bg-white rounded-xl shadow-lg p-8 text-center", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4", children: _jsx("span", { className: "material-icons text-gray-400 text-2xl", children: "search_off" }) }), _jsx("h3", { className: "text-xl font-bold text-navy mb-2", children: "Aucun r\u00E9sultat" }), _jsx("p", { className: "text-navy-700", children: "Aucun memoire ne correspond \u00E0 vos crit\u00E8res de recherche." }), _jsxs("button", { onClick: reinitialiserFiltres, className: "mt-4 text-primary hover:text-primary-700 font-medium flex items-center gap-2 mx-auto transition-colors", children: [_jsx("span", { className: "material-icons", children: "refresh" }), "R\u00E9initialiser les filtres"] })] })) }), memoiresFiltres.length > memoiresParPage && _jsx(Pagination, {})] })] }) })] })) }), _jsx(Footer, {})] }));
};
export default Memoires;
