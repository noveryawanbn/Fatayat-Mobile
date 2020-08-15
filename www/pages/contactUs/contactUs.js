rootApp
.directive('contactUsPage', function(){
    return{
        restrict: 'E',
        templateUrl: './pages/contactUs/contactUs.html'
    };
})
.controller('contactUsPageController', function($scope, $timeout, API){
    $scope.isShow = false;
    $scope.pageClass = $scope.stringEmpty;
    $scope.pageIndex = 0;

    $scope.navBarTop = {
        type: 5,
        title: $scope.globalMessage.ContactUsPageTitle,
        left: '<i class="fa fa-fw fa-angle-left"></i>',
        onLeftClick: function(){$scope.onClose();}        
    };

    $scope.$on('showContactUsPage', function(event, args){
        $scope.contactUs = JSON.parse(localStorage.getItem('contactUs'));

        $scope.isShow = true;
        $timeout(function(){
            $scope.globalHideLoading();
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage);
        $scope.pageIndex = args.pageIndex;
        $scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

        $timeout(function () {
			var promise = API.GetContactUs();
			promise.then(
				function (args) {
					$scope.contactUs.phoneNumberText = args.phoneNumberText;
                    $scope.contactUs.phoneNumber = args.phoneNumber;
                    $scope.contactUs.emailAddressText = args.emailAddressText;
                    $scope.contactUs.emailAddress = args.emailAddress;
                    localStorage.setItem('contactUs', JSON.stringify($scope.contactUs));
				},
				function (error) { }
			);
		}, $scope.timeoutOpenPage);
    });

    $scope.$on('closePage', function(event, args){
        if($scope.pageIndex == args.pageIndex) {
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

    $scope.contactUsPhoneClick = function() {
        var phoneNumber = document.createElement("input");
        document.body.appendChild(phoneNumber);
        phoneNumber.setAttribute("id", "phoneNumber");
        document.getElementById("phoneNumber").value = $scope.contactUs.phoneNumber;
        phoneNumber.select();
        document.execCommand("copy");
        document.body.removeChild(phoneNumber);
        try {
            window.plugins.toast.showShortBottom('No telepon berhasil disalin');
        }
        catch (err) { alert('No telepon berhasil disalin'); }
    }
    
    $scope.contactUsEmailClick = function() {
		cordova.plugins.email.open({
            to: $scope.contactUs.emailAddress,
            subject: 'Fatayat : '
        });
	}
});