/**
 * Utilitaires pour optimiser les performances
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Debounce une fonction
 * @param func Fonction à debouncer
 * @param wait Temps d'attente en ms
 * @returns Fonction debouncée
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
/**
 * Throttle une fonction
 * @param func Fonction à throttler
 * @param limit Temps limite en ms
 * @returns Fonction throttlée
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * Lazy load une image
 * @param src Source de l'image
 * @returns Promise qui se résout quand l'image est chargée
 */
export function lazyLoadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}
/**
 * Prefetch une route
 * @param path Chemin de la route
 */
export function prefetchRoute(path) {
    // Utiliser le prefetching natif du navigateur si disponible
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = path;
            document.head.appendChild(link);
        });
    }
}
/**
 * Mesurer les performances d'une fonction
 * @param name Nom de la fonction
 * @param fn Fonction à mesurer
 * @returns Résultat de la fonction
 */
export function measurePerformance(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'development') {
            const start = performance.now();
            const result = yield fn();
            const end = performance.now();
            console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        }
        return fn();
    });
}
/**
 * Vérifier si un élément est dans le viewport
 * @param element Élément à vérifier
 * @returns true si l'élément est visible
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
/**
 * Observer pour le lazy loading d'éléments
 * @param callback Fonction appelée quand l'élément est visible
 * @param options Options de l'IntersectionObserver
 * @returns IntersectionObserver
 */
export function createLazyObserver(callback, options) {
    return new IntersectionObserver(callback, Object.assign({ root: null, rootMargin: '50px', threshold: 0.01 }, options));
}
