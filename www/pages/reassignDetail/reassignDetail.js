rootApp
.directive('reassignDetailPage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/reassignDetail/reassignDetail.html'
    };
})
.controller('reassignDetailPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ReassignPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
    };

    $scope.$on('showReassignDetailPage', function(event, args){
        $scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

        $timeout(function(){
            
            $scope.activeAgentList = JSON.parse(JSON.stringify(args.agentList));
            $scope.currActiveAgentList = JSON.parse(JSON.stringify(args.agentList));

            $scope.selectedCustomer = JSON.parse(JSON.stringify(args.customerData));
            console.log($scope.activeAgentList);
            console.log($scope.currActiveAgentList);
            console.log($scope.selectedCustomer);

            $scope.formFilterRank = {
                value: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.ReassignSearchFilter1, value: $scope.stringEmpty}
                ]
            };

            $scope.formFilterCity = {
                value: $scope.stringEmpty,
                options: [
                    { text: $scope.globalMessage.ReassignSearchFilter2, value: $scope.stringEmpty}
                ]
            };

            $scope.formSearch = {
                label: $scope.globalMessage.ReassignSearchText,
                error: $scope.stringEmpty,
                value: $scope.stringEmpty,
                type: 'text'
            };

            $scope.getHeader();
            $scope.globalHideLoading();
        }, $scope.timeoutOpenPage);
    });

    $scope.$on('closePage', function(event, args){
        $scope.onClose();
    });

    $scope.onClose = function(){
        $scope.pageClass = $scope.stringEmpty;
        $timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
        $scope.pageIndex = 0;
        $scope.$emit('refreshReassignList');
    }

    $scope.getHeader = function(){
        $scope.activeAgentList.forEach(agent => {
            if(!$scope.formFilterRank.options.some(x => (x.value === agent.rank) && (x.text === agent.rank))){
                $scope.formFilterRank.options.push({
                    text: agent.rank,
                    value: agent.rank
                });
            }

            if(!$scope.formFilterCity.options.some(x => (x.value === agent.cityName) && (x.text === agent.cityName))){
                $scope.formFilterCity.options.push({
                    text: agent.cityName,
                    value: agent.cityName
                });
            }
        });
        $scope.formFilterCity.options.sort((string1, string2) => (string1.text > string2.text) - (string1.text < string2.text));
        $scope.globalHideLoading();
    }

    $scope.getActiveAgentSearch = function(){
        //TODO:
        var activeAgentList = JSON.parse(JSON.stringify($scope.activeAgentList));
        activeAgentList = activeAgentList
            .filter(agent => (agent.cityName.includes($scope.formFilterCity.value)))
            .filter(agent => (agent.rank.includes($scope.formFilterRank.value)))
            .filter(agent => (agent.agentName.toLowerCase().includes($scope.formSearch.value.toLowerCase())));

        $scope.currActiveAgentList = activeAgentList;
    }

    $scope.assignClick = function(agent){
        try {
            navigator.notification.confirm(
                $scope.globalMessage.ReassignDetailPopUpSubmit.format($scope.selectedCustomer.applicationNo, $scope.selectedCustomer.customerName, agent.agentCode, agent.agentName, agent.rank),
                function(parm){
                    if(parm == 1){
                        //TODO:
                        $scope.assignAgent(agent);
                    }
                },
                $scope.globalMessage.PopUpTitle,
				[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
            );
        } catch (err) {
            $scope.onClose();
        }
    }

    $scope.assignAgent = function(agent){
        $scope.globalShowLoading();
        var promise = API.ReassignAgent(
            $scope.selectedCustomer.applicationNo,
            $scope.selectedCustomer.policyNo,
            agent.agentCode
        );
        promise.then(function(args){
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
                //TODO:
                if(args.errorCode > 0){
                    try {
                        navigator.notification.alert(
                            $scope.globalMessage.PosDetailSaveCoreErrorFailed,
                            function () { },
                            $scope.stringEmpty,
                            $scope.globalMessage.PopUpButtonClose
                        );
                    } catch (err) {
                        alert ($scope.globalMessage.ApplicationUserExpired);
                    }
                } else {
                    if(args.value.status == true){
                        try {
                            navigator.notification.alert(
                                $scope.globalMessage.ReassignDetailPopUpSubmitSuccess,
                                function () { $scope.onClose(); },
                                $scope.stringEmpty,
                                $scope.globalMessage.PopUpButtonClose
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
            $scope.globalHideLoading();
        }, function(error){
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