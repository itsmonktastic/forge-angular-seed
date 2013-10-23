(function (angular, undefined) {'use strict';

var albums = [{
	id: 1,
	name: 'personal'
}, {
	id: 2,
	name: 'work'
}];

function getAlbum(albumId) {
	return albums[albumId - 1];
}

angular.module('albumshare')

.controller('Upload', function ($scope, forge) {
	$scope.imageUrl = undefined;
	$scope.album = getAlbum(1);

	$scope.getFile = function () {
		forge.file.getImage({width: 250, height: 250}).then(function (file) {
			return forge.file.URL(file);
		}).then(function (url) {
			$scope.imageUrl = url;
		});
	};

	$scope.upload = function () {
	};
})

.controller('AlbumList', function ($scope, $state) {
	$scope.albums = albums;
	$scope.navigateTo = function (album) {
		$state.go('albums.detail', {albumId: album.id});
	};
})

.controller('AlbumDetail', function ($scope, $stateParams) {
	$scope.album = getAlbum($stateParams.albumId);
})

.controller('AlbumShare', function ($scope, $stateParams, forge, $window) {
	$scope.album = getAlbum($stateParams.albumId);
	$scope.contact = undefined;
	$scope.chooseContact = function () {
		forge.contact.select().then(function (contact) {
			$scope.contact = contact;
		});
	};

	$scope.share = function () {
		// $window.open('mailto:t.r.monks@gmail.com', '_blank');
		// parseApi.classes.create('subscription', )
	};
})

.controller('FollowingList', function ($scope) {
})

.controller('FollowingDetail', function ($scope) {
});

})(window.angular);