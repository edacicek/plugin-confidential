let validated = false;
let gif = $("#gif_image");
let response;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});
$("#footer").load("/html/footer.html");


//Open Tab
$(function() {
    gif.hide();
    response = getCurrentPage();
    feedback_notice();

    $("#next").on("click", function() {
        if (validated) {
            tracking(status="end","","", "", gotoNextPage);
        } else {
            switch (response.RES_XX_id) {
                case "WT.60.PRO.Q":
                    let information = $("#information");
                    let image = Math.floor(Math.random() * 1) + 1;
                    gif.attr("src", "/images/gifs/ok_" + image + ".gif");
                    gif.show();
                    tracking(status = "answered", JSON.stringify(information.val()), "", "");
                    store(response.RES_XX_id, "answer", information.val());
                    information.hide();
                    $("#instruction-1").hide();
                    $("#instruction-2").hide();
                    $("#positiveFeedback").append(
                        response.RES_XX_PositiveFeedback
                    );
                    break;
            }
            validated = true;
        }
    });
});


let feedback_notice = function() {
    tracking(status="started","","", response.RES_XX_id);
    let information = $("#information");
    $("#word").prepend(response.RES_XW_word.lemma);
    $("#headline").prepend(response.RES_XX_headline);
    $("#instruction-1").prepend(response.RES_XX_instruction1.replace(response.RAW_60_Domain, "<b class='text-cyan'>"+response.RAW_60_Domain+"</b></b>"));
    $("#instruction-2").prepend(response.RES_XX_instruction2);

    switch(response.RES_XX_id){
        case "WT.60.PRO.Q":
            response.ALL_60_Domain.forEach(function(domain) {
              information.append(
                    `<option value="${domain}">${domain}</option>`
                );
            });
            break;
    }
};