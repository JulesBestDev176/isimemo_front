// ============================================================================
// HOOK - GESTION DES ATTRIBUTIONS DE RÔLES
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
import { TypeRole } from '../models/services/AttributionRole';
import { mockAttributionsRoles } from '../mocks/models/AttributionRole.mock';
import { getAttributionsActives, hasRole, getProfesseursAvecRole } from '../models/services/AttributionRole';
/**
 * Hook pour récupérer toutes les attributions de rôles
 */
export const useAttributionsRoles = (anneeAcademique) => {
    const [attributions] = useState(mockAttributionsRoles);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const attributionsFiltrees = anneeAcademique
        ? attributions.filter(a => a.anneeAcademique === anneeAcademique)
        : attributions;
    return {
        attributions: attributionsFiltrees,
        isLoading,
        error
    };
};
/**
 * Hook pour récupérer les attributions actives d'un professeur
 */
export const useAttributionsProfesseur = (idProfesseur, anneeAcademique) => {
    const [attributions] = useState(mockAttributionsRoles);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const attributionsProfesseur = getAttributionsActives(attributions, idProfesseur, anneeAcademique);
    return {
        attributions: attributionsProfesseur,
        isLoading,
        error,
        estCommission: hasRole(attributions, idProfesseur, TypeRole.COMMISSION, anneeAcademique),
        estJurie: hasRole(attributions, idProfesseur, TypeRole.JURIE, anneeAcademique),
        peutEtrePresident: hasRole(attributions, idProfesseur, TypeRole.PRESIDENT_JURY_POSSIBLE, anneeAcademique)
    };
};
/**
 * Hook pour récupérer les professeurs avec un rôle spécifique
 */
export const useProfesseursAvecRole = (typeRole, anneeAcademique) => {
    const [attributions] = useState(mockAttributionsRoles);
    const [isLoading] = useState(false);
    const [error] = useState(null);
    const professeurs = getProfesseursAvecRole(attributions, typeRole, anneeAcademique);
    return {
        professeurs,
        isLoading,
        error
    };
};
/**
 * Hook pour attribuer un rôle à un professeur
 */
export const useAttribuerRole = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const attribuerRole = useCallback((idProfesseur, typeRole, anneeAcademique, attribuePar) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // const response = await fetch('/api/departement/attributions-roles', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ idProfesseur, typeRole, anneeAcademique, attribuePar })
            // });
            // const nouvelleAttribution = await response.json();
            // Simulation: Ajouter l'attribution
            const professeur = mockAttributionsRoles[0].professeur; // TODO: Récupérer le vrai professeur
            const nouvelleAttribution = {
                idAttribution: mockAttributionsRoles.length + 1,
                professeur,
                typeRole,
                anneeAcademique,
                dateAttribution: new Date(),
                attribuePar,
                estActif: true
            };
            mockAttributionsRoles.push(nouvelleAttribution);
            console.log('Rôle attribué:', nouvelleAttribution);
            return nouvelleAttribution;
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
        attribuerRole,
        isLoading,
        error
    };
};
/**
 * Hook pour retirer un rôle à un professeur
 */
export const useRetirerRole = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const retirerRole = useCallback((idAttribution) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Appel API
            // await fetch(`/api/departement/attributions-roles/${idAttribution}`, { method: 'DELETE' });
            // Simulation: Désactiver l'attribution
            const attribution = mockAttributionsRoles.find(a => a.idAttribution === idAttribution);
            if (attribution) {
                attribution.estActif = false;
                attribution.dateRetrait = new Date();
            }
            console.log(`Attribution ${idAttribution} retirée`);
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
        retirerRole,
        isLoading,
        error
    };
};
