// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export var TypeMessage;
(function (TypeMessage) {
    TypeMessage["TEXTE"] = "TEXTE";
    TypeMessage["FICHIER"] = "FICHIER";
    TypeMessage["SYSTEME"] = "SYSTEME";
})(TypeMessage || (TypeMessage = {}));
// ============================================================================
// MOCKS
// ============================================================================
export const mockMessages = [
    {
        idMessage: 'msg-1',
        contenu: 'Bonjour, j\'ai relu votre chapitre 2. Il est très bien structuré. Vous pouvez passer au chapitre 3.',
        dateEnvoi: new Date('2025-01-28T10:30:00'),
        typeMessage: TypeMessage.TEXTE
    },
    {
        idMessage: 'msg-2',
        contenu: 'N\'oubliez pas de déposer le chapitre 3 avant le 5 février.',
        dateEnvoi: new Date('2025-01-29T14:15:00'),
        typeMessage: TypeMessage.TEXTE
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getMessageById = (id) => {
    return mockMessages.find(m => m.idMessage === id);
};
