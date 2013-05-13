var imgURL = '';
var ESCAPE_KEY = 27;
var firstTime, canvas, modal, image, ias;

//When the user clicks Take Shot
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.code === 'image') {
		if ( typeof firstTime === 'undefined') {
			initialiseModal();
			modal.open({});
			$('body').addClass('fixed');
			firstTime = true;
		}
		imgURL = request.greeting;
		console.log('imgURL: ' + imgURL);
		$('#easyCaptureTarget').attr('src', imgURL);
		if (!ias) {
			debugger;
			$('body').append($('<div id="imageAreaSelect" />'));
			ias = $('#easyCaptureTarget').imgAreaSelect({
				instance : true,
				handles : true,
				x1: 0,
				y2: 0,
				x2: 200,
				y2: 200,
				onSelectEnd : getSelectedImage,
				parent : '#imageAreaSelect'
			});
		}
		$('body').on('keydown', escapeListener);
	} else {
		var canvas = $('body').html2canvas({
			proxy : '',
			onrendered : function(canvas) {
				var img = canvas.toDataURL()
			  sendResponse({farewell: img});
			},
		});

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
/*		console.log('setea imagen');*/
		type: 'set-image',
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