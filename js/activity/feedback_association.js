//Open Tab
let corrects = [];
let validated = false;
let answer = $("#answer");
let gif = $("#gif_image");
let instruction_1 = $("#instruction-1");
gif.hide();
let response;
let feedback_information;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});

$("#footer").load("/html/footer.html");

$(function() {

    response = getCurrentPage();
    feedback_association();

    answer.on("keydown", function(event){
        if(event.key === "Enter") {
            $("#next").trigger( "click");
        }
    });

    $("#next").on("click", function() {
        if (validated) {
            tracking(status="end","","", "", gotoNextPage);
        } else {
            tracking(status="answered", "['"+answer.val().toLowerCase()+"']","", "");
            if(corrects.toLocaleString().toLowerCase().split(',').includes(answer.val().toLowerCase())) {
                $("#answer_status").html('<i class="fas fa-check-circle float-right text-success"></i>');
                let image = Math.floor(Math.random() * 9) + 1;
                gif.attr("src","/images/gifs/thats_right_"+ image +".gif");
                gif.show();
                tracking(status="feedback","","correct", "");
            } else {
                $("#answer_status").html('<i class="fas fa-times-circle float-right text-danger"></i>');
                $("#feedback-negative").prepend(response.RES_XX_NegativeFeedback);
                tracking(status="feedback", "","incorrect", "");
                switch(response.RES_XX_id){
                    case "WT.10.PRO.A":
                        feedback_information.forEach(function(word) {
                          $("#feedback-information").append(new EliaUiTranslation(word.lemma, word.language).html());
                        });
                        break;
                    case "WT.11.PRO.A":
                        feedback_information.forEach(function(word) {
                          $("#feedback-information").append(new EliaUiWord(word, response.RES_XW_word.pos).html());
                        });
                        break;
                    case "WT.36.PRO.A":
                        feedback_information.forEach(function(word) {
                          $("#feedback-information").append(new EliaUiWord(word, response.RES_XW_word.pos).html());
                        });
                        break;
                    case "WT.52.PRO.A":
                        feedback_information.forEach(function(word) {
                          $("#feedback-information").append(new EliaUiWord(word.lemma, word.pos).html());
                        });
                        break;
                    case "WT.55.PRO.A":
                        feedback_information.forEach(function(word) {
                          $("#feedback-information").append(new EliaUiWord(word, "").html());
                        });
                        break;
                }
            }
            answer.attr('readonly', true);
            validated = true;
        }
    });
});


let feedback_association = function() {
    tracking(status="started","","", response.RES_XX_id);
    instruction_1.prepend(response.RES_XX_instruction1);
    switch(response.RES_XX_id){
        case "WT.10.PRO.A":
            corrects = response.RAW_10_Translation;
            feedback_information = response.MAX_10_Translation;
            break;
        case "WT.11.PRO.A":
            corrects = response.MAX_11_Synonym;
            feedback_information = response.MAX_11_Synonym;
            break;
        case "WT.36.PRO.A":
            corrects = response.RAW_36_FamilyMember;
            feedback_information = response.PER_36_FamilyMember;
            break;
        case "WT.52.PRO.A":
            corrects = [];
            response.RAW_52_Rhyme.forEach(function(word) {
              corrects.push(word.lemma)
            });
            feedback_information = response.PER_52_Rhyme;
            break;
        case "WT.55.PRO.A":
            corrects = response.RAW_56_Collocate;
            feedback_information = response.PER_56_Collocate;
            instruction_1.html(
                instruction_1.html().replace(
                    response.RAW_66_CollocateTypePos,
                    '<b class="text-cyan">'+response.RAW_66_CollocateTypePos+'</b>'
                )
            );
            break;
    }
};