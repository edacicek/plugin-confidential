//Open Tab
let validated = false;
let gif = $("#gif_image");
let response;

$("#topHeader").load("/html/top-header.html", function() {
    highlightFormMeaningUse();
});

$("#footer").load("/html/footer.html");
gif.hide();

$(function() {
    response = getCurrentPage();
    feedback_partition();
    $("input").css('text-align', 'center');
    $("#next").on("click", function() {
        if (validated) {
            tracking(status="end","","", "", gotoNextPage);
        }
        switch(response.RES_XX_id){
            case "WT.XP.PRO.P":
            case "WT.29.PRO.P":
                let errors = 0;
                let answers =[];
                Object.keys(response.RAW_29_InflectionForm).forEach(function (part) {
                    let partSelector = $("#" + part);
                    let partLabelSelector = $("#" + part + "-label");
                    answers.push(partSelector.val().toString().trim().toLowerCase());
                    if (partSelector.val().toString().trim().toLowerCase() !== response.RAW_29_InflectionForm[part].toLowerCase() ) {
                        partSelector.css('text-decoration', ' line-through');
                        partLabelSelector.html(response.RAW_29_InflectionForm[part]);
                        partLabelSelector.addClass("text-danger");
                        errors++;
                    } else {
                        partSelector.addClass("text-success");
                        partLabelSelector.addClass("text-muted");
                    }
                    partSelector.attr('readonly', true);
                });
                tracking(status="answered", JSON.stringify(answers),"", "");
                if (errors === 0 ){
                    let image = Math.floor(Math.random() * 9) + 1;
                    gif.attr("src","/images/gifs/thats_right_"+ image +".gif");
                    gif.show();
                    tracking(status="feedback","","correct", "");
                } else {
                    tracking(status="feedback","","incorrect", "");
                }
                break;
        }
        validated = true;
    });
});


let feedback_partition = function() {
    tracking(status="started","","", response.RES_XX_id);
    $("#instruction-1").prepend(response.RES_XX_instruction1);
    switch(response.RES_XX_id){
        case "WT.XP.PRO.P":
        case "WT.29.PRO.P":
            let parts = [];
            let parts_count = 0;
            Object.keys(response.RAW_29_InflectionForm).forEach(function (part) {
                parts[part.split("_")[1]] = part;
                parts_count++;
            });
            for(let i=1; i<=parts_count; i++){
                let part = parts[i];
                console.log(i, parts_count, i === parts_count);
                $("#partitions").append(
                    new EliaUiWordPartitionPart(
                        part,
                        response.RAW_29_InflectionForm[part]
                    ).html()
                );
            }
            break;
    }
};