rootApp
.directive('eStatementDetailPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/eStatementDetail/eStatementDetail.html'
	};
})
.controller('eStatementDetailPageController', function($scope, $timeout, $sce, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 6,
		title: $scope.globalMessage.EStatementPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		right1: '<i class="fa fa-fw fa-trash"></i>',
		onLeftClick: function () { $scope.onClose(); },
		onRight1Click: function () { $scope.onDelete(); }
	};

	$scope.$on('showEStatementDetailPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function () {
			$scope.pageClass = "active";
		}, $scope.timeoutOpenPage);
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex });

		$timeout(function () {
			$scope.form = {
				id: args.parm,
				title: $scope.stringEmpty,
				date: $scope.stringEmpty,
				message: $scope.stringEmpty,
				fileType: $scope.stringEmpty,
				fileUrl: $scope.stringEmpty,
				fileName: $scope.stringEmpty
			}

			$scope.globalShowLoading();
			var promise = API.InboxGetDetail(args.parm);
			promise.then(function (result) {
				if (result.errorCode == -1) {
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
					var value = result.value;
					$scope.form.title = value.title;
					$scope.form.date = moment(value.inboxDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatFull);
					$scope.form.message = value.content;
					$scope.form.fileType = "pdf";
					if (value.documentPath.startsWith("Document/")) {
						$scope.form.fileUrl = API.APIUrl + value.documentPath;
					}
					else if (value.documentPath.startsWith("tpam/")) {
						$scope.form.fileUrl = API.APIUrl + "file/" + value.documentPath;
					} else {
						$scope.form.fileUrl = API.APIUrl + "file/get/" + value.documentPath;
					}
					$scope.form.fileName = value.documentPath.replace('Document/', $scope.stringEmpty);
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
		});
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

	$scope.onDelete = function() {
		try {
			navigator.notification.confirm(
				$scope.globalMessage.ESTatementPopUpConfirmDelete,
				function (confirmParm) {
					if (confirmParm == 1) {
						$scope.onRecordDelete();
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
		}
		catch (err) {
			if (confirm($scope.globalMessage.ESTatementPopUpConfirmDelete)) {
				$scope.onRecordDelete();
			}
		}
	}

	$scope.onRecordDelete = function() {
		$scope.globalShowLoading();
		var promise = API.InboxDelete($scope.form.id);
		promise.then(function (result) {
			if (result.errorCode == -1) {
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
				var value = result.value;
				for (var i = 0; i < $scope.$parent.eStatementList.length; i++) {
					if ($scope.$parent.eStatementList[i].id == $scope.form.id) {
						$scope.$parent.eStatementList.splice(i, 1);
						break;
					}
				}
				$scope.onClose();
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

	$scope.showPDFClick = function() {
		$scope.$broadcast('showPDFViewerPage', { pageIndex: $scope.pageIndex + 1, url: $scope.form.fileUrl });
	}

	$scope.trustAsHtml = function(param) {
		return $sce.trustAsHtml(param);
	}
});
