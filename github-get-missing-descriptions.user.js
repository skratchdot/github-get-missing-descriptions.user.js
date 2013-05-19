// ==UserScript==
// @name           GitHub: Get Missing Descriptions
// @namespace      https://github.com/skratchdot/github-get-missing-descriptions.user.js
// @description    If there are missing descriptions on a Github profile page, a button will be added. When clicked, ajax requests will be made to grab the descriptions.
// @include        https://github.com/*
// @match          https://github.com/*
// @require        https://gist.github.com/skratchdot/5604120/raw/_init.js
// @require        https://gist.github.com/skratchdot/5604120/raw/get-missing-descriptions.js
// @run-at         document-end
// @grant          none
// @icon           http://skratchdot.com/favicon.ico
// @downloadURL    https://github.com/skratchdot/github-get-missing-descriptions.user.js/raw/master/github-get-missing-descriptions.user.js
// @updateURL      https://github.com/skratchdot/github-get-missing-descriptions.user.js/raw/master/github-get-missing-descriptions.user.js
// @version        1.9
// ==/UserScript==
/*global SKRATCHDOT, document */

// This code is only going to run for browsers that don't support
// the @require annotation when executing userscripts.
if ('undefined' === typeof SKRATCHDOT) {
	var addScript = function (src) {
		'use strict';
		var script = document.createElement('script');
		script.src = src;
		document.body.appendChild(script);
		document.body.removeChild(script);
	};

	// Required by: repo-filter-info
	addScript('https://gist.github.com/skratchdot/5604120/raw/get-missing-descriptions.js');
}