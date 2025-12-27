// ============================================================================
// TYPES & INTERFACES - SESSION DE SOUTENANCE
// ============================================================================
export var StatutSession;
(function (StatutSession) {
    StatutSession["PLANIFIEE"] = "PLANIFIEE";
    StatutSession["OUVERTE"] = "OUVERTE";
    StatutSession["FERMEE"] = "FERMEE";
})(StatutSession || (StatutSession = {}));
export var TypeSessionSoutenance;
(function (TypeSessionSoutenance) {
    TypeSessionSoutenance["JUIN"] = "JUIN";
    TypeSessionSoutenance["SEPTEMBRE"] = "SEPTEMBRE";
    TypeSessionSoutenance["DECEMBRE"] = "DECEMBRE";
    TypeSessionSoutenance["SPECIALE"] = "SPECIALE";
})(TypeSessionSoutenance || (TypeSessionSoutenance = {}));
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Vérifie si une session est ouverte
 */
export const isSessionOuverte = (session) => {
    return session.statut === StatutSession.OUVERTE;
};
/**
 * Vérifie si une session peut être ouverte
 */
export const peutOuvrirSession = (session) => {
    return session.statut === StatutSession.PLANIFIEE;
};
/**
 * Vérifie si une session peut être fermée
 */
export const peutFermerSession = (session) => {
    return session.statut === StatutSession.OUVERTE;
};
/**
 * Récupère la session ouverte pour une année académique
 */
export const getSessionOuverte = (sessions, anneeAcademique) => {
    return sessions.find(s => s.anneeAcademique === anneeAcademique && s.statut === StatutSession.OUVERTE);
};
/**
 * Récupère toutes les sessions pour une année académique
 */
export const getSessionsByAnnee = (sessions, anneeAcademique) => {
    return sessions.filter(s => s.anneeAcademique === anneeAcademique);
};
