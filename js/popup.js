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

function getImageURL() {
	$('.popupButton').attr('disabled', '');
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			chrome.tabs.sendMessage(tab.id, {
				code : 'image',
				greeting : img
			}, function(response) {
				if (!response) {
					chrome.tabs.executeScript(null, {
						file : "js/content_script.js"
					});

					chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.captureVisibleTab(null, function(img) {
							chrome.tabs.sendMessage(tab.id, {
								code : 'image',
								greeting : img
							})
						})
					});

				}
			});

		});
	});
}

function openEdit() {
	chrome.tabs.create({
		url : chrome.extension.getURL('editPage.html'),
		selected : true
	}, function(tab) {

	});

}

function captureVisibleTabOnly() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			localStorage["imageJPG"] = img;
			openEdit();
		});
	});

}

function fullimage() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {
			code : 'full'
		}, function(response) {
			if (!response) {
				chrome.tabs.executeScript(null, {
					file : "js/content_script.js"
				});
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendMessage(tab.id, {
						code : 'full'
					}, function(response) {
						localStorage["imageJPG"] = response.farewell;
						openEdit()
					});
				});
			} else {
				localStorage["imageJPG"] = response.farewell;
				openEdit()
			}
		});
	});
}

function extractImage() {
	window.open(localStorage["imageJPG"]);
}

$(function() {
	$('#takeShot').click(getImageURL);
	$('#openEditor').click(openEdit);
	$('#extractImage').click(extractImage);
	$('#fullImage').click(fullimage);
	$('#captureVisibleTab').click(captureVisibleTabOnly);

	$('#takeShot').click('click', trackButton);
	$('#openEditor').click('click', trackButton);
	$('#extractImage').click('click', trackButton);
	$('#fullImage').click(trackButton);
	$('#captureVisibleTab').click(trackButton);

});
