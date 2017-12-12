/*var s = document.createElement('script');
s.src = chrome.extension.getURL("inject.js");
(document.head||document.documentElement).appendChild(s);
s.parentNode.removeChild(s);*/


blockedUsers = [];
blockedTypes = [];

regexes = {block1: /\b[A-Z]{2,}\b.+\n\s*\n/g }



function loadBlockedTypes(){
  chrome.storage.sync.get('blockedTypes',function(data){
    if (data.blockedTypes){
      blockedTypes = data.blockedTypes;
      runBlocked();
    }
  });
}


function loadBlockedUsers(){
  chrome.storage.sync.get('blockedUsers',function(data){
    if ($.isArray(data.blockedUsers)){
      blockedUsers = data.blockedUsers;
      runBlocked();
    }
    $( window ).scroll(function() {
      runBlocked();
    });
  });
}

function saveBlockedUsers(){
  chrome.storage.sync.set({"blockedUsers": blockedUsers});
}

function saveBlockedTypes(data){
  console.log('saving blockedTypes: '+data);
  chrome.storage.sync.set({"blockedTypes": data});
}

function addBlockedUser(userString){
  blockedUsers.push(userString);
  saveBlockedUsers();
}

function runBlocked(){
  for (i = 0; i < blockedUsers.length; i++) {
    blockSingleUser(blockedUsers[i]);
  }
  console.log(blockedTypes);
  for (var key in blockedTypes) {
    console.log('checking '+key);
   if (blockedTypes.hasOwnProperty(key)) {
      var blockname = key;
      var enabled = blockedTypes[key];
      if (enabled == 1){
        console.log('filtering for '+regexes[key]);
        var regex = new RegExp(regexes[key]); // expression here
        $("span").filter(function () {
            return $(this).html().match(regexes[key]);
        }).parents('article').remove();
      }
   }
}

}

function blockSingleUser(userString){
  console.log('blocking');
  $('*[data-entity-hovercard-id="'+userString+'"]').parents('article').remove();
}


var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedEl = event.target.getAttribute('data-entity-hovercard-id');
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        blockSingleUser(clickedEl);
        addBlockedUser(clickedEl);
        loadBlockedUsers();
        sendResponse({value: clickedEl});
    }
    if (request == "getTypes"){
        chrome.runtime.sendMessage({blockedTypes: blockedTypes}, function(response) {
            //console.log(response)
        });
    }
    else {
      //blocktypes data
      console.log(request);
      blockedTypes = request;
      console.log(blockedTypes);
      saveBlockedTypes(request);
    }
});


  loadBlockedUsers();
  loadBlockedTypes();
