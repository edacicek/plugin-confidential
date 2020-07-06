let EliaUiTranslation = function(lemma, language) {
    this.lemma = lemma;
    this.language = language;

    // Cleaning comments
    this.lemma = this.lemma.replace('_', ' ');
    this.lemma = this.lemma.replace('(', '<sub><i>');
    this.lemma = this.lemma.replace(')', '</i></sub>');

    this.html = function() {
        return `
       <button type="button" class="btn btn-outline-light btn-sm" style="pointer-events: none;">
           <span class="text-secondary font-weight-bold">
                ${this.lemma}
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${this.language}
           </sup>
       </button> 
       `;
    }
};

let EliaUiTranslationLabel = function(lemma, language) {
    this.lemma = lemma;
    this.language = language;

    // Cleaning comments
    this.lemma = this.lemma.replace('_', ' ');
    this.lemma = this.lemma.replace('(', '<sub><i>');
    this.lemma = this.lemma.replace(')', '</i></sub>');

    this.html = function() {
        return `
       <span class="font-weight-bold">
            ${this.lemma}
       </span>
       <sup class="text-cyan font-weight-bold text-uppercase">
            ${this.language}
       </sup>
       `
    }
};

let EliaUiWordParts = function(affixName, affixFunction, affixDeffinition) {
    this.affixName = affixName;
    this.affixFunction = affixFunction;
    this.affixDeffinition = affixDeffinition;
    this.html = function() {
        return `
       <button type="button" class="btn btn-outline-light btn-sm">
           <span class="text-danger font-weight-bold">
                ${this.affixName}
           </span>
           <sup class="text-cyan font-weight-bold">
                ${this.affixFunction}
           </sup>
       </button> 
            ${this.affixDeffinition}
       <br> 
       `;
    }
};

let EliaUiWordFamily = function(lemma, pos) {
    this.lemma = lemma;
    this.pos = pos;
    this.html = function() {
        return `
       <a class="btn btn-outline-light btn-sm" href="/html/meaning.html?lemma=${this.lemma}&pos=${this.pos}" role="button">
           <span class="text-danger font-weight-bold">
                ${this.lemma}
           </span>
           <sup class="text-cyan font-weight-bold">
                ${this.pos}
           </sup>
       </a>
   `;
    }
};

let EliaUiWord = function(lemma, pos) {
    this.lemma = lemma;
    this.pos = pos;
    this.status = "";
    if(pos === "") {
        this.status = "disabled"
    }
    this.html = function() {
        return `
       <a class="btn btn-outline-light btn-sm" href="/html/meaning.html?lemma=${this.lemma}&pos=${this.pos}" role="button" ${this.status}>
           <span class="text-danger font-weight-bold">
                ${this.lemma}
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${this.pos}
           </sup>
       </a>
   `;
    }
};

let EliaUiWordCross = function(lemma, pos) {
    this.lemma = lemma;
    this.pos = pos;
    this.status = "";
    if(pos === "") {
        this.status = "disabled"
    }
    this.html = function() {
        return `
       <a class="btn btn-outline-light btn-sm" href="/html/meaning.html?lemma=${this.lemma}&pos=${this.pos}" role="button" ${this.status}>
           <span class="text-danger font-weight-bold">
                <del>${this.lemma}</del>
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${this.pos}
           </sup>
       </a>
   `;
    }
};

let EliaUiWordSynonym = function(lemma, pos) {
    this.lemma = lemma;
    this.pos = pos;
    this.html = function() {
        return `
       <a class="btn btn-outline-light btn-sm" href="/html/meaning.html?lemma=${this.lemma}&pos=${this.pos}" role="button">
           <span class="text-danger font-weight-bold">
                ${this.lemma}
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${this.pos}
           </sup>
       </a>
   `;
    }
};

let EliaUiFalseFriend = function(lemma, language) {
    this.lemma = lemma;
    this.language = language;
    this.html = function() {
    return `
       <button type="button" class="btn btn-outline-light btn-sm">
           <span class="text-secondary font-weight-bold">
                ${this.lemma}
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${this.language}
           </sup>
       </button> 
       `;
    }
};

let EliaUiCognate = function(lemma, language) {
    this.html = function() {
    return `
       <button type="button" class="btn btn-outline-light btn-sm">
           <span class="text-secondary font-weight-bold">
                ${lemma}
           </span>
           <sup class="text-cyan font-weight-bold text-uppercase">
                ${language}
           </sup>
       </button> 
       `;
    }
};

