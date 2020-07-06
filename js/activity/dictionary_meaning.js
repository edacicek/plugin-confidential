// Global variable definition
let definitions_to_show = 0;
let filter = false;
let response;

$("#topHeader").load("/html/top-header.html", function () {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");

$("#meaning_pos").hide();
$("#word-parts").hide();
$("#word-parts-title").hide();
$("#word-family").hide();
$("#word-family-title").hide();
$("#false-friends").hide();
$("#false-friends-title").hide();
$("#example-sentences").hide();
$("#example-sentences-title").hide();

//Open Tab
$(function () {
    $('body').css('display', 'none');
    $('body').fadeIn(500);
    $("#topHeader").load("/html/top-header.html", function () {
        highlightFormMeaningUse();
    });
    $("#footer").load("/html/footer.html");

    response = getCurrentPage();

    switch (response.RES_XX_id) {
        case "WT.10.PRO.A":
            break;
    }
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
                return '<a href="/html/meaning.html?lemma=' + result["lemma"] + '&pos=' + result["pos"] + '"><span class="text-pink font-weight-bold">' + result["lemma"] + ' </span><sup class="text-cyan font-weight-bold">' + result['pos'] + "</sup> <img src='/images/great-britain.png' width='25px' class='rounded-circle float-right'></a>";
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
                        window.location.href = '/html/meaning.html?lemma=' + selected_item[0] + '&pos=' + selected_item[1];
                        console.log();
                    }
                });
        }, 5);
    });

    //Boot
    wt_xm_pro_d(getCurrentPage())
});


let wt_xm_pro_d = function (response) {
    let more_definition_top = $("#more-definitions");
    let more_definition_bottom = $("#more-definitions-2");

    let senses = response.RAW_XS_Sense;
    let sense = response.RAW_XS_Sense[Object.keys(response.RAW_XS_Sense)[0]];

    // Load History 
    let history = localStorage.getItem('history'), current;
    if (!!history) {
        history = JSON.parse(history);
        if (history.length > 20) {
            history = history.slice(20);
        }
        current = {'lemma': response.RAW_01_Lemma, 'pos': response.RAW_02_Pos};
        history.push(current);
        localStorage.setItem('history', JSON.stringify(history));
    } else {
        history = [];
        current = {'lemma': response.RAW_01_Lemma, 'pos': response.RAW_02_Pos};
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
    $("#meaning_word").html(response.RAW_01_Lemma);

    // Word POS
    $("#meaning_pos").html(response.RAW_02_Pos).show();

    // Word Text To Speech Icon
    $("#tts-icon").append(
        new EliaUiIconTTSButton().html()
    ).show();

    $("#tts-button").on("click", function () {
        textToSpeech(response.RAW_01_Lemma, "en-US");
    });

    if (response.MAX_XS_Sense !== null && response.MAX_XS_Sense !== undefined) {
        if (response.MAX_XS_Sense)
            $("#filter-icon").append(
                new EliaUiIconFilterButton(response.MAX_XS_Sense).html()
            ).show();

        $("#filter-button").on("click", function () {
            if (!filter) {
                $("#filter-button").css("background-color", "#e8e8e8");
                more_definition_top.css("visibility", "hidden");
                more_definition_bottom.css("visibility", "hidden");
                $("#definition-content").empty().append(
                    new EliaUiDefinitionSense(
                        response.MAX_XS_Sense,
                        0
                    ).html()
                );
            } else {
                $("#filter-button").removeAttr('style');
                if (Object.keys(response.RAW_XS_Sense).length > 1 || definitions_to_show > 1) {
                    more_definition_top.css("visibility", "visible");
                    more_definition_bottom.css("visibility", "visible");
                }
                $("#definition-content").empty().append(
                    new EliaUiDefinitionSense(
                        response.RAW_XS_Sense,
                        definitions_to_show
                    ).html()
                );
            }
            filter = !filter;
        });
    }

    // Definitions
    $("#definition-content").prepend(
        new EliaUiDefinitionSense(
            senses,
            definitions_to_show
        ).html()
    );

    if (Object.keys(response.RAW_XS_Sense).length <= 1) {
        more_definition_top.css("visibility", "hidden");
        more_definition_bottom.css("visibility", "hidden");
    }

    let more_definitions = function () {
        definitions_to_show = definitions_to_show + 1;
        $("#definition-content").empty().append(
            new EliaUiDefinitionSense(
                senses,
                definitions_to_show
            ).html()
        );
        if ((definitions_to_show + 1) > Object.keys(response.RAW_XS_Sense).length) {
            more_definition_top.css("visibility", "hidden");
            more_definition_bottom.css("visibility", "hidden");
        }
    };

    more_definition_top.on("click", more_definitions);
    more_definition_bottom.on("click", more_definitions);

    // Word Parts
    response.RAW_XA_Affix.forEach(function (affix) {
        $("#word-parts").prepend(
            new EliaUiWordParts(
                affix.text,
                affix.function,
                affix.definition
            ).html()
        ).show();
        $("#word-parts-title").show();
    });

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

    // False Friends
    response.RAW_37_FalseFriend.forEach(function (false_friend) {
        $("#false-friends").prepend(
            new EliaUiFalseFriend(
                false_friend.lemma,
                false_friend.language
            ).html()
        ).show();
        $("#false-friends-title").show();
    });

    // Example Sentences
    sense.example_sentences.forEach(function (example_sentence) {
        $("#example-sentences-list").prepend(
            new EliaUiExampleSentence(
                response.RAW_01_Lemma,
                example_sentence
            ).html()
        );
        $("#example-sentences").show();
        $("#example-sentences-title").show();
    });
};