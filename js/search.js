let cognitoUser = userPool.getCurrentUser();

//Open Tab
$(function () {
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
        $("#words").attr('placeholder', 'Loading, please wait...');
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
                return '<a href="/html/use.html?lemma=' + result["lemma"] + '&pos=' + result["pos"] + '"><span class="text-pink font-weight-bold">' + result["lemma"] + ' </span><sup class="text-cyan font-weight-bold">' + result['pos'] + "</sup> <img src='/images/great-britain.png' width='20px' class='rounded-circle float-right'></a>";
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
                .fuzzyComplete(window.words, options).attr('placeholder', 'Lookup...')
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

    // Load History
    let history = localStorage.getItem('history');
    if (!!history) {
        history = JSON.parse(history);
    } else {
        history = [];
    }

    $("#history").prepend(
        new EliaUiWordsHistory(
            history
        ).html()
    );

    $('#history').mousewheel(function (e, delta) {
        this.scrollLeft -= (delta * 40);
    });

    $('#sign-out').on('click', function () {
        signOut();
    });

    chrome.storage.local.get(['mode'], function (result) {
        if (result.mode === "tool") {
            $('#modeCheck').bootstrapToggle('off');
        } else {
            $('#modeCheck').bootstrapToggle('on');
        }
    });

    $('#modeCheck').on('change', function () {
        if ($(this).is(':checked')) {
            chrome.storage.local.set({'mode': 'tutor'}, function () {
                console.log('Mode saved tutor');
            });
        } else {
            chrome.storage.local.set({'mode': 'tool'}, function () {
                console.log('Mode saved tool');
            });
        }

    });

    tippy('#sign-out', {
        theme: 'collocation',
        placement: 'bottom-end',
        interactive: false,
        allowHTML: true,
        content:
            `
           <b>Logout</b>
           `
    });

    tippy('#writing', {
        theme: 'collocation',
        placement: 'bottom-end',
        interactive: false,
        allowHTML: true,
        content:
            `
           <b>Writing,</b><br> evaluate your text
           `
    });

    tippy('#history-container', {
        theme: 'collocation',
        placement: 'top',
        interactive: false,
        allowHTML: true,
        content:
            `
           <b>Word history</b>
           `
    });

    tippy('#words', {
        theme: 'collocation',
        placement: 'top',
        interactive: false,
        allowHTML: true,
        content:
            `
           <b>Lookup a word</b>
           `
    });

    tippy('#mode', {
        theme: 'collocation',
        placement: 'bottom-start',
        interactive: false,
        allowHTML: true,
        content:
            `
            <b>Mode Tutor:</b></br>
            Proactively gives you suggestions
            <br><br>
            <b>Mode Tool:</b></br>
            Only react to what you ask for.
           `
    });

});