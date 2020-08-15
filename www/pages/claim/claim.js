rootApp
.directive('claimPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/claim/claim.html'
	};
})
.controller('claimPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ClaimPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.$on('showClaimPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function () {
			$scope.pageClass = "active";
			$scope.globalHideLoading();
		}, $scope.timeoutOpenPage);
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex });

		$timeout(function () {
			$scope.formSearch = {
				status: '',
				options: [
					{ value: '', text: $scope.globalMessage.ClaimSearchStatus }
				],
				search: '',
				label: $scope.globalMessage.ClaimSearchName
			};
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if ($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
	});

	$scope.onClose = function () {
		$scope.pageClass = $scope.stringEmpty;
		$timeout(function () {
			$scope.isShow = false;
		}, $scope.timeoutClosePage);
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
	}

	$scope.addClaimClick = function () {
		$scope.globalShowLoading();
		$scope.$broadcast('showClaimDetailPage', { pageIndex : $scope.pageIndex + 1 })
	}
});
