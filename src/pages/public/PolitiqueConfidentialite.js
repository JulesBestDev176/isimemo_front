import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
const PolitiqueConfidentialite = () => {
    useEffect(() => {
        document.title = "Politique de Confidentialité - ISIMemo";
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-white flex flex-col", children: [_jsx(Navbar, {}), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 }, className: "flex-grow", children: [_jsxs(motion.div, { className: "relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 }, children: [_jsx(motion.div, { className: "absolute top-1/4 right-10 w-64 h-64 rounded-full bg-white opacity-10", animate: {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360],
                                }, transition: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                } }), _jsx(motion.div, { className: "absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-blue-300 opacity-10", animate: {
                                    scale: [1.2, 1, 1.2],
                                    x: [0, 30, 0]
                                }, transition: {
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } }), _jsx(motion.div, { className: "absolute top-1/3 left-1/5 w-24 h-24 rounded-full bg-yellow-200 opacity-20", animate: {
                                    y: [0, -40, 0],
                                    x: [0, 20, 0],
                                }, transition: {
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } }), _jsx("div", { className: "container-fluid relative z-10 flex-grow flex flex-col justify-center items-center px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center mt-16", children: [_jsx(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: _jsxs("span", { className: "inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4", children: [_jsx("span", { className: "material-icons text-yellow-200 text-xs mr-1", style: { verticalAlign: 'middle' }, children: "privacy_tip" }), "Protection des donn\u00E9es"] }) }), _jsxs(motion.h1, { className: "text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.1 }, children: ["Politique de ", _jsxs(motion.span, { className: "relative inline-block", whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 300 }, children: ["Confidentialit\u00E9", _jsx(motion.div, { className: "absolute bottom-0 left-0 w-full h-1 bg-yellow-300", initial: { width: 0 }, animate: { width: "100%" }, transition: { duration: 1, delay: 0.8 } })] })] }), _jsx(motion.p, { className: "text-lg md:text-xl text-blue-50 mb-10 max-w-3xl mx-auto", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.3 }, children: "D\u00E9couvrez comment nous prot\u00E9geons vos donn\u00E9es personnelles et respectons votre vie priv\u00E9e sur la plateforme ISIMemo." }), _jsxs(motion.div, { className: "flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6", initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.5 }, children: [_jsx("a", { href: "#content", children: _jsxs(motion.button, { className: "w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/90 text-primary-600 font-medium rounded-full shadow-lg flex items-center justify-center", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 10 }, children: [_jsx("span", { className: "material-icons mr-2", children: "shield" }), "Consulter la politique"] }) }), _jsx("a", { href: "/contact", children: _jsxs(motion.button, { className: "w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-medium rounded-full flex items-center justify-center", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, transition: { type: "spring", stiffness: 400, damping: 10 }, children: [_jsx("span", { className: "material-icons mr-2", children: "contact_support" }), "Une question ?"] }) })] })] }) }), _jsx(motion.div, { className: "absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10", initial: { opacity: 0 }, animate: { opacity: 1, y: [0, 10, 0] }, transition: {
                                    opacity: { delay: 1.5, duration: 1 },
                                    y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }, onClick: () => {
                                    const contentElement = document.getElementById('content');
                                    if (contentElement) {
                                        contentElement.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-white text-sm mb-2", children: "D\u00E9couvrir le contenu" }), _jsx("span", { className: "material-icons text-white", children: "expand_more" })] }) }), _jsx("div", { className: "absolute bottom-0 left-0 w-full overflow-hidden", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1440 110", className: "fill-white", children: _jsx("path", { d: "M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" }) }) })] }), _jsx("section", { id: "content", className: "section py-16 bg-white", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-navy", children: "Notre Engagement pour votre Vie Priv\u00E9e" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-navy-700", children: "Chez ISI, la protection de vos donn\u00E9es personnelles est une priorit\u00E9 absolue. Cette politique d\u00E9taille nos pratiques." })] }), _jsx("div", { className: "max-w-4xl mx-auto", children: [
                                        {
                                            icon: "info",
                                            title: "Article 1 : Informations collectées",
                                            content: "Lorsque vous visitez notre site ou utilisez ISIMemo, nous collectons automatiquement certaines informations sur votre appareil, notamment des informations sur votre navigateur Web, votre adresse IP, votre fuseau horaire et certains des cookies installés sur votre appareil. De plus, lorsque vous naviguez sur le site, nous collectons des informations sur les pages que vous consultez, les sites Web qui vous ont renvoyé au site, et comment vous interagissez avec le site. Nous collectons également les informations que vous nous fournissez directement lors de votre inscription ou utilisation de nos services."
                                        },
                                        {
                                            icon: "how_to_reg",
                                            title: "Article 2 : Utilisation de vos données",
                                            content: "Nous utilisons les informations que nous collectons généralement pour fournir, maintenir, et améliorer nos services ISIMemo. Ces informations nous permettent de communiquer avec vous, de personnaliser votre expérience sur la plateforme, d'assurer la sécurité de nos services, et d'améliorer continuellement nos fonctionnalités. Nous utilisons également ces données pour dépister notre site à la recherche de risques et de fraudes potentiels, et plus généralement pour améliorer et optimiser notre site selon les besoins de nos utilisateurs."
                                        },
                                        {
                                            icon: "share",
                                            title: "Article 3 : Partage de vos informations",
                                            content: "Nous partageons vos informations personnelles uniquement dans les cas décrits dans cette section. Nous ne vendons, ne louons ni ne divulguons d'une autre manière vos informations personnelles à des tiers à des fins commerciales. Nous pouvons partager vos informations pour nous conformer aux lois et réglementations applicables, pour répondre à une citation à comparaître, à un mandat de perquisition ou à toute autre demande légale d'informations que nous recevons, ou pour protéger nos droits."
                                        },
                                        {
                                            icon: "security",
                                            title: "Article 4 : Sécurité de vos données",
                                            content: "Nous prenons la sécurité de vos données personnelles au sérieux et utilisons des mesures de sécurité appropriées pour protéger vos informations contre l'accès, l'altération, la divulgation ou la destruction non autorisés. Nous utilisons le chiffrement SSL pour sécuriser les transmissions de données, nous limitons l'accès aux données personnelles aux employés qui en ont besoin pour exercer leurs fonctions, et nous effectuons régulièrement des audits de sécurité pour identifier et corriger les vulnérabilités potentielles."
                                        },
                                        {
                                            icon: "account_balance",
                                            title: "Article 5 : Vos droits",
                                            content: "Vous avez certains droits concernant vos informations personnelles. En fonction de votre lieu de résidence, vous pouvez avoir le droit d'accéder, de corriger, de mettre à jour ou de demander la suppression de vos informations personnelles. Si vous souhaitez examiner, corriger, mettre à jour ou supprimer vos informations personnelles, vous pouvez nous contacter en utilisant les coordonnées fournies ci-dessous. Nous répondrons à votre demande dans un délai raisonnable."
                                        },
                                        {
                                            icon: "cookie",
                                            title: "Article 6 : Cookies et technologies de suivi",
                                            content: "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser la façon dont notre site est utilisé, et à des fins de marketing. Les cookies sont de petits fichiers de données qui sont placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site Web. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir lorsqu'un cookie est envoyé. Cependant, si vous n'acceptez pas les cookies, vous ne pourrez peut-être pas utiliser certaines parties de notre site."
                                        }
                                    ].map((article, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: index * 0.1 }, className: "bg-gray-50 rounded-xl p-8 mb-8 hover:bg-primary-50 transition-all duration-300 hover:shadow-lg", children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary text-xl", children: article.icon }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-navy-800", children: article.title }), _jsx("p", { className: "text-navy-700 leading-relaxed", children: article.content })] })] }) }, index))) }), _jsx(motion.div, { className: "text-center mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.6 }, children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h3", { className: "text-2xl font-bold mb-4 text-navy-800", children: "Des questions sur notre politique ?" }), _jsx("p", { className: "text-navy-700 mb-6", children: "Notre \u00E9quipe est \u00E0 votre disposition pour r\u00E9pondre \u00E0 toutes vos questions concernant cette politique de confidentialit\u00E9 et la protection de vos donn\u00E9es." }), _jsxs(motion.a, { href: "/contact", className: "inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-600 transition-all shadow-md hover:shadow-lg", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: [_jsx("span", { className: "material-icons mr-2", children: "contact_support" }), "Nous contacter"] })] }) })] }) })] }), _jsx(Footer, {})] }));
};
export default PolitiqueConfidentialite;
