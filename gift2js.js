/**
 * @fileoverview Script per il parsing di file Moodle GIFT utilizzando gift-pegjs e Bun.
 */

import { parse } from 'gift-pegjs';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

/**
 * Legge un file GIFT e stampa il parse-tree generato.
 * * @param {string} filePath - Il percorso del file .gift da analizzare.
 * @returns {Promise<void>}
 */
async function parseGiftFile(filePath) {
  try {
    // Lettura del file in modo asincrono
    const data = await readFile(filePath, 'utf-8');

    // Analisi del contenuto tramite gift-pegjs
    // Il parser restituisce un array di oggetti (le domande)
    const parseTree = parse(data);

    // Stampa del parse-tree formattato in JSON
    console.log(JSON.stringify(parseTree, null, 2));
    
    console.error(`\n[Successo]: Analizzate ${parseTree.length} domande.`);
  } catch (error) {
    console.error("[Errore durante il parsing]:", error.message);
    process.exit(1);
  }
}

// Gestione dell'argomento da linea di comando
const inputPath = argv[2];

if (!inputPath) {
  console.error("Utilizzo: bun run parse.js <percorso_file.gift>");
  process.exit(1);
}

parseGiftFile(inputPath);
