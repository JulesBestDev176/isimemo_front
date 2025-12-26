
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
      idNoteSuivi: nextId,
      dossierId: parseInt(req.params.id),
      contenu: req.body.contenu,
      idEncadrant: req.body.idEncadrant,
      dateCreation: new Date()
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Erreur création note:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Appeler l'initialisation au démarrage
initializePersonnelAdministratif();

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
