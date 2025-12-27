import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import Footer from "../../components/Footer";
import Partners from "../../components/Partners";
import SchoolInfo from "../../components/SchoolInfo";
import Departments from "../../components/Departments";
import Distinctions from "../../components/Distinctions";
import { useEffect, useRef, useState } from "react";
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
const teamMembers = [
    {
        name: "Dr. Ahmed Keita",
        role: "Directeur de l'ISI",
        bio: "Avec plus de 20 ans d'expérience dans l'enseignement supérieur, Dr. Keita guide l'ISI vers l'excellence académique.",
        color: "from-blue-500 to-blue-600",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
        name: "Prof. Marie Diop",
        role: "Responsable Académique",
        bio: "Spécialiste en intelligence artificielle, elle supervise l'élaboration des programmes de formation innovants.",
        color: "from-emerald-500 to-emerald-600",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    },
    {
        name: "Ing. Robert Faye",
        role: "Responsable Technique",
        bio: "Expert en architecture des systèmes d'information, il s'assure de la qualité technique des enseignements.",
        color: "from-violet-500 to-violet-600",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
        name: "Mme. Aïssatou Sow",
        role: "Relations Internationales",
        bio: "Développe des partenariats stratégiques avec des institutions académiques du monde entier.",
        color: "from-amber-500 to-amber-600",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1698&q=80",
    },
];
const historyMilestones = [
    { year: "1994", event: "Fondation de l'ISI", description: "Création de l'Institut Supérieur d'Informatique avec une première promotion de 45 étudiants." },
    { year: "2000", event: "Premier campus international", description: "Ouverture du premier campus international à Abidjan, Côte d'Ivoire." },
    { year: "2008", event: "Partenariat avec CISCO", description: "Signature d'un accord stratégique faisant de l'ISI une académie CISCO de référence." },
    { year: "2015", event: "Reconnaissance internationale", description: "L'ISI est désignée meilleure académie d'excellence CISCO en Afrique subsaharienne." },
    { year: "2023", event: "ISIMemo", description: "Lancement de la plateforme ISIMemo pour la gestion intelligente des mémoires académiques." },
];
const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "À Propos - ISIMemo";
    }, []);
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };
    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 }, className: "min-h-screen bg-white", children: [_jsxs(motion.div, { className: "relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, children: [_jsx(motion.div, { className: "absolute top-1/3 right-10 w-80 h-80 rounded-full bg-white opacity-10", animate: {
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
                        } }), _jsx("div", { className: "container-fluid relative z-10 flex-grow flex flex-col justify-center items-center", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: _jsxs("span", { className: "inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4", children: [_jsx("span", { className: "material-icons text-yellow-200 text-xs mr-1", style: { verticalAlign: 'middle' }, children: "auto_awesome" }), "D\u00E9couvrez notre institution"] }) }), _jsxs(motion.h1, { className: "text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 }, children: ["\u00C0 Propos de ", _jsxs(motion.span, { className: "relative inline-block", whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, children: ["l'ISI", _jsx(motion.div, { className: "absolute bottom-0 left-0 w-full h-1 bg-yellow-300", initial: { width: 0 }, animate: { width: "100%" }, transition: { duration: 1, delay: 0.8 } })] })] }), _jsx(motion.p, { className: "text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.3 }, children: "L'ISI est une institution d'enseignement sup\u00E9rieur qui forme depuis plus de 25 ans les futurs experts en informatique et technologies num\u00E9riques en Afrique." }), _jsxs(motion.div, { className: "flex justify-center gap-6 mt-10", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.5 }, children: [_jsx(motion.button, { className: "px-8 py-4 bg-white hover:bg-white/90 text-primary-600 font-medium rounded-full shadow-lg", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 10 }, onClick: () => {
                                                // Défilement vers la section Histoire avec vérification null
                                                const histoireSection = document.getElementById('section-histoire');
                                                if (histoireSection) {
                                                    histoireSection.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }, children: "Notre histoire" }), _jsx(motion.button, { className: "px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-medium rounded-full", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 10 }, onClick: () => {
                                                // Défilement vers la section Équipe avec vérification null
                                                const equipeSection = document.getElementById('section-equipe');
                                                if (equipeSection) {
                                                    equipeSection.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }, children: "Notre \u00E9quipe" })] }), _jsxs(motion.div, { className: "flex justify-center gap-8 mt-10 text-white", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.7 }, children: [_jsxs("div", { className: "flex flex-col items-center", children: [(() => {
                                                    const { count, ref } = useCounter(25, 2, 0.7);
                                                    return (_jsxs("span", { ref: ref, className: "font-bold text-3xl", children: [count, "+"] }));
                                                })(), _jsx("span", { className: "text-blue-100 text-sm", children: "Ann\u00E9es d'exp\u00E9rience" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [(() => {
                                                    const { count, ref } = useCounter(5000, 2.5, 0.9);
                                                    return (_jsxs("span", { ref: ref, className: "font-bold text-3xl", children: [count, "+"] }));
                                                })(), _jsx("span", { className: "text-blue-100 text-sm", children: "Dipl\u00F4m\u00E9s" })] }), _jsxs("div", { className: "flex flex-col items-center", children: [(() => {
                                                    const { count, ref } = useCounter(15, 2, 1.1);
                                                    return (_jsxs("span", { ref: ref, className: "font-bold text-3xl", children: [count, "+"] }));
                                                })(), _jsx("span", { className: "text-blue-100 text-sm", children: "Partenariats" })] })] })] }) }), _jsx(motion.div, { className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10", initial: { opacity: 0 }, animate: { opacity: 1, y: [0, 10, 0] }, transition: {
                            opacity: { delay: 1.5, duration: 1 },
                            y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }, onClick: () => {
                            // Faire défiler vers la section Mission et Vision avec vérification null
                            const firstSection = document.querySelector('.section.py-16.bg-white');
                            if (firstSection) {
                                firstSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-white text-sm mb-2", children: "En savoir plus" }), _jsx("span", { className: "material-icons text-white", children: "expand_more" })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full overflow-hidden", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1440 110", className: "fill-white", children: _jsx("path", { d: "M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" }) }) })] }), _jsx("section", { className: "section py-16 bg-white", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "space-y-6", children: [_jsxs("h2", { className: "text-3xl font-bold text-navy", children: [_jsx("span", { className: "inline-block mr-2", children: "\uD83D\uDE80" }), "Notre Mission"] }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full" }), _jsx("p", { className: "text-navy-700", children: "Former des professionnels de haut niveau dans les domaines de l'informatique et du num\u00E9rique, capables de r\u00E9pondre aux d\u00E9fis technologiques actuels et futurs de l'Afrique et du monde." }), _jsx("p", { className: "text-navy-700", children: "Nous nous engageons \u00E0 fournir une \u00E9ducation de qualit\u00E9, \u00E0 promouvoir la recherche et l'innovation, et \u00E0 contribuer au d\u00E9veloppement \u00E9conomique et social par la formation de talents qualifi\u00E9s." })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: 0.2 }, className: "space-y-6", children: [_jsxs("h2", { className: "text-3xl font-bold text-navy", children: [_jsx("span", { className: "inline-block mr-2", children: "\uD83D\uDC41\uFE0F" }), "Notre Vision"] }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full" }), _jsx("p", { className: "text-navy-700", children: "\u00CAtre l'institution de r\u00E9f\u00E9rence en Afrique pour l'excellence acad\u00E9mique et l'innovation dans les domaines de l'informatique et des technologies num\u00E9riques." }), _jsx("p", { className: "text-navy-700", children: "Nous aspirons \u00E0 cr\u00E9er un \u00E9cosyst\u00E8me \u00E9ducatif qui favorise la cr\u00E9ativit\u00E9, l'entrepreneuriat et l'apprentissage tout au long de la vie, permettant \u00E0 nos dipl\u00F4m\u00E9s de devenir des leaders dans leurs domaines respectifs." })] })] }) }) }), _jsx("section", { id: "section-histoire", className: "section py-16 bg-navy-50", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-navy", children: "Notre Histoire" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-navy-700", children: "Depuis sa fondation en 1994, l'ISI n'a cess\u00E9 d'\u00E9voluer pour devenir un acteur majeur de l'\u00E9ducation technologique en Afrique." })] }), _jsxs("div", { className: "relative max-w-5xl mx-auto mt-20", children: [_jsx(motion.div, { className: "absolute left-4 md:left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600 transform md:-translate-x-1/2 rounded-full", initial: { height: "0%" }, whileInView: { height: "100%" }, viewport: { once: true }, transition: { duration: 1.5, ease: "easeOut" } }), historyMilestones.map((milestone, index) => (_jsxs(motion.div, { className: `relative z-10 mb-20 flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`, initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7, delay: index * 0.2 }, children: [_jsx("div", { className: "absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20", children: _jsx(motion.div, { className: `w-12 h-12 bg-gradient-to-br ${index % 5 === 0 ? 'from-blue-500 to-blue-600' :
                                                    index % 5 === 1 ? 'from-emerald-500 to-emerald-600' :
                                                        index % 5 === 2 ? 'from-violet-500 to-violet-600' :
                                                            index % 5 === 3 ? 'from-amber-500 to-amber-600' :
                                                                'from-rose-500 to-rose-600'} rounded-full flex items-center justify-center shadow-lg`, whileHover: { scale: 1.2, rotate: 360 }, transition: { type: "spring", stiffness: 200, damping: 10 }, initial: { scale: 0 }, whileInView: { scale: 1 }, viewport: { once: true }, children: _jsx("span", { className: "text-xs text-white font-bold", children: milestone.year }) }) }), _jsx("div", { className: `pl-16 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`, children: _jsx(motion.div, { whileHover: { y: -5 }, transition: { type: "spring", stiffness: 300, damping: 10 }, children: _jsxs(Card, { className: `overflow-hidden border-l-4 ${index % 5 === 0 ? 'border-blue-500' :
                                                        index % 5 === 1 ? 'border-emerald-500' :
                                                            index % 5 === 2 ? 'border-violet-500' :
                                                                index % 5 === 3 ? 'border-amber-500' :
                                                                    'border-rose-500'} shadow-lg bg-white`, children: [_jsxs(CardHeader, { className: `pb-2 ${index % 5 === 0 ? 'bg-blue-50' :
                                                                index % 5 === 1 ? 'bg-emerald-50' :
                                                                    index % 5 === 2 ? 'bg-violet-50' :
                                                                        index % 5 === 3 ? 'bg-amber-50' :
                                                                            'bg-rose-50'}`, children: [_jsxs(CardTitle, { className: "text-navy flex items-center", children: [index === 0 && _jsx("span", { className: "material-icons mr-2", children: "school" }), index === 1 && _jsx("span", { className: "material-icons mr-2", children: "location_city" }), index === 2 && _jsx("span", { className: "material-icons mr-2", children: "handshake" }), index === 3 && _jsx("span", { className: "material-icons mr-2", children: "military_tech" }), index === 4 && _jsx("span", { className: "material-icons mr-2", children: "rocket_launch" }), milestone.event] }), _jsx(CardDescription, { className: "text-xs font-bold text-primary", children: milestone.year })] }), _jsx(CardContent, { className: "pt-4", children: _jsx("p", { className: "text-navy-700", children: milestone.description }) })] }) }) }), _jsx("div", { className: "hidden md:block md:w-1/2" })] }, index)))] })] }) }), _jsx("section", { id: "section-equipe", className: "section py-16 bg-white", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-navy", children: "Notre \u00C9quipe" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-navy-700", children: "Des professionnels passionn\u00E9s et experts dans leurs domaines qui \u0153uvrent pour la r\u00E9ussite de nos \u00E9tudiants." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: teamMembers.map((member, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: index * 0.1 }, whileHover: { y: -10 }, className: "rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white", children: [_jsx("div", { className: "h-64 overflow-hidden", children: _jsx(motion.img, { src: member.image, alt: member.name, className: "w-full h-full object-cover", whileHover: { scale: 1.1 }, transition: { duration: 0.4 } }) }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold mb-1 text-navy-800", children: member.name }), _jsx("div", { className: `w-12 h-1 bg-gradient-to-r ${member.color} rounded-full my-2` }), _jsx("p", { className: "text-primary-600 font-medium text-sm mb-3", children: member.role }), _jsx("p", { className: "text-navy-700 text-sm", children: member.bio })] })] }, index))) })] }) }), _jsx("section", { className: "section py-16 bg-gradient-to-br from-navy-50 to-primary-50", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-navy", children: "Nos Valeurs" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-navy-700", children: "Les principes qui guident notre action au quotidien et fa\u00E7onnent notre culture institutionnelle." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
                                { title: "Excellence", icon: "grade", description: "Nous visons l'excellence dans tous les aspects de notre institution, de l'enseignement à la recherche." },
                                { title: "Innovation", icon: "lightbulb", description: "Nous encourageons l'innovation et la créativité dans l'apprentissage et la résolution de problèmes." },
                                { title: "Intégrité", icon: "verified_user", description: "Nous agissons avec honnêteté, transparence et responsabilité dans toutes nos activités." },
                                { title: "Inclusion", icon: "diversity_3", description: "Nous valorisons la diversité et créons un environnement inclusif où chacun peut s'épanouir." },
                                { title: "Collaboration", icon: "handshake", description: "Nous favorisons l'esprit d'équipe et la collaboration entre étudiants, enseignants et partenaires." },
                                { title: "Engagement", icon: "volunteer_activism", description: "Nous sommes engagés envers la communauté et contribuons activement au développement socio-économique." }
                            ].map((value, index) => (_jsx(motion.div, { className: "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100", initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: index * 0.1 }, whileHover: { y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }, children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "w-14 h-14 bg-primary-100 text-primary rounded-full flex items-center justify-center mb-4", children: _jsx("span", { className: "material-icons text-2xl", children: value.icon }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-navy-800", children: value.title }), _jsx("p", { className: "text-navy-700", children: value.description })] }) }, index))) })] }) }), _jsx(SchoolInfo, {}), _jsx(Departments, {}), _jsx(Distinctions, {}), _jsx(Partners, {}), _jsx(Footer, {})] }));
};
export default About;
