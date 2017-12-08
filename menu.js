


chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Block User";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
        elt = clickedEl;
    });
};
