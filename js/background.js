console.log("background.js");

chrome.browserAction.setPopup({popup: 'html/search.html'});

chrome.contextMenus.create({
    title: "Lookup the selected word...",
    contexts: ["selection"],
    onclick: function (info, tab) {
        if ((info.selectionText.split(" ").length - 1) < 3) {
            chrome.tabs.create({
                url: chrome.extension.getURL('html/use.html?selection=' + info.selectionText),
                active: false
            }, function (tab) {
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    height: 590,
                    width: 310
                });
            });
        } else {
            alert("Large selection, please select only a Word.");
        }
    }
});

chrome.contextMenus.create({
    title: "Edit text selected text...",
    contexts: ["selection"],
    onclick: function (info, tab) {
        chrome.tabs.create({
            url: chrome.extension.getURL('html/writing.html?selection=' + info.selectionText),
            active: false
        }, function (tab) {
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                height: 445,
                width: 790
            });
        });
    }
});
