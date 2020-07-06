//Open Tab
let corrects = [];
let validated = false;
let gif = $("#gif_image");
let response;
let feedback_information;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});

$("#footer").load("/html/footer.html");

$(function() {
    let image = Math.floor(Math.random() * 5) + 1;
    gif.attr("src","/images/gifs/icanthereyou_"+ image +".gif");

    response = getCurrentPage();
    feedback_pronunciation();

    $("#next").on("click", function() {
        if (validated) {
            tracking(status="end","","", "", gotoNextPage);
        } else {
            tracking(status="feedback", "","", "");
            $("#answer_status").html('<i class="fas fa-check-circle float-right text-success"></i>');
            let image = Math.floor(Math.random() * 2) + 1;
            gif.attr("src","/images/gifs/trustyou_"+ image +".gif");
            gif.show();
            validated = true;
            $("#headline").hide();
            $("#instruction-1").hide();
            $("#feedback-positive").prepend(response.RES_XX_PositiveFeedback);
            $("#feedback-information").append(new EliaUiPronunctiation(response.RES_XW_word, response.RAW_06_Transcript).html())
        }
    });
});


let feedback_pronunciation = function() {
    tracking(status="started","","", response.RES_XX_id);
    $("#headline").prepend(response.RES_XX_headline);
    $("#instruction-1").prepend(response.RES_XX_instruction1);
    switch(response.RES_XX_id){
        case "WT.07.PRO.H":
            break;
    }
};