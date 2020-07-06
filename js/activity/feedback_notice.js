let gif = $("#gif_image");
gif.hide();

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");


//Open Tab
$(function() {

    feedback_notice(getCurrentPage());

    $("#next").on("click", function() {
        tracking(status="end","","", "", gotoNextPage);
    });
});


let feedback_notice = function(response) {
    tracking(status="started","","", response.RES_XX_id);
    let information = $("#information");
    let instruction1 = $("#instruction-1");
    $("#word").prepend(response.RES_XW_word.lemma);
    $("#headline").prepend(response.RES_XX_headline);
    instruction1.prepend(response.RES_XX_instruction1);

    switch(response.RES_XX_id){
        case "WT.36.PRO.N":
            response.PER_36_FamilyMember.forEach(function(word) {
              information.append(
                    new EliaUiWordFamily(
                        word.lemma,
                        word.pos
                    ).html()
                );
            });
            break;
        case "WT.37.PRO.N":
            response.PER_37_FalseFriend.forEach(function(word) {
              information.append(
                    new EliaUiFalseFriend(
                        word.lemma,
                        word.language
                    ).html()
                );
            });
            break;
        case "WT.38.PRO.N":
            response.PER_38_Cognate.forEach(function(word) {
              information.append(
                    new EliaUiCognate(
                        word.lemma,
                        word.language
                    ).html()
                );
            });
            break;
        case "WT.39.PRO.N":
            response.PER_39_Sentence.forEach(function(sentence) {
              information.append(
                    new EliaUiExampleSentence(
                        response.RES_XW_word.lemma,
                        sentence
                    ).html()
                );
            });
            break;
        case "WT.29.PRO.N":
          information.append(
                new EliaUiWordFamily(
                    response.RAW_01_Lemma,
                    response.RAW_02_Pos
                ).html()
            );
            break;
        case "WT.46.PRO.N":
          information.append(
                new EliaUiHeterograph(
                    response.RES_XW_word,
                    response.PER_46_Heterograph,
                    response.RAW_06_Transcript
                ).html()
            );
            break;
        case "WT.47.PRO.N":
          information.append(
                new EliaUiHeteronym(
                    response.RES_XW_word,
                    response.RAW_06_Transcript,
                    response.PER_47_Heteronym,
                    response.X47_06_Transcript,
                ).html()
            );
            break;
        case "WT.48.PRO.N":
          information.append(
                new EliaUiFalseFriend(
                    response.PER_48_Synform.lemma,
                    response.PER_48_Synform.pos
                ).html()
            );
            break;
        case "WT.49.PRO.N":
          information.append(
                new EliaUiSynphone(
                    response.RES_XW_word,
                    response.RAW_06_Transcript,
                    response.PER_49_Synphone,
                    response.X49_06_Transcript,
                ).html()
            );
            break;
        case "WT.60.PRO.N":
            gif.attr("src", "/images/gifs/ok_" + getRandomInt(1, 2) + ".gif");
            gif.show();
            instruction1.html(response.RES_XX_instruction1.replace(
                response.RAW_60_Domain,
                '<b class="text-cyan">' + response.RAW_60_Domain + '</b>'
            ));
            break;
        case "WT.61.PRO.N":
            gif.attr("src", "/images/gifs/check_it_out_" + getRandomInt(1, 1) + ".gif");
            gif.show();
            information.html(new EliaUiSentencePattern(response.RAW_61_Pattern, response.RAW_39_Sentence).html());
            break;
        case "WT.56.PRO.N.56X":
            gif.attr("src", "/images/gifs/check_it_out_" + getRandomInt(1, 1) + ".gif");
            gif.show();
            information.html(new EliaUiSentencePattern(response.RAW_56_CollocateForm, response.RAW_39_Sentence).html());
            break;
        case "WT.55.PRO.N":
            gif.attr("src", "/images/gifs/check_it_out_" + getRandomInt(1, 1) + ".gif");
            gif.show();
            information.html(new EliaUiSentencePattern(response.RAW_55_ColocateIndex, response.RAW_39_Sentence).html());
            break;
        case "WT.39.PRO.N.39R":
            gif.attr("src", "/images/gifs/check_it_out_" + getRandomInt(1, 1) + ".gif");
            gif.show();
            instruction1.html(response.RES_XX_instruction1);
            response.RAW_39_Sentence.forEach(function(example) {
                information.append(
                    EliaUiExampleSentence(
                        response.RES_XW_word,
                        example
                    ).html()
                );
            });
            break;
    }
};