/*var s = document.createElement('script');
s.src = chrome.extension.getURL("inject.js");
(document.head||document.documentElement).appendChild(s);
s.parentNode.removeChild(s);*/


blockedUsers = [];


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
  console.log(blockedUsers);
  chrome.storage.sync.set({"blockedUsers": blockedUsers});
}

function addBlockedUser(userString){
  blockedUsers.push(userString);
  saveBlockedUsers();
}

function runBlocked(){
  for (i = 0; i < blockedUsers.length; i++) {
    blockSingleUser(blockedUsers[i]);
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
});


  loadBlockedUsers();
