const http = require('http');

http.get('http://localhost:3001/api/dossiers', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
        const dossiers = JSON.parse(data);
        console.log("Total dossiers:", dossiers.length);
        dossiers.forEach(d => {
            console.log(`ID: ${d.id}, Titre: ${d.titre}, CandidatIds: ${JSON.stringify(d.candidatIds)}, EncadrantId: ${d.encadrantId}, Statut: ${d.statut}`);
        });
    } catch (e) {
        console.error(e);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
