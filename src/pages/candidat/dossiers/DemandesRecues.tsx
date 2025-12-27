import React, { useState, useEffect, useMemo } from 'react';
import { Users, CheckCircle, XCircle, Clock, Bell, UserCheck, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useAuth } from '../../../contexts/AuthContext';
import demandeBinomeService from '../../../services/demandeBinome.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

// Interface pour les propositions reçues
interface PropositionBinome {
  id: number;
  etudiant: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    numeroMatricule: string;
    niveau?: string;
    filiere?: string;
    departement?: string;
  };
  dateProposition: Date;
  message?: string;
  sujetChoisi: {
    id: number;
    titre: string;
    description?: string;
  };
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

interface DemandesRecuesProps {
  dossierId: number;
}

const DemandesRecues: React.FC<DemandesRecuesProps> = ({ dossierId }) => {
  const { user } = useAuth();
  const [propositionsRecues, setPropositionsRecues] = useState<PropositionBinome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propositionAConfirmer, setPropositionAConfirmer] = useState<PropositionBinome | null>(null);
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);

  // Charger les demandes reçues depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const recues = await demandeBinomeService.getDemandesRecues(user.id);
        
        // Mapper les demandes reçues vers le format PropositionBinome
        const propositionsMappees: PropositionBinome[] = recues.map((d: any) => ({
          id: d.idDemande,
          etudiant: {
            id: d.demandeurId,
            nom: d.demandeurNom || 'Inconnu',
            prenom: d.demandeurPrenom || '',
            email: d.demandeurEmail || '',
            numeroMatricule: d.demandeurMatricule || '',
            niveau: 'Licence 3',
            filiere: 'Génie Logiciel',
            departement: 'Département Informatique'
          },
          dateProposition: new Date(d.dateDemande),
          message: d.message,
          sujetChoisi: {
            id: d.dossierDemandeurId,
            titre: d.sujetTitre || 'Sujet proposé',
            description: d.sujetDescription || ''
          },
          statut: d.statut === 'EN_ATTENTE' ? 'en_attente' : d.statut === 'ACCEPTEE' ? 'acceptee' : 'refusee'
        }));
        setPropositionsRecues(propositionsMappees);
      } catch (err) {
        console.error('Erreur lors du chargement des demandes de binôme:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDemandes();
  }, [user?.id]);

  // Filtrer les propositions en attente
  const propositionsEnAttente = useMemo(() => {
    return propositionsRecues.filter(p => p.statut === 'en_attente');
  }, [propositionsRecues]);

  // Propositions acceptées
  const propositionsAcceptees = useMemo(() => {
    return propositionsRecues.filter(p => p.statut === 'acceptee');
  }, [propositionsRecues]);

  // Gestionnaires d'actions
  const handleAcceptProposition = (proposition: PropositionBinome) => {
    setPropositionAConfirmer(proposition);
    setShowConfirmAccept(true);
  };

  const handleConfirmAccept = async () => {
    if (!propositionAConfirmer) return;
    
    try {
      await demandeBinomeService.accepterDemande(propositionAConfirmer.id);
      
      // Mettre à jour l'état local
      setPropositionsRecues(prev => 
        prev.map(p => 
          p.id === propositionAConfirmer.id 
            ? { ...p, statut: 'acceptee' as const }
            : p
        )
      );
      setShowConfirmAccept(false);
      setPropositionAConfirmer(null);
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
    }
  };

  const handleRefuserProposition = async (propositionId: number) => {
    try {
      await demandeBinomeService.refuserDemande(propositionId);
      
      // Mettre à jour l'état local
      setPropositionsRecues(prev => 
        prev.map(p => 
          p.id === propositionId 
            ? { ...p, statut: 'refusee' as const }
            : p
        )
      );
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Chargement des demandes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Binôme accepté */}
      {propositionsAcceptees.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Binôme accepté
            </CardTitle>
          </CardHeader>
          <CardContent>
            {propositionsAcceptees.map((proposition) => (
              <div key={proposition.id} className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {proposition.etudiant.prenom} {proposition.etudiant.nom}
                  </h4>
                  <p className="text-sm text-gray-600">{proposition.etudiant.email}</p>
                  <p className="text-xs text-green-700 mt-1">
                    Vous travaillez ensemble sur : {proposition.sujetChoisi.titre}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Demandes en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Demandes de binôme reçues
            {propositionsEnAttente.length > 0 && (
              <Badge variant="default" className="ml-2">
                {propositionsEnAttente.length} en attente
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Les étudiants ci-dessous souhaitent travailler avec vous sur leur sujet de mémoire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {propositionsEnAttente.length > 0 ? (
            <div className="space-y-3">
              {propositionsEnAttente.map((proposition) => (
                <Card key={proposition.id} className="border-primary-200 bg-primary-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary-100 text-primary-800 border-primary-300">
                            Demande reçue
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {proposition.dateProposition.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary-100 rounded-full p-2">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {proposition.etudiant.prenom} {proposition.etudiant.nom}
                            </h4>
                            <p className="text-sm text-gray-600">{proposition.etudiant.email}</p>
                            {proposition.etudiant.numeroMatricule && (
                              <Badge variant="outline" className="mt-1">
                                {proposition.etudiant.numeroMatricule}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Sujet proposé */}
                        <div className="p-3 bg-white border border-primary-200 rounded-lg mt-3">
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Sujet proposé :</p>
                              <p className="text-sm text-gray-700">{proposition.sujetChoisi.titre}</p>
                              {proposition.sujetChoisi.description && (
                                <p className="text-xs text-gray-500 mt-1">{proposition.sujetChoisi.description}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {proposition.message && (
                          <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-700 italic">"{proposition.message}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleRefuserProposition(proposition.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        Refuser
                      </Button>
                      <Button 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleAcceptProposition(proposition)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accepter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Aucune demande de binôme en attente</p>
              <p className="text-sm text-gray-500 mt-2">
                Vous serez notifié lorsqu'un étudiant vous enverra une demande de binôme.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique des demandes refusées */}
      {propositionsRecues.filter(p => p.statut === 'refusee').length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-600 text-base">Demandes refusées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {propositionsRecues.filter(p => p.statut === 'refusee').map((proposition) => (
                <div key={proposition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full p-2">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        {proposition.etudiant.prenom} {proposition.etudiant.nom}
                      </p>
                      <p className="text-xs text-gray-500">{proposition.sujetChoisi.titre}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gray-500">Refusée</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmation pour accepter une proposition */}
      <Dialog open={showConfirmAccept} onOpenChange={setShowConfirmAccept}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmer l'acceptation de la demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir accepter cette demande de binôme ?
            </DialogDescription>
          </DialogHeader>
          {propositionAConfirmer && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {propositionAConfirmer.etudiant.prenom} {propositionAConfirmer.etudiant.nom}
                </h4>
                <p className="text-sm text-gray-600">{propositionAConfirmer.etudiant.email}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Important</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      En acceptant cette demande, vous travaillerez sur le sujet de {propositionAConfirmer.etudiant.prenom} :
                    </p>
                    <p className="text-sm font-medium text-yellow-900 mt-2">
                      "{propositionAConfirmer.sujetChoisi.titre}"
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">
                      Votre binôme sera responsable de la progression du dossier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmAccept(false);
                setPropositionAConfirmer(null);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleConfirmAccept} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmer l'acceptation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemandesRecues;
