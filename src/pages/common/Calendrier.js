import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Presentation, AlertCircle, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvenements, mockSoutenances, TypeEvenement, ModeSoutenance } from '../../models';
// Utilitaires de date
const formatDate = (date, format = 'short') => {
    if (format === 'short') {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};
const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};
const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};
const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
// Badge Component
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
// Calendrier simple
const SimpleCalendar = ({ selectedDate, onDateSelect, eventsOnDays }) => {
    const today = new Date();
    const [displayedMonth, setDisplayedMonth] = React.useState(selectedDate ? selectedDate.getMonth() : today.getMonth());
    const [displayedYear, setDisplayedYear] = React.useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
    React.useEffect(() => {
        if (selectedDate) {
            setDisplayedMonth(selectedDate.getMonth());
            setDisplayedYear(selectedDate.getFullYear());
        }
    }, [selectedDate]);
    const currentMonth = new Date(displayedYear, displayedMonth, 1);
    const year = displayedYear;
    const month = displayedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));
    const days = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    const handlePrevMonth = () => {
        if (month === 0) {
            setDisplayedMonth(11);
            setDisplayedYear(year - 1);
        }
        else {
            setDisplayedMonth(month - 1);
        }
    };
    const handleNextMonth = () => {
        if (month === 11) {
            setDisplayedMonth(0);
            setDisplayedYear(year + 1);
        }
        else {
            setDisplayedMonth(month + 1);
        }
    };
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("button", { onClick: handlePrevMonth, className: "p-2 hover:bg-navy-100 rounded-lg transition-colors", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("div", { className: "text-lg font-medium text-gray-900", children: [months[month], " ", year] }), _jsx("button", { onClick: handleNextMonth, className: "p-2 hover:bg-navy-100 rounded-lg transition-colors", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center mb-2", children: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (_jsx("div", { className: "text-xs font-medium text-slate-500 py-2", children: day }, i))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day, index) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = day.getMonth() === month;
                    const hasEvent = eventsOnDays.includes(formatDateKey(day));
                    return (_jsxs("button", { onClick: () => onDateSelect(day), className: `
                h-10 w-10 text-sm transition-colors duration-200 relative border rounded
                ${isSelected
                            ? 'bg-navy text-white border-navy'
                            : isToday
                                ? 'bg-navy-100 text-navy-dark font-medium border-slate-300'
                                : isCurrentMonth
                                    ? 'text-slate-700 hover:bg-navy-50 border-transparent'
                                    : 'text-slate-400 border-transparent'}
              `, children: [day.getDate(), hasEvent && (_jsx("div", { className: "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-navy rounded-full" }))] }, index));
                }) })] }));
};
// Composant principal
const Calendrier = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    // Combiner les événements et les soutenances
    const allEvents = useMemo(() => {
        const events = [];
        // Ajouter les événements du calendrier
        mockEvenements.forEach(event => {
            events.push(event);
        });
        // Ajouter les soutenances si elles existent
        if (mockSoutenances && mockSoutenances.length > 0) {
            mockSoutenances.forEach(soutenance => {
                events.push({
                    type: 'soutenance',
                    data: soutenance
                });
            });
        }
        return events;
    }, []);
    // Jours avec événements
    const joursAvecEvenements = useMemo(() => {
        const jours = [];
        allEvents.forEach(event => {
            if ('dateDebut' in event) {
                jours.push(formatDateKey(event.dateDebut));
            }
            else if (event.type === 'soutenance' && event.data.dateSoutenance) {
                jours.push(formatDateKey(event.data.dateSoutenance));
            }
        });
        return Array.from(new Set(jours));
    }, [allEvents]);
    // Événements du jour sélectionné
    const evenementsDuJour = useMemo(() => {
        if (!selectedDate)
            return [];
        return allEvents.filter(event => {
            if ('dateDebut' in event) {
                return isSameDay(event.dateDebut, selectedDate);
            }
            else if (event.type === 'soutenance' && event.data.dateSoutenance) {
                return isSameDay(event.data.dateSoutenance, selectedDate);
            }
            return false;
        });
    }, [selectedDate, allEvents]);
    // Obtenir le type d'événement pour l'affichage
    const getEventTypeLabel = (event) => {
        if (event.type === 'soutenance') {
            return 'Soutenance';
        }
        if ('type' in event) {
            const types = {
                [TypeEvenement.SOUTENANCE]: 'Soutenance',
                [TypeEvenement.ECHANCE]: 'Échéance',
                [TypeEvenement.RENDEZ_VOUS]: 'Rendez-vous',
                [TypeEvenement.AUTRE]: 'Autre'
            };
            return types[event.type] || 'Événement';
        }
        return 'Événement';
    };
    // Obtenir la couleur selon le type
    const getEventColor = (event) => {
        if (event.type === 'soutenance') {
            return 'bg-primary-100 border-primary-300 text-primary-900';
        }
        if ('type' in event) {
            switch (event.type) {
                case TypeEvenement.SOUTENANCE:
                    return 'bg-primary-100 border-primary-300 text-primary-900';
                case TypeEvenement.ECHANCE:
                    return 'bg-orange-100 border-orange-300 text-orange-900';
                case TypeEvenement.RENDEZ_VOUS:
                    return 'bg-blue-100 border-blue-300 text-blue-900';
                default:
                    return 'bg-gray-100 border-gray-300 text-gray-900';
            }
        }
        return 'bg-gray-100 border-gray-300 text-gray-900';
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Calendrier" }), _jsx("p", { className: "text-sm text-gray-600", children: "Consultez vos \u00E9v\u00E9nements, \u00E9ch\u00E9ances et soutenances" })] }), _jsxs("button", { onClick: () => setSelectedDate(new Date()), className: "btn-primary flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2" }), "Aujourd'hui"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white border border-gray-200", children: _jsx(SimpleCalendar, { selectedDate: selectedDate, onDateSelect: setSelectedDate, eventsOnDays: joursAvecEvenements }) }), _jsxs("div", { className: "lg:col-span-2 bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedDate ? formatDate(selectedDate, 'long') : 'Sélectionnez une date' }), _jsxs(Badge, { variant: "info", children: [evenementsDuJour.length, " \u00E9v\u00E9nement", evenementsDuJour.length > 1 ? 's' : ''] })] }), evenementsDuJour.length > 0 ? (_jsx("div", { className: "space-y-4", children: _jsx(AnimatePresence, { children: evenementsDuJour.map((event, index) => {
                                            const isSoutenance = 'type' in event && event.type === 'soutenance';
                                            const eventData = isSoutenance ? event.data : event;
                                            return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2, delay: index * 0.05 }, className: `border rounded-lg p-4 ${getEventColor(event)}`, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0 mr-4", children: isSoutenance ? (_jsx(Presentation, { className: "h-5 w-5" })) : event.type === TypeEvenement.ECHANCE ? (_jsx(AlertCircle, { className: "h-5 w-5" })) : (_jsx(Calendar, { className: "h-5 w-5" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: isSoutenance ? 'Soutenance de mémoire' : event.titre }), _jsx(Badge, { variant: "info", children: getEventTypeLabel(event) })] }), isSoutenance ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: event.data.mode === ModeSoutenance.PRESENTIEL
                                                                                ? 'Soutenance en présentiel'
                                                                                : 'Soutenance en ligne' }), _jsxs("div", { className: "space-y-1 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), _jsxs("span", { children: [event.data.heureDebut, " - ", event.data.heureFin, ' ', "(", event.data.duree, " min)"] })] }), event.data.mode === ModeSoutenance.PRESENTIEL && (_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Lieu \u00E0 confirmer" })] })), event.data.mode === ModeSoutenance.LIGNE && (_jsxs("div", { className: "flex items-center", children: [_jsx(Video, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: "Lien de connexion \u00E0 venir" })] }))] })] })) : (_jsxs(_Fragment, { children: [event.description && (_jsx("p", { className: "text-sm text-gray-600 mb-2", children: event.description })), _jsxs("div", { className: "space-y-1 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), _jsxs("span", { children: [formatTime(event.dateDebut), event.dateFin &&
                                                                                                    ` - ${formatTime(event.dateFin)}`] })] }), event.lieu && (_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: event.lieu })] }))] })] }))] })] }) }, index));
                                        }) }) })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Calendar, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun \u00E9v\u00E9nement pr\u00E9vu pour cette date" })] }))] })] }), allEvents.length > 0 && (_jsxs("div", { className: "mt-6 bg-white border border-gray-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-4", children: "Prochains \u00E9v\u00E9nements" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: allEvents
                                .filter(event => {
                                const eventDate = 'dateDebut' in event
                                    ? event.dateDebut
                                    : event.type === 'soutenance' && event.data.dateSoutenance
                                        ? event.data.dateSoutenance
                                        : null;
                                return eventDate && eventDate >= new Date();
                            })
                                .sort((a, b) => {
                                const dateA = 'dateDebut' in a
                                    ? a.dateDebut.getTime()
                                    : a.type === 'soutenance' && a.data.dateSoutenance
                                        ? a.data.dateSoutenance.getTime()
                                        : 0;
                                const dateB = 'dateDebut' in b
                                    ? b.dateDebut.getTime()
                                    : b.type === 'soutenance' && b.data.dateSoutenance
                                        ? b.data.dateSoutenance.getTime()
                                        : 0;
                                return dateA - dateB;
                            })
                                .slice(0, 6)
                                .map((event, index) => {
                                const isSoutenance = 'type' in event && event.type === 'soutenance';
                                const eventDate = isSoutenance
                                    ? event.data.dateSoutenance
                                    : event.dateDebut;
                                return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: index * 0.05 }, className: `border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getEventColor(event)}`, onClick: () => setSelectedDate(eventDate), children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0 mr-3", children: isSoutenance ? (_jsx(Presentation, { className: "h-5 w-5" })) : (_jsx(Calendar, { className: "h-5 w-5" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 text-sm mb-1", children: isSoutenance ? 'Soutenance' : event.titre }), _jsxs("p", { className: "text-xs text-gray-600", children: [formatDate(eventDate), " \u2022 ", formatTime(eventDate)] })] })] }) }, index));
                            }) })] }))] }) }));
};
export default Calendrier;
