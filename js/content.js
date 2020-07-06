//create iframe, only change width or height of the popup here to adjust everywhere
const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 450;
let iframe = document.createElement('iframe');
iframe.style.display = 'none';
let showingPopup = false;
let mode = "tutor";
let shadow = false;

function getSelectedText(event) {
    try {
        chrome.storage.local.get(['mode'], function (result) {
            if (result.mode !== undefined) {
                mode = result.mode;
            }
            let text_selection = (document.all) ? document.selection.createRange().text : document.getSelection();
            if (text_selection.type === "Range" && !showingPopup && (1 > text_selection.toString().split(" ").length - 1) && mode === "tutor") {
                showingPopup = true;
                word = text_selection.toString();
                context = text_selection.extentNode.parentElement.parentElement.innerText;
                raw_text = text_selection.baseNode.textContent;
                text = raw_text.slice(0, text_selection.getRangeAt(0).startOffset) + "{" + raw_text.slice(text_selection.getRangeAt(0).startOffset);
                text = text.slice(0, text_selection.getRangeAt(0).endOffset + 1) + "}" + text.slice(text_selection.getRangeAt(0).endOffset + 1);

                //get position of selection
                let coords = document.getSelection().getRangeAt(0).getBoundingClientRect();

                //get viewport size
                let inner_width = window.innerWidth;
                let inner_height = window.innerHeight;

                //get coordinates of the bounding box of selection
                let bottom = coords.bottom + window.scrollY;
                let right = coords.right + window.scrollX;

                //initialize coordinates of the popup
                let topPopup;
                let leftPopup;

                //check which quarter of the viewport thst the selection is in and set popup position
                if (right <= inner_width / 2 && bottom <= inner_height / 2) {
                    topPopup = bottom;
                    leftPopup = right;
                } else if (right <= inner_width / 2 && bottom >= inner_height / 2) {
                    topPopup = bottom - POPUP_HEIGHT;
                    if (topPopup < 0) topPopup = 0;
                    leftPopup = right;
                } else if (right >= inner_width / 2 && bottom <= inner_height / 2) {
                    topPopup = bottom;
                    leftPopup = right - coords.width - POPUP_WIDTH;
                    if (leftPopup < 0) leftPopup = 0;
                } else if (right >= inner_width / 2 && bottom >= inner_height / 2) {
                    topPopup = bottom - POPUP_HEIGHT;
                    if (topPopup < 0) topPopup = 0;
                    leftPopup = right - coords.width - POPUP_WIDTH;
                    if (leftPopup < 0) leftPopup = 0;
                }

                //if popup overflows the viewport, reposition it
                if (topPopup + POPUP_HEIGHT > inner_height) topPopup = inner_height - POPUP_HEIGHT;

                if (typeof chrome.app.isInstalled !== 'undefined') {
                    chrome.runtime.sendMessage({'selectionText': word, 'query': text});
                    iframe.src = chrome.runtime.getURL("html/pop.html?selection=" + word + '&query=' + text);
                    iframe.id = "iframe";
                    $(iframe).appendTo("body");
                    $(iframe).css("top", bottom.toString() + "px");
                    $(iframe).css("left", right.toString() - 130 + "px");
                    $(iframe).css("display", "block");
                    $(iframe).addClass("iframe-full");
                    $(iframe).removeClass("iframe-shadow");
                    $(iframe).off();
                    shadow = false;
                    $(iframe).on("load", function () {
                        if (shadow) {
                            $(iframe).addClass("iframe-shadow");
                        } else {
                            shadow = true;
                        }
                    })
                }
            } else if (mode === "tutor") {
                hideOnClickOutside(iframe);
                showingPopup = false;
            }
        });

    } catch (e) {

    }
}

function hideOnClickOutside(element) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && isVisible(element) && !showingPopup) {
            element.style.display = 'none';
            removeClickListener()
        }
    };
    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    };
    document.addEventListener('click', outsideClickListener)
}

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

document.onmousedown = getSelectedText;


