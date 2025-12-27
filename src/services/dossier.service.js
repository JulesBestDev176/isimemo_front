// Service Dossier - Connecté au backend Express
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
class DossierService {
    // Récupérer tous les dossiers
    getAllDossiers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Récupérer un dossier par ID
    getDossierById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${id}`);
            if (!response.ok) {
                throw new Error(`Dossier ${id} non trouvé`);
            }
            return response.json();
        });
    }
    // Récupérer les dossiers d'un candidat
    getDossiersByCandidat(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/candidat/${candidatId}`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Récupérer le dossier unique d'un candidat
    getDossierCandidat(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dossiers = yield this.getDossiersByCandidat(candidatId);
            return dossiers.length > 0 ? dossiers[0] : null;
        });
    }
    // Compter les dossiers d'un candidat
    countDossiersByCandidat(candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dossiers = yield this.getDossiersByCandidat(candidatId);
            return dossiers.length;
        });
    }
    // Créer un dossier
    createDossier(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création du dossier');
            }
            // Le backend renvoie { success: true, dossier: {...} }
            const dossier = data.dossier || data;
            console.log('✅ Dossier créé:', dossier);
            return dossier;
        });
    }
    // Mettre à jour un dossier
    updateDossier(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du dossier');
            }
            const dossier = yield response.json();
            console.log('✅ Dossier mis à jour:', dossier);
            return dossier;
        });
    }
    // Changer l'étape d'un dossier
    changerEtape(id, etape) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${id}/etape`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ etape })
            });
            if (!response.ok) {
                throw new Error('Erreur lors du changement d\'étape');
            }
            const dossier = yield response.json();
            console.log(`✅ Étape du dossier ${id} changée en ${etape}`);
            return dossier;
        });
    }
    // Récupérer les candidats disponibles pour binôme
    getCandidatsDisponibles(excludeCandidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/candidats/disponibles`);
            if (!response.ok)
                return [];
            let candidats = yield response.json();
            // Exclure le candidat courant
            if (excludeCandidatId) {
                candidats = candidats.filter((c) => c.id !== excludeCandidatId);
            }
            // Mapper vers le format attendu
            return candidats.map((c) => ({
                id: c.id,
                nom: c.nom,
                prenom: c.prenom,
                email: c.email,
                etudiantId: c.id
            }));
        });
    }
    // Sélectionner/attribuer un sujet au dossier (met à jour titre et description)
    selectionnerSujet(dossierId, sujetData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${dossierId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titre: sujetData.titre,
                    description: sujetData.description,
                    etape: 'CHOIX_BINOME',
                    progression: 20
                })
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la sélection du sujet');
            }
            const dossier = yield response.json();
            console.log('✅ Sujet sélectionné pour dossier:', dossierId);
            return dossier;
        });
    }
    // Ajouter un binôme à un dossier
    addBinomeToDossier(dossierId, candidatId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cette action est maintenant gérée par l'API lors de l'acceptation d'une demande
            console.log(`ℹ️ addBinomeToDossier appelé (géré par l'API /demandes/:id/accepter)`);
        });
    }
    // Choisir un sujet existant
    choisirSujet(sujetId, dossierId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield fetch(`${API_BASE_URL}/sujets/${sujetId}/choisir`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dossierId })
            });
            const data = yield response.json();
            if (!response.ok) {
                console.error('❌ Erreur choix sujet:', data.message);
                return { success: false, message: data.message };
            }
            console.log('✅ Sujet choisi:', (_a = data.sujet) === null || _a === void 0 ? void 0 : _a.titre);
            return data;
        });
    }
    // Proposer un sujet personnalisé
    proposerSujet(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield fetch(`${API_BASE_URL}/sujets/proposer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            const data = yield response.json();
            if (!response.ok) {
                console.error('❌ Erreur proposition sujet:', data.message);
                return { success: false, message: data.message };
            }
            console.log('📝 Sujet proposé:', (_a = data.sujet) === null || _a === void 0 ? void 0 : _a.titre);
            return data;
        });
    }
    // Récupérer les documents d'un dossier
    getDocumentsByDossier(dossierId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${dossierId}/documents`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Récupérer les notes de suivi d'un dossier
    getNotesSuiviByDossier(dossierId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${dossierId}/notes-suivi`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Initier/Autoriser la pré-lecture
    autoriserPrelecture(demandeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/demandes/${demandeId}/autoriser-prelecture`, {
                method: 'PUT'
            });
            if (!response.ok)
                throw new Error('Erreur lors de l\'initiation de la pré-lecture');
            return response.json();
        });
    }
    // Traiter le rapport de plagiat
    traiterPlagiat(id, action, commentaire) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/prelecture/${id}/traiter-plagiat`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, commentaire })
            });
            if (!response.ok)
                throw new Error('Erreur lors du traitement du plagiat');
            return response.json();
        });
    }
    // Valider TRI
    validerTRI(id, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/prelecture/${id}/valider-tri`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback })
            });
            if (!response.ok)
                throw new Error('Erreur lors de la validation TRI');
            return response.json();
        });
    }
    // Bouclage encadrant
    bouclageEncadrant(id, action, commentaire) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/prelecture/${id}/bouclage-encadrant`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, commentaire })
            });
            if (!response.ok)
                throw new Error('Erreur lors du bouclage de la pré-lecture');
            return response.json();
        });
    }
    // Validation par lot via CSV
    batchValidation(decisions_1) {
        return __awaiter(this, arguments, void 0, function* (decisions, type = 'COMMISSION') {
            const response = yield fetch(`${API_BASE_URL}/personnel/dossiers/batch-validation`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decisions, type })
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la validation par lot');
            }
            return response.json();
        });
    }
    // --- Suivi & Réunions ---
    // Récupérer les réunions (messages) pour un encadrant
    getReunionsEncadrant(encadrantId, annee) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/encadrements/${annee}/reunions?encadrantId=${encadrantId}`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Convertir une réunion en note de suivi
    validerReunionCommeNote(messageId, dossierId, encadrantId, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/notes-suivi/reunion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, dossierId, encadrantId, contenu })
            });
            if (!response.ok)
                throw new Error('Erreur lors de la conversion de la réunion');
            return response.json();
        });
    }
    // Récupérer les étudiants encadrés (réel) pour le select
    getEtudiantsEncadres(encadrantId, annee) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/encadrements/${annee}/etudiants?encadrantId=${encadrantId}`);
            if (!response.ok)
                throw new Error('Erreur récupération étudiants');
            return response.json();
        });
    }
    // Récupérer les tâches d'un encadrant
    getTachesEncadrement(encadrantId, annee) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${API_BASE_URL}/encadrements/${annee}/taches?encadrantId=${encadrantId}`);
            if (!response.ok)
                return [];
            return response.json();
        });
    }
    // Créer des notes de suivi en masse
    createNoteSuiviBulk(dossierIds_1, encadrantId_1, contenu_1) {
        return __awaiter(this, arguments, void 0, function* (dossierIds, encadrantId, contenu, type = 'AUTRE') {
            const response = yield fetch(`${API_BASE_URL}/notes-suivi/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dossierIds, encadrantId, contenu, type })
            });
            if (!response.ok)
                throw new Error('Erreur lors de la création groupée des notes');
            return response.json();
        });
    }
}
export const dossierService = new DossierService();
export default dossierService;
