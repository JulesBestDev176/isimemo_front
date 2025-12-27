import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SemanticSearchEngine } from '../../models/search/SemanticSearch';
// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================
export const SemanticSearchBar = ({ onSearch, placeholder = 'Recherche sémantique intelligente...', recentSearches = [], onRecentSearchClick }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);
    // Générer des suggestions quand l'utilisateur tape
    useEffect(() => {
        if (query.trim().length > 2) {
            const newSuggestions = SemanticSearchEngine.getSuggestions(query, recentSearches);
            setSuggestions(newSuggestions);
        }
        else {
            setSuggestions(recentSearches.slice(0, 5));
        }
    }, [query, recentSearches]);
    const handleSearch = (searchQuery) => {
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setIsFocused(false);
        }
    };
    const handleKeyDown = (e) => {
        var _a;
        if (e.key === 'Enter') {
            handleSearch(query);
        }
        else if (e.key === 'Escape') {
            setIsFocused(false);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
        if (onRecentSearchClick) {
            onRecentSearchClick(suggestion);
        }
    };
    const clearQuery = () => {
        var _a;
        setQuery('');
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const showSuggestions = isFocused && (suggestions.length > 0 || recentSearches.length > 0);
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, onFocus: () => setIsFocused(true), onBlur: () => setTimeout(() => setIsFocused(false), 200), placeholder: placeholder, className: "w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" }), query && (_jsx("button", { onClick: clearQuery, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) }))] }), _jsx(AnimatePresence, { children: showSuggestions && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, className: "absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-64 overflow-y-auto", children: [query.trim().length === 0 && recentSearches.length > 0 && (_jsx("div", { className: "px-4 py-2 bg-gray-50 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsx("span", { children: "Recherches r\u00E9centes" })] }) })), query.trim().length > 2 && suggestions.length > 0 && (_jsx("div", { className: "px-4 py-2 bg-gray-50 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [_jsx(TrendingUp, { className: "h-3 w-3" }), _jsx("span", { children: "Suggestions" })] }) })), _jsx("div", { children: suggestions.map((suggestion, index) => (_jsxs("button", { onClick: () => handleSuggestionClick(suggestion), className: "w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 group", children: [_jsx(Search, { className: "h-4 w-4 text-gray-400 group-hover:text-blue-600" }), _jsx("span", { className: "text-sm text-gray-700 group-hover:text-blue-600", children: suggestion })] }, index))) }), suggestions.length === 0 && query.trim().length > 0 && (_jsxs("div", { className: "px-4 py-3 text-sm text-gray-500 text-center", children: ["Appuyez sur Entr\u00E9e pour rechercher \"", query, "\""] }))] })) })] }));
};
export default SemanticSearchBar;
