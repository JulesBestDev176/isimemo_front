// Service d'envoi d'email pour l'inscription
// Appelle le backend Express pour envoyer les emails via SMTP
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = 'http://localhost:3001';
// Envoyer un email d'inscription avec le mot de passe temporaire
export const sendRegistrationEmail = (email, prenom, motDePasseTemporaire) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📧 Envoi de l\'email via backend...');
    try {
        const response = yield fetch(`${API_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                prenom: prenom,
                tempPassword: motDePasseTemporaire
            })
        });
        const data = yield response.json();
        if (data.success) {
            console.log('✅ Email envoyé avec succès à:', email);
            return {
                success: true,
                message: `Un email a été envoyé à ${email} avec vos identifiants.`
            };
        }
        else {
            console.error('❌ Erreur backend:', data.message);
            // Retourner quand même le mot de passe pour que l'utilisateur puisse se connecter
            return {
                success: false,
                message: `${data.message}. Votre mot de passe temporaire est : ${motDePasseTemporaire}`
            };
        }
    }
    catch (error) {
        console.error('❌ Erreur de connexion au backend:', error);
        // Afficher le mot de passe dans la console en fallback
        console.log('📧 ═══════════════════════════════════════════════════');
        console.log('📧   BACKEND NON DISPONIBLE - Identifiants');
        console.log('📧 ═══════════════════════════════════════════════════');
        console.log(`📧 Email: ${email}`);
        console.log(`📧 Mot de passe: ${motDePasseTemporaire}`);
        console.log('📧 ═══════════════════════════════════════════════════');
        console.log('📧 Lancez le backend: cd backend && npm start');
        console.log('📧 ═══════════════════════════════════════════════════');
        return {
            success: false,
            message: 'Serveur email non disponible. Lancez: cd backend && npm start'
        };
    }
});
