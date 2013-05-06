


function getImageURL() {
	chrome.tabs.query({active: true}, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			tab = tab[0];
			chrome.tabs.sendMessage(tab.id, {
				code : 'image',
				greeting : img
			}, function(response) {
				if (!response) {
					chrome.tabs.executeScript(tab.id, {
						file : "js/content_script.js"
					});

					/*chrome.tabs.query({active: true}, function(tab2) {*/
						/*chrome.tabs.captureVisibleTab(null, function(img) {*/
							chrome.tabs.sendMessage(tab.id, {
								code : 'image',
								greeting : img
							});
						/*});*/
					/*});*/

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
var commands = {
	"open-editor" : openEdit,
	"select-area" : getImageURL,
	"visible-image" : captureVisibleTabOnly,
	"full-image" : fullimage,
	"extract-image" : extractImage,
	"set-image": function (request) {
		localStorage["imageJPG"] = request.imageJPG;	
	}
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var command = commands[request.type]; 
	if (command) {
		command(request);
	}
	
});

chrome.commands.onCommand.addListener(function(command) {
		console.log(command);

	var commandToCall = commands[command];
	if (commandToCall) {
		commandToCall();
	}
});
