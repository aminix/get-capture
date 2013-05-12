var ESCAPE_KEY = 27;
var RETURN_KEY = 13;


document.onselectstart = function() {
	return false;
}
var canvas, context, canvaso, contexto;
var fullFigure = false;
var tool;
var tool_default = 'draw';

var stepArray = new Array();
var stepNumber = -1;

var naturalHeight;
var naturalWidth;

$(document).ready(function() {
	init();
});

function init() {
	//Original Canvas
	canvaso = document.getElementById('printscreen_img');
	contexto = canvaso.getContext('2d');

	//Temporary canvas
	var container = canvaso.parentNode;
	canvas = document.createElement('canvas');

	canvas.id = 'imageTemp';
	canvas.width = canvaso.width;
	canvas.height = canvaso.height;
	container.appendChild(canvas);

	context = canvas.getContext('2d');


	canvas.addEventListener('mousedown', canvasEvent, false);
	canvas.addEventListener('mousemove', canvasEvent, false);
	canvas.addEventListener('mouseup', canvasEvent, false);

	setButtonEventListener();

	var pastedImage = new Image();
	pastedImage.src = localStorage["imageJPG"];
	setTimeout(function() {
		naturalHeight = pastedImage.naturalHeight;
		naturalWidth = pastedImage.naturalWidth;
		canvas.height = naturalHeight;
		canvas.width = naturalWidth;
		canvaso.height = naturalHeight;
		canvaso.width = naturalWidth;
		
		$("#newWidthInput").attr("value", naturalWidth);
		$("#newHeightInput").attr("value", naturalHeight);
		context.drawImage(pastedImage, 0, 0);
		img_update();
	}, 200);

	toolChange(tool_default);
}

function setButtonEventListener() {

	$("#setDrawButton").click( function() {
		console.log('draw');
		toolChange("draw");
		return false;
	});

	$("#setLineButton").click(function() {
		console.log('line');
		toolChange("line");
		return false;
	});

	$("#setSquareButton").click(function() {
		console.log('sqare');
		fullFigure = false;
		toolChange("square");
		return false;
	});

	$("#setCircleButton").click(function() {
		console.log('circle');
		fullFigure = false;
		toolChange("circle");
		return false;
	});

	$("#setFullSquareButton").click(function() {
		console.log('square full');
		fullFigure = true;
		toolChange("square");
		return false;
	});

	$("#setFullCircleButton").click(function() {
		console.log('circle full');
		fullFigure = true;
		toolChange("circle");
		return false;
	});

	$("#stepBackButton").click(function() {
		console.log('back');
		stepBack();
		return false;
	});

	$("#stepForwardButton").click(function() {
		console.log('forward');
		stepForward();
		return false;
	});
	
	$("#setResizeButton").click(function() {
		resize($('#newWidthInput').val(), $('#newHeightInput').val());
		return false;
	});
	
	$("#setResetsButton").click(function() {
		resize(naturalWidth, naturalHeight);
		$("#newWidthInput").val(naturalWidth);
		$("#newHeightInput").val(naturalHeight);
		return false;
	});
	
	var colorSelector = $('#colorPicker');
	colorSelector.change(function(event) {
		context.strokeStyle = colorSelector.val();
	});
	
	var colorPickerFill = $('#colorPickerFill');
	colorPickerFill.change(function(event) {
		context.fillStyle = colorPickerFill.val();
	});
	
	var sizeSelector = $('#sizeSelect');
	sizeSelector.change(function(event) {
		context.lineWidth = sizeSelector.val();
	});

	$("#printEditor").click(function() {
		window.print();
		return false;
	});
	
	saveFunctionality();
	
	$('#setDrawButton').click('click', trackButton);
	$('#setLineButton').click('click', trackButton);
	$('#setSquareButton').click('click', trackButton);
	$('#setFullSquareButton').click('click', trackButton);
	$('#setCircleButton').click('click', trackButton);
	$('#setFullCircleButton').click('click', trackButton);
	$('#stepBackButton').click('click', trackButton);
	$('#stepForwardButton').click('click', trackButton);
	$('#colorSelector').click('click', trackButton);
	$('#printEditor').click('click', trackButton);
	$('#colorSelector').click('click', trackButton);
	$('#sizeSelect').click('click', trackButton);


}

function canvasEvent(ev) {
	ev._x = ev.layerX;
	ev._y = ev.layerY;

	var func = tool[ev.type];
	if (func) {
		func(ev);
	}
}

function toolChange(value) {
	if (tools[value]) {
		changeClass(value)
		tool = new tools[value]();
	}
}

