var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Calendar, Award, CheckCircle, Users, Download, UserCheck, AlertCircle } from 'lucide-react';
import { Mention } from '../../../models/soutenance/ProcessVerbal';
import { RoleJury } from '../../../models/soutenance/MembreJury';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
// formatDate and formatDateTime are now imported from dateUtils
const getMentionLabel = (mention) => {
    const mentions = {
        [Mention.TRES_BIEN]: 'Très Bien',
        [Mention.BIEN]: 'Bien',
        [Mention.ASSEZ_BIEN]: 'Assez Bien',
        [Mention.PASSABLE]: 'Passable'
    };
    return mentions[mention] || mention;
};
const getMentionColor = (mention) => {
    switch (mention) {
        case Mention.TRES_BIEN:
            return 'bg-primary-100 text-primary-700 border-primary-300';
        case Mention.BIEN:
            return 'bg-primary-100 text-primary-700 border-primary-300';
        case Mention.ASSEZ_BIEN:
            return 'bg-primary-100 text-primary-700 border-primary-300';
        case Mention.PASSABLE:
            return 'bg-primary-100 text-primary-700 border-primary-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};
const getRoleJuryLabel = (role) => {
    const roles = {
        [RoleJury.PRESIDENT]: 'Président',
        [RoleJury.RAPPORTEUR]: 'Rapporteur',
        [RoleJury.EXAMINATEUR]: 'Examinateur',
        [RoleJury.ENCADRANT]: 'Encadrant'
    };
    return roles[role] || role;
};
// Fonction pour générer et télécharger le PDF du procès-verbal
const generatePDF = (processVerbal) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Import dynamique de jsPDF pour éviter les problèmes de chargement
    const { default: jsPDF } = yield import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;
    // Fonction pour ajouter une nouvelle page si nécessaire
    const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };
    // Fonction pour ajouter du texte avec gestion du retour à la ligne
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);
        const maxWidth = pageWidth - 2 * margin;
        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.5;
        const totalHeight = lines.length * lineHeight;
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition + totalHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }
        lines.forEach((line) => {
            // Vérifier à nouveau avant chaque ligne (au cas où on a changé de page)
            if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
        });
        yPosition += 5; // Espacement après le texte
        // Réinitialiser la couleur du texte à noir par défaut
        doc.setTextColor(0, 0, 0);
    };
    // En-tête
    doc.setFillColor(59, 130, 246); // Couleur primary (bleu)
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PROCÈS-VERBAL DE SOUTENANCE', pageWidth / 2, 25, { align: 'center' });
    yPosition = 50;
    // Informations du mémoire
    if ((_a = processVerbal.soutenance) === null || _a === void 0 ? void 0 : _a.dossierMemoire) {
        addText('Sujet du mémoire:', 12, true);
        addText(processVerbal.soutenance.dossierMemoire.titre, 11);
        if (processVerbal.soutenance.dossierMemoire.description) {
            addText(processVerbal.soutenance.dossierMemoire.description, 10, false, [100, 100, 100]);
        }
        yPosition += 5;
    }
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    // Date de soutenance
    addText('Date de soutenance:', 12, true);
    const dateStr = formatDate(processVerbal.dateSoutenance);
    addText(dateStr, 11);
    if (processVerbal.soutenance) {
        addText(`Heure: ${processVerbal.soutenance.heureDebut} - ${processVerbal.soutenance.heureFin}`, 10, false, [100, 100, 100]);
    }
    yPosition += 5;
    // Note et mention
    addText('Note et mention:', 12, true);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(`${processVerbal.noteFinale.toFixed(1)}/20`, margin, yPosition);
    yPosition += 8;
    addText(`Mention: ${getMentionLabel(processVerbal.mention)}`, 11);
    yPosition += 10;
    // Ligne de séparation
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    // Membres du jury
    if (processVerbal.membresJury && processVerbal.membresJury.length > 0) {
        addText('Membres du jury:', 12, true);
        processVerbal.membresJury.forEach((membre) => {
            var _a;
            const nomComplet = membre.professeur
                ? `${membre.professeur.prenom} ${membre.professeur.nom}`
                : 'Membre du jury';
            const role = getRoleJuryLabel(membre.roleJury);
            addText(`• ${nomComplet} - ${role}`, 10);
            if ((_a = membre.professeur) === null || _a === void 0 ? void 0 : _a.email) {
                addText(`  ${membre.professeur.email}`, 9, false, [100, 100, 100]);
            }
        });
        yPosition += 5;
    }
    // Ligne de séparation
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    // Observations
    if (processVerbal.observations) {
        addText('Observations:', 12, true);
        addText(processVerbal.observations, 10);
        yPosition += 5;
    }
    // Appréciations
    if (processVerbal.appreciations) {
        addText('Appréciations du jury:', 12, true);
        addText(processVerbal.appreciations, 10);
        yPosition += 5;
    }
    // Demandes de modifications
    if (processVerbal.demandesModifications) {
        checkPageBreak(30);
        doc.setDrawColor(255, 165, 0); // Orange
        doc.setFillColor(255, 248, 220); // Orange clair
        doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 3, 3, 'FD');
        addText('Demandes de modifications:', 11, true, [255, 140, 0]);
        addText(processVerbal.demandesModifications, 10);
        yPosition += 10;
    }
    // Ligne de séparation
    checkPageBreak(20);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    // Informations complémentaires
    addText('Informations du document:', 12, true);
    addText(`Date de création: ${formatDateTime(processVerbal.dateCreation)}`, 10, false, [100, 100, 100]);
    addText(`Statut: ${processVerbal.estSigne ? 'Signé' : 'En attente de signature'}`, 10, false, [100, 100, 100]);
    if (processVerbal.dateSignature) {
        addText(`Date de signature: ${formatDateTime(processVerbal.dateSignature)}`, 10, false, [100, 100, 100]);
    }
    addText(`Nombre de signatures: ${processVerbal.nombreSignatures}`, 10, false, [100, 100, 100]);
    // Pied de page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} sur ${totalPages} - ISIMemo - Procès-verbal de soutenance`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    // Générer le nom du fichier
    const dateStrFile = processVerbal.dateSoutenance.toISOString().split('T')[0];
    const fileName = `Proces-Verbal-Soutenance-${dateStrFile}.pdf`;
    // Télécharger le PDF
    doc.save(fileName);
});
const DossierProcessVerbal = ({ processVerbal }) => {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-lg p-3", children: _jsx(FileText, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-2xl", children: "Proc\u00E8s-Verbal de Soutenance" }), _jsx(CardDescription, { children: "Document officiel de la soutenance du m\u00E9moire" })] })] }), processVerbal.estSigne && (_jsxs(Badge, { variant: "default", className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Sign\u00E9"] }))] }) }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [_jsx(Calendar, { className: "h-5 w-5 text-primary" }), "Date de soutenance"] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatDate(processVerbal.dateSoutenance) }), processVerbal.soutenance && (_jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [processVerbal.soutenance.heureDebut, " - ", processVerbal.soutenance.heureFin] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [_jsx(Award, { className: "h-5 w-5 text-primary" }), "Note et mention"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-baseline gap-3", children: [_jsxs("p", { className: "text-3xl font-bold text-gray-900", children: [processVerbal.noteFinale.toFixed(1), "/20"] }), _jsx(Badge, { variant: "outline", className: `${getMentionColor(processVerbal.mention)} border-2`, children: getMentionLabel(processVerbal.mention) })] }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Observations" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: processVerbal.observations }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Appr\u00E9ciations du jury" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: processVerbal.appreciations }) })] }), processVerbal.membresJury && processVerbal.membresJury.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-primary" }), "Membres du jury"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: processVerbal.membresJury.map((membre) => {
                                var _a;
                                return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(UserCheck, { className: "h-4 w-4 text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: membre.professeur
                                                                ? `${membre.professeur.prenom} ${membre.professeur.nom}`
                                                                : 'Membre du jury' }), ((_a = membre.professeur) === null || _a === void 0 ? void 0 : _a.email) && (_jsx("p", { className: "text-sm text-gray-600", children: membre.professeur.email }))] })] }), _jsx(Badge, { variant: "outline", className: "bg-primary-50 text-primary-700 border-primary-300", children: getRoleJuryLabel(membre.roleJury) })] }, membre.idMembre));
                            }) }) })] })), processVerbal.demandesModifications && (_jsxs(Card, { className: "border-orange-200 bg-orange-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-lg flex items-center gap-2 text-orange-900", children: [_jsx(AlertCircle, { className: "h-5 w-5" }), "Demandes de modifications"] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-700 whitespace-pre-line", children: processVerbal.demandesModifications }) })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Informations du document" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Date de cr\u00E9ation" }), _jsx("span", { className: "font-medium", children: formatDateTime(processVerbal.dateCreation) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Statut" }), _jsx(Badge, { variant: processVerbal.estSigne ? 'default' : 'secondary', children: processVerbal.estSigne ? 'Signé' : 'En attente de signature' })] }), processVerbal.dateSignature && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Date de signature" }), _jsx("span", { className: "font-medium", children: formatDateTime(processVerbal.dateSignature) })] }))] }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "flex justify-end gap-3", children: _jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => {
                                generatePDF(processVerbal).catch(console.error);
                            }, children: [_jsx(Download, { className: "h-4 w-4" }), "T\u00E9l\u00E9charger le PDF"] }) }) }) })] }));
};
export default DossierProcessVerbal;
