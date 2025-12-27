// ============================================================================
// SERVICE API CHATBOT - FRONTEND
// ============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const API_URL = 'http://localhost:3001/api/chatbot';
class ChatbotService {
    /**
     * Poser une question au chatbot avec recherche dans les mémoires
     */
    ask(question_1) {
        return __awaiter(this, arguments, void 0, function* (question, nbMemoires = 3) {
            var _a, _b;
            try {
                const response = yield axios.post(`${API_URL}/ask`, {
                    question,
                    nbMemoires
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Erreur chatbot:', error);
                const err = error;
                throw new Error(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Erreur lors de la communication avec le chatbot');
            }
        });
    }
    /**
     * Rechercher des mémoires
     */
    searchMemoires(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, limit = 5) {
            var _a, _b;
            try {
                const response = yield axios.post(`${API_URL}/search-memoires`, {
                    query,
                    limit
                });
                return response.data.data;
            }
            catch (error) {
                console.error('Erreur recherche:', error);
                const err = error;
                throw new Error(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Erreur lors de la recherche');
            }
        });
    }
    /**
     * Question simple sans recherche de mémoires
     */
    simpleQuestion(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios.post(`${API_URL}/simple`, {
                    message
                });
                return response.data.data.reponse;
            }
            catch (error) {
                console.error('Erreur question simple:', error);
                const err = error;
                throw new Error(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Erreur lors de la communication');
            }
        });
    }
    /**
     * Vérifier l'état du service
     */
    health() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.get(`${API_URL}/health`);
                return response.data;
            }
            catch (error) {
                throw new Error('Le service chatbot n\'est pas disponible');
            }
        });
    }
}
export default new ChatbotService();
