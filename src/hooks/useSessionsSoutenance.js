// ============================================================================
// HOOK - GESTION DES SESSIONS DE SOUTENANCE
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
import { useState, useCallback } from 'react';
import { StatutSession } from '../models/services/SessionSoutenance';
import { mockSessionsSoutenance } from '../mocks/models/SessionSoutenance.mock';
import { getSessionOuverte, getSessionsByAnnee } from '../models/services/SessionSoutenance';
/**
 * Hook pour récupérer toutes les sessions de soutenance
 */
export const useSessionsSoutenance = (anneeAcademique) => {
    const [sessions] = useState(mockSessionsSoutenance);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const sessionsFiltrees = anneeAcademique
        ? getSessionsByAnnee(sessions, anneeAcademique)
        : sessions;
    return {
        sessions: sessionsFiltrees,
        isLoading,
        error,
        sessionOuverte: anneeAcademique ? getSessionOuverte(sessions, anneeAcademique) : undefined
    };
};
/**
 * Hook pour créer une nouvelle session de soutenance
 */
export const useCreerSessionSoutenance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const creerSession = useCallback((session) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // const response = await fetch('/api/departement/sessions-soutenance', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(session)
            // });
            // const nouvelleSession = await response.json();
            // Simulation: Ajouter la session
            const nouvelleSession = Object.assign(Object.assign({}, session), { idSession: mockSessionsSoutenance.length + 1, dateCreation: new Date() });
            mockSessionsSoutenance.push(nouvelleSession);
            console.log('Nouvelle session de soutenance créée:', nouvelleSession);
            return nouvelleSession;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    return {
        creerSession,
        isLoading,
        error
    };
};
/**
 * Hook pour ouvrir une session de soutenance
 */
export const useOuvrirSessionSoutenance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const ouvrirSession = useCallback((idSession) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/sessions-soutenance/${idSession}/ouvrir`, { method: 'POST' });
            // Simulation: Ouvrir la session
            const session = mockSessionsSoutenance.find(s => s.idSession === idSession);
            if (session) {
                session.statut = StatutSession.OUVERTE;
                session.dateOuverture = new Date();
            }
            console.log(`Session ${idSession} ouverte`);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    return {
        ouvrirSession,
        isLoading,
        error
    };
};
/**
 * Hook pour fermer une session de soutenance
 */
export const useFermerSessionSoutenance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fermerSession = useCallback((idSession) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/sessions-soutenance/${idSession}/fermer`, { method: 'POST' });
            // Simulation: Fermer la session
            const session = mockSessionsSoutenance.find(s => s.idSession === idSession);
            if (session) {
                session.statut = StatutSession.FERMEE;
                session.dateFermeture = new Date();
            }
            console.log(`Session ${idSession} fermée`);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    return {
        fermerSession,
        isLoading,
        error
    };
};
/**
 * Hook pour modifier une session de soutenance
 */
export const useModifierSessionSoutenance = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const modifierSession = useCallback((idSession, updates) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/sessions-soutenance/${idSession}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(updates)
            // });
            // Simulation: Modifier la session
            const sessionIndex = mockSessionsSoutenance.findIndex(s => s.idSession === idSession);
            if (sessionIndex !== -1) {
                mockSessionsSoutenance[sessionIndex] = Object.assign(Object.assign({}, mockSessionsSoutenance[sessionIndex]), updates);
            }
            console.log(`Session ${idSession} modifiée`);
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    return {
        modifierSession,
        isLoading,
        error
    };
};
