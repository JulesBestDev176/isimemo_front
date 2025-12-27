// ============================================================================
// ENUMS & TYPES
// ============================================================================
export var StatutSession;
(function (StatutSession) {
    StatutSession["PLANIFIEE"] = "PLANIFIEE";
    StatutSession["OUVERTE"] = "OUVERTE";
    StatutSession["FERMEE"] = "FERMEE";
})(StatutSession || (StatutSession = {}));
// ============================================================================
// MOCK DATA
// ============================================================================
// Sessions de soutenance mockées
export const MOCK_SESSIONS = [
    {
        id: 1,
        nom: "Session Septembre 2025",
        anneeAcademique: "2024-2025",
        dateDebut: new Date('2025-09-15'),
        dateFin: new Date('2025-09-18'),
        statut: StatutSession.OUVERTE
    },
    {
        id: 2,
        nom: "Session Décembre 2025",
        anneeAcademique: "2024-2025",
        dateDebut: new Date('2025-12-10'),
        dateFin: new Date('2025-12-12'),
        statut: StatutSession.PLANIFIEE
    }
];
// Disponibilités mockées pour le prof connecté (ID 1)
export const MOCK_DISPONIBILITES_JURY = [
    {
        id: 1,
        professeurId: 1,
        sessionId: 1,
        session: MOCK_SESSIONS[0],
        joursDisponibles: [
            {
                date: new Date('2025-09-15'),
                creneaux: [
                    { heureDebut: '09:00', heureFin: '12:00' },
                    { heureDebut: '14:00', heureFin: '17:00' }
                ]
            },
            {
                date: new Date('2025-09-18'),
                creneaux: [
                    { heureDebut: '09:00', heureFin: '11:00' }
                ]
            }
        ],
        commentaire: "Pas disponible le mardi 16",
        dateMiseAJour: new Date('2025-09-01')
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getDisponibiliteForSession = (profId, sessionId) => {
    return MOCK_DISPONIBILITES_JURY.find(d => d.professeurId === profId && d.sessionId === sessionId);
};
export const getSessionsOuvertes = () => {
    return MOCK_SESSIONS.filter(s => s.statut === StatutSession.OUVERTE);
};
