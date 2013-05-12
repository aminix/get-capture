var imgURL = '';
var ESCAPE_KEY = 27;
var firstTime, canvas, modal, image, ias;

//When the user clicks Take Shot
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	$('body').focus();
	if (request.code === 'image') {
		if ( typeof firstTime === 'undefined') {
			initialiseModal();
			modal.open({});
			$('body').addClass('fixed');
			firstTime = true;
		}
		imgURL = request.greeting;
		$('#easyCaptureTarget').attr('src', imgURL);
		if (!ias) { debugger;
			$('body').append($('<div id="imageAreaSelect" />'));
			ias = $('#easyCaptureTarget').imgAreaSelect({
				instance : true,
				handles : true,
				x1 : 0,
				y2 : 0,
				x2 : 200,
				y2 : 200,
				onSelectEnd : getSelectedImage,
				parent : '#imageAreaSelect'
			});
		}
		$('body').on('keydown', escapeListener);
	} else {
		getFullImage();
	}
	return true;
});

function escapeListener(event) {
	if (event.which === ESCAPE_KEY) {
		$('#imageAreaSelect').remove();
		ias = undefined;
		modal.close();

		firstTime = undefined;
		return false;
	}
}

function getSelectedImage(img, selection) {
	document.getElementById("easyCaptureCanvas").height = selection.height;
	document.getElementById("easyCaptureCanvas").width = selection.width;
	$ctx = document.getElementById('easyCaptureCanvas').getContext("2d");
	$ctx.drawImage(document.getElementById('easyCaptureTarget'), selection.x1, selection.y1, selection.width, selection.height, 0, 0, selection.width, selection.height);
	$imageJPG = document.getElementById('easyCaptureCanvas').toDataURL('image/jpeg');
	chrome.extension.sendMessage({
		imageJPG : $imageJPG
	});
}

function initialiseModal() {
	modal = ( function() {
			var method = {};

			// Open the modal
			method.open = function(settings) {
				$image.show();
			};

			// Close the modal
			method.close = function() {
				$('#easyCaptureTarget').remove();
				$('body').removeClass('fixed');
			};

			$image = $('<img id="easyCaptureTarget" />');
			canvas = $('<canvas style="display:none" id="easyCaptureCanvas" />');

			$image.hide();

			$('body').append($image, canvas);

			return method;
		}());
}

function getFullImage() {
		console.log('window ' + $(window).height());
		console.log('document ' + $(document).height());
		console.log('window offset ' + $(window).scrollTop());

		var documentHeight = $(document).height();
		var documentWidht = $(document).width();
		var screenHeight = $(window).height();
		var screenWidth = $(window).width();
		var captureVisibleTimes = Math.floor(documentHeight / screenHeight);
		var lastCaptureSize = documentHeight - screenHeight * captureVisibleTimes;

		var i;
		var currentTop = 0;
		var currentLeft = 0;
		var arrayImages = [];
		
		for ( i = 0; i < captureVisibleTimes; i++) {
			window.scrollTo(currentLeft, currentTop);
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.captureVisibleTab(null, function(img) {
					arrayImages.push({
						top: currentTop,
						left: currentLeft,
						img: img
					})
				});
			});
		}
		var fullCanvas = $('<canvas style="display:none" id="easyCaptureCanvas" />');
		$(document).append(fullCanvas);
		fullCanvas.height = documentHeight;
		fullCanvas.width = documentWidth;
		
		arrayImages.forEach(function(img) {
			fullCanvas.drawImage(img.img, img,left, img.top);
		});
		window.open(fullCanvas.toDataURL());

	
}
