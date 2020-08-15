rootApp
.directive('claimDetailPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/claimDetail/claimDetail.html'
	};
})
.controller('claimDetailPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ClaimDetailPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.claimType = {
		death: 'C001',
		tpd: 'C002',
	}
	$scope.contentIndex = 0;
	$scope.master = {
		supportingDocumentTypeList: [
			{ code: 'SDC001', text: 'A' },
			{ code: 'SDC002', text: 'B' },
			{ code: 'SDC003', text: 'C' },
			{ code: 'SDC004', text: 'D' },
			{ code: 'SDC005', text: 'E' },
		],
	}
	$scope.model = {
		claimType: '',
		supportingDocumentList: [],
	}

	$scope.$on('showClaimDetailPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function () {
			$scope.pageClass = "active";
			$scope.globalHideLoading();
		}, $scope.timeoutOpenPage);
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex });

		$timeout(function () {
			$scope.onLoad();
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

	$scope.onLoad = function() {

	}

	$scope.getPageCount = function() {
		if ($scope.model.claimType == $scope.claimType.death) {
			return 7 + $scope.model.supportingDocumentList.length;
		} else if ($scope.model.claimType == $scope.claimType.tpd) {
			return 9 + $scope.model.supportingDocumentList.length;
		}
		return 0;
	}

	$scope.claimTypeClick = function() {
		$scope.model.supportingDocumentList = [];
		if ($scope.model.claimType == $scope.claimType.death) {
			$scope.model.supportingDocumentList.push($scope.master.supportingDocumentTypeList[0]);
			$scope.model.supportingDocumentList.push($scope.master.supportingDocumentTypeList[1]);
		} else if ($scope.model.claimType == $scope.claimType.tpd) {
			$scope.model.supportingDocumentList.push($scope.master.supportingDocumentTypeList[2]);
			$scope.model.supportingDocumentList.push($scope.master.supportingDocumentTypeList[3]);
			$scope.model.supportingDocumentList.push($scope.master.supportingDocumentTypeList[4]);
		}
	}

	$scope.prevClick = function(){
		if($scope.contentIndex > 0){
				$scope.contentIndex--;
		}

		$timeout(function(){
			$('.claim-detail-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
		}, $scope.timeoutOpenPage);
	}

	$scope.nextClick = function(){
		if ($scope.contentIndex < $scope.getPageCount()) {
			$scope.contentIndex++;
		}

		$timeout( function(){
			$('.claim-detail-page-content:nth-child(' + $scope.contentIndex + ')').scrollTop(0);
		}, $scope.timeoutOpenPage );
	}

	$scope.isNextAvailable = function() {
		if ($scope.getPageCount() > 0 && $scope.contentIndex < $scope.getPageCount()) {
			return true;
		}
		return false;
	}

	contentIndexIncrement = function(contentIndex) {
		if ($scope.model.claimType == $scope.claimType.death) {
			contentIndex += 2
		} else if ($scope.model.claimType == $scope.claimType.tpd) {

		}
		return contentIndex;
	}
	
	$scope.isPageShow = function(screen, detail) {
		var status = false;
		var contentIndex = $scope.contentIndex;
		var sdCounter = $scope.model.supportingDocumentList.length;
		var detailIndex = $scope.model.supportingDocumentList.map(function(e) { return e.code; }).indexOf(detail);

		if (detailIndex < 0) {
			detailIndex = 0;
		}

		contentIndex = contentIndexIncrement(contentIndex);
		
		if (
			(screen == 'Info Rekening' && contentIndex >= 5) ||
			(screen == 'Compliance' && contentIndex >= 6) ||
			(screen == 'Supporting Document List' && contentIndex >= 7) ||
			(screen == 'Supporting Document Area' && contentIndex >= 8 + detailIndex) ||
			(screen == 'Preview' && contentIndex >= 8 + sdCounter) ||
			(screen == 'Submit' && contentIndex >= 9 + sdCounter)
		) {
			status = true;
		}
		return status;
	}

	$scope.isFOBShow = function() {
		var contentIndex = $scope.contentIndex;
		var sdCounter = $scope.model.supportingDocumentList.length;

		contentIndex = contentIndexIncrement(contentIndex);

		if (contentIndex >= 8 && contentIndex < 8 + sdCounter) {
			return true;
		}
		return false;
	}

	$scope.fobClick = function() {
		navigator.camera.getPicture(
			function cameraSuccess(imageUri) {
				var supportingDocument = $scope.model.supportingDocumentList[contentIndex - 8];
				var c = document.createElement('canvas');
				var ctx = c.getContext("2d");
						var img = new Image();
				img.onload = function() {
					c.width=this.width;
					c.height=this.height;
					ctx.drawImage(img, 0, 0);
					supportingDocument.image = c.toDataURL("image/jpeg");
				};
				img.src = imageUri;
				// supportingDocument.image = imageUri;
				$scope.$apply();
			},
			function cameraError(error) {
				console.debug("Unable to obtain picture: " + error, "app");
			},
			{
				quality: 25,
				targetWidth: 3240,
				targetHeight: 3240,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: sourceType,
				encodingType: Camera.EncodingType.JPEG,
				mediaType: Camera.MediaType.PICTURE,
				allowEdit: false,
				correctOrientation: true
			}
		);
	}
});
