rootApp
.directive('eStatementPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/eStatement/eStatement.html'
	};
})
.controller('eStatementPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.EStatementPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	
	$scope.$on('showEStatementPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
			$scope.globalHideLoading();
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
	}

	$scope.sortEstatement = function(estatement){
		return parseInt(estatement.id);
	};

	$scope.onCardClick = function(parm) {
		for (var i = 0; i < $scope.$parent.eStatementList.length; i++) {
			if ($scope.$parent.eStatementList[i].id == parm && $scope.$parent.eStatementList[i].isUnread) {
				$scope.$parent.eStatementList[i].isUnread = false;
				$scope.$parent.unreadEStatement--;
				API.InboxRead($scope.$parent.eStatementList[i].id).then(function (result) {
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
		$scope.$broadcast('showEStatementDetailPage', { pageIndex : $scope.pageIndex + 1, parm : parm });
	}

	$scope.onCardDelete = function(parm) {
		try {
			navigator.notification.confirm(
				$scope.globalMessage.ESTatementPopUpConfirmDelete,
				function (confirmParm) {
					if (confirmParm == 1) {
						$scope.onDelete(parm);
					}
				},
				$scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
			)
		}
		catch (err) {
			if (confirm($scope.globalMessage.ESTatementPopUpConfirmDelete)) {
				$scope.onDelete(parm);
			}
		}
	}

	$scope.onDelete = function(parm) {
		$scope.globalShowLoading();
		var promise = API.InboxDelete(parm);
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
			var value = result.value;
			for (var i = 0; i < $scope.$parent.eStatementList.length; i++) {
				if ($scope.$parent.eStatementList[i].id == parm) {
					$scope.$parent.eStatementList.splice(i, 1);
					break;
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
		});
	}
});
