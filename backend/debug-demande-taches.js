const http = require('http');

// Vérifier les tâches pour la demande (on suppose demande ID 1 ou 2)
const demandeId = 1; // Ajuster si nécessaire

http.get(`http://localhost:3001/api/demandes/${demandeId}/taches`, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const tasks = JSON.parse(data);
        console.log(`=== TÂCHES POUR DEMANDE ${demandeId} ===`);
        console.log(`Total: ${tasks.length}`);
        tasks.forEach(t => {
            console.log(`- ID ${t.id}: "${t.titre}"`);
            console.log(`  Statut: "${t.statut}" (type: ${typeof t.statut})`);
        });
        
        const allDone = tasks.every(t => t.statut === 'done');
        console.log(`\n✓ Toutes "done"? ${allDone}`);
    } catch (e) {
        console.error('Erreur:', e.message);
        console.log('Réponse brute:', data);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
