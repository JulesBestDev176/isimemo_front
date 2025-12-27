import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Video, ChevronLeft, ChevronRight, MessageSquare, Edit, FileText, Search, Calendar, ArrowDown, ArrowUp, Clock } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { Link } from 'react-router-dom';
const soutenances = [
    {
        id: 1,
        titre: "Soutenance - Aminata Diallo",
        date: new Date(2025, 4, 20),
        heureDebut: "09:00",
        heureFin: "11:00",
        lieu: "Amphithéâtre B",
        modalite: "presentiel",
        etudiant: {
            nom: "Diallo",
            prenom: "Aminata",
            email: "a.diallo@isi.sn",
            niveau: "Master 2",
            specialite: "Systèmes d'Information",
        },
        jury: [
            { nom: "Dr. Mbaye", role: "Président", institution: "ISI" },
            { nom: "Prof. Diop", role: "Rapporteur", institution: "ISI" },
            { nom: "Dr. Sow", role: "Examinateur", institution: "UCAD" }
        ],
        memoire: {
            titre: "Optimisation des systèmes distribués pour les applications bancaires",
            fichier: "memoire-diallo.pdf",
            etat: "valide"
        },
        statut: "programmee"
    },
    {
        id: 2,
        titre: "Soutenance - Omar Ndiaye",
        date: new Date(2025, 4, 18),
        heureDebut: "14:00",
        heureFin: "16:00",
        lieu: "Zoom (ID: 765-432-109)",
        modalite: "ligne",
        etudiant: {
            nom: "Ndiaye",
            prenom: "Omar",
            email: "o.ndiaye@isi.sn",
            niveau: "Licence 3",
            specialite: "Réseaux et Télécommunications",
        },
        jury: [
            { nom: "Dr. Fall", role: "Président", institution: "ISI" },
            { nom: "Prof. Sarr", role: "Rapporteur", institution: "ISI" },
            { nom: "Dr. Diouf", role: "Examinateur", institution: "EPT" }
        ],
        memoire: {
            titre: "Sécurisation des réseaux IoT en environnement industriel",
            fichier: "memoire-ndiaye.pdf",
            etat: "valide"
        },
        statut: "programmee"
    },
    {
        id: 3,
        titre: "Soutenance - Fatou Mbaye",
        date: new Date(2025, 4, 15),
        heureDebut: "10:00",
        heureFin: "12:00",
        lieu: "Salle de conférence C",
        modalite: "presentiel",
        etudiant: {
            nom: "Mbaye",
            prenom: "Fatou",
            email: "f.mbaye@isi.sn",
            niveau: "Master 2",
            specialite: "Intelligence Artificielle",
        },
        jury: [
            { nom: "Prof. Diop", role: "Président", institution: "ISI" },
            { nom: "Dr. Ndiaye", role: "Rapporteur", institution: "ISI" },
            { nom: "Dr. Ly", role: "Examinateur", institution: "UCAD" }
        ],
        memoire: {
            titre: "Détection d'anomalies dans les systèmes de santé par deep learning",
            fichier: "memoire-mbaye.pdf",
            etat: "soutenu"
        },
        statut: "terminee",
        note: 18,
        feedback: "Excellente présentation et projet très innovant. Publication recommandée."
    },
    {
        id: 4,
        titre: "Soutenance - Moussa Seck",
        date: new Date(2025, 4, 12),
        heureDebut: "11:00",
        heureFin: "13:00",
        lieu: "Google Meet",
        modalite: "ligne",
        etudiant: {
            nom: "Seck",
            prenom: "Moussa",
            email: "m.seck@isi.sn",
            niveau: "Licence 3",
            specialite: "Génie Logiciel",
        },
        jury: [
            { nom: "Dr. Sarr", role: "Président", institution: "ISI" },
            { nom: "Prof. Diop", role: "Rapporteur", institution: "ISI" },
            { nom: "Dr. Fall", role: "Examinateur", institution: "ISI" }
        ],
        memoire: {
            titre: "Méthodologies Agiles adaptées au contexte africain",
            fichier: "memoire-seck.pdf",
            etat: "soutenu"
        },
        statut: "terminee",
        note: 16,
        feedback: "Très bonne recherche avec des applications pratiques intéressantes."
    }
];
const PageSoutenances = () => {
    const [dateActuelle, setDateActuelle] = useState(new Date());
    const [filtre, setFiltre] = useState("toutes");
    const [tri, setTri] = useState("date");
    const [triDirection, setTriDirection] = useState("asc");
    const [recherche, setRecherche] = useState("");
    // Filtrer les soutenances
    const soutenancesFiltrees = soutenances.filter(soutenance => {
        // Appliquer le filtre de statut
        if (filtre !== "toutes" && soutenance.statut !== filtre) {
            return false;
        }
        // Appliquer la recherche
        if (recherche) {
            const termeRecherche = recherche.toLowerCase();
            return (soutenance.titre.toLowerCase().includes(termeRecherche) ||
                soutenance.etudiant.nom.toLowerCase().includes(termeRecherche) ||
                soutenance.etudiant.prenom.toLowerCase().includes(termeRecherche) ||
                soutenance.memoire.titre.toLowerCase().includes(termeRecherche));
        }
        return true;
    });
    // Trier les soutenances
    const soutenancesTriees = [...soutenancesFiltrees].sort((a, b) => {
        let resultatComparaison = 0;
        if (tri === "date") {
            resultatComparaison = a.date.getTime() - b.date.getTime();
        }
        else if (tri === "etudiant") {
            resultatComparaison = `${a.etudiant.nom} ${a.etudiant.prenom}`.localeCompare(`${b.etudiant.nom} ${b.etudiant.prenom}`);
        }
        else if (tri === "niveau") {
            resultatComparaison = a.etudiant.niveau.localeCompare(b.etudiant.niveau);
        }
        return triDirection === "asc" ? resultatComparaison : -resultatComparaison;
    });
    // Navigation dans le calendrier
    const gererMoisPrecedent = () => {
        setDateActuelle(subMonths(dateActuelle, 1));
    };
    const gererMoisSuivant = () => {
        setDateActuelle(addMonths(dateActuelle, 1));
    };
    // Changer la direction du tri
    const changerTriDirection = () => {
        setTriDirection(triDirection === "asc" ? "desc" : "asc");
    };
    // Couleur en fonction du statut
    const obtenirCouleurStatut = (statut) => {
        switch (statut) {
            case "programmee": return "bg-blue-100 text-blue-800";
            case "terminee": return "bg-green-100 text-green-800";
            case "reportee": return "bg-amber-100 text-amber-800";
            case "annulee": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };
    // Libellé en fonction du statut
    const obtenirLibelleStatut = (statut) => {
        switch (statut) {
            case "programmee": return "Programmée";
            case "terminee": return "Terminée";
            case "reportee": return "Reportée";
            case "annulee": return "Annulée";
            default: return statut;
        }
    };
    // Couleur en fonction de la modalité
    const obtenirCouleurModalite = (modalite) => {
        return modalite === "ligne" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800";
    };
    return (_jsxs("div", { className: "container mx-auto py-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Gestion des soutenances" }), _jsx("div", { className: "space-x-2", children: _jsx(Button, { asChild: true, variant: "default", children: _jsx(Link, { to: "/calendrier/ajouter", children: "Planifier une soutenance" }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "col-span-1", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "Calendrier" }), _jsxs("div", { className: "flex space-x-1", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: gererMoisPrecedent, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "icon", onClick: gererMoisSuivant, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }), _jsx(CardDescription, { children: format(dateActuelle, 'MMMM yyyy', { locale: fr }) })] }), _jsx(CardContent, { children: _jsx(CalendarComponent, { mode: "single", selected: dateActuelle, onSelect: (date) => date && setDateActuelle(date), className: "rounded-md border w-full", month: dateActuelle, classNames: {
                                                months: "w-full",
                                                month: "w-full",
                                                table: "w-full border-collapse",
                                                head_cell: "text-muted-foreground rounded-md w-10 font-normal text-sm",
                                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                                day_today: "bg-accent text-accent-foreground",
                                                day_outside: "text-muted-foreground opacity-50"
                                            } }) }), _jsx(CardFooter, { children: _jsx(Button, { variant: "ghost", className: "w-full", onClick: () => setDateActuelle(new Date()), children: "Aujourd'hui" }) })] }), _jsxs(Card, { className: "mt-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Filtres" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Recherche" }), _jsxs("div", { className: "relative mt-1", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" }), _jsx(Input, { type: "text", placeholder: "Rechercher...", className: "pl-9", value: recherche, onChange: (e) => setRecherche(e.target.value) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Statut" }), _jsxs(Select, { value: filtre, onValueChange: setFiltre, children: [_jsx(SelectTrigger, { className: "mt-1", children: _jsx(SelectValue, { placeholder: "Toutes les soutenances" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "toutes", children: "Toutes les soutenances" }), _jsx(SelectItem, { value: "programmee", children: "Programm\u00E9es" }), _jsx(SelectItem, { value: "terminee", children: "Termin\u00E9es" }), _jsx(SelectItem, { value: "reportee", children: "Report\u00E9es" }), _jsx(SelectItem, { value: "annulee", children: "Annul\u00E9es" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Trier par" }), _jsxs("div", { className: "flex mt-1", children: [_jsxs(Select, { value: tri, onValueChange: setTri, children: [_jsx(SelectTrigger, { className: "rounded-r-none", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "date", children: "Date" }), _jsx(SelectItem, { value: "etudiant", children: "\u00C9tudiant" }), _jsx(SelectItem, { value: "niveau", children: "Niveau" })] })] }), _jsx(Button, { variant: "outline", className: "rounded-l-none border-l-0", onClick: changerTriDirection, children: triDirection === "asc" ? (_jsx(ArrowUp, { className: "h-4 w-4" })) : (_jsx(ArrowDown, { className: "h-4 w-4" })) })] })] })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Statistiques" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Total:" }), _jsx(Badge, { variant: "outline", children: soutenances.length })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Programm\u00E9es:" }), _jsx(Badge, { className: "bg-blue-100 text-blue-800", children: soutenances.filter(s => s.statut === "programmee").length })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "Termin\u00E9es:" }), _jsx(Badge, { className: "bg-green-100 text-green-800", children: soutenances.filter(s => s.statut === "terminee").length })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "En pr\u00E9sentiel:" }), _jsx(Badge, { className: "bg-teal-100 text-teal-800", children: soutenances.filter(s => s.modalite === "presentiel").length })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium", children: "En ligne:" }), _jsx(Badge, { className: "bg-indigo-100 text-indigo-800", children: soutenances.filter(s => s.modalite === "ligne").length })] })] }) })] })] }), _jsx("div", { className: "col-span-1 md:col-span-2", children: _jsxs(Tabs, { defaultValue: "liste", children: [_jsxs(TabsList, { className: "grid grid-cols-2 mb-4", children: [_jsx(TabsTrigger, { value: "liste", children: "Liste" }), _jsx(TabsTrigger, { value: "cartes", children: "Cartes" })] }), _jsx(TabsContent, { value: "liste", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Video, { className: "mr-2 h-5 w-5 text-green-500" }), "Soutenances"] }), _jsxs(CardDescription, { children: [soutenancesTriees.length, " soutenance(s) trouv\u00E9e(s)"] })] }), _jsx(CardContent, { children: _jsx(ScrollArea, { className: "h-[600px]", children: _jsx("div", { className: "space-y-4", children: soutenancesTriees.length > 0 ? (soutenancesTriees.map((soutenance) => (_jsxs("div", { className: "flex items-start space-x-4 p-4 border rounded-lg", children: [_jsx("div", { className: `p-2 rounded-full ${soutenance.statut === "terminee" ? "bg-green-100" : "bg-blue-100"}`, children: _jsx(Video, { className: `h-6 w-6 ${soutenance.statut === "terminee" ? "text-green-500" : "text-blue-500"}` }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("h3", { className: "font-semibold", children: soutenance.titre }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Badge, { className: obtenirCouleurStatut(soutenance.statut), children: obtenirLibelleStatut(soutenance.statut) }), _jsx(Badge, { className: obtenirCouleurModalite(soutenance.modalite), children: soutenance.modalite === "ligne" ? "En ligne" : "Présentiel" })] })] }), _jsxs("div", { className: "mt-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400" }), _jsx("span", { children: format(soutenance.date, 'EEEE d MMMM yyyy', { locale: fr }) })] }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-400" }), _jsxs("span", { children: [soutenance.heureDebut, " - ", soutenance.heureFin] })] }), _jsxs("div", { className: "mt-1", children: [_jsx("strong", { children: "\u00C9tudiant:" }), " ", soutenance.etudiant.prenom, " ", soutenance.etudiant.nom, " (", soutenance.etudiant.niveau, ")"] }), _jsxs("div", { className: "mt-1", children: [_jsx("strong", { children: "M\u00E9moire:" }), " ", soutenance.memoire.titre] }), _jsxs("div", { className: "mt-1", children: [_jsx("strong", { children: "Lieu:" }), " ", soutenance.lieu] }), soutenance.note && (_jsxs("div", { className: "mt-1", children: [_jsx("strong", { children: "Note:" }), " ", soutenance.note, "/20"] }))] }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/details/${soutenance.id}`, children: "D\u00E9tails" }) }), _jsx(Button, { variant: "outline", size: "sm", asChild: true, children: _jsx(Link, { to: `/calendrier/modifier/${soutenance.id}`, children: "Modifier" }) }), soutenance.statut === "programmee" && (_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(FileText, { className: "mr-1 h-3 w-3" }), "Proc\u00E8s-verbal"] })), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(MessageSquare, { className: "mr-1 h-3 w-3" }), "Notifier"] })] })] })] }, soutenance.id)))) : (_jsxs("div", { className: "text-center p-8", children: [_jsx(Video, { className: "mx-auto h-12 w-12 text-gray-300 mb-3" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Aucune soutenance trouv\u00E9e" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Aucune soutenance ne correspond \u00E0 vos crit\u00E8res de recherche." }), _jsx(Button, { className: "mt-4", onClick: () => {
                                                                        setFiltre("toutes");
                                                                        setRecherche("");
                                                                    }, children: "R\u00E9initialiser les filtres" })] })) }) }) })] }) }), _jsx(TabsContent, { value: "cartes", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: soutenancesTriees.length > 0 ? (soutenancesTriees.map((soutenance) => (_jsxs(Card, { className: "overflow-hidden", children: [_jsx("div", { className: `h-2 ${soutenance.statut === "programmee" ? "bg-blue-500" :
                                                        soutenance.statut === "terminee" ? "bg-green-500" :
                                                            soutenance.statut === "reportee" ? "bg-amber-500" :
                                                                "bg-red-500"}` }), _jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx(CardTitle, { className: "text-lg", children: soutenance.titre }), _jsx(Badge, { className: obtenirCouleurStatut(soutenance.statut), children: obtenirLibelleStatut(soutenance.statut) })] }), _jsxs(CardDescription, { children: [format(soutenance.date, 'EEEE d MMMM yyyy', { locale: fr }), " \u2022 ", soutenance.heureDebut, " - ", soutenance.heureFin] })] }), _jsx(CardContent, { className: "pb-2", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "\u00C9tudiant:" }), " ", soutenance.etudiant.prenom, " ", soutenance.etudiant.nom] }), _jsx(Badge, { className: obtenirCouleurModalite(soutenance.modalite), children: soutenance.modalite === "ligne" ? "En ligne" : "Présentiel" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Niveau:" }), " ", soutenance.etudiant.niveau] }), _jsxs("div", { className: "text-sm text-gray-600 line-clamp-2", children: [_jsx("strong", { children: "M\u00E9moire:" }), " ", soutenance.memoire.titre] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Lieu:" }), " ", soutenance.lieu] }), soutenance.note && (_jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Note:" }), " ", soutenance.note, "/20"] }))] }) }), _jsx(CardFooter, { children: _jsxs("div", { className: "w-full flex justify-between gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "flex-1", children: _jsx(Link, { to: `/calendrier/details/${soutenance.id}`, children: "D\u00E9tails" }) }), _jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "flex-1", children: _jsxs(Link, { to: `/calendrier/modifier/${soutenance.id}`, children: [_jsx(Edit, { className: "mr-1 h-3 w-3" }), "Modifier"] }) })] }) })] }, soutenance.id)))) : (_jsxs("div", { className: "col-span-1 md:col-span-2 text-center p-8 border rounded-lg", children: [_jsx(Video, { className: "mx-auto h-12 w-12 text-gray-300 mb-3" }), _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Aucune soutenance trouv\u00E9e" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Aucune soutenance ne correspond \u00E0 vos crit\u00E8res de recherche." }), _jsx(Button, { className: "mt-4", onClick: () => {
                                                        setFiltre("toutes");
                                                        setRecherche("");
                                                    }, children: "R\u00E9initialiser les filtres" })] })) }) })] }) })] })] }));
};
export default PageSoutenances;
