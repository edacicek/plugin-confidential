speechSynthesis.getVoices();

const sleep = m => new Promise(r => setTimeout(r, m));

$(function () {
    $("#footer-keyboard").on("click", function () {
        console.log("click");
        window.open("writing.html", 'popUpWindow', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
    });
});

let highlightFormMeaningUse = function() {
    let form = $("#top_form");
    let meaning = $("#top_meaning");
    let use = $("#top_use");
    form.removeClass("border-dark");
    meaning.removeClass("border-dark");
    use.removeClass("border-dark");
    switch (localStorage.getItem("type")) {
        case "form":
            form.addClass("border-dark");
            break;
        case "meaning":
            meaning.addClass("border-dark");
            break;
        case "use":
            use.addClass("border-dark");
            break;
    }
};

let removeDuplicates = function(originalArray, prop) {
     let newArray = [];
     let lookupObject  = {};

     for(let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(let i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 };

let getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let textToSpeech = function(text, language) {
    let msg = new SpeechSynthesisUtterance(text);
    msg.voice = speechSynthesis.getVoices().filter(function(voice) {
        return voice.name === "Google US English";
    })[0];
    msg.lang = language;
    msg.pitch = 0.7;
    window.speechSynthesis.speak(msg);
};

let loadBinaryFile = function(path, success) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = e => {
        success(xhr.response)
    };
    xhr.send();
};

let mysql_date = function() {
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return date;
};

let tracking = function(status, input = "", result = '', response_id = '', onSent = function(){}) {
    switch (status) {
        case "started":
            localStorage.setItem("user_id", '1');
            localStorage.setItem("start_time", mysql_date());
            localStorage.setItem("action_type", response_id);
            localStorage.setItem("action_input", "");
            localStorage.setItem("action_time", "");
            localStorage.setItem("action_result", "");
            localStorage.setItem("feedback_time", "");
            localStorage.setItem("end_time", "");
            break;
        case "answered":
            localStorage.setItem("action_time", mysql_date());
            localStorage.setItem("action_input", input);
            break;
        case "feedback":
            localStorage.setItem("feedback_time", mysql_date());
            localStorage.setItem("action_result", result);
            break;
        case "end":
            localStorage.setItem("end_time", mysql_date());
            tracking_event = {
                "userId" : localStorage.getItem("user_id"),
                "responseId" : localStorage.getItem("action_type"),
                "responseJson" : localStorage.getItem("page_sequence_current"),
                "startTime" : localStorage.getItem("start_time"),
                "userActionType" : localStorage.getItem("action_type"),
                "userActionInput" : localStorage.getItem("action_input"),
                "userActionTime" : localStorage.getItem("action_time"),
                "userActionResult" : localStorage.getItem("action_result"),
                "feedbackTime" : localStorage.getItem("feedback_time"),
                "endTime" : localStorage.getItem("end_time"),
            };
            try {
                $.ajax({
                  timeout: 30000,
                  method: "GET",
                  url: window.config.api + "/track?tracking_event=" + JSON.stringify(tracking_event)
                }).done(onSent)
                .then(function () {
                    // Empty
                });
            } catch (err) {
                console.log(err);
            }
            break;
    }
};

let store = function(response, parameter, value) {
    //TODO migrate to POST
    $.ajax({
      timeout: 30000,
      method: "GET",
      url: window.config.api + "/store?response="+response+"&parameter="+parameter+"&value="+value
    }).done(function (data) {
        console.log(data);
    });
};
let shuffleArray = function(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

let savePageSequence = function(response) {
    localStorage.setItem("page_sequence_response", JSON.stringify(response.reverse()));
};

let getCurrentPage = function() {
    return JSON.parse(localStorage.getItem("page_sequence_current"))
};

let copyToClipboard = function(element) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
};

let gotoNextPage = function() {
    let response = JSON.parse(localStorage.getItem("page_sequence_response"));
    let current = response.pop();
    localStorage.setItem("page_sequence_current", JSON.stringify(current));
    localStorage.setItem("page_sequence_response", JSON.stringify(response));
    //window.location.reload();
    switch (current.RES_XX_id) {
        case "WT.62.PRO.G": // TODO Check
            window.location.href = "../../html/activity/feedback_gap_fill.html";
            break;
        case "WI.XU.PRO.D":
        case "WT.XU.PRO.D":
            window.location.href = "../../html/activity/dictionary_use.html";
            break;
        case "WI.XF.PRO.D":
        case "WT.XF.PRO.D":
            window.location.href = "../../html/activity/dictionary_form.html";
            break;
        case "WI.XM.PRO.D":
        case "WT.XM.PRO.D":
            window.location.href = "../../html/activity/dictionary_meaning.html";
            break;
        case "WT.07.PRO.H":
            window.location.href = "/html/activity/feedback_pronunciation.html";
            break;
        case "WT.29.PRO.F":
            window.location.href = "/html/activity/feedback_formation.html";
            break;
        case "WT.04.PRO.Y":
            window.location.href = "/html/activity/feedback_yes_no.html";
            break;
        case "WT.29.PRO.P":
        case "WT.XP.PRO.P":
            window.location.href = "/html/activity/feedback_partition.html";
            break;
        case "WT.60.PRO.Q":
            window.location.href = "/html/activity/feedback_question.html";
            break;
        case "WT.04.PRO.S":
            window.location.href = "/html/activity/feedback_scale.html";
            break;
        case "WT.10.PRO.A":
        case "WT.11.PRO.A":
        case "WT.36.PRO.A":
        case "WT.52.PRO.A":
        case "WT.55.PRO.A":
            window.location.href = "/html/activity/feedback_association.html";
            break;
        case "WT.02.PRO.C":
        case "WT.02.PRO.C.D54":
        case "WT.08.PRO.C":
        case "WT.10.PRO.C":
        case "WT.10.PRO.C.D37":
        case "WT.11.PRO.C":
        case "WT.24.PRO.C":
        case "WT.55.PRO.C":
        case "WT.55.PRO.C.D58":
        case "WT.55.PRO.C.D57":
        case "WT.55.PRO.C.D58.D57":
        case "WT.56.PRO.C":
        case "WT.56.PRO.C.K57":
        case "WT.56.PRO.C.K58":
        case "WT.64.PRO.C":
        case "WT.55.PRO.O":
        case "WT.56.PRO.O":
            window.location.href = "/html/activity/feedback_choice.html";
            break;
        case "WT.29.PRO.N":
        case "WT.36.PRO.N":
        case "WT.37.PRO.N":
        case "WT.38.PRO.N":
        case "WT.39.PRO.N":
        case "WT.46.PRO.N":
        case "WT.47.PRO.N":
        case "WT.48.PRO.N":
        case "WT.49.PRO.N":
        case "WT.60.PRO.N":
        case "WT.61.PRO.N":
        case "WT.56.PRO.N.56X":
        case "WT.55.PRO.N":
        case "WT.39.PRO.N.39R":
            window.location.href = "/html/activity/feedback_notice.html";
            break;
        default:
            console.log("Internal error routing page: " + current.res_response);
    }
};