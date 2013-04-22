chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery-1.9.1.min.js"
});
chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery.imgareaselect.pack.js"
});
chrome.tabs.executeScript(null, {
	file : "js/content_script.js"
});
chrome.tabs.insertCSS(null, {
	file : "css/modal.css"
})
chrome.tabs.insertCSS(null, {
	file : "css/imgareaselect/imgareaselect-default.css"
})

function getImageURL() {
	$('.popupButton').attr('disabled', '');
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			chrome.tabs.sendMessage(tab.id, {
				greeting : img
			}, function(response) {
			});
		});
	});
}

function openEdit() {
	chrome.tabs.create({url: chrome.extension.getURL('editPage.html'), selected: true}, function(tab) {
		
	});
	
}

$(function() {
	$('#takeShot').click(getImageURL);
	$('#edit').click(openEdit);

});

