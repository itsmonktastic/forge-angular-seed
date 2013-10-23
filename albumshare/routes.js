(function (angular) {'use strict';

angular.module('albumshare')

.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/upload/upload');

	// root app state
	$stateProvider.state('app', {
		abstract: true,
		template: '<div ui-view></div>',
		resolve: {
			buttons: function (forge, $log, $q, $state) {
				$log.log("Setting up tab bar");

				forge.tabbar.removeButtons();

				// create buttons
				var buttons = $q.all([
					forge.tabbar.addButton({
						text: 'Upload',
						icon: 'img/upload.png',
						index: 0
					}),
					forge.tabbar.addButton({
						text: 'Albums',
						icon: 'img/albums.png',
						index: 1
					}),
					forge.tabbar.addButton({
						text: 'Following',
						icon: 'img/following.png',
						index: 2
					})
				]).then(function (buttons) {
					var targetStates = [
						'app.upload.upload',
						'app.albums.list',
						'app.following.list'
					];

					// clicking on the buttons should navigate
					buttons.forEach(function (b, i) {
						var state = targetStates[i];
						b.onPressed.addListener(function () {
							$state.go(state);
						});
					});

					return {
						upload: buttons[0],
						albums: buttons[1],
						following: buttons[2]
					};
				});
				forge.tabbar.show();
				return buttons;
			}
		}
	})

	// upload tab
	.state('app.upload', {
		abstract: true,
		url: '/upload',
		templateUrl: 'albumshare/templates/tab.html',
		resolve: {
			activeButton: function (buttons) {
				buttons.upload.setActive();
				return buttons.upload;
			}
		}
	})

	.state('app.upload.upload', {
		url: '/upload',
		templateUrl: 'albumshare/templates/upload.html',
		controller: 'Upload'
	})

	// albums tab
	.state('app.albums', {
		abstract: true,
		url: '/albums',
		templateUrl: 'albumshare/templates/tab.html',
		resolve: {
			activeButton: function (buttons) {
				buttons.albums.setActive();
			}
		}
	})

	.state('app.albums.list', {
		url: '/',
		templateUrl: 'albumshare/templates/album-list.html',
		controller: 'AlbumList'
	})

	.state('app.albums.detail', {
		url: '/:albumId',
		templateUrl: 'albumshare/templates/album-detail.html',
		controller: 'AlbumDetail'
	})

	// following tab
	.state('app.following', {
		url: '/following',
		templateUrl: 'albumshare/templates/tab.html',
		resolve: {
			activeButton: function (buttons) {
				buttons.following.setActive();
			}
		}
	})

	.state('app.following.list', {
		url: '/',
		templateUrl: 'albumshare/templates/following-list.html',
		controller: 'FollowingList'
	})

	.state('app.following.detail', {
		url: '/:albumId',
		templateUrl: 'albumshare/templates/following-detail.html',
		controller: 'FollowingDetail'
	});
});

})(angular);