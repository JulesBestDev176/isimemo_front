/**
 * ============================================================================
 * MODÉLISATION NoSQL AVEC DÉNORMALISATION - MODÈLES COMPLETS
 * ============================================================================
 *
 * Ce fichier contient TOUS les modèles TypeScript complets (sans imports)
 * et définit les collections NoSQL dénormalisées pour optimiser les lectures.
 *
 * Principes de dénormalisation :
 * - Regrouper les données fréquemment consultées ensemble
 * - Dupliquer les données pour éviter les jointures multiples
 * - Optimiser pour les lectures (les écritures peuvent être plus complexes)
 * - Collections orientées par cas d'usage
 */
// StatutDossierMemoire
export var StatutDossierMemoire;
(function (StatutDossierMemoire) {
    StatutDossierMemoire["EN_CREATION"] = "EN_CREATION";
    StatutDossierMemoire["EN_COURS"] = "EN_COURS";
    StatutDossierMemoire["EN_ATTENTE_VALIDATION"] = "EN_ATTENTE_VALIDATION";
    StatutDossierMemoire["VALIDE"] = "VALIDE";
    StatutDossierMemoire["DEPOSE"] = "DEPOSE";
    StatutDossierMemoire["SOUTENU"] = "SOUTENU";
})(StatutDossierMemoire || (StatutDossierMemoire = {}));
// EtapeDossier
export var EtapeDossier;
(function (EtapeDossier) {
    EtapeDossier["CHOIX_SUJET"] = "CHOIX_SUJET";
    EtapeDossier["VALIDATION_SUJET"] = "VALIDATION_SUJET";
    EtapeDossier["REDACTION"] = "REDACTION";
    EtapeDossier["DEPOT_INTERMEDIAIRE"] = "DEPOT_INTERMEDIAIRE";
    EtapeDossier["DEPOT_FINAL"] = "DEPOT_FINAL";
    EtapeDossier["SOUTENANCE"] = "SOUTENANCE";
    EtapeDossier["TERMINE"] = "TERMINE";
})(EtapeDossier || (EtapeDossier = {}));
// TypeDocument
export var TypeDocument;
(function (TypeDocument) {
    TypeDocument["CHAPITRE"] = "CHAPITRE";
    TypeDocument["ANNEXE"] = "ANNEXE";
    TypeDocument["FICHE_SUIVI"] = "FICHE_SUIVI";
    TypeDocument["DOCUMENT_ADMINISTRATIF"] = "DOCUMENT_ADMINISTRATIF";
    TypeDocument["PRESENTATION"] = "PRESENTATION";
    TypeDocument["AUTRE"] = "AUTRE";
})(TypeDocument || (TypeDocument = {}));
// StatutDocument
export var StatutDocument;
(function (StatutDocument) {
    StatutDocument["BROUILLON"] = "BROUILLON";
    StatutDocument["DEPOSE"] = "DEPOSE";
    StatutDocument["EN_ATTENTE_VALIDATION"] = "EN_ATTENTE_VALIDATION";
    StatutDocument["VALIDE"] = "VALIDE";
    StatutDocument["REJETE"] = "REJETE";
    StatutDocument["ARCHIVE"] = "ARCHIVE";
})(StatutDocument || (StatutDocument = {}));
// Priorite
export var Priorite;
(function (Priorite) {
    Priorite["BASSE"] = "BASSE";
    Priorite["MOYENNE"] = "MOYENNE";
    Priorite["HAUTE"] = "HAUTE";
    Priorite["URGENTE"] = "URGENTE";
})(Priorite || (Priorite = {}));
// StatutTicket
export var StatutTicket;
(function (StatutTicket) {
    StatutTicket["A_FAIRE"] = "A_FAIRE";
    StatutTicket["EN_COURS"] = "EN_COURS";
    StatutTicket["EN_REVISION"] = "EN_REVISION";
    StatutTicket["TERMINE"] = "TERMINE";
})(StatutTicket || (StatutTicket = {}));
// PhaseTicket
export var PhaseTicket;
(function (PhaseTicket) {
    PhaseTicket["A_FAIRE"] = "A_FAIRE";
    PhaseTicket["EN_COURS"] = "EN_COURS";
    PhaseTicket["EN_REVISION"] = "EN_REVISION";
    PhaseTicket["TERMINE"] = "TERMINE";
})(PhaseTicket || (PhaseTicket = {}));
// TypeMessage
export var TypeMessage;
(function (TypeMessage) {
    TypeMessage["TEXTE"] = "TEXTE";
    TypeMessage["FICHIER"] = "FICHIER";
    TypeMessage["SYSTEME"] = "SYSTEME";
})(TypeMessage || (TypeMessage = {}));
// StatutEncadrement
export var StatutEncadrement;
(function (StatutEncadrement) {
    StatutEncadrement["ACTIF"] = "ACTIF";
    StatutEncadrement["TERMINE"] = "TERMINE";
    StatutEncadrement["ANNULE"] = "ANNULE";
})(StatutEncadrement || (StatutEncadrement = {}));
// StatutDemandeBinome
export var StatutDemandeBinome;
(function (StatutDemandeBinome) {
    StatutDemandeBinome["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandeBinome["ACCEPTE"] = "ACCEPTE";
    StatutDemandeBinome["REFUSE"] = "REFUSE";
    StatutDemandeBinome["DISSOUS"] = "DISSOUS";
})(StatutDemandeBinome || (StatutDemandeBinome = {}));
// StatutLivrable
export var StatutLivrable;
(function (StatutLivrable) {
    StatutLivrable["DEPOSE"] = "DEPOSE";
    StatutLivrable["EN_ATTENTE_VALIDATION"] = "EN_ATTENTE_VALIDATION";
    StatutLivrable["VALIDE"] = "VALIDE";
    StatutLivrable["REJETE"] = "REJETE";
})(StatutLivrable || (StatutLivrable = {}));
// Mention
export var Mention;
(function (Mention) {
    Mention["EXCELLENT"] = "EXCELLENT";
    Mention["TRES_BIEN"] = "TRES_BIEN";
    Mention["BIEN"] = "BIEN";
    Mention["ASSEZ_BIEN"] = "ASSEZ_BIEN";
    Mention["PASSABLE"] = "PASSABLE";
})(Mention || (Mention = {}));
// RoleJury
export var RoleJury;
(function (RoleJury) {
    RoleJury["PRESIDENT"] = "PRESIDENT";
    RoleJury["RAPPORTEUR"] = "RAPPORTEUR";
    RoleJury["EXAMINATEUR"] = "EXAMINATEUR";
    RoleJury["ENCADRANT"] = "ENCADRANT";
})(RoleJury || (RoleJury = {}));
// ModeSoutenance
export var ModeSoutenance;
(function (ModeSoutenance) {
    ModeSoutenance["PRESENTIEL"] = "PRESENTIEL";
    ModeSoutenance["DISTANCIEL"] = "DISTANCIEL";
    ModeSoutenance["HYBRIDE"] = "HYBRIDE";
})(ModeSoutenance || (ModeSoutenance = {}));
// StatutSoutenance
export var StatutSoutenance;
(function (StatutSoutenance) {
    StatutSoutenance["PLANIFIEE"] = "PLANIFIEE";
    StatutSoutenance["EN_COURS"] = "EN_COURS";
    StatutSoutenance["TERMINEE"] = "TERMINEE";
    StatutSoutenance["ANNULEE"] = "ANNULEE";
})(StatutSoutenance || (StatutSoutenance = {}));
// StatutJury
export var StatutJury;
(function (StatutJury) {
    StatutJury["PROPOSE"] = "PROPOSE";
    StatutJury["VALIDE"] = "VALIDE";
    StatutJury["PLANIFIE"] = "PLANIFIE";
    StatutJury["EN_COURS"] = "EN_COURS";
    StatutJury["TERMINE"] = "TERMINE";
})(StatutJury || (StatutJury = {}));
// StatutSession
export var StatutSession;
(function (StatutSession) {
    StatutSession["PLANIFIEE"] = "PLANIFIEE";
    StatutSession["OUVERTE"] = "OUVERTE";
    StatutSession["FERMEE"] = "FERMEE";
})(StatutSession || (StatutSession = {}));
// TypeSessionSoutenance
export var TypeSessionSoutenance;
(function (TypeSessionSoutenance) {
    TypeSessionSoutenance["JUIN"] = "JUIN";
    TypeSessionSoutenance["SEPTEMBRE"] = "SEPTEMBRE";
    TypeSessionSoutenance["DECEMBRE"] = "DECEMBRE";
    TypeSessionSoutenance["SPECIALE"] = "SPECIALE";
})(TypeSessionSoutenance || (TypeSessionSoutenance = {}));
// TypePeriodeValidation
export var TypePeriodeValidation;
(function (TypePeriodeValidation) {
    TypePeriodeValidation["VALIDATION_SUJETS"] = "VALIDATION_SUJETS";
    TypePeriodeValidation["VALIDATION_CORRECTIONS"] = "VALIDATION_CORRECTIONS";
    TypePeriodeValidation["AUCUNE"] = "AUCUNE";
})(TypePeriodeValidation || (TypePeriodeValidation = {}));
// TypeRole
export var TypeRole;
(function (TypeRole) {
    TypeRole["COMMISSION"] = "COMMISSION";
    TypeRole["JURIE"] = "JURIE";
    TypeRole["PRESIDENT_JURY_POSSIBLE"] = "PRESIDENT_JURY_POSSIBLE";
})(TypeRole || (TypeRole = {}));
// StatutDemandeEncadrement
export var StatutDemandeEncadrement;
(function (StatutDemandeEncadrement) {
    StatutDemandeEncadrement["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandeEncadrement["ACCEPTEE"] = "ACCEPTEE";
    StatutDemandeEncadrement["REFUSEE"] = "REFUSEE";
    StatutDemandeEncadrement["ANNULEE"] = "ANNULEE";
})(StatutDemandeEncadrement || (StatutDemandeEncadrement = {}));
// StatutDemandePrelecture
export var StatutDemandePrelecture;
(function (StatutDemandePrelecture) {
    StatutDemandePrelecture["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandePrelecture["EN_COURS"] = "EN_COURS";
    StatutDemandePrelecture["VALIDE"] = "VALIDE";
    StatutDemandePrelecture["REJETE"] = "REJETE";
})(StatutDemandePrelecture || (StatutDemandePrelecture = {}));
/**
 * ============================================================================
 * NOTES SUR LA DÉNORMALISATION
 * ============================================================================
 *
 * Avantages:
 * - Lectures rapides (pas de jointures)
 * - Données regroupées par cas d'usage
 * - Optimisé pour les requêtes fréquentes
 *
 * Inconvénients:
 * - Écritures plus complexes (mise à jour multiple)
 * - Duplication de données
 * - Risque d'incohérence (nécessite synchronisation)
 *
 * Stratégies de synchronisation:
 * - Événements de mise à jour pour synchroniser les collections
 * - Jobs de synchronisation périodiques
 * - Transactions pour maintenir la cohérence
 *
 * Exemples de requêtes optimisées:
 *
 * 1. Récupérer un dossier complet:
 *    db.dossiers.findOne({ idDossierMemoire: 101 })
 *    → Retourne tout: candidats, encadrant, documents, tickets, messages, PV
 *
 * 2. Récupérer un professeur avec toutes ses activités:
 *    db.professeurs.findOne({ idProfesseur: 4 })
 *    → Retourne: encadrements, jurys, sujets, disponibilités, rôles
 *
 * 3. Récupérer les validations d'un membre de commission:
 *    db.validations.find({ "membreAssigné.idProfesseur": 3, statut: "EN_ATTENTE" })
 *    → Retourne tous les éléments à valider avec détails complets
 *
 * 4. Recherche full-text:
 *    db.dossiers.find({ $text: { $search: "intelligence artificielle" } })
 *    → Recherche dans titre, description, noms candidats
 */
