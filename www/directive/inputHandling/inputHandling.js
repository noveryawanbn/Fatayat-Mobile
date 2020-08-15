angular
    .module('inputHandling', [])
    .directive('inputHandlingDirective', function () {
        return {
            restrict: 'E',
            scope: {
                rows: '=',
                cols: '=',
                model: '=',
                label: '=',
                error: '=',
                type: '=',
                options: '=',
                isDisabled: '=',
                onChange: '&',
                onBlur: '&',
                locale: '=',
                dateFormat: '=',
                tooltip: '=',
                tooltipOptions: '=',
                maxlength: '=',
                minYear: '=',
                maxYear: '=',
                tooltiptype: '=',
                onTooltipClick: '&'
            },
            link: function (scope, element, attrs) {
                scope.$watch('rows', function(newValue, oldValue){
                    scope.rowValue = newValue;
                }, true);
                scope.$watch('cols', function(newValue, oldValue){
                    scope.colValue = newValue;
                }, true);
                scope.$watch('type', function (newValue, oldValue) {
                    if (newValue != '' && newValue != undefined) {
                        if(newValue == 'rt/rw' || newValue == 'mobile'){
                            scope.typeValue = 'tel';
                        }
                        else if(newValue == 'address' || newValue == 'email'){
                            scope.typeValue = 'text';
                        }
                        else {
                            scope.typeValue = newValue;
                        }
                    }
                    else {
                        scope.typeValue = 'text';
                    }
                    scope.onLoad();
                }, true);
                scope.$watch('maxlength', function (newValue, oldValue) {
                    if (newValue != '' && newValue != undefined) {
                        scope.maxlengthValue = newValue;
                    }
                    else {
                        scope.maxlengthValue = '999999';
                    }
                    scope.onLoad();
                }, true);
                scope.$watch('model', function (newValue, oldValue) {
                    scope.modelValue = newValue == null || newValue == undefined ? '' : newValue;
                    if (scope.inputClass != 'focus') {
                        scope.onLoad();
                    }
                }, true);
                scope.$watch('minYear', function (newValue, oldValue) {
                    if (scope.typeValue == 'date') {
                        scope.onLoad();
                    }
                }, true);
                scope.$watch('maxYear', function (newValue, oldValue) {
                    if (scope.typeValue == 'date') {
                        scope.onLoad();
                    }
                }, true);
                scope.onChangeValue = function () {
                    if (scope.typeValue == 'date') {
                        
                    }
                    else if (scope.typeValue == 'checkbox' || scope.typeValue == 'radio') {
                        
                    }
                    else if (scope.typeValue == 'select') {
                        
                    }
                    else {
                        scope.inputChange();
                    }
                    scope.model = scope.modelValue;
                    if (scope.onChange) scope.onChange();
                }
                scope.inputChange = function(){
                    if(scope.typeValue == 'tel'){
                        if(scope.type == 'mobile'){
                            scope.mobilePhoneFormat();
                        }
                        else if(scope.type == 'rt/rw'){
                            scope.rtRwFormat();
                        }
                        else{
                            scope.onlyNumber();
                        }
                    }
                    else if(scope.typeValue == 'text' && scope.type != 'email'){
                        if(scope.type == 'address'){
                            scope.addressFormat();
                        }
                        else{
                            scope.onlyLetterAndSpace();
                        }
                    }
                    var modelLength = scope.modelValue.length;
                    if(modelLength > scope.maxlength){
                        scope.modelValue = scope.modelValue.substring(0, scope.maxlength);
                    }
                }
                scope.onlyNumber = function (){
                    var re = /^[0-9]*$/;
                    if(!re.test(scope.modelValue)){
                        scope.modelValue = scope.modelValue.replace(/[^0-9]+/g, "");
                    }
                }
                scope.mobilePhoneFormat = function(){
                    var modelLength = scope.modelValue.length;
                    var newChar = scope.modelValue[modelLength -1];
                    var re = /^[0-9]*$/;
                    if(!re.test(scope.modelValue)){
                        scope.modelValue = scope.modelValue.replace(/[^0-9]+/g, "");
                    }
                    if(modelLength == 1 && newChar != '0'){
                        scope.modelValue = '';
                    } else if(modelLength == 2 && newChar != '8'){
                        scope.modelValue = '0';
                    }
                }
                scope.rtRwFormat = function(){
                    var re = /^[/0-9]*$/;
                    if(!re.test(scope.modelValue)){
                        scope.modelValue = scope.modelValue.replace(/[^/0-9]+/g, "");
                    }
                }
                scope.onlyLetterAndSpace = function(){
                    var re = /^[a-zA-Z ]*$/;
                    if(!re.test(scope.modelValue)){
                        scope.modelValue = scope.modelValue.replace(/[^a-zA-Z ]+/g, "");
                    }
                }
                scope.addressFormat = function(){
                    var re = /^[a-zA-Z0-9 .://-]*$/;
                    if(!re.test(scope.modelValue)){
                        scope.modelValue = scope.modelValue.replace(/[^a-zA-Z0-9 .://-]+/g, "");
                    }
                }
                scope.inputFocus = function () {
                    scope.labelClass = 'focus';
                    scope.inputClass = 'focus';
                }
                scope.inputBlur = function () {
                    if ((scope.modelValue == '' || scope.modelValue == undefined) && scope.typeValue != 'select' && scope.typeValue != 'checkbox' && scope.typeValue != 'date' && scope.typeValue != 'radio' && scope.typeValue != 'separator') {
                        scope.labelClass = 'empty';
                    }
                    else {
                        scope.labelClass = '';
                    }
                    scope.inputClass = '';
                    scope.onBlur();
                }
                scope.dateChange = function () {
                    //if (scope.onChange) scope.onChange();
                    if (scope.selectedYear + '' != '' &&
                        scope.selectedMonth + '' != '' &&
                        scope.selectedDay + '' != '') {
                        scope.modelValue = new Date(scope.selectedYear, scope.selectedMonth, scope.selectedDay);
                        scope.onChangeValue();
                    }
                }
                scope.dateCalendarChange = function () {
                    //if (scope.onChange) scope.onChange();
                    if (scope.modelValue == '' || scope.modelValue == null || scope.modelValue == undefined) {
                        scope.selectedYear = '';
                        scope.selectedMonth = '';
                        scope.selectedDay = '';
                    }
                    else {
                        scope.selectedYear = new Date(scope.modelValue).getFullYear();
                        scope.selectedMonth = new Date(scope.modelValue).getMonth();
                        scope.selectedDay = new Date(scope.modelValue).getDate();
                        
                        scope.days = [];
                        for (var i = 1; i <= moment().month(scope.selectedMonth).year(scope.selectedYear).daysInMonth(); i++) {
                            scope.days.push({ text: i, value: i });
                        }
                    }
                    scope.onChangeValue();
                }
                scope.toogleTooltip = function() {
                    if(scope.tooltiptype != 'register'){
                        scope.isTooltipShow = !scope.isTooltipShow;
                    } else {
                        scope.onTooltipClick();
                    }
                    
                }
                scope.onLoad = function () {
                    if (scope.typeValue == 'date') {
                        scope.days = [];
                        scope.months = [];
                        scope.years = [];
                        scope.selectedYear = new Date().getFullYear();
                        scope.selectedMonth = new Date().getMonth();
                        scope.selectedDay = new Date().getDate();
                        scope.minYearValue = scope.minYear ? scope.minYear : 1900;
                        scope.maxYearValue = scope.maxYear ? scope.maxYear : scope.selectedYear + 200;
                        var daysInMonth = 31;
                        //daysInMonth = moment().month(scope.selectedMonth).year(scope.selectedYear).daysInMonth();
                        for (var i = 1; i <= daysInMonth; i++) {
                            scope.days.push({ text: i, value: i });
                        }
                        for (var i = 0; i < 12; i++) {
                            scope.months.push({ text: moment().month(i).locale(scope.locale ? scope.locale : 'id').format("MMM"), value: i });
                        }
                        for (var i = scope.minYearValue; i <= scope.maxYearValue; i++) {
                            scope.years.push({ text: i, value: i });
                        }
                        scope.dateCalendarChange();
                    }
                    scope.inputBlur();
                }
                scope.onLoad();
            },
            templateUrl: './directive/inputHandling/inputHandling.html'
        };
    });