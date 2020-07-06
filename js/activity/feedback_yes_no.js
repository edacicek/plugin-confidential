$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");

//Open Tab
$(function() {

    feedback_yes_no(getCurrentPage())

    $("#yes").on("click",function() {
        tracking(status="answered", "['yes']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });

    $("#no").on("click",function() {
        tracking(status="answered", "['no']","", "");
        tracking(status="end","","", "", gotoNextPage);
    });
});


let feedback_yes_no = function(response) {
    tracking(status="started","","", response.RES_XX_id);
    $("#word").prepend(response.RES_XW_word.lemma);
};