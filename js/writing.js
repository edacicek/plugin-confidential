let textarea = $("#user-text");
let notes = $("#notes");
let wordCounter = $("#wordCounter");
let copyText = $("#copyText");
let evaluation;
let wt_lp_wrt_t_Executed = false;
let wt_xx_wrt_z_Executed = false;
let wordSuggestions = new Set();
let collocationSuggestions;
let collocationSuggestionsIndex = [];
let collocationResponse;
let responses = [];
let dictionary = new Typo("en_US", false, false, { dictionaryPath: "js/libs/dictionaries" });
let checking_spell = false;

$(function () {
    // Load saved user text
    textarea.text(localStorage.getItem("text"));

    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('selection')) {
        textarea.text(searchParams.get('selection').toString());
        localStorage.setItem("text", searchParams.get('selection').toString());
    }

    // Load suggested words
    wordSuggestions = new Set(JSON.parse(localStorage.getItem("suggestedWords") || '[]'));

    // Initial word count
    let words = countWords(textarea.text());
    if(words > 0) {
        wt_lp_wrt_t_Executed = true;
        // $("#wordStack").show(500);
        showWordSuggestions();
    } else {
         // $("#wordStack").hide();
    }

    if(words > 20) {
        wt_xx_wrt_z_Executed = true;
    }
    wordCounter.html(words);

    // Elia helper injection
    injectEliaInputHelper(textarea);
    
    // Copy text function 
    copyText.on("click", function () {
        copyToClipboard(textarea);
    });

    $("#buttonNext").hide();

});

let countWords = function(text){
    let wom = text.match(/\S+/g);
    return wom ? wom.length : 0
};

let clean = function (nextFunction) {
    // Clean the information
    $("#helperInfo").html("");
    $("#helperContent").html("");
    $("#buttonNext").hide();
};

