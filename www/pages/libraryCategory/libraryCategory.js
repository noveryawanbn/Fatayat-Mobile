rootApp
.directive('libraryCategoryPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/libraryCategory/libraryCategory.html'
	};
})
.controller('libraryCategoryPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.LibraryCategoryPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.libraryCategoryList = [];

	$scope.$on('showLibraryCategoryPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
            $scope.categoryList = [];
			$scope.globalShowLoading();
			var promise = API.ContentCategoryGet();
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
						args.value.forEach(function(value) {
							$scope.categoryList.push({
								id: value.id,
								message: value.name
							});
						});
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
		}, $scope.timeoutClosePage);
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

	$scope.onCardClick = function(parm) {
		$scope.$broadcast('showLibraryPage', { pageIndex : $scope.pageIndex + 1, parm : {
			categoryId: parm,
			title: $scope.categoryList.filter(function (args) { return args.id == parm; })[0].message
		}});
	}
});
