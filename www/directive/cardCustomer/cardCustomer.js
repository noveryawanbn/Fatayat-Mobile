angular
.module('cardCustomer', [])
.directive('cardCustomerDirective', ['$sce', function($sce) {
    return {
        restrict: 'E',
        scope: {
            cardId : '=',
            topLeft : '=',
            topRight : '=',
            message : '=',
            onClick : '&'
        },
        link: function (scope, element, attrs) {
            scope.trustAsHtml = function(parm) {
                return $sce.trustAsHtml(parm);
            }
        },
        templateUrl: './directive/cardCustomer/cardCustomer.html',
    };
}]);