# gift2googleform

Genera un quiz Google Moduli a partire da un file Moodle GIFT

## Tool richiesti

- bun
- account Google

Il processo avviene in due fasi:

## Generazione dell'oggetto JS a partire dal sorgente GIFT

Sul computer locale:

- installare Bun, se non installato
- spostarsi nella cartella dello script gift2js.js
- usare `bun run gift2js.js file.gift > file.json`

## Esecuzione di Apps Script

Su AppsScript, se non già fatto:

- creare un progetto script.google.com
- visualizzare appsscript.json
- copiare appsscript.json
- copiare gift2googleform.gs

Per ogni nuovo quiz:

- inserire il nome del quiz nella variabile `TITOLO_MODULO`
- copiare file.json al posto della variabile `QUIZ_JSON`
- eseguire `generaQuizDaJson()`