function img_update() {
	contexto.drawImage(canvas, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	saveStep();
}

function saveStep() {
	stepNumber++;
	if (stepNumber < stepArray.length) {
		stepArray.length = stepNumber;
	}
	stepArray.push(canvaso.toDataURL());
}

function stepBack() {
	if (stepNumber > 0) {
		stepNumber--;
		var canvasPic = new Image();
		canvasPic.src = stepArray[stepNumber];
		canvasPic.onload = function() {
			contexto.drawImage(canvasPic, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
}

function stepForward() {
	if (stepNumber < stepArray.length - 1) {
		stepNumber++;
		var canvasPic = new Image();
		canvasPic.src = stepArray[stepNumber];
		canvasPic.onload = function() {
			contexto.drawImage(canvasPic, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
}
function resize(width, height) {
	var oldCanvas = canvaso.toDataURL("image/png");
	var img = new Image();
	img.src = oldCanvas;
	canvaso.width = width;
	canvaso.height = height;
	canvas.width = width;
	canvas.height = height;
	img.onload = function (){
		context.drawImage(img, 0, 0, width, height);
		img_update();
	};
}

var tools = {};

/** Draw **/
tools.draw = function() {
	var tool = this;
	this.started = false;

	this.mousedown = function(ev) {
		context.beginPath();
		context.moveTo(ev._x, ev._y);
		tool.started = true;
	};

	this.mousemove = function(ev) {
		if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.stroke();
		}
	};

	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		}
	};
};

/** Draw Line **/
tools.line = function() {
	var tool = this;
	this.started = false;

	this.mousedown = function(ev) {
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
	};

	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}

		var x = tool.x0, y = tool.y0, w = ev._x, h = ev._y;

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.beginPath();
		context.moveTo(x, y);
		clicked = false;
		context.lineTo(w, h);
		context.stroke();
	};

	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		}
	};
};

/** Draw Square **/
tools.square = function() {
	var tool = this;
	this.started = false;

	this.mousedown = function(ev) {
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
	};

	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}

		var x = Math.min(ev._x, tool.x0), y = Math.min(ev._y, tool.y0), w = Math.abs(ev._x - tool.x0), h = Math.abs(ev._y - tool.y0);

		context.clearRect(0, 0, canvas.width, canvas.height);

		if (!w || !h) {
			return;
		}

		if (fullFigure) {
			context.fillRect(x, y, w, h);
			context.strokeRect(x, y, w, h);
		} else {
			context.strokeRect(x, y, w, h);
		}
	};

	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		}
	};
};

/** Draw Circle **/
tools.circle = function() {
	var tool = this;
	this.started = false;

	this.mousedown = function(ev) {
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
	};

	this.mousemove = function(ev) {
		if (!tool.started) {
			return;
		}

		var x1 = tool.x0, y1 = tool.y0, x2 = ev._x, y2 = ev._y, yMiddle = (y1 + y2) / 2;

		context.clearRect(0, 0, canvas.width, canvas.height);

		context.beginPath();
		context.moveTo(x1, yMiddle);
		context.bezierCurveTo(x1, y2, x2, y2, x2, yMiddle);
		context.stroke();
		context.bezierCurveTo(x2, y1, x1, y1, x1, yMiddle);
		context.stroke();
		if (fullFigure) {
			context.fill();
		}
	};

	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		}
	};
};

/** Draw Image **/
$("html").pasteImageReader(function(results) {
	var pastedImage = new Image();
	pastedImage.src = results.dataURL;

	setTimeout(function() {
		canvas.height = pastedImage.naturalHeight;
		canvas.width = pastedImage.naturalWidth;
		canvaso.height = pastedImage.naturalHeight;
		canvaso.width = pastedImage.naturalWidth;
		context.drawImage(pastedImage, 0, 0);
		img_update();
	}, 200)
});

function changeClass(tool) {
	resetClasses();
	$("#printscreen_img").addClass(tool);
	$("#imageTemp").addClass(tool);
}

function resetClasses() {
	for (tool in tools) {
		$("#printscreen_img").removeClass(tool);
		$("#imageTemp").removeClass(tool);
	}
}

/** Init the Save functionality **/

function saveFunctionality() {

	$('body').on('keyup', '#fileName', function(event) {
		if ($('#fileName').val()) {
			$('#saveButton').removeClass('disabled');
			$('#saveButton').attr('download', $('#fileName').val());
		} else {
			$('#saveButton').addClass('disabled');
		}
	});

	$('body').on('click', '#saveButton', function(event) {
		if ($('#fileName').val()) {
			$('#saveImage').popover('hide');
		} else {
			return false;
		}
	});

	$('body').on('keydown', function(event) {
		if (event.keyCode === ESCAPE_KEY) {
			$('#saveImage').popover('hide');
		}
	});
	
	
	$('body').on('keydown','#fileName', function(event) {
		if (event.keyCode === RETURN_KEY) {
			 $('a#saveButton')[0].click()
		}
	});


	var root = $('<div/>').append($('<div id="popoverContainer"/>').append($('<input type="text" placeholder="Filename to save" id="fileName"></input>'), $('<span>.jpeg</span>'), $('<a class="btn btn-small disabled" id="saveButton" >Save!</a>')));
	$('#saveImage').popover({
		html : true,
		content : root.html(),
		placement : 'right'

	});

	$('#saveImage').click(function() {
		var data = $('#printscreen_img')[0].toDataURL("image/jpeg");
		$('#fileName').focus();
		$('#saveButton').attr('href', data);
	});
	
}

