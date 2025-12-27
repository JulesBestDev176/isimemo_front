import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
/**
 * HOC pour créer des composants mémorisés
 * Utilise React.memo avec comparaison personnalisée
 */
export function createMemoizedComponent(Component, areEqual) {
    return memo(Component, areEqual);
}
/**
 * Wrapper pour mémoriser un composant avec useMemo
 * Utile pour les composants qui changent rarement
 */
export const MemoizedWrapper = memo(({ children }) => {
    return _jsx(_Fragment, { children: children });
}, (prevProps, nextProps) => {
    // Comparaison personnalisée basée sur les dépendances
    if (prevProps.dependencies && nextProps.dependencies) {
        return prevProps.dependencies.every((dep, index) => dep === nextProps.dependencies[index]);
    }
    return false;
});
MemoizedWrapper.displayName = 'MemoizedWrapper';
