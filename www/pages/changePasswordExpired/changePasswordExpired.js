rootApp
.directive('changePasswordExpiredPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/changePasswordExpired/changePasswordExpired.html'
	};
})
.controller('changePasswordExpiredPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ChangePasswordExpiredPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.oldPassword = { label: $scope.globalMessage.ChangePasswordExpiredLabelOldPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.newPassword = { label: $scope.globalMessage.ChangePasswordExpiredLabelNewPassword, value: $scope.stringEmpty, error: $scope.stringEmpty,
						   tooltip: $scope.globalMessage.RegisterTooltipPassword,
						   tooltipOptions: [
								$scope.globalMessage.RegisterTooltipPassword1,
								$scope.globalMessage.RegisterTooltipPassword2
						   ] }
	$scope.confirmPassword = { label: $scope.globalMessage.ChangePasswordExpiredLabelConfirmPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }

	$scope.$on('showChangePasswordExpiredPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
			$scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.oldPassword.value = $scope.stringEmpty;
			$scope.newPassword.value = $scope.stringEmpty;
			$scope.confirmPassword.value = $scope.stringEmpty;

			$scope.oldPassword.error = $scope.stringEmpty;
			$scope.newPassword.error = $scope.stringEmpty;
			$scope.confirmPassword.error = $scope.stringEmpty;
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

	$scope.changePasswordExpiredClick = function() {
		var isValid = true;
		$scope.oldPassword.error = $scope.stringEmpty;
		$scope.newPassword.error = $scope.stringEmpty;
		$scope.confirmPassword.error = $scope.stringEmpty;
		if ($scope.oldPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.oldPassword.error = $scope.globalMessage.ChangePasswordExpiredErrorOldPasswordEmpty;
		}
		if ($scope.newPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.newPassword.error = $scope.globalMessage.ChangePasswordExpiredErrorNewPasswordEmpty;
		}
		else if ($scope.newPassword.value.length < 8 || $scope.newPassword.value.length > 15) {
			isValid = false;
			$scope.newPassword.error = $scope.globalMessage.RegisterErrorPasswordLength;
		}
		else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test($scope.newPassword.value)) {
			isValid = false;
			$scope.newPassword.error = $scope.globalMessage.RegisterErrorPasswordCriteria;
		}
		if ($scope.confirmPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordExpiredErrorConfirmPasswordEmpty;
		}
		else if ($scope.newPassword.value != $scope.confirmPassword.value) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordExpiredErrorDifferentPassword;
		}

		if ($scope.oldPassword.value != $scope.stringEmpty &&
			$scope.newPassword.value != $scope.stringEmpty &&
			$scope.oldPassword.value == $scope.newPassword.value) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordExpiredErrorSameOldNewPassword;
		}

		if (isValid) {
			$scope.globalShowLoading();
			var promise = API.ChangePassword($scope.oldPassword.value, $scope.newPassword.value);
			promise.then(function (args) {
				$scope.globalHideLoading();
				var msg = '';
				if (args.errorCode == -1) {
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
					if (args.errorCode == 1) {
						msg = $scope.globalMessage.ChangePasswordErrorPasswordRule;
					}
					else if (args.errorCode == 2) {
						msg = $scope.globalMessage.ChangePasswordErrorWrongPassword;
					}
					else{
						msg = $scope.globalMessage.ChangePasswordSuccess;
						$scope.onClose();
						$scope.$emit('goToMainMenuPage');
					}
					
					try {
						navigator.notification.alert(
							msg,
							function () { },
							$scope.stringEmpty,
							$scope.globalMessage.PopUpButtonClose
						);
					}
					catch (err) { alert (msg); }
				}
			}, function (error){
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
		}
	}
});
