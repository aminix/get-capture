chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery-1.9.1.min.js"
});
chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery.imgareaselect.pack.js"
});
chrome.tabs.executeScript(null, {
	file : "js/html2canvas.js"
});
chrome.tabs.executeScript(null, {
	file : "js/jquery.plugin.html2canvas.js"
});

chrome.tabs.insertCSS(null, {
	file : "css/modal.css"
})
chrome.tabs.insertCSS(null, {
	file : "css/imgareaselect/imgareaselect-default.css"
})

function sendMessage(msg) {
	return function (event) {
		chrome.extension.sendMessage({
			type: msg
		});
		trackButton(event);
	};
}

$(function() {
	$('#takeShot').click(sendMessage('select-area'));
	$('#openEditor').click(sendMessage('open-editor'));
	$('#extractImage').click(sendMessage('extract-image'));
	$('#fullImage').click(sendMessage('full-image'));
	$('#captureVisibleTab').click(sendMessage('visible-image'));
});
