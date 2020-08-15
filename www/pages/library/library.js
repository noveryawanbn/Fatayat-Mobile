rootApp
.directive('libraryPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/library/library.html'
	};
})
.controller('libraryPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.LibraryPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.libraryList = [];

	$scope.$on('showLibraryPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$scope.subCategoryList = [];
		$scope.libraryList = [];
		$scope.navBarTop.title = args.parm.title;

		$timeout(function () {
			$scope.globalShowLoading();
			var categoryId = args.parm.categoryId;
			var promise = API.ContentSubCategoryGet(categoryId);
			promise.then(
				function (args) {
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
					else 
					{
						args.value.forEach(function(value) {
							$scope.subCategoryList.push({
								id: value.id,
								title: value.name,
								isShow: true
							});
						});
						var promise2 = API.ContentGet("Library", categoryId);
						promise2.then(
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
										var FileUrl = $scope.stringEmpty;
										var FileType = value.fileType;
										var FileName = $scope.stringEmpty;
										if(FileType != undefined && FileType != $scope.stringEmpty) {
											FileUrl = API.APIUrl + 'api/content/mobilegetcontentfile?Id=' + value.id;
											if (value.fileName != undefined && value.fileName != $scope.stringEmpty)
												FileName = value.fileName;
											else
												FileName = value.title + '.' + FileType;
										}
										$scope.libraryList.push({
											id: value.id,
											title: value.title,
											date: moment(value.date).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin),
											message: value.message,
											linkUrl: FileUrl,
											fileType: FileType,
											fileName: FileName,
											subCategoryId: value.subCategoryId
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
		$scope.$broadcast('showLibraryDetailPage', { pageIndex : $scope.pageIndex + 1, parm : parm });
	}

	$scope.showHideSubCategory = function(index) {
		if ($scope.subCategoryList[index].isShow == true) {
			$scope.subCategoryList[index].isShow = false;
		}
		else {
			$scope.subCategoryList[index].isShow = true;
		}
	}
});
