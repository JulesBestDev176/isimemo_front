var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { createLazyObserver, isInViewport } from '../../utils/performance';
/**
 * Composant d'image avec lazy loading
 * Respecte les règles de performance
 */
const LazyImage = (_a) => {
    var { src, alt, placeholder, fallback, className } = _a, props = __rest(_a, ["src", "alt", "placeholder", "fallback", "className"]);
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    useEffect(() => {
        const img = imgRef.current;
        if (!img)
            return;
        // Si l'image est déjà dans le viewport, charger immédiatement
        if (isInViewport(img)) {
            setImageSrc(src);
            return;
        }
        // Sinon, utiliser IntersectionObserver
        const observer = createLazyObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setImageSrc(src);
                    observer.disconnect();
                }
            });
        });
        observer.observe(img);
        return () => {
            observer.disconnect();
        };
    }, [src]);
    const handleLoad = () => {
        setIsLoaded(true);
    };
    const handleError = () => {
        setHasError(true);
        if (fallback) {
            setImageSrc(fallback);
        }
    };
    return (_jsx("img", Object.assign({ ref: imgRef, src: imageSrc, alt: alt, className: `${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`, onLoad: handleLoad, onError: handleError, loading: "lazy" }, props)));
};
export default LazyImage;
