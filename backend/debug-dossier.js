const http = require('http');

// Test: appeler l'API /api/dossiers/2 pour voir ce qui est renvoyé
http.get('http://localhost:3001/api/dossiers/2', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const dossier = JSON.parse(data);
        console.log('=== DOSSIER ID 2 ===');
        console.log(`Titre: ${dossier.titre}`);
        console.log(`Candidats: ${JSON.stringify(dossier.candidats?.map(c => c.nom + ' ' + c.prenom))}`);
        console.log(`Statut: ${dossier.statut}`);
        console.log(`Etape: ${dossier.etape}`);
        console.log(`Progression: ${dossier.progression}%`);
        console.log(`autorisePrelecture: ${dossier.autorisePrelecture}`);
        console.log(`prelectureEffectuee: ${dossier.prelectureEffectuee}`);
    } catch (e) {
        console.error('Erreur:', e.message);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
