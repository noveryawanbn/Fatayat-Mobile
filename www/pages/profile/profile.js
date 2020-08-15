rootApp
.directive('profilePage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/profile/profile.html'
	};
})
.controller('profilePageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ProfilePageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.$on('showProfilePage', function (event, args) {
		$scope.agentName = "";
		$scope.agentCode = "";
		$scope.mobilePhone = "";
		$scope.email = "";
		$scope.idCard = "";
		$scope.passDateProduct = "";
		$scope.passDateAml = "";
		$scope.regionCity = "";
		$scope.agentStatus = "";

		$scope.isEmailInfoVisible = false;
		
		$scope.isShow = true;
		$timeout( function(){
			$scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		if(!args.isFromStaging){
			$timeout(function () {
				$scope.globalShowLoading();
				var promise = API.GetUserProfile();
				promise.then(
					function (args) {
						if (args.errorCode == -1) {
							$scope.$emit('goToHomePage');
							if (!$scope.$$phase) $scope.$apply();
							$scope.globalHideLoading();
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
							$scope.agentName = args.value.name;
							$scope.agentCode = args.value.agentCode;
							$scope.mobilePhone = args.value.mobilePhone;
							$scope.email = args.value.email;
							$scope.idCard = args.value.idCard;
							$scope.passDateProduct = moment(args.value.passDateProduct).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
							$scope.passDateAml = moment(args.value.passDateAml).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
							$scope.regionCity = args.value.regionName;
							$scope.agentStatus = args.value.agentStatus == "01" ? $scope.globalMessage.ProfileStatusActive : $scope.globalMessage.ProfileStatusSuspend;
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
					}
				);
			}, $scope.timeoutOpenPage);
		} else {
			$scope.agentStatus = $scope.globalMessage.ProfileStatusIsFromStaging;
		}
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

	$scope.emailInfoClick = function(){
		$scope.isEmailInfoVisible = true;
	}

	$scope.emailInfoWrapperClick = function(){
		$scope.isEmailInfoVisible = false;
	}
});
