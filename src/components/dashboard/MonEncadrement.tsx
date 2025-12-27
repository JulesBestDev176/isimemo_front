import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

interface Dossier {
  id: number;
  titre: string;
  statut: string;
  etape: string;
  progression: number;
  candidats: Candidat[];
}

interface MonEncadrementProps {
  idProfesseur: number;
}

const SimpleButton: React.FC<{
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ variant, onClick, children, size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors';
  const variantClasses = variant === 'primary' 
    ? 'bg-primary text-white hover:bg-primary/90' 
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<{ variant: string; children: React.ReactNode }> = ({ variant, children }) => {
  const variantClasses = variant === 'warning' 
    ? 'bg-orange-100 text-orange-700 border-orange-200' 
    : 'bg-blue-100 text-blue-700 border-blue-200';
  
  return (
    <span className={`px-2 py-1 text-xs font-medium border rounded ${variantClasses}`}>
      {children}
    </span>
  );
};

export const MonEncadrement: React.FC<MonEncadrementProps> = ({ idProfesseur }) => {
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [anneeAcademique, setAnneeAcademique] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncadrement = async () => {
      try {
        console.log('🔍 Récupération encadrement pour ID:', idProfesseur);
        const response = await fetch(`http://localhost:3001/api/encadrants/${idProfesseur}/encadrement`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Encadrement reçu:', data);
          setDossiers(data.dossiers || []);
          setAnneeAcademique(data.anneeAcademique || '');
        } else {
          console.error('❌ Erreur API encadrement:', response.status);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'encadrement:', error);
      } finally {
        setLoading(false);
      }
    };

    if (idProfesseur) {
      fetchEncadrement();
    } else {
      setLoading(false);
    }
  }, [idProfesseur]);

  // Toujours afficher la section, même sans dossiers
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mon encadrement</h2>
          {anneeAcademique && (
            <p className="text-sm text-gray-500 mt-1">Année académique {anneeAcademique}</p>
          )}
        </div>
        {dossiers.length > 0 && (
          <SimpleButton
            variant="primary"
            onClick={() => navigate('/professeur/encadrements')}
          >
            Voir tous les encadrements <ChevronRight className="h-4 w-4 ml-1" />
          </SimpleButton>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>Chargement de vos encadrements...</p>
        </div>
      ) : dossiers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Aucun encadrement actif pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dossiers.map((dossier) => (
            <div
              key={dossier.id}
              className="p-4 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer rounded"
              onClick={() => navigate(`/professeur/encadrements/${dossier.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{dossier.titre}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="info">{dossier.etape}</Badge>
                    <span>•</span>
                    <span>Progression: {dossier.progression}%</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              {dossier.candidats.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    {dossier.candidats.length} étudiant{dossier.candidats.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {dossier.candidats.slice(0, 2).map((candidat) => (
                      <div key={candidat.id} className="text-sm text-gray-700">
                        {candidat.prenom} {candidat.nom}
                      </div>
                    ))}
                    {dossier.candidats.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dossier.candidats.length - 2} autre{dossier.candidats.length - 2 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
