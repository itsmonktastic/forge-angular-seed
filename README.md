# Forge Angular Seed

Hopefully reducing the bumps when getting going with [Trigger.io Forge](https://trigger.io)
and [Angular](http://angularjs.org). :)

Mostly this consists of a helper module called `forge.angular` and some advice
on how to make use of Forge APIs in an Angular friendly way.


## Libraries included

* angular (1.2.0-rc.2)
* angular-touch
* angular-animate
* angular-ui-router
* fastclick


## `forge.angular` module

The `forge.angular` angular module needs to be required by your app in some
way. Example usage from 

```javascript
	angular.module('albumshare', [
		'ui.router',
		'forge.angular'
	])
```

The `forge.angular` module is defined in `lib/forge-angular`.
The guidelines here use angular-ui-router so you should depend on that also.


## Forge as an injectable service

You can request `forge` in anything that can request service instances
(e.g. controllers):

```javascript
angular.module('angular-forge-app')

.controller('MyCtrl', function (forge) {
	$scope.ios = forge.is.ios();
});
```

Hopefully this is more aligned with AngularJS style, and should make unit
testing easier. The `forge` provider is provided by the 'for'


## Wrap forge.* APIs to return promises and auto $apply

Usually when using `forge` APIs, you have to use `$apply` manually
to cause an update the view:

```javascript
.controller('MyCtrl', function (forge) {
	forge.prefs.get('my-pref', function (myPref) {
		$scope.$apply(function () {
			$scope.myPref = myPref;
		});
	});
});
```

The `forge` service can be configured to wrap methods:

```javascript
angular.module('angular-forge-app')

.config(function (forgeProvider) {
	forgeProvider.methodsToWrap({
		prefs: {
			get: true
		}
	})
});
```

This changes the method to return a promise (using `$q.defer`) and automatically
call `$rootScope.$apply` after being resolved. So now you can write:

```javascript
.controller('MyCtrl', function (forge) {
	forge.prefs.get('my-pref').then(function (myPref) {
		$scope.myPref = myPref;
	});
});
```

Furthermore, because the API now returns a promise, it's easier to compose
calls:

```javascript
.controller('MyCtrl', function (forge, $q) {
	$q.all([
		forge.prefs.get('my-pref'),
		forge.prefs.get('my-other-pref')
	]).then(function (prefs) {
		$scope.myPref = prefs[0];
		$scope.myOtherPref = prefs[1];
	});
});
```

Usage of `methodsToWrap` can be seen in `albumshare/module.js`.


## Routing

Angular 1.2 doesn't actually come with a router service by default. The
standard router is now available as ngRouter, however this project uses the
[angular-ui-router](https://github.com/angular-ui/ui-router) library which
provides support for nesting views, as well as events for when routing occurs.
Usage can be seen in `albumshare/routes.js`.


## Tab bar usage

The best place to update the tab bar seems to be at the router/state level.

The gist of it is: have an abstract state for each tabbar tab, and each view
in that tab is a child state. Fortunately, angular-ui-router supports this
directly using state inheritance.

The `resolved` property for a state allows you to return a promise to be
resolved before controllers are instantiated.

The tabbar is initially set up

Example usage in `albumshare/routes.js`.


## Top bar usage

The best place to update the top bar seems to be at the router/state level
using the 

```javascript
angular.module('angular-forge-app')

.config(function ($stateProvider) {
	$stateProvider

	.state('app.album.list', {
		url: '/albums/list',
		onEnter: function () {
			forge.topbar.setTitle("Albums");
			forge.topbar.removeButtons();
			forge.topbar.show();
		}
	})

	.state('app.album.detail', {
		url: '/albums/:albumId'
		onEnter: function (forge, $stateParams, data) {
			var album = data.getAlbum($stateParams.albumId);

			forge.topbar.setTitle(album.name);
			forge.topbar.removeButtons();
			forge.topbar.addButton({
				text: "Albums",
				type: "back",
				style: "back"
			});
			forge.topbar.show();
		}
	})

	...
});
```


## Logging

Use of the $log service will use forge.logging.log

```javascript
.controller('MyCtrl', function ($log) {
	$log.log("Will appear in Toolkit!")
});
```


## Fast click events

Included FastClick.js to make button clicks more responsive. I think Angular has
code to make ng-click more responsive but this doesn't work for links.


## Topcoat

Using [Topcoat](https://topcoat.io) for the mobile styling! This is not
required at all.


## Icons

Used inkscape to convert SVGs from [The Noun Project](http://thenounproject.com)
to PNGs.


## Acknowledgements

[Cloud Upload](http://thenounproject.com/noun/cloud-upload/#icon-No2633)
designed by [Adam Whitcroft](http://thenounproject.com/adamwhitcroft) from the
Noun Project.

[Album](http://thenounproject.com/noun/album/#icon-No12237) designed by 
[Raul Serrano](http://thenounproject.com/rrrraul) from The Noun Project.


## Further work

* API/service for setting up a tabbar to use angular-ui-router states.
* Don't forget what view was last open in a tab when switching tabs.
* Use Angular 1.2 stable once it's released
* Animation for navigation within a tab (things have changed since Angular 1.0,
	[a useful presentation to explain how](http://www.yearofmoo.com/2013/08/remastered-animation-in-angularjs-1-2.html))
* $httpBackend provider that backs onto forge.request for cross domain requests
  (needs to not break loading of templates also.)

