import { useEffect, useRef } from 'react';
import { trackInteraction } from '../models/tracking/UserInteraction';
/**
 * Hook pour tracker le temps passé sur une ressource
 * Enregistre automatiquement le temps toutes les 30 secondes
 */
export const usePageTimer = (userId, resourceId, isActive = true) => {
    const startTimeRef = useRef(Date.now());
    const intervalRef = useRef(null);
    const totalTimeRef = useRef(0);
    useEffect(() => {
        if (!userId || !resourceId || !isActive) {
            return;
        }
        // Réinitialiser le compteur au montage
        startTimeRef.current = Date.now();
        totalTimeRef.current = 0;
        // Enregistrer le temps toutes les 30 secondes
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTimeRef.current) / 1000);
            totalTimeRef.current += elapsed;
            if (elapsed > 0) {
                trackInteraction(userId, resourceId, 'time_spent', {
                    duration: elapsed,
                    scrollDepth: calculateScrollDepth()
                });
                // Réinitialiser le compteur
                startTimeRef.current = now;
            }
        }, 30000); // 30 secondes
        // Cleanup au démontage ou changement de ressource
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Enregistrer le temps final
            const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (finalTime > 0) {
                trackInteraction(userId, resourceId, 'time_spent', {
                    duration: finalTime,
                    scrollDepth: calculateScrollDepth()
                });
            }
        };
    }, [userId, resourceId, isActive]);
    return totalTimeRef.current;
};
/**
 * Calcule la profondeur de scroll de la page (0-100%)
 */
const calculateScrollDepth = () => {
    if (typeof window === 'undefined')
        return 0;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = documentHeight - windowHeight;
    if (maxScroll <= 0)
        return 100;
    return Math.min(100, Math.round((scrollTop / maxScroll) * 100));
};
/**
 * Hook pour gérer l'historique de recherche
 * Stockage en mémoire (pas de localStorage)
 */
// Stockage en mémoire pour l'historique de recherche
const inMemorySearchHistory = new Map();
export const useSearchHistory = (storageKey = 'search_history') => {
    const getHistory = () => {
        return inMemorySearchHistory.get(storageKey) || [];
    };
    const addToHistory = (query) => {
        if (!query.trim())
            return;
        const history = getHistory();
        const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
        const newHistory = [query, ...filtered].slice(0, 10); // Max 10 recherches
        inMemorySearchHistory.set(storageKey, newHistory);
    };
    const clearHistory = () => {
        inMemorySearchHistory.delete(storageKey);
    };
    return {
        getHistory,
        addToHistory,
        clearHistory
    };
};
