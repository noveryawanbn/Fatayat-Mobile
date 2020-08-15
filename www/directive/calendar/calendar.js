angular
.module('calendar', [])
.directive('calendarDirective', function() {
	return {
		restrict: "E",
		scope: {
			calendarEvents: '=',//[{id: '', date: new Date(), title: ''}]
			onViewChange: '&',
			onEventClick: '&'
		},
		templateUrl: './directive/calendar/calendar.html'
	};
})
.filter("selectedDateFilter", function() {
	return function(items, date) {
		return items.filter (
			function(item) {
				return (
					item.date.getDate() == date.getDate() &&
					item.date.getMonth() == date.getMonth() &&
					item.date.getFullYear() == date.getFullYear()
				);
			}
		);
	};
})
.controller('calendarDirectiveController', function($scope) {
	$scope.dateSelected = new Date();
	$scope.dateView = new Date(new Date().setDate(1));
	$scope.days = [0, 1, 2, 3, 4, 5, 6];
	$scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	$scope.dates = [];
	$scope.years = [];
	$scope.isModalShow = false;
	$scope.selectedYear = new Date().getFullYear();

	var month = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	],
	day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	$scope.getMonthName = function(parm) {
		return month[parm];
	}
	$scope.addMonth = function(parm) {
		$scope.dateView = new Date($scope.dateView.setMonth($scope.dateView.getMonth() + parm));
		$scope.refreshDateView();
	};
	$scope.showDate = function() {
		return month[$scope.dateView.getMonth()] + ' ' + $scope.dateView.getFullYear();
	};
	$scope.showDay = function(parm) {
		return day[parm];
	};
	$scope.getDateClass = function(parmDate, parmMonth, parmYear) {
		var dateClass = '';
		if(parmYear == $scope.dateSelected.getFullYear() &&
		parmMonth == $scope.dateSelected.getMonth() &&
		parmDate == $scope.dateSelected.getDate()) {
			dateClass += 'selected ';
		}
		if(parmMonth != $scope.dateView.getMonth()) {
			dateClass += 'other-month '
		}
		if($scope.calendarEvents.filter(
			function(calendarEvent) {
				return (
					calendarEvent.date.getDate() == parmDate &&
					calendarEvent.date.getMonth() == parmMonth &&
					calendarEvent.date.getFullYear() == parmYear
				);
			}
		).length > 0) {
			dateClass += 'alert ';
		}
		if(new Date(parmYear, parmMonth, parmDate).getDay() == 0) {
			dateClass += 'holiday ';
		}
		return dateClass;
	};
	$scope.showSelectedDate = function() {
		return $scope.dateSelected.getDate() + ' ' + month[$scope.dateSelected.getMonth()] + ' ' + $scope.dateSelected.getFullYear();
	}
	$scope.refreshDateView = function() {
		var date = new Date($scope.dateView);
		date = new Date(date.setDate(1));
		date = new Date(date.setDate(date.getDate() - date.getDay()));
		$scope.dates = [];
		do {
			$scope.dates.push({
				date : date.getDate(),
				month : date.getMonth(),
				year : date.getFullYear()
			});
			date = new Date(date.setDate(date.getDate() + 1));
		} while (
			date.getFullYear() < $scope.dateView.getFullYear() ||
			(
				date.getFullYear() > $scope.dateView.getFullYear() &&
				date.getDay() > 0
			) ||
			(
				date.getFullYear() == $scope.dateView.getFullYear() &&
				(
					date.getMonth() <= $scope.dateView.getMonth() ||
					(
						date.getMonth() > $scope.dateView.getMonth() &&
						date.getDay() > 0
					)
				)
			)
		);
		$scope.onViewChange({parm : { month : date.getMonth(), year : date.getFullYear() }});
	};
	$scope.getYears = function() {
		$scope.years = [];
		for(var i = new Date().getFullYear() - 20; i < new Date().getFullYear() + 20; i++) {
			$scope.years.push(i);
		}
	};
	$scope.dateClick = function(parmDate, parmMonth, parmYear) {
		$scope.dateView = new Date($scope.dateView.setDate(1));
		if(parmYear != $scope.dateView.getFullYear() ||
		parmMonth != $scope.dateView.getMonth()) {
			$scope.dateView = new Date($scope.dateView.setYear(parmYear));
			$scope.dateView = new Date($scope.dateView.setMonth(parmMonth));
			$scope.dateSelected = new Date($scope.dateView.setDate(parmDate));
			$scope.refreshDateView();
		}
		else {
			$scope.dateSelected = new Date($scope.dateView.setDate(parmDate));
		}
	};
	$scope.selectedDateClick = function() {
		$scope.dateView = new Date($scope.dateView.setYear($scope.dateSelected.getFullYear()));
		$scope.dateView = new Date($scope.dateView.setMonth($scope.dateSelected.getMonth()));
		$scope.refreshDateView();
	};
	$scope.calendarModalShow = function(parm) {
		$scope.selectedYear = $scope.dateView.getFullYear();
		$scope.isModalShow = parm;
	}
	$scope.selectMonthClick = function(parm) {
		$scope.dateView = new Date($scope.dateView.setYear($scope.selectedYear));
		$scope.dateView = new Date($scope.dateView.setMonth(parm));
		$scope.refreshDateView();
		$scope.calendarModalShow(false);
	}
	$scope.todayClick = function() {
		var date = new Date();
		$scope.selectedYear = date.getFullYear();
		$scope.dateClick(date.getDate(), date.getMonth(), date.getFullYear());
		$scope.calendarModalShow(false);
	}
	$scope.controllerOnLoad = function() {
		$scope.refreshDateView();
		$scope.getYears();
	};

	$scope.controllerOnLoad();
});
