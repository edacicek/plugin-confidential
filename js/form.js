$(function() {
    $('#meaning_loading').css('display', 'none');
    $('#meaning_loading').fadeIn(1500);
    // Get url parameters
    let searchParams;
    if(window.location.search === '') {
        searchParams = new URLSearchParams(JSON.parse(localStorage.getItem("search_parameters")));
    } else {
        searchParams = new URLSearchParams(window.location.search);
        localStorage.setItem("search_parameters", JSON.stringify(window.location.search));
    }
    localStorage.setItem("type", "form");

    // Word in context
    let parameters, lemma, pos;
    if (searchParams.has('selection')) {
        if (searchParams.has('query')) {
            parameters = searchParams.get('query').toString();
            parameters = parameters.replace("{", window.config.special_character);
            parameters = parameters.replace("}", window.config.special_character);
        } else {
            parameters = window.config.special_character + searchParams.get('selection') + window.config.special_character
        }
        $.ajax({
              timeout: 30000,
              method: "GET",
              url: window.config.api + "/wt_xf_pro?raw_sentence=" + parameters
            }).done(function (data, textStatus, jqXHR) {
                savePageSequence(data);
                gotoNextPage();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                window.location.href = "/html/error.html";
            });
    } else if (searchParams.has('lemma') && searchParams.has('pos')) {
        lemma = searchParams.get('lemma');
        pos = searchParams.get('pos');
        $.ajax({
              timeout: 30000,
              method: "GET",
              url: window.config.api + "/wi_xf_pro?lemma=" + lemma + "&pos=" + pos
            }).done(function (data, textStatus, jqXHR) {
                savePageSequence(data);
                gotoNextPage();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                window.location.href = "/html/error.html";
            });
    }

});