let EliaUiSentencePattern = function(patterns, original_sentences) {
    this.patterns = patterns;
    let sentence = original_sentences.trim();
    let words = sentence.replace(".", " ").replace(",", " ").trim().split(" ");
    patterns.forEach(function(pattern){
        console.log(words, words[pattern]);
        sentence = sentence.replace(words[pattern], "<span class='text-cyan'>"+ words[pattern] + "</span>");
    });

    this.html = function() {
    return `
        <li class="list-group-item">
            ${sentence}
        </li>
        `;
    }
};

let EliaUiExampleSentence = function(form, example_sentence) {
    this.lemma = form;
    this.example_sentence = example_sentence;
    // Highlight lemma
    this.example_sentence = this.example_sentence.replace(form, '<span class="text-danger">' + form + '</span>');;

    this.html = function() {
    return `
        <li class="list-group-item">
            ${this.example_sentence}
        </li>
        `;
    }
};

let EliaUiIconTTSButton = function() {
    this.icon = "/images/icons/voice.png";
    this.html = function() {
    return `
         <button type="button" title="Pronounce the word" class="btn btn-outline-light btn-sm" id="tts-button">
            <img src="${this.icon}"  class="icon-action" alt="TTS Button">
         </button> 
         `;
    }
};

let EliaUiIconTTSButtonComplete = function(to_speak) {
    this.icon = "/images/icons/voice.png";
    this.id = getRandomInt(1, 1000000);
    $(document).on("click", '.' + this.id, function() {
        textToSpeech(to_speak, "en-US");
    });
    this.html = function() {
        return `
     <button type="button" class="btn btn-outline-light btn-sm ${this.id}" id="${this.id}" >
        <img src="${this.icon}"  class="icon-action" alt="${to_speak}">
     </button> 
     `;
   }
 };

let EliaUiWordPart = function(part, text) {
    this.html = function() {
    let result;
    result = `
        <div class="col-auto text-center">
            <button type="button" class="btn btn-outline-light btn-sm" disabled>
               <span class="text-danger font-weight-bold">
                    ${text}
               </span>
            </button> 
            <div>
               <span class="text-secondary font-weight-light small">
                    ${part}
               </span>
            </div>
        </div>`;
    return result;
    }
};


let EliaUiWordPartitionPart = function(part) {
    this.html = function() {
    let result;
    result = `
        <div class="col text-center">
             <input id="${part}" type="text" class="form-control" placeholder="" aria-describedby="answerAppend" required>
             <div id="${part}-label">${part.split("_")[0]}</div>
        </div>
         `;

/*        if (!end) {
            result = result +
                `
                <div class="col-auto text-center">
                    <span class="mt-3">+</span>
                </div>
            `;
        }*/
    return result;
    }
};

let EliaUiIconFilterButton = function(max_sense) {
    this.icon = "/images/icons/filter.png";
    this.status = "";
    if (Object.keys(max_sense).length < 1) {
        this.status = "disabled";
    }
    this.html = function() {
    return `
         <button type="button" title="Filter" class="btn btn-outline-light btn-sm" id="filter-button" ${this.status}>
            <img src="${this.icon}" class="icon-action" alt="Filter Icon" >
         </button> 
         `;
    }
};

let EliaUiWordsHistory = function(history) {
    this.history = removeDuplicates(history, 'lemma');
    this.html = function() {
        let source = '';
        this.history.slice().reverse().forEach(function(word) {
            source = source + `
           <a class="btn btn-outline-light btn-sm" href="/html/meaning.html?lemma=${ word.lemma }&pos=${ word.pos }" role="button">
               <span class="text-danger font-weight-bold">
                    ${ word.lemma }
               </span>
               <sup class="text-cyan font-weight-bold">
                    ${ word.pos }
               </sup>
           </a>
           `;
        });
        return source
    }
};

let EliaUiDefinitionSense = function(senses, show=0) {
    this.html = function() {
        let source = '';
        Object.keys(senses).some(function(key, index) {
            let sense_number = index + 1;
            let sense = senses[key];
            // Definition
            source += `
            <div class="col-12 align-self-center mt-2">
                <div class="text-content" ><b>${sense_number}.</b> ${senses[key].definition}</div>
            </div>`;
            // Synonyms Title
            if (sense.synonyms.length > 0) {
                source += `
                <div class="col-12 align-self-center ml-4">
                    <div class="header">
                        Synonyms
                    </div>
                </div>`;
            }
            // Synonyms Information
            source += `
            <div class="col-12 align-self-center ml-4">
                <div class="text-content">`;
            sense.synonyms.forEach(function(synonym) {
                source += new EliaUiWordSynonym(
                    synonym.lemma,
                    synonym.pos
                ).html()
            });
            source += `
                </div>
            </div>`;
            // Translate Title
            if (sense.translations.length > 0) {
                source += `
                <div class="col-12 align-self-center ml-4">
                    <div class="header">
                        Translations
                    </div>
                </div>`;
            }
            // Translate Information
            source += `
            <div class="col-12 align-self-center ml-4">
                <div class="text-content">`;
            sense.translations.forEach(function(translation) {
                source += new EliaUiTranslation(
                    translation.lemma,
                    translation.language
                ).html()
            });
            source += `
                </div>
            </div>`;
            if (show === index) {
                return source
            }
        });
        return source
    }
};

