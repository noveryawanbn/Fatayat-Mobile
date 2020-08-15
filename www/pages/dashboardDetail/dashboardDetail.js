rootApp
.directive('dashboardDetailPage', function(){
    return {
        restrict: 'E',
        templateUrl: './pages/dashboardDetail/dashboardDetail.html'
    };
})
.controller('dashboardDetailPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
        type: 5,
        title: $scope.globalMessage.DashboardDetailPageTitle,
        left: '<i class="fa fa-fw fa-angle-left"></i>',
        onLeftClick: function (){ $scope.onClose(); }
    };

    $scope.initialize = function() {
        $scope.search = '';
        $scope.transactionType = '';
        $scope.period = new Date();
        $scope.customerList = [];
        $scope.rankList = [
            { text: $scope.globalMessage.DashboardDetailLabelSearchRank, value: '' },
            { text: $scope.globalMessage.DashboardLabelNSH, value: 'F1NSH' },
            { text: $scope.globalMessage.DashboardLabelABDM, value: 'F1AM' },
            { text: $scope.globalMessage.DashboardLabelSFK, value: 'F1SFK' },
            { text: $scope.globalMessage.DashboardLabelSFS, value: 'F1SFS' },
            { text: $scope.globalMessage.DashboardLabelSFM, value: 'F1FS' },
        ];
        $scope.search = {
            rank: '',
            text: '',
        }
    }

    $scope.$on('showDashboardDetailPage', function(event, args){
        $scope.isShow = true;
        $timeout(function(){
            $scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage);
        $scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

        $timeout(function(){
            $scope.initialize();
            $scope.getTransactionType(args.transactionType);

            $scope.globalShowLoading();
            var promise = API.GetDashboardDetail(args.agentCode, args.transactionType, args.area);
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
                } else {
                    $scope.period = new Date(response.value.period);
                    $scope.customerList = response.value.customerList;
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
                $scope.globalHideLoading();
            });
        }, $scope.timeoutOpenPage);
    });
    
    $scope.$on('closePage', function (event, args) {
		if ($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
	});

    $scope.onClose = function(){
        $scope.initialize();
        $scope.pageClass = $scope.stringEmpty;
        $timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
    }

    $scope.getCustomerList = function(){
        if($scope.customerList != null){
            return $scope.customerList
            .filter(x =>
                x.rank.includes($scope.search.rank) &&
                (
                    x.agentCode.toLowerCase().includes($scope.search.text.toLowerCase()) ||
                    x.agentName.toLowerCase().includes($scope.search.text.toLowerCase())
                )
            );
        } else {
            return [];
        }
        
    }

    $scope.getTransactionType = function(transactionType){
        switch(transactionType){
            case 'P':
                $scope.transactionType = $scope.globalMessage.DashboardLabelPending.toUpperCase();
                break;
            case 'S':
                $scope.transactionType = $scope.globalMessage.DashboardLabelSubmit.toUpperCase();
                break;
            case 'C':
                $scope.transactionType = $scope.globalMessage.DashboardLabelComplete.toUpperCase();
                break;
            case 'L':
                $scope.transactionType = $scope.globalMessage.DashboardLabelLapse.toUpperCase();
                break;
            default :
                $scope.transactionType = '';
                break;
        }
    }
});