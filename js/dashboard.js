let backTab = function () {
    history.back()
};

$.ajax({
  timeout: 30000,
  method: "GET",
  url: window.config.api + "/xx_xv_dsh?user_id=" + 1
}).done(function (data) {
    let response = data;
    $("#vocabulary_total_size").html(response.vocabulary_total_size);
    $("#vocabulary_cefr_level").html(response.vocabulary_cefr_level);
    $("#vocabulary_technical_percent").html(response.vocabulary_technical_percent+'% ');
    $("#vocabulary_academic_percent").html(response.vocabulary_academic_percent+'% ');
    $("#vocabulary_general_percent").html(response.vocabulary_general_percent+'% ');
    $("#word_learning_speed_total").html(response.word_learning_speed_total);
    $("#pbt").attr('aria-valuenow', response.vocabulary_technical_percent+'%').css('width', response.vocabulary_technical_percent+'%');
    $("#pba").attr('aria-valuenow', response.vocabulary_academic_percent+'%').css('width', response.vocabulary_academic_percent+'%');
    $("#pbg").attr('aria-valuenow', response.vocabulary_general_percent+'%').css('width', response.vocabulary_general_percent+'%');
})
.fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
    window.location.href = "/html/error.html";
});

$(function() {
    $("#back").on("click", backTab);
});