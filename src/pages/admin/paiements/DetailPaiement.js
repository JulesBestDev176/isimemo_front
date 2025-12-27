import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiDownload, FiArrowLeft, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
const DetailPaiement = () => {
    const { id } = useParams();
    // Données factices pour un paiement spécifique
    const detailPaiement = {
        id: 'PAY-2025-001',
        date: '15/05/2025',
        heure: '09:47',
        montant: '25.000 FCFA',
        methode: 'Orange Money',
        statut: 'Complété',
        reference: 'OM-243675849',
        description: 'Renouvellement abonnement Premium',
        periodePaiement: '16/05/2025 - 15/06/2025',
        idTransaction: 'TXN-89752364'
    };
    const obtenirBadgeStatut = (statut) => {
        switch (statut) {
            case 'Complété':
                return (_jsxs("span", { className: "px-3 py-1 inline-flex items-center bg-green-100 text-green-800 rounded-full text-sm font-medium", children: [_jsx(FiCheck, { className: "mr-1" }), statut] }));
            case 'En cours':
                return (_jsxs("span", { className: "px-3 py-1 inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium", children: [_jsx(FiClock, { className: "mr-1" }), statut] }));
            case 'Échoué':
                return (_jsxs("span", { className: "px-3 py-1 inline-flex items-center bg-red-100 text-red-800 rounded-full text-sm font-medium", children: [_jsx(FiX, { className: "mr-1" }), statut] }));
            default:
                return _jsx("span", { children: statut });
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs(Link, { to: "/paiement/historique", className: "flex items-center text-gray-600 hover:text-gray-800", children: [_jsx(FiArrowLeft, { className: "mr-2" }), _jsx("span", { children: "Retour \u00E0 l'historique" })] }) }), _jsx("div", { className: "max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "D\u00E9tails du paiement" }), obtenirBadgeStatut(detailPaiement.statut)] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h2", { className: "text-xl font-semibold", children: ["Re\u00E7u #", detailPaiement.id] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors", children: [_jsx(FiDownload, {}), _jsx("span", { children: "T\u00E9l\u00E9charger" })] })] }), _jsx("div", { className: "border-t border-b py-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm text-gray-500 uppercase mb-3", children: "Informations de paiement" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Date de paiement" }), _jsxs("p", { className: "font-medium", children: [detailPaiement.date, " \u00E0 ", detailPaiement.heure] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Montant" }), _jsx("p", { className: "font-medium text-lg", children: detailPaiement.montant })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "M\u00E9thode de paiement" }), _jsx("p", { className: "font-medium", children: detailPaiement.methode })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "R\u00E9f\u00E9rence externe" }), _jsx("p", { className: "font-medium", children: detailPaiement.reference })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm text-gray-500 uppercase mb-3", children: "D\u00E9tails de la transaction" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Description" }), _jsx("p", { className: "font-medium", children: detailPaiement.description })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "P\u00E9riode d'abonnement" }), _jsx("p", { className: "font-medium", children: detailPaiement.periodePaiement })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "ID de transaction" }), _jsx("p", { className: "font-medium font-mono", children: detailPaiement.idTransaction })] })] })] })] }) })] }), _jsxs("div", { className: "bg-gray-50 p-6 rounded-lg", children: [_jsx("h3", { className: "font-medium mb-3", children: "Informations de facturation" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Factur\u00E9 \u00E0" }), _jsx("p", { className: "font-medium", children: "ISI Memo Admin" }), _jsx("p", { children: "Institut Sup\u00E9rieur d'Informatique" }), _jsx("p", { children: "Dakar, S\u00E9n\u00E9gal" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "\u00C9mis par" }), _jsx("p", { className: "font-medium", children: "ISI Memo Services" }), _jsx("p", { children: "Boulevard des Technologies" }), _jsx("p", { children: "Dakar, S\u00E9n\u00E9gal" })] })] })] }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsx(Link, { to: "/paiement/nouveau", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors", children: "Effectuer un nouveau paiement" }) })] }) })] }));
};
export default DetailPaiement;
