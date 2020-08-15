rootApp
.directive('posDetailPage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/posDetail/posDetail.html'
    };
})
.controller('posDetailPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.PosDetailPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		right1: '<img src="img/icon-save.svg" />',
		onLeftClick: function () { $scope.onBack(); },
		onRight1Click: function () { $scope.onSave(); }
    };
    
    $scope.$on('showPosDetailPage', function(event, args){
        $scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
    
        $timeout(function(){
            $scope.isOnLoad = true;
            $scope.disabled = true;
            $scope.productName = $scope.stringEmpty;
            
            if ($scope.globalData.Rank.toLowerCase() == 'nsh' ||
                $scope.globalData.Rank.toLowerCase() == 'am'
            ) {
                $scope.allowSubmit = false;
            } else {
                $scope.allowSubmit = true;
            }

            $scope.pageContent = [];
            $scope.pageContentIndex = -1;
            $scope.contentState = $scope.stringEmpty;
            $scope.formAddressTitle = $scope.globalMessage.PosDetailFormAddressTitle;

            $scope.formSurrenderReinstatementTitle = $scope.globalMessage.PosDetailFormUpdateDataTitle;
            $scope.formReasonTitle = $scope.stringEmpty;
            $scope.formUseFundSurrenderReinstatementTitle = $scope.globalMessage.PosDetailFormUseFundSurrenderTitle;
            $scope.counter = 0;
            $scope.model = {
                useFundPage: {
                    type: "",
                    transfer: {},
                    move: [
                        {
                            certificateNumber: {
                                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelCertificateNumber,
                                error: $scope.stringEmpty,
                                value: $scope.stringEmpty,
                            },
                            fundAmount: {
                                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFundAmount,
                                error: $scope.stringEmpty,
                                value: $scope.stringEmpty,
                            },
                            purposeMove: {
                                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelPurposeUse,
                                error: $scope.stringEmpty,
                                value: $scope.stringEmpty,
                                options: [
                                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFirstPayment, value: 0},
                                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelTopUp, value: 1},
                                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelRenewal, value: 2},
                                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelLoanPayment, value: 3},
                                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtc, value: 4}
                                ]
                            },
                            etc: {
                                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtces,
                                error: $scope.stringEmpty,
                                value: $scope.stringEmpty
                            }
                        }
                    ]
                }
            };

            $scope.posId = $scope.stringEmpty;
            if(args.posData.id != "" && args.posData.id != undefined){
                $scope.posId = args.posData.id;
            }
            
            $scope.uploadDocList = [];

            $scope.contentIndex = 1;
            $scope.contentUpdateDataClass = $scope.stringEmpty;
            $scope.content2AddressClass = $scope.stringEmpty;
            $scope.content2NameClass = $scope.stringEmpty;
            $scope.content2AccountBankClass = $scope.stringEmpty;
            $scope.content2BenefitClass = $scope.stringEmpty;
            $scope.content3Class = $scope.stringEmpty;
            $scope.contentIdCardClass = $scope.stringEmpty;
            $scope.contentSavingBookClass = $scope.stringEmpty;
            $scope.contentFamilyCardClass = $scope.stringEmpty;
            $scope.contentBirthCertificateClass = $scope.stringEmpty;
            $scope.contentPaymentReceiptClass = $scope.stringEmpty;
            $scope.contentPreviewClass = $scope.stringEmpty;
            $scope.contentSurrenderReinstatementPreviewClass = $scope.stringEmpty;
            $scope.contentTokenClass = $scope.stringEmpty;

            $scope.contentUpdateDataSurrenderReinstatementClass = $scope.stringEmpty;
            $scope.contentReasonClass = $scope.stringEmpty;
            $scope.contentUseFundSurrenderReinstatementClass = $scope.stringEmpty;
            $scope.contentHealthStatementClass = $scope.stringEmpty;
            $scope.contentParticipantStatementClass = $scope.stringEmpty;
            $scope.contentReinstatementAccountBankClass = $scope.stringEmpty;

            $scope.contentAccountBankMaturityClass = $scope.stringEmpty;
            $scope.contentMaturityPreviewClass = $scope.stringEmpty;

            $scope.form1Name = $scope.stringEmpty;
            $scope.form1Dob = $scope.stringEmpty;
            $scope.form1Address = $scope.stringEmpty;
            $scope.form1AgentCode = $scope.stringEmpty;
            $scope.form1SertificateNumber = $scope.stringEmpty;
            $scope.form1IsSearch = false;
            $scope.form1IsChecked = false;

            $scope.form1NoSertificateSearch = {
                label: $scope.globalMessage.PosDetailForm1PlaceholderSertificate,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
                type: 'tel'
            };

            $scope.form1DobSearch = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm1LabelDob,
				type: 'date',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUseFundSurrenderUseFundType = {
                value: true,
                label: $scope.globalMessage.PosDetailFormUseFundSurrenderUseFundType,
                type: 'radio',
                error: $scope.stringEmpty,
                options: [
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelTransfer, value: true},
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelMove, value: false}
                ]
            };

            $scope.form1IsAddress = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioAddress, value: $scope.stringEmpty }
                ]
            }

            $scope.form1IsAccountBank = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioAccountBankNumber, value: $scope.stringEmpty }
                ]
            }

            $scope.form1IsName = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioName, value: $scope.stringEmpty }
                ]
            }
            
            $scope.form1IsBenefit = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioBenefitReceive, value: $scope.stringEmpty }
                ]
            }

            $scope.form1IsEndInsurance = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioEndInsurance, value: $scope.stringEmpty }
                ]
            }

            $scope.form1IsCertificate = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioSertificate, value: $scope.stringEmpty }
                ]
            }

            $scope.form1IsMaturity = {
                value: $scope.stringEmpty,
                label: $scope.stringEmpty,
                type: 'checkbox',
                error: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosDetailForm1RadioMaturity, value: $scope.stringEmpty }
                ]
            }
            
            $scope.form1Separator = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm1LabelChangeType,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUpdateDataSeparator = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelHomePhone,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUpdateDataAreaCode = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelAreaCode,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 5
            };

            $scope.formUpdateDataHomePhone = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelPhoneNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 15
            };

            $scope.formUpdateDataSeparator2 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelCellular,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUpdateDataMobilePhone = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelHandphoneNumber,
				type: 'mobile',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
            };

            $scope.formUpdateDataSeparator3 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelEmail,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUpdateDataEmail = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelEmailAddress,
				type: 'email',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.formAddress2Address1 = {
                value: $scope.stringEmpty,
                label: $scope.globalMessage.PosDetailFormAddress2LabelAddress,
                error: $scope.stringEmpty,
                type: 'address',
                options: [],
                maxlength: 50
            };

            $scope.formAddress2Address2 = {
                value: $scope.stringEmpty,
                label: $scope.globalMessage.PosDetailFormAddress2LabelAddress,
                error: $scope.stringEmpty,
                type: 'address',
                options: [],
                maxlength: 50
            };

            $scope.formAddress2RtRw = {
                value: $scope.stringEmpty,
                label: $scope.globalMessage.PosDetailFormAddress2LabelRtRw,
                error: $scope.stringEmpty,
                type: 'rt/rw',
                options: [],
                maxlength: 10
            };

            $scope.formAddress2Province = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelProvince,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formAddress2City = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelCity,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formAddress2PostalCode = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelPosCode,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 5
            };

            $scope.formAddress2District = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelKelurahan,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
            };

            $scope.formAddress2SubDistrict = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelKecamatan,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
            };

            $scope.formName2Name = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormName2LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };
            
            $scope.formAccountBank2Name = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.formAccountBank2BankName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankName,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formAccountBank2BankBranch = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankBranch,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
            };
            
            $scope.formAccountBank2AccountBankNumber = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelAccountBankNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
            };

            $scope.formBenefit2Name = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormBenefit2LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.formBenefit2Relationship = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormBenefit2Message,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.form3IsGovernmentEmployment = {
                value: false,
				label: $scope.globalMessage.PosDetailForm3LabelIsGovernmentEmployment,
				type: 'radio',
				error: $scope.stringEmpty,
				options: [
                    {text: $scope.globalMessage.PosDetailForm3IsGovernmentYes, value: true},
                    {text: $scope.globalMessage.PosDetailForm3IsGovernmentNo, value: false}
                ]
            };

            $scope.form3OfficerName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm3LabelOfficerName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 60
            };

            $scope.form3InstitutionName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm3LabelInstitutionName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 60
            };

            $scope.form3Position = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm3LabelPosition,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.form3Tenure = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm3LabelTenure,
				type: 'address',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 30
            };

            $scope.form3Country = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailForm3LabelCountry,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formPreviewAgree = {
                value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.PosDetailFormPreviewLabelCheckboxAgree, value: $scope.stringEmpty }
				]
            };

            $scope.formSurrenderReinstatementPreviewAgree = {
                value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.PosDetailFormPreviewLabelCheckboxAgree, value: $scope.stringEmpty }
				]
            };

            $scope.formMaturityPreviewAgree = {
                value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.PosDetailFormPreviewLabelCheckboxAgree, value: $scope.stringEmpty }
				]
            };

            $scope.formToken = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormTokenMessage3,
				type: 'tel',
				error: $scope.stringEmpty,
				maxlength: 6
            };

            //TODO:
            $scope.formSurrenderReinstatementSeparator = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2BasedOnIdCard,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formSurrenderReinstatementSeparator3 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelHomePhone,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formSurrenderReinstatementSeparator4 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelCellular,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };
          
            $scope.formSurrenderReinstatementSeparator5 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelEmail,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formSurrenderReinstatementSeparator6 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAddress2LabelCorrespondendAddress,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUseFundSurrenderSeparator = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelTransfer,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUseFundSurrenderSeparator2 = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelMove,
				type: 'separator',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUseFundSurrenderName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.formUseFundSurrenderBankName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankName,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formUseFundSurrenderBankBranch = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankBranch,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
            };
            
            $scope.formUseFundSurrenderAccountBankNumber = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelAccountBankNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
            };

            $scope.formHealthStatementAgree = {
                value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.PosDetailFormPreviewLabelCheckboxAgree, value: $scope.stringEmpty }
				]
            };

            $scope.formParticipantStatementAgree = {
                value: $scope.stringEmpty,
				label: $scope.stringEmpty,
				type: 'checkbox',
				error: $scope.stringEmpty,
				options: [
					{ text: $scope.globalMessage.PosDetailFormPreviewLabelCheckboxAgree, value: $scope.stringEmpty }
				]
            };

            $scope.formAccountBankReinstatementName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelName,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 50
            };

            $scope.formAccountBankReinstatementBankName = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankName,
				type: 'select',
				error: $scope.stringEmpty,
				options: []
            };

            $scope.formAccountBankReinstatementBankBranch = {
				value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelBankBranch,
				type: 'text',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 25
            };
            
            $scope.formAccountBankReinstatementAccountBankNumber = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosDetailFormAccountBank2LabelAccountBankNumber,
				type: 'tel',
				error: $scope.stringEmpty,
				options: [],
				maxlength: 20
            };

            $scope.formReason = {
                value: $scope.stringEmpty,
                label: $scope.globalMessage.PosDetailFormReasonSurrenderLabel,
                type: 'textarea',
                error: $scope.stringEmpty,
                options: []
            };
            
            $scope.masterData = undefined;

            $scope.tokenCounterLabel = $scope.stringEmpty;
            $scope.fobIdCardIcon = 'fa-camera';
            $scope.fobSavingBookIcon = 'fa-camera';
            $scope.fobFamilyCardIcon = 'fa-camera';
            $scope.fobBirthCertificateIcon = 'fa-camera';
            $scope.imgIdCard = undefined;
            $scope.imgSavingBook = undefined;
            $scope.imgFamilyCard = undefined;
            $scope.imgBirthCertificate = undefined;
            $scope.imgPaymentReceipt = undefined;
            $scope.imgIdCardByte64 = undefined;
            $scope.imgSavingBookByte64 = undefined;
            $scope.imgFamilyCardByte64 = undefined;
            $scope.imgBirthCertificateByte64 = undefined;
            $scope.imgPaymentReceiptByte64 = undefined;

            $scope.minYear = 1950;
            $scope.maxYear = new Date().getFullYear() - 10;

            $scope.setNavigatonType();
            $scope.loadMasterData();
            $scope.globalHideLoading();
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
        $scope.$emit('refreshPosList');
        console.log("End Close Function");
    }
    
    $scope.onBack = function () {
		try {
			navigator.notification.confirm (
				$scope.globalMessage.PosDetailPopUpCloseForm,
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
    
    $scope.loadMasterData = function(){
        $scope.formAddress2Province.options = [];
        $scope.formAddress2City.options = [];
 
        $scope.formAccountBank2BankName.options = [];
        $scope.formBenefit2Relationship.options = [];

        var promise = API.PosGetMasterData();
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
                        if($scope.masterData.provinceList != null){
                            $scope.masterData.provinceList.forEach(function(value){
                                $scope.formAddress2Province.options.push({text: value.provinceDescription, value: value.provinceCode});
                            });
                        }

                        if($scope.masterData.bankList != null){
                            $scope.masterData.bankList.forEach(function(value){
                                $scope.formAccountBank2BankName.options.push({text: value.bankDescription, value: value.bankCode});
                                $scope.formUseFundSurrenderBankName.options.push({text: value.bankDescription, value: value.bankCode});
                                $scope.formAccountBankReinstatementBankName.options.push({text: value.bankDescription, value: value.bankCode});
                            });
                        }

                        if($scope.masterData.relationList != null){
                            $scope.masterData.relationList.forEach(function(value){
                                $scope.formBenefit2Relationship.options.push({text: value.relationDescription, value: value.relationCode});
                            });
                        }

                        if($scope.masterData.countryList != null){
                            $scope.masterData.countryList.forEach(function(value){
                                $scope.form3Country.options.push({text: value.countryDescription, value: value.countryCode});
                            });
                        }
                        $scope.form3Country.value = "ID";
                    }
                    

                    //TODO: 
                    $scope.isOnLoad = false;
                }
                if($scope.posId != "" && $scope.posId != undefined){
                    $scope.draftPos($scope.posId);
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

    $scope.draftPos = function(posId){
        $scope.globalShowLoading();
        var promise = API.PosGetDraft(posId);
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
                    //TODO: need to define args.value.---

                    if(args != null){
                        if(args.value != null){
                            if(args.value.posDraft){
                                var changeTypeList = [];
                                if(args.value.posDraft.transactionType != null){
                                    $scope.form1IsSearch = true;
                                    changeTypeList = args.value.posDraft.transactionType.split(",");
                                    changeTypeList.forEach(element => {
                                        if(element == "P001"){
                                            $scope.form1IsAddress.options[0].checked = true;
                                            $scope.typeChangePOS(1);
                                        } else if(element == "P002"){
                                            $scope.form1IsAccountBank.options[0].checked = true;
                                            $scope.typeChangePOS(2);
                                        } else if(element == "P003"){
                                            $scope.form1IsBenefit.options[0].checked = true;
                                            $scope.typeChangePOS(3);
                                        } else if(element == "P004"){
                                            $scope.form1IsName.options[0].checked = true;
                                            $scope.typeChangePOS(4);
                                        } else if(element == "P005"){
                                            $scope.form1IsEndInsurance.options[0].checked = true;
                                            $scope.typeChangeEndInsurance(5);
                                        } else if(element == "P006"){
                                            $scope.form1IsCertificate.options[0].checked = true;
                                            $scope.typeChangeCertificate(6);
                                        } else if(element == "P007"){
                                            $scope.form1IsMaturity.options[0].checked = true;
                                            $scope.typeChangeMaturity(7);
                                        }
                                    });
                                }

                                //form1
                                $scope.form1NoSertificateSearch.value = args.value.posDraft.certificateNumber;
                                $scope.form1DobSearch.value = new Date(args.value.posDraft.dob);
                                $scope.form1Name = args.value.posDraft.customerName;
                                $scope.form1Dob = moment(args.value.posDraft.custDob).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
                                $scope.form1Address = args.value.posDraft.customerAddress1;
                                $scope.form1AgentCode = args.value.posDraft.agentCode;

                                //pengkinian data
                                $scope.formUpdateDataAreaCode.value = args.value.posDraft.customerAreaCode;
                                $scope.formUpdateDataHomePhone.value = args.value.posDraft.customerHomePhone;
                                $scope.formUpdateDataMobilePhone.value = args.value.posDraft.customerMobilePhone;
                                $scope.formUpdateDataEmail.value = args.value.posDraft.customerEmail;

                                //perubahan alamat
                                $scope.formAddress2Address1.value = args.value.posDraft.customerAddress1;
                                $scope.formAddress2Address2.value = args.value.posDraft.customerAddress2;
                                $scope.formAddress2RtRw.value = args.value.posDraft.customerRtRw;
                                $scope.formAddress2Province.value = args.value.posDraft.customerProvince;
                                $scope.formAddress2City.value = args.value.posDraft.customerCity;
                                $scope.formAddress2PostalCode.value = args.value.posDraft.customerPostalCode;
                                $scope.formAddress2District.value = args.value.posDraft.customerDistrict;
                                $scope.formAddress2SubDistrict.value = args.value.posDraft.customerSubDistrict;

                                //perubahan nama
                                $scope.formName2Name.value = args.value.posDraft.customerName;

                                //perubahan nomor rekening
                                $scope.formAccountBank2AccountBankNumber.value = args.value.posDraft.accountBankNumber;
                                $scope.formAccountBank2BankBranch.value = args.value.posDraft.bankBranch;
                                $scope.formAccountBank2BankName.value = args.value.posDraft.bankName;
                                $scope.formAccountBank2Name.value = args.value.posDraft.accountBankOwnerName;

                                //perubahan penerima manfaat
                                $scope.formBenefit2Name.value = args.value.posDraft.relationName;
                                $scope.formBenefit2Relationship.value = args.value.posDraft.relationType;

                                //reason
                                $scope.formReason.value = args.value.posDraft.reason;

                                //use fund
                                var moveFundList = [];
                                if(args.value.posDraft.moveToCardList != null){

                                    $scope.formUseFundSurrenderUseFundType.value = true;
                                    moveFundList = args.value.posDraft.moveToCardList;

                                    while($scope.model.useFundPage.move.length < moveFundList.length){
                                        $scope.addUseFund();
                                    }

                                    for(var i = 0; i < moveFundList.length; i++){
                                        $scope.model.useFundPage.move[i].certificateNumber.value = moveFundList[i].certificateNumber;
                                        $scope.model.useFundPage.move[i].fundAmount.value = moveFundList[i].fundAmount;
                                        $scope.model.useFundPage.move[i].purposeMove.options[0].checked = moveFundList[i].isFirstPremiPayment;
                                        $scope.model.useFundPage.move[i].purposeMove.options[1].checked = moveFundList[i].isTopUp;
                                        $scope.model.useFundPage.move[i].purposeMove.options[2].checked = moveFundList[i].isRenewal;
                                        $scope.model.useFundPage.move[i].purposeMove.options[3].checked = moveFundList[i].isPaymentLoanCertificate;
                                        $scope.model.useFundPage.move[i].purposeMove.options[4].checked = moveFundList[i].isEtc;
                                        $scope.model.useFundPage.move[i].etc.value = moveFundList[i].etcDescription;
                                    }
                                } else {
                                    $scope.formUseFundSurrenderUseFundType.value = false;
                                }

                                //health statement
                                $scope.formHealthStatementAgree.options[0].checked = args.value.posDraft.healthStatement;

                                //participant statement
                                $scope.formParticipantStatementAgree.options[0].checked = args.value.posDraft.participantStatement;

                                //compliance
                                $scope.form3IsGovernmentEmployment.value = args.value.posDraft.isGovernmentEmployment;
                                $scope.form3Country.value = args.value.posDraft.country;
                                $scope.form3InstitutionName.value = args.value.posDraft.governmentInstituteName;
                                $scope.form3OfficerName.value = args.value.posDraft.governmentOfficerName;
                                $scope.form3Position.value = args.value.posDraft.position;
                                $scope.form3Tenure.value = args.value.posDraft.tenure;

                                //upload doc
                                var uploadDocList = [];
                                if(args.value.posDraft.uploadDocList != null){
                                    uploadDocList = args.value.posDraft.uploadDocList;
                                    uploadDocList.forEach(doc => {
                                        var docType = doc.docType.split("_");
                                        if(docType[1] == "SDP001"){
                                            $scope.imgIdCard = doc.docFile;
                                            $scope.imgIdCardByte64 = doc.docFile;
                                        } else if(docType[1] == "SDP002"){
                                            $scope.imgFamilyCard = doc.docFile;
                                            $scope.imgFamilyCardByte64 = doc.docFile;
                                        } else if(docType[1] == "SDP003"){
                                            $scope.imgBirthCertificate = doc.docFile;
                                            $scope.imgBirthCertificateByte64 = doc.docFile;
                                        } else if(docType[1] == "SDP004"){
                                            $scope.imgSavingBook = doc.docFile;
                                            $scope.imgSavingBookByte64 = doc.docFile;
                                        } else if(docType[1] == "SDP005"){
                                            $scope.imgPaymentReceipt = doc.docFile;
                                            $scope.imgPaymentReceiptByte64 = doc.docFile;
                                        }
                                    });
                                }
                            }

                            if(args.value.posDefault){
                                //TODO: ???
                                $scope.defaultModel = {
                                    form1Name: args.value.posDefault.custName,
                                    form1Dob: moment(args.value.posDefault.custDob).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin),
                                    form1Address: args.value.posDefault.custAddress,
                                    form1AgentCode: args.value.posDefault.custAgentCode,
                                    form1SertificateNumber: $scope.form1NoSertificateSearch.value,
                                    productName: this.form1SertificateNumber + " - " + this.form1Name,
                                    formUpdateDataAreaCode: args.value.posDefault.areaCode,
                                    formUpdateDataEmail: args.value.posDefault.email,
                                    formUpdateDataHomePhone: args.value.posDefault.homePhone,
                                    formUpdateDataMobilePhone: args.value.posDefault.mobilePhone,
                                    formAddress2Address1: args.value.posDefault.address,
                                    formAddress2RtRw: args.value.posDefault.rtRw,
                                    formAddress2Province: args.value.posDefault.province,
                                    formAddress2PostalCode: args.value.posDefault.postalCode,
                                    formAddress2District: args.value.posDefault.district,
                                    formAddress2SubDistrict: args.value.posDefault.subDistrict,
                                    formAccountBank2Name: args.value.posDefault.accountBankOwnerName,
                                    formAccountBank2BankName: args.value.posDefault.bankName,
                                    formAccountBank2BankBranch: args.value.posDefault.bankBranch,
                                    formAccountBank2AccountBankNumber: args.value.posDefault.accountBankNumber,
                                    formName2Name: args.value.posDefault.name,
                                    formBenefit2Name: args.value.posDefault.relationName,
                                    formBenefit2Relationship: args.value.posDefault.relationStatus,
                                    formAddress2City: args.value.posDefault.city,
                                };
                            }
                        }
                    }
                }
                $scope.globalHideLoading();
            }, function(error){
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
    }

    $scope.onSave = function (){
        $scope.moveList = [];
        for(var i = 0; i < $scope.model.useFundPage.move.length; i++){
            $scope.moveList.push({
                certificateNumber: $scope.model.useFundPage.move[i].certificateNumber.value,
                fundAmount: $scope.model.useFundPage.move[i].fundAmount.value == "" ? 0 : $scope.model.useFundPage.move[i].fundAmount.value,
                isFirstPremiPayment: $scope.model.useFundPage.move[i].purposeMove.options[0].checked == undefined ? false : true,
                isTopUp: $scope.model.useFundPage.move[i].purposeMove.options[1].checked == undefined ? false : true,
                isRenewal: $scope.model.useFundPage.move[i].purposeMove.options[2].checked == undefined ? false : true,
                isPaymentLoanCertificate: $scope.model.useFundPage.move[i].purposeMove.options[3].checked == undefined ? false : true,
                isEtc: $scope.model.useFundPage.move[i].purposeMove.options[4].checked == undefined ? false : true,
                etcDescription: $scope.model.useFundPage.move[i].etc.value
            });
        }

        $scope.globalShowLoading();
        var promise = API.PosSave(
            $scope.posId,
            $scope.form1NoSertificateSearch.value,
            $scope.transactionType,
            $scope.form1DobSearch.value,
            $scope.formUpdateDataAreaCode.value,
            $scope.formUpdateDataHomePhone.value,
            $scope.formUpdateDataMobilePhone.value,
            $scope.formUpdateDataEmail.value,
            $scope.formAddress2Address1.value,
            $scope.formAddress2Address2.value,
            $scope.formAddress2RtRw.value,
            $scope.formAddress2Province.value,
            $scope.formAddress2City.value,
            $scope.formAddress2PostalCode.value,
            $scope.formAddress2District.value,
            $scope.formAddress2SubDistrict.value,
            $scope.formName2Name.value,
            $scope.formAccountBank2Name.value,
            $scope.formAccountBank2BankName.value,
            $scope.formAccountBank2BankBranch.value,
            $scope.formAccountBank2AccountBankNumber.value,
            $scope.formBenefit2Name.value,
            $scope.formBenefit2Relationship.value,
            $scope.moveList,
            $scope.formHealthStatementAgree.options[0].checked,
            $scope.formParticipantStatementAgree.options[0].checked,
            $scope.form3IsGovernmentEmployment.value,
            $scope.form3OfficerName.value,
            $scope.form3InstitutionName.value,
            $scope.form3Position.value,
            $scope.form3Tenure.value,
            $scope.form3Country.value,
            $scope.uploadDocList,
            $scope.formToken.value
        );
        promise.then(function(args){
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
            else if (args.errorCode != 0) {
                var errorMessage = $scope.globalMessage.PosDetailSaveErrorFailed;
                if(args.errorCode == 2){
                    errorMessage = $scope.globalMessage.PosDetailSaveCoreErrorFailed;
                }
                try {
                    navigator.notification.alert(
                        errorMessage,
                        function () { },
                        $scope.globalMessage.PopUpTitle,
                        $scope.globalMessage.PopUpButtonOK
                    );
                }
                catch(err) { alert(errorMessage); }
            } else {
                if(args.value.id != undefined && args.value.id != $scope.stringEmpty){
                    $scope.posId = args.value.id;
                } else {
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
        }, function(error){
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

    $scope.prevClick = function(){

        if($scope.pageContent[$scope.pageContentIndex] == 'UpdateData'){
            $scope.contentUpdateDataClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Address'){
            $scope.content2AddressClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBank'){
            $scope.content2AccountBankClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Name'){
            $scope.content2NameClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Benefit'){
            $scope.content2BenefitClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Surrender'){
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitle;
            $scope.contentUpdateDataSurrenderReinstatementClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Reinstatement'){
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitle;
            $scope.contentUpdateDataSurrenderReinstatementClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ReasonSurrender'){
            $scope.contentReasonClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ReasonReinstatement'){
            $scope.contentReasonClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'UseFundSurrender'){
            $scope.contentUseFundSurrenderReinstatementClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'HealthStatement'){
            $scope.contentHealthStatementClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ParticipantStatement'){
            $scope.contentParticipantStatementClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBankReinstatement'){
            $scope.contentReinstatementAccountBankClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Compliance'){
            $scope.content3Class = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Ktp'){
            $scope.contentIdCardClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Kk'){
            $scope.contentFamilyCardClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Akte'){
            $scope.contentBirthCertificateClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Tabungan'){
            $scope.contentSavingBookClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Pembayaran'){
            $scope.contentPaymentReceiptClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Preview'){
            $scope.contentPreviewClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'SurrenderReinstatementPreview'){
            $scope.contentSurrenderReinstatementPreviewClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Token'){
            $scope.contentTokenClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Maturity'){
            $scope.contentUpdateDataClass = $scope.stringEmpty;
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitle;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBankMaturity'){
            $scope.contentAccountBankMaturityClass = $scope.stringEmpty;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'MaturityPreview'){
            $scope.contentMaturityPreviewClass = $scope.stringEmpty;
        }

        if($scope.contentIndex > 1){
            $scope.contentIndex--;
        }

        if($scope.pageContentIndex > -1){
            $scope.pageContentIndex--;
        }

        if($scope.pageContentIndex == -1){
            $scope.contentState = $scope.stringEmpty;
        } else {
            $scope.contentState = $scope.pageContent[$scope.pageContentIndex];
        }
        $scope.setNavigatonType();

        $timeout(function(){
			$('.pos-detail-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
        }, $scope.timeoutOpenPage);
    }

    $scope.nextClick = function(){
        $scope.contentIndex++;
        $scope.pageContentIndex++;

        if($scope.contentState == 'UpdateData'){
            if(!$scope.validateFormUpdateData()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Address'){
            if(!$scope.validateFormAddress2()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'AccountBank'){
            if(!$scope.validateFormAccountBank2()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Name'){
            if(!$scope.validateFormName2()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Benefit'){
            if(!$scope.validateFormBenefit2()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Surrender'){
            if(!$scope.validateFormUpdateDataSurrenderReinstatement()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Reinstatement'){
            if(!$scope.validateFormUpdateDataSurrenderReinstatement()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'ReasonSurrender'){
            if(!$scope.validateFormReason()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'ReasonReinstatement'){
            if(!$scope.validateFormReason()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'UseFundSurrender'){
            if(!$scope.validateFormUseFundAccountBank()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'AccountBankReinstatement'){
            if(!$scope.validateReinstatementAccountBank()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Compliance'){
            if(!$scope.validateForm3()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'Maturity'){
            if(!$scope.validateFormUpdateData()){
                $scope.pageContentIndex--;
            }
        } else if($scope.contentState == 'AccountBankMaturity'){
            if(!$scope.validateFormAccountBank2()){
                $scope.pageContentIndex--;
            }
        }
        
        if($scope.pageContent[$scope.pageContentIndex] == 'UpdateData'){
            $scope.contentUpdateDataClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Address'){
            $scope.content2AddressClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBank'){
            $scope.content2AccountBankClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Name'){
            $scope.content2NameClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Benefit'){
            $scope.content2BenefitClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Surrender'){
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitleSurrender;
            $scope.contentUpdateDataSurrenderReinstatementClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Reinstatement'){
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitleReinstatement;
            $scope.contentUpdateDataSurrenderReinstatementClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ReasonSurrender'){
            $scope.formReasonTitle = $scope.globalMessage.PosDetailFormReasonSurrenderTitle;
            $scope.formReason.label = $scope.globalMessage.PosDetailFormReasonSurrenderLabel;
            $scope.contentReasonClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ReasonReinstatement'){
            $scope.formReasonTitle = $scope.globalMessage.PosDetailFormReasonReinstatementTitle;
            $scope.formReason.label = $scope.globalMessage.PosDetailFormReasonReinstatementLabel;
            $scope.contentReasonClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'UseFundSurrender'){
            $scope.contentUseFundSurrenderReinstatementClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'HealthStatement'){
            $scope.contentHealthStatementClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'ParticipantStatement'){
            $scope.contentParticipantStatementClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBankReinstatement'){
            $scope.contentReinstatementAccountBankClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Compliance'){
            $scope.content3Class = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Ktp'){
            $scope.contentIdCardClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Kk'){
            $scope.contentFamilyCardClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Akte'){
            $scope.contentBirthCertificateClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Tabungan'){
            $scope.contentSavingBookClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Pembayaran'){
            $scope.contentPaymentReceiptClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Preview'){
            $scope.contentPreviewClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'SurrenderReinstatementPreview'){
            $scope.contentSurrenderReinstatementPreviewClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Token'){
            if($scope.formToken.value == $scope.stringEmpty || $scope.formToken.value == undefined){
                $scope.initFormToken();
            }
        } else if($scope.pageContent[$scope.pageContentIndex] == 'Maturity'){
            $scope.contentUpdateDataClass = 'active';
            $scope.navBarTop.title = $scope.globalMessage.PosDetailPageTitleMaturity;
        } else if($scope.pageContent[$scope.pageContentIndex] == 'AccountBankMaturity'){
            $scope.contentAccountBankMaturityClass = 'active';
        } else if($scope.pageContent[$scope.pageContentIndex] == 'MaturityPreview'){
            $scope.contentMaturityPreviewClass = 'active';
        }

        $scope.contentState = $scope.pageContent[$scope.pageContentIndex];
        $scope.setNavigatonType();

        $timeout( function(){
			$('.pos-detail-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
        }, $scope.timeoutOpenPage );
    }

    $scope.initFormToken = function(){
        $scope.formToken.value = $scope.stringEmpty;
        $scope.requestClick();
    }

    $scope.requestClick = function(){
        $scope.formToken.value = $scope.stringEmpty;
        $scope.formToken.error = $scope.stringEmpty;
        $scope.isRequestAvailable = 'disabled';
        $scope.globalShowLoading();
        //TODO:
        var promise = API.PosRequestToken(
            $scope.formUpdateDataMobilePhone.value,
            $scope.formUpdateDataEmail.value
        );
        promise.then(function(args){
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
            else if(args.value.isRequestGranted){
                $scope.tokenCounterLabel = $scope.globalMessage.PosDetailFormTokenMessage2.format(args.value.totalTokenRequest + 1);
                $scope.contentTokenClass = 'active';
                $scope.timeout = new Date().setSeconds(new Date().getSeconds() + args.value.timeout);
                $scope.countdown();
                try{
                    window.plugins.toast.showShortBottom($scope.globalMessage.SubmissionToastRequestToken);
                }
                catch(err){
                    alert($scope.globalMessage.PosDetailFormTokenToastRequestToken);
                }
            }
            else{
                $scope.contentIndex = $scope.contentIndex - 1;
                $scope.pageContentIndex--;
				var errorMessage = $scope.globalMessage.PosDetailFormTokenErrorMaxToken.format(args.value.maxTokenRequest);
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
        }, function(error){
            try{
                navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
            }
            catch(err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
            $scope.pageContentIndex--;
			$scope.globalHideLoading();
        });
    }

    $scope.countdown = function(){
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

    $scope.submit = function(){
        $scope.globalShowLoading();
        var promise = API.PosValidateToken(
            $scope.formUpdateDataEmail.value,
            $scope.formUpdateDataMobilePhone.value,
            $scope.formToken.value
        );
        promise.then(function(args){
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
                if(!args.value.isValidate){
                    $scope.formToken.error = $scope.globalMessage.PosDetailErrorTokenInvalid;
                } else {
                    $scope.confirmClick();
                }
            }
        }, function(error){
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

    $scope.confirmClick = function(){
        var promise = API.PosSubmit(
            $scope.posId,
            $scope.form1NoSertificateSearch.value,
            $scope.transactionType,
            $scope.form1DobSearch.value,
            $scope.formUpdateDataAreaCode.value,
            $scope.formUpdateDataHomePhone.value,
            $scope.formUpdateDataMobilePhone.value,
            $scope.formUpdateDataEmail.value,
            $scope.formAddress2Address1.value,
            $scope.formAddress2Address2.value,
            $scope.formAddress2RtRw.value,
            $scope.formAddress2Province.value,
            $scope.formAddress2City.value,
            $scope.formAddress2PostalCode.value,
            $scope.formAddress2District.value,
            $scope.formAddress2SubDistrict.value,
            $scope.formName2Name.value,
            $scope.formAccountBank2Name.value,
            $scope.formAccountBank2BankName.value,
            $scope.formAccountBank2BankBranch.value,
            $scope.formAccountBank2AccountBankNumber.value,
            $scope.formBenefit2Name.value,
            $scope.formBenefit2Relationship.value,
            $scope.moveList,
            $scope.formHealthStatementAgree.options[0].checked,
            $scope.formParticipantStatementAgree.options[0].checked,
            $scope.form3IsGovernmentEmployment.value,
            $scope.form3OfficerName.value,
            $scope.form3InstitutionName.value,
            $scope.form3Position.value,
            $scope.form3Tenure.value,
            $scope.form3Country.value,
            $scope.uploadDocList,
            $scope.formToken.value
        );
        promise.then(function(args){
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
            else if(args.errorCode != 0){
                var errorMessage = $scope.globalMessage.PosDetailSaveErrorFailed;
                if(args.errorCode != 2){
                    errorMessage = $scope.globalMessage.PosDetailSaveCoreErrorFailed;
                }
                try {
                    navigator.notification.alert(
                        errorMessage,
                        function () { },
                        $scope.globalMessage.PopUpTitle,
                        $scope.globalMessage.PopUpButtonOK
                    );
                } catch(err){
                    alert(errorMessage);
                }
            } else {
                if(args.value.isTokenValid) {
                    var errorMessage = $scope.globalMessage.PosDetailFormTokenSuccess;
                    try {
                        navigator.notification.alert(
                            errorMessage,
                            function () { $scope.onClose(); },
                            $scope.globalMessage.PopUpTitle,
                            $scope.globalMessage.PopUpButtonOK
                        );
                    }
                    catch (err) { alert(errorMessage); }
                    console.log("End Submit");
                }
                else {
                    if (args.value.isTokenExpired) {
                        $scope.formToken.error = $scope.globalMessage.PosDetailErrorTokenInvalid;
                    }
                    else {
                        $scope.formToken.error = $scope.globalMessage.PosDetailErrorTokenInvalid;
                    }
                }
            }
            $scope.globalHideLoading();
        }, function(error){
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

    $scope.getSearchClick = function(){
        if($scope.validateSearch()){
            $scope.getSearch();
        }
    }

    $scope.validateSearch = function(){
        var isValid = true;

        $scope.form1NoSertificateSearch.error = $scope.stringEmpty;
        $scope.form1DobSearch.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.form1NoSertificateSearch.value)){
            $scope.form1NoSertificateSearch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form1NoSertificateSearch.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.form1DobSearch.value)){
            $scope.form1DobSearch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form1DobSearch.label);
            isValid = false;
        }

        return isValid;
    }

    $scope.getSearch = function(){
        $scope.clearCheckList();
        $scope.form1IsSearch = false;
        $scope.form1IsChecked = false;
        $scope.globalShowLoading();
        var promise = API.GetSertificateData(
            $scope.form1NoSertificateSearch.value,
            $scope.form1DobSearch.value
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
                else{
                    if(args.errorCode > 0){
                        $scope.form1IsSearch = false;
                        $scope.form1IsChecked = false;
                        try {
                            navigator.notification.alert(
                                $scope.globalMessage.PosDetailGetPolicyError,
                                function () { },
                                $scope.stringEmpty,
                                $scope.globalMessage.PopUpButtonClose
                            );
                        }
                        catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
                    } else {
                        $scope.form1Name = args.value.custName;
                        $scope.form1Dob = moment(args.value.custDob).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
                        $scope.form1Address = args.value.custAddress;
                        $scope.form1AgentCode = args.value.custAgentCode;
                        $scope.form1SertificateNumber = $scope.form1NoSertificateSearch.value;
                        $scope.productName = $scope.form1SertificateNumber + " - " + $scope.form1Name;

                        //pengkinian data
                        $scope.formUpdateDataAreaCode.value = args.value.areaCode;
                        $scope.formUpdateDataEmail.value = args.value.email;
                        $scope.formUpdateDataHomePhone.value = args.value.homePhone;
                        $scope.formUpdateDataMobilePhone.value = args.value.mobilePhone;

                        //address
                        $scope.formAddress2Address1.value = args.value.address;
                        $scope.formAddress2Address2.value = args.value.address2;
                        $scope.formAddress2RtRw.value = args.value.rtRw;
                        $scope.formAddress2Province.value = args.value.province;
                        $scope.formAddress2PostalCode.value = args.value.postalCode;
                        $scope.formAddress2District.value = args.value.district;
                        $scope.formAddress2SubDistrict.value = args.value.subDistrict;

                        //account bank
                        $scope.formAccountBank2Name.value = args.value.accountBankOwnerName;
                        $scope.formAccountBank2BankName.value = args.value.bankName;
                        $scope.formAccountBank2BankBranch.value = args.value.bankBranch;
                        $scope.formAccountBank2AccountBankNumber.value = args.value.accountBankNumber;

                        //name
                        $scope.formName2Name.value = args.value.name;

                        //relation
                        $scope.formBenefit2Name.value = args.value.relationName;
                        $scope.formBenefit2Relationship.value = args.value.relationStatus;

                        $scope.generateCity();
                        $timeout(function(){
                            $scope.formAddress2City.value = args.value.city;
                        }, $scope.timeoutClosePage);
                        $scope.form1IsSearch = true;

                        $scope.defaultModel = {
                            form1Name: args.value.custName,
                            form1Dob: moment(args.value.custDob).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin),
                            form1Address: args.value.custAddress,
                            form1AgentCode: args.value.custAgentCode,
                            form1SertificateNumber: $scope.form1NoSertificateSearch.value,
                            productName: this.form1SertificateNumber + " - " + this.form1Name,
                            formUpdateDataAreaCode: args.value.areaCode,
                            formUpdateDataEmail: args.value.email,
                            formUpdateDataHomePhone: args.value.homePhone,
                            formUpdateDataMobilePhone: args.value.mobilePhone,
                            formAddress2Address1: args.value.address,
                            formAddress2RtRw: args.value.rtRw,
                            formAddress2Province: args.value.province,
                            formAddress2PostalCode: args.value.postalCode,
                            formAddress2District: args.value.district,
                            formAddress2SubDistrict: args.value.subDistrict,
                            formAccountBank2Name: args.value.accountBankOwnerName,
                            formAccountBank2BankName: args.value.bankName,
                            formAccountBank2BankBranch: args.value.bankBranch,
                            formAccountBank2AccountBankNumber: args.value.accountBankNumber,
                            formName2Name: args.value.name,
                            formBenefit2Name: args.value.relationName,
                            formBenefit2Relationship: args.value.relationStatus,
                            formAddress2City: args.value.city,
                        };
                    }
                }
                $scope.globalHideLoading();
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
				$scope.globalHideLoading();
            }
        );
    }

    $scope.clearCheckList = function(){
        $scope.form1IsAccountBank.options[0].checked = false;
        $scope.form1IsAddress.options[0].checked = false;
        $scope.form1IsBenefit.options[0].checked = false;
        $scope.form1IsCertificate.options[0].checked = false;
        $scope.form1IsEndInsurance.options[0].checked = false;
        $scope.form1IsMaturity.options[0].checked = false;
        $scope.form1IsName.options[0].checked = false;
    }

    $scope.setDefault = function(type) {
        $scope.formUpdateDataAreaCode.value = $scope.defaultModel.formUpdateDataAreaCode;
        $scope.formUpdateDataHomePhone.value = $scope.defaultModel.formUpdateDataHomePhone;
        $scope.formUpdateDataMobilePhone.value = $scope.defaultModel.formUpdateDataMobilePhone;
        $scope.formUpdateDataEmail.value = $scope.defaultModel.formUpdateDataEmail;

        if (type == 1 || type == 5 || type == 6) {
            $scope.formAddress2Address1.value = $scope.defaultModel.formAddress2Address1;
            // formAddress2Address2
            $scope.formAddress2RtRw.value = $scope.defaultModel.formAddress2RtRw;
            $scope.formAddress2Province.value = $scope.defaultModel.formAddress2Province;
            $scope.formAddress2City.value = $scope.defaultModel.formAddress2City;
            $scope.formAddress2PostalCode.value = $scope.defaultModel.formAddress2PostalCode;
            $scope.formAddress2District.value = $scope.defaultModel.formAddress2District;
            $scope.formAddress2SubDistrict.value = $scope.defaultModel.formAddress2SubDistrict;
        }

        if (type == 2 || type == 6 || type == 7) {
            $scope.formAccountBank2Name.value = $scope.defaultModel.formAccountBank2Name;
            $scope.formAccountBank2BankName.value = $scope.defaultModel.formAccountBank2BankName;
            $scope.formAccountBank2BankBranch.value = $scope.defaultModel.formAccountBank2BankBranch;
            $scope.formAccountBank2AccountBankNumber.value = $scope.defaultModel.formAccountBank2AccountBankNumber;
        }

        if (type == 1) {
        } else if (type == 2) {
        } else if (type == 3) {
            $scope.formName2Name.value = $scope.defaultModel.formName2Name;
        } else if (type == 4) {
            $scope.formBenefit2Name.value = $scope.defaultModel.formBenefit2Name;
            $scope.formBenefit2Relationship.value = $scope.defaultModel.formBenefit2Relationship;
        } else if (type == 5) {
            $scope.formReason.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderUseFundType.value = true;
            $scope.formUseFundSurrenderName.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankName.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankBranch.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderAccountBankNumber.value = $scope.stringEmpty;
            $scope.model.useFundPage.move = [];
        } else if (type == 6) {
            $scope.formReason.value = $scope.stringEmpty;
            $scope.formHealthStatementAgree.options[0].checked = false;
            $scope.formParticipantStatementAgree.options[0].checked = false;
        } else if (type == 7) {
        }

        $scope.form3IsGovernmentEmployment.value = false;
        $scope.form3OfficerName.value = $scope.stringEmpty;
        $scope.form3InstitutionName.value = $scope.stringEmpty;
        $scope.form3Position.value = $scope.stringEmpty;
        $scope.form3Tenure.value = $scope.stringEmpty;
        $scope.form3Country.value = $scope.stringEmpty;

        $scope.uploadDocList = [];
        $scope.imgIdCardByte64 = $scope.stringEmpty;
        $scope.imgFamilyCardByte64 = $scope.stringEmpty;
        $scope.imgBirthCertificateByte64 = $scope.stringEmpty;
        $scope.imgSavingBookByte64 = $scope.stringEmpty;
        $scope.imgPaymentReceiptByte64 = $scope.stringEmpty;
        $scope.imgIdCard = $scope.stringEmpty;
        $scope.imgFamilyCard = $scope.stringEmpty;
        $scope.imgBirthCertificate = $scope.stringEmpty;
        $scope.imgSavingBook = $scope.stringEmpty;
        $scope.imgPaymentReceipt = $scope.stringEmpty;
    }

    $scope.resetField = function(currentType) {
        for (var i = 1; i <= 7; i++) {
            if (currentType != i) {
                $scope.setDefault(i);
            }
        }
    }

    $scope.setSupportingDocumentPage = function(transactionTypeList, supportDocArray) {
        $scope.transactionType = transactionTypeList.join();

        if (supportDocArray.includes("SDP001") === true) {
            $scope.pageContent.push("Ktp");
        }
        if (supportDocArray.includes("SDP002") === true) {
            $scope.pageContent.push("Kk");
        }
        if (supportDocArray.includes("SDP003") === true) {
            $scope.pageContent.push("Akte");
        }
        if (supportDocArray.includes("SDP004") === true) {
            $scope.pageContent.push("Tabungan");
        }
        if (supportDocArray.includes("SDP005") === true) {
            $scope.pageContent.push("Pembayaran");
        }
    }

    $scope.disableCheckBox = function(type){
        switch(type){
            case 1:
                // $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;

            case 2:
                $scope.form1IsAddress.options[0].checked = false;
                // $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;

            case 3:
                $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                // $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;

            case 4:
                $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                // $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;
                
            case 5:
                $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                // $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;

            case 6:
                $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                // $scope.form1IsCertificate.options[0].checked = false;
                $scope.form1IsMaturity.options[0].checked = false;
                break;

            case 7:
                $scope.form1IsAddress.options[0].checked = false;
                $scope.form1IsAccountBank.options[0].checked = false;
                $scope.form1IsName.options[0].checked = false;
                $scope.form1IsBenefit.options[0].checked = false;
                $scope.form1IsEndInsurance.options[0].checked = false;
                $scope.form1IsCertificate.options[0].checked = false;
                // $scope.form1IsMaturity.options[0].checked = false;
                break;

            default:
                break;
        }
    }

    $scope.disableUpdateData = function(type){
        switch(type){
            case 1:
                $scope.formUpdateDataAreaCode.isDisabled = false;
                $scope.formUpdateDataHomePhone.isDisabled = false;
                $scope.formUpdateDataMobilePhone.isDisabled = false;
                $scope.formUpdateDataEmail.isDisabled = false;
                $scope.formAddress2Address1.isDisabled = false;
                $scope.formAddress2Address2.isDisabled = false;
                $scope.formAddress2RtRw.isDisabled = false;
                $scope.formAddress2Province.isDisabled = false;
                $scope.formAddress2City.isDisabled = false;
                $scope.formAddress2PostalCode.isDisabled = false;
                $scope.formAddress2District.isDisabled = false;
                $scope.formAddress2SubDistrict.isDisabled = false;
                break;

            default:
                $scope.formUpdateDataAreaCode.isDisabled = true;
                $scope.formUpdateDataHomePhone.isDisabled = true;
                $scope.formUpdateDataMobilePhone.isDisabled = true;
                $scope.formUpdateDataEmail.isDisabled = true;
                $scope.formAddress2Address1.isDisabled = true;
                $scope.formAddress2Address2.isDisabled = true;
                $scope.formAddress2RtRw.isDisabled = true;
                $scope.formAddress2Province.isDisabled = true;
                $scope.formAddress2City.isDisabled = true;
                $scope.formAddress2PostalCode.isDisabled = true;
                $scope.formAddress2District.isDisabled = true;
                $scope.formAddress2SubDistrict.isDisabled = true;
                break;
        }
    }

    $scope.typeChangePOS = function(type) {
        var supportDocArray = [],
            transactionTypeList = [];

        $scope.pageContent = [];
        $scope.transactionType = $scope.stringEmpty;
        $scope.disableCheckBox(type);
        $scope.disableUpdateData(type);

        if (type == 1 && $scope.form1IsAddress.options[0].checked == false) {
            $scope.setDefault(type);
        } else if (type == 2 && $scope.form1IsAccountBank.options[0].checked == false) {
            $scope.setDefault(type);
        } else if (type == 3 && $scope.form1IsName.options[0].checked == false) {
            $scope.setDefault(type);
        } else if (type == 4 && $scope.form1IsBenefit.options[0].checked == false) {
            $scope.setDefault(type);
        }

        if ($scope.form1IsAddress.options[0].checked ||
            $scope.form1IsAccountBank.options[0].checked ||
            $scope.form1IsName.options[0].checked ||
            $scope.form1IsBenefit.options[0].checked) {

            $scope.pageContent.push('UpdateData');
    
            if ($scope.form1IsAddress.options[0].checked){
                $scope.pageContent.push('Address');
            }
    
            if ($scope.form1IsAccountBank.options[0].checked){
                $scope.pageContent.push('AccountBank');
            }
    
            if ($scope.form1IsName.options[0].checked){
                $scope.pageContent.push('Name');
            }
    
            if ($scope.form1IsBenefit.options[0].checked){
                $scope.pageContent.push('Benefit');
            }

            $scope.pageContent.push('Compliance');

            $scope.masterData.posTypeList.forEach(function(value) {
                var isSelected = false;
                if (value.posCode == "P001" && $scope.form1IsAddress.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    isSelected = true;
                } else if (value.posCode == "P002" && $scope.form1IsAccountBank.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    isSelected = true;
                } else if (value.posCode == "P003" && $scope.form1IsBenefit.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    isSelected = true;
                } else if (value.posCode == "P004" && $scope.form1IsName.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    isSelected = true;
                }

                if (isSelected) {
                    value.supportingDocumentList.forEach(function(item) {
                        if (supportDocArray.includes(item.documentCode) == false) {
                            supportDocArray.push(item.documentCode);
                        }
                    });
                }
            });

            $scope.setSupportingDocumentPage(transactionTypeList, supportDocArray);
    
            $scope.pageContent.push("Preview");
            $scope.pageContent.push("Token");
        }

        if ($scope.pageContent.length > 0) {
            $scope.form1IsChecked = true;
        } else {
            $scope.form1IsChecked = false;
        }
    }

    $scope.typeChangeEndInsurance = function(type) {
        $scope.resetField(5);
        var supportDocArray = [],
            transactionTypeList = [];

        $scope.pageContent = [];
        $scope.transactionType = $scope.stringEmpty;
        $scope.disableCheckBox(type);
        $scope.disableUpdateData(type);

        if($scope.form1IsEndInsurance.options[0].checked) {
            $scope.pageContent.push('Surrender');
            $scope.pageContent.push('ReasonSurrender');
            $scope.pageContent.push('UseFundSurrender');
            $scope.pageContent.push('Compliance');   
            
            $scope.masterData.posTypeList.forEach(function(value){
                if (value.posCode == "P005" && $scope.form1IsEndInsurance.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    value.supportingDocumentList.forEach(function(item) {
                        if (supportDocArray.includes(item.documentCode) == false) {
                            supportDocArray.push(item.documentCode);
                        }
                    });
                }
            });

            $scope.setSupportingDocumentPage(transactionTypeList, supportDocArray);
    
            $scope.pageContent.push("SurrenderReinstatementPreview");
            $scope.pageContent.push("Token");
        } else {
            $scope.setDefault(5);
        }

        if ($scope.pageContent.length > 0) {
            $scope.form1IsChecked = true;
        } else {
            $scope.form1IsChecked = false;
        }
    }

    $scope.typeChangeCertificate = function(type) {
        $scope.resetField(6);
        var supportDocArray = [],
            transactionTypeList = [];

        $scope.pageContent = [];
        $scope.transactionType = $scope.stringEmpty;
        $scope.disableCheckBox(type);
        $scope.disableUpdateData(type);

        if($scope.form1IsCertificate.options[0].checked){
            $scope.pageContent.push('Reinstatement');
            $scope.pageContent.push('ReasonReinstatement');
            $scope.pageContent.push('HealthStatement');
            $scope.pageContent.push('ParticipantStatement');
            $scope.pageContent.push('AccountBankReinstatement');
            $scope.pageContent.push('Compliance');

            $scope.masterData.posTypeList.forEach(function(value){
                if (value.posCode == "P006" && $scope.form1IsCertificate.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    value.supportingDocumentList.forEach(function(item) {
                        if (supportDocArray.includes(item.documentCode) == false) {
                            supportDocArray.push(item.documentCode);
                        }
                    });
                }
            });

            $scope.setSupportingDocumentPage(transactionTypeList, supportDocArray);
    
            $scope.pageContent.push("SurrenderReinstatementPreview");
            $scope.pageContent.push("Token");
        } else {
            $scope.setDefault(6);
        }

        if ($scope.pageContent.length > 0) {
            $scope.form1IsChecked = true;
        } else {
            $scope.form1IsChecked = false;
        }
    }

    $scope.typeChangeMaturity = function(type) {
        $scope.resetField(7);
        var supportDocArray = [],
            transactionTypeList = [];

        $scope.pageContent = [];
        $scope.transactionType = $scope.stringEmpty;
        $scope.disableCheckBox(type);
        $scope.disableUpdateData(type);

        if($scope.form1IsMaturity.options[0].checked){
            $scope.pageContent.push("Maturity");
            $scope.pageContent.push("AccountBankMaturity");

            $scope.masterData.posTypeList.forEach(function(value){
                if (value.posCode == "P007" && $scope.form1IsMaturity.options[0].checked) {
                    transactionTypeList.push(value.posCode);
                    value.supportingDocumentList.forEach(function(item) {
                        if (supportDocArray.includes(item.documentCode) == false) {
                            supportDocArray.push(item.documentCode);
                        }
                    });
                }
            });

            $scope.setSupportingDocumentPage(transactionTypeList, supportDocArray);

            $scope.pageContent.push("MaturityPreview");
            $scope.pageContent.push("Token");
        } else {
            $scope.setDefault(7);
        }

        if ($scope.pageContent.length > 0) {
            $scope.form1IsChecked = true;
        } else {
            $scope.form1IsChecked = false;
        }
    }

    $scope.validateFormUpdateData = function(){
        var isValid = true;

        $scope.formUpdateDataAreaCode.error = $scope.stringEmpty;
        $scope.formUpdateDataEmail.error = $scope.stringEmpty;
        $scope.formUpdateDataHomePhone.error = $scope.stringEmpty;
        $scope.formUpdateDataMobilePhone.error = $scope.stringEmpty;

        
        if($scope.form1IsAddress.options[0].checked){
            // if(!$scope.validateString($scope.formUpdateDataAreaCode.value)){
            //     $scope.formUpdateDataAreaCode.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataAreaCode.label);
            //     isValid = false;
            // }

            // if(!$scope.validateString($scope.formUpdateDataEmail.value)){
            //     $scope.formUpdateDataEmail.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataEmail.label);
            //     isValid = false;
            // }

            // if(!$scope.validateString($scope.formUpdateDataHomePhone.value)){
            //     $scope.formUpdateDataHomePhone.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataHomePhone.label);
            //     isValid = false;
            // }
            if(!$scope.validateString($scope.formUpdateDataMobilePhone.value)){
                $scope.formUpdateDataMobilePhone.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataMobilePhone.label);
                isValid = false;
            }
    
            if ($scope.formUpdateDataEmail.value && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.formUpdateDataEmail.value)) {
                $scope.formUpdateDataEmail.error = $scope.globalMessage.PosDetailFormAddress2ErrorEmail;
                isValid = false;
            }
        }

        return isValid;
    }

    $scope.validateFormAddress2 = function(){
        var isValid = true;

        $scope.formAddress2Address1.error = $scope.stringEmpty;
        $scope.formAddress2RtRw.error = $scope.stringEmpty;
        $scope.formAddress2Province.error = $scope.stringEmpty;
        $scope.formAddress2City.error = $scope.stringEmpty;
        $scope.formAddress2PostalCode.error = $scope.stringEmpty;
        $scope.formAddress2District.error = $scope.stringEmpty;
        $scope.formAddress2SubDistrict.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formAddress2Address1.value)){
            $scope.formAddress2Address1.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2Address1.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2RtRw.value)){
            $scope.formAddress2RtRw.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2RtRw.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2Province.value)){
            $scope.formAddress2Province.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2Province.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2City.value)){
            $scope.formAddress2City.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2City.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2PostalCode.value)){
            $scope.formAddress2PostalCode.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2PostalCode.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2District.value)){
            $scope.formAddress2District.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2District.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAddress2SubDistrict.value)){
            $scope.formAddress2SubDistrict.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2SubDistrict.label);
            isValid = false;
        }

        return isValid;
    }

    $scope.validateFormUpdateDataSurrenderReinstatement = function(){
        var isValid = true;

        $scope.formUpdateDataAreaCode.error = $scope.stringEmpty;
        $scope.formUpdateDataHomePhone.error = $scope.stringEmpty;
        $scope.formUpdateDataMobilePhone.error = $scope.stringEmpty;
        $scope.formUpdateDataEmail.error = $scope.stringEmpty;
        $scope.formAddress2Address1.error = $scope.stringEmpty;
        $scope.formAddress2RtRw.error = $scope.stringEmpty;
        $scope.formAddress2Province.error = $scope.stringEmpty;
        $scope.formAddress2City.error = $scope.stringEmpty;
        $scope.formAddress2PostalCode.error = $scope.stringEmpty;
        $scope.formAddress2District.error = $scope.stringEmpty;
        $scope.formAddress2SubDistrict.error = $scope.stringEmpty;

        // if(!$scope.validateString($scope.formUpdateDataAreaCode.value)){
        //     $scope.formUpdateDataAreaCode.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataAreaCode.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formUpdateDataHomePhone.value)){
        //     $scope.formUpdateDataHomePhone.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataHomePhone.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formUpdateDataMobilePhone.value)){
        //     $scope.formUpdateDataMobilePhone.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataMobilePhone.label);
        //     isValid = false;
        // }
        // // if(!$scope.validateString($scope.formUpdateDataEmail.value)){
        // //     $scope.formUpdateDataEmail.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUpdateDataEmail.label);
        // //     isValid = false;
        // // }
        // if(!$scope.validateString($scope.formAddress2Address1.value)){
        //     $scope.formAddress2Address1.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2Address1.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2RtRw.value)){
        //     $scope.formAddress2RtRw.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2RtRw.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2Province.value)){
        //     $scope.formAddress2Province.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2Province.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2City.value)){
        //     $scope.formAddress2City.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2City.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2PostalCode.value)){
        //     $scope.formAddress2PostalCode.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2PostalCode.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2District.value)){
        //     $scope.formAddress2District.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2District.label);
        //     isValid = false;
        // }
        // if(!$scope.validateString($scope.formAddress2SubDistrict.value)){
        //     $scope.formAddress2SubDistrict.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAddress2SubDistrict.label);
        //     isValid = false;
        // }

        // if ($scope.formUpdateDataEmail.value && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.formUpdateDataEmail.value)) {
        //     $scope.formUpdateDataEmail.error = $scope.globalMessage.PosDetailFormAddress2ErrorEmail;
        //     isValid = false;
        // }

        return isValid;
    }

    $scope.validateFormName2 = function(){
        var isValid = true;
        $scope.formName2Name.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formName2Name.value)){
            $scope.formName2Name.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formName2Name.label);
            isValid = false;
        }
        return isValid;
    }

    $scope.validateFormAccountBank2 = function(){
        var isValid = true;

        $scope.formAccountBank2Name.error = $scope.stringEmpty;
        $scope.formAccountBank2BankName.error = $scope.stringEmpty;
        $scope.formAccountBank2BankBranch.error = $scope.stringEmpty;
        $scope.formAccountBank2AccountBankNumber.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formAccountBank2Name.value)){
            $scope.formAccountBank2Name.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2Name.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2BankName.value)){
            $scope.formAccountBank2BankName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2BankName.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2BankBranch.value)){
            $scope.formAccountBank2BankBranch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2BankBranch.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2AccountBankNumber.value)){
            $scope.formAccountBank2AccountBankNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2AccountBankNumber.label);
            isValid = false;
        }
        return isValid;
    }

    $scope.validateReinstatementAccountBank = function(){
        var isValid = true;

        $scope.formAccountBank2AccountBankNumber.error = $scope.stringEmpty;
        $scope.formAccountBank2BankBranch.error = $scope.stringEmpty;
        $scope.formAccountBank2BankName.error = $scope.stringEmpty;
        $scope.formAccountBank2Name.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formAccountBank2AccountBankNumber.value)){
            $scope.formAccountBank2AccountBankNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2AccountBankNumber.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2BankBranch.value)){
            $scope.formAccountBank2BankBranch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2BankBranch.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2BankName.value)){
            $scope.formAccountBank2BankName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2BankName.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formAccountBank2Name.value)){
            $scope.formAccountBank2Name.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formAccountBank2Name.label);
            isValid = false;
        }
        
        return isValid;
    }

    $scope.validateFormUseFundAccountBank = function(){
        var isValid = true;

        if($scope.formUseFundSurrenderUseFundType.value){
            
            $scope.formUseFundSurrenderAccountBankNumber.error = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankBranch.error = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankName.error = $scope.stringEmpty;
            $scope.formUseFundSurrenderName.error = $scope.stringEmpty;
            if(!$scope.validateString($scope.formUseFundSurrenderAccountBankNumber.value)){
                $scope.formUseFundSurrenderAccountBankNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUseFundSurrenderAccountBankNumber.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.formUseFundSurrenderBankBranch.value)){
                $scope.formUseFundSurrenderBankBranch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUseFundSurrenderBankBranch.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.formUseFundSurrenderBankName.value)){
                $scope.formUseFundSurrenderBankName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUseFundSurrenderBankName.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.formUseFundSurrenderName.value)){
                $scope.formUseFundSurrenderName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formUseFundSurrenderName.label);
                isValid = false;
            }
        } else if(!$scope.formUseFundSurrenderUseFundType.value) {
            $scope.model.useFundPage.move.forEach(function(value){
                value.certificateNumber.error = $scope.stringEmpty;
                value.fundAmount.error = $scope.stringEmpty;
                value.purposeMove.error = $scope.stringEmpty;
                value.etc.error = $scope.stringEmpty;

                if(!$scope.validateString(value.certificateNumber.value)){
                    value.certificateNumber.error = $scope.globalMessage.PosDetailErrorInputEmpty.format(value.certificateNumber.label);
                    isValid = false;
                }

                if(!$scope.validateString(value.fundAmount.value)){
                    value.fundAmount.error = $scope.globalMessage.PosDetailErrorInputEmpty.format(value.fundAmount.label);
                    isValid = false;
                }

                if(!value.purposeMove.options[0].checked
                    && !value.purposeMove.options[1].checked
                    && !value.purposeMove.options[2].checked
                    && !value.purposeMove.options[3].checked
                    && !value.purposeMove.options[4].checked){
                        value.purposeMove.error = $scope.globalMessage.PosDetailErrorInputEmpty.format(value.purposeMove.label);
                        isValid = false;
                    }

                if(value.purposeMove.options[4].checked){
                    if(!$scope.validateString(value.etc.value)){
                        value.etc.error = $scope.globalMessage.PosDetailErrorInputEmpty.format(value.etc.label);
                        isValid = false;
                    }
                }
            });
        }

        

        return isValid;
    }

    $scope.validateFormBenefit2 = function(){
        var isValid = true;

        $scope.formBenefit2Name.error = $scope.stringEmpty;
        $scope.formBenefit2Relationship.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formBenefit2Name.value)){
            $scope.formBenefit2Name.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formBenefit2Name.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formBenefit2Relationship.value)){
            $scope.formBenefit2Relationship.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formBenefit2Relationship.label);
            isValid = false;
        }
        return isValid;
    }

    $scope.validateForm3 = function(){
        var isValid = true;

        $scope.form3IsGovernmentEmployment.error = $scope.stringEmpty;
        $scope.form3OfficerName.error = $scope.stringEmpty;
        $scope.form3InstitutionName.error = $scope.stringEmpty;
        $scope.form3Position.error = $scope.stringEmpty;
        $scope.form3Tenure.error = $scope.stringEmpty;
        $scope.form3Country.error = $scope.stringEmpty;

        if($scope.form3IsGovernmentEmployment.value){
            if(!$scope.validateString($scope.form3OfficerName.value)){
                $scope.form3OfficerName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form3OfficerName.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.form3InstitutionName.value)){
                $scope.form3InstitutionName.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form3InstitutionName.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.form3Position.value)){
                $scope.form3Position.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form3Position.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.form3Tenure.value)){
                $scope.form3Tenure.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form3Tenure.label);
                isValid = false;
            }

            if(!$scope.validateString($scope.form3Country.value)){
                $scope.form3Country.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.form3Country.label);
                isValid = false;
            }
        }

        return isValid;
    }

    $scope.validateFormReason = function(){
        var isValid =  true;

        $scope.formReason.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formReason.value)){
            $scope.formReason.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formReason.label);
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
    
    $scope.formAddress2Province_OnChange = function(){
        $timeout( function() {
            $scope.generateCity();
        }, $scope.timeoutOpenPage );
    }

    $scope.generateCity = function(){
        $scope.formAddress2City.value = $scope.stringEmpty;
        $scope.formAddress2City.options = [];

		if ($scope.masterData != null &&
			$scope.masterData.cityList != null ) {
			$scope.masterData.cityList.forEach(function(value) {
				if (value.provinceCode == $scope.formAddress2Province.value) {
					$scope.formAddress2City.options.push({ text: value.cityDescription, value: value.cityCode });
                }
			});
		}
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
                    case 'Ktp':
                        $scope.imgIdCardByte64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            id: "",
                            docFile: $scope.imgIdCardByte64,
                            docType: "SDP001"
                        });
                        break;

                    case 'Kk':
                        $scope.imgFamilyCardByte64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            id: "",
                            docFile: $scope.imgFamilyCardByte64,
                            docType: "SDP002"
                        });
                        break;

                    case 'Akte':
                        $scope.imgBirthCertificateByte64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            id: "",
                            docFile: $scope.imgBirthCertificateByte64,
                            docType: "SDP003"
                        });
                        break;

                    case 'Tabungan':
                        $scope.imgSavingBookByte64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            id: "",
                            docFile: $scope.imgSavingBookByte64,
                            docType: "SDP004"
                        });
                        break;

                    case 'Pembayaran':
                        $scope.imgPaymentReceiptByte64 = c.toDataURL("image/jpeg").split(',')[1];
                        $scope.uploadDocList.push({
                            id: "",
                            docFile: $scope.imgPaymentReceiptByte64,
                            docType: "SDP005"
                        });
                        break;

                    default:
                        break;
                }
				
            };
            img.src=imageUri;
			switch($scope.contentState)
                {
                    case 'Ktp':
                        $scope.imgIdCard = imageUri;
                        break;

                    case 'Kk':
                        $scope.imgFamilyCard = imageUri;
                        break;

                    case 'Akte':
                        $scope.imgBirthCertificate = imageUri;
                        break;

                    case 'Tabungan':
                        $scope.imgSavingBook = imageUri;
                        break;

                    case 'Pembayaran':
                        $scope.imgPaymentReceipt = imageUri;
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

    $scope.formUpdateDataEmail_OnBlur = function(){
        if($scope.formUpdateDataEmail){
            $scope.formUpdateDataEmail.error = $scope.stringEmpty;
            if($scope.formUpdateDataEmail.value && !/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test($scope.formUpdateDataEmail.value)){
                $scope.formUpdateDataEmail.error = $scope.globalMessage.PosDetailFormUpdateDataErrorEmail;
            }
        }
    }

    $scope.addUseFund = function(){
        $scope.counter++;
        $scope.model.useFundPage.move.push({
            certificateNumber: {
                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelCertificateNumber,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
            },
            fundAmount: {
                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFundAmount,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
            },
            purposeMove: {
                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelPurposeUse,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
                options: [
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFirstPayment, value: $scope.stringEmpty},
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelTopUp, value: $scope.stringEmpty},
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelRenewal, value: $scope.stringEmpty},
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelLoanPayment, value: $scope.stringEmpty},
                    {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtc, value: $scope.stringEmpty}
                ]
            },
            etc: {
                label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtces,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty
            }
        });
    }

    $scope.removeUseFund = function(index){
        $scope.counter--;
        $scope.model.useFundPage.move.splice(index, 1);
    }

    $scope.setNavigatonType = function () {
		// if ($scope.pageContentIndex >= 1)
		// 	$scope.navBarTop.type = 6;
		// else
			$scope.navBarTop.type = 5;
    }
    
    $scope.form3IsGovernmentEmployment_OnChange = function(){
        if(!$scope.form3IsGovernmentEmployment.value){
            $scope.form3Country.value = "ID";
            $scope.form3InstitutionName.value = $scope.stringEmpty;
            $scope.form3OfficerName.value = $scope.stringEmpty;
            $scope.form3Position.value = $scope.stringEmpty;
            $scope.form3Tenure.value = $scope.stringEmpty;
        }
    }

    $scope.formUseFundSurrenderUseFundType_OnChange = function(){
        if($scope.formUseFundSurrenderUseFundType.value){
            $scope.model.useFundPage.move = [
                {
                    certificateNumber: {
                        label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelCertificateNumber,
                        error: $scope.stringEmpty,
                        value: $scope.stringEmpty,
                    },
                    fundAmount: {
                        label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFundAmount,
                        error: $scope.stringEmpty,
                        value: $scope.stringEmpty,
                    },
                    purposeMove: {
                        label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelPurposeUse,
                        error: $scope.stringEmpty,
                        value: $scope.stringEmpty,
                        options: [
                            {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelFirstPayment, value: 0},
                            {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelTopUp, value: 1},
                            {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelRenewal, value: 2},
                            {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelLoanPayment, value: 3},
                            {text: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtc, value: 4}
                        ]
                    },
                    etc: {
                        label: $scope.globalMessage.PosDetailFormUseFundSurrenderLabelEtces,
                        error: $scope.stringEmpty,
                        value: $scope.stringEmpty
                    }
                }
            ]
        } else if(!$scope.formUseFundSurrenderUseFundType.value){
            $scope.formUseFundSurrenderAccountBankNumber.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankBranch.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderBankName.value = $scope.stringEmpty;
            $scope.formUseFundSurrenderName.value = $scope.stringEmpty;
        }
    }

    $scope.purposeMove_OnChange = function(index){
        if(!$scope.model.useFundPage.move[index].purposeMove.options[4].checked){
            $scope.model.useFundPage.move[index].etc.value = $scope.stringEmpty;
        }
    }

});