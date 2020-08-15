angular
.module('gridTile', [])
.directive('gridTileDirective', function() {
    return {
        restrict: 'E',
        scope: {
            icon: '@',
            label: '=',
            onClick: '&',
            alertCount: '='
        },
        templateUrl: './directive/gridTile/gridTile.html'
    };
});
