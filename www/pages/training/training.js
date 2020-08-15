rootApp
.directive('trainingPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/training/training.html'
	};
})
.controller('trainingPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;
	$scope.isFromStaging = false;
	
	$scope.navBarTop = {
		type: 5,
		title: 'PELATIHAN',
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		// onLeftClick: function () { $scope.onClose(); }
		onLeftClick: function () { $scope.validateClose(); }
	};
	$scope.barTopLeftClass = 'active';
	$scope.barTopRightClass = $scope.stringEmpty;
	$scope.menuContent2Class = $scope.stringEmpty;
	$scope.productPreTest = $scope.globalMessage.TrainingButtonStart;
	$scope.productPreTestDisabled = $scope.stringEmpty;
	$scope.productMaterial = $scope.globalMessage.TrainingButtonStart;
	$scope.productMaterialDisabled = 'disabled';
	$scope.productPostTest = $scope.globalMessage.TrainingButtonStart;
	$scope.productPostTestDisabled = 'disabled';
	$scope.amlMaterial = $scope.globalMessage.TrainingButtonStart;
	$scope.amlMaterialDisabled = 'disabled';
	$scope.amlPostTest = $scope.globalMessage.TrainingButtonStart;
	$scope.amlPostTestDisabled = 'disabled';
	$scope.statusForProduct = "-";
	$scope.statusForAml = "-";
	$scope.isTrainingLogOut = false;

	$scope.$on('showTrainingPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
			$scope.pageClass = "active";
		}, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.isFromStaging = args.isFromStaging;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		// GET TRAINING STATUS
		$scope.GetTrainingStatus();
	});

	$scope.GetTrainingStatus = function(){
		$scope.globalShowLoading();
		var promise = API.GetTrainingStatus();
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
				try {
					navigator.notification.alert(
						$scope.globalMessage.TrainingErrorOther,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.TrainingErrorOther); }
			}
			else{
				if(response.value != null){
					$scope.globalData.TrainingProductStatus = (response.value.productTrainingStatus) ? "Y" : "N";
					$scope.globalData.TrainingAMLStatus = (response.value.amlTrainingStatus) ? "Y" : "N";

					$scope.statusForProduct = response.value.statusForProduct;
					$scope.statusForAml = response.value.statusForAml;

					$scope.productPreTest = (!response.value.isPassPreTest && !response.value.productTrainingStatus) ? $scope.globalMessage.TrainingButtonStart : $scope.globalMessage.TrainingButtonDone;
					$scope.productPreTestDisabled = (!response.value.isPassPreTest && !response.value.productTrainingStatus) ? $scope.stringEmpty : 'disabled';

					$scope.productMaterialDisabled = (response.value.isPassPreTest || response.value.productTrainingStatus) ? $scope.stringEmpty : 'disabled';

					$scope.productPostTest = (!response.value.productTrainingStatus) ? $scope.globalMessage.TrainingButtonStart : $scope.globalMessage.TrainingButtonDone;
					$scope.productPostTestDisabled = (response.value.isPassPreTest && !response.value.productTrainingStatus) ? $scope.stringEmpty : 'disabled';

					$scope.amlMaterialDisabled = (response.value.productTrainingStatus) ? $scope.stringEmpty : 'disabled';

					$scope.amlPostTest = (!response.value.amlTrainingStatus) ? $scope.globalMessage.TrainingButtonStart : $scope.globalMessage.TrainingButtonDone;
					$scope.amlPostTestDisabled = (response.value.productTrainingStatus && !response.value.amlTrainingStatus) ? $scope.stringEmpty : 'disabled';

					$scope.showRefreshmentTestButton = response.value.showRefreshmentTestButton;
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
			$scope.onClose();
			$scope.globalHideLoading();
		});
	}

	$scope.$on('closePage', function (event, args) {
		if(args.isForce){
			$scope.onClose();
		} else{
			if($scope.pageIndex == args.pageIndex) {
				if($scope.isTrainingLogOut == false)
				{
					$scope.validateClose();
				}
			}
		}
	});

	$scope.onClose = function() {
		$scope.CheckEContract();
		$scope.pageClass = $scope.stringEmpty;
		$timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
	}

	$scope.navBarTopClick = function(parm) {
		if(parm == 0) {
			$scope.barTopLeftClass = 'active';
			$scope.barTopRightClass = $scope.stringEmpty;
			$scope.menuContent2Class = $scope.stringEmpty;
		}
		else if(parm == 1) {
			$scope.barTopLeftClass = $scope.stringEmpty;
			$scope.barTopRightClass = 'active';
			$scope.menuContent2Class = 'active';
		}
	}

	$scope.goToTestPage = function(){
		$scope.$broadcast('showTestPage', { pageIndex : $scope.pageIndex + 1, trainingPage: $scope, isFromStaging: $scope.isFromStaging });
	}

	$scope.productMaterialClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showTrainingMaterialPage', { pageIndex : $scope.pageIndex + 1, contentType : 'Product' });
	}

	$scope.amlMaterialClick = function() {
		$scope.globalShowLoading();
		$scope.$broadcast('showTrainingMaterialPage', { pageIndex : $scope.pageIndex + 1, contentType : 'AML' });
	}

	$scope.refreshmentTestClick = function() {
		$scope.globalShowLoading();
		var promise = API.TakeRefreshmentTest();
		promise.then(function (response) {
			if (response.errorCode == -1) {
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
			else if(response && response.errorCode == 0){
				$scope.GetTrainingStatus();
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

	$scope.validateClose = function(){
		if($scope.globalData.TrainingAMLStatus != "Y"
		|| $scope.globalData.TrainingProductStatus != "Y") {
			navigator.notification.confirm(
				$scope.globalMessage.ApplicationExit,
				function (parm) {
					if (parm == 1) {
						$scope.isTrainingLogOut = true;
						$scope.pageClass = $scope.stringEmpty;
						$timeout( function(){
							$scope.$emit('goToHomePage');
						}, $scope.timeoutClosePage );
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
		} else {
			$scope.onClose();
		}
	}
});
