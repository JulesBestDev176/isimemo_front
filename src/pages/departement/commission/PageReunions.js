import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Calendar as IconeCalendrier, ChevronLeft, ChevronRight, MessageSquare, Users, Presentation, Globe, MapPin } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '../../components/ui/calendar';
import { Link } from 'react-router-dom';
const PageReunions = () => {
    const [dateActuelle, setDateActuelle] = useState(new Date());
    const [ongletSelectionne, setOngletSelectionne] = useState("reunions");
    // Données factices pour les réunions
    const evenements = [
        {
            id: 1,
            titre: "Réunion départementale",
            date: new Date(2025, 4, 15, 10, 0),
            dateFin: new Date(2025, 4, 15, 11, 30),
            type: "reunion",
            modalite: "presentiel",
            lieu: "Salle de conférence A",
            participants: ["Prof. Diop", "Prof. Seck", "Dr. Ndiaye"],
            description: "Réunion mensuelle du département pour discuter des avancées pédagogiques et des projets en cours."
        },
        {
            id: 2,
            titre: "Réunion comité pédagogique",
            date: new Date(2025, 4, 20, 14, 0),
            dateFin: new Date(2025, 4, 20, 16, 0),
            type: "reunion",
            modalite: "ligne",
            lien: "https://zoom.us/j/123456789",
            participants: ["Prof. Mbaye", "Dr. Fall", "Dr. Sarr", "Mme Diallo"],
            description: "Discussion sur les révisions du programme de Bachelor."
        },
        {
            id: 3,
            titre: "Séminaire IA et données",
            date: new Date(2025, 4, 18, 9, 0),
            dateFin: new Date(2025, 4, 18, 12, 0),
            type: "seminaire",
            modalite: "ligne",
            lien: "https://meet.google.com/abc-defg-hij",
            participants: ["Prof. Diop", "Dr. Ndiaye", "Étudiants M2"],
            description: "Présentation des avancées récentes en IA et traitement des données massives."
        },
        {
            id: 4,
            titre: "Séminaire Cybersécurité",
            date: new Date(2025, 4, 25, 14, 0),
            dateFin: new Date(2025, 4, 25, 17, 0),
            type: "seminaire",
            modalite: "presentiel",
            lieu: "Amphithéâtre A",
            participants: ["Dr. Fall", "Experts invités", "Étudiants L3 et Master"],
            description: "Séminaire sur les dernières tendances en cybersécurité et protection des données."
        }
    ];
    // Filtrer les événements par type
    const reunions = evenements.filter(evenement => evenement.type === "reunion");
    const seminaires = evenements.filter(evenement => evenement.type === "seminaire");
    // Navigation dans le calendrier
    const gererMoisPrecedent = () => {
        setDateActuelle(subMonths(dateActuelle, 1));
    };
    const gererMoisSuivant = () => {
        setDateActuelle(addMonths(dateActuelle, 1));
    };
    // Obtenir l'icône et la couleur en fonction du type d'événement
    const obtenirIconeEvenement = (type) => {
        switch (type) {
            case "reunion": return _jsx(Users, { className: "h-5 w-5 text-blue-500" });
            case "seminaire": return _jsx(Presentation, { className: "h-5 w-5 text-purple-500" });
            default: return _jsx(IconeCalendrier, { className: "h-5 w-5 text-gray-500" });
        }
    };
    const obtenirCouleurBadge = (type) => {
        switch (type) {
            case "reunion": return "bg-blue-100 text-blue-800";
            case "seminaire": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };
    const obtenirLibelleType = (type) => {
        switch (type) {
            case "reunion": return "Réunion";
            case "seminaire": return "Séminaire";
            default: return type;
        }
    };
    const obtenirCouleurModalite = (modalite) => {
        return modalite === "ligne" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800";
    };
    return (_jsxs("div", { className: "container mx-auto py-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Gestion des r\u00E9unions et s\u00E9minaires" }), _jsx("div", { className: "space-x-2", children: _jsx(Button, { asChild: true, variant: "default", children: _jsx(Link, { to: "/calendrier/ajouter", children: "Nouvel \u00E9v\u00E9nement" }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "col-span-1", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "Calendrier" }), _jsxs("div", { className: "flex space-x-1", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: gererMoisPrecedent, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "icon", onClick: gererMoisSuivant, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }), _jsx(CardDescription, { children: format(dateActuelle, 'MMMM yyyy', { locale: fr }) })] }), _jsx(CardContent, { children: _jsx(Calendar, { mode: "single", selected: dateActuelle, onSelect: (date) => date && setDateActuelle(date), className: "rounded-md border", month: dateActuelle, classNames: {
                                                months: "w-full",
                                                month: "w-full",
                                                table: "w-full border-collapse",
                                                head_cell: "text-muted-foreground rounded-md w-10 font-normal text-sm",
                                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                                day_today: "bg-accent text-accent-foreground",
                                                day_outside: "text-muted-foreground opacity-50"
                                            } }) }), _jsx(CardFooter, { children: _jsx(Button, { variant: "ghost", className: "w-full", onClick: () => setDateActuelle(new Date()), children: "Aujourd'hui" }) })] }), _jsxs(Card, { className: "mt-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Filtre rapide" }), _jsx(CardDescription, { children: "S\u00E9lectionnez un type d'\u00E9v\u00E9nement" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { variant: ongletSelectionne === "reunions" ? "default" : "outline", className: "w-full justify-start", onClick: () => setOngletSelectionne("reunions"), children: [_jsx(Users, { className: "mr-2 h-4 w-4 text-blue-500" }), "R\u00E9unions (", reunions.length, ")"] }), _jsxs(Button, { variant: ongletSelectionne === "seminaires" ? "default" : "outline", className: "w-full justify-start", onClick: () => setOngletSelectionne("seminaires"), children: [_jsx(Presentation, { className: "mr-2 h-4 w-4 text-purple-500" }), "S\u00E9minaires (", seminaires.length, ")"] })] }) })] })] }), _jsx("div", { className: "col-span-1 md:col-span-2", children: _jsxs(Tabs, { defaultValue: ongletSelectionne, value: ongletSelectionne, onValueChange: setOngletSelectionne, children: [_jsxs(TabsList, { className: "grid grid-cols-2 mb-4", children: [_jsx(TabsTrigger, { value: "reunions", children: "R\u00E9unions" }), _jsx(TabsTrigger, { value: "seminaires", children: "S\u00E9minaires" })] }), _jsx(TabsContent, { value: "reunions", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Users, { className: "mr-2 h-5 w-5 text-blue-500" }), "R\u00E9unions"] }), _jsx(CardDescription, { children: "G\u00E9rez les r\u00E9unions d\u00E9partementales et p\u00E9dagogiques" })] }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[400px]", children: _jsx("div", { className: "space-y-4", children: reunions.length > 0 ? (reunions.map((evenement) => {
                                                            var _a, _b;
                                                            return (_jsxs("div", { className: "flex items-start space-x-4 p-4 border rounded-lg", children: [_jsx("div", { className: "bg-blue-100 p-2 rounded-full", children: _jsx(Users, { className: "h-6 w-6 text-blue-500" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", children: evenement.titre }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [format(evenement.date, 'EEEE d MMMM yyyy', { locale: fr }), " \u2022", format(evenement.date, ' HH:mm'), " - ", format(evenement.dateFin, 'HH:mm')] }), _jsx("div", { className: "flex mt-1 items-center", children: _jsx(Badge, { className: obtenirCouleurModalite(evenement.modalite), children: evenement.modalite === "ligne" ? "En ligne" : "Présentiel" }) }), _jsx("div", { className: "mt-1 text-sm text-gray-600", children: evenement.modalite === "presentiel" ? (_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 text-gray-400 mr-1" }), evenement.lieu] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(Globe, { className: "h-4 w-4 text-gray-400 mr-1" }), _jsx("a", { href: evenement.lien, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline", children: ((_b = (_a = evenement.lien) === null || _a === void 0 ? void 0 : _a.split('//')[1]) === null || _b === void 0 ? void 0 : _b.split('/')[0]) || 'Lien de connexion' })] })) }), _jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: evenement.participants.map((participant, index) => (_jsx(Badge, { variant: "outline", className: "bg-gray-50", children: participant }, index))) }), _jsx("div", { className: "mt-2 text-sm text-gray-700", children: evenement.description }), _jsxs("div", { className: "mt-3 flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/details/${evenement.id}`, children: "D\u00E9tails" }) }), _jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/modifier/${evenement.id}`, children: "Modifier" }) }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(MessageSquare, { className: "mr-1 h-3 w-3" }), "Envoyer notification"] })] })] })] }, evenement.id));
                                                        })) : (_jsxs("div", { className: "text-center p-8", children: [_jsx(Users, { className: "mx-auto h-12 w-12 text-gray-300 mb-3" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Aucune r\u00E9union" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Vous n'avez pas encore planifi\u00E9 de r\u00E9unions." }), _jsx(Button, { className: "mt-4", asChild: true, children: _jsx(Link, { to: "/calendrier/ajouter", children: "Planifier une r\u00E9union" }) })] })) }) }) })] }) }), _jsx(TabsContent, { value: "seminaires", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Presentation, { className: "mr-2 h-5 w-5 text-purple-500" }), "S\u00E9minaires"] }), _jsx(CardDescription, { children: "G\u00E9rez les s\u00E9minaires et ateliers acad\u00E9miques" })] }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[400px]", children: _jsx("div", { className: "space-y-4", children: seminaires.length > 0 ? (seminaires.map((evenement) => {
                                                            var _a, _b;
                                                            return (_jsxs("div", { className: "flex items-start space-x-4 p-4 border rounded-lg", children: [_jsx("div", { className: "bg-purple-100 p-2 rounded-full", children: _jsx(Presentation, { className: "h-6 w-6 text-purple-500" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", children: evenement.titre }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [format(evenement.date, 'EEEE d MMMM yyyy', { locale: fr }), " \u2022", format(evenement.date, ' HH:mm'), " - ", format(evenement.dateFin, 'HH:mm')] }), _jsx("div", { className: "flex mt-1 items-center", children: _jsx(Badge, { className: obtenirCouleurModalite(evenement.modalite), children: evenement.modalite === "ligne" ? "En ligne" : "Présentiel" }) }), _jsx("div", { className: "mt-1 text-sm text-gray-600", children: evenement.modalite === "presentiel" ? (_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 text-gray-400 mr-1" }), evenement.lieu] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(Globe, { className: "h-4 w-4 text-gray-400 mr-1" }), _jsx("a", { href: evenement.lien, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline", children: ((_b = (_a = evenement.lien) === null || _a === void 0 ? void 0 : _a.split('//')[1]) === null || _b === void 0 ? void 0 : _b.split('/')[0]) || 'Lien de connexion' })] })) }), _jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: evenement.participants.map((participant, index) => (_jsx(Badge, { variant: "outline", className: "bg-gray-50", children: participant }, index))) }), _jsx("div", { className: "mt-2 text-sm text-gray-700", children: evenement.description }), _jsxs("div", { className: "mt-3 flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/details/${evenement.id}`, children: "D\u00E9tails" }) }), _jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/modifier/${evenement.id}`, children: "Modifier" }) }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(MessageSquare, { className: "mr-1 h-3 w-3" }), "Envoyer notification"] })] })] })] }, evenement.id));
                                                        })) : (_jsxs("div", { className: "text-center p-8", children: [_jsx(Presentation, { className: "mx-auto h-12 w-12 text-gray-300 mb-3" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Aucun s\u00E9minaire" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Vous n'avez pas encore planifi\u00E9 de s\u00E9minaires." }), _jsx(Button, { className: "mt-4", asChild: true, children: _jsx(Link, { to: "/calendrier/ajouter", children: "Planifier un s\u00E9minaire" }) })] })) }) }) })] }) })] }) })] })] }));
};
export default PageReunions;
