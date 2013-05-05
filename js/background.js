chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	alert('background set')
	localStorage["imageJPG"] = request.imageJPG;
});