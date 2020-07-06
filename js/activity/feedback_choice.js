// Randomize the buttons
let buttons = ['1', '2', '3'];
shuffleArray(buttons);

// JQuery Selector
let correct1 = $("#button" + buttons[0]);
let distract1 = $("#button" + buttons[1]);
let distract2 = $("#button" + buttons[2]);
let next = $("#next");
let gif = $("#gif");
let instruction_1 = $("#instruction-1");
let extra_1 = $("#extra-1");
let response;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");

// Onload Function
$(function() {
    gif.hide();
    next.hide();

    // Create the current page
    response = getCurrentPage();
    feedback_choice();

    // Setup buttons
    correct1.on("click", function() {
        tracking(status="answered", "['"+correct1.text().trim().replace(/\s+/g, "_")+"']", "", "");
        correct();
    });
    distract1.on("click", function() {
        tracking(status="answered", "['"+distract1.text().trim().replace(/\s+/g, "_")+"']", "", "");
        incorrect(distract2);
    });
    distract2.on("click", function() {
        tracking(status="answered", "['"+distract2.text().trim().replace(/\s+/g, "_")+"']", "", "");
        incorrect(distract1);
    });
    next.on("click", function() {
        tracking(status="end","","", "", gotoNextPage);
    });
});

let correct = function() {
    switch(response.RES_XX_id) {
        case "WT.24.PRO.C":
            $("#instruction-2").prepend(response.RES_XX_instruction2);
            response.PER_53_AffixRelative .forEach(function(relative) {
              $("#feedback-information").append(new EliaUiWord(relative.lemma, relative.pos).html());
            });
            break;
        case "WT.64.PRO.C":
            $("#extra-1-info").val(response.RAW_64_TagGram);
            break;
    }
    correct1.toggleClass('btn-outline-success');
    correct1.append('<i class="fas fa-check-circle float-right mt-1"></i>');
    distract1.hide();
    distract2.hide();
    gif.show();
    next.show();
    correct1.prop('disabled', true);
    distract1.prop('disabled', true);
    distract2.prop('disabled', true);
    tracking(status="feedback","","correct", "");
};

let incorrect = function(other) {
    switch(response.RES_XX_id) {
        case "WT.24.PRO.C":
            $("#instruction-2").prepend(response.RES_XX_instruction2);
            response.PER_53_AffixRelative.forEach(function(relative) {
              $("#feedback-information").append(new EliaUiWord(relative.lemma, relative.pos).html());
            });
            break;
        case "WT.55.PRO.C":
            $("#instruction-2").append(response.RES_XX_NegativeFeedback);
    }
    correct1.toggleClass('btn-outline-success');
    correct1.append('<i class="fas fa-check-circle float-right mt-1"></i>');
    distract1.toggleClass('btn-outline-danger');
    distract1.append('<i class="fas fa-times-circle float-right mt-1"></i>');
    distract2.toggleClass('btn-outline-danger');
    distract2.append('<i class="fas fa-times-circle float-right mt-1"></i>');
    next.show();
    other.hide();
    correct1.prop('disabled', true);
    distract1.prop('disabled', true);
    distract2.prop('disabled', true);
    tracking(status="feedback","","incorrect", "");
};

