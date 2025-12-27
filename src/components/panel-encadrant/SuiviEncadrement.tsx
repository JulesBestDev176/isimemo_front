import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Plus, 
  Search,
  Video,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { dossierService } from '../../services/dossier.service';

interface SuiviEncadrementProps {
  encadrantId: number | string;
  anneeAcademique: string;
  etudiants: Array<{ id: number, nom: string, prenom: string, dossierId: number }>;
}

export const SuiviEncadrement: React.FC<SuiviEncadrementProps> = ({ 
  encadrantId, 
  anneeAcademique,
  etudiants 
}) => {
  const [reunions, setReunions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // États pour l'ajout en masse
  const [selectedEtudiants, setSelectedEtudiants] = useState<number[]>([]); // dossierIds
  const [noteContenu, setNoteContenu] = useState('');
  const [noteType, setNoteType] = useState('AUTRE');
  const [dateAction, setDateAction] = useState(new Date().toISOString().split('T')[0]);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReunions();
  }, [encadrantId, anneeAcademique]);

  const fetchReunions = async () => {
    setLoading(true);
    try {
      const data = await dossierService.getReunionsEncadrant(encadrantId, anneeAcademique);
      setReunions(data);
    } catch (error) {
      console.error('Erreur chargement réunions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValiderReunion = async (messageId: string, dossierId: number, titre: string) => {
    if (!dossierId) {
      // Cas où la réunion n'est pas liée à un dossier spécifique (rare mais possible)
      // Ou si on veut laisser choisir le dossier. Pour l'instant on suppose que le message a le bon contexte si il vient d'un canal dossier.
      // S'il vient d'un message global, c'est plus complexe. 
      // Simplification: On ne traite ici que les messages qui ont un dossier ou on demande à l'encadrant de le lier si manquant (TODO).
      alert("Impossible de lier automatiquement à un dossier.");
      return;
    }

    try {
      await dossierService.validerReunionCommeNote(messageId, dossierId, encadrantId, `Réunion : ${titre}`);
      // Mettre à jour la liste (retirer la réunion validée ou la marquer)
      // Pour l'instant on recharge simplement
      alert("Réunion validée et ajoutée aux notes de suivi !");
      fetchReunions();
    } catch (error) {
      console.error('Erreur validation réunion:', error);
      alert("Erreur lors de la validation.");
    }
  };

  const handleSelectAll = () => {
    if (selectedEtudiants.length === etudiants.length) {
      setSelectedEtudiants([]);
    } else {
      setSelectedEtudiants(etudiants.map(e => e.dossierId));
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEtudiants.length === 0 || !noteContenu.trim()) return;

    try {
      await dossierService.createNoteSuiviBulk(
        selectedEtudiants, 
        encadrantId, 
        noteContenu, 
        noteType
      );
      setBulkSuccess(`Note ajoutée avec succès pour ${selectedEtudiants.length} dossier(s).`);
      setNoteContenu('');
      setSelectedEtudiants([]);
      setTimeout(() => setBulkSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur ajout masse:', error);
      alert("Erreur lors de l'ajout des notes.");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Réunions à valider */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> Réunions récentes
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Validez les réunions que vous avez planifiées via la messagerie pour qu'elles apparaissent officiellement dans le suivi des étudiants.
        </p>

        {loading ? (
          <p>Chargement...</p>
        ) : reunions.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="py-8 text-center text-gray-500">
              Aucune réunion en attente de validation.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reunions.map((reunion) => (
              <Card key={reunion.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        {reunion.typeMessage === 'reunion_enligne' ? <Video className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        {reunion.titre || "Réunion sans titre"}
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" /> 
                          {new Date(reunion.dateRendezVous).toLocaleDateString()} à {reunion.heureRendezVous}
                        </div>
                        {reunion.lieu && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> {reunion.lieu}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* On suppose ici qu'on peut récupérer le dossier ID depuis le destinataire ou le contexte, 
                        mais pour cet exemple on va simplifier en supposant que le message a une prop 'dossierId' 
                        ou qu'on doit sélectionner l'étudiant. 
                        Pour l'instant, bouton générique si on a l'info. */}
                    <Button 
                      size="sm" 
                      className="ml-4 gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleValiderReunion(reunion.id, reunion.dossierId || 0, reunion.titre)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Valider
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* SECTION 2: Ajouter une note de suivi (Masse) */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Ajouter une note de suivi
        </h3>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              
              {/* Sélection Étudiants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Concerne les étudiants :</label>
                  <Button type="button" variant="ghost" size="sm" onClick={handleSelectAll} className="h-8 text-xs">
                    {selectedEtudiants.length === etudiants.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto grid md:grid-cols-2 gap-2">
                  {Object.values(etudiants.reduce((acc, etudiant) => {
                    if (!acc[etudiant.dossierId]) {
                      acc[etudiant.dossierId] = [];
                    }
                    acc[etudiant.dossierId].push(etudiant);
                    return acc;
                  }, {} as Record<number, typeof etudiants>)).map(group => {
                    const dossierId = group[0].dossierId;
                    const label = group.map(e => `${e.prenom} ${e.nom}`).join(' & ');
                    
                    return (
                      <label key={dossierId} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedEtudiants.includes(dossierId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEtudiants([...selectedEtudiants, dossierId]);
                            } else {
                              setSelectedEtudiants(selectedEtudiants.filter(id => id !== dossierId));
                            }
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    );
                  })}
                  {etudiants.length === 0 && <p className="text-sm text-gray-500 italic">Aucun étudiant actif.</p>}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {selectedEtudiants.length} dossier(s) sélectionné(s)
                </p>
              </div>

              {/* Contenu Note */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d'activité</label>
                  <select 
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                  >
                    <option value="REUNION">Réunion</option>
                    <option value="CORRECTION">Correction</option>
                    <option value="APPEL">Appel téléphonique</option>
                    <option value="EMAIL">Échange Email</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'action</label>
                  <input 
                    type="date" 
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={dateAction}
                    onChange={(e) => setDateAction(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu de la note</label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Décrivez ce qui a été fait ou convenu..."
                  value={noteContenu}
                  onChange={(e) => setNoteContenu(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={selectedEtudiants.length === 0 || !noteContenu} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter la note ({selectedEtudiants.length})
                </Button>
              </div>

              {bulkSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle className="h-4 w-4" />
                  {bulkSuccess}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
