angular
.module('cardAction', [])
.directive('cardActionDirective', ['$sce', function($sce) {
    return {
        restrict: 'E',
        scope: {
            cardId: '=',
            topLeft: '=',
            topRight: '=',
            message: '=',
            actionIcon: '=',
            onClick: '&',
            onActionClick: '&'
        },
        link: function (scope, element, attrs) {
            scope.trustAsHtml = function(parm) {
                return $sce.trustAsHtml(parm);
            }
        },
        templateUrl: './directive/cardAction/cardAction.html'
    };
}]);
