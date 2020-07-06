
$(function () {
    $("#elia-form").hide();
    $("#elia-meaning").hide();
    $("#elia-use").hide();
    $("#elia-form").slideDown(50, function () {
        $("#elia-meaning").slideDown(50, function () {
            $("#elia-use").slideDown(50);
        });
    });
    $("#elia-form").on('click', function () {
        window.location.href  = "form.html" + window.location.search;
    });
    $("#elia-meaning").on('click', function () {
        window.location.href  = "meaning.html" + window.location.search;
    });
    $("#elia-use").on('click', function () {
        window.location.href  = "use.html" + window.location.search;
    });
});

