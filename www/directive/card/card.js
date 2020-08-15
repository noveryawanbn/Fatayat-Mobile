angular
.module('card', [])
.directive('cardDirective', function() {
    return {
        restrict: 'E',
        scope: {
            cardId : '=',
            topLeft : '=',
            topRight : '=',
            message : '=',
            isUnread: '=',
            onClick : '&',
            showArrow : '='
        },
        templateUrl: './directive/card/card.html'
    };
});
