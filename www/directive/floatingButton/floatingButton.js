angular
.module('floatingButton', [])
.directive('floatingButtonDirective', function() {
    return {
        restrict: 'E',
        scope: {
            icon : '=',
            onClick : '&'
        },
        templateUrl: './directive/floatingButton/floatingButton.html'
    };
});
