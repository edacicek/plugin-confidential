$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");

//Open Tab
$(function() {
    feedback_yes_no(getCurrentPage());

    $("#no_idea").on("click", function() {
        tracking(status="answered","['no_idea']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });

    $("#vague_idea").on("click", function() {
        tracking(status="answered","['vague_idea']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });

    $("#know").on("click", function() {
        tracking(status="answered","['know']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });

    $("#use").on("click", function() {
        tracking(status="answered","['use']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });
});


let feedback_yes_no = function(response) {
    tracking(status="started","","", response.RES_XX_id);
    $("#word").prepend(response.RES_XW_word.lemma);
};