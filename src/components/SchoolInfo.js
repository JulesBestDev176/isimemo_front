import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
const stats = [
    { value: 1994, suffix: '', label: 'Fondation', icon: 'event', color: 'from-blue-500 to-blue-700' },
    { value: 9, suffix: '', label: 'Campus', icon: 'location_on', color: 'from-emerald-500 to-emerald-700' },
    { value: 30, suffix: '+', label: 'Nationalités', icon: 'public', color: 'from-violet-500 to-violet-700' },
    { value: 27, suffix: '', label: 'Années d\'expérience', icon: 'history', color: 'from-amber-500 to-amber-700' }
];
const SchoolInfo = () => {
    return (_jsxs("section", { className: "section bg-gray-50", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx(motion.h2, { className: "text-3xl font-bold mb-4 text-navy", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, children: "L'ISI en chiffres" }), _jsx(motion.p, { className: "text-lg text-navy-700", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, children: "D\u00E9couvrez l'Institut Sup\u00E9rieur d'Informatique, une r\u00E9f\u00E9rence dans la formation de haut niveau." })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: stats.map((stat, index) => (_jsxs(motion.div, { className: "relative group", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.1 * index }, whileHover: { y: -10 }, children: [_jsx(motion.div, { className: `absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-70`, initial: { scale: 0.1, opacity: 0 }, whileInView: { scale: 1, opacity: 0.2 }, whileHover: {
                                scale: 1.2,
                                opacity: 0.2,
                                filter: "blur(20px)",
                                boxShadow: "0 0 30px rgba(255,255,255,0.6)"
                            }, animate: {
                                boxShadow: ["0 0 10px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0.4)", "0 0 10px rgba(255,255,255,0.2)"],
                            }, transition: {
                                duration: 0.4,
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }
                            } }), _jsxs("div", { className: "relative bg-white rounded-xl shadow-xl backdrop-blur-sm p-8 flex flex-col items-center overflow-hidden border border-white/30", children: [_jsx("div", { className: "absolute inset-0 opacity-5", children: _jsx("div", { className: "w-full h-full bg-grid-pattern" }) }), _jsx(motion.div, { className: `w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mb-5 shadow-lg`, whileHover: { rotate: 360 }, transition: { duration: 0.8 }, children: _jsx("span", { className: "material-icons text-2xl text-white", children: stat.icon }) }), (() => {
                                    const { count, ref } = useCounter(stat.value, 2, 0.5 + index * 0.2);
                                    return (_jsxs(motion.h3, { ref: ref, className: `text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${stat.color} font-mono`, whileHover: { scale: 1.1 }, transition: { type: "spring", stiffness: 400, damping: 10 }, children: [count, stat.suffix] }));
                                })(), _jsx(motion.div, { className: `w-12 h-1 bg-gradient-to-r ${stat.color} rounded-full my-2`, whileHover: { width: "80px" }, transition: { duration: 0.3 } }), _jsx("p", { className: "text-navy-700 font-medium", children: stat.label })] })] }, index))) }), _jsxs(motion.div, { className: "mt-20 rounded-2xl overflow-hidden shadow-2xl relative", initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-navy-800/95 via-navy-700/90 to-navy-600/90 z-0" }), _jsx("div", { className: "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 z-0" }), _jsxs("div", { className: "relative z-10 p-12 flex flex-col md:flex-row items-center text-white", children: [_jsxs(motion.div, { className: "md:w-1/2 mb-8 md:mb-0 md:pr-8", initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, children: [_jsx("h3", { className: "text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200", children: "Institut Sup\u00E9rieur d'Informatique" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-blue-300 to-primary-300 rounded-full mb-6" }), _jsx("p", { className: "text-blue-50 text-lg leading-relaxed", children: "Leader dans la formation en informatique et technologies num\u00E9riques en Afrique, l'ISI forme les professionnels et les leaders de demain avec une approche p\u00E9dagogique innovante et des partenariats internationaux d'excellence." }), _jsx(motion.div, { className: "flex flex-wrap gap-3 mt-6", initial: { opacity: 0 }, whileInView: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }, viewport: { once: true }, children: ["Excellence académique", "Innovation", "Leadership"].map((tag, i) => (_jsx(motion.span, { className: "px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm", initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }, viewport: { once: true }, transition: { delay: 0.3 + (i * 0.1) }, children: tag }, i))) })] }), _jsx(motion.div, { className: "md:w-1/2 flex justify-center", initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.4 }, children: _jsxs("div", { className: "w-64 h-64 relative", children: [_jsx(motion.div, { className: "absolute inset-0 bg-gradient-to-br from-blue-500 to-primary-600 rounded-full opacity-30 blur-2xl", animate: {
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.4, 0.3]
                                            }, transition: {
                                                duration: 5,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            } }), _jsx("div", { className: "relative w-full h-full flex items-center justify-center", children: _jsx(motion.span, { className: "material-symbols-outlined text-9xl text-white", animate: { rotateY: 360 }, transition: { duration: 8, repeat: Infinity, ease: "linear" }, children: "school" }) })] }) })] })] })] }));
};
export default SchoolInfo;
