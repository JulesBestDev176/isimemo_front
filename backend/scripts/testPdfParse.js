const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function testPdfParse() {
  try {
    console.log('🔍 Test de pdf-parse...\n');
    
    // Tester avec un PDF spécifique
    const pdfPath = path.join(__dirname, '../../public/assets/documents/Abdou Fatah Ndiaye.pdf');
    
    console.log(`📄 Lecture du PDF: ${pdfPath}`);
    console.log(`📍 Fichier existe: ${fs.existsSync(pdfPath)}\n`);
    
    if (!fs.existsSync(pdfPath)) {
      console.error('❌ Le fichier PDF n\'existe pas!');
      return;
    }
    
    // Lire le fichier
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(`✓ Fichier lu: ${dataBuffer.length} bytes\n`);
    
    // Parser le PDF
    console.log('⏳ Parsing du PDF...');
    const data = await pdfParse(dataBuffer);
    
    console.log('\n✅ PDF parsé avec succès!');
    console.log(`📊 Nombre de pages: ${data.numpages}`);
    console.log(`📝 Nombre de caractères: ${data.text.length}`);
    console.log(`\n📄 Extrait (100 premiers caractères):`);
    console.log(data.text.substring(0, 100));
    console.log('...\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPdfParse();
