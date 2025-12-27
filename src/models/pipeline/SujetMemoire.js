// ============================================================================
// TYPES & INTERFACES
// ============================================================================
import { sujetsData } from '../../data/sujets.data';
// Re-exporter les mocks centralisés
export const mockSujets = sujetsData;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getSujetById = (id) => {
    return mockSujets.find(s => s.id === id);
};
export const getSujetsDisponibles = () => {
    return mockSujets.filter(s => s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
};
export const getSujetsParFiliere = (filiere) => {
    return mockSujets.filter(s => s.filieres.includes(filiere));
};
