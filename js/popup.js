chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery-1.9.1.min.js"
});
chrome.tabs.executeScript(null, {
	file : "js/vendor/jquery.imgareaselect.pack.js"
});

chrome.tabs.insertCSS(null, {
	file : "css/modal.css"
})
chrome.tabs.insertCSS(null, {
	file : "css/imgareaselect/imgareaselect-default.css"
})

function getImageURL() {
	$('.popupButton').attr('disabled', '');
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.captureVisibleTab(null, function(img) {
			chrome.tabs.sendMessage(tab.id, {
				greeting : img
			}, function(response) {
				if (!response) {
					chrome.tabs.executeScript(null, {
						file : "js/content_script.js"
					});

					chrome.tabs.getSelected(null, function(tab) {
						chrome.tabs.captureVisibleTab(null, function(img) {
							chrome.tabs.sendMessage(tab.id, {
								greeting : img
							})
						})
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

function extractImage() {
	window.open(localStorage["imageJPG"]);

}

$(function() {
	$('#takeShot').click(getImageURL);
	$('#openEditor').click(openEdit);
	$('#extractImage').click(extractImage);
	

	$('#takeShot').click('click', trackButton);
	$('#openEditor').click('click', trackButton);
	$('#extractImage').click('click', trackButton);


});




var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40613414-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


function trackButton(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};


