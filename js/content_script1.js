var imgURL = '';
var ESCAPE_KEY = 27;
var firstTime, canvas, modal, image, ias;

//When the user clicks Take Shot
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	debugger;
	if (typeof firstTime === 'undefined'){
	//	alert('undefined');
		initialiseModal();
		modal.open({});
		firstTime = true;
	}		
	
	imgURL = request.greeting;
	$('#target').attr('src', imgURL);
	alert('SRC');
	ias = $('#target').imgAreaSelect({
			instance : true,
			handles : true,
			onSelectEnd : getSelectedImage
		});
	$('body').on('keydown', escapeListener);

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
			var method = {}  ;

			// Open the modal
			method.open = function(settings) {
				$image.show();
			};

			// Close the modal
			method.close = function() {
				$('#target').remove();
				
		//		$('body').removeClass('fixed');
				//		$(window).unbind('resize.modal');
			};

			$image = $('<img id="target" />');
			$canvas = $('<canvas style="display:none" id="canvas" />');

			$image.hide();

			$(document).ready(function() {
				$('body').append($image, $canvas);
			});

			return method;
		}());
}