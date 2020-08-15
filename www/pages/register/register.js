rootApp
.directive('registerPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/register/register.html'
	};
})
.controller('registerPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;
	
	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.RegisterPageTitle,
        left : '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function() { $scope.onBack(); }
	};
	$scope.isRegisterDisabled = true;
	$scope.idCard = { label: $scope.globalMessage.RegisterLabelIdCard, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.sellerCode = { label: $scope.globalMessage.RegisterLabelSellerCode, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.dateOfBirth = { label: $scope.globalMessage.RegisterLabelDateOfBirth, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.email = { label: $scope.globalMessage.RegisterLabelEmail, value: $scope.stringEmpty, error: $scope.stringEmpty }
	$scope.password = { label: $scope.globalMessage.RegisterLabelPassword, value: $scope.stringEmpty, error: $scope.stringEmpty,
		tooltip: $scope.globalMessage.RegisterTooltipPassword,
		tooltipOptions: [
			$scope.globalMessage.RegisterTooltipPassword1,
			$scope.globalMessage.RegisterTooltipPassword2
		]
	}
	$scope.confirmPassword = { label: $scope.globalMessage.RegisterLabelConfirmPassword, value: $scope.stringEmpty, error: $scope.stringEmpty }

	$scope.$on('showRegisterPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.isRegisterDisabled = true;
			$scope.pageContentIndex = -1;
			$scope.pageContent = [];
			$scope.contentState = $scope.stringEmpty;

			$scope.isNewRegister = false;

			$scope.nextLabel = $scope.globalMessage.RegisterNextButtonLabel;

			$scope.NewRegisterPage = "NewRegister";
			$scope.IdCardPage = "IdCard";
			$scope.TaxIdCardPage = "TaxIdCard";
			$scope.SavingBookPage = "SavingBook";
			$scope.CaptchaPage = "Captcha";
			$scope.NewRegisterSubmit = "SubmitRegister";

			$scope.uploadDocList = [];

			$scope.imgTitleIdCard = $scope.globalMessage.RegisterIdCardImageTitleLabel;
			$scope.imgTitleTaxIdCard = $scope.globalMessage.RegisterTaxIdImageTitleLabel;
			$scope.imgTitleSavingBook = $scope.globalMessage.RegisterSavingBookImageTitleLabel;
			$scope.imgTitleCaptcha = $scope.globalMessage.RegisterCaptchaImageTitleLabel;

			$scope.fobIdCardIcon = 'fa-camera';
			$scope.popupValue = false;

			$scope.model = {
				formNewRegisterAgentName: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentNameLabel,
					type: 'text',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterAgentPosition: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentPositionLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
					isDisabled: true
				},
				formNewRegisterAgentSupervisor: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentSupervisorLabel,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
				},
				//TODO: tambah Webservice di Register Submit
				formNewRegisterAgenCode: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentSupervisorLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterAgenName: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterRecruiterNameLabel,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
					isDisabled: true
				},
				formNewRegisterProvince: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentProvinceLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterCity: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAgentCityLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterIdCardSeparator: {
					type: 'separator',
					label: $scope.globalMessage.RegisterIdCardTitleLabel,
				},
				formNewRegisterIdCardNumber: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterIdCardNumberLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterAddressRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAddressLabel,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterDistrictSubDistrictRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterDistrictSubDistrictLabel,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterCityRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterCityLabel,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterPostalCodeRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterPostalCodeLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 6,
				},
				formNewRegisterDobRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterDobLabel,
					type: 'date',
					error: $scope.stringEmpty,
					options: []
				},
				formNewRegisterBirthPlaceRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterBirthPlaceLabel,
					type: 'text',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterMaritalStatusRefToIdCard: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterMaritalStatusLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterSavingBookSeparator: {
					type: 'separator',
					label: $scope.globalMessage.RegisterSavingBookTitleLabel,
				},
				formNewRegisterBankNameRefToSavingBook: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterBankNameRefToSavingBookLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
					isDisabled: true
				},
				formNewRegisterAccountBankOwnerNameRefToSavingBook: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAccountBankOwnerNameRefToSavingBookLabel,
					type: 'text',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
					isDisabled: true
				},
				formNewRegisterAccountBankNumberRefToSavingBook: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterAccountBankNumberRefToSavingBookLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
				},
				formNewRegisterTaxIdNumberSeparator: {
					type: 'separator',
					label: $scope.globalMessage.RegisterTaxIdTitleLabel,
				},
				formNewRegisterTaxIdNumberRefToTaxId: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterTaxIdNumberRefToTaxIdLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
					tooltip: $scope.globalMessage.RegisterTaxIdNumberTooltipLabel
				},
				formNewRegisterTaxIdStatusRefToTaxId: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterTaxIdStatusRefToTaxIdLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
					isDisabled: true
				},
				formNewRegisterTaxPayerStatusRefToTaxId: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterTaxPayerStatusRefToTaxIdLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
					isDisabled: true
				},
				formNewRegisterDependentNumberRefToTaxId: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterDependentNumberRefToTaxIdLabel,
					type: 'tel',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25,
					isDisabled: true
				},
				formNewRegisterMobilePhoneNumber: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterMobilePhoneNumberLabel,
					type: 'mobile',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 20
				},
				formNewRegisterEmailAddress: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterEmailAddressLabel,
					type: 'email',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 25
				},
				formNewRegisterFormalEducation: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterFormalEducationLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterOccupation: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterOccupationLabel,
					type: 'select',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterPassword: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterPasswordLabel,
					type: 'password',
					error: $scope.stringEmpty,
					options: [],
				},
				formNewRegisterConfirmPassword: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterConfirmPasswordLabel,
					type: 'password',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 15
				},
				formNewRegisterCaptcha: {
					value: $scope.stringEmpty,
					label: $scope.globalMessage.RegisterCaptcha,
					type: 'address',
					error: $scope.stringEmpty,
					options: [],
					maxlength: 10,
				},
				idCard: {
					imgFile64: undefined,
					imgFile: undefined
				},
				taxIdCard: {
					imgFile64: undefined,
					imgFile: undefined
				},
				savingBook: {
					imgFile64: undefined,
					imgFile: undefined
				},
				captcha: undefined
			};

			$scope.masterData = undefined;

			$scope.contentNewRegister = $scope.stringEmpty;
			$scope.contentIdCardClass = $scope.stringEmpty;
			$scope.contentTaxIdCardClass = $scope.stringEmpty;
			$scope.contentSavingBookClass = $scope.stringEmpty;
			$scope.contentCaptchaClass = $scope.stringEmpty;

			$scope.idCard.value = $scope.stringEmpty;
			$scope.sellerCode.value = $scope.stringEmpty;
			$scope.dateOfBirth.value = $scope.stringEmpty;
			$scope.email.value = $scope.stringEmpty;
			$scope.password.value = $scope.stringEmpty;
			$scope.confirmPassword.value = $scope.stringEmpty;

			$scope.idCard.error = $scope.stringEmpty;
			$scope.sellerCode.error = $scope.stringEmpty;
			$scope.dateOfBirth.error = $scope.stringEmpty;
			$scope.email.error = $scope.stringEmpty;
			$scope.password.error = $scope.stringEmpty;
			$scope.confirmPassword.error = $scope.stringEmpty;

			$scope.minYear = new Date().getFullYear() - 56;
			$scope.maxYear = new Date().getFullYear() - 18;

			try{
				navigator.notification.confirm (
					$scope.globalMessage.RegisterPopUpAgentCode,
					function (parm){
						if(parm == 1){
							$scope.isNewRegister = false;
						} else if(parm == 2) {
							$scope.isNewRegister = true;
							//push page content
							$scope.pageContent = [
								$scope.NewRegisterPage,
								$scope.IdCardPage,
								$scope.TaxIdCardPage,
								$scope.SavingBookPage,
								$scope.CaptchaPage,
								$scope.NewRegisterSubmit
							];

							$scope.nextClick();
						}
					},
					$scope.globalMessage.RegisterPopUpTitle,
					[$scope.globalMessage.RegisterPopUpButtonYes, $scope.globalMessage.RegisterPopUpButtonNo]
				);
			} catch (err){
				if (confirm($scope.globalMessage.RegisterPopUpAgentCode)) {
					$scope.isNewRegister = false;
				} else {
					$scope.isNewRegister = true;
					$scope.pageContent = [
						$scope.NewRegisterPage,
						$scope.IdCardPage,
						$scope.TaxIdCardPage,
						$scope.SavingBookPage,
						$scope.CaptchaPage,
						$scope.NewRegisterSubmit
					];
					$scope.nextClick();
				}
			}

			$scope.loadMasterData();
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if($scope.pageIndex == args.pageIndex) {
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

	$scope.onBack = function(){
		try {
			navigator.notification.confirm (
				$scope.globalMessage.RegisterPopUpCloseForm,
				function(parm){
					if(parm == 1){
						$scope.onClose();
					}
				},
				$scope.globalMessage.RegisterPopUpCloseFormTitle,
				[$scope.globalMessage.RegisterPopUpButtonYes, $scope.globalMessage.RegisterPopUpButtonNo]
			)
		} catch (err) {
			$scope.onClose();
		}
	}

	$scope.sellerCode_OnBlur = function () {
		$scope.sellerCode.error = $scope.stringEmpty;
		if ($scope.sellerCode.value != $scope.stringEmpty && $scope.sellerCode.value[0] != '7') {
			$scope.sellerCode.error = $scope.globalMessage.RegisterErrorSellerCodeFormat;
		}
	}

	$scope.email_OnBlur = function () {
		$scope.email.error = $scope.stringEmpty;
		if ($scope.email.value != $scope.stringEmpty && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.email.value)) {
			$scope.email.error = $scope.globalMessage.RegisterErrorEmailFormat;
		}
	}

	$scope.onChange = function () {
		if ($scope.idCard.value == $scope.stringEmpty ||
			$scope.sellerCode.value == $scope.stringEmpty ||
			$scope.dateOfBirth.value == $scope.stringEmpty ||
			$scope.email.value == $scope.stringEmpty ||
			$scope.password.value == $scope.stringEmpty ||
			$scope.confirmPassword.value == $scope.stringEmpty) {
			$scope.isRegisterDisabled = true;
		}
		else {
			$scope.isRegisterDisabled = false;
		}
	}

	$scope.registerClick = function() {
		var IsValid = true;
		$scope.dateOfBirth.error = $scope.stringEmpty;
		$scope.email.error = $scope.stringEmpty;
		$scope.password.error = $scope.stringEmpty;
		$scope.confirmPassword.error = $scope.stringEmpty;
		$scope.sellerCode.error = $scope.stringEmpty;

		if (!/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.email.value)) {
			IsValid = false;
			$scope.email.error = $scope.globalMessage.RegisterErrorEmailFormat;
		}
		
		if ($scope.password.value.length < 8 || $scope.password.value.length > 15) {
			IsValid = false;
			$scope.password.error = $scope.globalMessage.RegisterErrorPasswordLength;
		}
		else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test($scope.password.value)) {
			IsValid = false;
			$scope.password.error = $scope.globalMessage.RegisterErrorPasswordCriteria;
		}

		if($scope.password.value != $scope.confirmPassword.value) {
			IsValid = false;
			$scope.confirmPassword.error = $scope.globalMessage.RegisterErrorConfirmPasswordDifferent;
		}
		if ($scope.sellerCode.value != $scope.stringEmpty && $scope.sellerCode.value[0] != '7') {
			IsValid = false;
			$scope.sellerCode.error = $scope.globalMessage.RegisterErrorSellerCodeFormat;
		}
			

		if (IsValid) {
			$scope.globalShowLoading();
			var promise = API.Register(
				$scope.idCard.value,
				$scope.sellerCode.value,
				$scope.dateOfBirth.value,
				$scope.email.value,
				$scope.password.value);
			promise.then(function (value) {
				$scope.globalHideLoading();
				if (value.Status) {
					try {
						navigator.notification.alert(
							$scope.globalMessage.RegisterPopUpSuccess,
							function () {
								$scope.onClose();
								if (!$scope.$$phase) $scope.$apply();
							},
							$scope.globalMessage.PopUpTitle,
							$scope.globalMessage.PopUpButtonOK
						);
					}
					catch (err) {
						alert($scope.globalMessage.RegisterPopUpSuccess);
						$scope.onClose();
						if (!$scope.$$phase) $scope.$apply();
					}
				}
				else {
					var ErrorMessage = $scope.stringEmpty;
					if (value.ErrorCode == 1) {
						ErrorMessage = $scope.globalMessage.RegisterErrorFailed;
					}
					else if (value.ErrorCode == 2) {
						ErrorMessage = $scope.globalMessage.RegisterErrorEmailExist;
					}
					else if (value.ErrorCode == 3) {
						ErrorMessage = $scope.globalMessage.RegisterErrorUnregisteredUser;
					}
					else if (value.ErrorCode == 4) {
						$scope.dateOfBirth.error = $scope.globalMessage.RegisterErrorDateOfBirthFuture;
					}
					else if (value.ErrorCode == 5) {
						ErrorMessage = $scope.globalMessage.RegisterErrorUserNotAuthorized;
					}
					else if (value.ErrorCode == 6) {
						ErrorMessage = $scope.globalMessage.RegisterErrorCore;
					}
					else if (value.ErrorCode == 7) {
						ErrorMessage = $scope.globalMessage.RegisterErrorPasswordCriteria;
					}
					if (ErrorMessage != $scope.stringEmpty) {
						try {
							navigator.notification.alert(
								ErrorMessage,
								function () { },
								$scope.stringEmpty,
								$scope.globalMessage.PopUpButtonClose
							);
						}
						catch (err) { alert(ErrorMessage); }
					}
				}
			}, function (error) {
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

	$scope.validateDataAMS = function(){
		var promise = API.RegisterValidateData(
			$scope.model.formNewRegisterEmailAddress.value,
			$scope.model.formNewRegisterMobilePhoneNumber.value,
			$scope.model.formNewRegisterIdCardNumber.value
		);
		promise.then(
			function(args){
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
					if(args.errorCode > 0){
						try {
							navigator.notification.alert(
								$scope.globalMessage.PosDetailSaveCoreErrorFailed,
								function () { },
								$scope.stringEmpty,
								$scope.globalMessage.PopUpButtonClose
							);
						}
						catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
						$scope.pageContentIndex--;
					} else {
						if(args.value.isIdCardExist == false){
							try {
								navigator.notification.alert(
									$scope.globalMessage.RegisterIdCardExistErrorLabel,
									function () { },
									$scope.stringEmpty,
									$scope.globalMessage.PopUpButtonClose
								);
							}
							catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
							$scope.pageContentIndex--;
						} else {
							if(args.value.isEmailExist == false){
								try {
									navigator.notification.alert(
										$scope.globalMessage.RegisterEmailExistErrorLabel,
										function () { },
										$scope.stringEmpty,
										$scope.globalMessage.PopUpButtonClose
									);
								}
								catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
								$scope.pageContentIndex--;
							} else {
								if(args.value.isMobileExist == false){
									try {
										navigator.notification.alert(
											$scope.globalMessage.RegisterMobileExistErrorLabel,
											function () { },
											$scope.stringEmpty,
											$scope.globalMessage.PopUpButtonClose
										);
									}
									catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
									$scope.pageContentIndex--;
								} else {
									if($scope.model.formNewRegisterPassword.value != $scope.model.formNewRegisterConfirmPassword.value){
										try {
											navigator.notification.alert(
												$scope.globalMessage.RegisterPasswordConfirmationValidationErrorLabel,
												function () { },
												$scope.stringEmpty,
												$scope.globalMessage.PopUpButtonClose
											);
										}
										catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
										$scope.pageContentIndex--;
									} else {
										$scope.model.captcha = args.value.captcha;
										$scope.displayContentPage();
									}
								}
							}
						}
					}
					$scope.globalHideLoading();
				}
			},
			function(error){
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationErrorConnectionFailed,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
				$scope.pageContentIndex--;
				$scope.globalHideLoading();
			}
		);
	}

	$scope.saveRegistration = function(){
		var dob = $scope.model.formNewRegisterDobRefToIdCard.value;
		dob = new Date(dob.setUTCHours(0,0,0,0));
		$scope.globalShowLoading();
		var promise = API.RegisterSubmitData(
			$scope.model.formNewRegisterCaptcha.value,
			$scope.model.formNewRegisterAgentName.value,
			$scope.model.formNewRegisterAgentPosition.value,
			$scope.model.formNewRegisterAgentSupervisor.value,
			$scope.model.formNewRegisterProvince.value,
			$scope.model.formNewRegisterCity.value,
			$scope.model.formNewRegisterIdCardNumber.value,
			$scope.model.formNewRegisterAddressRefToIdCard.value,
			$scope.model.formNewRegisterDistrictSubDistrictRefToIdCard.value,
			$scope.model.formNewRegisterCityRefToIdCard.value,
			$scope.model.formNewRegisterPostalCodeRefToIdCard.value,
			dob,
			$scope.model.formNewRegisterBirthPlaceRefToIdCard.value,
			$scope.model.formNewRegisterMaritalStatusRefToIdCard.value,
			$scope.model.formNewRegisterAccountBankNumberRefToSavingBook.value,
			$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.value,
			$scope.model.formNewRegisterTaxIdNumberRefToTaxId.value,
			$scope.model.formNewRegisterTaxIdStatusRefToTaxId.value,
			$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.value,
			$scope.model.formNewRegisterDependentNumberRefToTaxId.value,
			$scope.model.formNewRegisterMobilePhoneNumber.value,
			$scope.model.formNewRegisterEmailAddress.value,
			$scope.model.formNewRegisterFormalEducation.value,
			$scope.model.formNewRegisterBankNameRefToSavingBook.value,
			$scope.model.formNewRegisterOccupation.value,
			$scope.uploadDocList,
			$scope.model.formNewRegisterPassword.value,
			$scope.model.formNewRegisterAgenCode.value
		);
		promise.then(
			function(args){
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
				} else {
					if(args.errorCode > 0){
						var errorMessage = "";
						if (args.errorCode == 3) {
							errorMessage = $scope.globalMessage.RegisterWrongCaptchaErrorLabel;
						} else if (args.errorCode == 4) {
							errorMessage = $scope.globalMessage.RegisterExpiredCaptchaErrorLabel;
						} else {
							errorMessage = $scope.globalMessage.RegisterErrorFailed;
						}
						try {
							navigator.notification.alert(
								errorMessage,
								function () { },
								$scope.stringEmpty,
								$scope.globalMessage.PopUpButtonClose
							);
						}
						catch (err) { alert (errorMessage); }
						if (args.value.captcha && args.value.captcha != '') {
							$scope.model.captcha = args.value.captcha;
						}
						$scope.pageContentIndex--;
						$scope.globalHideLoading();
					} else {
						if(args.value.isAmsDataValid == false){
							try {
								navigator.notification.alert(
									$scope.globalMessage.RegisterDataAMSInvalidLabel,
									function () { },
									$scope.stringEmpty,
									$scope.globalMessage.PopUpButtonClose
								);
							}
							catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
							$scope.pageContentIndex--;
							$scope.globalHideLoading();
						} else {
							if(args.value.isSuccess == false){
								try {
									navigator.notification.alert(
										$scope.globalMessage.PosDetailSaveCoreErrorFailed,
										function () { },
										$scope.stringEmpty,
										$scope.globalMessage.PopUpButtonClose
									);
								}
								catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
								$scope.pageContentIndex--;
								$scope.globalHideLoading();
							} else {
								try {
									navigator.notification.alert(
										$scope.globalMessage.RegisterSaveSuccessLabel,
										function () { $scope.onClose() },
										$scope.stringEmpty,
										$scope.globalMessage.PopUpButtonClose
									);
									$scope.globalHideLoading();
								}
								catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
								$scope.pageContentIndex--;
								$scope.globalHideLoading();
							}
						}
					}
				}
			},
			function(error){
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationErrorConnectionFailed,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
				$scope.pageContentIndex--;
				$scope.globalHideLoading();
			}
		);
	}

	$scope.checkNextButton = function(){
		if($scope.contentState == $scope.SavingBookPage){
			$scope.nextLabel = $scope.globalMessage.RegisterSaveButtonLabel;
		} else {
			$scope.nextLabel = $scope.globalMessage.RegisterNextButtonLabel;
		}
	}

	$scope.nextClick = function(){
		$scope.checkNextButton();
		$scope.pageContentIndex++;
		$scope.isWebserviceCall = false;
		if($scope.contentState == $scope.NewRegisterPage) {
			if(!$scope.validateFormNewRegistration()){
				$scope.pageContentIndex--;
			} else {
				$scope.isWebserviceCall = true;
				$scope.globalShowLoading();
				$scope.validateDataAMS();
			}
		}

		if($scope.isWebserviceCall == false){
			$scope.displayContentPage();
		}
	}

	$scope.displayContentPage = function(){
		if($scope.pageContent[$scope.pageContentIndex] == $scope.NewRegisterPage) {
			$scope.contentNewRegister = 'active';
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.IdCardPage) {
			$scope.contentIdCardClass = 'active';
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.TaxIdCardPage) {
			$scope.contentTaxIdCardClass = 'active';
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.SavingBookPage) {
			$scope.contentSavingBookClass = 'active';
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.CaptchaPage) {
			$scope.contentCaptchaClass = 'active';
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.NewRegisterSubmit) {
			try {
				navigator.notification.confirm(
					$scope.globalMessage.RegisterPopUpSubmitForm,
					function(parm){
						if(parm == 1){
							$scope.saveRegistration();
						} else {
							$scope.pageContentIndex--;
						}
					},
					$scope.globalMessage.PopUpTitle,
					[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
				)
			} catch (err) {
				console.log(err.toString());
				$scope.pageContentIndex--;
			}
			
		}
		if($scope.contentState != $scope.CaptchaPage){
			$scope.contentState = $scope.pageContent[$scope.pageContentIndex];
		}
		

		$timeout(function(){
			$('.register-page-content:nth-child(' + $scope.pageContentIndex + 2 + ')').scrollTop(0);
		}, $scope.timeoutOpenPage);
	}

	$scope.prevClick = function() {
		$scope.checkNextButton();
		if($scope.pageContent[$scope.pageContentIndex] == $scope.NewRegisterPage) {
			$scope.contentNewRegister = $scope.stringEmpty;
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.IdCardPage) {
			$scope.contentIdCardClass = $scope.stringEmpty;
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.TaxIdCardPage) {
			$scope.contentTaxIdCardClass = $scope.stringEmpty;
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.SavingBookPage) {
			$scope.contentSavingBookClass = $scope.stringEmpty;
		} else if($scope.pageContent[$scope.pageContentIndex] == $scope.CaptchaPage) {
			$scope.contentCaptchaClass = $scope.stringEmpty;
		}

		if($scope.pageContentIndex > -1) {
			$scope.pageContentIndex--;
		}

		if($scope.pageContentIndex == -1){
            $scope.contentState = $scope.stringEmpty;
        } else {
            $scope.contentState = $scope.pageContent[$scope.pageContentIndex];
		}
		
		$timeout(function(){
			$('.register-page-content:nth-child(' + $scope.pageContentIndex + 2 + ')').scrollTop(0);
        }, $scope.timeoutOpenPage);
	}

	$scope.loadMasterData = function() {
		$scope.model.formNewRegisterAgentPosition.options = [];
		$scope.model.formNewRegisterAgentSupervisor.options = [];
		$scope.model.formNewRegisterProvince.options = [];
		$scope.model.formNewRegisterCity.options = [];
		$scope.model.formNewRegisterMaritalStatusRefToIdCard.options = [];
		$scope.model.formNewRegisterBankNameRefToSavingBook.options = [];
		$scope.model.formNewRegisterTaxIdStatusRefToTaxId.options = [];
		$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.options = [];
		$scope.model.formNewRegisterFormalEducation.options = [];
		$scope.model.formNewRegisterOccupation.options = [];

		var promise = API.RegisterGetMasterData();
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
					$scope.masterData = args.value;
					if($scope.masterData != null){
						if($scope.masterData.agentPositionList != null){
							$scope.masterData.agentPositionList.forEach(function(value){
								$scope.model.formNewRegisterAgentPosition.options.push({text: value.text, value: value.code});
							});
							$scope.model.formNewRegisterAgentPosition.value = "3";
						}

						if($scope.masterData.agentSupervisorList != null){
							$scope.masterData.agentSupervisorList.forEach(function(value){
								$scope.model.formNewRegisterAgentSupervisor.options.push({text: value.name, value: value.idCard});
							});
						}

						if($scope.masterData.provinceList != null){
							$scope.masterData.provinceList.forEach(function(value){
								$scope.model.formNewRegisterProvince.options.push({text: value.name, value: value.code});
							});
							$scope.model.formNewRegisterProvince.options = $scope.model.formNewRegisterProvince.options
								.sort((a, b) => a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1);
						}

						if($scope.masterData.maritalStatusList != null){
							$scope.masterData.maritalStatusList.forEach(function(value){
								$scope.model.formNewRegisterMaritalStatusRefToIdCard.options.push({text: value.text, value: value.code});
							});
						}

						if($scope.masterData.bankList != null){
							$scope.masterData.bankList.forEach(function(value){
								$scope.model.formNewRegisterBankNameRefToSavingBook.options.push({text: value.text, value: value.code});
							});
						}

						if($scope.masterData.taxIdStatusList != null){
							$scope.masterData.taxIdStatusList.forEach(function(value){
								$scope.model.formNewRegisterTaxIdStatusRefToTaxId.options.push({text: value.text, value: value.code});
							});
						}

						if($scope.masterData.taxPayerStatusList != null){
							$scope.masterData.taxPayerStatusList.forEach(function(value){
								$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.options.push({text: value.text, value: value.code});
							});
						}

						if($scope.masterData.formalEducationList != null){
							$scope.masterData.formalEducationList.forEach(function(value){
								$scope.model.formNewRegisterFormalEducation.options.push({text: value.text, value: value.code});
							});
						}

						if($scope.masterData.occupationList != null){
							$scope.masterData.occupationList.forEach(function(value){
								$scope.model.formNewRegisterOccupation.options.push({text: value.text, value: value.code});
							});
						}
					}
					$scope.globalHideLoading();
				}
			},
			function(error) {
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

	$scope.validateFormNewRegistration = function(){
		var isValid = true;

		$scope.model.formNewRegisterAgentName.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAgentPosition.error = $scope.stringEmpty;
		$scope.model.formNewRegisterProvince.error = $scope.stringEmpty;
		$scope.model.formNewRegisterCity.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAgentSupervisor.error = $scope.stringEmpty;
		$scope.model.formNewRegisterIdCardNumber.error = $scope.stringEmpty;
		$scope.model.formNewRegisterBirthPlaceRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterDobRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAddressRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterDistrictSubDistrictRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterCityRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterPostalCodeRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterMaritalStatusRefToIdCard.error = $scope.stringEmpty;
		$scope.model.formNewRegisterOccupation.error = $scope.stringEmpty;
		$scope.model.formNewRegisterFormalEducation.error = $scope.stringEmpty;
		$scope.model.formNewRegisterBankNameRefToSavingBook.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAccountBankNumberRefToSavingBook.error = $scope.stringEmpty;
		$scope.model.formNewRegisterTaxIdNumberRefToTaxId.error = $scope.stringEmpty;
		$scope.model.formNewRegisterTaxIdStatusRefToTaxId.error = $scope.stringEmpty;
		$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.error = $scope.stringEmpty;
		$scope.model.formNewRegisterDependentNumberRefToTaxId.error = $scope.stringEmpty;
		$scope.model.formNewRegisterMobilePhoneNumber.error = $scope.stringEmpty;
		$scope.model.formNewRegisterEmailAddress.error = $scope.stringEmpty;
		$scope.model.formNewRegisterPassword.error = $scope.stringEmpty;
		$scope.model.formNewRegisterConfirmPassword.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAgenCode.error = $scope.stringEmpty;
		$scope.model.formNewRegisterAgenName.error = $scope.stringEmpty;
		
		if(!$scope.validateString($scope.model.formNewRegisterAgenCode.value)){
            $scope.model.formNewRegisterAgenCode.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAgenCode.label);
            isValid = false;
		} else {
			if($scope.model.formNewRegisterAgenName.value == null
			|| $scope.model.formNewRegisterAgenName.value == ""){
				$scope.model.formNewRegisterAgenCode.error = $scope.globalMessage.RegisterAgenCodeErrorLabel;
				isValid = false;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterAgentName.value)){
            $scope.model.formNewRegisterAgentName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAgentName.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterAgentPosition.value)){
            $scope.model.formNewRegisterAgentPosition.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAgentPosition.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterProvince.value)){
            $scope.model.formNewRegisterProvince.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterProvince.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterCity.value)){
            $scope.model.formNewRegisterCity.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterCity.label);
            isValid = false;
		}
		// if(!$scope.validateString($scope.model.formNewRegisterAgentSupervisor.value)){
        //     $scope.model.formNewRegisterAgentSupervisor.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAgentSupervisor.label);
        //     isValid = false;
		// }
		if(!$scope.validateString($scope.model.formNewRegisterIdCardNumber.value)){
            $scope.model.formNewRegisterIdCardNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterIdCardNumber.label);
            isValid = false;
		} else {
			if($scope.model.formNewRegisterIdCardNumber.value.length < 10){
				$scope.model.formNewRegisterIdCardNumber.error = $scope.globalMessage.RegisterIdCardMinLengthErrorLabel;
				isValid = false;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterBirthPlaceRefToIdCard.value)){
            $scope.model.formNewRegisterBirthPlaceRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterBirthPlaceRefToIdCard.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterDobRefToIdCard.value)){
            $scope.model.formNewRegisterDobRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterDobRefToIdCard.label);
            isValid = false;
		} else {
			var currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
			var inputDate = new Date($scope.model.formNewRegisterDobRefToIdCard.value.getFullYear(), $scope.model.formNewRegisterDobRefToIdCard.value.getMonth(), $scope.model.formNewRegisterDobRefToIdCard.value.getDate());
			console.log(currentDate - inputDate);
			if(currentDate - inputDate > 1764549000000){
				$scope.model.formNewRegisterDobRefToIdCard.error = $scope.globalMessage.RegisterDobValidationErrorLabel;
				isValid = false;
			}
			if(currentDate - inputDate < 567993600000){
				$scope.model.formNewRegisterDobRefToIdCard.error = $scope.globalMessage.RegisterDobValidationMinErrorLabel;
				isValid = false;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterAddressRefToIdCard.value)){
            $scope.model.formNewRegisterAddressRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAddressRefToIdCard.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterDistrictSubDistrictRefToIdCard.value)){
            $scope.model.formNewRegisterDistrictSubDistrictRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterDistrictSubDistrictRefToIdCard.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterCityRefToIdCard.value)){
            $scope.model.formNewRegisterCityRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterCityRefToIdCard.label);
            isValid = false;
		}
		if($scope.validateString($scope.model.formNewRegisterPostalCodeRefToIdCard.value)){
			if($scope.model.formNewRegisterPostalCodeRefToIdCard.value.length < 5){
				$scope.model.formNewRegisterPostalCodeRefToIdCard.error = $scope.globalMessage.RegisterPostalCodeMinLengthErrorLabel;
				isValid = false;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterMaritalStatusRefToIdCard.value)){
            $scope.model.formNewRegisterMaritalStatusRefToIdCard.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterMaritalStatusRefToIdCard.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterOccupation.value)){
            $scope.model.formNewRegisterOccupation.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterOccupation.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterFormalEducation.value)){
            $scope.model.formNewRegisterFormalEducation.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterFormalEducation.label);
            isValid = false;
		}
		if($scope.validateString($scope.model.formNewRegisterAccountBankNumberRefToSavingBook.value)){
            if(!$scope.validateString($scope.model.formNewRegisterBankNameRefToSavingBook.value)){
				$scope.model.formNewRegisterBankNameRefToSavingBook.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterBankNameRefToSavingBook.label);
				isValid = false;
			}
			if(!$scope.validateString($scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.value)){
				$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.label);
				isValid = false;
			}
		}
		if($scope.validateString($scope.model.formNewRegisterTaxIdNumberRefToTaxId.value)){
			if(!$scope.validateString($scope.model.formNewRegisterTaxIdStatusRefToTaxId.value)){
				$scope.model.formNewRegisterTaxIdStatusRefToTaxId.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterTaxIdStatusRefToTaxId.label);
				isValid = false;
			}
			if(!$scope.validateString($scope.model.formNewRegisterTaxPayerStatusRefToTaxId.value)){
				$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterTaxPayerStatusRefToTaxId.label);
				isValid = false;
			}
			if(!$scope.validateString($scope.model.formNewRegisterDependentNumberRefToTaxId.value)){
				$scope.model.formNewRegisterDependentNumberRefToTaxId.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterDependentNumberRefToTaxId.label);
				isValid = false;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterMobilePhoneNumber.value)){
            $scope.model.formNewRegisterMobilePhoneNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterMobilePhoneNumber.label);
            isValid = false;
		}
		if(!$scope.validateString($scope.model.formNewRegisterEmailAddress.value)){
			$scope.model.formNewRegisterEmailAddress.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterEmailAddress.label);
            isValid = false;
		} else {
			if (!/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.model.formNewRegisterEmailAddress.value)) {
				isValid = false;
				$scope.model.formNewRegisterEmailAddress.error = $scope.globalMessage.RegisterErrorEmailFormat;
			}
		}
		if($scope.validateString($scope.model.formNewRegisterDependentNumberRefToTaxId.value)){
            if(parseInt($scope.model.formNewRegisterDependentNumberRefToTaxId.value) > 3){
				$scope.model.formNewRegisterDependentNumberRefToTaxId.error = $scope.globalMessage.RegisterDependentMaxErrorLabel;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterPassword.value)){
            $scope.model.formNewRegisterPassword.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterPassword.label);
            isValid = false;
		} else {
			if ($scope.model.formNewRegisterPassword.value.length < 8 || $scope.model.formNewRegisterPassword.value.length > 15) {
				isValid = false;
				$scope.model.formNewRegisterPassword.error = $scope.globalMessage.RegisterErrorPasswordLength;
			}
			else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test($scope.model.formNewRegisterPassword.value)) {
				isValid = false;
				$scope.model.formNewRegisterPassword.error = $scope.globalMessage.RegisterErrorPasswordCriteria;
			}
		}
		if(!$scope.validateString($scope.model.formNewRegisterConfirmPassword.value)){
            $scope.model.formNewRegisterConfirmPassword.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.model.formNewRegisterConfirmPassword.label);
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
	
	$scope.photoTake = function() {
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            var c = document.createElement('canvas');
            var ctx = c.getContext("2d");
			var img = new Image();
            img.onload = function(){
                c.width=this.width;
                c.height=this.height;
                ctx.drawImage(img, 0, 0);
                switch($scope.contentState)
                {
                    case $scope.IdCardPage:
                        $scope.model.idCard.imgFile64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            fileBlob: $scope.model.idCard.imgFile64,
                            fileName: "KTP"
                        });
                        break;

                    case $scope.TaxIdCardPage:
                        $scope.model.taxIdCard.imgFile64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            fileBlob: $scope.model.taxIdCard.imgFile64,
                            fileName: "TAX"
                        });
                        break;

                    case $scope.SavingBookPage:
                        $scope.model.savingBook.imgFile64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            fileBlob: $scope.model.savingBook.imgFile64,
                            fileName: "SAV"
                        });
                        break;

                    default:
                        break;
                }
				
            };
            img.src=imageUri;
			switch($scope.contentState)
                {
                    case $scope.IdCardPage:
						$scope.model.idCard.imgFile = imageUri;
                        break;

                    case $scope.TaxIdCardPage:
                        $scope.model.taxIdCard.imgFile = imageUri;
                        break;

                    case $scope.SavingBookPage:
                        $scope.model.savingBook.imgFile = imageUri;
                        break;

                    default:
                        break;
                }
			
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

	$scope.formNewRegisterProvince_OnChange = function(){
		$timeout( function(){
			$scope.generateCity();
		}, $scope.timeoutOpenPage);
	}
	
	$scope.generateCity = function(){
		$scope.model.formNewRegisterCity.value = $scope.stringEmpty;
		$scope.model.formNewRegisterCity.options = [];

		if($scope.masterData.cityList != null){
			$scope.masterData.cityList.forEach(function(value) {
				if(value.provinceCode == $scope.model.formNewRegisterProvince.value){
					$scope.model.formNewRegisterCity.options.push({ text: value.name, value: value.code});
				}
			});
			$scope.model.formNewRegisterCity.options = $scope.model.formNewRegisterCity.options
				.sort((a, b) => a.text.toLowerCase() < b.text.toLowerCase() ? -1 : 1);
		}
	}

	$scope.formNewRegisterTaxIdNumberRefToTaxId_OnChange = function(){
		// $scope.globalShowLoading();
		$timeout(function(){
			if($scope.model.formNewRegisterTaxIdNumberRefToTaxId.value == ""){
				$scope.model.formNewRegisterTaxIdStatusRefToTaxId.isDisabled = true;
				$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.isDisabled = true;
				$scope.model.formNewRegisterDependentNumberRefToTaxId.isDisabled = true;

				$scope.model.formNewRegisterTaxIdStatusRefToTaxId.value = $scope.stringEmpty;
				$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.value = $scope.stringEmpty;
				$scope.model.formNewRegisterDependentNumberRefToTaxId.value = $scope.stringEmpty;

				$scope.model.formNewRegisterTaxIdStatusRefToTaxId.error = $scope.stringEmpty;
				$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.error = $scope.stringEmpty;
				$scope.model.formNewRegisterDependentNumberRefToTaxId.error = $scope.stringEmpty;
			} else {
				$scope.model.formNewRegisterTaxIdStatusRefToTaxId.isDisabled = false;
				$scope.model.formNewRegisterTaxPayerStatusRefToTaxId.isDisabled = false;
				$scope.model.formNewRegisterDependentNumberRefToTaxId.isDisabled = false;
			}
			// $scope.globalHideLoading();
		}, 500);
	}

	$scope.formNewRegisterPassword_OnChange = function(){

	}

	$scope.toogleTooltip1 = function(){
		$scope.tooltipTitle = $scope.password.tooltip;
		$scope.tooltipOptions = $scope.password.tooltipOptions;
		$scope.popupValue = !$scope.popupValue;
	}

	$scope.toogleTooltip = function(){
		$scope.tooltipTitle = $scope.model.formNewRegisterTaxIdNumberRefToTaxId.tooltip;
		$scope.tooltipOptions = [];
		$scope.popupValue = !$scope.popupValue;
	}

	$scope.formNewRegisterAccountBankNumberRefToSavingBook_OnChange = function(){
		$timeout(function(){
			if($scope.model.formNewRegisterAccountBankNumberRefToSavingBook.value == ""){
				$scope.model.formNewRegisterBankNameRefToSavingBook.isDisabled = true;
				$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.isDisabled = true;

				$scope.model.formNewRegisterBankNameRefToSavingBook.value = $scope.stringEmpty;
				$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.value = $scope.stringEmpty;

				$scope.model.formNewRegisterBankNameRefToSavingBook.error = $scope.stringEmpty;
				$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.error = $scope.stringEmpty;
			} else {
				$scope.model.formNewRegisterBankNameRefToSavingBook.isDisabled = false;
				$scope.model.formNewRegisterAccountBankOwnerNameRefToSavingBook.isDisabled = false;
			}
		}, 500);
	}

	$scope.formNewRegisterAgenCode_OnChange = function(){
		$scope.model.formNewRegisterAgenName.value = $scope.stringEmpty;
								$scope.model.formNewRegisterAgentSupervisor.value = $scope.stringEmpty;
		$timeout(function(){
			if($scope.model.formNewRegisterAgenCode.value.length == 6){
				var promise = API.GetAgentDetail(
					$scope.model.formNewRegisterAgenCode.value
				);
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
							if(args.value != null){
								$scope.model.formNewRegisterAgenName.value = args.value.agentName;
								$scope.model.formNewRegisterAgentSupervisor.value = args.value.spvIdCard;
							}
						}
					},
					function(error) {
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
			} else {
				$scope.model.formNewRegisterAgenName.value = $scope.stringEmpty;
			}
		}, 500);
	}
});