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
// @version        1.3
// ==/UserScript==
/*global jQuery, moment */
/*jslint browser: true, plusplus: true */

var userScript = function () {
	'use strict';

	var currentRequest = 0, // When 0, the button is enabled
		maxRequestsPerBatch = 50, // We only make this many requests per button click
		currentPage = 1,
		username = '',
		// FUNCTIONS
		addDescriptionButton,
		getDescription,
		getUsername,
		handleClick,
		updateCounts;

	addDescriptionButton = function () {
		var $firstSimpleRepo = jQuery('body.page-profile ul.repo_list li.simple:first');
		if ($firstSimpleRepo.length > 0) {
			$firstSimpleRepo.before('<div id="skratchdot-missing-descriptions" style="text-align:center; border:1px solid #ddd; border-radius:4px; padding:10px 10px 0; margin:10px 0px;">' +
				'<input type="button" class="minibutton" style="margin-bottom:10px;height:30px;" value="Get Missing Descriptions" />' +
				'<div class="body" style="padding-top:15px">' +
				'  <p class="fork-flag">' +
				'    <span></span>' +
				'    out of' +
				'    <span></span>' +
				'    simple repos now have descriptions' +
				'  </p>' +
				'</div>' +
				'</div>');
			updateCounts();
		}
	};

	getDescription = function () {
		if (currentRequest > 0 && jQuery('ul.repo_list li.simple:not(.skratchdot-ajax)').length > 0) {
			jQuery.ajax({
				url : 'https://api.github.com/users/' + getUsername() + '/repos',
				method : 'get',
				dataType : 'json',
				data : {
					page : currentPage++
				},
				error : function () {
					updateCounts();
					currentRequest = currentRequest - 1;
					getDescription();
				},
				success : function (data) {
					var i, repo, container, updateTime;
					for (i = 0; i < data.length; i++) {
						repo = data[i];
						container = jQuery('li.simple a[href="/' + repo.full_name + '"]').parents('li:first');
						if (container.length) {
							updateTime = moment(repo.updated_at);
							container.append('<div class="body">' +
								'<p class="description">' +
								repo.description +
								'</p>' +
								'<p class="updated-at">Last updated ' +
								'<time' +
								' title="' + updateTime.format('YYYY-MM-DD HH:mm:ss') + '"' +
								' datetime="' + updateTime.format() + '"' +
								' class="js-relative-date">' +
								updateTime.fromNow() +
								'</time>' +
								'</p>' +
								'</div>');
							container.addClass('skratchdot-ajax');
							container.find('*').show();
							container.css('margin-bottom', '10px');
							updateCounts();
						}
					}
					currentRequest = data.length === 0 ? 0 : currentRequest - 1;
					getDescription();
				}
			});
		}
	};

	getUsername = function () {
		if (username === '') {
			username = jQuery('.userpage .username:first').text().trim();
		}
		return username;
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