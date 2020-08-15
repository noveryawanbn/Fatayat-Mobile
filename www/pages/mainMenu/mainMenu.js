var check;
rootApp
.directive('mainMenuPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/mainMenu/mainMenu.html'
	};
})
.controller('mainMenuPageController', function($scope, $timeout, API) {
	check = $scope;
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 2,
		title: '<img class="nav-bar-top-directive-logo" src="img/logo-full.png" />',
		right1: '<i class="fa fa-fw fa-2 fa-bars"></i>',
		onRight1Click: function () { $scope.menuClick(); }
	};
	$scope.barDownLeftClass = 'active';
	$scope.barDownRightClass = $scope.stringEmpty;
	$scope.menuContent2Class = $scope.stringEmpty;

	$scope.$on('showMainMenuPage', function (event, args) {
		$scope.notificationList = [];
		$scope.unreadNotification = 0;
		$scope.eStatementList = [];
		$scope.unreadEStatement = 0;
		$scope.isShow = true;
		$scope.passTrainingProduct = $scope.globalData.TrainingProductStatus;
		$scope.passTrainingAml = $scope.globalData.TrainingAMLStatus;

		$scope.isFromStaging = args.isFromStaging;

		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.CheckEContract();
			$scope.barDownLeftClass = 'active';
			$scope.barDownRightClass = $scope.stringEmpty;
			$scope.menuContent2Class = $scope.stringEmpty;
			$scope.notificationList = [];
			$scope.eStatementList = [];
			$scope.unreadNotification = 0;
			$scope.isMenuVisible = false;
			$scope.isContactUsVisible = false;
			$scope.navBarDownClick(0);
			$scope.checkNotification();
			$scope.checkEStatement();
			
			//TODO:

			$scope.checkRanking();
				// panggil API buat ambil ranking yang login
				// contohnya di Structure
				// defaul tombol DASBOR dan Reassign hide
				// jika NSH / ABDB = tombol DASBOR dan Reassign muncul
				// Other rank = hide
			if ($scope.globalData.IsPasswordExpiring) {
				try {
					navigator.notification.alert(
						$scope.globalMessage.MainMenuPopUpPasswordExpiring.format(moment($scope.globalData.PasswordExpiredDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin)),
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.MainMenuPopUpPasswordExpiring.format(moment($scope.globalData.PasswordExpiredDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin))); }
			}

			if($scope.passTrainingAml != 'Y' || $scope.passTrainingProduct != 'Y'){
				$scope.$broadcast('showTrainingPage', { pageIndex : $scope.pageIndex + 1 , isFromStaging: args.isFromStaging });
			}
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if($scope.pageIndex == args.pageIndex && args.isForce) {
			$scope.onClose();
		}
		else if ($scope.pageIndex == args.pageIndex && $scope.menuContent2Class == 'active') {
			$scope.navBarDownClick(0);
		}
		else if($scope.pageIndex == args.pageIndex) {
			$scope.signOutClick();
		}
	});

	$scope.checkRanking = function(){
		$scope.globalData.Rank = $scope.stringEmpty;
		if ($scope.isShow) {
			var promise = API.UserRank();
			promise.then(function(result){
				if (result.errorCode == -1) {
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
					if(result.errorCode > 0){
						try {
							navigator.notification.alert(
								$scope.globalMessage.PosDetailSaveCoreErrorFailed,
								function () { },
								$scope.stringEmpty,
								$scope.globalMessage.PopUpButtonClose
							);
						} catch (err) {
							alert ($scope.globalMessage.ApplicationUserExpired);
						}
					} else {
						if(result.value != null){
							$scope.globalData.Rank = result.value.rank ? result.value.rank : $scope.stringEmpty;
						}
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
			});
		}
	}

	$scope.CheckEContract = function(){
		if (
			$scope.globalData.TrainingProductStatus == "Y" &&
			$scope.globalData.TrainingAMLStatus == "Y" &&
			$scope.globalData.EContractStatus == false &&
			$scope.globalData.Rank != 'NSH' &&
			$scope.globalData.Rank != 'AM') {
			$scope.$broadcast('showEContractPage', { pageIndex: $scope.pageIndex + 1 });
		}
	}

	$scope.onClose = function() {
		$scope.pageClass = $scope.stringEmpty;
		$timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
	}

	$scope.sortNotification = function(notification){
		return parseInt(notification.id);
	};

	$scope.navBarDownClick = function(parm) {
		if(parm == 0) {
			$scope.barDownLeftClass = 'active';
			$scope.barDownRightClass = $scope.stringEmpty;
			$scope.menuContent2Class = $scope.stringEmpty;
		}
		else if(parm == 1) {
			$scope.barDownLeftClass = $scope.stringEmpty;
			$scope.barDownRightClass = 'active';
			$scope.menuContent2Class = 'active';
		}
	}

	$scope.signOutClick = function() {
		navigator.notification.confirm(
			$scope.globalMessage.ApplicationExit,
			function(parm) {
				if(parm == 1) {
					$scope.$emit('goToHomePage');
			        if (!$scope.$$phase) $scope.$apply();
				}
			},
			'Pesan',
			['Ya', 'Tidak']
		)
	}

	$scope.checkNotification = function() {
		if ($scope.isShow) {
			var promise = API.NotificationGet();
			promise.then(function (result) {
				if (result.errorCode == -1) {
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
					var values = result.value;
					for (var i = 0; i < (values != undefined && values != null ? values.length : 0); i++) {
						var isInsert = true;
						for (var j = 0; j < $scope.notificationList.length; j++) {
							if (values[i].notificationId == $scope.notificationList[j].id) {
								isInsert = false;
								break;
							}
						}
						if (isInsert) {
							$scope.notificationList.push({
								id: values[i].notificationId,
								topLeft: values[i].title,
								topRight: moment(values[i].notificationDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin),
								message: values[i].content,
								isUnread: !values[i].isRead
							});
						}
					}
	
					$scope.unreadNotification = 0;
					for (var i = 0; i < $scope.notificationList.length; i++) {
						if ($scope.notificationList[i].isUnread) {
							$scope.unreadNotification++;
						}
					}
				}
				$timeout(function () {
					$scope.checkNotification();
				}, $scope.globalCheckNotificationTimeout);
			},
			function (error) {
				$timeout(function () {
					$scope.checkNotification();
				}, $scope.globalCheckNotificationTimeout);
			});
		}
	}

	$scope.checkEStatement = function () {
		if ($scope.isShow) {
			var promise = API.InboxGet();
			promise.then(function (result) {
				if (result.errorCode == -1) {
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
					var values = result.value;
					for (var i = 0; i < (values != undefined && values != null ? values.length : 0); i++) {
						var isInsert = true;
						for (var j = 0; j < $scope.eStatementList.length; j++) {
							if (values[i].inboxId == $scope.eStatementList[j].id) {
								isInsert = false;
								break;
							}
						}
						if (isInsert) {
							$scope.eStatementList.push({
								id: values[i].inboxId,
								title: values[i].title,
								message: values[i].content,
								date: moment(values[i].inboxDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin),
								linkUrl: values[i].documentPath.startsWith("Document/") ?
									API.APIUrl + values[i].documentPath :
									values[i].documentPath.startsWith("tpam/") ?
									API.APIUrl + "file/" + values[i].documentPath :
									API.APIUrl + "file/get/" + values[i].documentPath,
								fileName: values[i].documentPath.replace('Document/', $scope.stringEmpty),
								fileType: 'pdf',
								isUnread: !values[i].isRead
							});
						}
					}

					$scope.unreadEStatement = 0;
					for (var i = 0; i < $scope.eStatementList.length; i++) {
						if ($scope.eStatementList[i].isUnread) {
							$scope.unreadEStatement++;
						}
					}
				}
				$timeout(function () {
					$scope.checkEStatement();
				}, $scope.globalCheckNotificationTimeout);
			},
			function (error) {
				$timeout(function () {
					$scope.checkEStatement();
				}, $scope.globalCheckNotificationTimeout);
			});
		}
	}

	$scope.userSuspendAlert = function(){
		try {
			navigator.notification.alert(
				$scope.globalMessage.SuspendWarningMessage,
				function () { },
				$scope.globalMessage.PopUpTitle,
				$scope.globalMessage.PopUpButtonOK
			);
		}
		catch (err) { alert($scope.globalMessage.SuspendWarningMessage); }
	}

	$scope.trainingClick = function() {
		if($scope.globalData.UserSuspend == null || $scope.globalData.UserSuspend == 'F'){
			$scope.globalShowLoading();
			$scope.$broadcast('showTrainingPage', { pageIndex : $scope.pageIndex + 1 });
		}
		else{
			$scope.userSuspendAlert();
		}
	}

	$scope.customerClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showCustomerPage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.libraryClick = function () {
		if($scope.globalData.UserSuspend == null || $scope.globalData.UserSuspend == 'F'){
			$scope.globalShowLoading();
			$scope.$broadcast('showLibraryCategoryPage', { pageIndex : $scope.pageIndex + 1 });
		}
		else{
			$scope.userSuspendAlert();
		}
	}

	$scope.eStatementClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showEStatementPage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.changePasswordClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showChangePasswordPage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.onNotificationClick = function(parm) {
		for(var i = 0; i < $scope.notificationList.length; i++) {
			if ($scope.notificationList[i].id == parm && $scope.notificationList[i].isUnread) {
				$scope.notificationList[i].isUnread = false;
				$scope.unreadNotification--;
				API.NotificationRead($scope.notificationList[i].id).then(function (result) {
					if (result.errorCode == -1) {
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
				});
				break;
			}
		}
		$scope.$broadcast('showNotificationDetailPage', { pageIndex : $scope.pageIndex + 1, parm : parm });
	}

	$scope.menuClick = function() {
		$scope.isMenuVisible = !$scope.isMenuVisible;
	}

	$scope.menuWrapperClick = function() {
		$scope.isMenuVisible = false;
	}

	$scope.profileClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showProfilePage', { pageIndex : $scope.pageIndex + 1, isFromStaging: $scope.isFromStaging });
	}

	$scope.structureClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showStructurePage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.contactUsClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showContactUsPage', {pageIndex : $scope.pageIndex + 1});
	}

	$scope.posClick = function(){
		$scope.globalShowLoading();
		$scope.$broadcast('showPosPage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.dashboardClick = function(){
		$scope.globalShowLoading();
		$scope.$broadcast('showDashboardPage', { pageIndex : $scope.pageIndex + 1 })
	}

	$scope.claimClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showClaimPage', { pageIndex : $scope.pageIndex + 1 });
	}

	$scope.reassignClick = function(){
		$scope.globalShowLoading();
		$scope.$broadcast('showReassignPage', { pageIndex : $scope.pageIndex + 1 });
	}
});
