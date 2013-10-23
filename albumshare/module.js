(function () {
	'use strict';

	angular.module('albumshare', [
		'ui.router',
		'forge.angular'
	])

	.config(function (forgeProvider) {
		// XXX: hardcoded list of async APIs to wrap
		// some way of detecting async APIs would be super useful
		forgeProvider.methodsToWrap({
			file: {
				getImage: true,
				URL: true
			},

			contact: {
				select: true
			},

			tabbar: {
				addButton: true,
				removeButtons: true
			}
		});
	});
}());