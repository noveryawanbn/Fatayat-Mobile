rootApp
.directive('onboardingPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/onboarding/onboarding.html'
	};
})
.controller('onboardingPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;
	
	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.OnboardingPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.backConfirmationDialog(); }
	};

	$scope.otpTypeOptions = [
		{
			text: $scope.globalMessage.OnboardingRadioOTPEmail,
			value: 'email'
		},
		{
			text: $scope.globalMessage.OnboardingRadioOTPSMS,
			value: 'sms'
		}
	];

	$scope.name = $scope.stringEmpty;
	$scope.email = $scope.stringEmpty;
	$scope.mobilePhone = $scope.stringEmpty;
	$scope.otpType = {
		value: $scope.stringEmpty,
		error: $scope.stringEmpty
	}
	$scope.verifyToken = {
		value: $scope.stringEmpty,
		error: $scope.stringEmpty
	}
	$scope.onboardingContent2Class = $scope.stringEmpty;
	$scope.sendCounter = 0;
	$scope.timeLeft = '00:00';
	$scope.timeout = new Date();
	$scope.isRequestAvailable = 'disabled';

	$scope.$on('showOnboardingPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function() {
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.agentCode = $scope.globalData.AgentCode;
			$scope.name = $scope.globalData.Name;
			$scope.email = $scope.globalData.Email;
			$scope.mobilePhone = $scope.globalData.MobilePhone;
			for(var i = 0; i < $scope.mobilePhone.length - 4; i++) {
				$scope.mobilePhone = $scope.mobilePhone.replaceAt(i, '*');
			}
			$scope.otpType = {
				value: $scope.stringEmpty,
				error: $scope.stringEmpty
			}
			$scope.verifyToken = {
				value: $scope.stringEmpty,
				error: $scope.stringEmpty
			}
			$scope.onboardingContent2Class = $scope.stringEmpty;
			$scope.sendCounter = $scope.globalData.OnboardingCount;
			$scope.timeLeft = '00:00';
			$scope.timeout = new Date();
			$scope.isRequestAvailable = 'disabled';

			if ($scope.globalData.OnboardingExpired > 0) {
				$scope.onboardingContent2Class = 'active';
				$scope.timeout = new Date().setSeconds(new Date().getSeconds() + $scope.globalData.OnboardingExpired);
				$scope.isRequestAvailable = 'disabled';
				$scope.countdown();
			}
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if($scope.pageIndex == args.pageIndex) {
			$scope.backConfirmationDialog();
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

	$scope.backConfirmationDialog = function(){
		try {
			navigator.notification.confirm(
				$scope.globalMessage.ApplicationExit,
				function (confirmParm) {
					if (confirmParm == 1) {
						$scope.onClose();
					}
				},
				'Pesan',
				['Ya', 'Tidak']
			)
		}
		catch (err) {
			if (confirm($scope.globalMessage.ApplicationExit)) {
				$scope.onClose();
			}
		}
	}

	$scope.requestClick = function() {
		$scope.verifyToken.value = $scope.stringEmpty;
		$scope.verifyToken.error = $scope.stringEmpty;
		if ($scope.onboardingContent2Class == $scope.stringEmpty) {
			$scope.otpType.error = $scope.stringEmpty;
			if ($scope.otpType.value == $scope.stringEmpty) {
				$scope.otpType.error = $scope.globalMessage.OnboardingErrorEmptyOTPType;
			}
			// else if ($scope.sendCounter >= $scope.otpMaxRequest) {
			// 	navigator.notification.alert(
			// 		$scope.globalMessage.OnboardingErrorMaxRequest.format($scope.otpMaxRequest),
			// 		function () { },
			// 		$scope.globalMessage.PopUpTitle,
			// 		$scope.globalMessage.PopUpButtonClose
			// 	);
			// }
			else {
				var email = $scope.stringEmpty;
				var mobile = $scope.stringEmpty;
				var name = $scope.globalData.Name;
				if ($scope.otpType.value == 'sms'){
					mobile = $scope.globalData.MobilePhone;
				}
				else if ($scope.otpType.value == 'email'){
					email = $scope.globalData.Email;
				}
                $scope.globalShowLoading();
				var promise = API.GenerateOTP(email, mobile, name, 'Onboarding');
                promise.then(function (response) {
					var errMessage = $scope.stringEmpty;
					if (response.errorCode == -1) {
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
					else if (response.errorCode > 0) {
						var errMessage = $scope.stringEmpty;

						if(response.errorCode == 1){
							errMessage = $scope.globalMessage.OnboardingErrorMaxRequest;
							errMessage = errMessage.replaceAt(errMessage.indexOf("*"), response.errorMessage);
						}
						else if(response.errorCode == 2){
							errMessage = $scope.globalMessage.OnboardingErrorTokenResendPeriod.format(response.errorMessage);
						}
						else {
							errMessage = $scope.globalMessage.OnboardingErrorSendTokenFailed;
						}
						try {
							navigator.notification.alert(
								errMessage,
								function () { },
								$scope.globalMessage.PopUpTitle,
								$scope.globalMessage.PopUpButtonClose
							);
						}
						catch (err) { alert(errMessage); }
					}
					else {
						if(response.value){
							$scope.otpTime = response.value.tokenTimer;
							$scope.sendCounter = $scope.sendCounter + 1;
							$scope.startCountdown();
						}
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
		else {
			$scope.onboardingContent2Class = $scope.stringEmpty;
		}
	}

	$scope.startCountdown = function () {
		$scope.onboardingContent2Class = 'active';
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

	$scope.confirmClick = function() {
		$scope.verifyToken.error = $scope.stringEmpty;
		if ($scope.verifyToken.value == $scope.stringEmpty) {
			$scope.verifyToken.error = $scope.globalMessage.OnboardingErrorVerifyTokenEmpty;
		}
		else {
			$scope.globalShowLoading();
			var promise = API.VerifyOTP($scope.email, $scope.verifyToken.value);
			promise.then(function (response) {
				if (response.errorCode == -1) {
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
				else if(response.errorCode == 1){
					$scope.verifyToken.error = $scope.globalMessage.OnboardingErrorVerifyTokenExpired;
				}
				else if(response.errorCode == 2){
					$scope.verifyToken.error = $scope.globalMessage.OnboardingErrorVerifyTokenFailed;
				}
				else{
					$scope.onClose();
					//$scope.$emit('closePage', { pageIndex: 0 });
					$scope.$emit('goToMainMenuPage');
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
});
