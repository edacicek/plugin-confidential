// Global variable definition
let definitions_to_show = 0;
let filter = false;
let response;

$("#topHeader").load("/html/top-header.html", function () {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");
$("#word-pos").hide();
$("#word-parts").hide();
$("#word-parts-title").hide();
$("#word-family").hide();
$("#word-family-title").hide();

$(function () {
    $("#topHeader").load("/html/top-header.html", function () {
        highlightFormMeaningUse();
    });
    $("#topHeader").load("/html/top-header.html", function () {
        highlightFormMeaningUse();
    });
    $("#footer").load("/html/footer.html");
    //$('body').css('display', 'none');
    //$('body').fadeIn(500);
    response = getCurrentPage();

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
                        window.location.href = '/html/form.html?lemma=' + selected_item[0] + '&pos=' + selected_item[1];
                        console.log();
                    }
                });
        }, 5);
    });

    //Boot
    wt_xf_pro_d(getCurrentPage())
});


let wt_xf_pro_d = function (response) {
    let more_forms_top = $("#more-forms");
    let more_forms_bottom = $("#more-forms-2");

    let forms = response.RAW_05_Forms;

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

    // Word Lemma
    $("#word-lemma").html(response.RES_XW_word.lemma);

    // Word POS
    $("#word-pos").html(response.RES_XW_word.pos).show();

    // Word Text To Speech Icon
    $("#tts-icon").append(
        new EliaUiIconTTSButton().html()
    ).show();

    $("#tts-button").on("click", function () {
        textToSpeech(response.RES_XW_word.lemma, "en-US");
    });

    $("#word-transcript").append(
        new EliaUiTranscript(
            response.RES_XW_word.transcript
        ).html()
    ).show();

    // Word Forms
    response.RAW_05_Forms.forEach(function (form) {
        $("#forms-content").prepend(
            new EliaUiWordForm(
                form
            ).html()
        ).show();
    });

    // Word Parts
    let parts = [];
    let parts_count = 0;
    Object.keys(response.RAW_XP).forEach(function (part) {
        parts[part.split("_")[1]] = part;
        parts_count++;
    });
    for (let i = 1; i <= parts_count; i++) {
        let part = parts[i];
        $("#word-parts").append(
            new EliaUiWordPart(
                part.split("_")[0],
                response.RAW_XP[part]
            ).html()
        ).show();
    }
    $("#word-parts-title").show();

    // Word Family
    response.RAW_36_FamilyMember.forEach(function (word_family) {
        $("#word-family").prepend(
            new EliaUiWordFamily(
                word_family.lemma,
                word_family.pos
            ).html()
        ).show();
        $("#word-family-title").show();
    });

};