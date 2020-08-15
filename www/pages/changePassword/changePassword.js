rootApp
.directive('changePasswordPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/changePassword/changePassword.html'
	};
})
.controller('changePasswordPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ChangePasswordPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.oldPassword = { label: $scope.globalMessage.ChangePasswordLabelOldPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.newPassword = { label: $scope.globalMessage.ChangePasswordLabelNewPassword, value: $scope.stringEmpty, error: $scope.stringEmpty,
						   tooltip: $scope.globalMessage.RegisterTooltipPassword,
						   tooltipOptions: [
								$scope.globalMessage.RegisterTooltipPassword1,
								$scope.globalMessage.RegisterTooltipPassword2
						   ] }
	$scope.confirmPassword = { label: $scope.globalMessage.ChangePasswordLabelConfirmPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }

	$scope.$on('showChangePasswordPage', function (event, args) {
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

	$scope.changePasswordClick = function() {
		var isValid = true;
		$scope.oldPassword.error = $scope.stringEmpty;
		$scope.newPassword.error = $scope.stringEmpty;
		$scope.confirmPassword.error = $scope.stringEmpty;
		if ($scope.oldPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.oldPassword.error = $scope.globalMessage.ChangePasswordErrorOldPasswordEmpty;
		}
		if ($scope.newPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.newPassword.error = $scope.globalMessage.ChangePasswordErrorNewPasswordEmpty;
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
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordErrorConfirmPasswordEmpty;
		}
		else if ($scope.newPassword.value != $scope.confirmPassword.value) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordErrorDifferentPassword;
		}
		
		if ($scope.oldPassword.value != $scope.stringEmpty &&
			$scope.newPassword.value != $scope.stringEmpty &&
			$scope.oldPassword.value == $scope.newPassword.value) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ChangePasswordErrorSameOldNewPassword;
		}

		if (isValid) {
			$scope.globalShowLoading();
			var promise = API.ChangePassword($scope.oldPassword.value, $scope.newPassword.value);
			promise.then(function (response) {
				$scope.globalHideLoading();
				
				var msg = '';
				if (response.errorCode == 1) {
					msg = $scope.globalMessage.ChangePasswordErrorPasswordRule;
				}
				else if (response.errorCode == 2) {
					msg = $scope.globalMessage.ChangePasswordErrorWrongPassword;
				}
				else{
					msg = $scope.globalMessage.ChangePasswordSuccess;
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
				if(value.Status == 1){
					$scope.onClose();
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
