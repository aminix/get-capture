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
