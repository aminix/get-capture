var imgURL = '';

var modal = ( function() {
		var method = {}, $overlay, $modal, $image, $close;

		// Open the modal
		method.open = function(settings) {

			$modal.css({
				width : settings.width || 'auto',
				height : settings.height || 'auto'
			})

			$(window).bind('resize.modal', method.center);

			$modal.show();
			$overlay.show();
		};

		// Close the modal
		method.close = function() {
			$modal.hide();
			$overlay.hide();
			$(window).unbind('resize.modal');
		};

		$overlay = $('<div id="overlay"></div>');
		$modal = $('<div id="modal"></div>');
		$image = $('<img id="target" src="imgURL" width="640" height="480">')

		$modal.hide();
		$overlay.hide();
		$content.append($image);
		$modal.append($image);

		$(document).ready(function() {
			$('body').append($overlay, $modal);
		});

		return method;
	}());

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	imgURL = request.greeting;
	document.getElementById('target').src = imgURL;
	modal.open({});
});





/*
$(function() {
var canvas = $('body').html2canvas({
onrendered: function(canvas) {
alert("NONO");
var img = canvas.toDataURL()
window.open(img);
},
allowTaint:true,
svgRendering:true
});
});*/

//   var queue = html2canvas.Parse();
//    var canvas = html2canvas.Renderer(queue,{elements:{length:1}});  }
//debugger;

