import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { AlertCircle, Bell, CalendarDays, CheckCircle, Clock, Inbox, Star, } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "../../components/ui/dialog";
import { mockNotifications } from "../../models/notification";
const FILTERS = [
    { id: "all", label: "Toutes" },
    { id: "unread", label: "Non lues" },
    { id: "urgent", label: "Urgentes" },
    { id: "memoire", label: "Mémoire" },
    { id: "ressource", label: "Ressources" },
    { id: "agenda", label: "Agenda" },
    { id: "general", label: "Général" },
];
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};
const getCategoryColor = (category) => {
    switch (category) {
        case "mémoire":
            return "bg-primary-100 text-primary-600";
        case "soutenance":
            return "bg-primary-100 text-primary-600";
        case "ressource":
            return "bg-primary-100 text-primary-600";
        case "agenda":
            return "bg-primary-100 text-primary-600";
        default:
            return "bg-primary-100 text-primary-600";
    }
};
const StudentNotifications = () => {
    var _a, _b;
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = useMemo(() => notifications.filter((notif) => notif.status === "unread").length, [notifications]);
    const urgentCount = useMemo(() => notifications.filter((notif) => notif.priority === "urgent" && notif.status === "unread").length, [notifications]);
    const agendaNotifications = useMemo(() => notifications.filter((notif) => notif.category === "soutenance" || notif.category === "agenda"), [notifications]);
    const nextEvent = useMemo(() => {
        const now = new Date();
        return [...agendaNotifications]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .find((notif) => new Date(notif.date) >= now);
    }, [agendaNotifications]);
    const recentUnread = useMemo(() => [...notifications]
        .filter((notif) => notif.status === "unread")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3), [notifications]);
    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesSearch = notification.title.toLowerCase().includes(search.toLowerCase()) ||
                notification.message.toLowerCase().includes(search.toLowerCase()) ||
                notification.source.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) {
                return false;
            }
            switch (filter) {
                case "unread":
                    return notification.status === "unread";
                case "urgent":
                    return notification.priority === "urgent";
                case "memoire":
                    return notification.category === "mémoire";
                case "ressource":
                    return notification.category === "ressource";
                case "agenda":
                    return notification.category === "agenda";
                case "general":
                    return notification.category === "général";
                default:
                    return true;
            }
        });
    }, [notifications, search, filter]);
    const handleMarkAsRead = (id) => {
        setNotifications((prev) => prev.map((notification) => notification.id === id
            ? Object.assign(Object.assign({}, notification), { status: "read" }) : notification));
    };
    const handleMarkAsUnread = (id) => {
        setNotifications((prev) => prev.map((notification) => notification.id === id
            ? Object.assign(Object.assign({}, notification), { status: "unread" }) : notification));
    };
    const handleToggleFavorite = (id) => {
        setNotifications((prev) => prev.map((notification) => notification.id === id
            ? Object.assign(Object.assign({}, notification), { priority: notification.priority === "urgent" ? "normal" : "urgent" }) : notification));
    };
    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => notification.status === "unread"
            ? Object.assign(Object.assign({}, notification), { status: "read" }) : notification));
    };
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Bell, { className: "h-4 w-4 text-primary" }), "Notifications \u2022 ", unreadCount, " non lues"] }), _jsxs("h1", { className: "text-3xl font-bold text-slate-900", children: ["Bonjour ", (_b = (_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) !== null && _b !== void 0 ? _b : "Étudiant", ", voici vos notifications"] }), _jsx("p", { className: "text-muted-foreground", children: "Restez inform\u00E9 de l'avancement de vos dossiers, soutenances et nouvelles ressources importantes." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", className: "gap-2", onClick: handleMarkAllAsRead, disabled: unreadCount === 0, children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Marquer tout comme lu"] }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "gap-2", children: [_jsx(Bell, { className: "h-4 w-4" }), "Centre de notifications"] }) }), _jsxs(DialogContent, { className: "max-w-2xl", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Centre de notifications" }), _jsx(DialogDescription, { children: "Aper\u00E7u rapide de vos alertes, \u00E9ch\u00E9ances et actions \u00E0 venir." })] }), _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("div", { className: "flex items-start justify-between border border-gray-200 bg-gray-50 p-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-muted-foreground", children: "Non lues" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-slate-900", children: unreadCount })] }), _jsx("div", { className: "rounded-full bg-primary/10 p-2 text-primary", children: _jsx(Bell, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "flex items-start justify-between border border-gray-200 bg-gray-50 p-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-muted-foreground", children: "Urgentes" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-slate-900", children: urgentCount })] }), _jsx("div", { className: "rounded-full bg-primary-100 p-2 text-primary-600", children: _jsx(AlertCircle, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "flex items-start justify-between border border-gray-200 bg-gray-50 p-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase text-muted-foreground", children: "Agenda & soutenances" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-slate-900", children: agendaNotifications.length })] }), _jsx("div", { className: "rounded-full bg-primary-100 p-2 text-primary-600", children: _jsx(CalendarDays, { className: "h-4 w-4" }) })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-900", children: "Derni\u00E8res notifications non lues" }), recentUnread.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Vous \u00EAtes \u00E0 jour, aucune notification non lue restante." })) : (recentUnread.map((notification) => (_jsxs("div", { className: "border border-gray-200 bg-gray-50 p-3", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "font-semibold text-slate-900", children: notification.title }), _jsx(Badge, { className: getCategoryColor(notification.category), children: notification.category }), notification.priority === "urgent" && (_jsx(Badge, { className: "bg-primary-100 text-primary-600", children: "Urgent" }))] }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: notification.message }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), formatDate(notification.date)] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Star, { className: "h-3 w-3 text-primary" }), notification.source] })] })] }, notification.id))))] }), nextEvent && (_jsxs(_Fragment, { children: [_jsx(Separator, {}), _jsxs("div", { className: "border border-dashed border-gray-300 bg-blue-50 p-4", children: [_jsx("p", { className: "text-xs font-semibold uppercase text-blue-600", children: "Prochain rendez-vous" }), _jsx("p", { className: "mt-1 text-lg font-semibold text-slate-900", children: nextEvent.title }), _jsx("p", { className: "text-sm text-slate-700", children: nextEvent.message }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm text-blue-700", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(CalendarDays, { className: "h-4 w-4" }), formatDate(nextEvent.date)] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Star, { className: "h-4 w-4" }), nextEvent.source] })] })] })] }))] })] })] })] })] }), _jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "flex items-center gap-2 text-lg font-semibold text-primary", children: [_jsx(AlertCircle, { className: "h-5 w-5" }), "R\u00E9sum\u00E9 du jour"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: unreadCount > 0
                                        ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}.`
                                        : "Vous êtes à jour, aucune notification non lue." })] }), _jsx("div", { className: "flex flex-wrap gap-2 text-sm text-muted-foreground", children: _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { className: "h-4 w-4 text-primary" }), "Mise \u00E0 jour : ", formatDate(new Date().toISOString())] }) })] }) }), _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row", children: [_jsxs("div", { className: "lg:w-72", children: [_jsxs("div", { className: "bg-white border border-gray-200", children: [_jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-base font-semibold mb-1", children: "Filtres rapides" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Affinez les notifications selon vos besoins" })] }), _jsxs("div", { className: "px-6 pb-6 space-y-2", children: [_jsx(Input, { placeholder: "Rechercher...", value: search, onChange: (event) => setSearch(event.target.value) }), _jsx(Separator, {}), _jsx("div", { className: "flex flex-col gap-2", children: FILTERS.map((item) => (_jsxs("button", { onClick: () => setFilter(item.id), className: `flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all ${filter === item.id
                                                        ? "bg-primary text-white shadow-sm"
                                                        : "border border-transparent bg-muted/40 text-muted-foreground hover:border-primary/20 hover:bg-muted"}`, children: [_jsx("span", { children: item.label }), item.id === "unread" && unreadCount > 0 && (_jsx(Badge, { variant: "secondary", className: "bg-white/20 text-white", children: unreadCount }))] }, item.id))) })] })] }), _jsxs("div", { className: "mt-4 bg-white border border-dashed border-primary/30 bg-primary/5 p-6", children: [_jsx("h3", { className: "text-base font-semibold mb-1", children: "Astuce ISIMemo" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Activez les notifications navigateur pour \u00EAtre alert\u00E9 en temps r\u00E9el lors de nouvelles mises \u00E0 jour." })] })] }), _jsxs("div", { className: "flex-1 bg-white border border-gray-200", children: [_jsxs("div", { className: "p-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-gray-200", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Toutes les notifications" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [filteredNotifications.length, " notification", filteredNotifications.length > 1 ? "s" : "", " affich\u00E9e", filteredNotifications.length > 1 ? "s" : ""] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Inbox, { className: "h-4 w-4" }), "Tri\u00E9es par date d\u00E9croissante"] })] }), _jsx("div", { className: "p-0", children: _jsxs(ScrollArea, { className: "h-[600px]", children: [_jsx("div", { className: "divide-y", children: filteredNotifications.map((notification) => (_jsxs("div", { className: `flex flex-col gap-3 p-4 transition hover:bg-muted/50 md:flex-row md:items-start md:gap-4 ${notification.status === "unread"
                                                    ? "bg-primary/5"
                                                    : "bg-background"}`, children: [_jsx("div", { className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary", children: _jsx(Bell, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: notification.title }), _jsx(Badge, { className: getCategoryColor(notification.category), children: notification.category }), notification.priority === "urgent" && (_jsx(Badge, { className: "bg-primary-100 text-primary-600", children: "Urgent" }))] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [_jsx(Clock, { className: "h-4 w-4" }), formatDate(notification.date)] })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: notification.message }), _jsx("div", { className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Star, { className: "h-4 w-4 text-primary" }), notification.source] }) }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [notification.status === "unread" ? (_jsxs(Button, { size: "sm", onClick: () => handleMarkAsRead(notification.id), className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Marquer comme lu"] })) : (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleMarkAsUnread(notification.id), className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Marquer comme non lu"] })), _jsxs(Button, { size: "sm", variant: "ghost", className: "gap-2", onClick: () => handleToggleFavorite(notification.id), children: [_jsx(AlertCircle, { className: "h-4 w-4" }), notification.priority === "urgent"
                                                                                ? "Marquer comme normal"
                                                                                : "Marquer comme urgent"] })] })] })] }, notification.id))) }), filteredNotifications.length === 0 && (_jsxs("div", { className: "flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground", children: [_jsx(Bell, { className: "h-10 w-10 text-primary" }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Aucun r\u00E9sultat" }), _jsx("p", { className: "text-sm", children: "Modifiez votre recherche ou vos filtres pour voir d'autres notifications." })] })] }))] }) })] })] })] }));
};
export default StudentNotifications;
