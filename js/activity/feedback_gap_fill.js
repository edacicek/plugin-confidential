//Open Tab
let corrects = [];
let validated = false;
let answer = $("#answer");
let gif = $("#gif_image");
let response;
let feedback_information;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});

$("#footer").load("/html/footer.html");

$(function() {
    gif.hide();

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
                    case "WT.62.PRO.G":
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
    $("#instruction-1").prepend(response.RES_XX_instruction1);
    switch(response.RES_XX_id){
        case "WT.62.PRO.G":
            corrects = response.RAW_62_FormGram;
            feedback_information = response.RAW_62_FormGram;
            $("#gap_part1").html(response.RAW_61_PatternPart1);
            $("#gap_part2").html(response.RAW_61_PatternPart2);
            break;
    }
};