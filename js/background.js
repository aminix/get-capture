chrome.manifest = chrome.app.getDetails();

var injectIntoTab = function(tab) {
	// You could iterate through the content scripts here
	var scripts = chrome.manifest.content_scripts[0].js;
	var style = chrome.manifest.content_scripts[0].css;
	var i = 0, s = scripts.length;
	var k = 0, c = style.lenght;
	for (; i < s; i++) {
		chrome.tabs.executeScript(tab.id, {
			file : scripts[i]
		});
	}
	for (; k < c; k++) {
		chrome.tabs.insertCSS(tab.id, {
			file : scripts[k]
		});
	}
}
// Get all windows
chrome.windows.getAll({
	populate : true
}, function(windows) {
	var i = 0, w = windows.length, currentWindow;
	for (; i < w; i++) {
		currentWindow = windows[i];
		var j = 0, t = currentWindow.tabs.length, currentTab;
		for (; j < t; j++) {
			currentTab = currentWindow.tabs[j];
			// Skip chrome:// and https:// pages
			if (! currentTab.url.match(/(chrome):\/\//gi)) {
				injectIntoTab(currentTab);
			}
		}
	}
});
function getImageURL() {
	chrome.tabs.query({
		active : true
	}, function(tab) {
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

					chrome.tabs.sendMessage(tab.id, {
						code : 'image',
						greeting : img
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

function captureTabImage(sendResponse){
	console.log('en background');
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			console.log('background va a mandar');
			sendResponse({img: img});
		});
	});
}

var commands = {
	"open-editor" : openEdit,
	"select-area" : getImageURL,
	"visible-image" : captureVisibleTabOnly,
	"full-image" : fullimage,
	"extract-image" : extractImage,
	"set-image" : function(request, sendResponse) {
		localStorage["imageJPG"] = request.imageJPG;
	},
	"capture-tab-image" : function(request, sendResponse) {
		captureTabImage(sendResponse);
	}
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var command = commands[request.type];
	if (command) {
		command(request, sendResponse);
	}
	return true;
});

chrome.commands.onCommand.addListener(function(command) {
	console.log(command);

	var commandToCall = commands[command];
	if (commandToCall) {
		commandToCall();
	}
});
