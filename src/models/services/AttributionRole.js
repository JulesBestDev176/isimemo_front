// ============================================================================
// TYPES & INTERFACES - ATTRIBUTION DE RÔLES
// ============================================================================
export var TypeRole;
(function (TypeRole) {
    TypeRole["COMMISSION"] = "COMMISSION";
    TypeRole["JURIE"] = "JURIE";
    TypeRole["PRESIDENT_JURY_POSSIBLE"] = "PRESIDENT_JURY_POSSIBLE";
})(TypeRole || (TypeRole = {}));
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Vérifie si une attribution est valide pour une année académique donnée
 */
export const isAttributionValide = (attribution, anneeAcademique) => {
    return (attribution.estActif &&
        attribution.anneeAcademique === anneeAcademique &&
        !attribution.dateRetrait);
};
/**
 * Récupère les attributions actives pour un professeur
 */
export const getAttributionsActives = (attributions, idProfesseur, anneeAcademique) => {
    return attributions.filter(a => a.professeur.idProfesseur === idProfesseur &&
        isAttributionValide(a, anneeAcademique));
};
/**
 * Vérifie si un professeur a un rôle spécifique pour une année académique
 */
export const hasRole = (attributions, idProfesseur, typeRole, anneeAcademique) => {
    return attributions.some(a => a.professeur.idProfesseur === idProfesseur &&
        a.typeRole === typeRole &&
        isAttributionValide(a, anneeAcademique));
};
/**
 * Récupère tous les professeurs avec un rôle spécifique pour une année académique
 */
export const getProfesseursAvecRole = (attributions, typeRole, anneeAcademique) => {
    return attributions
        .filter(a => a.typeRole === typeRole && isAttributionValide(a, anneeAcademique))
        .map(a => a.professeur);
};
/**
 * Récupère le libellé d'un type de rôle
 */
export const getLibelleRole = (typeRole) => {
    const libelles = {
        [TypeRole.COMMISSION]: 'Membre de Commission',
        [TypeRole.JURIE]: 'Membre de Jury',
        [TypeRole.PRESIDENT_JURY_POSSIBLE]: 'Possible Président de Jury'
    };
    return libelles[typeRole];
};
// ============================================================================
// MOCKS
// ============================================================================
export const mockAttributions = [
    {
        idAttribution: 1,
        professeur: {
            idProfesseur: 1,
            nom: 'Pierre',
            prenom: 'Jean',
            email: 'jean.pierre@isi.ml',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Docteur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    },
    {
        idAttribution: 2,
        professeur: {
            idProfesseur: 4,
            nom: 'Sarr',
            prenom: 'Mamadou',
            email: 'mamadou.sarr@isi.edu.sn',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Professeur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    },
    {
        idAttribution: 3,
        professeur: {
            idProfesseur: 2,
            nom: 'Ndiaye',
            prenom: 'Ibrahima',
            email: 'ibrahima.ndiaye@isi.edu.sn',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Professeur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    },
    {
        idAttribution: 4,
        professeur: {
            idProfesseur: 10,
            nom: 'Cissé',
            prenom: 'Abdoulaye',
            email: 'abdoulaye.cisse@isi.edu.sn',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Professeur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    },
    {
        idAttribution: 5,
        professeur: {
            idProfesseur: 12,
            nom: 'Diouf',
            prenom: 'Cheikh',
            email: 'cheikh.diouf@isi.edu.sn',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Professeur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    },
    {
        idAttribution: 6,
        professeur: {
            idProfesseur: 14,
            nom: 'Tall',
            prenom: 'Alioune',
            email: 'alioune.tall@isi.edu.sn',
            estDisponible: true,
            departement: 'Département Informatique',
            grade: 'Professeur'
        },
        typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
        anneeAcademique: '2024-2025',
        dateAttribution: new Date('2024-09-01'),
        attribuePar: 2,
        estActif: true
    }
];
