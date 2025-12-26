const http = require('http');

console.log('=== ANALYSE COMPLÈTE DU FLUX DE DONNÉES ===\n');

// 1. Vérifier le dossier ID 2
console.log('1️⃣ DOSSIER (DB)');
http.get('http://localhost:3001/api/dossiers/2', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const dossier = JSON.parse(data);
      console.log(`   ID: ${dossier.id}`);
      console.log(`   Titre: ${dossier.titre}`);
      console.log(`   Candidats: ${JSON.stringify(dossier.candidatIds)}`);
      console.log(`   Etape: ${dossier.etape}`);
      console.log(`   Progression: ${dossier.progression}%`);
      console.log(`   EncadrantId: ${dossier.encadrantId}`);
      
      // 2. Vérifier les demandes d'encadrement pour ce dossier
      console.log('\n2️⃣ DEMANDES ENCADREMENT pour dossier 2');
      http.get('http://localhost:3001/api/demandes-encadrement/encadrant/11', (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => { data2 += chunk; });
        res2.on('end', () => {
          try {
            const demandes = JSON.parse(data2);
            const demandesDossier2 = demandes.filter(d => d.dossierId === 2);
            console.log(`   Total demandes encadrant 11: ${demandes.length}`);
            console.log(`   Demandes pour dossier 2: ${demandesDossier2.length}`);
            
            if (demandesDossier2.length > 0) {
              const demande = demandesDossier2[0];
              console.log(`   Demande ID: ${demande.id}`);
              console.log(`   Statut: ${demande.statut}`);
              
              // 3. Vérifier les tâches via le nouvel endpoint
              console.log(`\n3️⃣ TÂCHES via /api/demandes/${demande.id}/taches`);
              http.get(`http://localhost:3001/api/demandes/${demande.id}/taches`, (res3) => {
                let data3 = '';
                res3.on('data', (chunk) => { data3 += chunk; });
                res3.on('end', () => {
                  try {
                    const taches = JSON.parse(data3);
                    console.log(`   Total tâches: ${taches.length}`);
                    taches.forEach(t => {
                      console.log(`   - Tâche ${t.id}: "${t.titre}" | statut="${t.statut}" | dossierId=${t.dossierId}`);
                    });
                    
                    const allDone = taches.every(t => t.statut === 'done');
                    console.log(`   ✓ Toutes done? ${allDone}`);
                    
                    console.log('\n4️⃣ CONDITION BOUTON');
                    console.log(`   taches.length > 0: ${taches.length > 0}`);
                    console.log(`   every(t => t.statut === 'done'): ${allDone}`);
                    console.log(`   etape === 'REDACTION': ${dossier.etape === 'REDACTION'}`);
                    console.log(`   → BOUTON VISIBLE? ${taches.length > 0 && allDone && dossier.etape === 'REDACTION'}`);
                    
                  } catch (e) {
                    console.error('   Erreur parse tâches:', e.message);
                    console.log('   Réponse:', data3);
                  }
                });
              }).on('error', (err) => console.error('Erreur tâches:', err.message));
              
            } else {
              console.log('   ❌ AUCUNE DEMANDE pour dossier 2 !');
            }
          } catch (e) {
            console.error('Erreur parse demandes:', e.message);
          }
        });
      }).on('error', (err) => console.error('Erreur demandes:', err.message));
      
    } catch (e) {
      console.error('Erreur parse dossier:', e.message);
    }
  });
}).on('error', (err) => console.error('Erreur dossier:', err.message));
