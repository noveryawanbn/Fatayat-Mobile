rootApp
.directive('reassignPage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/reassign/reassign.html'
    };
})
.controller('reassignPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.ReassignPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
    };

    $scope.$on('showReassignPage', function(event, args){
        $scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });
        
        $timeout(function(){

            $scope.initializeVar();

            $scope.getReassignList();

            $scope.globalHideLoading();
        }, $scope.timeoutOpenPage);
    });

    $scope.initializeVar = function(){
        $scope.reassignList = {
            inActiveAgent: [],
            activeAgent: []
        };

        $scope.currReassignList = {
            inActiveAgent: [],
            activeAgent: []
        };
        
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
    }

    $scope.getReassignList = function(){
        $scope.globalShowLoading();
        $scope.initializeVar();
        var promise = API.GetReassignList();
        promise.then(
            function(args){
                if(args.errorCode == -1){
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
                } else {
                    if(args.value != null){
                        if(args.value.inActiveAgentList != null){

                            var inActiveAgent = args.value.inActiveAgentList;

                            inActiveAgent.forEach(agent => {
                                var customerList = [];
                                agent.customerList.forEach(customer => {
                                    var message = 
                                        '<table>' +
                                            '<tr>' +
                                                '<td>' + $scope.globalMessage.ReassignPolicyNameLabel + '</td>' +
                                                '<td>:</td>' +
                                                '<td>'+ customer.customerName +'</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                                '<td>' + $scope.globalMessage.ReassignApplicationNoLabel + '</td>' +
                                                '<td>:</td>' +
                                                '<td>'+ customer.applicationNo +'</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                                '<td>' + $scope.globalMessage.ReassignContributionLabel + '</td>' +
                                                '<td>:</td>' +
                                                '<td>'+ customer.premium +'</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                                '<td>' + $scope.globalMessage.ReassignApplicationDateLabel + '</td>' +
                                                '<td>:</td>' +
                                                '<td>'+ customer.submitDate +'</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                                '<td>' + $scope.globalMessage.ReassignCityLabel + '</td>' +
                                                '<td>:</td>' +
                                                '<td>'+ customer.cityName +'</td>' +
                                            '</tr>' +
                                        '</table>';
                                    customerList.push({
                                        applicationNo: customer.applicationNo,
                                        policyNo: customer.policyNo,
                                        customerName: customer.customerName,
                                        submitDate: customer.submitDate,
                                        premium: customer.premium,
                                        paymentMode: customer.paymentMode,
                                        cityName: customer.cityName,
                                        message: message
                                    });
                                });
                                $scope.reassignList.inActiveAgent.push({
                                    rank: agent.rank,
                                    agentCode: agent.agentCode,
                                    agentName: agent.agentName,
                                    cityName: agent.cityName,
                                    customerList: customerList,
                                });
                            });
                        }
                        
                        if(args.value.activeAgentList != null){
                            
                            var activeAgent = args.value.activeAgentList;

                            activeAgent.forEach(agent => {
                                var message = 
                                    '<table>' +
                                        '<tr>' +
                                            '<td style="font-weight: bold;">'+ agent.rank +'</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td>'+ agent.agentCode + ' - '+ agent.agentName +'</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td>'+ agent.cityName +'</td>' +
                                        '</tr>' +
                                    '</table>';
                                $scope.reassignList.activeAgent.push({
                                    rank: agent.rank,
                                    agentCode: agent.agentCode,
                                    agentName: agent.agentName,
                                    cityName: agent.cityName,
                                    message: message
                                });
                            });
                        }

                        $scope.currReassignList.inActiveAgent = JSON.parse(JSON.stringify($scope.reassignList.inActiveAgent));
                        $scope.currReassignList.activeAgent = JSON.parse(JSON.stringify($scope.reassignList.activeAgent));
                        $scope.getHeader();
                    }
                }
            },
            function(error){
                try {
                    navigator.notification.alert(
                        $scope.globalMessage.ApplicationErrorConnectionFailed,
                        function () { },
                        $scope.globalMessage.PopUpTitle,
                        $scope.globalMessage.PopUpButtonOK
                    );
                } catch (err) {
                    alert($scope.globalMessage.ApplicationErrorConnectionFailed);
                }
                $scope.globalHideLoading();
                $scope.onClose();
            }
        );
    }

    $scope.$on('closePage', function(event, args){
        if($scope.pageIndex == args.pageIndex){
            $scope.onClose();
        }
    });

    $scope.onClose = function(){
        $scope.pageClass = $scope.stringEmpty;
        $timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
    }

    $scope.getHeader = function(){
        $scope.reassignList.inActiveAgent.forEach(agent => {
            if(!$scope.formFilterRank.options.some(x => (x.value === agent.rank) && (x.text === agent.rank))){
                $scope.formFilterRank.options.push({
                    text: agent.rank,
                    value: agent.rank
                });
            }
            if(agent.customerList != null){
                agent.customerList.forEach(customer => {
                    if(!$scope.formFilterCity.options.some(x => (x.value === customer.cityName) && (x.text === customer.cityName))){
                        $scope.formFilterCity.options.push({
                            text: customer.cityName,
                            value: customer.cityName
                        });
                    }
                });
            }
        });
        $scope.formFilterCity.options.sort((string1, string2) => (string1.text > string2.text) - (string1.text < string2.text));
        $scope.globalHideLoading();
    }

    $scope.getReassignNext = function(){
        //TODO:
    }

    $scope.getReassignSearch = function(){
        var inActiveAgentList = JSON.parse(JSON.stringify($scope.reassignList.inActiveAgent));
        inActiveAgentList = inActiveAgentList
            .filter(agent => (agent.agentName.toLowerCase().includes($scope.formSearch.value.toLowerCase())))
            .filter(agent => (agent.rank.includes($scope.formFilterRank.value)));

        inActiveAgentList.forEach(agent => {
            agent.customerList = agent.customerList.filter(customer => (customer.cityName.includes($scope.formFilterCity.value)));
        });
        $scope.currReassignList.inActiveAgent = inActiveAgentList;
    }

    $scope.customerClick = function(customerData){
        //TODO:
        $scope.globalShowLoading();
        $scope.$broadcast('showReassignDetailPage', {pageIndex: $scope.pageIndex + 1, customerData: customerData, agentList: $scope.reassignList.activeAgent});
    }

    $scope.$on('refreshReassignList', function(event, args){
        $timeout(function(){
            $scope.getReassignList();
        }, 2000);
    });
});