var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const keycloakService = {
    /**
     * Authentifier un utilisateur (mode mock)
     */
    login: (email, _password) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 300));
        return {
            access_token: 'mock-access-token-' + Date.now(),
            expires_in: 3600,
            refresh_expires_in: 7200,
            refresh_token: 'mock-refresh-token-' + Date.now(),
            token_type: 'Bearer',
            session_state: 'mock-session-' + Date.now(),
            scope: 'openid profile email'
        };
    }),
    /**
     * Récupérer les informations de l'utilisateur (mode mock)
     */
    getUserInfo: (_accessToken) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 200));
        return {
            sub: 'mock-user-id',
            email_verified: true,
            name: 'Utilisateur Mock',
            preferred_username: 'mock.user',
            given_name: 'Mock',
            family_name: 'Utilisateur',
            email: 'mock@example.com'
        };
    }),
    /**
     * Rafraîchir le token d'accès (mode mock)
     */
    refreshToken: (_refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 200));
        return {
            access_token: 'mock-refreshed-access-token-' + Date.now(),
            expires_in: 3600,
            refresh_expires_in: 7200,
            refresh_token: 'mock-refreshed-refresh-token-' + Date.now(),
            token_type: 'Bearer',
            session_state: 'mock-session-' + Date.now(),
            scope: 'openid profile email'
        };
    }),
    /**
     * Déconnecter l'utilisateur (mode mock)
     */
    logout: (_refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(resolve => setTimeout(resolve, 100));
        keycloakService.clearTokens();
    }),
    /**
     * Stocker les tokens dans le sessionStorage
     */
    storeTokens: (tokens) => {
        sessionStorage.setItem('access_token', tokens.access_token);
        sessionStorage.setItem('refresh_token', tokens.refresh_token);
        sessionStorage.setItem('token_expires_at', (Date.now() + tokens.expires_in * 1000).toString());
    },
    /**
     * Récupérer le token d'accès depuis le sessionStorage
     */
    getAccessToken: () => {
        return sessionStorage.getItem('access_token');
    },
    /**
     * Récupérer le refresh token depuis le sessionStorage
     */
    getRefreshToken: () => {
        return sessionStorage.getItem('refresh_token');
    },
    /**
     * Vérifier si le token est expiré
     */
    isTokenExpired: () => {
        const expiresAt = sessionStorage.getItem('token_expires_at');
        if (!expiresAt)
            return true;
        return Date.now() >= parseInt(expiresAt);
    },
    /**
     * Nettoyer les tokens du sessionStorage
     */
    clearTokens: () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('token_expires_at');
        sessionStorage.removeItem('user');
    },
};