let injectEliaInputHelper = function (input) {
    // Get the current html form the original input
    let originalInput = input.prop('outerHTML');

    // Create Elia Helper
    let helper = eliaHelper(originalInput);
    let newInput = $.parseHTML(helper);

    // Replace original html element with the helper one
    input.replaceWith(newInput);
    textarea = $("#user-text");


    // Bind a function to save user text
    textarea.on('input keyup change', function (event) {

        if(event.type === 'keyup' && event.key === " " && checking_spell === false) {
            checking_spell = true;
            textarea.unmark();
            // Work around for spell checking
            setTimeout(function () {
                textarea.text().slice(0, textarea.text().lastIndexOf(" ")).split(/[ ,.]+/).forEach(function (word) {
                    wt_05_wrt_e(word);
                });
                setTimeout(function () {
                    checking_spell = false;
                },1000);
            },1000);
        }

        if(event.type === 'keyup' && event.key === " ") {
            let lastWord = textarea.text().split(" ").splice(-1).toString();
            lastWord = lastWord.trim();
            if(collocationSuggestionsIndex.includes(lastWord)){
                // Show the response information
                $("#helperInfo").html(collocationResponse.info);
                // Show the response content
                collocationSuggestions.forEach(function(collocate) {
                let source =`
                  <div class="row-12">
                     <div class="col-12 align-self-center" style="padding: 0 !important;">
                        <div class="text-content history-container" id="history">
                            <button class="btn btn-outline-light btn-sm" disabled>
                                <span class="text-cyan font-weight-bold">
                                     ${collocate.collocate_position == 1? collocate.collocate_POS : ""}
                                </span>
                                <span class="text-danger font-weight-bold">
                                     ${collocate.target_word.lemma}
                                </span>
                                <span class="text-cyan font-weight-bold">
                                     ${collocate.collocate_position == 2? collocate.collocate_POS : ""}
                                </span>
                            </button>
                            `;

                collocate.collocate_words.forEach(function(word) {
                source = source +  `                          
                            <button class="btn btn-outline-light btn-sm" disabled>
                                <span class="text-danger font-weight-bold">
                                     ${collocate.collocate_position == 2? collocate.target_word.lemma : ""}
                                </span>
                                <span class="text-dark">
                                     ${word.lemma}
                                </span>
                                <span class="text-danger font-weight-bold">
                                     ${collocate.collocate_position == 1? collocate.target_word.lemma: ""}
                                </span>
                            </button>
                            `;
                });

                source = source + `
                        </div>
                    </div>
                </div>
                `;

                $("#helperContent").append(source);
                });
            }
        }
        // Word counting
        let words = countWords($(this).text());
        wordCounter.html(words);

        // Suggest words
        if(words >= 10 && !wt_lp_wrt_t_Executed) {
            wt_lp_wrt_t();
        }

        if(words >= 20 && !wt_xx_wrt_z_Executed && wt_lp_wrt_t_Executed) {
            wt_xx_wrt_z();
        }

        // Check collocate suggestion


        // Cross suggested words
        if(wt_lp_wrt_t_Executed) {
            showWordSuggestions();
        }

        // Check if essay is empty
        if(words === 0) {
            wt_lp_wrt_t_Executed = false;
            wt_xx_wrt_z_Executed = false;
            wordSuggestions = new Set();
            showWordSuggestions();
            localStorage.setItem("suggestedWords", JSON.stringify(Array.from(wordSuggestions)));
            clean();
        }

        // Saving the user text
        localStorage.setItem("text", $(this).text());
    });

    enableSearch();

    // Bind onclick function
    $("#buttonEliaHelper").on("click", function () {
        // TODO
    });

    $("#search").hide();
    $("#search-button").on("click", function () {
       $("#search").toggle(500);
       $("#notes-frame").hide(500);
       $("#feedback-frame").hide(500);
    });
    $("#notes-button").on("click", function () {
       $("#notes-frame").toggle(500);
       $("#search").hide(500);
       $("#feedback-frame").hide(500);
    });

    $("#feedback-button").on("click", function () {
       $("#feedback-frame").toggle(500);
       $("#search").hide(500);
       $("#notes-frame").hide(500);
    });

    $("#notes-frame").hide();
    $("#feedback-frame").hide();

    notes = $("#notes");
    notes.text(localStorage.getItem("notes"));
    notes.on('input keyup change', function () {
        // Saving the user text
        localStorage.setItem("notes", $(this).text());
    });

    evaluation = $("#evaluation-button");
    evaluation.on("click", function () {
        wt_40_wrt_v();
    });

    getResponse(3).then(function (response) {
       //Collocation suggestion
       collocationResponse = response;
       collocationSuggestions = response.collocationsList;
       collocationSuggestions.forEach(function (collocation) {
           collocationSuggestionsIndex.push(collocation.target_word.lemma.toString());
       });
    });
};

let enableSearch = function() {
    loadBinaryFile('/db/words.db', function (data) {
        let uInt8Array = new Uint8Array(data);
        window.initSqlJs({
        locateFile: filename => `/js/libs/${filename}`
        }).then(function (SQL) {
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
                return '<a href="/html/meaning.html?lemma=' + result["lemma"] + '&pos=' + result["pos"] + '"><span class="text-pink font-weight-bold">' + result["lemma"] + ' </span><sup class="text-cyan font-weight-bold">' + result['pos'] + "</sup></a>";
            };
            let displayValueFunction = function (result, id) {
                return result["lemma"] // + ' - ' + result['pos'];
            };
            let options = {
                display: displayFunction,
                displayValue: displayValueFunction,
                key: "key",
                resultsLimit: 7,
                fuseOptions: fuseOptions
            };
            $("#words")
                .fuzzyComplete(window.words, options).attr('placeholder', 'Search a word...')
                .on("keydown", function (event) {
                    if (event.key === "Enter") {
                        let selected_item = $(".fuzzyResults")
                            .find('.selected')
                            .first()[0].innerText
                            .split(" ");
                        window.location.href = '/html/meaning.html?lemma=' + selected_item[0] + '&pos=' + selected_item[1];
                    }
                });
        }, 5);
    });
};

