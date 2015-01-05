'use strict';

angular.module('noDJ').
controller('mainCtrl', ['$scope', '$location',
	function($scope, $location) {
		switch ($location.search().error) {
		case 'wrong_room_id':
			$scope.error = 'Party Id not found.';
			break;
		}
	}
]).
controller('serverCtrl', ['$scope', '$timeout', '$rootScope', '$routeParams', '$location', 'MusicQueue',
	function($scope, $timeout, $rootScope, $routeParams, $location, MusicQueue) {
		if ($routeParams.roomId === 'new') {
			return $.post("/rooms", function(data) {
				$timeout(function() {
					$rootScope.roomId = data.roomId;
					$location.path('/' + data.roomId);
				});
		    });
		}

		$rootScope.roomId = $routeParams.roomId;
		$rootScope.currentTrack = null;
		$rootScope.queue = [];
		MusicQueue.update();

		$scope.queueSorter = function(item) {
			return -(item.upvotes-item.downvotes);
		};

		$scope.isPlaying = false;
		$scope.showPlayer = true;
		$scope.youtubeVideoId = '';
		$scope.youtubePlayerVars = {
			controls: 1,
			modestbranding: 1
		};

		// https://github.com/brandly/angular-youtube-embed
		$scope.$on('youtube.player.ready', function($event) {
			console.log('player is ready')
			$scope.playClicked();
		});
		$scope.$on('youtube.player.ended', function($event) {
			console.log('current song ended')
			$scope.currentTime = 0;
			$scope.isPlaying = false;
			$scope.nextClicked();
		});

		$scope.playClicked = function() {
			if ($scope.youtubePlayer) {
				$scope.youtubePlayer.playVideo();
				$scope.isPlaying = true;
			}
			else {
				$scope.nextClicked();
			}
		};
		$scope.pauseClicked = function() {
			if ($scope.youtubePlayer) {
				$scope.youtubePlayer.pauseVideo();
				$scope.isPlaying = false;
			}
		};
		$scope.nextClicked = function() {
			MusicQueue.playNext();
		};

		// progress bar
		setInterval(function() {
			$timeout(function() {
				if ($scope.youtubePlayer) {
					$scope.currentTime = $scope.youtubePlayer.getCurrentTime();
					$scope.duration = $scope.youtubePlayer.getDuration();
				}
			});
		}, 200);

		// sync with server
		setInterval(function() {
			MusicQueue.update();
		}, 1000);

		$rootScope.$watch('currentTrack', function(newValue, oldValue) {
			if (newValue) {
				$scope.youtubeVideoId = newValue.id;
			}
		});
	}
]).
controller('clientCtrl', ['$scope', '$timeout', '$rootScope', '$routeParams', '$location', 'MusicQueue',
	function($scope, $timeout, $rootScope, $routeParams, $location, MusicQueue) {
		$rootScope.roomId = $routeParams.roomId;
		$rootScope.currentTrack = null;
		$rootScope.queue = [];
		MusicQueue.update(function(err) {
			if (err) {
				$location.path('/').search('error', 'wrong_room_id');
			}
		});

		var votes = {};
		$scope.alreadyVoted = function(id) {
			return !votes[id];
		};

		$scope.queueSorter = function(item) {
			return -(item.upvotes-item.downvotes);
		};

		$scope.upvote = function(id) {
			if (!!votes[id]) return;
			MusicQueue.upvote(id);
			votes[id] = true;
		};
		$scope.downvote = function(id) {
			if (!!votes[id]) return;
			MusicQueue.downvote(id);
			votes[id] = true;
		};

		// sync with server
		setInterval(function() {
			MusicQueue.update();
		}, 1000);
	}
]);