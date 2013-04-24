document.onselectstart = function(){ return false; }

var ctx;
var actions = ["draw", "line", "square", "circle"];
var action;
var fullFigure = false;
var clicked = false;
var mousedownCoords = [0,0];
var mouseupCoords = [0,0];
var previousCoords = [0,0];
var headerHeight = 10;
var headerWidth = 10;
var pageCoords = [0,0];
var clientCoords = [0,0];


$(document).ready(function(){ 
	init();
	var pastedImage = new Image();
	pastedImage.src = localStorage["imageJPG"];
	var canvas = document.getElementById('printscreen_img');
	
	setTimeout(function(){
		canvas.height = pastedImage.naturalHeight;
		canvas.width = pastedImage.naturalWidth;
		ctx.drawImage(pastedImage, 0, 0);
	},200)
});

function init() {
	ctx = document.getElementById('printscreen_img').getContext('2d');;	
	
	$("#printscreen_img").mousedown(function(e){
		mouseDownAction(e);
    }).mouseup(function(e){
		mouseUpAction(e);
    }).mousemove(function(e){
		mouseMoveAction(e);
	});
	
	document.getElementById("printEditor").addEventListener("click", function(){
        window.print();
        return false;
    });
	
	document.getElementById("setDrawButton").addEventListener("click", function(){
        setAction(0);
    });
	
	document.getElementById("setLineButton").addEventListener("click", function(){
        setAction(1);
    });
	
	document.getElementById("setSquareButton").addEventListener("click", function(){
		fullFigure = false;
        setAction(2);
    });
	
	document.getElementById("setCircleButton").addEventListener("click", function(){
		fullFigure = false;
        setAction(3);
    });
	
	document.getElementById("setFullSquareButton").addEventListener("click", function(){
		fullFigure = true;
        setAction(2);
    });

	document.getElementById("setFullCircleButton").addEventListener("click", function(){
        fullFigure = true;
        setAction(3);
    });

	var colorSelector = $('input[name=colorSelector]');
	colorSelector.change(function(event){
		ctx.fillStyle =  colorSelector.val();
		ctx.strokeStyle = colorSelector.val();
	});

	setAction(0);
}

function mouseDownAction(e) {
	mousedownCoords = [e.pageX, e.pageY];
	printInformation();
	switch(action)
	{
	case 'draw':
		draw_mouseDown(e);
		break;
	case 'line':
		line_mouseDown(e);
		break;
	case 'square':
		square_mouseDown(e);
		break;
	case 'circle':
		circle_mouseDown(e);
		break;
	default:
		//do nothing
	}
}

function mouseUpAction(e) {
	mouseupCoords = [e.pageX, e.pageY];
	printInformation();
	
	switch(action)
	{
	case 'draw':
		draw_mouseUp(e);
		break;
	case 'line':
		line_mouseUp(e);
		break;
	case 'square':
		square_mouseUp(e);
		break;
	case 'circle':
		circle_mouseUp(e);
		break;
	default:
		//do nothing
	}
}

function mouseMoveAction(e) {
	pageCoords = [e.pageX, e.pageY];
	clientCoords = [e.clientX, e.clientY];
	printInformation();
	
	switch(action)
	{
	case 'draw':
		draw_mouseMove(e);
		break;
	case 'line':
		line_mouseMove(e);
		break;
	case 'square':
		square_mouseMove(e);
		break;
	case 'circle':
		circle_mouseMove(e);
		break;
	default:
		//do nothing
	}
}

function setAction(actionNumber) {
	action = actions[actionNumber];
	resetClasses();
	$("#printscreen_img").addClass(action);
}

function resetClasses() {
	for (a in actions) {
		$("#printscreen_img").removeClass(a);
	}
}

/** Draw **/
function draw_mouseDown(e) {
	clicked = true;
	previousCoords = [e.pageX, e.pageY];
}
function draw_mouseUp(e) {
	clicked = false;
}
function draw_mouseMove(e) {
	if(clicked) {
		ctx.beginPath();
		ctx.moveTo(previousCoords[0] - headerWidth, previousCoords[1] - headerHeight);
		ctx.lineTo(e.pageX - headerWidth, e.pageY - headerHeight);
		ctx.stroke();
		previousCoords = [e.pageX, e.pageY];
	}
}

/** Draw Line **/
function line_mouseDown(e) {
	clicked = true;
	ctx.beginPath();
	ctx.moveTo(mousedownCoords[0] - headerWidth, mousedownCoords[1] - headerHeight);
}
function line_mouseUp(e) {
	clicked = false;
	ctx.lineTo(mouseupCoords[0] - headerWidth, mouseupCoords[1] - headerHeight);
    ctx.stroke();
}
function line_mousemMve(e) {
	if(clicked) {
	}
}

/** Draw Square **/
function square_mouseDown(e) {
}
function square_mouseUp(e) {
	var x = mousedownCoords[0] - headerWidth;
	var y = mousedownCoords[1] - headerHeight;
	var width = mouseupCoords[0] - mousedownCoords[0];
	var height = mouseupCoords[1] - mousedownCoords[1];
	if(fullFigure) {
		ctx.fillRect(x, y, width, height);
	} else {
		ctx.strokeRect(x, y, width, height);
	}
}
function square_mouseMove(e) {
	if(clicked) {
	}
}

/** Draw Circle **/
function circle_mouseDown(e) {
}
function circle_mouseUp(e) {
	var x1 = mousedownCoords[0] - headerWidth;
	var y1 = (mousedownCoords[1] - headerHeight);
	var x2 = mouseupCoords[0] - headerWidth;
	var y2 = (mouseupCoords[1] - headerHeight);
	var yMiddle = (y1 + y2) / 2;
	if(fullFigure) {
		ctx.beginPath();
		ctx.moveTo(x1,yMiddle);
		ctx.bezierCurveTo(x1, y2, x2, y2, x2, yMiddle);
		ctx.stroke();
		ctx.bezierCurveTo(x2, y1, x1, y1, x1, yMiddle);
		ctx.stroke();
		ctx.fill();
	} else {
		ctx.beginPath();
		ctx.moveTo(x1,yMiddle);
		ctx.bezierCurveTo(x1, y2, x2, y2, x2, yMiddle);
		ctx.stroke();
		ctx.bezierCurveTo(x2, y1, x1, y1, x1, yMiddle);
		ctx.stroke();
	}
}
function circle_mouseMove(e) {
	if(clicked) {
	}
}

/** Draw Image **/
$("html").pasteImageReader(function(results) {
	var pastedImage = new Image();
	pastedImage.src = results.dataURL;
	var canvas = document.getElementById('printscreen_img');
	
	setTimeout(function(){
		canvas.height = pastedImage.naturalHeight;
		canvas.width = pastedImage.naturalWidth;
		ctx.drawImage(pastedImage, 0, 0);
	},200)
});

function printInformation() {
	$("#mousedownCoords").text(mousedownCoords[0] + ", " +  mousedownCoords[1]);
	$("#mouseupCoords").text(mouseupCoords[0] + ", " +  mouseupCoords[1]);
	$("#previousCoords").text(previousCoords[0] + ", " +  previousCoords[1]);
	$("#pageCoords").text(pageCoords[0] + ", " +  pageCoords[1]);
	$("#clientCoords").text(clientCoords[0] + ", " +  clientCoords[1]);
}