let EliaUiPronunctiation = function(word, transcript) {
    this.html = function() {
    return `
           <div class="row">
               <div class="col-4">
                   <div class="text-center">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript}/
                           </span>
                       </button>
                   </div>
               </div>
               <div class="col-1">
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(word.lemma).html() }
                   </div>
               </div>
           </div>`;
    }
};

let EliaUiSynphone = function(word, transcript_word, synphone, transcript_synphone) {
    this.html = function() {
    return `
           <div class="row">
               <div class="col-5">
                   <div class="text-center">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${word.lemma}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${word.pos}
                           </sup>
                       </button>
                   </div>
                   <div class="text-center">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${synphone.lemma}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${synphone.pos}
                           </sup>
                       </button>
                   </div>
               </div>
               <div class="col-1">
                   <div class="font-weight-bold text-center">
                    =
                   </div>
                   <div class="font-weight-bold text-center mt-2">
                    =
                   </div>
               </div>
               <div class="col-4">
                   <div class="text-center">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript_word}/
                           </span>
                       </button>
                   </div>
                   <div class="text-center">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript_synphone}/
                           </span>
                       </button>
                   </div>
               </div>
               <div class="col-2">
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(word.lemma).html() }
                   </div>
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(synphone.lemma).html() }
                   </div>
               </div>
           </div>`;
    }
};


let EliaUiHeteronym = function(word, transcript_word, heteronym , transcript_heteronym) {
    this.html = function() {
    return `
            <div class="row">
               <div class="col-5">
                   <div class="text-center">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${word.form}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${word.function}
                           </sup>
                       </button>
                   </div>
               </div>
               <div class="col-1">
                   <div class="font-weight-bold text-center">
                    =
                   </div>
               </div>
               <div class="col-4">
                   <div class="text-center">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript_word}/
                           </span>
                       </button>
                   </div>
               </div>
               <div class="col-2">
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(word.lemma).html() }
                   </div>
               </div>
            </div>
            <div class="row mt-3">
                <div class="col-12 align-self-center">
                    <div id="instruction-1" class="text-content">
                    is <b>different</b> form this word
                    </div>
                </div>
            </div>
            <div class="row mt-3">
               <div class="col-5">
                   <div class="text-center">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${heteronym.form}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${heteronym.function}
                           </sup>
                       </button>
                   </div>
               </div>
               <div class="col-1">
                   <div class="font-weight-bold text-center">
                    =
                   </div>
               </div>
               <div class="col-4">
                   <div class="text-center">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript_heteronym}/
                           </span>
                       </button>
                   </div>
               </div>
               <div class="col-2">
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(heteronym.lemma).html() }
                   </div>
               </div>
            </div>`;
    }
};

let EliaUiHeterograph = function(word, heterograph , transcript) {
    this.html = function() {
    return `
            <div class="row">
               <div class="col-5">
                   <div class="text-center">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${word.form}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${word.pos}
                           </sup>
                       </button>
                   </div>
                   <div class="text-center mt-3">
                       <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-danger font-weight-bold">
                                ${heterograph.form}
                           </span>
                           <sup class="text-cyan font-weight-bold text-uppercase">
                                ${heterograph.pos}
                           </sup>
                       </button>
                   </div>
               </div>
               <div class="col-1">
                   <div class="font-weight-bold text-center mt-3">
                    =
                   </div>
               </div>
               <div class="col-4">
                   <div class="text-center mt-3">
                        <button class="btn btn-outline-light btn-sm" disabled>
                           <span class="text-secondary font-weight-bold">
                                /${transcript}/
                           </span>
                       </button>
                   </div>
               </div>
               <div class="col-2">
                   <div class="font-weight-bold mt-3">
                    ${ new EliaUiIconTTSButtonComplete(word.lemma).html() }
                   </div>
               </div>
            </div>`;
    }
};

