rootApp
.directive('eContractPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/eContract/eContract.html'
	};
})
.controller('eContractPageController', function($scope, $timeout, $sce, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.EContractPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.confirmStatus = $scope.stringEmpty;
	$scope.confirmDisabled = 'disabled';

	$scope.$on('showEContractPage', function (event, args) {
		$scope.getEContract();
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
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
		$scope.$emit('goToHomePage');
	}

	$scope.trustAsHtml = function(param) {
		return $sce.trustAsHtml(param);
	}

	$scope.onConfirmClick = function() {
		if($scope.confirmStatus) {
			$scope.confirmDisabled = $scope.stringEmpty;
		}
		else {
			$scope.confirmDisabled = 'disabled';
		}
	}

	$scope.confirmClick = function() {
		$scope.globalShowLoading();
		var promise = API.AgreeContract();
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
			else if (response.errorCode == 1 || response.errorCode == 2 || response.errorCode == 3) {
				var msg = (response.errorCode == 1) ? $scope.globalMessage.EContractErrorNotPassedTraining : $scope.globalMessage.LoginErrorOther;
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
			else{
				$scope.pageClass = $scope.stringEmpty;
				$timeout( function(){
					$scope.isShow = false;
				}, $scope.timeoutClosePage );
				$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
				$scope.pageIndex = 0;
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

	$scope.getEContract = function(){
		$scope.globalShowLoading();
		var promise = API.GetEContract();
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
			else if (response.errorCode == 1 || response.errorCode == 2) {
				var msg = (response.errorCode == 1) ? $scope.globalMessage.EContractErrorNotPassedTraining : $scope.globalMessage.LoginErrorOther;
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
			else{
				$scope.globalMessage.EContractPageMessage = response.errorMessage;
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
});
