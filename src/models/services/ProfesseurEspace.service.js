// ============================================================================
// SERVICE POUR L'ESPACE PROFESSEUR
// ============================================================================
import { getEncadrementsByProfesseur, StatutEncadrement } from '../dossier/Encadrement';
import { getSoutenancesByProfesseur } from '../soutenance/Soutenance';
import { getMembresJuryByProfesseur } from '../soutenance/MembreJury';
import { mockDossiers, StatutDossierMemoire } from '../dossier/DossierMemoire';
import { mockDocuments, StatutDocument, TypeDocument } from '../dossier/Document';
import { TOUS_LES_SUJETS } from '../../pages/professeur/Sujets';
/**
 * Récupère tous les sujets proposés par un professeur (non désactivés)
 * Ne retourne pas le statut car il ne doit pas être affiché
 */
export const getSujetsProposesByProfesseur = (idProfesseur) => {
    return TOUS_LES_SUJETS
        .filter(s => s.professeurId === idProfesseur &&
        !s.estDesactive // Exclure les sujets désactivés par le professeur
    )
        .map(s => ({
        id: s.id,
        titre: s.titre,
        description: s.description,
        dateSoumission: s.dateSoumission,
        dateApprobation: s.dateApprobation,
        anneeAcademique: s.anneeAcademique,
        nombreEtudiantsActuels: s.nombreEtudiantsActuels,
        nombreMaxEtudiants: s.nombreMaxEtudiants,
        estDesactive: false
    }));
};
/**
 * Récupère les sujets validés par un professeur, organisés par année académique
 */
export const getSujetsValidesByProfesseur = (idProfesseur) => {
    const sujetsValides = TOUS_LES_SUJETS
        .filter(s => s.professeurId === idProfesseur && s.dateApprobation)
        .map(s => {
        // Trouver le dossier associé si possible
        const dossier = mockDossiers.find(d => {
            var _a;
            return ((_a = d.encadrant) === null || _a === void 0 ? void 0 : _a.idProfesseur) === idProfesseur &&
                d.titre.toLowerCase().includes(s.titre.toLowerCase().substring(0, 20));
        });
        return {
            id: s.id,
            titre: s.titre,
            description: s.description,
            dateValidation: s.dateApprobation,
            anneeAcademique: s.anneeAcademique,
            dossierMemoireId: dossier === null || dossier === void 0 ? void 0 : dossier.idDossierMemoire,
            dossierMemoireTitre: dossier === null || dossier === void 0 ? void 0 : dossier.titre
        };
    });
    // Grouper par année académique
    const sujetsParAnnee = new Map();
    sujetsValides.forEach(sujet => {
        if (!sujetsParAnnee.has(sujet.anneeAcademique)) {
            sujetsParAnnee.set(sujet.anneeAcademique, []);
        }
        sujetsParAnnee.get(sujet.anneeAcademique).push(sujet);
    });
    return sujetsParAnnee;
};
/**
 * Récupère les étudiants encadrés par un professeur, groupés par encadrement (année académique)
 * Un professeur ne peut avoir qu'un seul encadrement actif
 */
export const getEtudiantsEncadresByProfesseur = (idProfesseur) => {
    const encadrements = getEncadrementsByProfesseur(idProfesseur);
    // Grouper par année académique
    const encadrementsParAnnee = new Map();
    encadrements
        .filter(e => e.dossierMemoire && e.dossierMemoire.candidats)
        .forEach(e => {
        const annee = e.anneeAcademique;
        if (!encadrementsParAnnee.has(annee)) {
            encadrementsParAnnee.set(annee, {
                anneeAcademique: annee,
                encadrement: {
                    dateDebut: e.dateDebut,
                    dateFin: e.dateFin,
                    statut: e.statut,
                    idEncadrement: e.idEncadrement
                },
                etudiants: []
            });
        }
        const groupe = encadrementsParAnnee.get(annee);
        e.dossierMemoire.candidats.forEach(candidat => {
            groupe.etudiants.push({
                candidat,
                dossier: e.dossierMemoire
            });
        });
    });
    return Array.from(encadrementsParAnnee.values());
};
/**
 * Récupère les jurys auxquels un professeur a appartenu
 */
