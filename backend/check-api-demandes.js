const http = require('http');

console.log('=== VÉRIFICATION API DEMANDES ===\n');

http.get('http://localhost:3001/api/demandes-encadrement/encadrant/11', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const demandes = JSON.parse(data);
      console.log(`Total demandes: ${demandes.length}\n`);
      
      const acceptees = demandes.filter(d => d.statut === 'ACCEPTEE');
      console.log(`Demandes ACCEPTEES: ${acceptees.length}\n`);
      
      acceptees.forEach(d => {
        console.log(`Demande ID: ${d.id}`);
        console.log(`  DossierId: ${d.dossierId}`);
        console.log(`  Statut: ${d.statut}`);
        console.log(`  dossierMemoire présent? ${!!d.dossierMemoire}`);
        if (d.dossierMemoire) {
          console.log(`  dossierMemoire.id: ${d.dossierMemoire.id}`);
          console.log(`  dossierMemoire.titre: ${d.dossierMemoire.titre}`);
          console.log(`  dossierMemoire.etape: ${d.dossierMemoire.etape}`);
          console.log(`  dossierMemoire.progression: ${d.dossierMemoire.progression}`);
        }
        console.log(`  candidats présent? ${!!d.candidats}`);
        if (d.candidats) {
          console.log(`  candidats: ${d.candidats.map(c => c.nom).join(', ')}`);
        }
        console.log('');
      });
      
    } catch (e) {
      console.error('Erreur:', e.message);
      console.log('Réponse brute:', data.substring(0, 500));
    }
  });
}).on('error', (err) => console.error('Erreur:', err.message));
