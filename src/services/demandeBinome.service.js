// Service Demande Binome - Connecté au backend Express
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_URL = 'http://localhost:3001/api';
class DemandeBinomeService {
    /**
     * Crée une nouvelle demande de binôme
     */
    creerDemande(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la création de la demande');
            }
            const demande = yield response.json();
            console.log('📬 Nouvelle demande envoyée:', demande);
            return demande;
        });
    }
    /**
     * Récupère une demande par son ID
     */
    getDemandeById(demandeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/${demandeId}`);
            if (!response.ok)
                return undefined;
            return response.json();
        });
    }
    /**
     * Récupère les demandes reçues par un candidat
     */
    getDemandesRecues(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/recues/${candidatId}`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    /**
     * Récupère les demandes reçues en attente
     */
    getDemandesRecuesEnAttente(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const demandes = yield this.getDemandesRecues(candidatId);
            return demandes.filter(d => d.statut === 'EN_ATTENTE');
        });
    }
    /**
     * Récupère les demandes envoyées par un candidat
     */
    getDemandesEnvoyees(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/envoyees/${candidatId}`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    /**
     * Accepte une demande de binôme
     * Le destinataire (celui qui accepte) rejoint le dossier du demandeur (leader)
     */
    accepterDemande(demandeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/${demandeId}/accepter`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Erreur lors de l\'acceptation de la demande');
            }
            const data = yield response.json();
            console.log('🤝 Demande acceptée:', data);
            return data;
        });
    }
    /**
     * Refuse une demande de binôme
     */
    refuserDemande(demandeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/${demandeId}/refuser`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Erreur lors du refus de la demande');
            }
            const demande = yield response.json();
            console.log('❌ Demande refusée:', demande);
            return demande;
        });
    }
    /**
     * Annule une demande de binôme
     */
    annulerDemande(demandeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/${demandeId}/annuler`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error('Erreur lors de l\'annulation de la demande');
            }
            const demande = yield response.json();
            console.log('🚫 Demande annulée:', demande);
            return demande;
        });
    }
}
const demandeBinomeService = new DemandeBinomeService();
export default demandeBinomeService;
