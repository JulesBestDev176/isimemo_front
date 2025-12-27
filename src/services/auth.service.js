// Service d'authentification - Connecté au backend Express
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
export const authService = {
    // Inscription d'un candidat
    register: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Vérifier l'éligibilité
            const eligibilityResponse = yield fetch(`${API_BASE_URL}/etudiants/eligible/${encodeURIComponent(email)}`);
            const eligibility = yield eligibilityResponse.json();
            if (!eligibility.eligible) {
                return {
                    success: false,
                    message: eligibility.reason || "Vous n'êtes pas éligible à l'inscription."
                };
            }
            // Inscrire le candidat avec toutes les infos de l'étudiant
            const etudiant = eligibility.etudiant;
            const response = yield fetch(`${API_BASE_URL}/candidats/inscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    etudiantId: etudiant.id,
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                    telephone: etudiant.telephone
                })
            });
            const data = yield response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Erreur lors de l\'inscription'
                };
            }
            console.log('✅ Inscription réussie:', email);
            // Envoyer l'email avec le mot de passe temporaire
            try {
                yield fetch(`${API_BASE_URL}/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: email,
                        prenom: eligibility.etudiant.prenom,
                        tempPassword: data.temporaryPassword
                    })
                });
            }
            catch (emailError) {
                console.warn('⚠️ Échec envoi email, mais inscription réussie');
            }
            return {
                success: true,
                email: email,
                temporaryPassword: data.temporaryPassword,
                mustChangePassword: true,
                etudiant: eligibility.etudiant
            };
        }
        catch (error) {
            console.error('Erreur inscription:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }),
    // Inscription professeur (devient encadrant)
    registerProfesseur: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/encadrants/inscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = yield response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Erreur lors de l\'inscription'
                };
            }
            console.log('✅ Inscription professeur réussie:', email);
            return {
                success: true,
                email: email,
                temporaryPassword: data.temporaryPassword,
                mustChangePassword: true
            };
        }
        catch (error) {
            console.error('Erreur inscription professeur:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }),
    // Connexion
    login: (email, password, userType) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, userType })
            });
            const data = yield response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Email ou mot de passe incorrect'
                };
            }
            console.log('✅ Connexion réussie:', data.user.email);
            return {
                success: true,
                accessToken: 'mock-token-' + Date.now(),
                user: data.user
            };
        }
        catch (error) {
            console.error('Erreur connexion:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }),
    // Changer le mot de passe
    changePassword: (email, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, oldPassword, newPassword })
            });
            const data = yield response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Erreur lors du changement de mot de passe'
                };
            }
            console.log('✅ Mot de passe changé:', email);
            return { success: true };
        }
        catch (error) {
            console.error('Erreur changement mot de passe:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }),
    // Vérifier si un étudiant est éligible
    checkEligibility: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/etudiants/eligible/${encodeURIComponent(email)}`);
            return yield response.json();
        }
        catch (error) {
            return { eligible: false, reason: 'Erreur de connexion au serveur' };
        }
    }),
    // Récupérer un étudiant par email
    getEtudiantByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/etudiants/by-email/${encodeURIComponent(email)}`);
            if (!response.ok)
                return null;
            return yield response.json();
        }
        catch (error) {
            return null;
        }
    })
};
export default authService;
