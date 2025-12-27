import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Hook personnalisé pour l'animation de compteur
const useCounter = (end: number, duration: number = 2, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Attendre le délai avant de commencer
      if (elapsed < delay * 1000) {
        animationFrame = requestAnimationFrame(updateCount);
        return;
      }

      const progress = Math.min((elapsed - delay * 1000) / (duration * 1000), 1);
      // Fonction d'easing pour ralentir vers la fin
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, delay, inView]);

  return { count, ref: nodeRef };
};
import CarteMemoire from "../../components/CarteMemoire";
import Footer from "../../components/Footer";
import AffichageMemoire from "../../components/AffichageMemoire";
import { Memoire, memoiresData } from "../../data/memoires.data";
import { fuzzyVectorSearch } from "../../utils/fuzzySearch";
import memoireSearchService from "../../services/memoireSearch.service";
import searchHistoryService from "../../services/searchHistory.service";
import documentConsultationService from "../../services/documentConsultation.service";

const Memoires = () => {
  const [memoires, setMemoires] = useState(memoiresData);
  const [memoiresFiltres, setMemoiresFiltres] = useState(memoiresData);
  const [memoireSelectionne, setMemoireSelectionne] = useState<Memoire | null>(null);
  const [vueDetaillee, setVueDetaillee] = useState(false);
  const [popularKeywords, setPopularKeywords] = useState<Array<{keyword: string, count: number}>>([]);
  const [frequentMetadata, setFrequentMetadata] = useState<any>({});

  // Pagination
  const memoiresParPage = 5;
  const [pageCourante, setPageCourante] = useState(1);
  const indexDernierMemoire = pageCourante * memoiresParPage;
  const indexPremierMemoire = indexDernierMemoire - memoiresParPage;
  const memoiresCourants = memoiresFiltres.slice(indexPremierMemoire, indexDernierMemoire);
  const nombreTotalPages = Math.ceil(memoiresFiltres.length / memoiresParPage);

  // Filtres
  const [searchInput, setSearchInput] = useState(""); // Input de recherche
  const [requeteRecherche, setRequeteRecherche] = useState(""); // Requête active
  const [departementSelectionne, setDepartementSelectionne] = useState("");
  const [anneeSelectionnee, setAnneeSelectionnee] = useState("");
  const [etiquetteSelectionnee, setEtiquetteSelectionnee] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Charger les métadonnées fréquentes au montage du composant (basé sur consultations)
  useEffect(() => {
    const loadRecommendations = async () => {
      const metadata = await documentConsultationService.getFrequentMetadata();
      setFrequentMetadata(metadata);
      
      // Si on a des consultations et pas de recherche active, trier par similarité
      if (Object.keys(metadata.departements).length > 0 && !requeteRecherche) {
        const memoiresWithScores = memoires.map(memoire => ({
          memoire,
          score: documentConsultationService.calculateSimilarityScore(memoire, metadata)
        }));
        
        // Trier par score décroissant
        memoiresWithScores.sort((a, b) => b.score - a.score);
        
        setMemoires(memoiresWithScores.map(m => m.memoire));
        console.log('✅ Recommandations chargées basées sur les consultations');
      }
    };
    
    loadRecommendations();
  }, []);

  // Données pour les filtres
  const departements = [...new Set(memoires.map(m => m.departement))];
  const annees = [...new Set(memoires.map(m => m.annee))].sort((a, b) => b.localeCompare(a));

  // Récupérer toutes les etiquettes uniques
  const toutesEtiquettes = [...new Set(memoires.flatMap(m => m.etiquettes))];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "memoires - ISIMemo";
  }, []);

  // Effet pour la filtration avec recherche vectorielle backend
  useEffect(() => {
    const performSearch = async () => {
      let resultat = [...memoires];

      // Filtrer par recherche vectorielle avec tolérance aux fautes
      if (requeteRecherche) {
        setIsSearching(true);
        
        try {
          // Essayer la recherche Gemini (lit le contenu complet des PDF avec IA)
          console.log('🤖 Recherche Gemini AI...');
          const backendResults = await memoireSearchService.geminiSearch(requeteRecherche);
          
          if (backendResults && backendResults.length > 0) {
            // Utiliser les résultats Gemini
            resultat = backendResults;
            console.log(`✅ Recherche Gemini: ${backendResults.length} résultats`);
            
            // Logger les métadonnées des résultats Gemini
            console.log('📊 Métadonnées Gemini:', {
              query: requeteRecherche,
              count: backendResults.length,
              metadata: backendResults.slice(0, 5).map(m => ({
                titre: m.titre,
                departement: m.departement,
                annee: m.annee,
                motsCles: m.motsCles,
                domaineEtude: m.domaineEtude,
                etiquettes: m.etiquettes,
                formation: m.formation
              }))
            });
            
            // Enregistrer la recherche dans l'historique
            console.log('💾 Enregistrement de la recherche dans l\'historique...');
            try {
              await searchHistoryService.saveSearch(requeteRecherche, backendResults.length, 'gemini');
              console.log('✅ Recherche enregistrée avec succès');
            } catch (error) {
              console.error('❌ Erreur lors de l\'enregistrement:', error);
            }
          } else {
            // Fallback sur recherche locale si aucun résultat backend
            console.log('⚠️ Aucun résultat Gemini, utilisation de la recherche locale');
            const searchResults = fuzzyVectorSearch(
              requeteRecherche,
              resultat,
              ['motsCles', 'domaineEtude', 'departement', 'annee', 'resume', 'etiquettes', 'formation', 'titre', 'auteurs', 'description'],
              {
                motsCles: 12,       // Poids maximum pour les mots-clés
                domaineEtude: 11,   // Très élevé pour le domaine d'étude
                departement: 10,    // Élevé pour le département
                annee: 9,           // Très élevé pour l'année
                resume: 8,          // Élevé pour le résumé
                etiquettes: 7,      // Élevé pour les tags/thématiques
                formation: 6,       // Moyen pour la formation
                auteurs: 5,         // Moyen pour les auteurs
                titre: 4,           // Plus faible pour le titre
                description: 3      // Faible pour la description
              }
            );
            resultat = searchResults.map(result => result.item);
            
            // Logger les métadonnées des résultats
            console.log('📊 Résultats de recherche locale:', {
              query: requeteRecherche,
              count: resultat.length,
              metadata: resultat.slice(0, 5).map(m => ({
                titre: m.titre,
                departement: m.departement,
                annee: m.annee,
                motsCles: m.motsCles,
                domaineEtude: m.domaineEtude,
                etiquettes: m.etiquettes,
                formation: m.formation
              }))
            });
            
            // Enregistrer la recherche locale
            console.log('💾 Enregistrement de la recherche locale...');
            try {
              await searchHistoryService.saveSearch(requeteRecherche, resultat.length, 'local');
              console.log('✅ Recherche locale enregistrée');
            } catch (error) {
              console.error('❌ Erreur lors de l\'enregistrement local:', error);
            }
          }
        } catch (error) {
          // En cas d'erreur backend, utiliser la recherche locale
          console.warn('❌ Erreur recherche Gemini, fallback sur recherche locale:', error);
          const searchResults = fuzzyVectorSearch(
            requeteRecherche,
            resultat,
            ['motsCles', 'domaineEtude', 'departement', 'annee', 'resume', 'etiquettes', 'formation', 'titre', 'auteurs', 'description'],
            {
              motsCles: 12,       // Mots-clés prioritaires
              domaineEtude: 11,
              departement: 10,
              annee: 9,
              resume: 8,
              etiquettes: 7,
              formation: 6,
              auteurs: 5,
              titre: 4,
              description: 3
            }
          );
          resultat = searchResults.map(result => result.item);
          
          // Logger les métadonnées du fallback
          console.log('📊 Résultats fallback:', {
            query: requeteRecherche,
            count: resultat.length,
            metadata: resultat.slice(0, 5).map(m => ({
              titre: m.titre,
              departement: m.departement,
              annee: m.annee,
              etiquettes: m.etiquettes
            }))
          });
        } finally {
          setIsSearching(false);
        }
      }

      // Filtrer par département
      if (departementSelectionne) {
        resultat = resultat.filter(memoire =>
          memoire.departement === departementSelectionne
        );
      }

      // Filtrer par année
      if (anneeSelectionnee) {
        resultat = resultat.filter(memoire =>
          memoire.annee === anneeSelectionnee
        );
      }

      // Filtrer par étiquette
      if (etiquetteSelectionnee) {
        resultat = resultat.filter(memoire =>
          memoire.etiquettes.includes(etiquetteSelectionnee)
        );
      }

      // Si pas de recherche textuelle, trier par année académique (les plus récents en premier)
      if (!requeteRecherche) {
        resultat.sort((a, b) => b.annee.localeCompare(a.annee));
      }
      // Sinon, les résultats sont déjà triés par pertinence

      setMemoiresFiltres(resultat);
      // Réinitialiser à la première page lors d'un changement de filtre
      setPageCourante(1);
    };

    performSearch();
  }, [requeteRecherche, departementSelectionne, anneeSelectionnee, etiquetteSelectionnee, memoires]);

  const gererClicMemoire = async (memoire: Memoire) => {
    // Enregistrer la consultation
    await documentConsultationService.recordConsultation(
      memoire.id,
      'memoire',
      {
        departement: memoire.departement,
        annee: memoire.annee,
        etiquettes: memoire.etiquettes,
        formation: memoire.formation,
        titre: memoire.titre
      }
    );
    
    setMemoireSelectionne(memoire);
    setVueDetaillee(true);
    window.scrollTo(0, 0);
  };

  const fermerVueDetaillee = () => {
    setVueDetaillee(false);
    setMemoireSelectionne(null);
  };

  const reinitialiserFiltres = () => {
    setSearchInput("");
    setRequeteRecherche("");
    setDepartementSelectionne("");
    setAnneeSelectionnee("");
    setEtiquetteSelectionnee("");
  };

  const lancerRecherche = () => {
    setRequeteRecherche(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      lancerRecherche();
    }
  };

  const changerPage = (numeroPage: number) => {
    setPageCourante(numeroPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pagePrecedente = () => {
    if (pageCourante > 1) {
      setPageCourante(pageCourante - 1);
      window.scrollTo(0, 0);
    }
  };

  const pageSuivante = () => {
    if (pageCourante < nombreTotalPages) {
      setPageCourante(pageCourante + 1);
      window.scrollTo(0, 0);
    }
  };

  // Composant de pagination
  const Pagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={pagePrecedente}
          disabled={pageCourante === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'
            }`}
        >
          <span className="material-icons text-sm">chevron_left</span>
        </button>

        {[...Array(nombreTotalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => changerPage(index + 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${pageCourante === index + 1
              ? 'bg-primary text-white font-medium'
              : 'bg-gray-100 text-navy-700 hover:bg-primary-50'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={pageSuivante}
          disabled={pageCourante === nombreTotalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === nombreTotalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'
            }`}
        >
          <span className="material-icons text-sm">chevron_right</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="min-h-screen pb-16">
        {vueDetaillee && memoireSelectionne ? (
          <AffichageMemoire
            memoire={memoireSelectionne}
            onRetour={fermerVueDetaillee}
          />
        ) : (
          <>
            {/* Hero section pleine hauteur (100vh) */}
            <motion.div
              className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Cercles décoratifs animés - repositionnés pour mieux s'adapter à la pleine hauteur */}
              <motion.div
                className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-white opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-blue-300 opacity-10"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, 30, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200 opacity-20"
                animate={{
                  y: [0, -50, 0],
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-primary-300 opacity-20"
                animate={{
                  y: [0, 40, 0],
                  x: [0, -20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Contenu principal - centré verticalement */}
              <div className="container-fluid relative z-10 flex-grow flex flex-col justify-center items-center">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
                      <span className="material-icons text-yellow-200 text-xs mr-1" style={{ verticalAlign: 'middle' }}>
                        auto_awesome
                      </span>
                      Enrichissez votre savoir académique
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  >
                    Bibliothèque de <motion.span
                      className="relative inline-block"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      mémoires
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    Découvrez l'excellence académique à travers notre collection de travaux de recherche innovants réalisés par nos étudiants.
                  </motion.p>

                  <motion.div
                    className="bg-white/10 backdrop-blur-lg p-1.5 rounded-2xl shadow-2xl max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-white rounded-xl flex items-stretch overflow-hidden">
                      <div className="bg-primary-50 p-4 flex items-center">
                        <span className="material-icons text-primary">search</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher par titre, auteur, mot-clé..."
                        className="flex-1 py-4 px-5 outline-none bg-transparent text-navy-700 min-w-0"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <button
                        onClick={lancerRecherche}
                        disabled={isSearching}
                        className="bg-primary hover:bg-primary-700 text-white px-8 py-4 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {isSearching ? (
                          <>
                            <span className="material-icons animate-spin text-lg">refresh</span>
                            <span className="hidden sm:inline">Recherche...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-icons text-lg">search</span>
                            <span className="hidden sm:inline">Rechercher</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Statistiques rapides */}
                  <motion.div
                    className="flex justify-center gap-8 mt-10 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{memoiresFiltres.length}</span>
                      <span className="text-blue-100 text-sm">Mémoires disponibles</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{departements.length}</span>
                      <span className="text-blue-100 text-sm">Départements</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{toutesEtiquettes.length}</span>
                      <span className="text-blue-100 text-sm">Thématiques</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bouton de défilement vers le bas */}
              <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                  opacity: { delay: 1.5, duration: 1 },
                  y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                onClick={() => {
                  // Faire défiler vers la section suivante (conteneur de filtrage)
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-white text-sm mb-2">Explorer les mémoires</span>
                  <span className="material-icons text-white">expand_more</span>
                </div>
              </motion.div>

              {/* Vagues décoratives au bas du hero */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" className="fill-gray-50">
                  <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
              </div>
            </motion.div>

            <div className="container-fluid py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filtres */}
                <motion.div
                  className="md:col-span-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white rounded-xl shadow-md p-5 sticky top-24 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-navy flex items-center">
                        <span className="material-icons text-primary mr-2 text-xl">filter_list</span>
                        Filtres
                      </h2>
                      <button
                        onClick={reinitialiserFiltres}
                        className="text-primary hover:text-primary-700 text-sm flex items-center gap-1 transition-colors rounded-full bg-primary-50 px-2 py-1"
                      >
                        <span className="material-icons text-sm">refresh</span>
                        Réinitialiser
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Nombre de résultats et pagination en haut pour une meilleure visibilité */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-navy-700 font-medium">
                          <span className="text-primary font-bold">{memoiresFiltres.length}</span> mémoire{memoiresFiltres.length !== 1 ? 's' : ''} trouvé{memoiresFiltres.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Page {pageCourante} sur {nombreTotalPages || 1}
                        </p>
                      </div>

                      {/* Filtre par département avec icône */}
                      <div>
                        <label htmlFor="departement" className="block text-navy-700 font-medium text-sm mb-1 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">business</span>
                          Département
                        </label>
                        <div className="relative">
                          <select
                            id="departement"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={departementSelectionne}
                            onChange={(e) => setDepartementSelectionne(e.target.value)}
                          >
                            <option value="">Tous les départements</option>
                            {departements.map((dept, index) => (
                              <option key={index} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>

                      {/* Filtre par année avec icône */}
                      <div>
                        <label htmlFor="annee" className="block text-navy-700 font-medium text-sm mb-1 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">calendar_today</span>
                          Année
                        </label>
                        <div className="relative">
                          <select
                            id="annee"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={anneeSelectionnee}
                            onChange={(e) => setAnneeSelectionnee(e.target.value)}
                          >
                            <option value="">Toutes les années</option>
                            {annees.map((annee, index) => (
                              <option key={index} value={annee}>{annee}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>


                      {/* Filtre par étiquette avec radio buttons pour les plus populaires */}
                      <div>
                        <label className="block text-navy-700 font-medium text-sm mb-2 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">sell</span>
                          Thématiques
                        </label>

                        {/* Option de sélecteur pour toutes les étiquettes */}
                        <div className="relative mb-2">
                          <select
                            id="etiquette"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={etiquetteSelectionnee}
                            onChange={(e) => setEtiquetteSelectionnee(e.target.value)}
                          >
                            <option value="">Toutes les thématiques</option>
                            {toutesEtiquettes.map((etiquette, index) => (
                              <option key={index} value={etiquette}>{etiquette}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Liste des memoires avec pagination */}
                <div className="md:col-span-3 space-y-6">
                  <AnimatePresence>
                    {memoiresCourants.length > 0 ? (
                      memoiresCourants.map(memoire => {
                        const score = documentConsultationService.calculateSimilarityScore(memoire, frequentMetadata);
                        return (
                          <CarteMemoire
                            key={memoire.id}
                            memoire={memoire}
                            onClick={gererClicMemoire}
                            isRecommended={score > 0 && !requeteRecherche}
                          />
                        );
                      })
                    ) : (
                      <motion.div
                        className="bg-white rounded-xl shadow-lg p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                          <span className="material-icons text-gray-400 text-2xl">search_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">Aucun résultat</h3>
                        <p className="text-navy-700">
                          Aucun memoire ne correspond à vos critères de recherche.
                        </p>
                        <button
                          onClick={reinitialiserFiltres}
                          className="mt-4 text-primary hover:text-primary-700 font-medium flex items-center gap-2 mx-auto transition-colors"
                        >
                          <span className="material-icons">refresh</span>
                          Réinitialiser les filtres
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Composant de pagination */}
                  {memoiresFiltres.length > memoiresParPage && <Pagination />}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Memoires;