export const getJurysByProfesseur = (idProfesseur) => {
    const soutenances = getSoutenancesByProfesseur(idProfesseur);
    const membresJury = getMembresJuryByProfesseur(idProfesseur);
    return soutenances.map(soutenance => {
        const membre = membresJury.find(m => { var _a; return ((_a = m.soutenance) === null || _a === void 0 ? void 0 : _a.idSoutenance) === soutenance.idSoutenance; });
        const dossiers = soutenance.dossiersMemoire ||
            (soutenance.dossierMemoire ? [soutenance.dossierMemoire] : []);
        return {
            idSoutenance: soutenance.idSoutenance,
            dateSoutenance: soutenance.dateSoutenance,
            heureDebut: soutenance.heureDebut,
            heureFin: soutenance.heureFin,
            role: (membre === null || membre === void 0 ? void 0 : membre.roleJury) || 'EXAMINATEUR',
            dossiers: dossiers.map(d => ({
                idDossierMemoire: d.idDossierMemoire,
                titre: d.titre,
                candidats: (d.candidats || []).map(c => ({
                    nom: c.nom,
                    prenom: c.prenom,
                    email: c.email
                }))
            })),
            anneeAcademique: soutenance.anneeAcademique,
            statut: soutenance.statut
        };
    });
};
/**
 * Récupère les corrections validées par un professeur (si membre de commission)
 * Organisées par année académique
 * Note: Dans un vrai système, il faudrait tracker qui a validé quoi
 */
export const getCorrectionsValideesByProfesseur = (idProfesseur, estCommission) => {
    const correctionsParAnnee = new Map();
    if (!estCommission)
        return correctionsParAnnee;
    // Pour l'instant, on retourne les documents validés récents
    // Dans un vrai système, il faudrait tracker qui a validé chaque document
    const corrections = mockDocuments
        .filter(d => d.statut === StatutDocument.VALIDE &&
        d.typeDocument === TypeDocument.CHAPITRE)
        .map(d => {
        var _a, _b, _c, _d;
        const anneeAcademique = ((_a = d.dossierMemoire) === null || _a === void 0 ? void 0 : _a.anneeAcademique) || '2024-2025';
        return {
            idDocument: d.idDocument,
            titre: d.titre,
            dateValidation: d.dateModification || d.dateCreation,
            dossierMemoireId: ((_b = d.dossierMemoire) === null || _b === void 0 ? void 0 : _b.idDossierMemoire) || 0,
            dossierMemoireTitre: ((_c = d.dossierMemoire) === null || _c === void 0 ? void 0 : _c.titre) || 'Titre inconnu',
            anneeAcademique,
            candidats: (((_d = d.dossierMemoire) === null || _d === void 0 ? void 0 : _d.candidats) || []).map(c => ({
                nom: c.nom,
                prenom: c.prenom
            })),
            commentaire: undefined
        };
    });
    // Grouper par année académique
    corrections.forEach(correction => {
        if (!correctionsParAnnee.has(correction.anneeAcademique)) {
            correctionsParAnnee.set(correction.anneeAcademique, []);
        }
        correctionsParAnnee.get(correction.anneeAcademique).push(correction);
    });
    return correctionsParAnnee;
};
/**
 * Récupère les statistiques d'encadrement d'un professeur
 * Un professeur ne peut avoir qu'un seul encadrement actif
 */
export const getStatistiquesEncadrement = (idProfesseur) => {
    const encadrements = getEncadrementsByProfesseur(idProfesseur);
    // Un professeur ne peut avoir qu'un seul encadrement actif
    const encadrementsActifs = encadrements.filter(e => e.statut === StatutEncadrement.ACTIF);
    const encadrementsTermines = encadrements.filter(e => e.statut === StatutEncadrement.TERMINE);
    const dossiers = encadrements
        .map(e => e.dossierMemoire)
        .filter(Boolean);
    const dossiersSoutenus = dossiers.filter(d => d.statut === StatutDossierMemoire.SOUTENU).length;
    const dossiersValides = dossiers.filter(d => d.statut === StatutDossierMemoire.VALIDE).length;
    const totalEtudiants = new Set(dossiers.flatMap(d => { var _a; return ((_a = d.candidats) === null || _a === void 0 ? void 0 : _a.map(c => c.idCandidat)) || []; })).size;
    const tauxReussite = encadrementsTermines.length > 0
        ? (dossiersSoutenus / encadrementsTermines.length) * 100
        : 0;
    return {
        totalEncadrements: encadrements.length,
        encadrementsActifs: Math.min(encadrementsActifs.length, 1), // Maximum 1 encadrement actif
        encadrementsTermines: encadrementsTermines.length,
        totalEtudiants,
        dossiersSoutenus,
        dossiersValides,
        tauxReussite: Math.round(tauxReussite * 100) / 100
    };
};
/**
 * Récupère l'historique des dossiers encadrés par un professeur
 */
export const getHistoriqueDossiersByProfesseur = (idProfesseur) => {
    const encadrements = getEncadrementsByProfesseur(idProfesseur);
    return encadrements
        .map(e => e.dossierMemoire)
        .filter(Boolean)
        .filter(d => d.statut === StatutDossierMemoire.SOUTENU ||
        d.statut === StatutDossierMemoire.VALIDE ||
        d.statut === StatutDossierMemoire.DEPOSE);
};
