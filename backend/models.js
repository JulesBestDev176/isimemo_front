// ============================================================================
// MODÈLES MONGOOSE POUR MONGODB
// ============================================================================

const mongoose = require('mongoose');

// Schema Étudiant (Base de référence - liste des étudiants)
const etudiantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: String,
  niveau: { type: String, required: true },
  departement: String,
  filiere: String
}, { timestamps: true });

// Schema Professeur (Base de référence - liste des professeurs)
const professeurSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: String,
  bureau: String,
  grade: { type: String, required: true },
  departement: String,
  specialite: String,
  domainesRecherche: [String]
}, { timestamps: true });

// Schema Candidat
const candidatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  etudiantId: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: String,
  dateNaissance: String,
  lieuNaissance: String,
  classe: String,
  motDePasse: { type: String, required: true },
  dateInscription: { type: String, required: true },
  mustChangePassword: { type: Boolean, default: true },
  memoireId: Number
}, { timestamps: true });

// Schema Dossier
const dossierSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  titre: { type: String, required: true },
  description: String,
  statut: { 
    type: String, 
    enum: ['EN_CREATION', 'EN_COURS', 'EN_ATTENTE_VALIDATION', 'VALIDE', 'DEPOSE', 'SOUTENU'],
    default: 'EN_COURS'
  },
  etape: { 
    type: String, 
    enum: ['CHOIX_SUJET', 'CHOIX_BINOME', 'CHOIX_ENCADRANT', 'VALIDATION_SUJET', 'VALIDATION_COMMISSION', 
           'EN_COURS_REDACTION', 'PRELECTURE', 'DEPOT_INTERMEDIAIRE', 'DEPOT_FINAL', 'CORRECTION', 'SOUTENANCE', 'TERMINE'],
    default: 'CHOIX_SUJET'
  },
  dateCreation: { type: String, required: true },
  dateModification: String,
  anneeAcademique: { type: String, required: true },
  candidatIds: [{ type: String }],
  encadrantId: Number,
  sujetId: Number,
  progression: { type: Number, default: 0 },
  memoireId: Number,
  scorePlagiat: { type: Number, default: 0 },
  rapportPlagiatUrl: String,
  autorisePrelecture: { type: Boolean, default: false },
  prelectureEffectuee: { type: Boolean, default: false },
  autoriseSoutenance: { type: Boolean, default: false }
}, { timestamps: true });

// Schema Demande de Binôme
const demandeBinomeSchema = new mongoose.Schema({
  idDemande: { type: Number, required: true, unique: true },
  demandeurId: { type: String, required: true },
  demandeurEmail: String,
  demandeurNom: String,
  demandeurMatricule: String,
  demandeurFiliere: String,
  destinataireId: { type: String, required: true },
  destinataireEmail: String,
  destinataireNom: String,
  dossierDemandeurId: Number,
  dossierDestinataireId: Number,
  sujetTitre: String,
  sujetDescription: String,
  message: String,
  statut: { 
    type: String, 
    enum: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE'],
    default: 'EN_ATTENTE'
  },
  dateDemande: { type: Date, default: Date.now },
  dateReponse: Date,
  groupeId: Number
}, { timestamps: true });

// Schema Demande d'Encadrement
const demandeEncadrementSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  candidatId: String, // Optionnel - la demande concerne le groupe/dossier
  candidatNom: String,
  encadrantId: { type: Number, required: true },
  encadrantNom: String,
  dossierId: Number,
  message: String,
  statut: { 
    type: String, 
    enum: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE'],
    default: 'EN_ATTENTE'
  },
  dateDemande: { type: Date, default: Date.now },
  dateReponse: Date,
  motifRefus: String,
  anneeAcademique: String
}, { timestamps: true });

// Schema Encadrant (Professeur inscrit sur la plateforme)
const encadrantSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  professeurId: { type: String, required: true }, // Référence vers le Professeur source
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: String,
  bureau: String,
  grade: String,
  departement: String,
  specialite: String,
  domainesRecherche: [String],
  motDePasse: String,
  mustChangePassword: { type: Boolean, default: true },
  dateInscription: String,
  estDisponible: { type: Boolean, default: true },
  capaciteEncadrement: { type: Number, default: 5 },
  nombreEncadrementsActuels: { type: Number, default: 0 }
}, { timestamps: true });

