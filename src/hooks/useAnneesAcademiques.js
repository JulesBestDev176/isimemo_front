// ============================================================================
// HOOK - GESTION DES ANNÉES ACADÉMIQUES
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
import { mockAnneesAcademiques } from '../mocks/models/AnneeAcademique.mock';
import { getAnneeActive } from '../models/services/AnneeAcademique';
/**
 * Hook pour récupérer toutes les années académiques
 */
export const useAnneesAcademiques = () => {
    const [annees] = useState(mockAnneesAcademiques);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    return {
        annees,
        isLoading,
        error,
        anneeActive: getAnneeActive(annees)
    };
};
/**
 * Hook pour activer une année académique
 */
export const useActiverAnneeAcademique = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activerAnnee = useCallback((idAnnee) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/annees-academiques/${idAnnee}/activer`, { method: 'POST' });
            // Simulation: Désactiver toutes les années et activer celle-ci
            mockAnneesAcademiques.forEach(a => {
                a.estActive = a.idAnnee === idAnnee;
            });
            console.log(`Année académique ${idAnnee} activée`);
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
        activerAnnee,
        isLoading,
        error
    };
};
/**
 * Hook pour clôturer une année académique
 */
export const useCloturerAnneeAcademique = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const cloturerAnnee = useCallback((idAnnee) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/annees-academiques/${idAnnee}/cloturer`, { method: 'POST' });
            // Simulation: Désactiver l'année
            const annee = mockAnneesAcademiques.find(a => a.idAnnee === idAnnee);
            if (annee) {
                annee.estActive = false;
            }
            console.log(`Année académique ${idAnnee} clôturée`);
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
        cloturerAnnee,
        isLoading,
        error
    };
};
/**
 * Hook pour créer une nouvelle année académique
 */
export const useCreerAnneeAcademique = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const creerAnnee = useCallback((annee) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // const response = await fetch('/api/departement/annees-academiques', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(annee)
            // });
            // const nouvelleAnnee = await response.json();
            // Simulation: Ajouter l'année
            const nouvelleAnnee = Object.assign(Object.assign({}, annee), { idAnnee: mockAnneesAcademiques.length + 1 });
            mockAnneesAcademiques.push(nouvelleAnnee);
            console.log('Nouvelle année académique créée:', nouvelleAnnee);
            return nouvelleAnnee;
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
        creerAnnee,
        isLoading,
        error
    };
};
