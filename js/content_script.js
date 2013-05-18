var imgURL = '';
var ESCAPE_KEY = 27;
var firstTime, canvas, modal, image, ias;

//When the user clicks Take Shot
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('message')
	if (request.code === 'image') {
		if ( typeof firstTime === 'undefined') {
			initialiseModal();
			modal.open({});
			$('body').addClass('fixed');
			firstTime = true;
		}
		imgURL = request.greeting;
		$('#easyCaptureTarget').attr('src', imgURL);
		if (!ias) { ;
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
	} else if (request.code === 'fullImage') {
		window.open(request.imagen);
	} else {
		if ($(document).height() == $(window).height() && $(document).width() == $(window).width()) {
			console.log('return')
			chrome.runtime.sendMessage({
				type : 'visible-image',
			});
			return;
		}

		$(window).on('scroll', function(event) {
			if (document.body.scrollTop === 0) {
				$(window).off('scroll');
				chrome.runtime.sendMessage({
					type: 'build-full-image',
					documentHeight:  $(document).height(),
					documentWidth:  $(document).width()
				});
				getFullImage();
			}
		});
		window.scrollTo($(document).width(), $(document).height());
		window.scrollTo(0, 0);

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
		type : 'set-image',
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

	var documentHeight = $(document).height();
	var documentWidth = $(document).width();
	var screenHeight = $(window).height();
	var screenWidth = $(window).width();
	var captureVisibleTimesY = Math.floor(documentHeight / screenHeight);
	var captureVisibleTimesX = Math.floor(documentWidth / screenWidth);
	var lastCaptureSizeY = documentHeight - screenHeight * captureVisibleTimesY;
	var lastCaptureSizeX = documentWidth - screenWidth * captureVisibleTimesX;

	var i;
	var k;
	var currentTop = 0, currentLeft = 0, currentWidth = 0, currentHeight = 0;
	var arrayImages = [];

	for ( i = 0; i < captureVisibleTimesY; i++) {
		currentTop = i * screenHeight;

		for ( k = 0; k < captureVisibleTimesX; k++) {
			currentLeft = k * screenWidth;

			arrayImages.push({
				top : currentTop,
				left : currentLeft,
				offsetTop : 0,
				offsetLeft : 0,
				height : screenHeight,
				width : screenWidth,
				corner : ''
			});

		}
	}

	// Corner cases (top)
	if (documentHeight % screenHeight !== 0) {
		for ( k = 0; k < captureVisibleTimesX; k++) {
			currentLeft = k * screenWidth;

			arrayImages.push({
				top : documentHeight - lastCaptureSizeY,
				left : currentLeft,
				offsetTop : lastCaptureSizeY,
				offsetLeft : 0,
				height : screenHeight,
				width : screenWidth,
				corner : 'top'
			});
		}
	}

	// Corner cases (left)
	if (documentWidth % screenWidth !== 0) {
		for ( k = 0; k < captureVisibleTimesY; k++) {
			currentTop = k * screenHeight;

			arrayImages.push({
				top : currentTop,
				left : documentWidth - lastCaptureSizeX,
				offsetTop : 0,
				offsetLeft : lastCaptureSizeX,
				height : screenHeight,
				width : screenWidth,
				corner : 'left'
			});
		}
	}

	// Corner case (top & left)
	if (documentHeight % screenHeight !== 0 && documentWidth % screenWidth !== 0) {
		arrayImages.push({
			top : documentHeight - lastCaptureSizeY,
			left : documentWidth - lastCaptureSizeX,
			offsetTop : lastCaptureSizeY,
			offsetLeft : lastCaptureSizeX,
			height : screenHeight,
			width : screenWidth,
			corner : 'both'
		});
	}

	// TODO Handle special border case

//	var captures = [];
	function dequeue() {
		console.log('dequeue');
		if (arrayImages.length) {
			var where = arrayImages.pop();
			var lastOne = false;
			if (!arrayImages.length){
				lastOne = true;
			}
			$(window).on('scroll', function(event) {

				$(window).off('scroll');
				setTimeout(function() {
					console.log('manda imagen');
					chrome.runtime.sendMessage({
						type : 'capture-tab-image',
						where: where,
						lastOne: lastOne
					}, function(response) {
					//	captures.push([response.img, where]);
						if(response.ok == 'ok'){
							dequeue();
						}
						
					});
				}, 250);
			})
			window.scrollTo(where.left, where.top);
		}

	}

	dequeue();

	/*
	 var fullCanvas = $('<canvas style="display:none" id="easyCaptureCanvas" />');
	 $(document).append(fullCanvas);
	 fullCanvas.height = documentHeight;
	 fullCanvas.width = documentWidth;

	 arrayImages.forEach(function(img) {
	 fullCanvas.drawImage(img.img, img, left, img.top);
	 });
	 window.open(fullCanvas.toDataURL());*/

}
