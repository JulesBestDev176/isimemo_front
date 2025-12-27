import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  X,
  Check,
  RotateCcw,
  Users,
  Plus,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: 'todo' | 'inprogress' | 'review' | 'done';
  priorite: string;
  dateEcheance?: string;
  livrable?: {
    nom: string;
    chemin: string;
    dateUpload: string;
  };
  estRetournee?: boolean;
  feedbackRetour?: {
    dateRetour: string;
    commentaire: string;
    corrections: string[];
  };
  sousEtapes?: {
    id: number;
    titre: string;
    terminee: boolean;
  }[];
}

interface Demande {
  idDemande: number;
  dossierId: number;
  candidats?: Candidat[];
  candidat?: Candidat;
  dossierMemoire?: {
    titre: string;
    description: string;
    progression: number;
    etape: string;
  };
}

interface SupervisionDashboardProps {
  demandes: Demande[];
  encadrantId: number;
  anneeAcademique: string;
}

export const SupervisionDashboard: React.FC<SupervisionDashboardProps> = ({
  demandes,
  encadrantId,
  anneeAcademique
}) => {
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [loadingTaches, setLoadingTaches] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState<Tache | null>(null);
  const [feedback, setFeedback] = useState({
    commentaire: '',
    corrections: ['']
  });

  // Filtrer les demandes selon la recherche
  const filteredDemandes = useMemo(() => {
    return demandes.filter(d => {
      const nomComplet = d.candidats 
        ? d.candidats.map(c => `${c.prenom} ${c.nom}`).join(' ') 
        : `${d.candidat?.prenom} ${d.candidat?.nom}`;
      const search = searchQuery.toLowerCase();
      return (
        nomComplet.toLowerCase().includes(search) ||
        d.dossierMemoire?.titre.toLowerCase().includes(search)
      );
    });
  }, [demandes, searchQuery]);

  const [demandePrelecture, setDemandePrelecture] = useState<any | null>(null);

  // Charger les tâches et la pré-lecture quand une demande est sélectionnée
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDemande) return;
      setLoadingTaches(true);
      try {
        const [tachesRes, prelectureRes] = await Promise.all([
          fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/taches`),
          fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/prelecture`)
        ]);

        if (tachesRes.ok) {
          const tachesData = await tachesRes.json();
          setTaches(tachesData);
          console.log('📋 Tâches chargées:', tachesData);
        }

        if (prelectureRes.ok) {
          const prelectureData = await prelectureRes.json();
          setDemandePrelecture(prelectureData);
          console.log('📄 Pré-lecture chargée:', prelectureData);
        } else {
          setDemandePrelecture(null);
          console.log('📄 Aucune pré-lecture trouvée');
        }
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoadingTaches(false);
      }
    };
    fetchData();
  }, [selectedDemande]);

  const handleUpdateStatus = async (tacheId: number, nouveauStatut: string, feedbackData?: any) => {
    try {
      const response = await fetch(`http://localhost:3001/api/taches/${tacheId}/statut`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          statut: nouveauStatut,
          feedbackRetour: feedbackData ? {
            commentaire: feedbackData.commentaire,
            corrections: feedbackData.corrections.filter((c: string) => c.trim())
          } : undefined
        })
      });

      if (response.ok) {
        // Rafraîchir les tâches
        const updatedResponse = await fetch(`http://localhost:3001/api/demandes/${selectedDemande!.idDemande}/taches`);
        const data = await updatedResponse.json();
        setTaches(data);
        setShowReviewModal(null);
        setFeedback({ commentaire: '', corrections: [''] });
      }
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
    }
  };

  const handleValiderPrelecture = async () => {
    if (!selectedDemande) return;
    
    if (!window.confirm("Êtes-vous sûr de vouloir de lancer l'analyse anti-plagiat et la pré-lecture ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/autoriser-prelecture`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDemandePrelecture(data.demandePrelecture);
        alert("Analyse anti-plagiat lancée ! Consultez le rapport ci-dessous.");
        // Recharger les données pour mettre à jour l'étape
        const updatedDossier = data.dossier;
        setSelectedDemande({
          ...selectedDemande,
          dossierMemoire: {
            ...selectedDemande.dossierMemoire!,
            ...updatedDossier
          }
        });
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.error}`);
      }
    } catch (error) {
      console.error("Erreur validation pré-lecture:", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleTraiterPlagiat = async (action: 'accepter' | 'rejeter') => {
    if (!demandePrelecture) return;
    const commentaire = action === 'rejeter' ? prompt("Motif du rejet :") : null;
    if (action === 'rejeter' && !commentaire) return;

    try {
      const response = await fetch(`http://localhost:3001/api/prelecture/${demandePrelecture.id}/traiter-plagiat`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, commentaire })
      });
      
      if (response.ok) {
        const data = await response.json();
        setDemandePrelecture(data.demandePrelecture);
        alert(action === 'rejeter' ? "Dossier rejeté pour plagiat." : "Dossier envoyé à la commission TRI.");
      }
    } catch (error) {
      console.error("Erreur traitement plagiat:", error);
    }
  };

  const handleBouclageFinal = async (action: 'cloturer' | 'creer_tache') => {
    if (!demandePrelecture) return;
    const commentaire = action === 'creer_tache' ? prompt("Tâches correctives à effectuer :") : null;
    if (action === 'creer_tache' && !commentaire) return;

    try {
      const response = await fetch(`http://localhost:3001/api/prelecture/${demandePrelecture.id}/bouclage-encadrant`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, commentaire })
      });
      
      if (response.ok) {
        const data = await response.json();
        setDemandePrelecture(data.demandePrelecture);
        alert(action === 'cloturer' ? "Phase de pré-lecture bouclée avec succès !" : "Tâches correctives envoyées.");
        if (action === 'cloturer') setSelectedDemande(null);
      }
    } catch (error) {
      console.error("Erreur bouclage:", error);
    }
  };

  const renderTaskColumn = (title: string, status: string, count: number) => {
    const columnTasks = taches.filter(t => t.statut === status);
    return (
      <div className="flex-1 min-w-[300px] flex flex-col bg-gray-50 border border-gray-200 rounded-sm">
        <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">{title}</h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {columnTasks.map(tache => (
            <div 
              key={tache.id}
              className={`bg-white p-3 border border-gray-200 shadow-sm hover:border-gray-400 transition-colors cursor-pointer group ${
                tache.statut === 'review' ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => tache.statut === 'review' && setShowReviewModal(tache)}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{tache.titre}</h4>
                {tache.estRetournee && (
                  <span className="text-[10px] font-bold text-red-600 border border-red-200 px-1 rounded bg-red-50">REJETÉ</span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{tache.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  tache.priorite === 'Critique' ? 'bg-red-600 text-white' :
                  tache.priorite === 'Haute' ? 'bg-orange-500 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {tache.priorite.toUpperCase()}
                </span>
                {tache.statut === 'review' && (
                  <span className="text-primary text-xs font-bold group-hover:underline flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    RÉVISER
                  </span>
                )}
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-xs">
              Aucune tâche
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedDemande) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedDemande(null)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          RETOUR À LA LISTE
        </button>

        <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedDemande.dossierMemoire?.titre}</h2>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">
                {selectedDemande.candidats 
                  ? selectedDemande.candidats.map(c => `${c.prenom} ${c.nom}`).join(' & ') 
                  : `${selectedDemande.candidat?.prenom} ${selectedDemande.candidat?.nom}`}
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col items-end">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Avancement global : {selectedDemande.dossierMemoire?.progression}%</div>
            <div className="w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${selectedDemande.dossierMemoire?.progression}%` }}
              />
            </div>
          </div>
          
          {/* Nouveau : Section Pré-lecture / Anti-plagiat */}
          {(() => {
            // Conditions pour afficher le bouton "Autoriser pré-lecture":
            // 1. Il y a au moins une tâche
            // 2. Toutes les tâches sont à "done"
            // 3. Il n'y a pas encore de demande de pré-lecture créée
            const condition1 = taches.length > 0;
            const condition2 = taches.every(t => t.statut === 'done');
            const condition3 = !demandePrelecture;
            const showButton = condition1 && condition2 && condition3;

            console.log('🔍 DEBUG BOUTON PRÉ-LECTURE:');
            console.log('  taches.length:', taches.length);
            console.log('  taches:', taches.map(t => ({ id: t.id, titre: t.titre, statut: t.statut })));
            console.log('  condition1 (au moins 1 tâche):', condition1);
            console.log('  condition2 (toutes done):', condition2);
            console.log('  condition3 (pas de prelecture):', condition3);
            console.log('  demandePrelecture:', demandePrelecture);
            console.log('  → AFFICHER BOUTON?', showButton);

            return showButton ? (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleValiderPrelecture}
                className="px-4 py-2 bg-green-600 text-white font-bold text-sm shadow hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                AUTORISER PRÉ-LECTURE
              </button>

              {demandePrelecture && (
                <div className="flex flex-col items-end gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Score Plagiat</span>
                      <span className={`text-lg font-black ${demandePrelecture.scorePlagiat > 70 ? 'text-red-600' : 'text-green-600'}`}>
                        {demandePrelecture.scorePlagiat}%
                      </span>
                    </div>
                    <a 
                      href={`http://localhost:3001/${demandePrelecture.rapportAntiPlagiatUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <Eye className="h-3 w-3" /> VOIR LE RAPPORT
                    </a>
                  </div>

                  {demandePrelecture.statut === 'EN_ATTENTE_ANTI_PLAGIAT' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTraiterPlagiat('rejeter')}
                        className="px-3 py-1.5 bg-red-600 text-white font-bold text-[10px] uppercase rounded hover:bg-red-700 transition-colors"
                      >
                        Rejeter (Plagiat)
                      </button>
                      <button
                        onClick={() => handleTraiterPlagiat('accepter')}
                        className="px-3 py-1.5 bg-primary text-white font-bold text-[10px] uppercase rounded hover:bg-primary/90 transition-colors"
                      >
                        Confirmer & Envoyer TRI
                      </button>
                    </div>
                  )}

                  {demandePrelecture.statut === 'EN_COURS_TRI' && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold border border-amber-200">
                      EN COURS DE LECTURE (TRI)
                    </span>
                  )}

                  {demandePrelecture.statut === 'VALIDE_TRI' && (
                    <div className="space-y-2">
                       <div className="p-2 bg-blue-50 border border-blue-100 rounded text-[11px]">
                        <p className="font-bold text-blue-800 mb-1">Feedback TRI :</p>
                        <p className="italic text-gray-700">"{demandePrelecture.feedbackTRI}"</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleBouclageFinal('creer_tache')}
                          className="px-3 py-1.5 bg-gray-600 text-white font-bold text-[10px] uppercase rounded hover:bg-gray-700 transition-colors"
                        >
                          Créer tâche corrective
                        </button>
                        <button
                          onClick={() => handleBouclageFinal('cloturer')}
                          className="px-3 py-1.5 bg-green-600 text-white font-bold text-[10px] uppercase rounded hover:bg-green-700 transition-colors"
                        >
                          Boucler la pré-lecture
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            ) : null;
          })()}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]">
          {renderTaskColumn('À faire', 'todo', 0)}
          {renderTaskColumn('En cours', 'inprogress', 0)}
          {renderTaskColumn('En révision', 'review', 0)}
          {renderTaskColumn('Terminé', 'done', 0)}
        </div>

        {/* Modal de révision - Simple simple simple */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white border border-gray-300 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 uppercase">Révision : {showReviewModal.titre}</h3>
                <button onClick={() => setShowReviewModal(null)} className="p-1 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center justify-between p-4 border border-blue-100 bg-blue-50 rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-sm">{showReviewModal.livrable?.nom || 'Document livrable'}</p>
                      <p className="text-[10px] text-gray-500">Uploadé le {new Date(showReviewModal.livrable?.dateUpload || '').toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <a 
                    href={`http://localhost:3001/${showReviewModal.livrable?.chemin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    CONSULTER PDF
                  </a>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Commentaires globaux</label>
                    <textarea
                      value={feedback.commentaire}
                      onChange={(e) => setFeedback({ ...feedback, commentaire: e.target.value })}
                      placeholder="Vos remarques sur ce travail..."
                      className="w-full p-3 border border-gray-300 text-sm focus:border-primary outline-none min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Corrections demandées (une par ligne)</label>
                    <div className="space-y-2">
                      {feedback.corrections.map((correction, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            value={correction}
                            onChange={(e) => {
                              const newCorr = [...feedback.corrections];
                              newCorr[index] = e.target.value;
                              setFeedback({ ...feedback, corrections: newCorr });
                            }}
                            placeholder={`Correction #${index + 1}`}
                            className="flex-1 p-2 border border-gray-300 text-sm outline-none focus:border-primary"
                          />
                          {feedback.corrections.length > 1 && (
                            <button 
                              onClick={() => setFeedback({ ...feedback, corrections: feedback.corrections.filter((_, i) => i !== index) })}
                              className="px-2 text-gray-400 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setFeedback({ ...feedback, corrections: [...feedback.corrections, ''] })}
                        className="text-primary text-[10px] font-bold uppercase hover:underline flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        AJOUTER UNE LIGNE
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(showReviewModal.id, 'inprogress', feedback)}
                  className="flex-1 py-2 px-4 border border-red-500 text-red-600 font-bold text-xs uppercase hover:bg-red-50 transition-colors"
                >
                  REJETER / À CORRIGER
                </button>
                <button
                  onClick={() => handleUpdateStatus(showReviewModal.id, 'done', feedback.commentaire ? feedback : undefined)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white font-bold text-xs uppercase hover:bg-green-700 transition-colors shadow-sm"
                >
                  VALIDER LE TRAVAIL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Supervision des Groupes</h2>
          <p className="text-xs text-gray-500 font-medium">LISTE DES {demandes.length} ENCADREMENTS ACTIFS - {anneeAcademique}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher un groupe ou un étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Groupe / Étudiants</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Titre du Mémoire</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avancement</th>
              <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDemandes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm italic">Aucun groupe trouvé</td>
              </tr>
            ) : (
              filteredDemandes.map(demande => {
                const names = demande.candidats 
                  ? demande.candidats.map(c => `${c.prenom} ${c.nom}`).join(' & ') 
                  : `${demande.candidat?.prenom} ${demande.candidat?.nom}`;
                
                return (
                  <tr key={demande.idDemande} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded flex items-center justify-center font-bold text-xs border border-gray-200">
                          {names.charAt(0)}
                        </div>
                        <div className="font-bold text-gray-900 text-sm">{names}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 max-w-md line-clamp-1 font-medium">{demande.dossierMemoire?.titre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full" 
                            style={{ width: `${demande.dossierMemoire?.progression || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-primary">{demande.dossierMemoire?.progression || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedDemande(demande)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        SUPERVISER
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
