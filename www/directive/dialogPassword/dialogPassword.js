angular
.module('dialogPassword', [])
.directive('dialogPasswordDirective', function() {
    return {
        restrict: 'E',
        scope: {
            isShow: '=',
            okText: '=',
            cancelText: '=',
            onOK: '&',
            onCancel: '&',
            title: '=',
            model: '='
        },
        templateUrl: './directive/dialogPassword/dialogPassword.html'
    };
});
