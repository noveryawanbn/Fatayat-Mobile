angular
.module('dialogSelect', [])
.directive('dialogSelectDirective', function() {
    return {
        restrict: 'E',
        scope: {
            isShow : '=',
            selectText : '=',
            cancelText : '=',
            onSelect : '&',
            onCancel : '&',
            options : '=',
            title : '=',
            value : '='
        },
        templateUrl: './directive/dialogSelect/dialogSelect.html'
    };
});
