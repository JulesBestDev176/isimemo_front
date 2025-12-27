// ============================================================================
// TYPES & INTERFACES
// ============================================================================
// ============================================================================
// MOCKS
// ============================================================================
export const mockNotesSuivi = [
    {
        id: 1,
        contenu: 'Première réunion de suivi avec l\'étudiant. Discussion sur le choix du sujet et la méthodologie. L\'étudiant a bien compris les attentes et semble motivé.',
        dateCreation: new Date('2025-01-10T10:00:00'),
        dossierMemoire: { idDossierMemoire: 101 },
        idEncadrant: 4
    },
    {
        id: 2,
        contenu: 'Révision du chapitre 1. Bon travail sur l\'introduction, mais il faut approfondir l\'état de l\'art. L\'étudiant doit ajouter au moins 5 références supplémentaires.',
        dateCreation: new Date('2025-01-15T14:30:00'),
        dossierMemoire: { idDossierMemoire: 101 },
        idEncadrant: 4
    },
    {
        id: 3,
        contenu: 'Suivi de progression : L\'étudiant avance bien. Le chapitre 2 est en cours de rédaction. Prochaine réunion prévue le 25 janvier.',
        dateCreation: new Date('2025-01-20T16:00:00'),
        dossierMemoire: { idDossierMemoire: 101 },
        idEncadrant: 4
    },
    {
        id: 4,
        contenu: 'Première rencontre avec l\'étudiant. Présentation du sujet et des objectifs. Bonne compréhension des enjeux.',
        dateCreation: new Date('2025-01-08T09:00:00'),
        dossierMemoire: { idDossierMemoire: 102 },
        idEncadrant: 4
    },
    {
        id: 5,
        contenu: 'Validation du plan détaillé. L\'étudiant a bien structuré son mémoire. Passage à la rédaction du chapitre 1.',
        dateCreation: new Date('2025-01-12T11:00:00'),
        dossierMemoire: { idDossierMemoire: 102 },
        idEncadrant: 4
    },
    {
        id: 6,
        contenu: 'Première réunion de suivi. Discussion sur la méthodologie et les outils à utiliser. L\'étudiant est autonome et pose de bonnes questions.',
        dateCreation: new Date('2025-01-05T15:00:00'),
        dossierMemoire: { idDossierMemoire: 103 },
        idEncadrant: 4
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Récupère toutes les notes de suivi pour un dossier donné
 */
export const getNotesSuiviByDossier = (idDossierMemoire) => {
    return mockNotesSuivi
        .filter(note => { var _a; return ((_a = note.dossierMemoire) === null || _a === void 0 ? void 0 : _a.idDossierMemoire) === idDossierMemoire; })
        .sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime()); // Plus récentes en premier
};
/**
 * Récupère une note de suivi par son ID
 */
export const getNoteSuiviById = (id) => {
    return mockNotesSuivi.find(note => note.id === id);
};
/**
 * Ajoute une nouvelle note de suivi
 */
export const addNoteSuivi = (note) => {
    const newNote = Object.assign(Object.assign({}, note), { id: Math.max(...mockNotesSuivi.map(n => n.id), 0) + 1, dateCreation: new Date() });
    mockNotesSuivi.push(newNote);
    return newNote;
};
/**
 * Met à jour une note de suivi existante
 */
export const updateNoteSuivi = (id, updates) => {
    const note = mockNotesSuivi.find(n => n.id === id);
    if (note) {
        Object.assign(note, updates, { dateModification: new Date() });
        return note;
    }
    return undefined;
};
/**
 * Supprime une note de suivi
 */
export const deleteNoteSuivi = (id) => {
    const index = mockNotesSuivi.findIndex(n => n.id === id);
    if (index !== -1) {
        mockNotesSuivi.splice(index, 1);
        return true;
    }
    return false;
};
