rootApp
.directive('dashboardPage', function(){
    return {
        restrict: 'E',
        templateUrl: './pages/dashboard/dashboard.html'
    };
})
.controller('dashboardPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
        type: 6,
        title: $scope.globalMessage.DashboardPageTitle,
        left: '<i class="fa fa-fw fa-angle-left"></i>',
        right: '<i class="fa fa-fw fa-home"></i>',
        onLeftClick: function (){ $scope.validateClose(); },
        onRightClick: function (){ $scope.onClose(); }
    };

    $scope.initialize = function() {
        $scope.DashboardList = [];
    }

    $scope.$on('showDashboardPage', function(event, args){
        $scope.isShow = true;
        $timeout(function(){
            $scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage);
        $scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

        $timeout(function(){
            $scope.initialize();
            $scope.getDashboard($scope.globalData.AgentCode, '');
        }, $scope.timeoutOpenPage);
    });

    $scope.$on('closePage', function (event, args) {
        if ($scope.pageIndex == args.pageIndex) {
			$scope.validateClose();
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
    
    $scope.validateClose = function() {
        if ($scope.DashboardList.length > 1) {
            $scope.prevClick();
        } else {
            $scope.onClose();
        }
    }

    $scope.getDashboard = function(agentCode, area){
        if ($scope.lastClick && new Date() - $scope.lastClick < 500) {
            return;
        }
        $scope.lastClick = new Date();
        $scope.globalShowLoading();
        var promise = API.GetDashboard(agentCode, area);
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
                $scope.DashboardList.push({
                    Search: '',
                    AgentCode: agentCode,
                    Period: response.value.period,
                    ProvinceName: response.value.provinceName,
                    Area: area,
                    NSHName: response.value.nshName,
                    ABDMName: response.value.abdmName,
                    SFKName: response.value.sfkName,
                    SFSName: response.value.sfsName,
                    SFMName: response.value.sfmName,
                    Pending: response.value.pending,
                    Submit: response.value.submit,
                    Complete: response.value.complete,
                    Lapse: response.value.lapse,
                    APEPending: response.value.apePending,
                    APESubmit: response.value.apeSubmit,
                    APEComplete: response.value.apeComplete,
                    APELapse: response.value.apeLapse,
                    AgentList: response.value.agentList,
                });
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
    }

    $scope.prevClick = function(){
        $scope.DashboardList.pop();
    }

    $scope.getRank = function(rank){
        switch(rank){
            case 'F1NSH': return $scope.globalMessage.DashboardLabelNSH;
            case 'F1AM': return $scope.globalMessage.DashboardLabelABDM;
            case 'F1SFK': return $scope.globalMessage.DashboardLabelSFK;
            case 'F1SFS': return $scope.globalMessage.DashboardLabelSFS;
            case 'F1FS': return $scope.globalMessage.DashboardLabelSFM;
            default: return 'Lain-lain';
        }
    }

    $scope.getAgentList = function(agentList, search){
        return agentList.filter(x =>
            x.agentCode.toLowerCase().includes(search.toLowerCase()) ||
            x.agentName.toLowerCase().includes(search.toLowerCase()));
    }

    $scope.getDetail = function(agentCode, transactionType, area){
		$scope.globalShowLoading();
		$scope.$broadcast('showDashboardDetailPage', {
            pageIndex : $scope.pageIndex + 1,
            agentCode: agentCode,
            transactionType: transactionType,
            area: area,
        })
    }
});