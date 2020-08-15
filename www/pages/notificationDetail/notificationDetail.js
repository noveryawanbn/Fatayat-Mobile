rootApp
.directive('notificationDetailPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/notificationDetail/notificationDetail.html'
	};
})
.controller('notificationDetailPageController', function($scope, $timeout, $sce, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.NotificationPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.id = 0;
	$scope.title = $scope.stringEmpty;
	$scope.date = $scope.stringEmpty;
	$scope.message = $scope.stringEmpty;

	$scope.$on('showNotificationDetailPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function () {
			$scope.pageClass = "active";
		}, $scope.timeoutOpenPage);
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.title = $scope.stringEmpty;
			$scope.date = $scope.stringEmpty;
			$scope.message = $scope.stringEmpty;
			
			$scope.globalShowLoading();
			var promise = API.NotificationGetDetail(args.parm);
			promise.then(function (result) {
				if (result.errorCode == -1) {
					$scope.$emit('goToHomePage');
					if (!$scope.$$phase) $scope.$apply();
					try {
						navigator.notification.alert(
							$scope.globalMessage.ApplicationUserExpired,
							function () { },
							$scope.stringEmpty,
							$scope.globalMessage.PopUpButtonClose
						);
					}
					catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
				}
				else {
					var value = result.value;
					$scope.title = value.title;
					$scope.date = moment(value.notificationDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatFull);
					$scope.message = value.content;
				}
				$scope.globalHideLoading();
			},
			function (error) {
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationErrorConnectionFailed,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
				$scope.globalHideLoading();
			});
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
	});

	$scope.onClose = function() {
		$scope.pageClass = $scope.stringEmpty;
		$timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
	}

	$scope.trustAsHtml = function(param) {
		return $sce.trustAsHtml(param);
	}
});
