import React, { useState, useEffect } from 'react';
import { Users, FileText, Clock, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3001/api';

interface Stats {
  totalCandidats: number;
  totalDossiers: number;
  dossierParStatut: Record<string, number>;
  demandesEnAttente: number;
  encadrantsActifs: number;
}

interface Activites {
  dernieresInscriptions: Array<{
    nom: string;
    prenom: string;
    email: string;
    createdAt: string;
  }>;
  dernieresDemandes: Array<{
    id: number;
    statut: string;
    dateDemande: string;
    encadrant: { nom: string; prenom: string } | null;
    dossier: { titre: string } | null;
  }>;
}

export const DashboardPersonnel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activites, setActivites] = useState<Activites | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/personnel/stats`),
          fetch(`${API_BASE_URL}/personnel/activites-recentes`)
        ]);

        const statsData = await statsRes.json();
        const activitesData = await activitesRes.json();

        console.log('📊 Stats:', statsData);
        console.log('📋 Activités:', activitesData);

        setStats(statsData);
        setActivites(activitesData);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques - Bleu primary uniquement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-primary/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Candidats Inscrits</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats?.totalCandidats || 0}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-primary/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dossiers en Cours</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats?.totalDossiers || 0}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-primary/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Encadrants Actifs</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats?.encadrantsActifs || 0}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Inscriptions récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-primary/20 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscriptions Récentes</h3>
        <div className="space-y-3">
          {activites?.dernieresInscriptions.map((inscription, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  {inscription.prenom} {inscription.nom}
                </p>
                <p className="text-sm text-gray-600">{inscription.email}</p>
              </div>
              <span className="text-xs text-primary">
                {formatDate(inscription.createdAt)}
              </span>
            </div>
          ))}
          {(!activites?.dernieresInscriptions || activites.dernieresInscriptions.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">Aucune inscription récente</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPersonnel;
