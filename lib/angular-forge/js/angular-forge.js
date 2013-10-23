(function (window, angular, undefined) {'use strict';

// wrap a forge API so that it returns an angular promise
// assumption is that forge API takes success and error callbacks
// as the last two parameters
function promise($rootScope, $q, f) {
	return function () {
		var deferred = $q.defer();
		var success = function () {
			var successArgs = arguments;
			$rootScope.$apply(function () {
				deferred.resolve.apply(deferred, successArgs);
			});
		};
		var error = function () {
			var errorArgs = arguments;
			$rootScope.$apply(function () {
				deferred.reject.apply(deferred, errorArgs);
			});
		};
		var args = Array.prototype.slice.call(arguments).concat(success, error);
		f.apply(this, args);
		return deferred.promise;
	};
}

function ForgeProvider() {
	var methodsToWrap = {};

	this.methodsToWrap = function (m) {
		methodsToWrap = m;
	};

	this.$get = function ($rootScope, $q, $log) {
		// wrap async functions to return promises
		var moduleName, methodName;
		$log.log("Wrapping methods", JSON.stringify(methodsToWrap));

		for (moduleName in methodsToWrap) {
			for (methodName in methodsToWrap[moduleName]) {
				forge[moduleName][methodName] = promise($rootScope, $q, forge[moduleName][methodName]);
			}
		}

		return window.forge;
	};
}

angular.module('forge.angular', [])

.config(function ($provide, $compileProvider) {
	// decorate $log service to use forge.logging
	$provide.decorator('$log', function ($delegate) {
		var _log = $delegate.log;
		$delegate.log = function () {
			// forge.logging.log only accepts 1 arg
			if (arguments.length > 1) {
				window.forge.logging.log(Array.prototype.slice.call(arguments));
			} else {
				window.forge.logging.log(arguments[0]);
			}
			_log.apply($delegate, arguments);
		};

		return $delegate;
	});

	// android uses content:// URIs which angular will mark as unsafe:
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|content):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|content):|data:image\//);

	$provide.provider('forge', ForgeProvider);
})

.factory('tabbar', function (forge) {
	var buttons = {};

	return {
		tabbar: forge.tabbar,
		addButton: function (name, buttonDef) {
			this.tabbar.addButton(buttonDef).then(function (button) {
				buttons[name] = button;
			});
		}
	};
});

})(window, window.angular);