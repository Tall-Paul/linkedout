console.log('loaded');



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('popup received: '+request);
  for (var key in request.blockedTypes) {
   if (request.blockedTypes.hasOwnProperty(key)) {
      var el = key;
      var obj = request.blockedTypes[key];
      $('#'+el).prop('checked',obj);
   }
}
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, 'getTypes', function(response) {
    console.log(response);
  });
});


function click(e){
  console.log('click');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log('sending message');
    chrome.tabs.sendMessage(tabs[0].id, {block1: $('#block1').prop('checked'), block2: $('#block2').prop('checked') }, function(response) {
      console.log(response);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('input');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
