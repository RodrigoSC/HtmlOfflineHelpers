# HTML Offline Helpers
## Introduction
`offlineHelpers` is a mini javascript library built to help me learn about [HTML5](http://www.html5rocks.com/en/) offline applications.

The library is work in progress, and right now it only does a couple of things: 

* It allows setting up cache events, to monitor what events are fired;
* It has an auxiliary function to help build [cache manifest](http://diveintohtml5.info/offline.html) files.

## Contents
* `offlineHelpers.js`: The actual mini-library, and all you need to download. Note that to use it you also need to have [jQuery](http://jquery.com/) referenced;
* Everything else: Just a sample app for tests. You can try out stuff on `test.html`.

## Building cache manifest files
To build the cache manifest file, just put `offlineHelpers.js` on the same folder as the page you want to cache. Next, use [Chrome](https://www.google.com/intl/en/chrome/browser/) to access the page you want to cache (yes, it only works on chrome). Note that the page you're accessing must reference [jQuery](http://jquery.com/)!

If the page is not including the `offlineHelpers.js` file yet, type this in the console: `$.getScript('offlineHelpers.js')`

Next, run the auxiliary function `offlineHelpers.getCacheFile()` on the console, and you should see something like this on the console:

	CACHE MANIFEST
 	
	# CSS Files
	css/bootstrap.css
	img/glyphicons-halflings.png
	img/glyphicons-halflings-white.png
	css/jumbotron-narrow.css
	css/jumbotron-responsive.css
	
	# Javascript Files
	http://code.jquery.com/jquery-1.10.1.min.js

	# Image Files
	img/creatures.jpg

Check this more detailed [blog post](http://kutuma.blogspot.pt/2013/08/automatically-building-cache-manifest.html) for full instructions.

### Some notes on using the application cache

You will find bugs! Use `chrome://appcache-internals/`

Cache manifests have the `text/cache-manifest` mime-type. On [Apache](http://www.apache.org/) you can set this up by having the following configuration on your `.htaccess` file:

	AddType text/cache-manifest .manifest
	<Files "*.manifest">
		ExpiresActive On
		ExpiresDefault "access"
	</Files> 

In some languages you can set the headers on the file itself. In [PHP](http://php.net/) you can do something like `<?php header('Content-type: text/cache-manifest'); ?>`.

## Registering events
To see what's going on at the event level with your page, just include the following code right before the close `body` tag:

	<script src="offlineHelpers.js"></script>
	<script>
	    $(function (){
    	    offlineHelpers.registerEvents();
	    });
	</script>

Once this is set, using the application cache will result in the following messages showing up on your console:

	Document was loaded from Application Cache
	Application Cache Checking event
	Application Cache NoUpdate event
	Event fired: checking
	> Event
	Event fired: noupdate
	> Event
