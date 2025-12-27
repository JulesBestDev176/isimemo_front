// Service Sujet - Mode Mock (pas de connexion backend)
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sujetsData } from '../data/sujets.data';
const mockSujets = sujetsData;
class SujetService {
    // =============== CRUD de base ===============
    getAllSujets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            return [...mockSujets];
        });
    }
    getSujetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 150));
            const sujet = mockSujets.find(s => s.id === id);
            if (!sujet) {
                throw new Error(`Sujet ${id} non trouvé`);
            }
            return sujet;
        });
    }
    createSujet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 300));
            const newSujet = {
                id: mockSujets.length + 1,
                titre: request.titre,
                description: request.description || '',
                filieres: request.filieres ? request.filieres.split(',').map(f => f.trim()) : [],
                niveau: request.niveau || '',
                departement: request.departement || '',
                motsCles: request.motsCles || [],
                prerequis: request.prerequis || '',
                objectifs: request.objectifs || '',
                anneeAcademique: request.anneeAcademique,
                origine: 'BANQUE',
                statut: 'soumis',
                emailCreateur: request.emailCreateur,
                nomCreateur: request.nomCreateur || '',
                nombreMaxEtudiants: 1, // Default
                nombreEtudiantsActuels: 0,
                dateCreation: new Date().toISOString(),
                dateModification: new Date().toISOString()
            };
            mockSujets.push(newSujet);
            return newSujet;
        });
    }
    updateSujet(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 250));
            const index = mockSujets.findIndex(s => s.id === id);
            if (index === -1) {
                throw new Error(`Sujet ${id} non trouvé`);
            }
            mockSujets[index] = Object.assign(Object.assign({}, mockSujets[index]), { titre: request.titre, description: request.description || mockSujets[index].description, filieres: request.filieres ? request.filieres.split(',').map(f => f.trim()) : mockSujets[index].filieres, niveau: request.niveau || mockSujets[index].niveau, departement: request.departement || mockSujets[index].departement, motsCles: request.motsCles || mockSujets[index].motsCles, prerequis: request.prerequis || mockSujets[index].prerequis, objectifs: request.objectifs || mockSujets[index].objectifs, dateModification: new Date().toISOString() });
            return mockSujets[index];
        });
    }
    deleteSujet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            const index = mockSujets.findIndex(s => s.id === id);
            if (index !== -1) {
                mockSujets.splice(index, 1);
            }
        });
    }
    // =============== Propositions étudiants ===============
    proposerSujet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Appel à l'API backend qui crée le sujet ET met à jour le dossier
            const response = yield fetch('http://localhost:3001/api/sujets/proposer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dossierId: request.dossierMemoireId,
                    candidatId: request.candidatId,
                    titre: request.titre,
                    description: request.description || '',
                    motsCles: [],
                    objectifs: []
                })
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la proposition du sujet');
            }
            console.log('✅ Sujet proposé via API:', (_a = data.sujet) === null || _a === void 0 ? void 0 : _a.titre);
            // Retourner le sujet créé
            return {
                id: data.sujet.id,
                titre: data.sujet.titre,
                description: data.sujet.description,
                filieres: [],
                niveau: data.sujet.niveau || 'L3',
                departement: '',
                motsCles: data.sujet.motsCles || [],
                prerequis: '',
                objectifs: ((_b = data.sujet.objectifs) === null || _b === void 0 ? void 0 : _b.join(', ')) || '',
                anneeAcademique: request.anneeAcademique,
                origine: 'PROPOSITION',
                statut: data.sujet.statut,
                emailCreateur: request.emailCreateur,
                nomCreateur: request.nomCreateur || '',
                candidatId: request.candidatId,
                dossierMemoireId: request.dossierMemoireId,
                nombreMaxEtudiants: 2,
                nombreEtudiantsActuels: 1,
                dateCreation: data.sujet.dateCreation || new Date().toISOString(),
                dateModification: new Date().toISOString()
            };
        });
    }
    getPropositionsByCandidat(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            return mockSujets.filter(s => s.candidatId === candidatId);
        });
    }
    // =============== Recherche et filtrage ===============
    getSujetsDisponibles() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            return mockSujets.filter(s => s.statut === 'VALIDE' && s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
        });
    }
    getSujetsByFiliere(filiere) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            return mockSujets.filter(s => s.filieres.includes(filiere));
        });
    }
    getSujetsByFiliereAndNiveau(filiere, niveau) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            return mockSujets.filter(s => s.filieres.includes(filiere) && s.niveau === niveau);
        });
    }
    searchSujets(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 200));
            const lowerKeyword = keyword.toLowerCase();
            return mockSujets.filter(s => s.titre.toLowerCase().includes(lowerKeyword) ||
                s.description.toLowerCase().includes(lowerKeyword) ||
                s.motsCles.some(m => m.toLowerCase().includes(lowerKeyword)));
        });
    }
    getSujetByDossierId(dossierMemoireId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 150));
            return mockSujets.find(s => s.dossierMemoireId === dossierMemoireId) || null;
        });
    }
    // =============== Attribution ===============
    attribuerSujet(sujetId, dossierMemoireId, _groupeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 300));
            const index = mockSujets.findIndex(s => s.id === sujetId);
            if (index === -1) {
                throw new Error(`Sujet ${sujetId} non trouvé`);
            }
            mockSujets[index].dossierMemoireId = dossierMemoireId;
            mockSujets[index].dateModification = new Date().toISOString();
            return mockSujets[index];
        });
    }
    // =============== Import CSV ===============
    importFromCsv(_file, _emailCreateur, _anneeAcademique) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Mode mock - simuler un import réussi
            return {
                totalRows: 3,
                successCount: 3,
                errorCount: 0,
                errors: [],
                importedSujets: mockSujets.slice(0, 3)
            };
        });
    }
}
export const sujetService = new SujetService();
export default sujetService;
