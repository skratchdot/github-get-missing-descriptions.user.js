// ==UserScript==
// @name           GitHub: Get Missing Descriptions
// @namespace      https://github.com/skratchdot/github-get-missing-descriptions.user.js
// @description    If there are missing descriptions on a Github profile page, a button will be added. When clicked, ajax requests will be made to grab the descriptions.
// @include        https://github.com/*
// @match          https://github.com/*
// @run-at         document-end
// @icon           http://skratchdot.com/favicon.ico
// @downloadURL    https://github.com/skratchdot/github-get-missing-descriptions.user.js/raw/master/github-get-missing-descriptions.user.js
// @updateURL      https://github.com/skratchdot/github-get-missing-descriptions.user.js/raw/master/github-get-missing-descriptions.user.js
// @version        1.0
// ==/UserScript==
/*global jQuery */
/*jslint browser: true */

var userScript = function () {
	'use strict';

	var currentRequest = 0, // When 0, the button is enabled
		maxRequestsPerBatch = 50, // We only make this many requests per button click
		// FUNCTIONS
		addDescriptionButton,
		getDescription,
		handleClick,
		updateCounts;

	addDescriptionButton = function () {
		var $firstSimpleRepo = jQuery('body.page-profile ul.repo_list li.simple:first');
		if ($firstSimpleRepo.length > 0) {
			$firstSimpleRepo.before('<li id="skratchdot-missing-descriptions" style="text-align:center">' +
				'<input type="button" style="margin-bottom:10px;height:30px;cursor:pointer;" value="Get Missing Descriptions" />' +
				'<div class="body" style="padding-top:15px">' +
				'  <p class="fork-flag">' +
				'    <span></span>' +
				'    out of' +
				'    <span></span>' +
				'    simple repos now have descriptions' +
				'  </p>' +
				'</div>' +
				'</li>');
			updateCounts();
		}
	};

	getDescription = function () {
		var $firstItem = jQuery('ul.repo_list li.simple:not(.skratchdot-ajax):first');
		if (currentRequest > 0 && $firstItem.length > 0) {
			$firstItem.addClass('skratchdot-ajax');
			jQuery.ajax({
				url : $firstItem.find('h3 a').attr('href'),
				success : function (data) {
					var $data = jQuery(data),
						$item = $data.find('#repository_description');
					$item.find('span').remove();
					$firstItem.append('<div class="body">' +
				        '<p class="description">' +
				        $item.text() +
				        '</p>' +
						'<p class="updated-at">Last updated ' +
						jQuery('<div>').append($data.find('time.js-relative-date.updated').clone()).html() +
						'</p>' +
						'</div>');
					$firstItem.find('*').show();
					$firstItem.css('margin-bottom', '10px');
					currentRequest = currentRequest - 1;
					updateCounts();
					getDescription();
				},
				error : function () {
					currentRequest = currentRequest - 1;
					updateCounts();
					getDescription();
				}
			});
		}
	};

	handleClick = function () {
		if (currentRequest === 0 && jQuery('ul.repo_list li.simple:not(.skratchdot-ajax)').length > 0) {
			currentRequest = maxRequestsPerBatch;
			getDescription();
		}
	};

	updateCounts = function () {
		var container = jQuery('#skratchdot-missing-descriptions');
		container.find('span:eq(0)').text(jQuery('ul.repo_list li.simple.skratchdot-ajax').length);
		container.find('span:eq(1)').text(jQuery('ul.repo_list li.simple').length);
	};

	// onDomReady : setup our page
	jQuery(document).ready(function () {
		addDescriptionButton();
		jQuery('#skratchdot-missing-descriptions input[type=button]').click(handleClick);
	});
};

// Inject our userScript script
var script = document.createElement('script');
script.textContent = '(' + userScript.toString() + ')();';
document.body.appendChild(script);