let eliaHelper = function (original) {
    let helper;
    helper = `
        <div class="w-100">
            <div class="row">
                <div class="col-7">
                    <div class="border border-secondary rounded">${original}</div>
                </div>
                <div class="col-5">
                    <div class="p-2 border rounded text-footer scrollable">
                        <div class="row">
                            <div class="col-12">
                                <button class="btn btn-sm btn-outline-danger border-0 m-1" id="buttonEliaHelper" disabled>
                                    <i class="fas fa-circle mt-1"></i>
                                </button>
                                <button class="btn btn-dark btn-sm rounded-circle m-1 float-right" id="search-button"><i class="fas fa-search"></i></i></button>
                                <button class="btn btn-dark btn-sm rounded-circle m-1 float-right" id="evaluation-button"><i class="fa fa-check-circle"></i></button>
                                <div class="input-group input-group-sm" id="search">
                                    <input type="text" class="form-control" id="words" autocomplete="off" placeholder="Search a word...">
                                </div>
                            </div>
                        </div>
                        <div class="row" id="helper">
                            <div class="col-12 mt-3" id="helperInfo">
                            </div>
                            <div class="col-12 mt-3" id="helperContent">
                            </div>
                            <div class="col-12" id="notes-frame">
                                Notes:
                                <div class="col-12 mt-3 border border-secondary rounded pt-2 pb-2" style="height: 8rem; background: #fffef2" id="notes" contenteditable="true">
                                </div>
                            </div>
                            <div class="col-12" id="feedback-frame">
                                Send feedback to Elia team:
                                <div class="col-12 mt-3 border border-secondary rounded pt-2 pb-2" style="height: 6rem; background: #f6ffff" id="feedback" contenteditable="true">
                                </div>
                                <button class="btn btn-sm btn-outline-secondary mt-1 float-right">Send Feedback</button>
                            </div>
                        </div>
                        <div class="row" id="next">
                            <div class="col-12 mt-3 text-center">
                                <button id="buttonNext" type="button" class="btn btn-dark btn-sm next-button">
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     `;
    return helper;
};


let getResponse = async function(index) {
    let helper = $("#buttonEliaHelper");

    // Show the spinner
    helper.html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>');
    let response = {};
    let data;
    switch (index) {
        case 0:
            data = await  $.ajax({
                    timeout: 30000,
                    method: "POST",
                    url: 'https://maya.meetelia.com/wt_xx_wrt'
                });
            response.id = "WT.LP.WRT.T";
            response.info = "Try to use some of the new words that you recently learn. It will help you to remember them.";
            response.wordList = data[0];
            break;
        case 1:
            data = await  $.ajax({
                timeout: 30000,
                method: "POST",
                data: {
                    "user_id":  1,
                    "text": textarea.text()
                },
                url: 'https://maya.meetelia.com/xx_ev_pro'
            });
            response = data[0];
            break;
        case 2:
            response.id = "WT.XC.WRT.E";
            response.errors = [
              {
                "error_found": "Yes",
                "detected_error": "entomology",
                "detected_error_headword": "department",
                "correction_found": "No",
                "correction_list": [

                ]
              },
              {
                "error_found": "Yes",
                "detected_error": "department",
                "detected_error_headword": "entomology",
                "correction_found": "No",
                "correction_list": [

                ]
              },
              {
                "error_found": "Yes",
                "detected_error": "zoology",
                "detected_error_headword": "building",
                "correction_found": "No",
                "correction_list": [

                ]
              },
              {
                "error_found": "Yes",
                "detected_error": "building",
                "detected_error_headword": "zoology",
                "correction_found": "No",
                "correction_list": [

                ]
              },
              {
                "error_found": "Yes",
                "detected_error": "last",
                "detected_error_headword": "department",
                "correction_found": "No",
                "correction_list": [

                ]
              },
              {
                "error_found": "Yes",
                "detected_error": "department",
                "detected_error_headword": "last",
                "correction_found": "No",
                "correction_list": [

                ]
              }
            ];
            break;
        case 3:
            data = await  $.ajax({
                timeout: 30000,
                method: "POST",
                url: 'https://maya.meetelia.com/wt_xx_wrt'
            });
            response.id = "WT.XC.WRT.G";
            response.info = "Because it´s you, here some help!";
            response.collocationsList = data[1];
            break;
    }
    helper.html('<i class="fas fa-circle mt-1"></i>');
    return response;
};

