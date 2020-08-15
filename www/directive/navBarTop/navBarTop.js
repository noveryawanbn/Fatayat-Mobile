angular
.module('navBarTop', [])
.directive('navBarTopDirective', ['$sce', function($sce) {
    return {
        restrict: 'E',
        scope: {
            type: '=',
            title: '=',
            left: '=',
            right1: '=',
            right2: '=',
            right3: '=',
            onTitleClick: '&',
            onLeftClick: '&',
            onRight1Click: '&',
            onRight2Click: '&',
            onRight3Click: '&',
            titleStyle: '=',
            leftStyle: '=',
            right1Style: '=',
            right2Style: '=',
            right3Style: '='
        },
        link: function(scope, element, attrs) {
            scope.trustAsHtml = function (parm) {
                return $sce.trustAsHtml(parm);
            }
        },
        templateUrl: './directive/navBarTop/navBarTop.html'
    };
}]);