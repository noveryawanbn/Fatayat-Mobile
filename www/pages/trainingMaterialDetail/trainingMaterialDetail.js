rootApp
.directive('trainingMaterialDetailPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/trainingMaterialDetail/trainingMaterialDetail.html'
	};
})
.controller('trainingMaterialDetailPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.TrainingMaterialTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.isText = true;
	$scope.isPDF = false;
	$scope.form = {
		id:0,
		title:$scope.stringEmpty,
		date:$scope.stringEmpty,
		message:$scope.stringEmpty,
		url:$scope.stringEmpty,
		fileType:$scope.stringEmpty
	}

	$scope.$on('showTrainingMaterialDetailPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$scope.isText = false;
		$scope.isPDF = false;
		$scope.form = {
			id:0,
			title:$scope.stringEmpty,
			date:$scope.stringEmpty,
			message:$scope.stringEmpty,
			url:$scope.stringEmpty,
			fileType:$scope.stringEmpty
		}

		$timeout(function () {
			$scope.globalShowLoading();
			var promise = API.ContentGetDetail(args.parm);
			promise.then(
				function (args) {
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
						$scope.form.id = args.value.id;
						$scope.form.title = args.value.title;
						$scope.form.message = args.value.message;
						$scope.form.date = moment(args.value.Date).locale($scope.globalMomentLocale).format($scope.globalDateFormatFull);
						$scope.form.fileType = args.value.fileType;
						$scope.form.url = API.APIUrl + 'api/content/mobilegetcontentfile?Id=' + args.value.id;
						//args.value.categoryId;
						//args.value.subCategoryId;
						if($scope.form.fileType == null || $scope.form.fileType == undefined) {
							$scope.isText = true;
						}
						else if ($scope.form.fileType == 'pdf' || $scope.form.fileType.includes("pdf")) {
							$scope.isPDF = true;
						}
						else {
							$scope.isText = true;
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
				}
			);
		},$scope.timeoutOpenPage);
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
});
