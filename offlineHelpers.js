(function(offlineHelpers){

// This function registers all events from the application cache. Results are published 
// to the console. To customize an event, just add a new event listerner.
offlineHelpers.registerEvents = function (){
	// The several events available in application cache
	var events = ['cached','checking','downloading','error',
					'noupdate','obsolete','progress','updateready'];

	// Setting the events to printout what's going on
	for(var i=0; i < events.length; i++) {
		var e = events[i];
		applicationCache.addEventListener(e, 
			function(evt){console.log('Event fired: ' + evt.type); console.log(evt);}, false)
	}

	// Setting update ready to use the new cache and reload the page
	applicationCache.addEventListener('updateready', function(evt){
		console.log('Swapping the cache'); 
		applicationCache.swapCache();
		location.reload();
	}, false)
}

// Transforms a URL on a relative path
function getRelativePath (path) {
	var servername = document.location.protocol + '//' +  document.location.hostname;
	var folderpath = document.baseURI.replace(/[^\/]*$/, '');
	if (path.indexOf(folderpath) == 0)
		return path.substr(folderpath.length);
	else if (path.indexOf(servername) == 0)
		return path.substr(servername.length);
	else
		return path;
}

// Based on a CSS style, get the referenced files
function getFilesFromStyle (style) {
	var res = '';
	// Image from style
	if (style.backgroundImage != '') {
		var re = /url\(([^\)]+)\)/;
		var out = re.exec(style.backgroundImage);
		if (out && out.length > 1) {
			res += getRelativePath(out[1]) + '\n';
		}
	}
	return res;
}

// Get the files referenced from a stylesheet
function getFilesFromStylesheet (stylesheet) {
	var res = '';
	if (stylesheet.href) res += getRelativePath(stylesheet.href) + '\n';
	// Check the rules for this stylesheet
	for (var j = 0; j < stylesheet.cssRules.length; j++) {
		var rule = stylesheet.cssRules[j];
		// Check for imports
		if (rule instanceof CSSImportRule) {
			console.log('Found an import: ' + rule.href);
			res += getFilesFromStylesheet(rule.styleSheet);
		}
		// Check for files in rule
		if (rule.style)
			res += getFilesFromStyle(rule.style);
	}
	return res;
}

// Create a cache manifest based on the files used by the page
offlineHelpers.getCacheFile = function () {
	var res = 'CACHE MANIFEST\n\n';
	
	console.log('Getting stylesheets');
	res += '# CSS Files\n';
	for (var i = 0; i < document.styleSheets.length; i++) 
		res += getFilesFromStylesheet(document.styleSheets[i]);
	
	console.log('Getting JS files');
	res += '\n# Javascript Files\n';
	for (var i = 0; i < document.scripts.length; i++)
		if (document.scripts[i].src) res += getRelativePath(document.scripts[i].src) + '\n';

	console.log('Getting Image files');
	res += '\n# Image Files\n';
	for (var i = 0; i < document.images.length; i++)
		if (document.images[i].src) res += getRelativePath(document.images[i].src) + '\n';
	console.log(res);
}

})(window.offlineHelpers = window.offlineHelpers || {});