let wt_lp_wrt_t = async function () {
    let buttonNext = $("#buttonNext");
    getResponse(0).then(function (response) {
        // Show the response information
        $("#helperInfo").html(response.info);
        // Show the response content
        $("#helperContent").html("");
        /* response.wordList.forEach(function (word) {
            $("#helperContent").append(
                new EliaUiWord(word.lemma, word.pos).html()
            );
        }); */
        response.wordList.forEach(function (word) {
            wordSuggestions.add(word.lemma);
        });
        localStorage.setItem("suggestedWords", JSON.stringify(Array.from(wordSuggestions)));
        showWordSuggestions();
        buttonNext.show(300);
        wt_lp_wrt_t_Executed = true;
        buttonNext.on("click", function () {
            clean(function () {
                wt_lp_wrt_t_Executed = true;
            });
        });
    });
};

let wt_xx_wrt_z = async function() {
    wt_xx_wrt_z_Executed = true;
    let buttonNext = $("#buttonNext");
    buttonNext.hide();
    getResponse(1).then(function (response) {
        // Show the response information
        $("#helperInfo").html("You are not sure or have doubts? Check it in the Elia dictonary.");
        // Show the response content
        $("#helperContent").html(`
            <div class="row">
                <div class="col text-center">
                <button class="btn btn-sm btn-outline-primary" id="wt_xx_wrt_z_yes">
                    Yes, please.
                </button>
                </div>
             </div>
             <div class="row mt-2">
                <div class="col text-center">
                <button class="btn btn-sm btn-outline-secondary" id="wt_xx_wrt_z_no">
                    No, thanks. I´m good.
                </button>
                </div>
            </div>
        `);
        let buttonNo= $("#wt_xx_wrt_z_no");
        let buttonYes= $("#wt_xx_wrt_z_yes");
        buttonNo.on("click", function () {
            clean(function () {});
        });
        buttonYes.on("click", function () {
            clean(function () {});
            $("#search").show(500);
        });
    });
};

let wt_40_wrt_v = function(response) {
    clean(function () {});
    getResponse(1).then(function (response) {
        // Show the response information
        $("#helperInfo").html("FEEDBACK");
        response.positive.forEach(function (feedbackSentence) {
            $("#helperContent").append(
                new EliaUiPositiveFeedbackSentence(feedbackSentence).html()
            );
        });
        response.negative.forEach(function (feedbackSentence) {
            $("#helperContent").append(
                new EliaUiNegativeFeedbackSentence(feedbackSentence).html()
            );
        });
        let buttonNext = $("#buttonNext");
        buttonNext.show(300);
        buttonNext.on("click", function () {
            clean(function () {
            });
        });
    });
};

let wt_05_wrt_e = function(word){
  let is_spelled_correctly = dictionary.check(word);
  if (!is_spelled_correctly) {
      //return dictionary.suggest(word);
      let classId = "_"+  Math.random().toString(36).substr(2, 5);
      textarea.mark(word, {
         "className": "mark " + classId,
         "separateWordSearch": true
      });
      let suggest = dictionary.suggest(word, 5);
      let suggestHtml = "";
      suggest.forEach(function (suggestWord) {
          suggestHtml =  suggestHtml + suggestWord + "<br>"
      });
      $("." + classId).tooltip({
          title: suggestHtml,
          placement: "auto",
          interactive: true,
          html:true}
          )
  }
};

let wt_xc_wrt_e = function(response) {
    // Show the response information
    $("#helperInfo").html("Collocations Errors");
    for(let i = 0; i<response.errors.length; i=i+2) {
        textarea.mark(response.errors[i].detected_error + " " + response.errors[i+1].detected_error, {
            "className": "mark-5",
            "separateWordSearch": false
        });
    }
    nextFunctions[currentResponse] = function(){
        clean(function () {});
    };
};


let showWordSuggestions = function () {
    let userText = textarea.text();
    $("#wordStack").html("");
    wordSuggestions.forEach(function (word) {
        if (userText.includes(word)) {
            $("#wordStack").append(
                new EliaUiWordCross(word, "").html()
            );
        } else {
            $("#wordStack").append(
                new EliaUiWord(word, "").html()
            );
        }
    });
};