// Schema Sujet
const sujetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  titre: { type: String, required: true },
  description: String,
  motsCles: [String],
  objectifs: [String],
  encadrantId: Number,
  niveau: { type: String, default: 'L3' },
  statut: { 
    type: String, 
    enum: ['brouillon', 'soumis', 'approuve', 'rejete'],
    default: 'approuve'
  },
  disponible: { type: Boolean, default: true },
  nombreMaxEtudiants: { type: Number, default: 2 },
  nombreEtudiantsActuels: { type: Number, default: 0 },
  dateCreation: String,
  dossierId: Number
}, { timestamps: true });

// Schema User (Admin, Professeur)
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'PROFESSEUR', 'COMMISSION'],
    required: true
  },
  encadrantId: Number
}, { timestamps: true });

// Schema Document
const documentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  dossierId: { type: Number, required: true },
  titre: String,
  typeDocument: String,
  cheminFichier: String,
  dateCreation: { type: Date, default: Date.now },
  statut: { type: String, default: 'EN_ATTENTE' }
}, { timestamps: true });

// Schema Message
const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  anneeAcademique: { type: String, required: true }, // Pour grouper par encadrement
  encadrantId: { type: Number, required: true },
  emetteurId: String,
  emetteurNom: String,
  emetteurRole: { type: String, enum: ['encadrant', 'candidat'], default: 'encadrant' },
  contenu: { type: String, required: true },
  titre: String,
  typeMessage: { 
    type: String, 
    enum: ['texte', 'reunion-meet', 'presentiel', 'document'],
    default: 'texte'
  },
  // Pour les réunions Meet
  lienMeet: String,
  dateRendezVous: String,
  heureRendezVous: String,
  // Pour les réunions présentielles
  lieu: String,
  // Pour les documents
  nomDocument: String,
  cheminDocument: String,
  tailleDocument: String,
  // Métadonnées
  dateEnvoi: { type: Date, default: Date.now },
  lu: { type: Boolean, default: false }
}, { timestamps: true });

// Schema Notification
const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: String, required: true },
  titre: String,
  message: String,
  type: String,
  lu: { type: Boolean, default: false },
  dateCreation: { type: Date, default: Date.now }
}, { timestamps: true });

// Schema Note de Suivi
const noteSuiviSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  dossierId: { type: Number, required: true },
  contenu: { type: String, required: true },
  idEncadrant: { type: Number, required: true },
  dateCreation: { type: Date, default: Date.now }
}, { timestamps: true });

// Schema Demande de Pré-lecture
const demandePrelectureSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  dossierId: { type: Number, required: true },
  encadrantPrincipalId: { type: Number, required: true },
  lecteurTRIId: Number, // L'encadrant assigné par la TRI
  statut: { 
    type: String, 
    enum: ['EN_ATTENTE_ANTI_PLAGIAT', 'EN_COURS_ENCADRANT', 'EN_COURS_TRI', 'VALIDE_TRI', 'REJETE_PLAGIAT'],
    default: 'EN_ATTENTE_ANTI_PLAGIAT'
  },
  scorePlagiat: { type: Number, default: 0 },
  rapportAntiPlagiatUrl: String,
  feedbackTRI: String,
  dateDemande: { type: Date, default: Date.now },
  dateValidationTRI: Date,
  dateCloture: Date
}, { timestamps: true });

// Schema Activité
const activiteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: String, // VALIDATION, REFUS, DEPOT, etc.
  titre: String,
  description: String,
  date: { type: Date, default: Date.now },
  dossierId: Number,
  candidatId: String
}, { timestamps: true });

// Schema Session
const sessionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  typeSession: String,
  anneeAcademique: String,
  dateDebut: String,
  dateFin: String,
  statut: { type: String, default: 'PLANIFIEE' },
  dateCreation: String
}, { timestamps: true });

// Schema Salle
const salleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  batiment: String,
  capacite: Number,
  estDisponible: { type: Boolean, default: true }
}, { timestamps: true });

// Schema Mémoire (archives)
const memoireSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  titre: { type: String, required: true },
  auteurs: String,
  annee: String,
  filiere: String,
  departement: String,
  fichierPdf: String,
  // Métadonnées pour recherche sémantique
  motsCles: [String],
  resume: String,
  domaineEtude: String,
  contenuTexte: String // Contenu extrait du PDF pour recherche
}, { timestamps: true });

