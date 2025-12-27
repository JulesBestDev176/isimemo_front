import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
// Logos des méthodes de paiement
const logoWave = 'https://www.wave.com/static/media/logo-wave.svg';
const logoOrangeMoney = 'https://www.orangemoney.com/assets/logo-orange-money.png';
const NouveauPaiement = () => {
    const [methodeSelectionnee, setMethodeSelectionnee] = useState('orange-money');
    const [numeroTelephone, setNumeroTelephone] = useState('');
    const [numeroCarte, setNumeroCarte] = useState('');
    const [dateExpiration, setDateExpiration] = useState('');
    const [codeCvv, setCodeCvv] = useState('');
    const [nomCarte, setNomCarte] = useState('');
    const [estEnTraitement, setEstEnTraitement] = useState(false);
    const [statutPaiement, setStatutPaiement] = useState('attente');
    const methodesPaiement = [
        {
            id: 'orange-money',
            nom: 'Orange Money',
            logo: '/api/placeholder/80/30',
        },
        {
            id: 'wave',
            nom: 'Wave',
            logo: '/api/placeholder/80/30',
        },
        {
            id: 'carte',
            nom: 'Carte bancaire',
            logo: '/api/placeholder/80/30',
        },
    ];
    const soumettreFormulaire = (e) => {
        e.preventDefault();
        setEstEnTraitement(true);
        // Simulation d'un traitement de paiement
        setTimeout(() => {
            setEstEnTraitement(false);
            setStatutPaiement('succes');
        }, 2000);
    };
    const formaterNumeroCarte = (valeur) => {
        const v = valeur.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const correspondances = v.match(/\d{4,16}/g);
        const correspondance = (correspondances && correspondances[0]) || '';
        const parties = [];
        for (let i = 0; i < correspondance.length; i += 4) {
            parties.push(correspondance.substring(i, i + 4));
        }
        if (parties.length) {
            return parties.join(' ');
        }
        else {
            return valeur;
        }
    };
    const formaterDateExpiration = (valeur) => {
        const v = valeur.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return valeur;
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs(Link, { to: "/paiement/abonnement", className: "flex items-center text-gray-600 hover:text-gray-800", children: [_jsx(FiArrowLeft, { className: "mr-2" }), _jsx("span", { children: "Retour aux paiements" })] }) }), _jsx("h1", { className: "text-2xl font-bold mb-6", children: "Effectuer un paiement" }), statutPaiement === 'attente' && (_jsx("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "D\u00E9tails du paiement" }), _jsx("p", { className: "text-gray-600", children: "Renouvellement de l'abonnement Premium" }), _jsxs("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-gray-600", children: "Montant \u00E0 payer:" }), _jsx("span", { className: "font-bold", children: "25.000 FCFA" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "P\u00E9riode:" }), _jsx("span", { children: "16/05/2025 - 15/06/2025" })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Choisissez votre m\u00E9thode de paiement" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: methodesPaiement.map((methode) => (_jsxs("button", { className: `border rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${methodeSelectionnee === methode.id
                                            ? 'border-primary bg-primary bg-opacity-5'
                                            : 'border-gray-200 hover:bg-gray-50'}`, onClick: () => setMethodeSelectionnee(methode.id), children: [_jsx("div", { className: "w-20 h-10 mb-2 flex items-center justify-center", children: methode.id === 'carte' ? (_jsx(FiCreditCard, { size: 30, className: "text-gray-600" })) : (_jsx("img", { src: methode.logo, alt: methode.nom, className: "h-10 object-contain" })) }), _jsx("span", { className: methodeSelectionnee === methode.id ? 'text-primary font-medium' : '', children: methode.nom })] }, methode.id))) })] }), _jsxs("form", { onSubmit: soumettreFormulaire, children: [methodeSelectionnee === 'orange-money' && (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "telephone", children: "Num\u00E9ro de t\u00E9l\u00E9phone Orange" }), _jsx("input", { type: "tel", id: "telephone", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Exemple: 77 123 45 67", value: numeroTelephone, onChange: (e) => setNumeroTelephone(e.target.value), required: true }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Vous recevrez une notification sur votre t\u00E9l\u00E9phone pour confirmer le paiement." })] })), methodeSelectionnee === 'wave' && (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "telephone-wave", children: "Num\u00E9ro de t\u00E9l\u00E9phone Wave" }), _jsx("input", { type: "tel", id: "telephone-wave", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "Exemple: 77 123 45 67", value: numeroTelephone, onChange: (e) => setNumeroTelephone(e.target.value), required: true }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Vous recevrez une notification sur votre application Wave pour confirmer le paiement." })] })), methodeSelectionnee === 'carte' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "numero-carte", children: "Num\u00E9ro de carte" }), _jsx("input", { type: "text", id: "numero-carte", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "1234 5678 9012 3456", value: numeroCarte, onChange: (e) => setNumeroCarte(formaterNumeroCarte(e.target.value)), maxLength: 19, required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "date-expiration", children: "Date d'expiration (MM/YY)" }), _jsx("input", { type: "text", id: "date-expiration", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "MM/YY", value: dateExpiration, onChange: (e) => setDateExpiration(formaterDateExpiration(e.target.value)), maxLength: 5, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "cvv", children: "CVV" }), _jsx("input", { type: "text", id: "cvv", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "123", value: codeCvv, onChange: (e) => setCodeCvv(e.target.value.replace(/\D/g, '')), maxLength: 3, required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 mb-2", htmlFor: "nom-carte", children: "Nom sur la carte" }), _jsx("input", { type: "text", id: "nom-carte", className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary", placeholder: "PRENOM NOM", value: nomCarte, onChange: (e) => setNomCarte(e.target.value), required: true })] })] })), _jsx("div", { className: "mt-8", children: _jsx("button", { type: "submit", className: "w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center", disabled: estEnTraitement, children: estEnTraitement ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Traitement en cours..."] })) : ('Payer 25.000 FCFA') }) })] })] }) })), statutPaiement === 'succes' && (_jsx("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 mb-4", children: _jsx(FiCheckCircle, { size: 32 }) }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Paiement effectu\u00E9 avec succ\u00E8s!" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Votre abonnement Premium a \u00E9t\u00E9 renouvel\u00E9 jusqu'au 15/06/2025." }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg text-left mb-6", children: [_jsxs("div", { className: "flex justify-between mb-2 text-sm", children: [_jsx("span", { className: "text-gray-600", children: "R\u00E9f\u00E9rence du paiement:" }), _jsx("span", { className: "font-medium", children: "PAY-2025-002" })] }), _jsxs("div", { className: "flex justify-between mb-2 text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Montant:" }), _jsx("span", { className: "font-medium", children: "25.000 FCFA" })] }), _jsxs("div", { className: "flex justify-between mb-2 text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Date:" }), _jsx("span", { className: "font-medium", children: "13/05/2025" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "M\u00E9thode:" }), _jsx("span", { className: "font-medium", children: methodeSelectionnee === 'orange-money' ? 'Orange Money' :
                                                methodeSelectionnee === 'wave' ? 'Wave' : 'Carte bancaire' })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-3", children: [_jsx("button", { className: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "T\u00E9l\u00E9charger le re\u00E7u" }), _jsx(Link, { to: "/paiement/abonnement", className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors", children: "Retour \u00E0 mon abonnement" })] })] }) })), statutPaiement === 'erreur' && (_jsx("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4", children: _jsx(FiAlertCircle, { size: 32 }) }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u00C9chec du paiement" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Une erreur s'est produite lors du traitement de votre paiement. Veuillez r\u00E9essayer." }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-3", children: [_jsx("button", { onClick: () => setStatutPaiement('attente'), className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors", children: "R\u00E9essayer" }), _jsx(Link, { to: "/paiement/abonnement", className: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors", children: "Annuler" })] })] }) }))] }));
};
export default NouveauPaiement;
