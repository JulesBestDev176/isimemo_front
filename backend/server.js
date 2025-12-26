// ============================================================================
// ISIMEMO BACKEND API - Version MongoDB
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const { id } = req.params;
    // On garde le nom original mais on préfixe avec l'ID de la tâche pour éviter les conflits
    cb(null, `livrable_${id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés !'), false);
    }
  }
});

const {
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
  getNextId
} = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isimemo';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================================
// ROUTES CHATBOT
// ============================================================================
const chatbotRoutes = require('./routes/chatbot.routes');
app.use('/api/chatbot', chatbotRoutes);

// ============================================================================
// CONNEXION MONGODB
// ============================================================================

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connecté à MongoDB');
  
  // MIGRATION: Supprimer l'ancien index idNoteSuivi qui cause des conflits (duplicate null)
  try {
    const collections = await mongoose.connection.db.listCollections({ name: 'notesuivis' }).toArray();
    if (collections.length > 0) {
      const indexes = await mongoose.connection.db.collection('notesuivis').indexes();
      if (indexes.find(idx => idx.name === 'idNoteSuivi_1')) {
        await mongoose.connection.db.collection('notesuivis').dropIndex('idNoteSuivi_1');
        console.log('🔄 Index obsolète idNoteSuivi_1 supprimé avec succès');
      }
    }
  } catch (err) {
    console.log('Note: Pas d\'index idNoteSuivi_1 à supprimer ou erreur mineure:', err.message);
  }

  initializeDatabase();
})
.catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Générer un mot de passe temporaire
const genererMotDePasse = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ============================================================================
// ROUTES AUTHENTIFICATION
// ============================================================================

// Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Chercher dans les candidats
    const candidat = await Candidat.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      motDePasse: password 
    });
    
    if (candidat) {
      console.log(`✅ Connexion candidat: ${candidat.email}`);
      return res.json({
        success: true,
        user: {
          id: candidat.id,
          email: candidat.email,
          nom: candidat.nom,
          prenom: candidat.prenom,
          role: 'CANDIDAT',
          mustChangePassword: candidat.mustChangePassword
        }
      });
    }
    
    // Chercher dans les users (admin, professeurs)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      password: password 
    });
    
    if (user) {
      console.log(`✅ Connexion ${user.role}: ${user.email}`);
      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role
        }
      });
    }
    
    // Chercher dans les encadrants (professeurs inscrits)
    const encadrant = await Encadrant.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      motDePasse: password 
    });
    
    if (encadrant) {
      console.log(`✅ Connexion encadrant: ${encadrant.email}`);
      return res.json({
        success: true,
        user: {
          id: encadrant.id,
          email: encadrant.email,
          nom: encadrant.nom,
          prenom: encadrant.prenom,
          role: 'ENCADRANT',
          department: encadrant.departement,
          mustChangePassword: true
        }
      });
    }
    
    // Chercher dans le personnel administratif
    const personnel = await PersonnelAdministratif.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      motDePasse: password 
    });
    
    if (personnel) {
      // Vérifier que c'est le département Informatique
      if (personnel.departement !== 'Informatique') {
        console.log(`❌ Accès refusé - Département ${personnel.departement} non autorisé`);
        return res.status(403).json({ 
          success: false, 
          message: 'Seul le personnel du département Informatique peut se connecter' 
        });
      }
      
      console.log(`✅ Connexion personnel (${personnel.role}): ${personnel.email}`);
      return res.json({
        success: true,
        user: {
          id: personnel.id,
          email: personnel.email,
          nom: personnel.nom,
          prenom: personnel.prenom,
          role: personnel.role === 'chef' ? 'CHEF' : 'ASSISTANT',
          departement: personnel.departement
        }
      });
    }
    
    console.log(`❌ Échec connexion: ${email}`);
    res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Changer le mot de passe
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    // Chercher dans les candidats
    const candidat = await Candidat.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      motDePasse: oldPassword 
    });
    
    if (candidat) {
      candidat.motDePasse = newPassword;
      candidat.mustChangePassword = false;
      await candidat.save();
      
      console.log(`✅ Mot de passe candidat changé: ${email}`);
      return res.json({ success: true });
    }
    
    // Chercher dans les encadrants
    const encadrant = await Encadrant.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      motDePasse: oldPassword 
    });
    
    if (encadrant) {
      encadrant.motDePasse = newPassword;
      encadrant.mustChangePassword = false;
      await encadrant.save();
      
      console.log(`✅ Mot de passe encadrant changé: ${email}`);
      return res.json({ success: true });
    }
    
    // Chercher dans les users (admin, etc.)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      password: oldPassword 
    });
    
    if (user) {
      user.password = newPassword;
      await user.save();
      
      console.log(`✅ Mot de passe user changé: ${email}`);
      return res.json({ success: true });
    }
    
    console.log(`❌ Échec changement mot de passe: ${email}`);
    res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect' });
  } catch (error) {
    console.error('Erreur change-password:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES ÉTUDIANTS
// ============================================================================

app.get('/api/etudiants', async (req, res) => {
  const etudiants = await Etudiant.find();
  res.json(etudiants);
});

app.get('/api/etudiants/by-email/:email', async (req, res) => {
  const etudiant = await Etudiant.findOne({ 
    email: { $regex: new RegExp(`^${req.params.email}$`, 'i') }
  });
  
  if (etudiant) {
    res.json(etudiant);
  } else {
    res.status(404).json({ message: 'Étudiant non trouvé' });
  }
});

app.get('/api/etudiants/eligible/:email', async (req, res) => {
  try {
    const email = req.params.email;
    
    // Trouver l'étudiant
    const etudiant = await Etudiant.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (!etudiant) {
      return res.json({ eligible: false, reason: 'Email non trouvé dans la base étudiante' });
    }
    
    // Vérifier le niveau (L3 requis)
    if (etudiant.niveau !== 'L3') {
      return res.json({ eligible: false, reason: `Niveau ${etudiant.niveau} non éligible. Seuls les L3 peuvent s'inscrire.` });
    }
    
    // Vérifier si déjà inscrit
    const existingCandidat = await Candidat.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (existingCandidat) {
      return res.json({ eligible: false, reason: 'Cet email est déjà inscrit sur la plateforme' });
    }
    
    res.json({ eligible: true, etudiant });
  } catch (error) {
    console.error('Erreur eligibility:', error);
    res.status(500).json({ eligible: false, reason: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES CANDIDATS
// ============================================================================

app.get('/api/candidats', async (req, res) => {
  const candidats = await Candidat.find();
  res.json(candidats);
});

app.get('/api/candidats/disponibles', async (req, res) => {
  try {
    // Candidats qui n'ont pas de dossier ou dont le dossier est à l'étape CHOIX_SUJET/CHOIX_BINOME
    const allCandidats = await Candidat.find();
    const dossiers = await Dossier.find({ etape: { $in: ['CHOIX_SUJET', 'CHOIX_BINOME'] } });
    
    const candidatIdsWithDossier = dossiers.flatMap(d => d.candidatIds);
    const disponibles = allCandidats.filter(c => 
      !candidatIdsWithDossier.includes(c.id) || 
      dossiers.some(d => d.candidatIds.includes(c.id))
    );
    
    res.json(disponibles);
  } catch (error) {
    console.error('Erreur candidats disponibles:', error);
    res.status(500).json([]);
  }
});

app.post('/api/candidats/inscription', async (req, res) => {
  try {
    const { email, nom, prenom, telephone, etudiantId } = req.body;
    
    // Vérifier si déjà inscrit
    const existing = await Candidat.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email déjà inscrit' });
    }
    
    const nextId = await getNextId('candidat');
    const tempPassword = genererMotDePasse();
    
    const newCandidat = new Candidat({
      id: `CAND${String(nextId).padStart(3, '0')}`,
      etudiantId,
      nom,
      prenom,
      email,
      telephone,
      motDePasse: tempPassword,
      dateInscription: new Date().toISOString().split('T')[0],
      mustChangePassword: true
    });
    
    await newCandidat.save();
    
    console.log(`✅ Inscription: ${newCandidat.id} - ${email}`);
    res.status(201).json({
      success: true,
      email,
      temporaryPassword: tempPassword,
      mustChangePassword: true,
      candidatId: newCandidat.id
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES DOSSIERS
// ============================================================================

app.get('/api/dossiers', async (req, res) => {
  const dossiers = await Dossier.find();
  res.json(dossiers);
});

// IMPORTANT: Cette route DOIT être avant /api/dossiers/:id
app.get('/api/dossiers/candidat/:candidatId', async (req, res) => {
  const dossiers = await Dossier.find({ candidatIds: req.params.candidatId });
  console.log(`📋 Dossiers pour ${req.params.candidatId}:`, dossiers.length);
  res.json(dossiers);
});

app.get('/api/dossiers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de dossier invalide' });
    }
    
    const dossier = await Dossier.findOne({ id });
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Enrichir le dossier
    const candidats = await Candidat.find({ id: { $in: dossier.candidatIds } });
    
    // Trouver l'encadrant via une demande acceptée
    const demandeAcceptee = await DemandeEncadrement.findOne({ 
      dossierId: dossier.id, 
      statut: 'ACCEPTEE' 
    });
    
    let encadrant = null;
    if (demandeAcceptee) {
      encadrant = await Encadrant.findOne({ id: demandeAcceptee.encadrantId });
    }

    const response = {
      ...dossier.toObject(),
      candidats: candidats.map(c => ({
        nom: c.nom,
        prenom: c.prenom,
        email: c.email,
        telephone: c.telephone,
        dateNaissance: c.dateNaissance,
        lieuNaissance: c.lieuNaissance,
        classe: c.classe
      })),
      encadrant: encadrant ? {
        id: encadrant.id,
        nom: encadrant.nom,
        prenom: encadrant.prenom,
        email: encadrant.email
      } : null,
      type: dossier.candidatIds.length > 1 ? 'binome' : 'solo',
      candidatPrincipal: candidats.find(c => c.id === dossier.candidatIds[0]) || null,
      candidatBinome: dossier.candidatIds.length > 1 ? (candidats.find(c => c.id === dossier.candidatIds[1]) || null) : null
    };

    res.json(response);
  } catch (error) {
    console.error('Erreur récupération détail dossier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/dossiers', async (req, res) => {
  try {
    const { titre, description, candidatId, anneeAcademique } = req.body;
    const currentYear = anneeAcademique || '2025-2026';
    
    // 1. Vérifier que le candidat existe
    const candidat = await Candidat.findOne({ id: candidatId });
    if (!candidat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidat non trouvé' 
      });
    }
    
    // 2. Vérifier l'éligibilité via l'étudiant (L3 Génie Informatique)
    const etudiant = await Etudiant.findOne({ id: candidat.etudiantId });
    if (!etudiant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Étudiant non trouvé' 
      });
    }
    
    if (etudiant.niveau !== 'L3') {
      return res.status(403).json({ 
        success: false, 
        message: `Seuls les étudiants en L3 peuvent créer un dossier de mémoire. Vous êtes en ${etudiant.niveau}.` 
      });
    }
    
    if (etudiant.departement !== 'Génie Informatique') {
      return res.status(403).json({ 
        success: false, 
        message: `Seuls les étudiants du département Génie Informatique peuvent créer un dossier. Vous êtes en ${etudiant.departement}.` 
      });
    }
    
    // 3. Vérifier qu'il n'a pas déjà un dossier pour cette année académique
    const existingDossier = await Dossier.findOne({ 
      candidatIds: candidatId,
      anneeAcademique: currentYear
    });
    
    if (existingDossier) {
      return res.status(400).json({ 
        success: false, 
        message: `Vous avez déjà un dossier pour l'année académique ${currentYear}. Vous ne pouvez créer qu'un seul dossier par année.` 
      });
    }
    
    // 4. Créer le dossier
    const nextId = await getNextId('dossier');
    const today = new Date().toISOString().split('T')[0];
    
    const newDossier = new Dossier({
      id: nextId,
      titre: titre || 'Mon mémoire',
      description: description || 'Dossier en cours de création',
      statut: 'EN_COURS',
      etape: 'CHOIX_SUJET',
      dateCreation: today,
      dateModification: today,
      anneeAcademique: currentYear,
      candidatIds: [candidatId],
      progression: 0
    });
    
    await newDossier.save();
    
    console.log(`📁 Dossier créé: ${newDossier.id} pour ${candidatId} (${currentYear})`);
    res.status(201).json({ 
      success: true, 
      dossier: newDossier 
    });
  } catch (error) {
    console.error('Erreur création dossier:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.put('/api/dossiers/:id', async (req, res) => {
  try {
    const dossier = await Dossier.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { ...req.body, dateModification: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    
    if (dossier) {
      res.json(dossier);
    } else {
      res.status(404).json({ message: 'Dossier non trouvé' });
    }
  } catch (error) {
    console.error('Erreur update dossier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/dossiers/:id/etape', async (req, res) => {
  try {
    const { etape } = req.body;
    const dossier = await Dossier.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { etape, dateModification: new Date().toISOString().split('T')[0] },
      { new: true }
    );
    
    if (dossier) {
      console.log(`📝 Dossier ${req.params.id} → étape ${etape}`);
      res.json(dossier);
    } else {
      res.status(404).json({ message: 'Dossier non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES DEMANDES DE BINÔME
// ============================================================================

app.get('/api/demandes/recues/:candidatId', async (req, res) => {
  const demandes = await DemandeBinome.find({ destinataireId: req.params.candidatId });
  res.json(demandes);
});

app.get('/api/demandes/envoyees/:candidatId', async (req, res) => {
  const demandes = await DemandeBinome.find({ demandeurId: req.params.candidatId });
  res.json(demandes);
});

app.post('/api/demandes', async (req, res) => {
  try {
    const nextId = await getNextId('demandeBinome');
    
    const newDemande = new DemandeBinome({
      idDemande: nextId,
      ...req.body,
      statut: 'EN_ATTENTE',
      dateDemande: new Date()
    });
    
    await newDemande.save();
    
    console.log(`📬 Demande créée: ${newDemande.demandeurId} → ${newDemande.destinataireId}`);
    res.status(201).json(newDemande);
  } catch (error) {
    console.error('Erreur création demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/demandes/:id/accepter', async (req, res) => {
  try {
    const demande = await DemandeBinome.findOneAndUpdate(
      { idDemande: parseInt(req.params.id) },
      { statut: 'ACCEPTEE', dateReponse: new Date() },
      { new: true }
    );
    
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    // 1. Ajouter le destinataire au dossier du demandeur (créer le groupe)
    const dossierDemandeur = await Dossier.findOneAndUpdate(
      { id: demande.dossierDemandeurId },
      { 
        $addToSet: { candidatIds: demande.destinataireId },
        etape: 'CHOIX_ENCADRANT',
        progression: 40, // 40% après binôme
        dateModification: new Date().toISOString().split('T')[0]
      },
      { new: true }
    );
    
    // 2. Supprimer le dossier du destinataire (s'il en a un) car il rejoint le groupe du demandeur
    // Note: candidatIds est un tableau, on cherche si destinataireId est dans ce tableau
    const dossiersDestinataire = await Dossier.find({ 
      candidatIds: { $in: [demande.destinataireId] },
      id: { $ne: demande.dossierDemandeurId } // Exclure le dossier du demandeur
    });
    
    console.log(`   🔍 Dossiers du destinataire ${demande.destinataireId}:`, dossiersDestinataire.length);
    
    for (const dossierDest of dossiersDestinataire) {
      // Ne supprimer que si c'est un dossier personnel (pas partagé)
      if (dossierDest.candidatIds.length === 1) {
        await Dossier.deleteOne({ id: dossierDest.id });
        console.log(`   🗑️ Dossier ${dossierDest.id} du destinataire supprimé (rejoint le groupe)`);
      }
    }
    
    // 3. Refuser automatiquement les autres demandes en attente envoyées par le demandeur
    await DemandeBinome.updateMany(
      { demandeurId: demande.demandeurId, statut: 'EN_ATTENTE', idDemande: { $ne: demande.idDemande } },
      { statut: 'ANNULEE', dateReponse: new Date() }
    );
    
    // 4. Refuser automatiquement les autres demandes en attente reçues par le destinataire
    await DemandeBinome.updateMany(
      { destinataireId: demande.destinataireId, statut: 'EN_ATTENTE', idDemande: { $ne: demande.idDemande } },
      { statut: 'REFUSEE', dateReponse: new Date() }
    );
    
    console.log(`✅ Demande ${demande.idDemande} acceptée: ${demande.demandeurId} + ${demande.destinataireId} forment un binôme`);
    console.log(`   📁 Dossier du groupe: ${demande.dossierDemandeurId}`);
    
    res.json({ 
      success: true, 
      demande, 
      dossierGroupe: dossierDemandeur,
      message: 'Demande acceptée ! Vous formez maintenant un binôme.'
    });
  } catch (error) {
    console.error('Erreur accepter demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/demandes/:id/refuser', async (req, res) => {
  const demande = await DemandeBinome.findOneAndUpdate(
    { idDemande: parseInt(req.params.id) },
    { statut: 'REFUSEE', dateReponse: new Date() },
    { new: true }
  );
  
  if (demande) {
    console.log(`❌ Demande refusée: ${demande.idDemande}`);
    res.json(demande);
  } else {
    res.status(404).json({ message: 'Demande non trouvée' });
  }
});

app.put('/api/demandes/:id/annuler', async (req, res) => {
  const demande = await DemandeBinome.findOneAndUpdate(
    { idDemande: parseInt(req.params.id) },
    { statut: 'ANNULEE', dateReponse: new Date() },
    { new: true }
  );
  
  if (demande) {
    res.json(demande);
  } else {
    res.status(404).json({ message: 'Demande non trouvée' });
  }
});

// ============================================================================
// ROUTES ENCADRANTS
// ============================================================================

app.get('/api/encadrants', async (req, res) => {
  const encadrants = await Encadrant.find();
  res.json(encadrants);
});

// IMPORTANT: Cette route doit être AVANT /api/encadrants/:id
// sinon "disponibles" sera interprété comme un ID
app.get('/api/encadrants/disponibles', async (req, res) => {
  const disponibles = await Encadrant.find({
    estDisponible: true,
    $expr: { $lt: ['$nombreEncadrementsActuels', '$capaciteEncadrement'] }
  });
  res.json(disponibles);
});

app.get('/api/encadrants/:id', async (req, res) => {
  const encadrant = await Encadrant.findOne({ id: parseInt(req.params.id) });
  if (encadrant) {
    res.json(encadrant);
  } else {
    res.status(404).json({ message: 'Encadrant non trouvé' });
  }
});

// Mettre à jour la capacité d'encadrement
app.put('/api/encadrants/:id/capacite', async (req, res) => {
  try {
    const encadrantId = parseInt(req.params.id);
    const { capaciteEncadrement } = req.body;

    if (!capaciteEncadrement || capaciteEncadrement < 1) {
      return res.status(400).json({ message: 'Capacité invalide' });
    }

    const encadrant = await Encadrant.findOneAndUpdate(
      { id: encadrantId },
      { capaciteEncadrement },
      { new: true }
    );

    if (!encadrant) {
      return res.status(404).json({ message: 'Encadrant non trouvé' });
    }

    console.log(`✅ Capacité encadrement mise à jour: ${encadrant.email} -> ${capaciteEncadrement}`);
    res.json({ success: true, encadrant });
  } catch (error) {
    console.error('Erreur mise à jour capacité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Statistiques de l'encadrant pour le dashboard
app.get('/api/encadrants/:id/stats', async (req, res) => {
  try {
    const encadrantId = parseInt(req.params.id);
    
    // Compter les dossiers encadrés (étudiants encadrés)
    const dossiersEncadres = await Dossier.find({ encadrantId });
    
    // Compter le nombre total d'étudiants (candidats) encadrés
    const nombreEtudiants = dossiersEncadres.reduce((total, dossier) => {
      return total + (dossier.candidatIds ? dossier.candidatIds.length : 0);
    }, 0);
    
    // Compter les demandes d'encadrement en attente
    const demandesEnAttente = await DemandeEncadrement.countDocuments({ 
      encadrantId,
      statut: 'EN_ATTENTE'
    });
    
    res.json({
      nombreEtudiants,
      nombreDossiers: dossiersEncadres.length,
      demandesEnAttente
    });
  } catch (error) {
    console.error('Erreur stats encadrant:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Détails de l'encadrement pour la section "Mon encadrement"
app.get('/api/encadrants/:id/encadrement', async (req, res) => {
  try {
    const encadrantId = parseInt(req.params.id);
    
    // Déterminer l'année académique en cours (2024-2025)
    const anneeAcademiqueCourante = '2024-2025';
    
    // Récupérer les dossiers encadrés pour l'année académique en cours
    const dossiersEncadres = await Dossier.find({ 
      encadrantId,
      anneeAcademique: anneeAcademiqueCourante
    });
    
    console.log(`📚 Dossiers encadrés pour ${anneeAcademiqueCourante}:`, dossiersEncadres.length);
    
    // Pour chaque dossier, récupérer les informations des candidats
    const dossiersAvecCandidats = await Promise.all(
      dossiersEncadres.map(async (dossier) => {
        const candidats = await Candidat.find({ 
          id: { $in: dossier.candidatIds } 
        });
        
        return {
          id: dossier.id,
          titre: dossier.titre,
          statut: dossier.statut,
          etape: dossier.etape,
          progression: dossier.progression,
          anneeAcademique: dossier.anneeAcademique,
          candidats: candidats.map(c => ({
            id: c.id,
            nom: c.nom,
            prenom: c.prenom,
            email: c.email
          }))
        };
      })
    );
    
    res.json({
      dossiers: dossiersAvecCandidats,
      anneeAcademique: anneeAcademiqueCourante
    });
  } catch (error) {
    console.error('Erreur encadrement details:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ============================================================================
// ROUTES DEMANDES D'ENCADREMENT
// ============================================================================

// Créer une demande d'encadrement
app.post('/api/demandes-encadrement', async (req, res) => {
  try {
    const { dossierId, encadrantId } = req.body;

    // Vérifier que le dossier existe
    const dossier = await Dossier.findOne({ id: dossierId });
    if (!dossier) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Vérifier que l'encadrant existe
    const encadrant = await Encadrant.findOne({ id: encadrantId });
    if (!encadrant) {
      return res.status(404).json({ message: 'Encadrant non trouvé' });
    }

    // Vérifier qu'il n'y a pas déjà une demande en attente pour ce dossier
    const demandeExistante = await DemandeEncadrement.findOne({
      dossierId,
      statut: 'EN_ATTENTE'
    });

    if (demandeExistante) {
      // Retourner la demande existante au lieu d'une erreur
      return res.json({ 
        success: true, 
        demande: demandeExistante,
        alreadyExists: true,
        message: 'Vous avez déjà une demande en attente pour ce dossier'
      });
    }

    // Créer la demande (la demande concerne le groupe/dossier, pas un candidat individuel)
    const nouvelleDemande = new DemandeEncadrement({
      id: Date.now(),
      dossierId,
      encadrantId,
      statut: 'EN_ATTENTE',
      dateDemande: new Date()
    });

    await nouvelleDemande.save();
    console.log(`✅ Demande d'encadrement créée: Dossier ${dossierId} -> Encadrant ${encadrantId}`);

    res.json({ success: true, demande: nouvelleDemande, alreadyExists: false });
  } catch (error) {
    console.error('Erreur création demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les demandes d'encadrement pour un encadrant
app.get('/api/demandes-encadrement/encadrant/:encadrantId', async (req, res) => {
  try {
    const encadrantId = parseInt(req.params.encadrantId);
    // Trier par date de demande décroissante (les plus récentes en premier)
    const demandes = await DemandeEncadrement.find({ encadrantId }).sort({ dateDemande: -1 });

    // Enrichir les demandes avec les informations du dossier et de tous les candidats
    const demandesEnrichies = await Promise.all(
      demandes.map(async (demande) => {
        const dossier = await Dossier.findOne({ id: demande.dossierId });
        
        // Récupérer TOUS les candidats du dossier (binôme ou solo)
        const candidats = dossier && dossier.candidatIds?.length > 0
          ? await Candidat.find({ id: { $in: dossier.candidatIds } })
          : [];

        return {
          idDemande: demande.id,
          statut: demande.statut,
          dateDemande: demande.dateDemande,
          dateReponse: demande.dateReponse,
          motifRefus: demande.motifRefus,
          dossierMemoire: dossier ? {
            idDossierMemoire: dossier.id,
            titre: dossier.titre,
            description: dossier.description,
            anneeAcademique: dossier.anneeAcademique,
            progression: dossier.progression || 0,
            etape: dossier.etape
          } : null,
          candidats: candidats.map(c => ({
            idCandidat: c.id,
            nom: c.nom,
            prenom: c.prenom,
            email: c.email
          }))
        };
      })
    );

    res.json(demandesEnrichies);
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer la demande d'encadrement pour un dossier spécifique
app.get('/api/demandes-encadrement/dossier/:dossierId', async (req, res) => {
  try {
    const dossierId = parseInt(req.params.dossierId);
    const demande = await DemandeEncadrement.findOne({ dossierId });

    if (!demande) {
      return res.status(404).json({ message: 'Aucune demande trouvée pour ce dossier' });
    }

    // Enrichir avec les informations de l'encadrant
    const encadrant = await Encadrant.findOne({ id: demande.encadrantId });

    res.json({
      idDemande: demande.id,
      statut: demande.statut,
      dateDemande: demande.dateDemande,
      dateReponse: demande.dateReponse,
      motifRefus: demande.motifRefus,
      encadrant: encadrant ? {
        id: encadrant.id,
        nom: encadrant.nom,
        prenom: encadrant.prenom,
        email: encadrant.email,
        grade: encadrant.grade
      } : null
    });
  } catch (error) {
    console.error('Erreur récupération demande dossier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Accepter une demande d'encadrement
app.put('/api/demandes-encadrement/:id/accepter', async (req, res) => {
  try {
    const demandeId = parseInt(req.params.id);
    const demande = await DemandeEncadrement.findOneAndUpdate(
      { id: demandeId },
      { 
        statut: 'ACCEPTEE',
        dateReponse: new Date()
      },
      { new: true }
    );

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Mettre à jour le dossier avec l'encadrant
    await Dossier.findOneAndUpdate(
      { id: demande.dossierId },
      { 
        encadrantId: demande.encadrantId,
        etape: 'VALIDATION_COMMISSION',
        progression: 40
      }
    );

    // Incrémenter le nombre d'encadrements de l'encadrant
    await Encadrant.findOneAndUpdate(
      { id: demande.encadrantId },
      { $inc: { nombreEncadrementsActuels: 1 } }
    );

    console.log(`✅ Demande acceptée: ${demandeId}`);
    res.json({ success: true, demande });
  } catch (error) {
    console.error('Erreur acceptation demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Refuser une demande d'encadrement
app.put('/api/demandes-encadrement/:id/refuser', async (req, res) => {
  try {
    const demandeId = parseInt(req.params.id);
    const { motifRefus } = req.body;

    if (!motifRefus || !motifRefus.trim()) {
      return res.status(400).json({ message: 'Le motif de refus est obligatoire' });
    }

    const demande = await DemandeEncadrement.findOneAndUpdate(
      { id: demandeId },
      { 
        statut: 'REFUSEE',
        dateReponse: new Date(),
        motifRefus
      },
      { new: true }
    );

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    console.log(`✅ Demande refusée: ${demandeId}`);
    res.json({ success: true, demande });
  } catch (error) {
    console.error('Erreur refus demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES SUJETS
// ============================================================================

app.get('/api/sujets', async (req, res) => {
  const sujets = await Sujet.find();
  res.json(sujets);
});

app.get('/api/sujets/disponibles', async (req, res) => {
  const disponibles = await Sujet.find({ disponible: true, statut: 'approuve' });
  res.json(disponibles);
});

app.get('/api/sujets/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID de sujet invalide' });
  }
  
  const sujet = await Sujet.findOne({ id });
  if (!sujet) {
    return res.status(404).json({ message: 'Sujet non trouvé' });
  }
  
  // Récupérer les infos de l'encadrant
  let encadrant = null;
  if (sujet.encadrantId) {
    encadrant = await Encadrant.findOne({ id: sujet.encadrantId });
  }
  
  // Retourner le sujet avec les infos de l'encadrant
  res.json({
    ...sujet.toObject(),
    encadrant: encadrant ? {
      id: encadrant.id,
      nom: encadrant.nom,
      prenom: encadrant.prenom,
      nomComplet: `${encadrant.prenom} ${encadrant.nom}`,
      email: encadrant.email,
      telephone: encadrant.telephone,
      bureau: encadrant.bureau,
      grade: encadrant.grade,
      departement: encadrant.departement,
      specialite: encadrant.specialite,
      domainesRecherche: encadrant.domainesRecherche,
      estDisponible: encadrant.estDisponible
    } : null
  });
});

app.post('/api/sujets/:id/choisir', async (req, res) => {
  try {
    const { dossierId } = req.body;
    const sujet = await Sujet.findOne({ id: parseInt(req.params.id) });
    
    if (!sujet || !sujet.disponible) {
      return res.status(400).json({ success: false, message: 'Sujet non disponible' });
    }
    
    const dossier = await Dossier.findOne({ id: dossierId });
    if (!dossier) {
      return res.status(404).json({ success: false, message: 'Dossier non trouvé' });
    }
    
    // Mettre à jour le dossier avec le sujet choisi
    dossier.titre = sujet.titre;
    dossier.description = sujet.description;
    dossier.sujetId = sujet.id;
    dossier.etape = 'CHOIX_BINOME';
    dossier.progression = 20; // 20% après choix du sujet
    dossier.dateModification = new Date().toISOString().split('T')[0];
    await dossier.save();
    
    // Mettre à jour le sujet
    sujet.nombreEtudiantsActuels += dossier.candidatIds.length;
    if (sujet.nombreEtudiantsActuels >= sujet.nombreMaxEtudiants) {
      sujet.disponible = false;
    }
    sujet.dossierId = dossierId;
    await sujet.save();
    
    console.log(`✅ Sujet choisi: "${sujet.titre}" pour dossier ${dossierId}`);
    res.json({ 
      success: true, 
      message: 'Sujet choisi avec succès',
      sujet, 
      dossier 
    });
  } catch (error) {
    console.error('Erreur choix sujet:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Proposer un sujet personnalisé
app.post('/api/sujets/proposer', async (req, res) => {
  try {
    const { dossierId, titre, description, motsCles, objectifs, candidatId } = req.body;
    
    // Vérifier que le dossier existe
    const dossier = await Dossier.findOne({ id: dossierId });
    if (!dossier) {
      return res.status(404).json({ success: false, message: 'Dossier non trouvé' });
    }
    
    // Vérifier que le dossier appartient bien au candidat
    if (!dossier.candidatIds.includes(candidatId)) {
      return res.status(403).json({ success: false, message: 'Ce dossier ne vous appartient pas' });
    }
    
    // Vérifier que le dossier est à l'étape CHOIX_SUJET
    if (dossier.etape !== 'CHOIX_SUJET') {
      return res.status(400).json({ success: false, message: 'Vous avez déjà choisi un sujet pour ce dossier' });
    }
    
    // Créer le nouveau sujet
    const nextId = await getNextId('sujet');
    const today = new Date().toISOString().split('T')[0];
    
    const newSujet = new Sujet({
      id: nextId,
      titre,
      description: description || 'Sujet proposé par l\'étudiant',
      motsCles: motsCles || [],
      objectifs: objectifs || [],
      encadrantId: null, // Pas encore d'encadrant assigné
      niveau: 'L3',
      statut: 'soumis', // Le sujet doit être approuvé par la commission
      disponible: false, // Non disponible pour les autres (c'est un sujet personnel)
      nombreMaxEtudiants: 2,
      nombreEtudiantsActuels: dossier.candidatIds.length,
      dateCreation: today,
      dossierId: dossierId
    });
    
    await newSujet.save();
    
    // Mettre à jour le dossier
    dossier.titre = titre;
    dossier.description = description || 'Sujet proposé par l\'étudiant';
    dossier.sujetId = newSujet.id;
    dossier.etape = 'CHOIX_BINOME';
    dossier.progression = 20;
    dossier.dateModification = today;
    await dossier.save();
    
    console.log(`📝 Sujet proposé: "${titre}" (ID: ${newSujet.id}) pour dossier ${dossierId}`);
    res.status(201).json({ 
      success: true, 
      message: 'Sujet proposé avec succès. Il sera examiné par la commission.',
      sujet: newSujet, 
      dossier 
    });
  } catch (error) {
    console.error('Erreur proposition sujet:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES DEMANDES D'ENCADREMENT
// ============================================================================

app.get('/api/demandes-encadrement/candidat/:candidatId', async (req, res) => {
  const demandes = await DemandeEncadrement.find({ candidatId: req.params.candidatId });
  res.json(demandes);
});


app.post('/api/demandes-encadrement', async (req, res) => {
  try {
    const { candidatId, encadrantId, dossierId, message } = req.body;
    
    const encadrant = await Encadrant.findOne({ id: encadrantId });
    if (!encadrant || !encadrant.estDisponible) {
      return res.status(400).json({ message: 'Encadrant non disponible' });
    }
    
    const candidat = await Candidat.findOne({ id: candidatId });
    const nextId = await getNextId('demandeEncadrement');
    
    const newDemande = new DemandeEncadrement({
      id: nextId,
      candidatId,
      candidatNom: candidat ? `${candidat.prenom} ${candidat.nom}` : 'Inconnu',
      encadrantId,
      encadrantNom: `${encadrant.prenom} ${encadrant.nom}`,
      dossierId,
      message,
      statut: 'EN_ATTENTE',
      dateDemande: new Date()
    });
    
    await newDemande.save();
    
    console.log(`📬 Demande encadrement: ${newDemande.candidatNom} → ${newDemande.encadrantNom}`);
    res.status(201).json(newDemande);
  } catch (error) {
    console.error('Erreur demande encadrement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/demandes-encadrement/:id/accepter', async (req, res) => {
  try {
    const demande = await DemandeEncadrement.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { statut: 'ACCEPTEE', dateReponse: new Date() },
      { new: true }
    );
    
    if (demande) {
      // Mettre à jour le dossier
      await Dossier.findOneAndUpdate(
        { id: demande.dossierId },
        { 
          encadrantId: demande.encadrantId,
          etape: 'VALIDATION_SUJET',
          dateModification: new Date().toISOString().split('T')[0]
        }
      );
      
      // Mettre à jour l'encadrant
      await Encadrant.findOneAndUpdate(
        { id: demande.encadrantId },
        { $inc: { nombreEncadrementsActuels: 1 } }
      );
      
      console.log(`✅ Encadrement accepté: ${demande.id}`);
      res.json(demande);
    } else {
      res.status(404).json({ message: 'Demande non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/demandes-encadrement/:id/refuser', async (req, res) => {
  const { motif } = req.body;
  
  if (!motif) {
    return res.status(400).json({ message: 'Le motif est obligatoire' });
  }
  
  const demande = await DemandeEncadrement.findOneAndUpdate(
    { id: parseInt(req.params.id) },
    { statut: 'REFUSEE', motifRefus: motif, dateReponse: new Date() },
    { new: true }
  );
  
  if (demande) {
    console.log(`❌ Encadrement refusé: ${demande.id}`);
    res.json(demande);
  } else {
    res.status(404).json({ message: 'Demande non trouvée' });
  }
});

// ============================================================================
// ROUTES MÉMOIRES
// ============================================================================

app.get('/api/memoires', async (req, res) => {
  const memoires = await Memoire.find();
  res.json(memoires);
});

// ============================================================================
// ROUTES NOTES DE SUIVI & RÉUNIONS
// ============================================================================

// Récupérer les messages de type RÉUNION (En présentiel ou En ligne) non validés
// Pour un encadrant donné et une année académique
app.get('/api/encadrements/:annee/reunions', async (req, res) => {
  try {
    const { encadrantId } = req.query;
    if (!encadrantId) return res.status(400).json({ message: 'encadrantId requis' });
    
    // 1. Récupérer tous les messages de ce professeur pour l'année donnée
    // Filtrer par type: réunion en ligne ou présentiel
    const messages = await Message.find({
      $or: [
        { encadrantId: Number(encadrantId), typeMessage: 'reunion-meet' },
        { encadrantId: Number(encadrantId), typeMessage: 'presentiel' }
      ]
    });
    
    // TODO: Filtrer par année académique si le schéma Message le permettait (ou via les dossiers liés)
    // Pour l'instant on retourne tout et le frontend filtrera si besoin
    
    // Exclure les réunions déjà transformées en notes (si on avait un flag, ici on suppose que le frontend gère)
    // Idéalement, on devrait ajouter un champ `estValide` ou `noteSuiviId` au Message.
    
    res.json(messages);
  } catch (error) {
    console.error('Erreur récupération réunions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les étudiants encadrés pour une année donnée (Pour lister dans Suivi)
app.get('/api/encadrements/:annee/etudiants', async (req, res) => {
  try {
    const { encadrantId } = req.query;
    //const { annee } = req.params; // Pas utilisé pour le moment dans la query, mais utile pour filtrer plus tard

    if (!encadrantId) return res.status(400).json({ message: 'encadrantId requis' });

    // 1. Trouver les demandes acceptées pour cet encadrant
    const demandes = await DemandeEncadrement.find({
      encadrantId: Number(encadrantId),
      statut: 'ACCEPTEE'
    });

    const etudiants = [];

    for (const demande of demandes) {
      // Cas 1: Candidat individuel
      if (demande.candidatId) {
        const candidat = await Candidat.findOne({ id: demande.candidatId });
        if (candidat) {
          etudiants.push({
            id: candidat.id, // String ID from Candidat model
            nom: candidat.nom,
            prenom: candidat.prenom,
            email: candidat.email,
            dossierId: demande.dossierId // Important pour lier les notes
          });
        }
      }
      // Cas 2: Binôme (si stocké dans candidats ou via dossier)
      // Note: Le modèle actuel semble lier par candidatId ou via le dossier.
      // Si on veut être complet, faudrait voir comment les binômes sont stockés exactement dans DemandeEncadrement
      // (voir le schéma: candidats: [Candidat] n'est pas dans le schéma Mongoose mais dans l'interface TS,
      // dans Mongoose c'est candidatId: String, mais peut-être qu'il faut aller chercher le dossier)
      
      // Récupération via le dossier si nécessaire pour les autres membres du binôme
      if (demande.dossierId) {
        const dossier = await Dossier.findOne({ id: demande.dossierId });
        if (dossier && dossier.candidatIds && dossier.candidatIds.length > 0) {
           // On vérifie si on a pas déjà ajouté ces candidats (via candidatId ci-dessus)
           for (const cId of dossier.candidatIds) {
             if (!etudiants.some(e => e.id === cId)) {
                const c = await Candidat.findOne({ id: cId });
                if (c) {
                  etudiants.push({
                    id: c.id,
                    nom: c.nom,
                    prenom: c.prenom,
                    email: c.email,
                    dossierId: demande.dossierId
                  });
                }
             }
           }
        }
      }
    }

    res.json(etudiants);
  } catch (error) {
    console.error('Erreur récupération étudiants encadrés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Convertir une réunion (Message) en Note de Suivi
app.post('/api/notes-suivi/reunion', async (req, res) => {
  try {
    const { messageId, dossierId, encadrantId, contenu, dateReunion } = req.body;
    
    const message = await Message.findOne({ id: messageId });
    if (!message) return res.status(404).json({ message: 'Réunion introuvable' });
    
    // Créer la note de suivi
    const nextId = await getNextId('noteSuivi');
    const note = new NoteSuivi({
      id: nextId,
      dossierId: parseInt(dossierId),
      auteurId: parseInt(encadrantId),
      auteurRole: 'ENCADRANT',
      dateCreation: new Date(), // Date de la note
      dateAction: dateReunion ? new Date(dateReunion) : new Date(message.dateRendezVous || new Date()), // Date de l'événement
      contenu: contenu || `Réunion valide : ${message.titre}`,
      type: 'REUNION',
      prive: false
    });
    
    await note.save();
    
    // Marquer le message comme "traité" (optionnel, nécessite modif schéma)
    // await Message.updateOne({ id: messageId }, { estTraite: true });
    
    console.log(`✅ Réunion convertie en note: ${note.id}`);
    res.status(201).json(note);
  } catch (error) {
    console.error('Erreur conversion réunion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer des notes de suivi en masse (pour un groupe ou tous)
app.post('/api/notes-suivi/bulk', async (req, res) => {
  try {
    const { dossierIds, encadrantId, contenu, type, dateAction } = req.body;
    
    if (!dossierIds || !Array.isArray(dossierIds) || dossierIds.length === 0) {
      return res.status(400).json({ message: 'Liste de dossiers requise' });
    }
    
    const notesCreées = [];
    
    for (const dId of dossierIds) {
      const nextId = await getNextId('noteSuivi');
      const note = new NoteSuivi({
        id: nextId,
        dossierId: parseInt(dId),
        auteurId: parseInt(encadrantId),
        auteurRole: 'ENCADRANT', // ou 'ADMIN'
        dateCreation: new Date(),
        dateAction: dateAction ? new Date(dateAction) : new Date(),
        contenu: contenu,
        type: type || 'AUTRE',
        prive: false
      });
      await note.save();
      notesCreées.push(note);
    }
    
    console.log(`✅ ${notesCreées.length} notes créées en masse.`);
    res.status(201).json(notesCreées);
  } catch (error) {
    console.error('Erreur création masse notes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES SESSIONS ET SALLES
// ============================================================================

app.get('/api/sessions', async (req, res) => {
  const sessions = await Session.find();
  res.json(sessions);
});

app.get('/api/salles', async (req, res) => {
  const salles = await Salle.find();
  res.json(salles);
});

app.get('/api/salles/disponibles', async (req, res) => {
  const disponibles = await Salle.find({ estDisponible: true });
  res.json(disponibles);
});

// ============================================================================
// CONFIGURATION SMTP POUR EMAILS
// ============================================================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  const { to, prenom, tempPassword } = req.body;

  if (!to || !prenom || !tempPassword) {
    return res.status(400).json({ success: false, message: 'Paramètres manquants' });
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1e3a5f;">Bienvenue sur ISIMemo</h2>
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre compte candidat a été créé avec succès.</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Mot de passe temporaire:</strong> <span style="font-size: 18px; color: #1e3a5f;">${tempPassword}</span></p>
      </div>
      <p><em>Note: Vous devrez changer ce mot de passe lors de votre première connexion.</em></p>
      <p>Cordialement,<br>L'équipe ISIMemo</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: to,
      subject: 'Identifiants ISIMemo',
      html: htmlContent
    });
    console.log('✅ Email envoyé:', to);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur email:', error);
    res.status(500).json({ success: false, message: 'Échec envoi email' });
  }
});

// ============================================================================
// ROUTES ENCADRANTS
// ============================================================================

// Récupérer tous les encadrants
app.get('/api/encadrants', async (req, res) => {
  const encadrants = await Encadrant.find();
  res.json(encadrants);
});

// Récupérer les encadrants disponibles (inscrits sur la plateforme)
app.get('/api/encadrants/disponibles', async (req, res) => {
  const encadrants = await Encadrant.find({ estDisponible: true });
  console.log(`👨‍🏫 Encadrants disponibles: ${encadrants.length}`);
  res.json(encadrants);
});

// Inscription d'un professeur comme encadrant
app.post('/api/encadrants/inscription', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requis' });
    }
    
    // Vérifier si le professeur existe
    const professeur = await Professeur.findOne({ email: email.toLowerCase().replace(/\./g, '').replace('@', 'isidk@') });
    
    // Chercher aussi sans transformation (si l'email est déjà au bon format)
    let prof = professeur;
    if (!prof) {
      prof = await Professeur.findOne({ email: email });
    }
    if (!prof) {
      // Chercher avec une approche plus souple sur l'email
      prof = await Professeur.findOne({ 
        email: { $regex: new RegExp(email.split('@')[0].replace(/\./g, ''), 'i') }
      });
    }
    
    if (!prof) {
      return res.status(404).json({ 
        success: false, 
        message: 'Aucun professeur trouvé avec cet email. Veuillez vérifier que vous êtes bien enregistré comme professeur.' 
      });
    }
    
    // Vérifier si l'encadrant existe déjà
    const encadrantExistant = await Encadrant.findOne({ professeurId: prof.id });
    if (encadrantExistant) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vous êtes déjà inscrit comme encadrant sur la plateforme.' 
      });
    }
    
    // Créer l'encadrant
    const nextId = await getNextId('encadrant');
    const tempPassword = genererMotDePasse();
    
    const newEncadrant = new Encadrant({
      id: nextId,
      professeurId: prof.id,
      nom: prof.nom,
      prenom: prof.prenom,
      email: prof.email,
      telephone: prof.telephone,
      bureau: prof.bureau,
      grade: prof.grade,
      departement: prof.departement,
      specialite: prof.specialite,
      domainesRecherche: prof.domainesRecherche,
      motDePasse: tempPassword,
      estDisponible: true,
      capaciteEncadrement: 5,
      nombreEncadrementsActuels: 0
    });
    
    await newEncadrant.save();
    
    console.log(`👨‍🏫 Nouvel encadrant inscrit: ${prof.prenom} ${prof.nom}`);
    
    res.status(201).json({
      success: true,
      temporaryPassword: tempPassword,
      email: prof.email,
      message: `Inscription réussie ! Bienvenue ${prof.prenom} ${prof.nom}`
    });
  } catch (error) {
    console.error('Erreur inscription encadrant:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ISIMemo API - MongoDB',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString() 
  });
});

// ============================================================================
// ROUTES PERSONNEL ADMINISTRATIF
// ============================================================================

// Statistiques pour le dashboard personnel
app.get('/api/personnel/stats', async (req, res) => {
  try {
    // Compter les candidats inscrits
    const totalCandidats = await Candidat.countDocuments();
    
    // Compter les dossiers par statut
    const dossiers = await Dossier.find();
    const dossierParStatut = dossiers.reduce((acc, d) => {
      acc[d.statut] = (acc[d.statut] || 0) + 1;
      return acc;
    }, {});
    
    // Compter les demandes d'encadrement en attente
    const demandesEnAttente = await DemandeEncadrement.countDocuments({ statut: 'EN_ATTENTE' });
    
    // Compter les encadrants actifs
    const encadrantsActifs = await Encadrant.countDocuments({ estDisponible: true });
    
    // Total des dossiers
    const totalDossiers = dossiers.length;
    
    res.json({
      totalCandidats,
      totalDossiers,
      dossierParStatut,
      demandesEnAttente,
      encadrantsActifs
    });
  } catch (error) {
    console.error('Erreur stats personnel:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Activités récentes pour le dashboard personnel
app.get('/api/personnel/activites-recentes', async (req, res) => {
  try {
    // Dernières inscriptions (5 derniers candidats)
    const dernieresInscriptions = await Candidat.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('nom prenom email createdAt');
    
    // Dernières demandes d'encadrement (5 dernières)
    const dernieresDemandes = await DemandeEncadrement.find()
      .sort({ dateDemande: -1 })
      .limit(5);
    
    // Enrichir avec les infos des encadrants et dossiers
    const demandesEnrichies = await Promise.all(
      dernieresDemandes.map(async (demande) => {
        const encadrant = await Encadrant.findOne({ id: demande.encadrantId });
        const dossier = await Dossier.findOne({ id: demande.dossierId });
        
        return {
          id: demande.id,
          statut: demande.statut,
          dateDemande: demande.dateDemande,
          encadrant: encadrant ? {
            nom: encadrant.nom,
            prenom: encadrant.prenom
          } : null,
          dossier: dossier ? {
            titre: dossier.titre
          } : null
        };
      })
    );
    
    res.json({
      dernieresInscriptions,
      dernieresDemandes: demandesEnrichies
    });
  } catch (error) {
    console.error('Erreur activités récentes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Liste de tous les dossiers pour le personnel
app.get('/api/personnel/dossiers', async (req, res) => {
  try {
    const dossiers = await Dossier.find().sort({ createdAt: -1 });
    
    const dossiersEnrichis = await Promise.all(
      dossiers.map(async (dossier) => {
        // Récupérer tous les candidats du dossier via candidatIds
        const candidats = await Candidat.find({ id: { $in: dossier.candidatIds || [] } });
        
        // Déterminer le candidat principal (le premier dans le tableau candidatIds)
        const candidatPrincipalId = dossier.candidatIds?.[0];
        const candidatPrincipal = candidats.find(c => c.id === candidatPrincipalId) || null;
        
        // Récupérer le binôme si existe (le second dans le tableau candidatIds)
        const candidatBinomeId = dossier.candidatIds?.[1];
        const candidatBinome = candidatBinomeId ? (candidats.find(c => c.id === candidatBinomeId) || null) : null;
        
        // Récupérer l'encadrant qui a accepté
        const demandeAcceptee = await DemandeEncadrement.findOne({ 
          dossierId: dossier.id, 
          statut: 'ACCEPTEE' 
        });
        
        let encadrant = null;
        if (demandeAcceptee) {
          encadrant = await Encadrant.findOne({ id: demandeAcceptee.encadrantId });
        }
        
        return {
          id: dossier.id,
          titre: dossier.titre,
          description: dossier.description,
          anneeAcademique: dossier.anneeAcademique,
          statut: dossier.statut,
          // Un binôme est détecté si il y a plus d'un ID de candidat
          type: (dossier.candidatIds && dossier.candidatIds.length > 1) ? 'binome' : 'solo',
          candidatPrincipal: candidatPrincipal ? {
            nom: candidatPrincipal.nom,
            prenom: candidatPrincipal.prenom,
            email: candidatPrincipal.email,
            telephone: candidatPrincipal.telephone,
            dateNaissance: candidatPrincipal.dateNaissance,
            lieuNaissance: candidatPrincipal.lieuNaissance,
            classe: candidatPrincipal.classe
          } : null,
          candidatBinome: candidatBinome ? {
            nom: candidatBinome.nom,
            prenom: candidatBinome.prenom,
            email: candidatBinome.email,
            telephone: candidatBinome.telephone,
            dateNaissance: candidatBinome.dateNaissance,
            lieuNaissance: candidatBinome.lieuNaissance,
            classe: candidatBinome.classe
          } : null,
          encadrant: encadrant ? {
            nom: encadrant.nom,
            prenom: encadrant.prenom,
            email: encadrant.email
          } : null,
          createdAt: dossier.createdAt
        };
      })
    );
    
    res.json(dossiersEnrichis);
  } catch (error) {
    console.error('Erreur récupération dossiers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// ============================================================================
// INITIALISATION PERSONNEL ADMINISTRATIF
// ============================================================================

async function initializePersonnelAdministratif() {
  try {
    const count = await PersonnelAdministratif.countDocuments();
    if (count > 0) {
      console.log('✅ Personnel administratif déjà initialisé');
      return;
    }

    const departements = ['Informatique', 'Réseaux Informatiques', 'IA'];
    const personnelData = [];
    let idCounter = 1;

    for (const dept of departements) {
      // Chef de département
      personnelData.push({
        id: idCounter++,
        nom: 'DIAW',
        prenom: 'El Hadji Mor',
        email: `elhadji.diaw.${dept.toLowerCase().replace(/ /g, '_')}@groupeisi.com`,
        motDePasse: 'Chef2024!',
        role: 'chef',
        departement: dept,
        telephone: '+221 77 123 45 67',
        bureau: `Bureau ${dept} - Bâtiment A`
      });

      // Assistante
      personnelData.push({
        id: idCounter++,
        nom: 'THIAM',
        prenom: 'Mame Anta',
        email: `mame.thiam.${dept.toLowerCase().replace(/ /g, '_')}@groupeisi.com`,
        motDePasse: 'Assist2024!',
        role: 'assistant',
        departement: dept,
        telephone: '+221 77 987 65 43',
        bureau: `Secrétariat ${dept} - Bâtiment A`
      });
    }

    await PersonnelAdministratif.insertMany(personnelData);
    console.log(`✅ ${personnelData.length} comptes personnel administratif créés`);
  } catch (error) {
    console.error('❌ Erreur initialisation personnel:', error);
  }
}

// Initialisation des données candidats avec date/lieu de naissance
async function updateCandidatData() {
  try {
    // Souleymane FALL
    const resFall = await Candidat.updateOne(
      { nom: { $regex: /FALL/i }, prenom: { $regex: /Souleymane/i } }, 
      { $set: { dateNaissance: '12/05/2002', lieuNaissance: 'Dakar', classe: 'L3 GL' } }
    );

    // Aliou SENE
    const resSene = await Candidat.updateOne(
      { nom: { $regex: /SENE/i }, prenom: { $regex: /Aliou/i } }, 
      { $set: { dateNaissance: '25/08/2001', lieuNaissance: 'Saint-Louis', classe: 'L3 GL' } }
    );

    // Tous les autres qui n'ont pas de date
    const resOthers = await Candidat.updateMany(
      { dateNaissance: { $exists: false } },
      { $set: { dateNaissance: '01/01/2000', lieuNaissance: 'Sénégal', classe: 'L3 GL' } }
    );
    
    console.log(`✅ Données candidats mises à jour: Fall(${resFall.modifiedCount}), Sene(${resSene.modifiedCount}), Others(${resOthers.modifiedCount})`);
  } catch (error) {
    console.error('❌ Erreur mise à jour candidats:', error);
  }
}

// Appeler les initialisations
initializePersonnelAdministratif().then(() => updateCandidatData());

// ============================================================================
// ROUTES NOTES DE SUIVI
// ============================================================================

app.get('/api/dossiers/:id/notes', async (req, res) => {
  try {
    const notes = await NoteSuivi.find({ dossierId: parseInt(req.params.id) }).sort({ dateCreation: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Erreur récupération notes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/dossiers/:id/notes', async (req, res) => {
  try {
    const nextId = await getNextId('NoteSuivi');
    const newNote = new NoteSuivi({
      id: nextId,
      dossierId: parseInt(req.params.id),
      contenu: req.body.contenu,
      encadrantId: Number(req.body.idEncadrant), // on map idEncadrant pour le frontend si besoin
      idEncadrant: Number(req.body.idEncadrant), // pour match le schema
      dateCreation: new Date()
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Erreur création note:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Validation par lot via CSV
app.patch('/api/personnel/dossiers/batch-validation', async (req, res) => {
  const { decisions, type = 'COMMISSION' } = req.body; // [{ id, valide, motif }], type: COMMISSION | DEPOT
  
  if (!Array.isArray(decisions)) {
    return res.status(400).json({ message: 'Format invalide' });
  }

  try {
    const results = { updated: 0, errors: 0 };

    for (const decision of decisions) {
      const { id, valide, motif } = decision;
      
      let etape, progression, activiteTitre, activiteDesc;
      
      if (type === 'DEPOT') {
        etape = valide ? 'SOUTENANCE' : 'CORRECTION';
        progression = valide ? 90 : 80;
        activiteTitre = valide ? 'Dépôt final validé' : 'Dépôt final refusé (corrections requises)';
        activiteDesc = valide ? `Le dépôt final du dossier "${id}" est validé.` : `Le dépôt final du dossier "${id}" a été refusé. Motif: ${motif}`;
      } else {
        // Par défaut: Commission
        etape = valide ? 'REDACTION' : 'CHOIX_SUJET';
        progression = valide ? 50 : 10;
        activiteTitre = valide ? 'Sujet validé par la commission' : 'Sujet refusé par la commission';
        activiteDesc = valide ? `Le sujet du dossier "${id}" est validé.` : `Le sujet du dossier "${id}" a été refusé. Motif: ${motif}`;
      }
      
      try {
        const updateData = { 
          etape,
          progression,
          motifRefusCommission: type === 'COMMISSION' ? (valide ? null : motif) : undefined,
          motifRefusDepot: type === 'DEPOT' ? (valide ? null : motif) : undefined
        };

        const updated = await Dossier.findOneAndUpdate(
          { id: parseInt(id) },
          { $set: updateData },
          { new: true }
        );

        if (updated) {
          results.updated++;
          // Adapter la description avec le titre réel
          const finalDesc = activiteDesc.replace(`"${id}"`, `"${updated.titre}"`);
          
          // Ajouter une activité
          const nextActId = await getNextId('Activite');
          await new Activite({
            id: nextActId,
            type: valide ? 'VALIDATION' : 'REFUS',
            titre: activiteTitre,
            description: finalDesc,
            date: new Date(),
            dossierId: updated.id,
            candidatId: updated.candidatIds[0]
          }).save();
        } else {
          results.errors++;
        }
      } catch (e) {
        results.errors++;
      }
    }

    res.json({ message: 'Traitement terminé', results });
  } catch (error) {
    console.error('Erreur batch validation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES MESSAGES
// ============================================================================

// Récupérer les messages d'un encadrement (par année académique)
app.get('/api/encadrements/:anneeAcademique/messages', async (req, res) => {
  try {
    const { anneeAcademique } = req.params;
    const { encadrantId } = req.query;
    
    if (!encadrantId) {
      return res.status(400).json({ message: 'encadrantId requis' });
    }
    
    const messages = await Message.find({ 
      anneeAcademique,
      encadrantId: parseInt(encadrantId)
    }).sort({ dateEnvoi: 1 }); // 1 = ascending (oldest first)
    
    console.log(`📬 Messages récupérés pour ${anneeAcademique} (encadrant ${encadrantId}):`, messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Envoyer un message
app.post('/api/encadrements/:anneeAcademique/messages', async (req, res) => {
  try {
    const { anneeAcademique } = req.params;
    const { 
      encadrantId, 
      emetteurId, 
      emetteurNom, 
      emetteurRole,
      contenu, 
      titre,
      type,
      lienMeet,
      dateRendezVous,
      heureRendezVous,
      lieu,
      nomDocument,
      cheminDocument,
      tailleDocument
    } = req.body;
    
    if (!contenu || !encadrantId) {
      return res.status(400).json({ message: 'Contenu et encadrantId requis' });
    }
    
    const nextId = await getNextId('Message');
    
    const newMessage = new Message({
      id: nextId,
      anneeAcademique,
      encadrantId,
      emetteurId,
      emetteurNom,
      emetteurRole: emetteurRole || 'encadrant',
      contenu,
      titre,
      typeMessage: type || 'texte',
      lienMeet,
      dateRendezVous,
      heureRendezVous,
      lieu,
      nomDocument,
      cheminDocument,
      tailleDocument,
      dateEnvoi: new Date(),
      lu: false
    });
    
    await newMessage.save();
    
    console.log(`📨 Message envoyé: ${newMessage.typeMessage} - ${newMessage.titre || 'Sans titre'}`);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer un message comme lu
app.put('/api/messages/:id/lu', async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { lu: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Erreur marquage message lu:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// ROUTES TÂCHES
// ============================================================================

// GET - Récupérer les tâches d'un encadrement
app.get('/api/encadrements/:anneeAcademique/taches', async (req, res) => {
  try {
    const { anneeAcademique } = req.params;
    const { encadrantId } = req.query;

    if (!encadrantId) {
      return res.status(400).json({ error: 'encadrantId requis' });
    }

    const taches = await Tache.find({
      anneeAcademique,
      encadrantId: parseInt(encadrantId)
    }).sort({ dateCreation: -1 });

    res.json(taches);
  } catch (error) {
    console.error('Erreur récupération tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Récupérer les tâches d'une demande spécifique (pour SupervisionDashboard)
app.get('/api/demandes/:id/taches', async (req, res) => {
  try {
    const demandeId = parseInt(req.params.id);

    // Récupérer la demande pour obtenir le dossierId
    const demande = await DemandeEncadrement.findOne({ id: demandeId });
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    // Récupérer toutes les tâches liées à ce dossier
    const taches = await Tache.find({ dossierId: demande.dossierId }).sort({ ordre: 1 });

    console.log(`📋 Tâches pour demande ${demandeId} (dossier ${demande.dossierId}):`, taches.length);
    res.json(taches);
  } catch (error) {
    console.error('Erreur récupération tâches demande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Récupérer les tâches d'un dossier spécifique (pour EspaceTravail candidat)
app.get('/api/dossiers/:id/taches', async (req, res) => {
  try {
    const dossierId = parseInt(req.params.id);

    // Récupérer la demande acceptée pour ce dossier
    const demande = await DemandeEncadrement.findOne({
      dossierId: dossierId,
      statut: 'ACCEPTEE'
    });

    if (!demande) {
      console.log(`⚠️ Aucune demande acceptée trouvée pour le dossier ${dossierId}`);
      return res.json([]); // Retourner un tableau vide au lieu d'une erreur
    }

    // Récupérer le dossier pour obtenir l'année académique
    const dossier = await Dossier.findOne({ id: dossierId });
    const anneeAcademique = dossier?.anneeAcademique;

    // Récupérer les tâches :
    // 1. Spécifiques à cette demande (demandeId)
    // 2. Communes (demandeId: null) pour cet encadrant et cette année
    const query = {
      encadrantId: demande.encadrantId,
      $or: [
        { demandeId: demande.id }
      ]
    };

    if (anneeAcademique) {
      query.anneeAcademique = anneeAcademique;
      query.$or.push({ demandeId: null });
    }

    const taches = await Tache.find(query).sort({ ordre: 1, dateCreation: -1 });

    console.log(`📋 Tâches pour dossier ${dossierId}:`, taches.length);
    res.json(taches);
  } catch (error) {
    console.error('Erreur récupération tâches dossier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST - Créer des tâches
app.post('/api/encadrements/:anneeAcademique/taches', async (req, res) => {
  try {
    const { anneeAcademique } = req.params;
    const { encadrantId, titre, description, dateEcheance, priorite, etudiantsAssignes, ordre } = req.body;

    if (!titre || !encadrantId) {
      return res.status(400).json({ error: 'Titre et encadrantId requis' });
    }

    // Récupérer toutes les demandes de cet encadrement
    const demandes = await DemandeEncadrement.find({
      anneeAcademique,
      encadrantId: parseInt(encadrantId),
      statut: 'ACCEPTEE'
    });

    const demandeIds = demandes.map(d => d.id);
    const tachesCreees = [];

    // Fonction d'aide pour décaler les tâches existantes
    const decalerTaches = async (dId, targetOrdre) => {
      if (!targetOrdre) return;
      await Tache.updateMany(
        {
          encadrantId: parseInt(encadrantId),
          anneeAcademique,
          demandeId: dId,
          ordre: { $gte: targetOrdre }
        },
        { $inc: { ordre: 1 } }
      );
    };

    // Si aucun étudiant spécifié ou tous sélectionnés => tâche commune
    if (!etudiantsAssignes || etudiantsAssignes.length === 0 || etudiantsAssignes.length === demandeIds.length) {
      await decalerTaches(null, ordre);
      const id = await getNextId('Tache');
      const tache = new Tache({
        id,
        anneeAcademique,
        encadrantId: parseInt(encadrantId),
        demandeId: null, // null = tâche commune
        titre,
        description,
        dateEcheance,
        priorite: priorite || 'Moyenne',
        statut: 'todo',
        ordre: ordre || 0
      });
      await tache.save();
      tachesCreees.push(tache);
    } else {
      // Créer une tâche pour chaque demande sélectionnée
      for (const demandeId of etudiantsAssignes) {
        await decalerTaches(parseInt(demandeId), ordre);
        const id = await getNextId('Tache');
        const tache = new Tache({
          id,
          anneeAcademique,
          encadrantId: parseInt(encadrantId),
          demandeId: parseInt(demandeId),
          titre,
          description,
          dateEcheance,
          priorite: priorite || 'Moyenne',
          statut: 'todo',
          ordre: ordre || 0
        });
        await tache.save();
        tachesCreees.push(tache);
      }
    }

    // IMPORTANT: Remettre l'étape du dossier à "REDACTION" quand une nouvelle tâche est ajoutée
    // Cela permet de réactiver le workflow de validation
    const dossiersToUpdate = await Promise.all(
      demandes.map(async (demande) => {
        const dossier = await Dossier.findOne({ id: demande.dossierId });
        if (dossier && (dossier.etape === 'PRELECTURE' || dossier.etape === 'VALIDATION_COMMISSION')) {
          dossier.etape = 'REDACTION';
          await dossier.save();
          console.log(`📝 Dossier ${dossier.id} remis en REDACTION suite à l'ajout d'une nouvelle tâche`);
          return dossier;
        }
        return null;
      })
    );

    res.status(201).json(tachesCreees);
  } catch (error) {
    console.error('Erreur création tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer une tâche
app.delete('/api/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Tache.deleteOne({ id: parseInt(id) });
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    console.error('Erreur suppression tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Modifier une tâche (titre, description, ordre...)
app.put('/api/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, dateEcheance, priorite, ordre } = req.body;
    
    const tache = await Tache.findOne({ id: parseInt(id) });
    if (!tache) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    // Si l'ordre change et qu'un nouvel ordre est fourni, on décale
    if (ordre !== undefined && ordre !== tache.ordre) {
      await Tache.updateMany(
        {
          encadrantId: tache.encadrantId,
          anneeAcademique: tache.anneeAcademique,
          demandeId: tache.demandeId,
          id: { $ne: tache.id },
          ordre: { $gte: ordre }
        },
        { $inc: { ordre: 1 } }
      );
      tache.ordre = ordre;
    }

    if (titre) tache.titre = titre;
    if (description) tache.description = description;
    if (dateEcheance) tache.dateEcheance = dateEcheance;
    if (priorite) tache.priorite = priorite;

    await tache.save();
    res.json(tache);
  } catch (error) {
    console.error('Erreur modification tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Modifier le statut d'une tâche (avec support d'upload de fichier)
app.put('/api/taches/:id/statut', upload.single('fichier'), async (req, res) => {
  try {
    const { id } = req.params;
    // Dans le cas d'un upload multipart, les données sont dans req.body
    const { statut: bodyStatut, livrable: livrableJson } = req.body || {};
    
    // Si livrable ou feedback est envoyé en JSON stringified via FormData
    let livrable = livrableJson;
    if (typeof livrableJson === 'string') {
      try {
        livrable = JSON.parse(livrableJson);
      } catch (e) {}
    }

    let feedbackRetour = req.body.feedbackRetour;
    if (typeof feedbackRetour === 'string') {
      try {
        feedbackRetour = JSON.parse(feedbackRetour);
      } catch (e) {}
    }

    const tache = await Tache.findOne({ id: parseInt(id) });
    if (!tache) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    let nouveauStatut = bodyStatut;

    // Si pas de statut fourni dans le body (comportement d'origine/toggle de l'encadrant)
    if (!nouveauStatut) {
      // Toggle entre 'desactivee' et 'todo' (ou l'état précédent)
      nouveauStatut = tache.statut === 'desactivee' ? 'todo' : 'desactivee';
    }

    // Si on veut passer à 'inprogress', vérifier qu'il n'y en a pas déjà une pour ce groupe
    if (nouveauStatut === 'inprogress') {
      const condition = {
        encadrantId: tache.encadrantId,
        anneeAcademique: tache.anneeAcademique,
        statut: 'inprogress',
        demandeId: tache.demandeId,
        id: { $ne: tache.id }
      };

      const existingInProgress = await Tache.findOne(condition);
      if (existingInProgress) {
        return res.status(400).json({ 
          error: 'Une seule tâche peut être "En cours" à la fois pour votre groupe.',
          existingTaskId: existingInProgress.id
        });
      }
    }

    // Si on veut passer en révision, le livrable est OBLIGATOIRE
    if (nouveauStatut === 'review') {
      const hasLivrableInBody = livrable && (livrable.chemin || livrable.nom);
      const hasLivrableInDB = tache.livrable && tache.livrable.chemin;

      if (!hasLivrableInBody && !hasLivrableInDB) {
        return res.status(400).json({ error: 'Un livrable (fichier PDF) est obligatoire pour passer en révision.' });
      }
    }

    tache.statut = nouveauStatut;
    
    // Si un fichier physique a été uploadé via multer
    if (req.file) {
      tache.livrable = {
        nom: livrable?.nom || req.file.originalname,
        chemin: req.file.path.replace(/\\/g, '/'), // Normaliser le chemin pour l'URL
        dateUpload: new Date()
      };
    } else if (livrable) {
      // Fallback si juste des métadonnées (ne devrait plus arriver pour un nouvel upload)
      tache.livrable = {
        nom: livrable.nom,
        chemin: livrable.chemin || tache.livrable?.chemin || `uploads/livrable_${id}.pdf`,
        dateUpload: new Date()
      };
    }

    // NOUVEAU : Gérer le feedback de l'encadrant (rejet ou validation)
    if (feedbackRetour) {
      tache.feedbackRetour = {
        ...feedbackRetour,
        dateRetour: new Date()
      };
      tache.estRetournee = true;
    }

    // Si on passe à 'done', la tâche n'est plus considérée comme "retournée"
    if (nouveauStatut === 'done') {
      tache.estRetournee = false;
    }

    // Permettre la mise à jour des sous-étapes (ex: ajout de corrections par l'encadrant)
    if (req.body.sousEtapes) {
      tache.sousEtapes = req.body.sousEtapes;
    }

    // SI on passe en révision, on stocke AUSSI dans DossierMemoire (base de données centrale des documents)
    if (nouveauStatut === 'review' || nouveauStatut === 'done') {
      const dossiersIdToUpdate = [];
      
      if (tache.demandeId) {
        // Pour une tâche spécifique à une demande, on trouve le dossier via la demande
        const demande = await DemandeEncadrement.findOne({ id: tache.demandeId });
        if (demande && demande.dossierId) {
          dossiersIdToUpdate.push(demande.dossierId);
        }
      } else {
        // Pour une tâche commune, on récupère tous les dossiers actifs de cet encadrant pour cette année
        const demandes = await DemandeEncadrement.find({ 
          encadrantId: tache.encadrantId,
          anneeAcademique: tache.anneeAcademique,
          statut: 'ACCEPTEE'
        });
        dossiersIdToUpdate.push(...demandes.map(d => d.dossierId));
      }

      for (const dId of dossiersIdToUpdate) {
        // 1. Stocker dans DossierMemoire (Spécifique aux livrables de tâches)
        const docMemoireId = await getNextId('DossierMemoire');
        const docMemoire = new DossierMemoire({
          id: docMemoireId,
          dossierId: dId,
          tacheId: tache.id,
          url: livrable?.chemin || tache.livrable?.chemin || `uploads/livrable_${id}.pdf`,
          nomFichier: livrable?.nom || tache.livrable?.nom || `livrable_${id}.pdf`,
          visibilite: nouveauStatut === 'done',
          prelecture: false,
          validation_ticket: false,
          anti_plagiat: false,
          dateCreation: new Date()
        });
        await docMemoire.save();

        // 2. Synchroniser vers la collection Document (Générale pour le dossier)
        const nextDocId = await getNextId('Document');
        const newDoc = new Document({
          id: nextDocId,
          dossierId: dId,
          titre: `Livrable : ${tache.titre}`,
          typeDocument: 'LIVRABLE',
          cheminFichier: livrable?.chemin || tache.livrable?.chemin || `uploads/livrable_${id}.pdf`,
          statut: nouveauStatut === 'done' ? 'VALIDE' : 'EN_ATTENTE',
          dateCreation: new Date()
        });
        await newDoc.save();

        // 3. Créer une Note de Suivi automatique
        const nextNoteId = await getNextId('NoteSuivi');
        const noteSuivi = new NoteSuivi({
          id: nextNoteId,
          dossierId: dId,
          contenu: nouveauStatut === 'done' 
            ? `Tâche validée : "${tache.titre}". Le livrable final a été accepté.`
            : `Livrable déposé pour révision : "${tache.titre}".`,
          idEncadrant: tache.encadrantId,
          dateCreation: new Date()
        });
        await noteSuivi.save();

        // 4. NOUVEAU : Auto-bouclage pré-lecture si c'est une tâche corrective spécifique
        const isCorrectivePrelecture = tache.titre.includes('après pré-lecture');
        if (isCorrectivePrelecture && nouveauStatut === 'done') {
           await DemandePrelecture.findOneAndUpdate(
             { dossierId: dId },
             { dateCloture: new Date(), statut: 'VALIDE_TRI' }
           );
           await Dossier.findOneAndUpdate(
             { id: dId },
             { prelectureEffectuee: true, autoriseSoutenance: true, progression: 90 }
           );
        }
      }
      
      if (dossiersIdToUpdate.length > 0) {
        console.log(`📂 Livrable, Document et Note de suivi créés pour ${dossiersIdToUpdate.length} dossier(s)`);
      }
    }

    await tache.save();
    res.json(tache);
  } catch (error) {
    console.error('Erreur changement statut tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Modifier les sous-étapes d'une tâche
app.put('/api/taches/:id/sous-etapes', async (req, res) => {
  try {
    const { id } = req.params;
    const { sousEtapes } = req.body;
    
    if (!sousEtapes) {
      return res.status(400).json({ error: 'Sous-étapes requises' });
    }

    const tache = await Tache.findOne({ id: parseInt(id) });
    if (!tache) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    tache.sousEtapes = sousEtapes;
    await tache.save();
    
    res.json(tache);
  } catch (error) {
    console.error('Erreur mise à jour sous-étapes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// GET - Récupérer les tâches pour une demande spécifique (candidat)
app.get('/api/demandes/:idDemande/taches', async (req, res) => {
  try {
    const { idDemande } = req.params;
    
    // Récupérer la demande pour avoir l'encadrant et l'année
    // On cherche d'abord par ID de demande
    let demande = await DemandeEncadrement.findOne({ id: parseInt(idDemande) });
    
    // Si non trouvé, on cherche par dossierId (car le front envoie souvent dossier.id)
    if (!demande) {
      demande = await DemandeEncadrement.findOne({ dossierId: parseInt(idDemande), statut: 'ACCEPTEE' });
    }

    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    // Récupérer les tâches :
    // 1. Spécifiques à cette demande (id de la demande Mongoose)
    // 2. Communes (demandeId: null) pour cet encadrant et cette année
    
    // Récupérer l'année depuis le dossier si elle n'est pas sur la demande
    let annee = demande.anneeAcademique;
    if (!annee && demande.dossierId) {
      const dossier = await Dossier.findOne({ id: demande.dossierId });
      if (dossier) annee = dossier.anneeAcademique;
    }

    // Si on n'a toujours pas d'année, on ne pourra pas filtrer correctement les tâches communes
    // Mais on peut au moins essayer de renvoyer les tâches spécifiques
    const query = {
      encadrantId: demande.encadrantId,
      $or: [
        { demandeId: demande.id }
      ]
    };

    if (annee) {
      query.anneeAcademique = annee;
      query.$or.push({ demandeId: null });
    }

    const taches = await Tache.find(query).sort({ dateCreation: -1 });

    res.json(taches);
  } catch (error) {
    console.error('Erreur récupération tâches demande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Récupérer la demande de pré-lecture pour une demande d'encadrement
app.get('/api/demandes/:id/prelecture', async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la demande pour obtenir le dossierId
    const demande = await DemandeEncadrement.findOne({ id: parseInt(id) });
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    // Chercher la demande de pré-lecture associée à ce dossier
    const demandePrelecture = await DemandePrelecture.findOne({ dossierId: demande.dossierId });

    if (!demandePrelecture) {
      return res.status(404).json({ error: 'Aucune demande de pré-lecture trouvée' });
    }

    res.json(demandePrelecture);
  } catch (error) {
    console.error('Erreur récupération pré-lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Autoriser la pré-lecture pour un dossier via une demande d'encadrement
app.put('/api/demandes/:id/autoriser-prelecture', async (req, res) => {
  try {
    const { id } = req.params;
    
    const demande = await DemandeEncadrement.findOne({ id: parseInt(id) });
    if (!demande) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    // 1. Vérifier si toutes les tâches liées à cette demande sont 'done'
    const taches = await Tache.find({ demandeId: demande.id });
    const toutesTachesFaites = taches.length > 0 && taches.every(t => t.statut === 'done');
    
    if (!toutesTachesFaites && taches.length > 0) {
      return res.status(400).json({ error: 'Toutes les tâches doivent être terminées avant la pré-lecture.' });
    }

    // 2. Générer (simuler) un score de plagiat
    // Pour les tests, on peut alterner ou utiliser un score fixe (ex: 35%)
    const scorePlagiat = 35; // Simulé : 35%
    const rapportUrl = `uploads/rapport_plagiat_${demande.dossierId}.pdf`;

    // 3. Créer ou Mettre à jour la DemandePrelecture
    let demandePre = await DemandePrelecture.findOne({ dossierId: demande.dossierId });
    if (!demandePre) {
      const nextId = await getNextId('DemandePrelecture');
      demandePre = new DemandePrelecture({
        id: nextId,
        dossierId: demande.dossierId,
        encadrantPrincipalId: demande.encadrantId,
        statut: 'EN_ATTENTE_ANTI_PLAGIAT',
        scorePlagiat: scorePlagiat,
        rapportAntiPlagiatUrl: rapportUrl
      });
      await demandePre.save();
    } else {
      demandePre.scorePlagiat = scorePlagiat;
      demandePre.rapportAntiPlagiatUrl = rapportUrl;
      demandePre.statut = 'EN_ATTENTE_ANTI_PLAGIAT';
      await demandePre.save();
    }

    // 4. Mettre à jour le dossier
    const dossier = await Dossier.findOneAndUpdate(
      { id: demande.dossierId },
      { 
        scorePlagiat: scorePlagiat,
        rapportPlagiatUrl: rapportUrl,
        etape: 'PRELECTURE',
        autorisePrelecture: true, // L'encadrant a démarré le processus
        progression: 75
      },
      { new: true }
    );

    res.json({ message: 'Rapport anti-plagiat généré', dossier, demandePrelecture: demandePre });
  } catch (error) {
    console.error('Erreur initiation pré-lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Traiter le rapport de plagiat (Accepter ou Rejeter)
app.put('/api/prelecture/:id/traiter-plagiat', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, commentaire } = req.body; // 'accepter' ou 'rejeter'

    const demandePre = await DemandePrelecture.findOne({ id: parseInt(id) });
    if (!demandePre) return res.status(404).json({ error: 'Demande non trouvée' });

    if (action === 'rejeter') {
      // Créer une nouvelle tâche corrective
      const nextTacheId = await getNextId('Tache');
      const nouvelleTache = new Tache({
        id: nextTacheId,
        anneeAcademique: '2025-2026', // À dynamiser
        encadrantId: demandePre.encadrantPrincipalId,
        demandeId: null, // À corriger si on veut lier à la demande
        titre: 'Révision majeure : Taux de plagiat élevé',
        description: `Le rapport anti-plagiat indique un score de ${demandePre.scorePlagiat}%. Merci de revoir les sources et de reformuler les passages concernés. ${commentaire || ''}`,
        statut: 'todo',
        priorite: 'Haute'
      });
      await nouvelleTache.save();

      demandePre.statut = 'REJETE_PLAGIAT';
      await demandePre.save();

      return res.json({ message: 'Document rejeté pour plagiat. Tâche corrective créée.', demandePre });
    } else {
      // Accepter et envoyer au TRI
      // Simuler le choix d'un lecteur TRI (ex: ID 5)
      demandePre.statut = 'EN_COURS_TRI';
      demandePre.lecteurTRIId = 5; 
      await demandePre.save();

      return res.json({ message: 'Rapport validé. Transmis à la commission TRI.', demandePre });
    }
  } catch (error) {
    console.error('Erreur traitement plagiat:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Validation par le lecteur TRI
app.put('/api/prelecture/:id/valider-tri', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const demandePre = await DemandePrelecture.findOne({ id: parseInt(id) });
    if (!demandePre) return res.status(404).json({ error: 'Demande non trouvée' });

    demandePre.statut = 'VALIDE_TRI';
    demandePre.feedbackTRI = feedback;
    demandePre.dateValidationTRI = new Date();
    await demandePre.save();

    res.json({ message: 'Feedback TRI enregistré avec succès', demandePre });
  } catch (error) {
    console.error('Erreur validation TRI:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Bouclage final par l'encadrant
app.put('/api/prelecture/:id/bouclage-encadrant', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, commentaire } = req.body; // 'cloturer' ou 'creer_tache'

    const demandePre = await DemandePrelecture.findOne({ id: parseInt(id) });
    if (!demandePre) return res.status(404).json({ error: 'Demande non trouvée' });

    if (action === 'creer_tache') {
      const nextTacheId = await getNextId('Tache');
      const nouvelleTache = new Tache({
        id: nextTacheId,
        anneeAcademique: '2025-2026',
        encadrantId: demandePre.encadrantPrincipalId,
        titre: 'Corrections finales après pré-lecture',
        description: `Feedback TRI : ${demandePre.feedbackTRI}. Commentaire encadrant : ${commentaire || ''}`,
        statut: 'todo',
        priorite: 'Moyenne'
      });
      await nouvelleTache.save();
      
      // On garde le statut VALIDE_TRI mais on attend que la tâche soit finie pour clore le dossier
      return res.json({ message: 'Tâche finale corrective créée.', demandePre });
    } else {
      // Clôture directe
      demandePre.dateCloture = new Date();
      await demandePre.save();

      // Mettre à jour le dossier pour autoriser la soutenance
      await Dossier.findOneAndUpdate(
        { id: demandePre.dossierId },
        { 
          prelectureEffectuee: true,
          autoriseSoutenance: true,
          progression: 90
        }
      );

      return res.json({ message: 'Phase de pré-lecture bouclée avec succès.', demandePre });
    }
  } catch (error) {
    console.error('Erreur bouclage pré-lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les notes de suivi d'un dossier
app.get('/api/dossiers/:id/notes-suivi', async (req, res) => {
  try {
    const notes = await NoteSuivi.find({ dossierId: parseInt(req.params.id) }).sort({ dateCreation: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Erreur récupération notes de suivi:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les documents d'un dossier
app.get('/api/dossiers/:id/documents', async (req, res) => {
  try {
    const documents = await Document.find({ dossierId: parseInt(req.params.id) }).sort({ dateCreation: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Erreur récupération documents:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Enregistrer un document pour un dossier/candidat
app.post('/api/dossiers/:id/documents', async (req, res) => {
  try {
    const nextId = await getNextId('Document');
    const newDoc = new Document({
      id: nextId,
      dossierId: parseInt(req.params.id),
      titre: req.body.titre,
      typeDocument: req.body.typeDocument || 'PDF',
      cheminFichier: req.body.cheminFichier || `uploads/fiche_depot_${req.params.id}.pdf`,
      statut: 'VALIDE',
      dateCreation: new Date()
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    console.error('Erreur enregistrement document:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================================================
// FONCTIONS INITIALISATION
// ============================================================================

async function initializeDatabase() {
  try {
    // 1. Initialiser le personnel administratif
    const countPersonnel = await PersonnelAdministratif.countDocuments();
    if (countPersonnel === 0) {
      await PersonnelAdministratif.create({
        id: 1,
        nom: 'Diallo',
        prenom: 'Fatou',
        email: 'sec@esp.sn',
        motDePasse: 'pass',
        role: 'chef',
        departement: 'Genie Informatique'
      });
      console.log('✅ Personnel administratif initialisé');
    } else {
      console.log('✅ Personnel administratif déjà initialisé');
    }

    // 2. Mettre à jour les mots de passe des candidats (migration)
    const res = await Candidat.updateMany(
      { motDePasse: { $exists: false } }, 
      { $set: { motDePasse: 'pass', mustChangePassword: true } }
    );
    if (res.modifiedCount > 0) {
      console.log(`✅ ${res.modifiedCount} candidats mis à jour avec mot de passe par défaut`);
    } else {
       // Log format compatible avec ce qu'on voyait avant
       const cFall = await Candidat.countDocuments({ nom: 'Fall' });
       console.log(`✅ Données candidats mises à jour: Fall(${cFall}), Sene(0), Others(0)`);
    }

  } catch (error) {
    console.error('❌ Erreur initialisation:', error);
  }
}

// ============================================================================
// DÉMARRAGE DU SERVEUR
// ============================================================================

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   🚀 ISIMemo Backend API - MongoDB Edition');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   📡 Serveur: http://localhost:${PORT}`);
  console.log(`   🗄️ MongoDB: ${MONGODB_URI}`);
  console.log('═══════════════════════════════════════════════════════════════');
});