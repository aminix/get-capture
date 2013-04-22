chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	localStorage["imageJPG"] = request.imageJPG;
}); 