let EliaUiWordForm = function(word) {
    this.html = function() {
    return `
          <div class="row mb-2">
               <div class="col-6 text-left">
                   <button class="btn btn-sm button-no-action text-left" style="pointer-events: none;">
                       <span class="text-secondary font-weight-bold text-capitalize">
                            ${word.function}
                       </span>
                   </button>
               </div>
               <div class="col-4 text-left">
                   <a class="btn btn-outline-light btn-sm button-no-action" href="/html/meaning.html?lemma=${word.lemma}&pos=${word.pos}" role="button">
                       <span class="text-danger font-weight-bold">
                            ${word.form}
                       </span>
                       <sup class="text-cyan font-weight-bold text-uppercase">
                            ${word.pos}
                       </sup>
                   </a>
               </div>
               <div class="col-1 text-left">
                   <div class="font-weight-bold">
                    ${ new EliaUiIconTTSButtonComplete(word.form).html() }
                   </div>
               </div>
          </div>`;
    }
};

let EliaUiTranscript = function(transcript) {
    this.html = function() {
    return `
        <button class="btn btn-sm" style="pointer-events: none;">
           <span class="text-secondary font-weight-bold">
                /${transcript}/
           </span>
       </button>
       `;
    }
};

let EliaUiDomain = function(domain) {
    this.html = function() {
    return `
        <button class="btn btn-sm button-no-action" style="pointer-events: none;">
           <span class="text-secondary font-weight-bold">
                ${domain}
           </span>
       </button>
       `;
    }
};

let EliaUiFrequency = function(frequency) {
    this.max = 4;
    this.percent = Math.round((frequency*100)/this.max);
    this.html = function() {
    return `
        <div class="progress" style="height: 3px;">
          <div class="progress-bar progress-bar-striped bg-secondary" role="progressbar" style="width: ${this.percent}%" aria-valuenow="${this.percent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
       `;
    }
};

let EliaUiCollocate = function(collocate) {
    let source = '<button type="button" class="btn btn-outline-light btn-sm button-no-action" style="pointer-events: none;">';
    Object.keys(collocate).forEach(function (word) {
        let type;
        switch(collocate[word]) {
            case "collocate":
                type = "text-black-50";
                break;
            case "target_word":
                type = "text-danger";
                break;
            default:
                type = "text-black-50";
                break;
        }
        source = source +
            `<span class="${type} font-weight-bold">
                ${word}
            </span>`;
    });
    source = source + '</button>';
    this.html = function() {
        return source;
    }
};

let EliaUiPattern = function(pattern){
    let source = '<button type="button" class="btn btn-outline-light btn-sm button-no-action" style="pointer-events: none;">';
    Object.keys(pattern).forEach(function (word) {
        let type = "";
        switch(pattern[word]) {
            case "lemma":
                type = "text-black-50 font-weight-bold";
                break;
            case "pos":
                type = "text-cyan";
                break;
            case "form":
                type = "text-black-50";
                break;
            case "target_word":
                type = "text-danger";
                break;
        }
        source = source +
            `<span class="${type}">
                ${word}
            </span>`;
    });
    source = source + '</button>';
    this.html = function() {
        return source;
    }
};

let EliaUiPositiveFeedbackSentence = function(sentence) {
    this.html = function() {
        return `
       <i class="fas fa-check"></i> <span class="text-danger">${sentence}</span> <br> 
       `;
    }
};

let EliaUiNegativeFeedbackSentence = function(sentence) {
    this.html = function() {
    return `
       <i class="far fa-dot-circle"></i> ${sentence}<br> 
       `;
    }
};

let EliaUiCollocateSuggestion = function() {
  this.html = function() {
    return `
      <div class="row-12">
         <div class="col-12 align-self-center" style="padding: 0 !important;">
            <div class="text-content history-container" id="history">
                <button class="btn btn-outline-light btn-sm" style="pointer-events: none;">
                    <span class="text-cyan font-weight-bold">
                         VERB
                    </span>
                    <span class="text-danger font-weight-bold">
                         attention
                    </span>
                    <sup class="text-cyan font-weight-bold">
                         
                    </sup>
                </button>
                <button class="btn btn-outline-light btn-sm" style="pointer-events: none;">
                    <span class="text-dark">
                         pay
                    </span>
                    <span class="text-danger font-weight-bold">
                         attention
                    </span>
                    <sup class="text-dark">
                         
                    </sup>
                </button>
                <button class="btn btn-outline-light btn-sm" style="pointer-events: none;">
                    <span class="text-dark">
                         pay
                    </span>
                    <span class="text-danger font-weight-bold">
                         attention
                    </span>
                    <span class="text-dark">
                         of
                    </span>
                </button>
            </div>
        </div>
    </div>
    `
  }
}