let feedback_choice = function() {
    tracking(status="started","","", response.RES_XX_id);
    $("#word").prepend(response.RES_XW_word.lemma);
    $("#headline").prepend(response.RES_XX_headline);
    instruction_1.prepend(response.RES_XX_instruction1);
    let image = Math.floor(Math.random() * 9) + 1;
    $("#gif_image").attr("src","/images/gifs/thats_right_"+ image +".gif");

    switch(response.RES_XX_id){
        case "WT.02.PRO.C":
        case "WT.02.PRO.C.D54":
            correct1.html(response.RAW_02_Pos);
            distract1.html(response.RAW_54_ConfusingPos);
            distract2.hide();
            break;
        case "WT.08.PRO.C":
            correct1.html(response.MAX_08_definition);
            distract1.html(response.DIS_08_definition.pop());
            distract2.html(response.DIS_08_definition.pop());
            break;
        case "WT.10.PRO.C":
            let option1 = response.MAX_10_Translation;
            let option2 = response.DIS_10_Translation.pop();
            let option3 = response.DIS_10_Translation.pop();
            correct1.html(new EliaUiTranslationLabel(option1.lemma, option1.language).html());
            distract1.html(new EliaUiTranslationLabel(option2.lemma, option2.language).html());
            distract2.html(new EliaUiTranslationLabel(option3.lemma, option3.language).html());
            break;
        case "WT.10.PRO.C.D37":
            let option11 = response.MAX_10_Translation;
            let option12 = response.DIS_10_Translation;
            let option13 = response.PER_37_FalsFriend;
            correct1.html(new EliaUiTranslationLabel(option11.lemma, option11.language).html());
            distract1.html(new EliaUiTranslationLabel(option12.lemma, option12.language).html());
            distract2.html(new EliaUiTranslationLabel(option13.lemma, option13.language).html());
            break;
        case "WT.11.PRO.C":
            correct1.html(response.MAX_11_Synonym);
            distract1.html(response.DIS_11_Synonym.pop());
            distract2.html(response.DIS_11_Synonym.pop());
            break;
        case "WT.24.PRO.C":
            correct1.html(response.RAW_XA_Affix.definition);
            distract1.html(response.DIS_24_AffixDefinition.pop());
            distract2.html(response.DIS_24_AffixDefinition.pop());
            instruction_1.html(
                instruction_1.html().replace(
                    response.RAW_XA_Affix.text,
                    '<b>' + response.RAW_XA_Affix.text + '</b>'
                )
            );
            break;
        case "WT.55.PRO.C":
            correct1.html(response.RAW_55_Collocate);
            distract1.html(response.DIS_55_Collocate.pop());
            distract2.html(response.DIS_55_Collocate.pop());
            instruction_1.html(
                instruction_1.html().replace(
                    response.RAW_55_ColocateTypePos,
                    '<b class="text-cyan">'+ response.RAW_55_ColocateTypePos+'</b>'
                )
            );
            break;
        case "WT.56.PRO.C":
            correct1.html(response.RAW_56_CollocateForm);
            distract1.html(response.DIS_55_Collocate.pop());
            distract2.html(response.DIS_55_Collocate.pop());
            instruction_1.html(
                instruction_1.html().replace(
                    "NOT",
                    '<b> NOT </b>'
                )
            );
            break;
        case "WT.56.PRO.C.K57":
            correct1.html(response.RAW_56_CollocateForm);
            distract1.html(response.RAW_57_CollocateFalseFriend.pop());
            distract2.html(response.RAW_57_CollocateFalseFriend.pop());
            instruction_1.html(
                instruction_1.html().replace(
                    "NOT",
                    '<b> NOT </b>'
                )
            );
            break;
        case "WT.56.PRO.C.K58":
            correct1.html(response.RAW_56_CollocateForm);
            distract1.html(response.RAW_58_ConfusingCollocate.pop());
            distract2.html(response.RAW_58_ConfusingCollocate.pop());
            distract2.hide();
            instruction_1.html(
                instruction_1.html().replace(
                    "NOT",
                    '<b> NOT </b>'
                )
            );
            break;
        case "WT.64.PRO.C":
            correct1.html(response.RAW_64_TagGram);
            distract1.html(response.DIS_64_TagGram.pop());
            distract2.html(response.DIS_64_TagGram.pop());
            extra_1.html(`
               <div class="row">
                   <div class="col-4 text-right">
                       <div class="text-primary font-weight-bold">
                            ${response.RAW_61_PatternPart1}
                       </div>
                   </div> 
                   <div class="col-4">
                        <input type="text" class="form-control input-sm" id="extra-1-info" disabled>
                   </div>
                   <div class="col-4 text-left">
                       <div class="text-primary font-weight-bold">
                            ${response.RAW_61_PatternPart2}
                       </div>
                   </div> 
               </div>
            `);
            break;
        case "WT.55.PRO.O":
            correct1.html(response.DIS_55_Collocate);
            distract1.html(response.RAW_55_Collocate.pop());
            distract2.html(response.RAW_55_Collocate.pop());
            instruction_1.html(
                instruction_1.html().replace(
                    response.RAW_55_ColocateTypePos,
                    '<b class="text-cyan">'+ response.RAW_55_ColocateTypePos+'</b>'
                )
            );
            break;
        case "WT.56.PRO.O":
            correct1.html(response.DIS_55_CollocateForm);
            distract1.html(response.RAW_55_CollocateForm.pop());
            distract2.html(response.RAW_55_CollocateForm.pop());
            break;
    }
};