if (document.body !== null) {
    chrome.storage.local.get(['mode'], function (result) {
        if (result.mode !== undefined) {
            mode = result.mode;
        }
        if (mode === "tutor") {
            $(function () {
                let pageText = $("p").text(); // Getting all the text from paragraphs
                $.ajax({
                    timeout: 30000,
                    method: "POST",
                    data: {
                        "text": pageText
                    },
                    url: 'https://maya.meetelia.com/wt_xx_rdn'
                }).done(function (data, textStatus, jqXHR) {
                    let colocatePartOne = data[3][0][0];
                    let colocatePartTwo = data[3][0][1];
                    let context = data[3][0][2];
                    let contextSelector = highlightOnBody(context, "text-decoration", "underline dotted #6949F6");
                    let colocatePartOneSelector = highlightOnBodyContext(colocatePartOne.form, "background", "#6949F6", context);
                    colocatePartOneSelector.css("color", "#fefefe");
                    let colocatePartTwoSelector = highlightOnBodyContext(colocatePartTwo.form, "background", "#6949F6", context);
                    colocatePartTwoSelector.css("color", "#fefefe");
                    tippy('.' + contextSelector.attr('class'), {
                        theme: 'collocation',
                        placement: 'auto',
                        interactive: false,
                        lazy: true,
                        onShow(instance) {
                            instance.setContent(`<span style="color:#DC3758;font-weight:bold">Check this out!</span><br><hr><br>
                          The word <b>${eliaWord(colocatePartOne.lemma, colocatePartOne.pos)}</b> which you recently learnt usually occurs with <b>${eliaWord(colocatePartTwo.lemma, colocatePartTwo.pos)}</b> highlited in the text.
                          <br><br><hr>
                          <img src=${eliaIcon()} height="15" width="15" alt="icon"> <small>Elia plugin</small>
                        `);
                        }
                    });

                    // Highlight words
                    for (let i = data[0].length - 1; i >= 0; i--) {
                        let wordSelector = highlightOnBodyContext(data[0][i].form, "background", "#00C78C", data[1][i]);
                        if (wordSelector.attr('class') !== undefined) {
                            wordSelector.css("color", "#fefefe");
                            let instance = tippy('.' + wordSelector.attr('class'), {
                                theme: 'collocation',
                                placement: 'auto',
                                interactive: true,
                                lazy: true,
                                onShow(instance) {
                                    instance.setContent(`<span style="color:#DC3758;font-weight:bold">${data[2][i]}</span><br><hr><br>
                                    <button class="elia_question" id="eliaQ0">I have <b>no idea</b> what it means</button><br>
                                    <button class="elia_question" id="eliaQ1">I have <b>a vague idea</b> what it means</button><br>
                                    <button class="elia_question" id="eliaQ2">I <b>know</b> what it means</button><br>
                                    <button class="elia_question" id="eliaQ3"><b>I can use</b> the word in witting</button><br>
                                    <br><hr>
                                    <img src=${eliaIcon()} height="15" width="15" alt="icon"> <small>Elia plugin</small>
                                `);
                                },
                                onShown(instance) {
                                    $("#eliaQ0").on("click", function () {
                                        console.log(instance.reference.id);
                                        instance.disable();
                                    });
                                    $("#eliaQ1").on("click", function () {
                                        console.log(instance.reference.id);
                                        instance.disable();
                                    });
                                    $("#eliaQ2").on("click", function () {
                                        console.log(instance.reference.id);
                                        instance.disable();
                                    });
                                    $("#eliaQ3").on("click", function () {
                                        console.log(instance.reference.id);
                                        instance.disable();
                                    });
                                }
                            });
                        }
                    }
                }).then(r => {

                });
            });
        }
    });
}

let highlightOnBody = function (text, propertyName, valueFunction) {
    let regularExpresion = new RegExp(text, 'g');
    let classId = "eliaword-" + Math.round(Math.random() * 10000)
    let replacement = '<span class="' + classId + '">' + text + '</span>';
    let textSelector = $("p:contains(" + text + ")");
    if (textSelector.length === 0) {
        return textSelector;
    }
    textSelector.html(textSelector.html().replace(regularExpresion, replacement));
    let eliaWordSelector = $("." + classId);
    eliaWordSelector.css(propertyName, valueFunction);
    return eliaWordSelector;
};

let highlightOnBodyContext = function (word, propertyName, valueFunction, context) {
    let patternL = context.substr(context.indexOf(word) - 1, 1);
    let patternR = context.substr(context.indexOf(word) + word.length, 1);
    let classId = "eliaword-" + Math.round(Math.random() * 10000);
    let replacement = '<span class="' + classId + '">' + word + '</span>';
    let textSelector = $("p:contains(" + context + ")");
    if (textSelector.length === 0) {
        return textSelector;
    }
    textSelector.html(textSelector.html().replace(patternL + word + patternR, patternL + replacement + patternR));
    let eliaWordSelector = $("." + classId);
    eliaWordSelector.css(propertyName, valueFunction);
    return eliaWordSelector;
};


let eliaIcon = function () {
    let src = "data:image/png;base64,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";
    return src;
};

let eliaWord = function (lemma, pos) {
    return `
       <button style="margin:0.1rem;padding:0.3rem;background:#fefefe;border-radius:0.2rem;border:1px solid #e6e5e5;">
           <span style="color:#DC3758;font-weight:bold">
                ${lemma}
           </span>
           <sup style="color:#00C78C;font-weight:bold">
                <small>${pos}</small>
           </sup>
       </button>
   `;
}