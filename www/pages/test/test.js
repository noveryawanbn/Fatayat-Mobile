rootApp
.directive('testPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/test/test.html'
	};
})
.controller('testPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;
	$scope.isPreProductTest = false;
	$scope.isPostProductTest = false;
	$scope.isAmlTest = false;
	$scope.isFromStaging = false;

	$scope.navBarTop = {
		type: 5,
		title: 'TEST',
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.$on('showTestPage', function (event, args) {
		$scope.globalShowLoading();
		$scope.numberOfPages = 1;
		$scope.currentPageNumber = 1;
		$scope.questionPerPage = 5;
		$scope.testForms = [];
		$scope.questionType = 0;
		$scope.isShow = true;
		$timeout( function(){
            $scope.pageClass = "active";
        }, $scope.timeoutOpenPage );
		$scope.pageIndex = args.pageIndex;
		$scope.trainingPage = args.trainingPage;
		$scope.isFromStaging = args.isFromStaging;
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex });

		$scope.isPreProductTest = ($scope.trainingPage.productPreTestDisabled == $scope.stringEmpty) ? true : false;
		$scope.isPostProductTest = ($scope.trainingPage.productPostTestDisabled == $scope.stringEmpty) ? true : false;
		$scope.isAmlTest = ($scope.trainingPage.amlPostTestDisabled == $scope.stringEmpty) ? true : false;

		if($scope.isPreProductTest){
			$scope.navBarTop.title = $scope.globalMessage.PretestProductTitlePage;
		}
		else if($scope.isPostProductTest){
			$scope.navBarTop.title = $scope.globalMessage.PosttestProductTitlePage;
		}
		else if($scope.isAmlTest){
			$scope.navBarTop.title = $scope.globalMessage.AmlTestProductTitlePage;
		}

		var promise = API.GetQuestions();
		promise.then(function (response) {
			if (response.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationUserExpired,
						function () { },
						$scope.stringEmpty,
						$scope.globalMessage.PopUpButtonClose
					);
				}
				catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
			}
			else if(response.errorCode == 1){
				$scope.alertDialog($scope.globalMessage.TrainingErrorOther, $scope.globalMessage.PopUpTitle, $scope.globalMessage.PopUpButtonOK);
			}
			else {
				if(response && response.value){
					$scope.questionType = response.value.questionType;
					var listQuestion = response.value.questions;
					var pageNumber = 0;
					if(listQuestion){
						for(var i=0; i<listQuestion.length; i++){
							if(listQuestion[i]){
								if(i == 0 || i % $scope.questionPerPage == 0){
									pageNumber++;
									$scope.testForms.push({
										pageNumber: pageNumber,
										class: (i == 0) ? 'test-content-1' : 'test-content-2',
										content: []
									});
								}
								var options = [];
								var listAnswer = listQuestion[i].answers;
								if(listAnswer){
									for(var j=0; j<listAnswer.length; j++){
										options.push({
											text: listAnswer[j].answerText, value: listAnswer[j].answerId
										})
									}
								}
								$scope.testForms[pageNumber-1].content.push({
									value:$scope.stringEmpty,
									no: i+1,
									question: listQuestion[i].question,
									type: 'radio',
									options: options,
									questionId: listQuestion[i].questionId
								});
							}
						}
					}
					$scope.numberOfPages = pageNumber;
				}
			}
			$scope.globalHideLoading();
		}, function (error){
			$scope.alertDialog($scope.globalMessage.ApplicationErrorConnectionFailed, $scope.globalMessage.PopUpTitle, $scope.globalMessage.PopUpButtonOK);
			$scope.globalHideLoading();
		});
	});

	$scope.$on('closePage', function (event, args) {
		if($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
	});

	$scope.onClose = function() {
		var isValid = $scope.validateTestPerPage();
		if(isValid){
			$scope.closePage();
		}
		else{
			try {
				navigator.notification.confirm(
					$scope.globalMessage.TestExitConfirmMessage,
					function (confirmParm) {
						if (confirmParm == 1) {
							$scope.closePage();
						}
					},
					$scope.globalMessage.TestExitConfirmTitle,
					[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
				)
			}
			catch (err) {
				if (confirm($scope.globalMessage.TestExitConfirmMessage)) {
					$scope.closePage();
				}
			}
		}
	}

	$scope.closePage = function(){
		$scope.pageClass = $scope.stringEmpty;
		$scope.trainingPage.GetTrainingStatus();
		$timeout( function(){
			$scope.isShow = false;
		}, $scope.timeoutClosePage );
		$scope.$emit('setPageIndex', { pageIndex : $scope.pageIndex - 1 });
		$scope.pageIndex = 0;
	}

	$scope.validateTestPerPage = function(){
		var isValid = true;
		var page = $scope.testForms[$scope.currentPageNumber-1];
		if (page && page.content.length > 0) {
			for(var i=0; i<page.content.length; i++){
				if(page.content[i].value == $scope.stringEmpty){
					isValid = false;
					break;
				}
			}
		}
		return isValid;
	}

	$scope.alertDialog = function(message, title, btnTitle){
		try {
			navigator.notification.alert(
				message,
				function () { },
				title,
				btnTitle
			);
		}
		catch (err) { alert(message); }
	}

	$scope.nextClick = function() {
		var isValid = $scope.validateTestPerPage();
		if(!isValid){
			$scope.alertDialog($scope.globalMessage.TrainingValidationMessage, $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
		}
		else{
			$scope.currentPageNumber++;
			$scope.testForms[$scope.currentPageNumber-1].class = 'test-content-2 active';
		}
	}

	$scope.prevClick = function() {
		$scope.testForms[$scope.currentPageNumber-1].class = 'test-content-2';
		$scope.currentPageNumber--;
	}

	$scope.doneClick = function() {
		var isValid = $scope.validateTestPerPage();
		if(!isValid){
			$scope.alertDialog($scope.globalMessage.TrainingValidationMessage, $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
		}
		else{
			var questions = [];
			for(var i=0; i<$scope.testForms.length; i++){
				var page = $scope.testForms[i];
				for(var j=0; j<page.content.length; j++){
					questions.push({
						questionId: page.content[j].questionId,
						chosenAnswer: page.content[j].value
					});
				}
			}
	
			$scope.globalShowLoading();
			var promise = API.SendScore($scope.questionType, questions, $scope.isFromStaging);
			promise.then(function (response) {
				if(response != null){
					if (response.errorCode == -1) {
						$scope.$emit('goToHomePage');
						if (!$scope.$$phase) $scope.$apply();
						try {
							navigator.notification.alert(
								$scope.globalMessage.ApplicationUserExpired,
								function () { },
								$scope.stringEmpty,
								$scope.globalMessage.PopUpButtonClose
							);
						}
						catch (err) { alert ($scope.globalMessage.ApplicationUserExpired); }
					}
					else if(response.errorCode == 1 || response.errorCode == 3){
						$scope.alertDialog($scope.globalMessage.TrainingErrorOther, $scope.globalMessage.PopUpTitle, $scope.globalMessage.PopUpButtonOK);
					}
					else if(response.errorCode == 2){
						if($scope.isAmlTest){
							$scope.alertDialog($scope.globalMessage.TrainingAmlNotPassedMessage, $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
						}
						else if($scope.isPostProductTest){
							var message = $scope.globalMessage.TrainingScoreMessage.format(response.value) + "\n\n";
							message += $scope.globalMessage.TrainingNotPassedMessage;
							$scope.alertDialog(message, $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
							$scope.onClose();
						}
					}
					else {
						if(!$scope.isPreProductTest){
							var message = $scope.stringEmpty;
							if($scope.isPostProductTest){
								message = $scope.globalMessage.TrainingScoreMessage.format(response.value) + "\n\n";
							}
							message += $scope.globalMessage.TrainingPassedMessage;
							$scope.alertDialog(message, $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
						}
						else{
							$scope.alertDialog($scope.globalMessage.TrainingScoreMessage.format(response.value), $scope.stringEmpty, $scope.globalMessage.PopUpButtonClose);
						}
						$scope.onClose();
					}
				}
				$scope.globalHideLoading();
			}, function (error){
				$scope.alertDialog($scope.globalMessage.ApplicationErrorConnectionFailed, $scope.globalMessage.PopUpTitle, $scope.globalMessage.PopUpButtonOK);
				$scope.globalHideLoading();
			});
		}
	}
});
