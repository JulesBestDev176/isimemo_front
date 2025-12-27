// ============================================================================
// TYPES & INTERFACES - JURY DE SOUTENANCE
// ============================================================================
import { RoleJury } from './MembreJury';
export var StatutJury;
(function (StatutJury) {
    StatutJury["PROPOSE"] = "PROPOSE";
    StatutJury["VALIDE"] = "VALIDE";
    StatutJury["PLANIFIE"] = "PLANIFIE";
    StatutJury["EN_COURS"] = "EN_COURS";
    StatutJury["TERMINE"] = "TERMINE"; // Soutenance terminée
})(StatutJury || (StatutJury = {}));
// ============================================================================
// MOCKS
// ============================================================================
import { mockProfesseurs } from '../acteurs/Professeur';
import { mockDossiers } from '../dossier/DossierMemoire';
import { mockSalles } from '../infrastructure/Salle';
export const mockJurys = [
    {
        idJury: 1,
        nom: 'Jury 1 - Septembre 2025',
        membres: [
            {
                professeur: mockProfesseurs[0], // Jean Pierre
                role: RoleJury.PRESIDENT
            },
            {
                professeur: mockProfesseurs[5], // Amadou Kane
                role: RoleJury.RAPPORTEUR
            },
            {
                professeur: mockProfesseurs[7], // Ousmane Thiam
                role: RoleJury.EXAMINATEUR
            }
        ],
        dossiers: mockDossiers.slice(0, 8), // 8 premiers dossiers
        dateSoutenance: new Date('2025-09-16T09:00:00'),
        heureDebut: '09:00',
        heureFin: '13:00',
        salle: mockSalles[0], // Amphi A
        statut: StatutJury.PLANIFIE,
        session: 'Septembre',
        anneeAcademique: '2024-2025',
        dateCreation: new Date('2025-04-20'),
        creePar: 2
    },
    {
        idJury: 2,
        nom: 'Jury 2 - Septembre 2025',
        membres: [
            {
                professeur: mockProfesseurs[3], // Mamadou Sarr
                role: RoleJury.PRESIDENT
            },
            {
                professeur: mockProfesseurs[10], // Sokhna Mbaye
                role: RoleJury.RAPPORTEUR
            },
            {
                professeur: mockProfesseurs[12], // Mariama Faye
                role: RoleJury.EXAMINATEUR
            }
        ],
        dossiers: mockDossiers.slice(8, 15), // 7 dossiers suivants
        dateSoutenance: new Date('2025-09-17T09:00:00'),
        heureDebut: '09:00',
        heureFin: '12:30',
        salle: mockSalles[1], // Amphi B
        statut: StatutJury.PLANIFIE,
        session: 'Septembre',
        anneeAcademique: '2024-2025',
        dateCreation: new Date('2025-04-20'),
        creePar: 2
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Récupère un jury par son ID
 */
export const getJuryById = (id) => {
    return mockJurys.find(j => j.idJury === id);
};
/**
 * Récupère les jurys par session
 */
export const getJurysBySession = (session, annee) => {
    return mockJurys.filter(j => j.session === session && j.anneeAcademique === annee);
};
/**
 * Récupère les jurys par statut
 */
export const getJurysByStatut = (statut) => {
    return mockJurys.filter(j => j.statut === statut);
};
/**
 * Vérifie si une salle est disponible à une date/heure donnée
 */
export const isSalleDisponible = (salleId, date, heureDebut, heureFin, excludeJuryId) => {
    const jurysSalle = mockJurys.filter(j => {
        var _a;
        return ((_a = j.salle) === null || _a === void 0 ? void 0 : _a.idSalle) === salleId &&
            j.dateSoutenance &&
            j.dateSoutenance.toDateString() === date.toDateString() &&
            j.idJury !== excludeJuryId;
    });
    // Vérifier les chevauchements d'horaires
    for (const jury of jurysSalle) {
        if (jury.heureDebut && jury.heureFin) {
            // Logique simplifiée de chevauchement
            if (!(heureFin <= jury.heureDebut || heureDebut >= jury.heureFin)) {
                return false; // Chevauchement détecté
            }
        }
    }
    return true;
};
/**
 * Échange les dates de soutenance entre deux jurys
 */
export const swapDates = (jury1Id, jury2Id) => {
    const jury1 = mockJurys.find(j => j.idJury === jury1Id);
    const jury2 = mockJurys.find(j => j.idJury === jury2Id);
    if (!jury1 || !jury2)
        return false;
    // Échanger les dates et horaires
    const tempDate = jury1.dateSoutenance;
    const tempHeureDebut = jury1.heureDebut;
    const tempHeureFin = jury1.heureFin;
    jury1.dateSoutenance = jury2.dateSoutenance;
    jury1.heureDebut = jury2.heureDebut;
    jury1.heureFin = jury2.heureFin;
    jury2.dateSoutenance = tempDate;
    jury2.heureDebut = tempHeureDebut;
    jury2.heureFin = tempHeureFin;
    return true;
};
