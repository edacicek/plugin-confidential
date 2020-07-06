// Global variable definition
let definitions_to_show = 0;
let filter = false;
let response;

//Open Tab
$(function () {
    $('body').css('display', 'none');
    $('body').fadeIn(500);
    response = getCurrentPage();

    $("#topHeader").load("/html/top-header.html", function () {
        highlightFormMeaningUse();
    });
    $("#footer").load("/html/footer.html");

    // Setup Words Database
    let config = {
        locateFile: filename => `/js/libs/${filename}`
    };
    loadBinaryFile('/db/words.db', function (data) {
        let uInt8Array = new Uint8Array(data);
        window.initSqlJs(config).then(function (SQL) {
            window.db = new SQL.Database(uInt8Array);
        });
    });

    $("#words").on("focus", function () {
        $("#words").attr('placeholder', 'Loading list of words please wait...');
        setTimeout(function () {
            window.words = [];
            let result = window.db.exec("SELECT * FROM word;");
            result[0].values.forEach(function (element) {
                words.push({
                    "key": element[0] + '_' + element[1],
                    "lemma": element[0],
                    "pos": element[1]
                });
            });
            let fuseOptions = {
                keys: ["key"]
            };
            let displayFunction = function (result, id) {
                return '<a href="/html/form.html?lemma=' + result["lemma"] + '&pos=' + result["pos"] + '"><span class="text-pink font-weight-bold">' + result["lemma"] + ' </span><sup class="text-cyan font-weight-bold">' + result['pos'] + "</sup> <img src='/images/great-britain.png' width='25px' class='rounded-circle float-right'></a>";
            };
            let displayValueFunction = function (result, id) {
                return result["lemma"] // + ' - ' + result['pos'];
            };
            let options = {
                display: displayFunction,
                displayValue: displayValueFunction,
                key: "key",
                resultsLimit: 10,
                fuseOptions: fuseOptions
            };
            $("#words")
                .fuzzyComplete(window.words, options).attr('placeholder', 'Search...')
                .on("keydown", function (event) {
                    if (event.key === "Enter") {
                        //TODO Fuzzy implementation needs simplification
                        let selected_item = $(".fuzzyResults")
                            .find('.selected')
                            .first()[0].innerText
                            .split(" ");
                        window.location.href = '/html/use.html?lemma=' + selected_item[0] + '&pos=' + selected_item[1];
                        console.log();
                    }
                });
        }, 5);
    });

    //Boot
    wt_xu_pro_d(getCurrentPage())
});


let wt_xu_pro_d = function (response) {
    let more_forms_top = $("#more-forms");
    let more_forms_bottom = $("#more-forms-2");

    let forms = response.RAW_05_Forms;

    // Word Lemma
    $("#word-lemma").html(response.RES_XW_word.lemma);

    // Word POS
    $("#word-pos").html(response.RES_XW_word.pos).show();

    // Load History
    let history = localStorage.getItem('history'), current;
    if (!!history) {
        history = JSON.parse(history);
        if (history.length > 20) {
            history = history.slice(20);
        }
        current = {'lemma': response.RES_XW_word.lemma, 'pos': response.RES_XW_word.pos};
        history.push(current);
        localStorage.setItem('history', JSON.stringify(history));
    } else {
        history = [];
        current = {'lemma': response.RES_XW_word.lemma, 'pos': response.RES_XW_word.pos};
        history.push(current);
        localStorage.setItem('history', JSON.stringify(history));
    }

    $("#history").prepend(
        new EliaUiWordsHistory(
            history
        ).html()
    );

    $('#history').mousewheel(function (e, delta) {
        this.scrollLeft -= (delta * 40);
    });

    $("#tts-icon").append(
        new EliaUiIconTTSButton().html()
    ).show();

    $("#tts-button").on("click", function () {
        textToSpeech(response.RES_XW_word.lemma, "en-US");
    });

    $("#word-domain").append(
        new EliaUiDomain(response.RAW_60_Domain).html()
    ).show();

    $("#word-frequency").append(
        new EliaUiFrequency(response.RAW_59_Frequency).html()
    ).show();

    response.RAW_55_Collocate.forEach(function (collocate) {
        $("#collocates").append(new EliaUiCollocate(collocate).html()).show();
    });

    response.RAW_61_Pattern.forEach(function (pattern) {
        $("#patterns").append(new EliaUiPattern(pattern).html()).show();
    });

    // Example Sentences
    response.RAW_39_Sentence.forEach(function (example_sentence) {
        $("#example-sentences-list").prepend(
            new EliaUiExampleSentence(
                response.RAW_01_Lemma,
                example_sentence
            ).html()
        );
    });

};