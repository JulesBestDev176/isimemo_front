const http = require('http');

http.get('http://localhost:3001/api/encadrements/2025-2026/taches?encadrantId=11', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const tasks = JSON.parse(data);
        const dossierId = 2;
        
        console.log(`=== DIAGNOSTIC COMPLET ===`);
        console.log(`Total tâches récupérées: ${tasks.length}`);
        console.log(`\nRecherche tâches pour dossier ID ${dossierId}:`);
        
        const dossierTasks = tasks.filter(t => t.dossierId === dossierId);
        console.log(`Tâches trouvées: ${dossierTasks.length}`);
        
        if (dossierTasks.length > 0) {
            console.log(`\nDétails des tâches:`);
            dossierTasks.forEach(t => {
                console.log(`  - ID ${t.id}: "${t.titre}"`);
                console.log(`    Statut: ${t.statut}`);
                console.log(`    DossierId: ${t.dossierId}`);
            });
            
            const allDone = dossierTasks.every(t => t.statut === 'done');
            console.log(`\n✓ TOUTES TERMINÉES (statut='done')? ${allDone}`);
        } else {
            console.log(`\n❌ AUCUNE TÂCHE TROUVÉE pour ce dossier!`);
            console.log(`\nVérification: les tâches ont-elles un dossierId?`);
            tasks.slice(0, 3).forEach(t => {
                console.log(`  - Tâche ${t.id}: dossierId = ${t.dossierId} (${typeof t.dossierId})`);
            });
        }
    } catch (e) {
        console.error('Erreur:', e.message);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
