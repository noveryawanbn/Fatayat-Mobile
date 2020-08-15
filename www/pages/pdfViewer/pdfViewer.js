rootApp
.directive('pdfViewerPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/pdfViewer/pdfViewer.html'
	};
})
.controller('pdfViewerPageController', function($scope, $timeout) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: 'PDF VIEWER',
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};
	$scope.url = $scope.stringEmpty;
	$scope.fileName = $scope.stringEmpty;

	$scope.$on('showPDFViewerPage', function (event, args) {
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
		$scope.url = args.url;
		$scope.fileName = args.fileName;
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
