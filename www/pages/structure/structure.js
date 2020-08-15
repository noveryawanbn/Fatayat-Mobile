rootApp
.directive('structurePage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/structure/structure.html'
	};
})
.controller('structurePageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.StructurePageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.$on('showStructurePage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
			$scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$timeout(function () {
			$scope.formSearch = {
				label: $scope.globalMessage.StructureSearchText,
				error: $scope.stringEmpty,
				value: $scope.stringEmpty,
				type: 'text'
			}
			$scope.page = 0;

			$scope.getSearch();
		}, $scope.timeoutOpenPage);
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

	$scope.getSearch = function() {
		$scope.globalShowLoading();
		var promise = API.Structure(
			$scope.formSearch.value,
			$scope.page
		);
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
				else {
					$scope.page = 0;
					$scope.userList = [];
					$scope.rank = args.value.rank;
					args.value.agentList.forEach(function(value) {
						$scope.userList.push({
							Rank: value.rank,
							Message:
								'<table>' +
									'<tr>' +
										'<td>' + $scope.globalMessage.StructureLabelAgentCode + '</td>' +
										'<td>:</td>' +
										'<td>' + value.agentCode + '</td>' +
									'</tr>' +
									'<tr>' +
										'<td>' + $scope.globalMessage.StructureLabelName + '</td>' +
										'<td>:</td>' +
										'<td>' + value.name + '</td>' +
									'</tr>' +
									'<tr>' +
										'<td>' + $scope.globalMessage.StructureLabelMobile + '</td>' +
										'<td>:</td>' +
										'<td>' + value.mobilePhone + '</td>' +
									'</tr>' +
								'</table>'
						})
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
});
