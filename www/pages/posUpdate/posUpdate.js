rootApp
.directive('posUpdatePage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/posUpdate/posUpdate.html'
    };
})
.controller('posUpdatePageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.PosUpdatePageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onBack(); },
    };
    
    $scope.$on('showPosUpdatePage', function(event, args){
        $scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.transDate = args.posData.applicationDate;
		$scope.notes = args.posData.note;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
    
        $timeout(function(){
            $scope.contentIndex = 0;
			$scope.model = {};
			$scope.photoPopUp = false;
			$scope.photoIndex = 0;
			$scope.formToken = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.PosUpdateLabelTokenMessage4,
				type: 'tel',
				error: $scope.stringEmpty,
				maxlength: 6
			};
			$scope.isRequestAvailable = '';
			$scope.tokenCounterLabel = '';
			$scope.timeout = new Date();
			$scope.timeLeft = '00:00';
            
			$scope.globalShowLoading();
            var promise = API.PosGetPosUpdate(args.posData.id);
            promise.then(
            function(args){
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
					$scope.model = args.value;
					$scope.model.transactionDate = moment($scope.transDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatFull);
					$scope.model.notes = $scope.notes;
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
				$scope.onClose();
			}
        );

        }, $scope.timeoutOpenPage);
    });

    $scope.$on('closePage', function(event, args){
        if ($scope.pageIndex == args.pageIndex && args.isForce) {
			$scope.onClose();
		}
		else if ($scope.pageIndex == args.pageIndex) {
			$scope.onBack();
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

	$scope.onBack = function () {
		try {
			navigator.notification.confirm (
				$scope.globalMessage.PosUpdatePopUpCloseForm,
				function (parm) {
					if (parm == 1) {
						$scope.onClose();
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
		}
		catch (err) { $scope.onClose(); }
	}

    $scope.prevClick = function() {
        $scope.contentIndex -= 1;
    }

    $scope.nextClick = function() {
		$scope.contentIndex += 1;
		if ($scope.contentIndex == $scope.countSelected() + 2) {
			$scope.requestClick();
		}
	}

	$scope.isNextAvailable = function() {
		return $scope.contentIndex == 0 ||
			(
				$scope.contentIndex == 1 &&
				$scope.countSelected() > 0
			) ||
			(
				$scope.contentIndex > 1 &&
				$scope.isImageFilled()
			);
	}
	
	$scope.countSelected = function() {
		var counter = 0;
		if ($scope.model && $scope.model.supportingDocumentList) {
			var elements = $scope.model.supportingDocumentList.filter(function(args) { return args.isSelected == true; });
			if (elements) {
				counter = elements.length;
			}
		}
		return counter;
	}

	$scope.isImageFilled = function() {
		var result = false;
		var index = $scope.contentIndex - 2;
		var elements = [];
		if ($scope.model && $scope.model.supportingDocumentList) {
			elements = $scope.model.supportingDocumentList.filter(function(args) { return args.isSelected == true; });
			if (elements && elements.length > 0 && elements.length > index) {
				if (elements[index].image) {
					result = true;
				}
			}
		}
		return result;
	}

	$scope.photoTake = function(index) {
		$scope.photoIndex = index;
		navigator.camera.getPicture(function cameraSuccess(imageUri) {
			var supportingDocument = $scope.model.supportingDocumentList.filter(function(args) { return args.isSelected == true; })[$scope.photoIndex];
			var c = document.createElement('canvas');
			var ctx = c.getContext("2d");
					var img = new Image();
			img.onload = function() {
				c.width=this.width;
				c.height=this.height;
				ctx.drawImage(img, 0, 0);
				supportingDocument.imageByte64 = c.toDataURL("image/jpeg");
			};
			img.src = imageUri;
			supportingDocument.image = imageUri;
			$scope.$apply();
		},
		function cameraError(error) {
			console.debug("Unable to obtain picture: " + error, "app");
		},
		{
			quality: 25,
			targetWidth: 3240,
			targetHeight: 3240,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: 1,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: false,
			correctOrientation: true
    	});
	}

	$scope.requestClick = function () {
		$scope.formToken.value = $scope.stringEmpty;
		$scope.formToken.error = $scope.stringEmpty;
		$scope.isRequestAvailable = 'disabled';
		$scope.globalShowLoading();
		var promise = API.PosGetPosUpdateToken($scope.model.id);
		promise.then(function (args) {
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
			else if (args.value.isRequestGranted) {
				$scope.tokenCounterLabel = $scope.globalMessage.PosUpdateLabelTokenMessage5.format(args.value.totalTokenRequest + 1);
				$scope.timeout = new Date().setSeconds(new Date().getSeconds() + args.value.timeout);
				$scope.countdown();
				try {
					window.plugins.toast.showShortBottom($scope.globalMessage.PosUpdateLabelTokenMessage6);
				}
				catch (err) { alert($scope.globalMessage.PosUpdateLabelTokenMessage6); }
			}
			else {
				var errorMessage = $scope.globalMessage.PosUpdateErrorMaxToken.format(args.value.maxTokenRequest);
				try {
					navigator.notification.alert(
						errorMessage,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert(errorMessage); }
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
	}

	$scope.countdown = function () {
		$timeout(function () {
			var timeLeft = moment.duration($scope.timeout - new Date());
			var minute = timeLeft._data.minutes;
			var second = timeLeft._data.seconds;
			if (minute < 10) {
				minute = '0' + minute;
			}
			if (second < 10) {
				second = '0' + second;
			}
			if (timeLeft._data.minutes >= 0 && timeLeft._data.seconds >= 0) {
				$scope.timeLeft = minute + ':' + second;
				$scope.countdown();
			} else {
				$scope.timeLeft = '00:00';
				$scope.isRequestAvailable = $scope.stringEmpty;
			}
		}, 1000);
	}

	$scope.confirmClick = function () {
		$scope.formToken.error = $scope.stringEmpty;
		console.log(JSON.stringify($scope.formToken.value));
		$scope.model.token = $scope.formToken.value;
		console.log(JSON.stringify($scope.model));

		// $scope.globalShowLoading();
		// var checkStatusPromise = API.SubmissionGetCurrentStatus();
		// checkStatusPromise.then(function (args) {
		// 	if (args.errorCode == -1) {
		// 		$scope.$emit('goToHomePage');
		// 		if (!$scope.$$phase) $scope.$apply();
		// 		$scope.globalHideLoading();
		// 		try {
		// 			navigator.notification.alert(
		// 				$scope.globalMessage.ApplicationUserExpired,
		// 				function () { },
		// 				$scope.stringEmpty,
		// 				$scope.globalMessage.PopUpButtonClose
		// 			);
		// 		}
		// 		catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
		// 	}
		// 	else if ((args.value.allowCreate == true && $scope.applicationNumber == $scope.stringEmpty) ||
		// 		(args.value.allowUpdate == true && $scope.applicationNumber != $scope.stringEmpty)) {
		// 		var promise = API.SubmissionSubmit (
		// 			$scope.applicationNumber,
		// 			$scope.form1IsAgreeNUTeam.options[0].checked,
		// 			$scope.form2IsPremiNoMoreThan10Percent.value,
		// 			$scope.form2IsApplicationSuitsYourNeeds.value,
		// 			$scope.form3CustomerName.value,
		// 			$scope.form3CustomerGender.value,
		// 			$scope.form3CustomerPlaceOfBirth.value,
		// 			$scope.form3CustomerDateOfBirth.value,
		// 			$scope.form3CustomerBenefit.value,
		// 			$scope.form3CustomerPaymentMethod.value,
		// 			$scope.form3CustomerPremi.value,
		// 			$scope.form4IdCard.value,
		// 			$scope.form4IdCardAddress1.value,
		// 			$scope.form4IdCardAddress2.value,
		// 			$scope.form4IdCardRTRW.value,
		// 			$scope.form4IdCardProvince.value,
		// 			$scope.form4IdCardCity.value,
		// 			$scope.form4IdCardZip.value,
		// 			$scope.form4IdCardDistrict.value,
		// 			$scope.form4IdCardSubDistrict.value,
		// 			$scope.form4IsMailAddressSameWithIdCard.value,
		// 			$scope.form4MailAddress1.value,
		// 			$scope.form4MailAddress2.value,
		// 			$scope.form4MailRTRW.value,
		// 			$scope.form4MailProvince.value,
		// 			$scope.form4MailCity.value,
		// 			$scope.form4MailZip.value,
		// 			$scope.form4MailDistrict.value,
		// 			$scope.form4MailSubDistrict.value,
		// 			$scope.form4HomePhoneAreaCode.value,
		// 			$scope.form4HomePhoneNumber.value,
		// 			$scope.form4MobileNumber.value,
		// 			$scope.form4Bank.value,
		// 			$scope.form4BankBranch.value,
		// 			$scope.form4BankAccountNumber.value,
		// 			$scope.form4Email.value,
		// 			$scope.form5RelationName.value,
		// 			$scope.form5RelationType.value,
		// 			$scope.imgIdCardByte64,
		// 			$scope.imgPersonByte64,
		// 			$scope.formToken.value
		// 		);
		// 		promise.then(function (args) {
		// 			if (args.errorCode == -1) {
		// 				$scope.$emit('goToHomePage');
		// 				if (!$scope.$$phase) $scope.$apply();
		// 				try {
		// 					navigator.notification.alert(
		// 						$scope.globalMessage.ApplicationUserExpired,
		// 						function () { },
		// 						$scope.stringEmpty,
		// 						$scope.globalMessage.PopUpButtonClose
		// 					);
		// 				}
		// 				catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
		// 			}
		// 			else if (args.errorCode != 0) {
		// 				var errorMessage = $scope.globalMessage.SubmissionErrorSaveFailed;
		// 				if (args.errorCode == 2) {
		// 					errorMessage = $scope.globalMessage.SubmissionErrorSaveCoreFailed;
		// 				}
		// 				try {
		// 					navigator.notification.alert(
		// 						errorMessage,
		// 						function () { },
		// 						$scope.globalMessage.PopUpTitle,
		// 						$scope.globalMessage.PopUpButtonOK
		// 					);
		// 				}
		// 				catch (err) { alert(errorMessage); }
		// 			}
		// 			else {
		// 				if(args.value.isTokenValid) {
		// 					// args.value.applicationStatus;
		// 					// args.value.policyNumber;
		// 					// args.value.virtualAccount;
		// 					// args.value.clientName;
		// 					// args.value.errorMessage;
		// 					// args.value.errorMessageLong;
		// 					var errorMessage = $scope.stringEmpty;
		// 					if (args.value.applicationStatus == 'A') {
		// 						errorMessage = $scope.globalMessage.SubmissionPopUpApprove + '. ';
		// 					}
		// 					else if (args.value.applicationStatus == 'R') {
		// 						errorMessage = $scope.globalMessage.SubmissionPopUpReject + '. ';
		// 					}
		// 					else {
		// 						errorMessage = $scope.globalMessage.SubmissionPopUpOther + '. ';
		// 					}
		// 					if (args.value.errorMessageLong != null)
		// 						errorMessage = errorMessage + args.value.errorMessageLong.substr(0, 50);
		// 					try {
		// 						navigator.notification.alert(
		// 							errorMessage,
		// 							function () { },
		// 							$scope.globalMessage.PopUpTitle,
		// 							$scope.globalMessage.PopUpButtonOK
		// 						);
		// 					}
		// 					catch (err) { alert(errorMessage); }
		// 					$scope.onClose();
		// 				}
		// 				else {
		// 					if (args.value.isTokenExpired) {
		// 						$scope.formToken.error = $scope.globalMessage.SubmissionErrorTokenExpired;
		// 					}
		// 					else {
		// 						$scope.formToken.error = $scope.globalMessage.SubmissionErrorTokenInvalid;
		// 					}
		// 				}
		// 			}
		// 			$scope.globalHideLoading();
		// 		},
		// 		function (error) {
		// 			try {
		// 				navigator.notification.alert(
		// 					$scope.globalMessage.ApplicationErrorConnectionFailed,
		// 					function () { },
		// 					$scope.globalMessage.PopUpTitle,
		// 					$scope.globalMessage.PopUpButtonOK
		// 				);
		// 			}
		// 			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
		// 			$scope.globalHideLoading();
		// 		});
		// 	}
		// 	else {
		// 		try {
		// 			navigator.notification.alert(
		// 				$scope.globalMessage.SubmissionErrorUnauthorizeUpdate,
		// 				function () { },
		// 				$scope.globalMessage.PopUpTitle,
		// 				$scope.globalMessage.PopUpButtonOK
		// 			);
		// 		}
		// 		catch (err) { alert($scope.globalMessage.SubmissionErrorUnauthorizeUpdate); }
		// 		$scope.globalHideLoading();
		// 	}
		// },
		// function (error) {
		// 	try {
		// 		navigator.notification.alert(
		// 			$scope.globalMessage.ApplicationErrorConnectionFailed,
		// 			function () { },
		// 			$scope.globalMessage.PopUpTitle,
		// 			$scope.globalMessage.PopUpButtonOK
		// 		);
		// 	}
		// 	catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
		// 	$scope.globalHideLoading();
		// });
	}
});