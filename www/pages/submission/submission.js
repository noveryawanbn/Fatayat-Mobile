rootApp
.directive('submissionPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/submission/submission.html'
	};
})
.controller('submissionPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 6,
		title: $scope.globalMessage.SubmissionPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		right1: '<img src="img/icon-save.svg" />',
		onLeftClick: function () { $scope.onBack(); },
		onRight1Click: function () { $scope.onSave(); }
	};

	$scope.$on('showSubmissionPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			if ($scope.globalData.Rank.toLowerCase() == 'nsh' ||
					$scope.globalData.Rank.toLowerCase() == 'am'
			) {
					$scope.allowSubmit = false;
			} else {
					$scope.allowSubmit = true;
			}
			$scope.isOnLoad = true;
			$scope.disabled = true;
			$scope.productName = $scope.stringEmpty;
			$scope.contentIndex = 1;
			$scope.content2Class = $scope.stringEmpty;
			$scope.content3Class = $scope.stringEmpty;
			$scope.content4Class = $scope.stringEmpty;
			$scope.content5Class = $scope.stringEmpty;
			$scope.content6Class = $scope.stringEmpty;
			$scope.content7Class = $scope.stringEmpty;
			$scope.content8Class = $scope.stringEmpty;
			$scope.content9Class = $scope.stringEmpty;
			$scope.content10Class = $scope.stringEmpty;
			$scope.applicationNumber = args.applicationNumber;
			$scope.form1IsAgreeNUTeam = {
				value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionCheckboxAgree, value: $scope.stringEmpty }
				]
			};
			$scope.form2IsPremiNoMoreThan10Percent = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab2Message1,
				type: 'radio',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionRadioYes, value: true },
					{ text: $scope.globalMessage.SubmissionRadioNo, value: false }
				]
			};
			$scope.form2IsApplicationSuitsYourNeeds = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab2Message2,
				type: 'radio',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionRadioYes, value: true },
					{ text: $scope.globalMessage.SubmissionRadioNo, value: false }
				]
			};
			$scope.form3CustomerName = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form3CustomerGender = {
				value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'radio',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form3CustomerPlaceOfBirth = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelPlaceOfBirth,
				type: 'text',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form3CustomerDateOfBirth = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelDateOfBirth,
				type: 'date',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form3CustomerBenefit = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelBenefit,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form3CustomerPaymentMethod = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelPaymentMethod,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			},
			$scope.form3CustomerPremi = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelPremi,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form3CustomerPeriod = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelPeriod,
				type: 'select',
				error: $scope.stringEmpty,
				options: [],
				isDisabled: true
			};
			$scope.form3CustomerCompensation = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab3LabelCompensation,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				isDisabled: true
			};
			$scope.form4Separator1 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelBasedOnIdCard,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4IdCard = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4labelIdCard,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 30
			};
			$scope.form4IdCardAddress1 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAddress,
				type: 'address',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form4IdCardAddress2 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAddress,
				type: 'address',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form4IdCardRTRW = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelRTRW,
				type: 'rt/rw',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 10
			};
			$scope.form4IdCardProvince = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelProvince,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4IdCardCity = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelCity,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4IdCardZip = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelZip,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 5
			};
			$scope.form4IdCardDistrict = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelDistrict,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
			};
			$scope.form4IdCardSubDistrict = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelSubDistrict,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
			};
			$scope.form4IsMailAddressSameWithIdCard = {
				value: false,
				label: $scope.globalMessage.SubmissionTab4LabelIsMailAddressSameWithIdCard,
				type: 'radio',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionRadioYes, value: true },
					{ text: $scope.globalMessage.SubmissionRadioNo, value: false }
				]
			}
			$scope.form4Separator2 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelMailAddress,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4MailAddress1 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAddress,
				type: 'address',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form4MailAddress2 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAddress,
				type: 'address',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form4MailRTRW = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelRTRW,
				type: 'rt/rw',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 10
			};
			$scope.form4MailProvince = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelProvince,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4MailCity = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelCity,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4MailZip = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelZip,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 5
			};
			$scope.form4MailDistrict = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelDistrict,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
			};
			$scope.form4MailSubDistrict = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelSubDistrict,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
			};
			$scope.form4Separator3 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelPhone,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4HomePhoneAreaCode = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAreaCode,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 5
			};
			$scope.form4HomePhoneNumber = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelPhoneNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 15
			};
			$scope.form4Separator4 = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelMobilePhone,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4MobileNumber = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelMobilePhoneNumber,
				type: 'mobile',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
			};
			$scope.form4Bank = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelBank,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form4BankBranch = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelBranch,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
			};
			$scope.form4BankAccountNumber = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelAccountNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
			};
			$scope.form4Email = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab4LabelEmailAddress,
				type: 'email',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form5RelationName = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab5LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
			};
			$scope.form5RelationType = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab5LabelRelation,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
			};
			$scope.form6SubmissionAgree = {
				value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionCheckboxAgree, value: $scope.stringEmpty }
				]
			};
			$scope.form7SubmissionAgree = {
				value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.SubmissionCheckboxAgree, value: $scope.stringEmpty }
				]
			};
			$scope.formToken = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.SubmissionTab10Message3,
				type: 'tel',
				error: $scope.stringEmpty,
				maxlength: 6
			}
			$scope.tokenCounterLabel = $scope.stringEmpty;
			$scope.fobIdCardIcon = 'fa-camera';
			$scope.fobPersonIcon = 'fa-camera';
			$scope.imgIdCard = undefined;
			$scope.imgPerson = undefined;
			$scope.imgIdCardByte64 = undefined;
			$scope.imgPersonByte64 = undefined;
			$scope.masterData = undefined;
			$scope.minYear = 1950;
			$scope.maxYear = new Date().getFullYear() - 10;

			$scope.setNavigatonType();
			$scope.loadMasterData();
			$scope.globalHideLoading();
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
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
		
		$scope.getDraftList();
	}

	$scope.onBack = function () {
		try {
			navigator.notification.confirm (
				$scope.globalMessage.SubmissionPopUpCloseForm,
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

	$scope.loadMasterData = function () {
		$scope.form3CustomerGender.options = [];
		$scope.form3CustomerPremi.options = [];
		$scope.form4IdCardProvince.options = [];
		$scope.form4IdCardCity.options = [];
		$scope.form4MailProvince.options = [];
		$scope.form4MailCity.options = [];
		$scope.form4Bank.options = [];
		$scope.form5RelationType.options = [];
		var promise = API.SubmissionGetMasterData();
		promise.then(
			function (args) {
				$scope.masterData = args.value;
				if ($scope.masterData != null) {
					if ($scope.masterData.sexCodeList != null &&
						$scope.masterData.sexCodeList.ftyGetSexCode != null) {
						$scope.masterData.sexCodeList.ftyGetSexCode.forEach(function(value) {
							$scope.form3CustomerGender.options.push({ text: value.sexDescription, value: value.sexCode });
						});
					}
					if ($scope.masterData.relToInsuredList != null &&
						$scope.masterData.relToInsuredList.ftyGetRelToInsured != null) {
						$scope.masterData.relToInsuredList.ftyGetRelToInsured.forEach(function(value) {
							$scope.form5RelationType.options.push({ text: value.relToInsuredDescription, value: value.relToInsuredCode });
						});
					}
					if ($scope.masterData.bankList != null &&
						$scope.masterData.bankList.ftyGetBank != null) {
						$scope.masterData.bankList.ftyGetBank.forEach(function(value) {
							$scope.form4Bank.options.push({ text: value.bankDescription, value: value.bankCode });
						});
					}
					if ($scope.masterData.provinceList != null &&
						$scope.masterData.provinceList.ftyGetProvince != null) {
						$scope.masterData.provinceList.ftyGetProvince.forEach(function(value) {
							$scope.form4IdCardProvince.options.push({ text: value.provinceDescription, value: value.provinceCode });
							$scope.form4MailProvince.options.push({ text: value.provinceDescription, value: value.provinceCode });
						});
					}
				}

				if ($scope.applicationNumber != $scope.stringEmpty) {
					$scope.loadSubmissionData();
				}
				else {
					$scope.isOnLoad = false;
				}
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
	}

	$scope.loadSubmissionData = function() {
		$scope.globalShowLoading();
		var promise = API.SubmissionGetDraftDetail($scope.applicationNumber);
		promise.then(
			function (args) {
				if($scope.applicationNumber != args.value.applicationNumber) {
					try {
						navigator.notification.alert(
							$scope.globalMessage.SubmissionErrorFailedOpenDraft,
							function () { },
							$scope.globalMessage.PopUpTitle,
							$scope.globalMessage.PopUpButtonOK
						);
					}
					catch (err) { alert($scope.globalMessage.SubmissionErrorFailedOpenDraft); }
					$scope.globalHideLoading();
					$scope.onClose();
				}
				else {
					$scope.form1IsAgreeNUTeam.options[0].checked = args.value.isAgreeNUTeam;
					$scope.form2IsPremiNoMoreThan10Percent.value = args.value.isPremiNoMoreThan10Percent;
					$scope.form2IsApplicationSuitsYourNeeds.value = args.value.isApplicationSuitsYourNeeds;
					$scope.form3CustomerName.value = args.value.customerName;
					$scope.form3CustomerGender.value = args.value.customerGender;
					$scope.form3CustomerPlaceOfBirth.value = args.value.customerPlaceOfBirth;
					if (new Date(args.value.customerDateOfBirth).getFullYear() > 1900)
						$scope.form3CustomerDateOfBirth.value = new Date(args.value.customerDateOfBirth);
					$scope.form4IdCard.value = args.value.idCard;
					$scope.form4IdCardAddress1.value = args.value.idCardAddress1;
					$scope.form4IdCardAddress2.value = args.value.idCardAddress2;
					$scope.form4IdCardRTRW.value = args.value.idCardRTRW;
					$scope.form4IdCardProvince.value = args.value.idCardProvince;
					$scope.form4IdCardZip.value = args.value.idCardZIP;
					$scope.form4IdCardDistrict.value = args.value.idCardDistrict;
					$scope.form4IdCardSubDistrict.value = args.value.idCardSubDistrict;
					$scope.form4IsMailAddressSameWithIdCard.value = args.value.isMailAddressSameWithIdCard;
					$scope.form4MailAddress1.value = args.value.mailAddress1;
					$scope.form4MailAddress2.value = args.value.mailAddress2;
					$scope.form4MailRTRW.value = args.value.mailRTRW;
					$scope.form4MailProvince.value = args.value.mailProvince;
					$scope.form4MailZip.value = args.value.mailZIP;
					$scope.form4MailDistrict.value = args.value.mailDistrict;
					$scope.form4MailSubDistrict.value = args.value.mailSubDistrict;
					$scope.form4HomePhoneAreaCode.value = args.value.homePhoneAreaCode;
					$scope.form4HomePhoneNumber.value = args.value.homePhoneNumber;
					$scope.form4MobileNumber.value = args.value.mobileNumber;
					$scope.form4Bank.value = args.value.bank;
					$scope.form4BankBranch.value = args.value.bankBranch;
					$scope.form4BankAccountNumber.value = args.value.bankAccountNumber;
					$scope.form4Email.value = args.value.email;
					$scope.form5RelationName.value = args.value.relationName;
					$scope.form5RelationType.value = args.value.relationType;
					$scope.imgIdCard = args.value.imageIdCard;
					$scope.imgPerson = args.value.imagePerson;

					if (new Date($scope.form3CustomerDateOfBirth.value).getFullYear() > 1900) {
						$scope.generateBenefit();
						$timeout(function () {
							$scope.form3CustomerBenefit.value = args.value.customerBenefit;
							$scope.generatePaymentMethod();
							$timeout(function () {
								$scope.form3CustomerPaymentMethod.value = args.value.customerPaymentMethod;
								$scope.generatePremi();
								$timeout(function () {
									$scope.form3CustomerPremi.value = args.value.customerPremi;
									$timeout(function () {
										var contribution = $scope.masterData.contributionList.ftyGetContribution.filter(function (args) {
											return args.planCode == $scope.form3CustomerBenefit.value && args.paymentMode == $scope.form3CustomerPaymentMethod.value;
										})[0];
										if (contribution) {
											$scope.form3CustomerCompensation.value = ($scope.form3CustomerPremi.value * contribution.benefitValidation).toLocaleString();
										}
									}, $scope.timeoutClosePage );
								}, $scope.timeoutClosePage );
							}, $scope.timeoutClosePage );
						}, $scope.timeoutClosePage );
					}

					$scope.generateIdCardCity();
					$scope.generateMailCity();
					$timeout(function () {
						$scope.form4IdCardCity.value = args.value.idCardCity;
						$scope.form4MailCity.value = args.value.mailCity;
					}, $scope.timeoutClosePage );
				}
				$scope.isOnLoad = false;
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
	}

	$scope.idCardPhotoClick = function() {
		navigator.camera.getPicture(function cameraSuccess(imageUri) {
            var c = document.createElement('canvas');
            var ctx = c.getContext("2d");
			var img = new Image();
            img.onload = function(){
                c.width=this.width;
                c.height=this.height;
				ctx.drawImage(img, 0, 0);
				$scope.imgIdCardByte64 = c.toDataURL("image/jpeg");
            };
            img.src=imageUri;
			
			$scope.imgIdCard = imageUri;
            $scope.$apply();
		},
		function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
		},
		{
            quality: 25,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true 
        });
	}

	$scope.personPhotoClick = function() {
		navigator.camera.getPicture(function cameraSuccess(imageUri) {
			var c = document.createElement('canvas');
			var ctx = c.getContext("2d");
			var img = new Image();
			img.onload = function(){
			    c.width=this.width;
			    c.height=this.height;
				ctx.drawImage(img, 0, 0);
				$scope.imgPersonByte64 = c.toDataURL("image/jpeg");
			};
			img.src=imageUri;

			$scope.imgPerson = imageUri;
			$scope.$apply();
		},
		function cameraError(error) {
			console.debug("Unable to obtain picture: " + error, "app");
		},
		{
			quality: 25,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: false,
			correctOrientation: true
		});
	}

	$scope.onSave = function () {
		if ($scope.validateSave()) {
			$scope.globalShowLoading();
			var checkStatusPromise = API.SubmissionGetCurrentStatus();
			checkStatusPromise.then(function (args) {
				if ((args.value.allowCreate == true && $scope.applicationNumber == $scope.stringEmpty) ||
					(args.value.allowUpdate == true && $scope.applicationNumber != $scope.stringEmpty)) {
					var promise = API.SubmissionSave(
						$scope.applicationNumber,
						$scope.form1IsAgreeNUTeam.options[0].checked,
						$scope.form2IsPremiNoMoreThan10Percent.value,
						$scope.form2IsApplicationSuitsYourNeeds.value,
						$scope.form3CustomerName.value,
						$scope.form3CustomerGender.value,
						$scope.form3CustomerPlaceOfBirth.value,
						$scope.form3CustomerDateOfBirth.value,
						$scope.form3CustomerBenefit.value,
						$scope.form3CustomerPaymentMethod.value,
						$scope.form3CustomerPremi.value,
						$scope.form4IdCard.value,
						$scope.form4IdCardAddress1.value,
						$scope.form4IdCardAddress2.value,
						$scope.form4IdCardRTRW.value,
						$scope.form4IdCardProvince.value,
						$scope.form4IdCardCity.value,
						$scope.form4IdCardZip.value,
						$scope.form4IdCardDistrict.value,
						$scope.form4IdCardSubDistrict.value,
						$scope.form4IsMailAddressSameWithIdCard.value,
						$scope.form4MailAddress1.value,
						$scope.form4MailAddress2.value,
						$scope.form4MailRTRW.value,
						$scope.form4MailProvince.value,
						$scope.form4MailCity.value,
						$scope.form4MailZip.value,
						$scope.form4MailDistrict.value,
						$scope.form4MailSubDistrict.value,
						$scope.form4HomePhoneAreaCode.value,
						$scope.form4HomePhoneNumber.value,
						$scope.form4MobileNumber.value,
						$scope.form4Bank.value,
						$scope.form4BankBranch.value,
						$scope.form4BankAccountNumber.value,
						$scope.form4Email.value,
						$scope.form5RelationName.value,
						$scope.form5RelationType.value,
						$scope.imgIdCardByte64,
						$scope.imgPersonByte64
					);
					promise.then(function (args) {

						if (args.errorCode != 0) {
							var errorMessage = $scope.globalMessage.SubmissionErrorSaveFailed;
							if (args.errorCode == 2) {
								errorMessage = $scope.globalMessage.SubmissionErrorSaveCoreFailed;
							}
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
						else {
							if(args.value.applicationNumber != undefined && args.value.applicationNumber != $scope.stringEmpty) {
								$scope.applicationNumber = args.value.applicationNumber;
							}
							else if (args.errorCode != 0) {
								try {
									navigator.notification.alert(
										$scope.globalMessage.SubmissionErrorSaveFailed,
										function () { },
										$scope.globalMessage.PopUpTitle,
										$scope.globalMessage.PopUpButtonOK
									);
								}
								catch (err) { alert($scope.globalMessage.SubmissionErrorSaveFailed); }
								$scope.globalHideLoading();
							}
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
				else {
					try {
						navigator.notification.alert(
							$scope.globalMessage.SubmissionErrorUnauthorizeUpdate,
							function () { },
							$scope.globalMessage.PopUpTitle,
							$scope.globalMessage.PopUpButtonOK
						);
					}
					catch (err) { alert($scope.globalMessage.SubmissionErrorUnauthorizeUpdate); }
					$scope.globalHideLoading();
				}
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
		else {
			try {
				navigator.notification.alert(
					$scope.globalMessage.SubmissionErrorFormSave,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.SubmissionErrorFormSave); }
		}
	}

	$scope.prevClick = function() {
		switch ($scope.contentIndex) {
			case 2:
				$scope.content2Class = $scope.stringEmpty;
				break;
			case 3:
				$scope.content3Class = $scope.stringEmpty;
				break;
			case 4:
				$scope.content4Class = $scope.stringEmpty;
				break;
			case 5:
				$scope.content5Class = $scope.stringEmpty;
				break;
			case 6:
				$scope.content6Class = $scope.stringEmpty;
				break;
			case 7:
				$scope.content7Class = $scope.stringEmpty;
				break;
			case 8:
				$scope.content8Class = $scope.stringEmpty;
				break;
			case 9:
				$scope.content9Class = $scope.stringEmpty;
				break;
			case 10:
				$scope.content10Class = $scope.stringEmpty;
				break;
			default:
		}
		if($scope.contentIndex > 1) {
			$scope.contentIndex = $scope.contentIndex - 1;
		}
		$scope.setNavigatonType();
		$timeout( function(){
			$('.submission-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
        }, $scope.timeoutOpenPage );
	}

	$scope.nextClick = function() {
		if($scope.contentIndex < 10) {
			$scope.contentIndex = $scope.contentIndex + 1;
		}
		if ($scope.contentIndex == 3 && !$scope.validateForm2()) {
			$scope.contentIndex = 2;
		}
		if ($scope.contentIndex == 4 && !$scope.validateForm3()) {
			$scope.contentIndex = 3;
		}
		if ($scope.contentIndex == 5 && !$scope.validateForm4()) {
			$scope.contentIndex = 4;
		}
		if ($scope.contentIndex == 6 && !$scope.validateForm5()) {
			$scope.contentIndex = 5;
		}
		if ($scope.contentIndex == 10) {
			if (!$scope.validateSubmit()) {
				$scope.contentIndex = $scope.contentIndex - 1;
				try {
					navigator.notification.alert(
						$scope.globalMessage.SubmissionErrorFormSubmit,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.SubmissionErrorFormSubmit); }
			}
		}
		$scope.setNavigatonType();
		switch ($scope.contentIndex) {
			case 2:
				$scope.content2Class = 'active';
				break;
			case 3:
				$scope.content3Class = 'active';
				break;
			case 4:
				$scope.content4Class = 'active';
				break;
			case 5:
				$scope.content5Class = 'active';
				break;
			case 6:
				$scope.content6Class = 'active';
				break;
			case 7:
				$scope.content7Class = 'active';
				break;
			case 8:
				$scope.content8Class = 'active';
				break;
			case 9:
				$scope.content9Class = 'active';
				break;
			case 10:
				if ($scope.formToken.value == $scope.stringEmpty || $scope.formToken.value == undefined) $scope.initFormToken();
				break;
			default:
		}
		$timeout( function(){
			$('.submission-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
        }, $scope.timeoutOpenPage );
	}

	$scope.setNavigatonType = function () {
		if ($scope.contentIndex >= 4 &&
			$scope.globalData.Rank.toLowerCase() != 'nsh' &&
			$scope.globalData.Rank.toLowerCase() != 'am'
		) {
			$scope.navBarTop.type = 6;
		}
		else {
			$scope.navBarTop.type = 5;
		}
	}

	$scope.initFormToken = function () {
		$scope.formToken.value = $scope.stringEmpty;
		$scope.requestClick();
	}

	$scope.requestClick = function () {
		$scope.formToken.value = $scope.stringEmpty;
		$scope.formToken.error = $scope.stringEmpty;
		$scope.isRequestAvailable = 'disabled';
		$scope.globalShowLoading();
		var promise = API.SubmissionRequestToken ($scope.form4MobileNumber.value);
		promise.then(function (args) {
			if (args.value.isRequestGranted) {
				$scope.tokenCounterLabel = $scope.globalMessage.SubmissionTab10Message2.format(args.value.totalTokenRequest + 1);
				$scope.content10Class = 'active';
				$scope.timeout = new Date().setSeconds(new Date().getSeconds() + args.value.timeout);
				$scope.countdown();
				try {
					window.plugins.toast.showShortBottom($scope.globalMessage.SubmissionToastRequestToken);
				}
				catch (err) { alert($scope.globalMessage.SubmissionToastRequestToken); }
			}
			else {
				$scope.contentIndex = $scope.contentIndex - 1;
				var errorMessage = $scope.globalMessage.SubmissionErrorMaxToken.format(args.value.maxTokenRequest);
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

		$scope.globalShowLoading();
		var checkStatusPromise = API.SubmissionGetCurrentStatus();
		checkStatusPromise.then(function (args) {
			if ((args.value.allowCreate == true && $scope.applicationNumber == $scope.stringEmpty) ||
				(args.value.allowUpdate == true && $scope.applicationNumber != $scope.stringEmpty)) {
				var promise = API.SubmissionSubmit (
					$scope.applicationNumber,
					$scope.form1IsAgreeNUTeam.options[0].checked,
					$scope.form2IsPremiNoMoreThan10Percent.value,
					$scope.form2IsApplicationSuitsYourNeeds.value,
					$scope.form3CustomerName.value,
					$scope.form3CustomerGender.value,
					$scope.form3CustomerPlaceOfBirth.value,
					$scope.form3CustomerDateOfBirth.value,
					$scope.form3CustomerBenefit.value,
					$scope.form3CustomerPaymentMethod.value,
					$scope.form3CustomerPremi.value,
					$scope.form4IdCard.value,
					$scope.form4IdCardAddress1.value,
					$scope.form4IdCardAddress2.value,
					$scope.form4IdCardRTRW.value,
					$scope.form4IdCardProvince.value,
					$scope.form4IdCardCity.value,
					$scope.form4IdCardZip.value,
					$scope.form4IdCardDistrict.value,
					$scope.form4IdCardSubDistrict.value,
					$scope.form4IsMailAddressSameWithIdCard.value,
					$scope.form4MailAddress1.value,
					$scope.form4MailAddress2.value,
					$scope.form4MailRTRW.value,
					$scope.form4MailProvince.value,
					$scope.form4MailCity.value,
					$scope.form4MailZip.value,
					$scope.form4MailDistrict.value,
					$scope.form4MailSubDistrict.value,
					$scope.form4HomePhoneAreaCode.value,
					$scope.form4HomePhoneNumber.value,
					$scope.form4MobileNumber.value,
					$scope.form4Bank.value,
					$scope.form4BankBranch.value,
					$scope.form4BankAccountNumber.value,
					$scope.form4Email.value,
					$scope.form5RelationName.value,
					$scope.form5RelationType.value,
					$scope.imgIdCardByte64,
					$scope.imgPersonByte64,
					$scope.formToken.value
				);
				promise.then(function (args) {
					if (args.errorCode != 0) {
						var errorMessage = $scope.globalMessage.SubmissionErrorSaveFailed;
						if (args.errorCode == 2) {
							errorMessage = $scope.globalMessage.SubmissionErrorSaveCoreFailed;
						}
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
					else {
						if(args.value.isTokenValid) {
							// args.value.applicationStatus;
							// args.value.policyNumber;
							// args.value.virtualAccount;
							// args.value.clientName;
							// args.value.errorMessage;
							// args.value.errorMessageLong;
							var errorMessage = $scope.stringEmpty;
							if (args.value.applicationStatus == 'A') {
								errorMessage = $scope.globalMessage.SubmissionPopUpApprove + '. ';
							}
							else if (args.value.applicationStatus == 'R') {
								errorMessage = $scope.globalMessage.SubmissionPopUpReject + '. ';
							}
							else {
								errorMessage = $scope.globalMessage.SubmissionPopUpOther + '. ';
							}
							if (args.value.errorMessageLong != null)
								errorMessage = errorMessage + args.value.errorMessageLong.substr(0, 50);
							try {
								navigator.notification.alert(
									errorMessage,
									function () { },
									$scope.globalMessage.PopUpTitle,
									$scope.globalMessage.PopUpButtonOK
								);
							}
							catch (err) { alert(errorMessage); }
							$scope.onClose();
						}
						else {
							if (args.value.isTokenExpired) {
								$scope.formToken.error = $scope.globalMessage.SubmissionErrorTokenExpired;
							}
							else {
								$scope.formToken.error = $scope.globalMessage.SubmissionErrorTokenInvalid;
							}
						}
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
			else {
				try {
					navigator.notification.alert(
						$scope.globalMessage.SubmissionErrorUnauthorizeUpdate,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.SubmissionErrorUnauthorizeUpdate); }
				$scope.globalHideLoading();
			}
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

	$scope.form4Email_OnBlur = function () {
		if ($scope.form4Email) {
			$scope.form4Email.error = $scope.stringEmpty;
			if ($scope.form4Email.value && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.form4Email.value)) {
				$scope.form4Email.error = $scope.globalMessage.SubmissionErrorEmailFormat;
			}
		}
	}

	$scope.validateForm2 = function () {
		var isValid = true;

		$scope.form2IsPremiNoMoreThan10Percent.error = $scope.stringEmpty;
		$scope.form2IsApplicationSuitsYourNeeds.error = $scope.stringEmpty;

		if ($scope.form2IsPremiNoMoreThan10Percent.value + $scope.stringEmpty == $scope.stringEmpty) {
			isValid = false;
			$scope.form2IsPremiNoMoreThan10Percent.error = $scope.globalMessage.SubmissionErrorRadioButtonNull;
		}
		if ($scope.form2IsApplicationSuitsYourNeeds.value + $scope.stringEmpty == $scope.stringEmpty) {
			isValid = false;
			$scope.form2IsApplicationSuitsYourNeeds.error = $scope.globalMessage.SubmissionErrorRadioButtonNull;
		}

		return isValid;
	}

	$scope.validateForm3 = function () {
		var isValid = true;

		$scope.form3CustomerName.error = $scope.stringEmpty;
		$scope.form3CustomerGender.error = $scope.stringEmpty;
		$scope.form3CustomerPlaceOfBirth.error = $scope.stringEmpty;
		$scope.form3CustomerDateOfBirth.error = $scope.stringEmpty;
		$scope.form3CustomerBenefit.error = $scope.stringEmpty;
		$scope.form3CustomerPaymentMethod.error = $scope.stringEmpty;
		$scope.form3CustomerPremi.error = $scope.stringEmpty;

		if (!$scope.validateString($scope.form3CustomerName.value)) {
			$scope.form3CustomerName.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerName.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerGender.value)) {
			$scope.form3CustomerGender.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerGender.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerPlaceOfBirth.value)) {
			$scope.form3CustomerPlaceOfBirth.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerPlaceOfBirth.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerDateOfBirth.value)) {
			$scope.form3CustomerDateOfBirth.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerDateOfBirth.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerBenefit.value)) {
			$scope.form3CustomerBenefit.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerBenefit.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerPaymentMethod.value)) {
			$scope.form3CustomerPaymentMethod.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerPaymentMethod.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form3CustomerPremi.value)) {
			$scope.form3CustomerPremi.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerPremi.label);
			isValid = false;
		}

		return isValid;
	}

	$scope.validateForm4 = function () {
		var isValid = true;

		$scope.form4IdCard.error = $scope.stringEmpty;
		$scope.form4IdCardAddress1.error = $scope.stringEmpty;
		$scope.form4IdCardAddress2.error = $scope.stringEmpty;
		$scope.form4IdCardRTRW.error = $scope.stringEmpty;
		$scope.form4IdCardProvince.error = $scope.stringEmpty;
		$scope.form4IdCardCity.error = $scope.stringEmpty;
		$scope.form4IdCardZip.error = $scope.stringEmpty;
		$scope.form4IdCardDistrict.error = $scope.stringEmpty;
		$scope.form4IdCardSubDistrict.error = $scope.stringEmpty;
		$scope.form4MailAddress1.error = $scope.stringEmpty;
		$scope.form4MailAddress2.error = $scope.stringEmpty;
		$scope.form4MailRTRW.error = $scope.stringEmpty;
		$scope.form4MailProvince.error = $scope.stringEmpty;
		$scope.form4MailCity.error = $scope.stringEmpty;
		$scope.form4MailZip.error = $scope.stringEmpty;
		$scope.form4MailDistrict.error = $scope.stringEmpty;
		$scope.form4MailSubDistrict.error = $scope.stringEmpty;
		$scope.form4HomePhoneAreaCode.error = $scope.stringEmpty;
		$scope.form4HomePhoneNumber.error = $scope.stringEmpty;
		$scope.form4MobileNumber.error = $scope.stringEmpty;
		$scope.form4Bank.error = $scope.stringEmpty;
		$scope.form4BankBranch.error = $scope.stringEmpty;
		$scope.form4BankAccountNumber.error = $scope.stringEmpty;
		$scope.form4Email.error = $scope.stringEmpty;

		if (!$scope.validateString($scope.form4IdCard.value)) {
			$scope.form4IdCard.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCard.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form4IdCardAddress1.value)) {
			$scope.form4IdCardAddress1.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardAddress1.label);
			isValid = false;
		}
		// if (!$scope.validateString($scope.form4IdCardAddress2.value)) {
		// 	$scope.form4IdCardAddress2.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardAddress2.label);
		// 	isValid = false;
		// }
		// if (!$scope.validateString($scope.form4IdCardRTRW.value)) {
		// 	$scope.form4IdCardRTRW.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardRTRW.label);
		// 	isValid = false;
		// }
		if (!$scope.validateString($scope.form4IdCardProvince.value)) {
			$scope.form4IdCardProvince.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardProvince.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form4IdCardCity.value)) {
			$scope.form4IdCardCity.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardCity.label);
			isValid = false;
		}
		// if (!$scope.validateString($scope.form4IdCardZip.value)) {
		// 	$scope.form4IdCardZip.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardZip.label);
		// 	isValid = false;
		// }
		if (!$scope.validateString($scope.form4IdCardDistrict.value)) {
			$scope.form4IdCardDistrict.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardDistrict.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form4IdCardSubDistrict.value)) {
			$scope.form4IdCardSubDistrict.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCardSubDistrict.label);
			isValid = false;
		}
		if(!$scope.form4IsMailAddressSameWithIdCard.value) {
			if (!$scope.validateString($scope.form4MailAddress1.value)) {
				$scope.form4MailAddress1.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailAddress1.label);
				isValid = false;
			}
			// if (!$scope.validateString($scope.form4MailAddress2.value)) {
			// 	$scope.form4MailAddress2.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailAddress2.label);
			// 	isValid = false;
			// }
			// if (!$scope.validateString($scope.form4MailRTRW.value)) {
			// 	$scope.form4MailRTRW.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailRTRW.label);
			// 	isValid = false;
			// }
			if (!$scope.validateString($scope.form4MailProvince.value)) {
				$scope.form4MailProvince.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailProvince.label);
				isValid = false;
			}
			if (!$scope.validateString($scope.form4MailCity.value)) {
				$scope.form4MailCity.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailCity.label);
				isValid = false;
			}
			// if (!$scope.validateString($scope.form4MailZip.value)) {
			// 	$scope.form4MailZip.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailZip.label);
			// 	isValid = false;
			// }
			if (!$scope.validateString($scope.form4MailDistrict.value)) {
				$scope.form4MailDistrict.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailDistrict.label);
				isValid = false;
			}
			if (!$scope.validateString($scope.form4MailSubDistrict.value)) {
				$scope.form4MailSubDistrict.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MailSubDistrict.label);
				isValid = false;
			}
		}
		// if (!$scope.validateString($scope.form4HomePhoneAreaCode.value)) {
		// 	$scope.form4HomePhoneAreaCode.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4HomePhoneAreaCode.label);
		// 	isValid = false;
		// }
		if ($scope.validateString($scope.form4HomePhoneAreaCode.value) &&
			$scope.form4HomePhoneAreaCode.value[0] != '0') {
			$scope.form4HomePhoneAreaCode.error = $scope.globalMessage.SubmissionErrorWrongPhoneAreaCodeFormat;
			isValid = false;
		}
		// if (!$scope.validateString($scope.form4HomePhoneNumber.value)) {
		// 	$scope.form4HomePhoneNumber.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4HomePhoneNumber.label);
		// 	isValid = false;
		// }
		if (!$scope.validateString($scope.form4MobileNumber.value)) {
			$scope.form4MobileNumber.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MobileNumber.label);
			isValid = false;
		}
		else if ($scope.form4MobileNumber.value[0] != '0') {
			$scope.form4MobileNumber.error = $scope.globalMessage.SubmissionErrorWrongMobilePhoneFormat;
			isValid = false;
		}
		if (!$scope.validateString($scope.form4Bank.value)) {
			$scope.form4Bank.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4Bank.label);
			isValid = false;
		}
		// if (!$scope.validateString($scope.form4BankBranch.value)) {
		// 	$scope.form4BankBranch.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4BankBranch.label);
		// 	isValid = false;
		// }
		if (!$scope.validateString($scope.form4BankAccountNumber.value)) {
			$scope.form4BankAccountNumber.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4BankAccountNumber.label);
			isValid = false;
		}
		// if (!$scope.validateString($scope.form4Email.value)) {
		// 	$scope.form4Email.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4Email.label);
		// 	isValid = false;
		// }
		if ($scope.form4Email.value && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.form4Email.value)) {
			$scope.form4Email.error = $scope.globalMessage.SubmissionErrorEmailFormat;
			isValid = false;
		}

		return isValid;
	}

	$scope.validateForm5 = function () {
		var isValid = true;

		$scope.form5RelationName.error = $scope.stringEmpty;
		$scope.form5RelationType.error = $scope.stringEmpty;

		if (!$scope.validateString($scope.form5RelationName.value)) {
			$scope.form5RelationName.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form5RelationName.label);
			isValid = false;
		}
		if (!$scope.validateString($scope.form5RelationType.value)) {
			$scope.form5RelationType.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form5RelationType.label);
			isValid = false;
		}
		if ($scope.form3CustomerGender.value == 'F' && $scope.form5RelationType.value == 'BWI') {
			$scope.form5RelationType.error = $scope.globalMessage.SubmissionErrorWrongRelationType;
			isValid = false;
		}
		if ($scope.form3CustomerGender.value == 'M' && $scope.form5RelationType.value == 'BHU') {
			$scope.form5RelationType.error = $scope.globalMessage.SubmissionErrorWrongRelationType;
			isValid = false;
		}

		return isValid;
	}

	$scope.validateSave = function () {
		var isValid = true;

		$scope.form3CustomerName.error = $scope.stringEmpty;
		$scope.form3CustomerGender.error = $scope.stringEmpty;
		$scope.form3CustomerPlaceOfBirth.error = $scope.stringEmpty;
		$scope.form3CustomerDateOfBirth.error = $scope.stringEmpty;
		$scope.form3CustomerBenefit.error = $scope.stringEmpty;
		$scope.form3CustomerPaymentMethod.error = $scope.stringEmpty;
		$scope.form3CustomerPremi.error = $scope.stringEmpty;
		$scope.form4IdCard.error = $scope.stringEmpty;
		$scope.form4IdCardAddress1.error = $scope.stringEmpty;
		$scope.form4IdCardAddress2.error = $scope.stringEmpty;
		$scope.form4IdCardRTRW.error = $scope.stringEmpty;
		$scope.form4IdCardProvince.error = $scope.stringEmpty;
		$scope.form4IdCardCity.error = $scope.stringEmpty;
		$scope.form4IdCardZip.error = $scope.stringEmpty;
		$scope.form4IdCardDistrict.error = $scope.stringEmpty;
		$scope.form4IdCardSubDistrict.error = $scope.stringEmpty;
		$scope.form4MailAddress1.error = $scope.stringEmpty;
		$scope.form4MailAddress2.error = $scope.stringEmpty;
		$scope.form4MailRTRW.error = $scope.stringEmpty;
		$scope.form4MailProvince.error = $scope.stringEmpty;
		$scope.form4MailCity.error = $scope.stringEmpty;
		$scope.form4MailZip.error = $scope.stringEmpty;
		$scope.form4MailDistrict.error = $scope.stringEmpty;
		$scope.form4MailSubDistrict.error = $scope.stringEmpty;
		$scope.form4HomePhoneAreaCode.error = $scope.stringEmpty;
		$scope.form4HomePhoneNumber.error = $scope.stringEmpty;
		$scope.form4MobileNumber.error = $scope.stringEmpty;
		$scope.form4Bank.error = $scope.stringEmpty;
		$scope.form4BankBranch.error = $scope.stringEmpty;
		$scope.form4BankAccountNumber.error = $scope.stringEmpty;
		$scope.form4Email.error = $scope.stringEmpty;
		$scope.form5RelationName.error = $scope.stringEmpty;
		$scope.form5RelationType.error = $scope.stringEmpty;
		
		if (!$scope.validateString($scope.form3CustomerName.value)) {
			$scope.form3CustomerName.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerName.label);
			isValid = false;
		}
		// if (!$scope.validateString($scope.form3CustomerDateOfBirth.value)) {
		// 	$scope.form3CustomerDateOfBirth.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form3CustomerDateOfBirth.label);
		// 	isValid = false;
		// }
		if (!$scope.validateString($scope.form4IdCard.value)) {
			$scope.form4IdCard.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4IdCard.label);
			isValid = false;
		}
		if ($scope.validateString($scope.form4HomePhoneAreaCode.value) &&
			$scope.form4HomePhoneAreaCode.value[0] != '0') {
			$scope.form4HomePhoneAreaCode.error = $scope.globalMessage.SubmissionErrorWrongPhoneAreaCodeFormat;
			isValid = false;
		}
		if (!$scope.validateString($scope.form4MobileNumber.value)) {
			$scope.form4MobileNumber.error = $scope.globalMessage.SubmissionErrorInputEmpty.format($scope.form4MobileNumber.label);
			isValid = false;
		}
		else if ($scope.form4MobileNumber.value[0] != '0') {
			$scope.form4MobileNumber.error = $scope.globalMessage.SubmissionErrorWrongMobilePhoneFormat;
			isValid = false;
		}

		return isValid;
	}

	$scope.validateSubmit = function () {
		var isValid = true;

		if (!$scope.validateForm2()) {
			isValid = false;
		}
		if (!$scope.validateForm3()) {
			isValid = false;
		}
		if (!$scope.validateForm4()) {
			isValid = false;
		}
		if (!$scope.validateForm5()) {
			isValid = false;
		}

		return isValid;
	}

	$scope.validateString = function (parm) {
		if (parm == undefined || parm == null || parm == $scope.stringEmpty)
			return false;
		else
			return true;
	}

	$scope.validateAge = function () {
		if ($scope.masterData != null &&
			$scope.masterData.planValidationList != null &&
			$scope.masterData.planValidationList.ftyGetPlanValidation != null) {
			var planValidation = $scope.masterData.planValidationList.ftyGetPlanValidation.filter(function (args) {
				return args.planCode == $scope.form3CustomerBenefit.value;// && args.paymentMode == $scope.form3CustomerPaymentMethod.value;
			})[0];
			var age = moment().diff(new Date($scope.form3CustomerDateOfBirth.value), 'years');

			if (planValidation &&
				planValidation.minAge <= age &&
				planValidation.maxAge >= age) {
				return true;
			}
			else {
				try {
					navigator.notification.alert(
						$scope.globalMessage.SubmissionErrorAge,
						function () {
							if (!$scope.$$phase) $scope.$apply();
						},
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.SubmissionErrorAge); }
				return false;
			}
		}
		return false;
	}

	$scope.generateBenefit = function () {
		$scope.form3CustomerBenefit.value = $scope.stringEmpty;
		$scope.form3CustomerBenefit.options = [];
		$scope.form3CustomerPeriod.value = $scope.stringEmpty;
		$scope.form3CustomerPeriod.options = [];
		if ($scope.masterData.availablePlanList != null &&
			$scope.masterData.availablePlanList.ftyGetAvailablePlan != null &&
			$scope.form3CustomerDateOfBirth.value != null) {
			$scope.masterData.availablePlanList.ftyGetAvailablePlan.forEach(function(value) {
				$scope.form3CustomerBenefit.options.push({ text: value.planDescription, value: value.planCode });
				$scope.form3CustomerPeriod.options.push({ text: value.planDuration, value: value.planCode });
			});
		}
	}

	$scope.generatePaymentMethod = function () {
		$scope.form3CustomerPaymentMethod.value = $scope.stringEmpty;
		$scope.form3CustomerPaymentMethod.options = [];
		if ($scope.masterData.paymentModeList != null &&
			$scope.masterData.paymentModeList.ftyGetPaymentMode != null) {
			$scope.masterData.paymentModeList.ftyGetPaymentMode.forEach(function(value) {
				$scope.form3CustomerPaymentMethod.options.push({ text: value.paymentModeDescription, value: value.paymentModeCode });
			});
		}

	}

	$scope.generatePremi = function (parm) {
		$scope.form3CustomerPremi.options = [];
		$scope.form3CustomerCompensation.value = $scope.stringEmpty;

		if ($scope.masterData != null &&
			$scope.masterData.planValidationList != null &&
			$scope.masterData.planValidationList.ftyGetPlanValidation != null) {
			var contribution = $scope.masterData.contributionList.ftyGetContribution.filter(function (args) {
				return args.planCode == $scope.form3CustomerBenefit.value && args.paymentMode == $scope.form3CustomerPaymentMethod.value;
			})[0];
			if (contribution) {
				var isValueExist = false;
				for (var i = contribution.minContribution; i <= contribution.maxContribution; i += contribution.multiplication) {
					$scope.form3CustomerPremi.options.push({ text: i.toLocaleString(), value: i });
					if (parm == i)
						isValueExist = true;
				}
				if(isValueExist)
					$scope.form3CustomerPremi.value = parm;
				// else
				// 	$scope.form3CustomerPremi.value = contribution.minContribution;
				$scope.form3CustomerCompensation.value = ($scope.form3CustomerPremi.value * contribution.benefitValidation).toLocaleString();
			}
		}
	}

	$scope.generateIdCardCity = function () {
		$scope.form4IdCardCity.value = $scope.stringEmpty;
		$scope.form4IdCardCity.options = [];

		if ($scope.masterData != null &&
			$scope.masterData.cityList != null &&
			$scope.masterData.cityList.ftyGetCity != null) {
			$scope.masterData.cityList.ftyGetCity.forEach(function(value) {
				if (value.provinceCode == $scope.form4IdCardProvince.value) {
					$scope.form4IdCardCity.options.push({ text: value.cityDescription, value: value.cityCode });
				}
			});
		}
	}

	$scope.generateMailCity = function () {
		$scope.form4MailCity.value = $scope.stringEmpty;
		$scope.form4MailCity.options = [];

		if ($scope.masterData != null &&
			$scope.masterData.cityList != null &&
			$scope.masterData.cityList.ftyGetCity != null) {
			$scope.masterData.cityList.ftyGetCity.forEach(function(value) {
				if (value.provinceCode == $scope.form4MailProvince.value) {
					$scope.form4MailCity.options.push({ text: value.cityDescription, value: value.cityCode });
				}
			});
		}
	}

	$scope.form3CustomerDateOfBirth_OnChange = function() {
		if(!$scope.isOnLoad) {
			$scope.form3CustomerBenefit.value = $scope.stringEmpty;
			$scope.form3CustomerBenefit.options = [];
			$scope.form3CustomerPaymentMethod.value = $scope.stringEmpty;
			$scope.form3CustomerPaymentMethod.options = [];
			$scope.form3CustomerPremi.value = $scope.stringEmpty;
			$scope.form3CustomerPremi.options = [];
			$scope.form3CustomerPeriod.value = $scope.stringEmpty;
			$scope.form3CustomerPeriod.options = [];
			$scope.form3CustomerCompensation.value = $scope.stringEmpty;

			if (new Date($scope.form3CustomerDateOfBirth.value).getFullYear() > 1900) {
				$scope.generateBenefit();
				//$scope.generatePaymentMethod();
			}
		}
	}

	$scope.form3CustomerBenefit_OnChange = function () {
		if(!$scope.isOnLoad) {
			$scope.generatePaymentMethod();
			
			$timeout( function() {
				if ($scope.masterData != null &&
					$scope.masterData.availablePlanList != null &&
					$scope.masterData.availablePlanList.ftyGetAvailablePlan != null) {
					var availablePlan = $scope.masterData.availablePlanList.ftyGetAvailablePlan.filter(function (args) {
						return args.planCode == $scope.form3CustomerBenefit.value;
					})[0];
					if (availablePlan)
						$scope.productName = availablePlan.planDescription;
				}

				$scope.form3CustomerPaymentMethod.value = $scope.stringEmpty;
				$scope.form3CustomerPaymentMethod.options = [];

				if ($scope.form3CustomerDateOfBirth.value != null) {
					if ($scope.validateAge()) {
						$scope.generatePaymentMethod();
					}
					else {
						$scope.form3CustomerBenefit.value = $scope.stringEmpty;
					}
				}
				else {
					$scope.form3CustomerBenefit.value = $scope.stringEmpty;
					$scope.form3CustomerBenefit.options = [];
				}
				if (!$scope.$$phase) $scope.$apply();
			}, $scope.timeoutOpenPage );
		}
	}

	$scope.form3CustomerPaymentMethod_OnChange = function (parm) {
		if(!$scope.isOnLoad) {
			$timeout( function() {
				$scope.form3CustomerPremi.options = [];
				$scope.form3CustomerCompensation.value = $scope.stringEmpty;

				if ($scope.form3CustomerBenefit.value != $scope.stringEmpty) {
					if ($scope.validateAge()) {
						$scope.generatePremi();
					}
					else {
						$scope.form3CustomerPaymentMethod.value = $scope.stringEmpty;
					}
				}
			}, $scope.timeoutOpenPage );
		}
	}

	$scope.form3CustomerPremi_OnChange = function() {
		if(!$scope.isOnLoad) {
			$timeout( function(){
				$scope.form3CustomerCompensation.value = $scope.stringEmpty;

				var contribution = $scope.masterData.contributionList.ftyGetContribution.filter(function (args) {
					return args.planCode == $scope.form3CustomerBenefit.value && args.paymentMode == $scope.form3CustomerPaymentMethod.value;
				})[0];
				if (contribution) {
					$scope.form3CustomerCompensation.value = ($scope.form3CustomerPremi.value * contribution.benefitValidation).toLocaleString();
				}
			}, $scope.timeoutOpenPage );
		}
	}

	$scope.form3CustomerPremi_OnClick = function () {
		if ($scope.form3CustomerBenefit.value == $scope.stringEmpty ||
			$scope.form3CustomerPaymentMethod == $scope.stringEmpty) {
			$scope.form3CustomerPremi.error = $scope.globalMessage.SubmissionErrorBenefitPaymentMethodEmpty;
		}
	}

	$scope.form4IdCardProvince_OnChange = function () {
		if(!$scope.isOnLoad) {
			$timeout( function() {
				$scope.generateIdCardCity();
			}, $scope.timeoutOpenPage );
		}
	}

	$scope.form4MailProvince_OnChange = function () {
		if(!$scope.isOnLoad) {
			$timeout( function() {
				$scope.generateMailCity();
			}, $scope.timeoutOpenPage );
		}
	}
});
