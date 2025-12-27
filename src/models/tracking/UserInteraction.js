// ============================================================================
// TYPES & INTERFACES
// ============================================================================
// ============================================================================
// CONSTANTES
// ============================================================================
export const INTERACTION_WEIGHTS = {
    save: 10, // Signal très fort d'intérêt
    unsave: -5, // Signal négatif
    time_spent: 0.01, // Par seconde (max ~5 pour 500s)
    view: 1, // Signal moyen
    search: 2 // Signal fort si ressource cliquée
};
// ============================================================================
// STORAGE (Stockage en mémoire - pas de localStorage)
// ============================================================================
const STORAGE_KEY = 'user_interactions';
let interactionIdCounter = 1000;
// Stockage en mémoire des interactions (remplace localStorage)
let inMemoryInteractions = [];
// Récupérer les interactions depuis la mémoire
const getStoredInteractions = () => {
    return inMemoryInteractions;
};
// Sauvegarder les interactions en mémoire
const saveInteractions = (interactions) => {
    inMemoryInteractions = interactions;
};
// ============================================================================
// FONCTIONS PRINCIPALES
// ============================================================================
/**
 * Calcule le score d'une interaction
 */
export const calculateInteractionScore = (type, metadata) => {
    let baseScore = INTERACTION_WEIGHTS[type];
    // Ajustements pour time_spent
    if (type === 'time_spent' && metadata.duration) {
        baseScore = Math.min(5, metadata.duration * INTERACTION_WEIGHTS.time_spent);
        // Bonus si scroll depth élevé
        if (metadata.scrollDepth && metadata.scrollDepth > 70) {
            baseScore *= 1.5;
        }
    }
    // Bonus si clic depuis recherche en bonne position
    if (type === 'view' && metadata.clickSource === 'search' && metadata.resultPosition) {
        if (metadata.resultPosition <= 3) {
            baseScore *= 1.5; // Top 3 résultats = très pertinent
        }
    }
    return baseScore;
};
/**
 * Enregistre une nouvelle interaction
 */
export const trackInteraction = (userId, resourceId, type, metadata = {}) => {
    const score = calculateInteractionScore(type, metadata);
    const interaction = {
        idInteraction: interactionIdCounter++,
        idUtilisateur: userId,
        idRessource: resourceId,
        typeInteraction: type,
        metadata: Object.assign(Object.assign({}, metadata), { timestamp: new Date() }),
        timestamp: new Date(),
        score
    };
    const interactions = getStoredInteractions();
    interactions.push(interaction);
    saveInteractions(interactions);
    return interaction;
};
/**
 * Récupère toutes les interactions d'un utilisateur
 */
export const getUserInteractions = (userId, limit) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? interactions.slice(0, limit) : interactions;
};
/**
 * Récupère les interactions pour une ressource spécifique
 */
export const getResourceInteractions = (resourceId) => {
    return getStoredInteractions()
        .filter(i => i.idRessource === resourceId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
/**
 * Calcule le score total d'une ressource pour un utilisateur
 */
export const calculateUserResourceScore = (userId, resourceId) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId && i.idRessource === resourceId);
    return interactions.reduce((total, interaction) => total + interaction.score, 0);
};
/**
 * Récupère les ressources les plus interagies par l'utilisateur
 */
export const getUserTopResources = (userId, limit = 10) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId);
    // Grouper par ressource
    const resourceScores = new Map();
    interactions.forEach(interaction => {
        const current = resourceScores.get(interaction.idRessource) || 0;
        resourceScores.set(interaction.idRessource, current + interaction.score);
    });
    // Convertir en tableau et trier
    return Array.from(resourceScores.entries())
        .map(([idRessource, score]) => ({ idRessource, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
};
/**
 * Récupère les ressources populaires (tous utilisateurs)
 */
export const getPopularResources = (limit = 10) => {
    const interactions = getStoredInteractions();
    // Grouper par ressource et compter les interactions uniques
    const resourceCounts = new Map();
    interactions.forEach(interaction => {
        if (!resourceCounts.has(interaction.idRessource)) {
            resourceCounts.set(interaction.idRessource, new Set());
        }
        resourceCounts.get(interaction.idRessource).add(interaction.idUtilisateur);
    });
    // Convertir en tableau et trier
    return Array.from(resourceCounts.entries())
        .map(([idRessource, users]) => ({ idRessource, count: users.size }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
};
/**
 * Nettoie les interactions anciennes (> 6 mois)
 */
export const cleanOldInteractions = () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const interactions = getStoredInteractions()
        .filter(i => i.timestamp > sixMonthsAgo);
    saveInteractions(interactions);
};
/**
 * Réinitialise toutes les interactions (pour debug/test)
 */
export const clearAllInteractions = () => {
    inMemoryInteractions = [];
};
// ============================================================================
// FONCTIONS POUR RECOMMANDATIONS BASÉES SUR L'ACTIVITÉ RÉCENTE
// ============================================================================
/**
 * Récupère la dernière requête de recherche d'un utilisateur
 */
export const getLastSearchedQuery = (userId) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId && i.typeInteraction === 'search')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return interactions.length > 0 ? interactions[0].metadata.searchQuery || null : null;
};
/**
 * Récupère la dernière ressource consultée par un utilisateur
 */
export const getLastViewedResource = (userId) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId && i.typeInteraction === 'view' && i.idRessource > 0)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return interactions.length > 0 ? interactions[0].idRessource : null;
};
/**
 * Récupère la dernière ressource sauvegardée par un utilisateur
 */
export const getLastSavedResource = (userId) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId && i.typeInteraction === 'save')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return interactions.length > 0 ? interactions[0].idRessource : null;
};
/**
 * Récupère la ressource la plus récemment interagie (vue ou sauvegardée)
 * Utilisé pour les recommandations basées sur le contenu similaire
 */
export const getLastInteractedResource = (userId) => {
    const interactions = getStoredInteractions()
        .filter(i => i.idUtilisateur === userId &&
        (i.typeInteraction === 'view' || i.typeInteraction === 'save') &&
        i.idRessource > 0)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return interactions.length > 0 ? interactions[0].idRessource : null;
};