// Schema Tâche
const tacheSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  anneeAcademique: { type: String, required: true },
  encadrantId: { type: Number, required: true },
  dossierId: Number, // Ajout du champ pour lier la tache au dossier
  demandeId: Number, // null si tâche commune (assignée à tous)
  titre: { type: String, required: true },
  description: String,
  dateEcheance: String,
  priorite: { 
    type: String, 
    enum: ['Basse', 'Moyenne', 'Haute'], 
    default: 'Moyenne' 
  },
  statut: { 
    type: String, 
    enum: ['todo', 'inprogress', 'review', 'done', 'desactivee'], 
    default: 'todo' 
  },
  ordre: { type: Number, default: 0 },
  livrable: {
    nom: String,
    chemin: String,
    dateUpload: Date
  },
  sousEtapes: [{
    id: Number,
    titre: String,
    terminee: { type: Boolean, default: false }
  }],
  estRetournee: { type: Boolean, default: false },
  feedbackRetour: {
    dateRetour: Date,
    commentaire: String,
    corrections: [String]
  },
  dateCreation: { type: Date, default: Date.now }
}, { timestamps: true });

// Schema Counter (pour auto-increment des IDs)
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  anneeAcademique: String
}, { timestamps: true });

// Schema Personnel Administratif
const personnelAdministratifSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['chef', 'assistant'],
    required: true 
  },
  departement: { type: String, required: true },
  telephone: String,
  bureau: String
}, { timestamps: true });

// Schema DossierMémoire (Documents du projet en cours)
const dossierMemoireSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  dossierId: { type: Number, required: true },
  tacheId: Number, // Optionnel : de quelle tâche vient ce livrable
  url: String,
  nomFichier: String,
  visibilite: { type: Boolean, default: false },
  prelecture: { type: Boolean, default: false },
  validation_ticket: { type: Boolean, default: false },
  anti_plagiat: { type: Boolean, default: false },
  dateCreation: { type: Date, default: Date.now }
}, { timestamps: true });

// Créer les modèles
const Etudiant = mongoose.model('Etudiant', etudiantSchema);
const Candidat = mongoose.model('Candidat', candidatSchema);
const Dossier = mongoose.model('Dossier', dossierSchema);
const DemandeBinome = mongoose.model('DemandeBinome', demandeBinomeSchema);
const DemandeEncadrement = mongoose.model('DemandeEncadrement', demandeEncadrementSchema);
const Encadrant = mongoose.model('Encadrant', encadrantSchema);
const Sujet = mongoose.model('Sujet', sujetSchema);
const User = mongoose.model('User', userSchema);
const Document = mongoose.model('Document', documentSchema);
const Message = mongoose.model('Message', messageSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Session = mongoose.model('Session', sessionSchema);
const Salle = mongoose.model('Salle', salleSchema);
const Memoire = mongoose.model('Memoire', memoireSchema);
const Tache = mongoose.model('Tache', tacheSchema);
const Counter = mongoose.model('Counter', counterSchema);
const PersonnelAdministratif = mongoose.model('PersonnelAdministratif', personnelAdministratifSchema);
const Professeur = mongoose.model('Professeur', professeurSchema);
const NoteSuivi = mongoose.model('NoteSuivi', noteSuiviSchema);
const DossierMemoire = mongoose.model('DossierMemoire', dossierMemoireSchema);
const Activite = mongoose.model('Activite', activiteSchema);
const DemandePrelecture = mongoose.model('DemandePrelecture', demandePrelectureSchema);

// Fonction pour générer un ID unique
async function getNextId(modelName) {
  const Model = mongoose.model(modelName);
  const lastDoc = await Model.findOne().sort({ id: -1 });
  if (lastDoc && !isNaN(lastDoc.id)) {
    return lastDoc.id + 1;
  }
  return 1;
}

module.exports = {
  Etudiant,
  Professeur,
  Candidat,
  Dossier,
  DemandeBinome,
  DemandeEncadrement,
  Encadrant,
  Sujet,
  User,
  Document,
  Message,
  Notification,
  Session,
  Salle,
  Memoire,
  Tache,
  PersonnelAdministratif,
  NoteSuivi,
  DossierMemoire,
  Activite,
  DemandePrelecture,
  Counter,
  getNextId
};
