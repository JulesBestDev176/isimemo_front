import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
/**
 * Composant de chargement pour les pages lazy loaded
 * Utilisé comme fallback pour Suspense
 */
const PageLoader = () => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-12 w-12 animate-spin text-primary mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Chargement..." })] }) }));
};
export default PageLoader;
