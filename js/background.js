var captures = [];
//var fullCanvas;

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
		chrome.tabs.captureVisibleTab(null, {
			format : 'png'
		}, function(img) {
			tab = tab[0];
			chrome.tabs.sendMessage(tab.id, {
				code : 'image',
				greeting : img
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
		chrome.tabs.captureVisibleTab(null, {
			format : 'png'
		}, function(img) {
			writeToFile('test', img, openEdit);
		});
	});

}

function fullimage() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {
			code : 'full'
		});
	});
}

function extractImage() {
	window.open(localStorage["imageJPG"]);
}

function captureTabImage(request, sendResponse) {
	console.log('capture ', request)
	chrome.tabs.captureVisibleTab(null, {
		format : "png"
	}, function(img) {
		captures.push([img, request.where]);
		sendResponse({
			ok : 'ok'
		});

	});
}

function errorHandler(e) {
	var msg = '';

	switch (e.code) {
		case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
		case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
		case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
		case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
		case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
		default:
			msg = 'Unknown Error';
			break;
	};

	console.log('Error: ' + msg);
}

function createWriteImage(fileEntry, img, callback) {
	return function writeImage() {
		fileEntry.createWriter(function(fileWriter) {
			var blob = new Blob([img]);

			fileWriter.onwriteend = function() {
				if (callback) {
					callback();
				}

			};
			fileWriter.write(blob);
		}, errorHandler);
	}
}

function writeToFile(fileName, fullCanvasToURL, callback) {
	webkitStorageInfo.requestQuota(webkitStorageInfo.TEMPORARY, 100 * 1024 * 1024, function(freeBytes) {
		window.webkitRequestFileSystem(webkitStorageInfo.TEMPORARY, freeBytes, function(fs) {

			fs.root.getFile(fileName, {
				create : false
			}, function(fileEntry) {
				fileEntry.remove(function() {
					fs.root.getFile(fileName, {
						create : true
					}, function(fileEntry) {
						createWriteImage(fileEntry, fullCanvasToURL, callback)();
					}, errorHandler);
				}, function(e) {
					if (e.code === FileError.NOT_FOUND_ERR) {
						fs.root.getFile(fileName, {
							create : true
						}, function(fileEntry) {
							createWriteImage(fileEntry, fullCanvasToURL, callback)();
						}, errorHandler);
					} else {
						return errorHandler(e);
					}
				});
			}, function(e) {
				if (e.code === FileError.NOT_FOUND_ERR) {
					fs.root.getFile(fileName, {
						create : true
					}, function(fileEntry) {
						createWriteImage(fileEntry, fullCanvasToURL, callback)();
					}, errorHandler);
				} else {
					return errorHandler(e);
				}
			});

		}, errorHandler);
	}, errorHandler);
	console.log('ultimo')
	//		window.open(fullCanvas[0].toDataURL())
	//	localStorage["imageJPG"] = fullCanvas[0].toDataURL('image/png');

	//		window.open(fullCanvas[0].toDataURL());
	return;
}

function copyToCanvas(ctx, fullCanvas) {
	console.log('entra a copy to canvas')
	if (!captures.length) {
		writeToFile('test', fullCanvas[0].toDataURL('image/png'), openEdit);
	}

	var item = captures.pop();
	var imageSrc = item[0];
	var imageInfo = item[1];
	var fullImageCanvas = new Image();
	fullImageCanvas.src = imageSrc;
	fullImageCanvas.onload = function(event) {

		console.log('sx ', imageInfo.offsetLeft);
		console.log('sy ', imageInfo.offsetTop);
		console.log('swidth ', imageInfo.width - imageInfo.offsetLeft);
		console.log('sheight ', imageInfo.height - imageInfo.offsetTop);
		console.log('x ', imageInfo.left);
		console.log('y ', imageInfo.top);
		console.log('width ', imageInfo.width - imageInfo.offsetLeft);
		console.log('height ', imageInfo.height - imageInfo.offsetTop);

		if (imageInfo.corner == '') {

			ctx.drawImage(fullImageCanvas, imageInfo.offsetLeft, imageInfo.offsetTop, imageInfo.width - imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop, imageInfo.left, imageInfo.top, imageInfo.width - imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop);

		} else if (imageInfo.corner == 'top') {
			ctx.drawImage(fullImageCanvas, imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop, imageInfo.width - imageInfo.offsetLeft, imageInfo.offsetTop, imageInfo.left, imageInfo.top, imageInfo.width - imageInfo.offsetLeft, imageInfo.offsetTop);
		} else if (imageInfo.corner == 'left') {
			console.log('corner es');
			ctx.drawImage(fullImageCanvas, imageInfo.width - imageInfo.offsetLeft, imageInfo.offsetTop, imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop, imageInfo.left, imageInfo.top, imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop);
		} else {
			console.log('corner es');
			//		ctx.drawImage(fullImageCanvas, imageInfo.width -imageInfo.offsetLeft, imageInfo.height - imageInfo.offsetTop,  imageInfo.offsetLeft,  imageInfo.offsetTop, imageInfo.left, imageInfo.top, imageInfo.offsetLeft, imageInfo.offsetTop);
		}
		copyToCanvas(ctx, fullCanvas);
	}
}

function buildFullImage(request) {
	//	captures = request.captures;
	//.reverse();
	var fullCanvas = $('<canvas style="display:none" id="easyCaptureFullCanvas" />');
	$('body').append(fullCanvas);
	fullCanvas.height(request.documentHeight);

	fullCanvas.width(request.documentWidth);
	var ctx = fullCanvas[0].getContext("2d");
	ctx.canvas.width = request.documentWidth;
	ctx.canvas.height = request.documentHeight;
	/*while (captures.length) {*/
	copyToCanvas(ctx, fullCanvas);
	/*}*/
	console.log('dibujo ');
}

function startFullImage(request) {
	fullCanvas = $('<canvas style="display:none" id="easyCaptureFullCanvas" />');
	$('body').append(fullCanvas);
	var ctx = fullCanvas[0].getContext("2d");
	ctx.canvas.width = request.documentWidth;
	ctx.canvas.height = request.documentHeight;
	console.log('creo canvas ');
}

var commands = {
	"open-editor" : openEdit,
	"select-area" : getImageURL,
	"visible-image" : captureVisibleTabOnly,
	"full-image" : fullimage,
	"extract-image" : extractImage,
	"set-image" : function(request, sendResponse) {
		writeToFile('test', request.imageJPG);
	},
	"capture-tab-image" : function(request, sendResponse) {
		console.log('recibio msg')
		captureTabImage(request, sendResponse);
	},
	"build-full-image" : function(request, sendResponse) {
		//		startFullImage(request);
		buildFullImage(request);
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
