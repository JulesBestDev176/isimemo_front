const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  }
}, { _id: false });

const memoireSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  titre: {
    type: String,
    required: true,
    index: true
  },
  auteur: {
    type: String,
    required: true,
    index: true
  },
  auteurs: {
    type: String,
    required: true
  },
  annee: {
    type: String,
    required: true
  },
  departement: {
    type: String,
    required: true
  },
  formation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    index: true
  },
  resume: {
    type: String,
    required: true
  },
  etiquettes: {
    type: [String],
    default: [],
    index: true
  },
  contacts: {
    type: [contactSchema],
    default: []
  },
  cheminFichier: {
    type: String,
    required: true
  },
  fichierPdf: {
    type: String,
    required: true
  },
  domaineEtude: {
    type: String,
    default: 'Génie Informatique'
  },
  filiere: {
    type: String,
    required: true
  },
  motsCles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Index textuel pour la recherche
memoireSchema.index({
  titre: 'text',
  auteur: 'text',
  description: 'text',
  resume: 'text',
  etiquettes: 'text'
}, {
  weights: {
    titre: 10,
    auteur: 8,
    etiquettes: 6,
    description: 4,
    resume: 2
  },
  name: 'memoire_text_index'
});

// Vérifier si le modèle existe déjà avant de le créer
const Memoire = mongoose.models.Memoire || mongoose.model('Memoire', memoireSchema);

module.exports = Memoire;
