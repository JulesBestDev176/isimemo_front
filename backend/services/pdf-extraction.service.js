const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const natural = require('natural');

/**
 * Service d'extraction de texte des PDF
 */
class PdfExtractionService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'au',
      'en', 'pour', 'par', 'sur', 'dans', 'avec', 'sans', 'ce', 'cette', 'ces',
      'est', 'sont', 'a', 'ont', 'être', 'avoir', 'faire', 'plus', 'moins',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been'
    ]);
  }

  /**
   * Extrait le texte d'un fichier PDF
   * @param {string} pdfPath - Chemin vers le fichier PDF
   * @returns {Promise<{text: string, pages: number}>}
   */
  async extractTextFromPdf(pdfPath) {
    try {
      const dataBuffer = await fs.readFile(pdfPath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info
      };
    } catch (error) {
      console.error(`Erreur lors de l'extraction du PDF ${pdfPath}:`, error.message);
      throw new Error(`Impossible d'extraire le texte du PDF: ${error.message}`);
    }
  }

  /**
   * Nettoie et normalise le texte extrait
   * @param {string} text - Texte brut
   * @returns {string}
   */
  cleanText(text) {
    if (!text) return '';

    return text
      // Supprimer les caractères spéciaux mais garder les accents
      .replace(/[^\w\sàâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ'-]/g, ' ')
      // Remplacer les espaces multiples par un seul
      .replace(/\s+/g, ' ')
      // Supprimer les espaces en début et fin
      .trim()
      // Mettre en minuscules
      .toLowerCase();
  }

  /**
   * Tokenize le texte et filtre les stop words
   * @param {string} text - Texte à tokenizer
   * @returns {string[]}
   */
  tokenize(text) {
    if (!text) return [];

    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    // Filtrer les stop words et les tokens trop courts
    return tokens
      .filter(token => token.length > 2 && !this.stopWords.has(token))
      .filter((token, index, self) => self.indexOf(token) === index); // Unique tokens
  }

  /**
   * Extrait et traite le contenu d'un PDF
   * @param {string} pdfPath - Chemin vers le fichier PDF
   * @returns {Promise<{fullText: string, tokens: string[], wordCount: number}>}
   */
  async extractAndProcess(pdfPath) {
    const { text, pages } = await this.extractTextFromPdf(pdfPath);
    const cleanedText = this.cleanText(text);
    const tokens = this.tokenize(cleanedText);
    
    return {
      fullText: cleanedText,
      tokens: tokens,
      wordCount: cleanedText.split(/\s+/).length,
      pages: pages
    };
  }

  /**
   * Résout le chemin absolu d'un PDF
   * @param {string} relativePath - Chemin relatif depuis public
   * @returns {string}
   */
  resolvePdfPath(relativePath) {
    // Le chemin relatif commence par /assets/documents/
    // On doit le résoudre depuis le dossier public du frontend
    const frontendPublicPath = path.join(__dirname, '../../public');
    const absolutePath = path.join(frontendPublicPath, relativePath);
    return absolutePath;
  }
}

module.exports = new PdfExtractionService();
