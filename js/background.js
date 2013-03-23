
// Listen for a click on the camera icon.  On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file: "js/vendor/jquery-1.9.1.min.js"});
	chrome.tabs.executeScript(null, {file: "js/vendor/jquery.imgareaselect.pack.js"});
	chrome.tabs.executeScript(null, {file: "js/content_script.js"});
	chrome.tabs.insertCSS(null, {file: "css/modal.css"})
	chrome.tabs.insertCSS(null, {file: "css/imgareaselect/imgareaselect-default.css"})
	
    chrome.tabs.captureVisibleTab(null, function(img) {
	    chrome.tabs.sendMessage(tab.id, {greeting: img}, function(response) {
  	});

  });
 
});
