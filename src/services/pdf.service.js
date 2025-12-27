import jsPDF from 'jspdf';
export const generateFicheDepotPDF = (dossier, targetCandidateEmail) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    // Determine the primary candidate for the PDF based on email
    let primaryCandidat = dossier.candidatPrincipal;
    let binomeCandidat = dossier.candidatBinome;
    if (targetCandidateEmail && dossier.candidatBinome && targetCandidateEmail === dossier.candidatBinome.email) {
        primaryCandidat = dossier.candidatBinome;
        binomeCandidat = dossier.candidatPrincipal;
    }
    // Page 1
    // Logo et titre
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 139); // Bleu BIC (DarkBlue)
    doc.text('ISI', 20, 30);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Institut Supérieur d\'Informatique', 20, 36);
    // Titre principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    const titre = 'FICHE DE DÉPÔT DU SUJET DE MÉMOIRE';
    const titreWidth = doc.getTextWidth(titre);
    doc.text(titre, (pageWidth - titreWidth) / 2, 55);
    // Année académique
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    const annee = `Année Académique : ${dossier.anneeAcademique || '2024/2025'}`;
    const anneeWidth = doc.getTextWidth(annee);
    doc.text(annee, (pageWidth - anneeWidth) / 2, 65);
    let yPos = 85;
    const lineSpacing = 12;
    // Nom et prénoms de l'étudiant
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Étudiant :', 20, yPos);
    doc.setFont('helvetica', 'normal');
    if (primaryCandidat) {
        doc.text(`${primaryCandidat.prenom} ${primaryCandidat.nom}`, 70, yPos);
    }
    yPos += lineSpacing;
    // Mention du binôme si applicable
    if (dossier.type === 'binome' && binomeCandidat) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`(En binôme avec ${binomeCandidat.prenom} ${binomeCandidat.nom})`, 70, yPos - 8);
        doc.setTextColor(0);
        doc.setFontSize(11);
    }
    // Date et Lieu de Naissance
    doc.setFont('helvetica', 'bold');
    doc.text('Né(e) le :', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const dateNaissance = (primaryCandidat === null || primaryCandidat === void 0 ? void 0 : primaryCandidat.dateNaissance) || 'N/A';
    const lieuNaissance = (primaryCandidat === null || primaryCandidat === void 0 ? void 0 : primaryCandidat.lieuNaissance) || 'N/A';
    doc.text(`${dateNaissance} à ${lieuNaissance}`, 70, yPos);
    yPos += lineSpacing;
    // Numéro de téléphone
    doc.setFont('helvetica', 'bold');
    doc.text('Téléphone :', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text((primaryCandidat === null || primaryCandidat === void 0 ? void 0 : primaryCandidat.telephone) || 'N/A', 70, yPos);
    yPos += lineSpacing;
    // Nom et prénoms de l'encadreur
    doc.setFont('helvetica', 'bold');
    doc.text('Encadreur :', 20, yPos);
    doc.setFont('helvetica', 'normal');
    if (dossier.encadrant) {
        doc.text(`${dossier.encadrant.prenom} ${dossier.encadrant.nom}`, 70, yPos);
    }
    else {
        doc.text('Non assigné', 70, yPos);
    }
    yPos += lineSpacing;
    // Classe
    doc.setFont('helvetica', 'bold');
    doc.text('Classe :', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text((primaryCandidat === null || primaryCandidat === void 0 ? void 0 : primaryCandidat.classe) || 'L3 GL', 70, yPos);
    yPos += lineSpacing + 10;
    // Sujet
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 139);
    doc.text('SUJET DE MÉMOIRE :', 20, yPos);
    doc.setTextColor(0);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    const sujetLines = doc.splitTextToSize(dossier.titre, pageWidth - 40);
    doc.text(sujetLines, 20, yPos);
    yPos += sujetLines.length * 7 + 10;
    // Description
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 139);
    doc.text('DESCRIPTION DU PROJET :', 20, yPos);
    doc.setTextColor(0);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(dossier.description || 'Aucune description fournie.', pageWidth - 40);
    doc.text(descriptionLines, 20, yPos);
    yPos += descriptionLines.length * 6 + 20;
    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Signature Étudiant', 20, yPos);
    doc.text('Signature Encadreur', pageWidth - 70, yPos);
    // Sauvegarder le PDF
    const fileName = `Fiche_Depot_${(primaryCandidat === null || primaryCandidat === void 0 ? void 0 : primaryCandidat.nom) || 'Dossier'}_${dossier.id}.pdf`;
    doc.save(fileName);
};
export const generateNotesSuiviPDF = (dossier, notes) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 139);
    doc.text('HISTORIQUE DE SUIVI', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dossier : ${dossier.titre}`, 20, 35);
    doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 20, 42);
    let yPos = 60;
    // Tableau simple fait main
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 8, pageWidth - 40, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text('Date', 25, yPos);
    doc.text('Auteur', 60, yPos);
    doc.text('Contenu', 110, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    notes.forEach((note, index) => {
        // Vérifier saut de page
        if (yPos > 270) {
            doc.addPage();
            yPos = 30;
            // Ré-afficher en-tête tableau
            doc.setFillColor(240, 240, 240);
            doc.rect(20, yPos - 8, pageWidth - 40, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.text('Date', 25, yPos);
            doc.text('Auteur', 60, yPos);
            doc.text('Contenu', 110, yPos);
            yPos += 10;
            doc.setFont('helvetica', 'normal');
        }
        const dateStr = new Date(note.dateCreation).toLocaleDateString('fr-FR');
        const auteur = 'Encadrant'; // Simplification si l'info n'est pas complète
        doc.text(dateStr, 25, yPos);
        doc.text(auteur, 60, yPos);
        // Gestion du texte long pour le contenu
        const contenuLines = doc.splitTextToSize(note.contenu, pageWidth - 130);
        doc.text(contenuLines, 110, yPos);
        // Ligne de séparation
        const height = Math.max(10, contenuLines.length * 5 + 4);
        doc.setDrawColor(200);
        doc.line(20, yPos + height - 5, pageWidth - 20, yPos + height - 5);
        yPos += height;
    });
    doc.save(`Fiche_Suivi_${dossier.id}.pdf`);
};
