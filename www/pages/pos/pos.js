rootApp
.directive('posPage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/pos/pos.html'
    };
})
.controller('posPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
        type: 5,
        title: $scope.globalMessage.PosPageTitle,
        left: '<i class="fa fa-fw fa-angle-left"></i>',
        onLeftClick: function (){ $scope.onClose(); }
    };

    $scope.$on('showPosPage', function(event, args){
        $scope.isShow = true;
        $timeout(function(){
            $scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage);
        $scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex })

        $timeout(function (){
			$scope.tab = ['active', $scope.stringEmpty, $scope.stringEmpty];            
            $scope.onLoadNext = false;
            $scope.index = 0;
            $scope.posList = [];
            $scope.posAllCertificateList = [];

            $scope.formOtherCertificateSearch = {
                label: $scope.globalMessage.PosLabelSertificateNumber,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
                type: 'tel'
            }

            $scope.formOtherCertificateDobSearch = {
                value: $scope.stringEmpty,
				label: $scope.globalMessage.PosLabelDob,
				type: 'date',
				error: $scope.stringEmpty,
				options: []
            }

            $scope.formStatus = {
                value: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosSearchStatus, value: $scope.stringEmpty}
                ]
            }

            $scope.formChangeType = {
                value: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.PosSearchChangeType, value: $scope.stringEmpty}
                ]
            }

            $scope.formSearch = {
                label: $scope.globalMessage.PosSearchText,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
                type: 'text'
            }
            $scope.page = 0;
            $scope.minYear = 1950;
            $scope.maxYear = new Date().getFullYear() - 10;

            $timeout(function(){
                $scope.getPosHeader();
            }, $scope.timeoutClosePage);
        }, $scope.timeoutOpenPage);
    });

    $scope.changeTab = function(param){
        $scope.tab[0] = $scope.stringEmpty;
        $scope.tab[1] = $scope.stringEmpty;
        $scope.tab[param] = 'active';
    }

    $scope.$on('closePage', function(event, args){
        if($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
    });

    $scope.onClose = function(){
        $scope.pageClass = $scope.stringEmpty;
        $timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
    }

    $scope.replacePosType = function(posType){
        return posType
            .replace("20", $scope.globalMessage.PosDetailForm1RadioAddress)
            .replace("21", $scope.globalMessage.PosDetailForm1RadioAccountBankNumber)
            .replace("11", $scope.globalMessage.PosDetailForm1RadioBenefitReceive)
            .replace("08", $scope.globalMessage.PosDetailForm1RadioName)
            .replace("13", $scope.globalMessage.PosDetailForm1RadioEndInsurance)
            .replace("50", $scope.globalMessage.PosDetailForm1RadioSertificate)
            .replace("25", $scope.globalMessage.PosDetailForm1RadioMaturity)
    }

    $scope.getPos = function(parm){
        $scope.globalShowLoading();
        var promise = API.GetPosList($scope.formStatus.value, $scope.formChangeType.value, $scope.formSearch.value, $scope.index);
        promise.then(
            function(args){
                if(args.errorCode == -1){
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
                    if(args.value.length > 0){
                        $scope.index = $scope.index + 1;
                    } else {
                        if(parm && parm.isFromSearch){
                            try{
                                navigator.notification.alert(
                                    $scope.globalMessage.PosPopUpNoDataFound,
                                    function(){},
                                    $scope.globalMessage.PopUpTitle,
                                    $scope.globalMessage.PopUpButtonOK
                                );
                            }
                            catch (err) { alert($scope.globalMessage.PosPopUpNoDataFound); }
                        }
                    }
                    args.value.forEach(function(value){
                        var message = '<table>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelStatus + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.status + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelSertificateNumber + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.sertificateNumber + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelName + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.name + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelApplicationDate + '</td>' +
                            '<td>:</td>' +
                            '<td>' +  moment(value.applicationDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelChangeType + '</td>' +
                            '<td>:</td>' +
                            '<td>' + $scope.replacePosType(value.changeType) + '</td>' +
                        '</tr>';
                        if (value.payAmount > 0 || value.changeType == '50' || value.changeType == 'Pemulihan Sertifikat') {
                            message = message + '<tr>' +
                                '<td>' + $scope.globalMessage.PosLabelPayAmount + '</td>' +
                                '<td>:</td>' +
                                '<td>' + $scope.globalMessage.PosCurrency.format(value.payAmount.toLocaleString().replaceAll(',', '.')) + '</td>' +
                            '</tr>';
                        }
                        message = message + '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelNote + '</td>' +
                            '<td>:</td>' +
                            '<td>'; 
                        if(value.note == null){
                            message += '-';
                        } else {
                            message += value.note;
                        }    
                        
                        message += '</td>' +
                        '</tr>';
                        
                        message = message + '<tr style="visibility:hidden">' +
                                '<td>' + $scope.globalMessage.PosLabelPayAmount + '</td>' +
                                '<td>:</td>' +
                                '<td></td>' +
                            '</tr>' +
                        '</table>';
                        $scope.posList.push({
                            id: value.id,
                            status: value.status,
                            certificateNo: value.sertificateNumber,
                            name: value.name,
                            applicationDate: value.applicationDate,
                            changeType: value.changeType,
                            payAmount: value.payAmount,
                            note: value.note,
                            message: message
                        });
                    });
    
                    $scope.onLoadNext = false;
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
                $scope.globalHideLoading();
                $scope.onClose();
            }
        );
    }

    $scope.getPosAllCertificateSearch = function(){
        $scope.posAllCertificateList = [];

        if($scope.validateCertificateSearch()){
            $scope.getPosAllCertificate();
        }
    }

    $scope.validateCertificateSearch = function(){
        var isValid = true;

        $scope.formOtherCertificateSearch.error = $scope.stringEmpty;
        $scope.formOtherCertificateDobSearch.error = $scope.stringEmpty;

        if(!$scope.validateString($scope.formOtherCertificateSearch.value)){
            $scope.formOtherCertificateSearch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formOtherCertificateSearch.label);
            isValid = false;
        }

        if(!$scope.validateString($scope.formOtherCertificateDobSearch.value)){
            $scope.formOtherCertificateDobSearch.error = $scope.globalMessage.PosDetailErrorInputEmpty.format($scope.formOtherCertificateDobSearch.label);
            isValid = false;
        }

        return isValid;
    }

    $scope.getPosAllCertificate = function(){
        $scope.globalShowLoading();
        var promise = API.GetPosAllCertificateList($scope.formOtherCertificateSearch.value, $scope.formOtherCertificateDobSearch.value);
        promise.then(
            function(args){
                if(args.errorCode == -1){
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
                    if(args.value.length < 1){
                        try{
                            navigator.notification.alert(
                                $scope.globalMessage.PosPopUpNoDataFound,
                                function(){},
                                $scope.globalMessage.PopUpTitle,
                                $scope.globalMessage.PopUpButtonOK
                            );
                        } catch (err) { alert($scope.globalMessage.PosPopUpNoDataFound); }
                    }
                    args.value.forEach(function(value){
                        var message = '<table>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelStatus + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.status + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelSertificateNumber + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.sertificateNumber + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelName + '</td>' +
                            '<td>:</td>' +
                            '<td>' + value.name + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelApplicationDate + '</td>' +
                            '<td>:</td>' +
                            '<td>' +  moment(value.applicationDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelChangeType + '</td>' +
                            '<td>:</td>' +
                            '<td>' + $scope.replacePosType(value.changeType) + '</td>' +
                        '</tr>';
                        if (value.payAmount > 0 || value.changeType == '50' || value.changeType == 'Pemulihan Sertifikat') {
                            message = message + '<tr>' +
                                '<td>' + $scope.globalMessage.PosLabelPayAmount + '</td>' +
                                '<td>:</td>' +
                                '<td>' + $scope.globalMessage.PosCurrency.format(value.payAmount.toLocaleString().replaceAll(',', '.')) + '</td>' +
                            '</tr>';
                        }
                        message = message + '<tr>' +
                            '<td>' + $scope.globalMessage.PosLabelNote + '</td>' +
                            '<td>:</td>' +
                            '<td>'; 
                        if(value.note == ""){
                            message += '-';
                        } else {
                            message += value.note;
                        }    
                        
                        message += '</td>' +
                        '</tr>';
                        
                        message = message + '<tr style="visibility:hidden">' +
                                '<td>' + $scope.globalMessage.PosLabelPayAmount + '</td>' +
                                '<td>:</td>' +
                                '<td></td>' +
                            '</tr>' +
                        '</table>';
                        $scope.posAllCertificateList.push({
                            id: value.id,
                            status: value.status,
                            certificateNo: value.sertificateNumber,
                            name: value.name,
                            applicationDate: value.applicationDate,
                            changeType: value.changeType,
                            payAmount: value.payAmount,
                            note: value.note,
                            message: message
                        });
                    });

                    $scope.globalHideLoading();
                }
            }, function(error) {
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

    $scope.getPosList = function(){
        $scope.index = 0;
        $scope.posList = [];
        $scope.formStatus.value = $scope.stringEmpty;
        $scope.formSearch.value = $scope.stringEmpty;
        $scope.formChangeType.value = $scope.stringEmpty;
        $scope.getPos();
    }

    $scope.getPosSearch = function(){
        $scope.index = 0;
        $scope.posList = [];
        $scope.getPos({isFromSearch: true});
    }

    $scope.getPosNext = function(){
        if(!$scope.onLoadNext){
            $scope.onLoadNext = true;
            $scope.globalShowLoading();
            $timeout(function(){
                $scope.getPos();
            }, 1500);
        }
    }

    $scope.addPosClick = function(){
        $scope.globalShowLoading();
        var checkStatusPromise = API.GetCurrentPosStatus();
        checkStatusPromise.then(function (args){
            if(args.errorCode == -1){
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
            else if(args.value.allowCreate == true){
                
                $timeout(function(){
                    $scope.$broadcast('showPosDetailPage', { pageIndex: $scope.pageIndex + 1, posData: {id: ""} });
                }, $scope.timeoutOpenPage);
            }
            else{
                //TODO: Verification for add more POS
            }
        },
        function(error){
            try{
                navigator.notification.alert(
                    $scope.globalMessage.ApplicationErrorConnectionFailed,
                    function () { },
                    $scope.globalMessage.PopUpTitle,
                    $scope.globalMessage.PopUpButtonOK
                );
            }
            catch(err){alert($scope.globalMessage.ApplicationErrorConnectionFailed);}
            $scope.globalHideLoading();
        });
    }

    $scope.getPosHeader = function(){
        $scope.formStatus.options = [{text: '--Pilih Status--', value: $scope.stringEmpty}];
        $scope.formChangeType.options = [{text: '--Pilih Jenis Perubahan--', value: $scope.stringEmpty}];
        $scope.globalShowLoading();
        var getPosHeader = API.GetPosHeader();
        getPosHeader.then(function(args){
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
                args.value.statusList.forEach(function(value){
                    $scope.formStatus.options.push({
                        text: value.status,
                        value: value.status
                    });
                });

                args.value.changeTypeList.forEach(function(value){
                    $scope.formChangeType.options.push({
                        text: value.changeType,
                        value: value.changeType
                    });
                });
                $timeout(function(){
                    $scope.getPosList();
                }, $scope.timeoutClosePage);
            }
        }, function(error){
            try{
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
        });
    }

    $scope.posListClick = function(pos){
        // //TODO:
        // Status A = draft
        // Status B = submit
        // Status C = pending
        // Status D = complete
        // switch(pos.status){

        //     case "Draft":
        //         $scope.draftPosDirect(pos);
        //         break;

        //     case "Status B":
        //         break;

        //     case "Pending":
        //         $scope.updatePOS(pos);
        //         break;

        //     case "Status D":
        //         break;

        //     default:
        //         break;
        // }

    }

    $scope.draftPosDirect = function(pos){
        try {
            navigator.notification.confirm (
				$scope.globalMessage.PosDraftPopUpUpdatePos,
				function (parm) {
					if (parm == 1) {
						$scope.$broadcast('showPosDetailPage', { pageIndex: $scope.pageIndex + 1, posData: pos });
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
        } catch(err) {
            if (confirm($scope.globalMessage.PosDraftPopUpUpdatePos)) {
                $scope.$broadcast('showPosDetailPage', { pageIndex: $scope.pageIndex + 1, posData: pos });
            }
        }
    }

    $scope.updatePOS = function(pos) {
        try {
			navigator.notification.confirm (
				$scope.globalMessage.PosUpdatePopUpUpdatePos,
				function (parm) {
					if (parm == 1) {
						$scope.$broadcast('showPosUpdatePage', { pageIndex: $scope.pageIndex + 1, posData: pos });
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
		}
		catch (err) {
            if (confirm($scope.globalMessage.PosUpdatePopUpUpdatePos)) {
                $scope.$broadcast('showPosUpdatePage', { pageIndex: $scope.pageIndex + 1, posData: pos });
            }
        }
    }

    $scope.validateString = function (parm) {
		if (parm == undefined || parm == null || parm == $scope.stringEmpty)
			return false;
		else
			return true;
    }

    $scope.$on('refreshPosList', function(event, args){
        $timeout(function(){
            $scope.getPosList();
            console.log("refresh pos");
        },2000);
    });
});