angular
    .module('inputQuestionnaire', [])
    .directive('inputQuestionnaireDirective', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                label: '=',
                no: '=',
                type: '=',
                options: '='
            },
            templateUrl: './directive/inputQuestionnaire/inputQuestionnaire.html'
        };
    });
