var imgURL = '';
var ESCAPE_KEY = 27;
var firstTime, modal, ias, ready = false, popupEvent = false;

function afterReadyAndPopupEvent() {
	if (ready && popupEvent) {
		$('#target').attr('src', imgURL);
		ias = $('#target').imgAreaSelect({
			instance : true,
			handles : true,
			onSelectEnd : getSelectedImage
		});
		$('body').on('keydown', escapeListener);
	}
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if ( typeof firstTime !== 'undefined') {
		imgURL = request.greeting;
		ready = true; popupEvent = true;
		afterReadyAndPopupEvent();
		return;
	}
	$(window).scrollTop();

	if ( typeof modal === 'undefined') {
		initialiseModal();
	}

	firstTime = true;
	imgURL = request.greeting;
	$('body').addClass('fixed');
	modal.open({});
	popupEvent = true;
	afterReadyAndPopupEvent();
});

function escapeListener(event) {
	if (event.which === ESCAPE_KEY) {
		modal.close();
		ias.setOptions({
			hide : true,
			disable : true
		});
		firstTime = undefined;
		return false;
	}
}

function getSelectedImage(img, selection) {
	document.getElementById("canvas").height = selection.height;
	document.getElementById("canvas").width = selection.width;
	$ctx = document.getElementById('canvas').getContext("2d");
	$ctx.drawImage(document.getElementById('target'), selection.x1, selection.y1, selection.width, selection.height, 0, 0, selection.width, selection.height);
	$imageJPG = document.getElementById('canvas').toDataURL('image/jpeg');
	chrome.extension.sendMessage({
		imageJPG : $imageJPG
	});
}

function initialiseModal() {
	modal = ( function() {
			var method = {}, $overlay, $modal, $image, $close;

			// Open the modal
			method.open = function(settings) {

				/*$modal.css({
				width : settings.width || 'auto',
				height : settings.height || 'auto',
				//top : 0
				//top : 0
				})*/
				//$(window).bind('resize.modal', method.center);

				$modal.show();
				//$overlay.show();
			};

			// Close the modal
			method.close = function() {
				$modal.hide();
				//$overlay.hide();
				$('body').removeClass('fixed');
				//		$(window).unbind('resize.modal');
			};

			//$overlay = $('<div id="overlay"></div>');
			$modal = $('<div id="modal"></div>');
			$image = $('<img id="target" />');
			$canvas = $('<canvas style="display:none" id="canvas" />');

			$modal.hide();
			//$overlay.hide();
			$modal.append($image);
			$modal.append($canvas);

			$(document).ready(function() {
				//$('body').append($overlay, $modal);
				$('body').append($modal);
				ready = true;
				afterReadyAndPopupEvent();
			});

			return method;
		}());
}
