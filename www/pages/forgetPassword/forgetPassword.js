rootApp
.directive('forgetPasswordPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/forgetPassword/forgetPassword.html'
	};
})
.controller('forgetPasswordPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ForgetPasswordPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.sellerCode = { label: $scope.globalMessage.ForgetPasswordLabelSellerCode, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.dateOfBirth = { label: $scope.globalMessage.ForgetPasswordLabelDateOfBirth, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.email = { label: $scope.globalMessage.ForgetPasswordLabelEmail, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.token = { label: $scope.stringEmpty, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.password = { label: $scope.globalMessage.ForgetPasswordLabelPassword, value: $scope.stringEmpty, error: $scope.stringEmpty, 
						tooltip: $scope.globalMessage.ForgetPasswordTooltipPassword,
						tooltipOptions: [
							$scope.globalMessage.ForgetPasswordTooltipPassword1,
							$scope.globalMessage.ForgetPasswordTooltipPassword2
						] }
	$scope.confirmPassword = { label: $scope.globalMessage.ForgetPasswordLabelConfirmPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }

	$scope.$on('showForgetPasswordPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
		
		$timeout(function () {
			$scope.sellerCode.value = $scope.stringEmpty;
			$scope.dateOfBirth.value = $scope.stringEmpty;
			$scope.email.value = $scope.stringEmpty;
			$scope.token.value = $scope.stringEmpty;
			$scope.password.value = $scope.stringEmpty;
			$scope.confirmPassword.value = $scope.stringEmpty;
			$scope.timeout = new Date();
			$scope.isRequestAvailable = 'disabled';
			$scope.timeLeft = '00:00';
			$scope.content2Class = $scope.stringEmpty;
			$scope.content3Class = $scope.stringEmpty;
			$scope.errorMessage = $scope.stringEmpty;
			$scope.tokenCounter = $scope.globalMessage.ForgetPasswordMessageRequestToken;
			$scope.minYear = 1950;
			$scope.maxYear = new Date().getFullYear() - 10;
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

	$scope.startCountdown = function() {
		$scope.timeout = new Date().setMinutes(new Date().getMinutes() + $scope.otpTime);
		$scope.isRequestAvailable = 'disabled';
		$scope.countdown();
	}

	$scope.countdown = function() {
		$timeout(function() {
			var timeLeft = moment.duration($scope.timeout - new Date());
			var minute = timeLeft._data.minutes;
			var second = timeLeft._data.seconds;
			if(minute < 10) {
				minute = '0' + minute;
			}
			if(second < 10) {
				second = '0' + second;
			}
			if(timeLeft._data.minutes >= 0 && timeLeft._data.seconds >= 0) {
				$scope.timeLeft = minute + ':' + second;
				$scope.countdown();
			} else {
				$scope.timeLeft = '00:00';
				$scope.isRequestAvailable = $scope.stringEmpty;
			}
		}, 1000);
	}

	$scope.requestClick = function() {
		$scope.token.value = $scope.stringEmpty;
		$scope.errorMessage = $scope.stringEmpty;
		if ($scope.content2Class == $scope.stringEmpty) {
			var isValid = true;
			$scope.sellerCode.error = $scope.stringEmpty;
			$scope.dateOfBirth.error = $scope.stringEmpty;
			$scope.email.error = $scope.stringEmpty;
			$scope.errorMessage = $scope.stringEmpty;
			if ($scope.sellerCode.value == $scope.stringEmpty) {
				isValid = false;
				$scope.sellerCode.error = $scope.globalMessage.ForgetPasswordErrorSellerCodeEmpty;
			}
			else if ($scope.sellerCode.value[0] != '7') {
				IsValid = false;
				$scope.sellerCode.error = $scope.globalMessage.ForgetPasswordErrorSellerCodeFormat;
			}
			if ($scope.dateOfBirth.value == $scope.stringEmpty) {
				isValid = false;
				$scope.dateOfBirth.error = $scope.globalMessage.ForgetPasswordErrorDateOfBirthEmpty;
			}
			else if (new Date($scope.dateOfBirth.value) >= new Date()) {
				isValid = false;
				$scope.dateOfBirth.error = $scope.globalMessage.ForgetPasswordErrorDateOfBirthFutureDate;
			}
			if ($scope.email.value == $scope.stringEmpty) {
				isValid = false;
				$scope.email.error = $scope.globalMessage.ForgetPasswordErrorEmailEmpty;
			}
			else if (!/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.email.value)) {
				IsValid = false;
				$scope.email.error = $scope.globalMessage.ForgetPasswordErrorEmailFormat;
			}
			if (isValid) {
				$scope.validateForgotPassword();
			}
		}
		else {
			$scope.validateForgotPassword();
		}
	}

	$scope.validateForgotPassword = function(){
		$scope.globalShowLoading();
		var promise = API.ValidateForgotPassword($scope.sellerCode.value, $scope.dateOfBirth.value, $scope.email.value);
		promise.then(function (response) {
			if (response.errorCode == 1) {
				$scope.errorMessage = $scope.globalMessage.ForgetPasswordErrorMaxToken.format(response.value.maxTokenPerDay);
			}
			else if(response.errorCode == 2){
				$scope.errorMessage = $scope.globalMessage.ForgetPasswordTokenResendPeriod.format(response.value.resendPeriod);
			}
			else if(response.errorCode == 3){
				// Try Catch Error
				$scope.errorMessage = $scope.globalMessage.LoginErrorOther;
			}
			else if(response.errorCode == 4){
				$scope.errorMessage = $scope.globalMessage.ForgetPasswordErrorSearchFailed;
			}
			else {
				$scope.otpTime = response.value.tokenResendPeriod;
				$scope.content2Class = 'active';
				$scope.tokenCounter = $scope.globalMessage.ForgetPasswordLabelCounter.format(response.value.totalTokenSent);
				$scope.startCountdown();
				try {
					window.plugins.toast.showShortBottom($scope.globalMessage.ForgetPasswordMessageRequestToken);
				}
				catch (err) { alert($scope.globalMessage.ForgetPasswordMessageRequestToken); }
			}
			$scope.globalHideLoading();
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

	$scope.verifyClick = function () {
		var isValid = true;
		$scope.errorMessage = $scope.stringEmpty;
		if($scope.token.value == $scope.stringEmpty) {
			isValid == false;
			$scope.errorMessage = $scope.globalMessage.ForgetPasswordTokenEmpty;
		}
		if(isValid){
			$scope.globalShowLoading();
			var promise = API.VerifyForgotPasswordToken($scope.email.value, $scope.token.value);
			promise.then(function (response) {
				if (response.errorCode == 1) {
					$scope.errorMessage = $scope.globalMessage.ForgetPasswordTokenExpired;
				}
				else if (response.errorCode == 2) {
					$scope.errorMessage = $scope.globalMessage.ForgetPasswordTokenInvalid;
				}
				else {
					$scope.content3Class = 'active';
				}
				$scope.globalHideLoading();
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

	$scope.changePasswordClick = function() {
		var isValid = true;
		$scope.password.error = $scope.stringEmpty;
		$scope.confirmPassword.error = $scope.stringEmpty;
		$scope.errorMessage = $scope.stringEmpty;
		if($scope.password.value == $scope.stringEmpty) {
			isValid = false;
			$scope.password.error = $scope.globalMessage.ForgetPasswordErrorPasswordEmpty;
		}
		else if ($scope.password.value.length < 8 || $scope.password.value.length > 15) {
			isValid = false;
			$scope.password.error = $scope.globalMessage.RegisterErrorPasswordLength;
		}
		else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test($scope.password.value)) {
			isValid = false;
			$scope.password.error = $scope.globalMessage.RegisterErrorPasswordCriteria;
		}
		if ($scope.confirmPassword.value == $scope.stringEmpty) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ForgetPasswordErrorConfirmPasswordEmpty;
		}
		else if($scope.password.value != $scope.confirmPassword.value) {
			isValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.ForgetPasswordErrorConfirmPasswordDifferent;
		}
		if (isValid) {
			$scope.globalShowLoading();
			var promise = API.RecreatePassword($scope.email.value, $scope.token.value, $scope.password.value);
			promise.then(function (response) {
				$scope.globalHideLoading();
				var msg = '';
				if (response.errorCode == 1) {
					msg = $scope.globalMessage.ChangePasswordErrorPasswordRule;
				}
				else if (response.errorCode == 2 || response.errorCode == 3) {
					msg = $scope.globalMessage.ForgetPasswordErrorChangePasswordTokenInvalidOrExpired;
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
				catch (err) { alert(msg); }
				$scope.onClose();
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
