/**
 * file: gift2googleform.gs
 *
 * @brief Genera un Google Form (Quiz) a partire dal parse-tree JSON di gift-pegjs.
 */
function generaQuizDaJson() {

    // ==========================================
    // VARIABILI DA COPIARE MANUALMENTE
    // ==========================================

    const TITOLO_MODULO = "...";
    // L'oggetto letto da Apps Script
    const QUIZ_JSON = [];

    // ==========================================
    // CREAZIONE DEL MODULO (QUIZ)
    // ==========================================

    const form = FormApp.create(TITOLO_MODULO);

    form.setIsQuiz(true)
        .setCollectEmail(true)
        .setLimitOneResponsePerUser(true)
        .setShuffleQuestions(true) // Rimescola l'ordine delle DOMANDE
        .setProgressBar(true);

    // Per il rimescolamento degli item usando le Google Forms API
    const formId = form.getId();
    const updateRequests = [];
    let currentItemIndex = 0; // Contatore per la posizione reale degli elementi MC

    // ==========================================
    // CREAZIONE DOMANDE
    // ==========================================

    QUIZ_JSON.forEach(function (item) {
        if (item.type === "MC") {
            const mcItem = form.addMultipleChoiceItem();

            mcItem.setTitle(item.stem.text);

            const choices = item.choices.map(function (choice) {
                return mcItem.createChoice(choice.text.text, choice.isCorrect);
            });

            mcItem.setChoices(choices).setPoints(1);

            // Prepariamo la richiesta per la Google Forms API
            updateRequests.push({
                updateItem: {
                    item: {
                        questionItem: {
                            question: {
                                choiceQuestion: {
                                    shuffle: true // Rimescola l'ordine delle RISPOSTE
                                }
                            }
                        }
                    },
                    location: {
                        index: currentItemIndex // Punta alla posizione esatta nel form
                    },
                    updateMask: 'questionItem.question.choiceQuestion.shuffle'
                }
            });

            currentItemIndex++; // Incrementiamo solo se abbiamo aggiunto effettivamente un elemento
        }
    });

    // ==========================================
    // ORDINAMENTO CASUALE DEGLI ITEM TRAMITE API
    // ==========================================
    if (updateRequests.length > 0) {
        try {
            callFormsApiDirectly(formId, updateRequests);
            Logger.log('Configurazione "shuffle" applicata con successo via API.');
        } catch (e) {
            Logger.log('Errore durante il batchUpdate: ' + e.message);
        }
    }
    // ==========================================
    // OUTPUT LOG
    // ==========================================

    Logger.log('---------------------------------------------------------');
    Logger.log('QUIZ CREATO CON SUCCESSO!');
    Logger.log('URL Editor: ' + form.getEditUrl());
    Logger.log('---------------------------------------------------------');
}

/**
 * Invia una richiesta batchUpdate direttamente alle API di Google Forms
 */
function callFormsApiDirectly(formId, updateRequests) {
    const url = `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`;

    const options = {
        method: "post",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + ScriptApp.getOAuthToken()
        },
        payload: JSON.stringify({
            requests: updateRequests
        }),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());

    if (response.getResponseCode() !== 200) {
        Logger.log("Errore API: " + response.getContentText());
    } else {
        Logger.log("Shuffle attivato con successo tramite REST API!");
    }
}
