rootApp
.directive('customerPage', function() {
	return {
		restrict: 'E',
		templateUrl: './pages/customer/customer.html'
	};
})
.controller('customerPageController', function($scope, $timeout, API) {
	$scope.isShow = false;
	$scope.pageClass = $scope.stringEmpty;
	$scope.pageIndex = 0;

	$scope.navBarTop = {
		type: 5,
		title: $scope.globalMessage.CustomerPageTitle,
		left: '<i class="fa fa-fw fa-angle-left"></i>',
		onLeftClick: function () { $scope.onClose(); }
	};

	$scope.$on('showCustomerPage', function (event, args) {
		$scope.isShow = true;
		$timeout(function () {
			$scope.pageClass = "active";
		}, $scope.timeoutOpenPage);
		$scope.pageIndex = args.pageIndex;
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex });

		$timeout(function () {
			$scope.tab = ['active', $scope.stringEmpty, $scope.stringEmpty];
			$scope.onLoadNext = false;
			$scope.index = 0;
			$scope.draftList = [];
			$scope.sentList = [];
			$scope.isCertificateExist = false;
			$scope.formCertificateNo = { label: $scope.globalMessage.ResendCertificateLabelCertificateNo, value: $scope.stringEmpty, error: $scope.stringEmpty };
			$scope.formIdCard = { label: $scope.globalMessage.ResendCertificateLabelIdCard, value:$scope.stringEmpty, error: $scope.stringEmpty };
			$scope.formSearch = {
				certificateNumber:$scope.stringEmpty,
				nik:$scope.stringEmpty,
				name:$scope.stringEmpty,
				date:$scope.stringEmpty
			}
			$scope.form2Status = {
				label: $scope.stringEmpty,
				error: $scope.stringEmpty,
				value: $scope.stringEmpty,
				type: 'select',
				options: [
					{ text: $scope.globalMessage.CustomerSearchAllStatus, value: $scope.stringEmpty }
				]
			}
			$scope.form2Search = {
				label: $scope.globalMessage.CustomerSearchName,
				error: $scope.stringEmpty,
				value: $scope.stringEmpty,
				type: 'text'
			}

			$timeout(function () {
				$scope.getDraftList();
			}, $scope.timeoutClosePage);
		}, $scope.timeoutOpenPage);
	});

	$scope.$on('closePage', function (event, args) {
		if ($scope.pageIndex == args.pageIndex) {
			$scope.onClose();
		}
	});

	$scope.onClose = function () {
		$scope.pageClass = $scope.stringEmpty;
		$timeout(function () {
			$scope.isShow = false;
		}, $scope.timeoutClosePage);
		$scope.$emit('setPageIndex', { pageIndex: $scope.pageIndex - 1 });
		$scope.pageIndex = 0;

		$scope.checkNotification();
		$scope.checkEStatement();
	}

	$scope.changeTab = function (param) {
		$scope.tab[0] = $scope.stringEmpty;
		$scope.tab[1] = $scope.stringEmpty;
		$scope.tab[2] = $scope.stringEmpty;
		$scope.tab[param] = 'active';
	}

	$scope.addSubmissionClick = function () {
		$scope.globalShowLoading();
		if($scope.globalData.isFromStaging != undefined
		&& $scope.globalData.isFromStaging == true){
			$timeout(function () {
				$scope.$broadcast('showSubmissionPage', { pageIndex: $scope.pageIndex + 1, applicationNumber: $scope.stringEmpty });
			}, $scope.timeoutOpenPage);
		} else {
			var checkStatusPromise = API.SubmissionGetCurrentStatus();
			checkStatusPromise.then(function (args) {
				if (args.errorCode == -1) {
					$scope.$emit('goToHomePage');
					if (!$scope.$$phase) $scope.$apply();
					$scope.globalHideLoading();
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
				else if (args.value.allowCreate == true) {
					$timeout(function () {
						$scope.$broadcast('showSubmissionPage', { pageIndex: $scope.pageIndex + 1, applicationNumber: $scope.stringEmpty });
					}, $scope.timeoutOpenPage);
				}
				else {
					if (args.value.allowUpdate == false) {
						var errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUpdate;
						if (!args.value.isTrainingCompleted) {
							errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUnfinishedTraining;
						}
						try {
							navigator.notification.alert(
								errorMessage,
								function () { },
								$scope.globalMessage.PopUpTitle,
								$scope.globalMessage.PopUpButtonOK
							);
						}
						catch (err) { alert(errorMessage); }
					}
					else {
						var errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeCreate.format(args.value.maxCreateSubmission);
						if (!args.value.isTrainingCompleted) {
							errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUnfinishedTraining;
						}
						try {
							navigator.notification.alert(
								errorMessage,
								function () { },
								$scope.globalMessage.PopUpTitle,
								$scope.globalMessage.PopUpButtonOK
							);
						}
						catch (err) { alert(errorMessage); }
					}
					$scope.globalHideLoading();
				}
			},
			function (error) {
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationErrorConnectionFailed,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
				$scope.globalHideLoading();
			});
		}
	}

	$scope.onCardClick = function (parm) {
		$scope.globalShowLoading();
		var checkStatusPromise = API.SubmissionGetCurrentStatus();
		checkStatusPromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else if (args.value.allowUpdate == true) {
				$timeout(function () {
					$scope.$broadcast('showSubmissionPage', { pageIndex: $scope.pageIndex + 1, applicationNumber: parm });
				}, $scope.timeoutOpenPage);
			}
			else {
				var errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUpdate;
				if (!args.value.isTrainingCompleted) {
					errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUnfinishedTraining;
				}
				try {
					navigator.notification.alert(
						errorMessage,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert(errorMessage); }
				$scope.globalHideLoading();
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
		});
	}

	$scope.getDraftList = function () {
		$scope.draftList = [];
		$scope.globalShowLoading();
		var getDraftPromise = API.SubmissionGetDraft();
		getDraftPromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else {
				args.value.forEach(function(value) {
					$scope.draftList.push({
						id: value.applicationNumber,
						message:
							'<table class="customer-card-table">' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardStatus + '</td>' +
									'<td>:</td>' +
									'<td>' + value.status + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardApplicationNumber + '</td>' +
									'<td>:</td>' +
									'<td>' + value.applicationNumber + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardIdCard + '</td>' +
									'<td>:</td>' +
									'<td>' + value.idCard + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardName + '</td>' +
									'<td>:</td>' +
									'<td>' + value.name + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardPremi + '</td>' +
									'<td>:</td>' +
									'<td>' + $scope.globalMessage.CustomerCardCurrency.format(value.premi.toLocaleString().replaceAll(',', '.')) + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardCompesation + '</td>' +
									'<td>:</td>' +
									'<td>' + $scope.globalMessage.CustomerCardCurrency.format(value.compensation.toLocaleString().replaceAll(',', '.')) + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardPaymentMethod + '</td>' +
									'<td>:</td>' +
									'<td>' + (value.paymentMethod == null ? $scope.stringEmpty : value.paymentMethod) + '</td>' +
								'</tr>' +
							'</table>'
					});
				});
				$timeout(function () {
					$scope.getSentStatusList();
				}, $scope.timeoutClosePage);
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
			$scope.onClose();
		});
	}

	$scope.getSentStatusList = function () {
		$scope.form2Status.options = [{ text: '--Pilih Status--', value: $scope.stringEmpty }];
		$scope.globalShowLoading();
		var getDraftPromise = API.SubmissionGetSentStatus();
		getDraftPromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else {
				args.value.forEach(function(value) {
					$scope.form2Status.options.push({
						text: value.status,
						value: value.status
					});
				});
				$timeout(function () {
					$scope.getSentList();
				}, $scope.timeoutClosePage);
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
			$scope.onClose();
		});
	}

	$scope.getSentList = function () {
		$scope.index = 0;
		$scope.sentList = [];
		$scope.form2Status.value = $scope.stringEmpty;
		$scope.form2Search.value = $scope.stringEmpty;
		$scope.getSent();
	}

	$scope.getSentSearch = function () {
		$scope.index = 0;
		$scope.sentList = [];
		$scope.getSent({isFromSearch: true});
	}

	$scope.getSentNext = function () {
		if (!$scope.onLoadNext) {
			$scope.onLoadNext = true;
			$scope.globalShowLoading();
			$timeout(function () {
				$scope.getSent();
			}, 1500);
		}
	}

	$scope.getSent = function (parm) {
		$scope.globalShowLoading();
		var getSentPromise = API.SubmissionGetSent($scope.form2Status.value, $scope.form2Search.value, $scope.index);
		getSentPromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else {
				if(args.value.length > 0)
					$scope.index = $scope.index + 1;
				else {
					if (parm && parm.isFromSearch) {
						try {
							navigator.notification.alert(
								$scope.globalMessage.CustomerPopUpNoDataFound,
								function () { },
								$scope.globalMessage.PopUpTitle,
								$scope.globalMessage.PopUpButtonOK
							);
						}
						catch (err) { alert($scope.globalMessage.CustomerPopUpNoDataFound); }
					}
				}
				args.value.forEach(function(value) {
					var issuedDate = $scope.stringEmpty;
					//if (new Date(value.submissionDate).getFullYear() > 1900)
						issuedDate = moment(value.submissionDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
					// else
					// 	issuedDate = '-';
					$scope.sentList.push({
						id: value.certificateNumber,
						message:
							'<table class="customer-card-table">' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardStatus + '</td>' +
									'<td>:</td>' +
									'<td>' + value.status + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardCertificateNumber + '</td>' +
									'<td>:</td>' +
									'<td>' + (value.certificateNumber == null ? '-' : value.certificateNumber) + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardIdCard + '</td>' +
									'<td>:</td>' +
									'<td>' + value.idCard + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardName + '</td>' +
									'<td>:</td>' +
									'<td>' + value.name + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardSubmissionDate + '</td>' +
									'<td>:</td>' +
									'<td>' + issuedDate + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardPremi + '</td>' +
									'<td>:</td>' +
									'<td>' + $scope.globalMessage.CustomerCardCurrency.format(value.premi.toLocaleString().replaceAll(',', '.')) + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardCompesation + '</td>' +
									'<td>:</td>' +
									'<td>' + $scope.globalMessage.CustomerCardCurrency.format(value.compensation.toLocaleString().replaceAll(',', '.')) + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardPaymentMethod + '</td>' +
									'<td>:</td>' +
									'<td>' + value.paymentMethod + '</td>' +
								'</tr>' +
								'<tr>' +
									'<td>' + $scope.globalMessage.CustomerCardPaymentDueDate + '</td>' +
									'<td>:</td>' +
									'<td>' + (moment(value.paymentDueDate).year() > 1900 ? moment(value.paymentDueDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatPaymentDueDate) : '-') + '</td>' +
								'</tr>' +
							'</table>',
						certificateNumber: value.certificateNumber,
						idCard: value.idCard
					});
				});
				$scope.onLoadNext = false;
				$scope.globalHideLoading();
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
			$scope.onClose();
		});
	}

	$scope.onDataChange = function(parm) {
		$scope.formData[parm.id].value = parm.value;
	}

	$scope.searchClick = function() {
		var isValid = true;

		$scope.formCertificateNo.error = $scope.stringEmpty;
		$scope.formIdCard.error = $scope.stringEmpty;
		$scope.isCertificateExist = false;

		if ($scope.formCertificateNo.value == $scope.stringEmpty) {
			isValid = false;
			$scope.formCertificateNo.error = $scope.globalMessage.ResendCertificateErrorCertificateNo;
		}
		if ($scope.formIdCard.value == $scope.stringEmpty) {
			isValid = false;
			$scope.formIdCard.error = $scope.globalMessage.ResendCertificateErrorIdCard;
		}

		if (isValid) {
			$scope.globalShowLoading();
			var promise = API.SubmissionSearchPolicy($scope.formCertificateNo.value, $scope.formIdCard.value);
			promise.then(function (args) {
				if (args.errorCode == -1) {
					$scope.$emit('goToHomePage');
					if (!$scope.$$phase) $scope.$apply();
					$scope.globalHideLoading();
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
				else {
					$scope.formSearch.certificateNumber = args.value.policyNumber;
					$scope.formSearch.nik = args.value.idCard;
					$scope.formSearch.name = args.value.name;
					$scope.formSearch.date = moment(args.value.issuedDate).locale($scope.globalMomentLocale).format($scope.globalDateFormatMin);
					if ($scope.formSearch.certificateNumber != null && $scope.formSearch.certificateNumber != undefined && $scope.formSearch.certificateNumber != $scope.stringEmpty)
						$scope.isCertificateExist = true;
					else
						$scope.formIdCard.error = $scope.globalMessage.ResendErrorResendNotFound;
					$scope.globalHideLoading();
				}
			},
			function (error) {
				try {
					navigator.notification.alert(
						$scope.globalMessage.ApplicationErrorConnectionFailed,
						function () { },
						$scope.globalMessage.PopUpTitle,
						$scope.globalMessage.PopUpButtonOK
					);
				}
				catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
				$scope.globalHideLoading();
			});
		}
	}

	$scope.resendCertificate = function() {
		// navigator.notification.prompt(
		// 	$scope.globalMessage.ResendCertificatePopUpMessage,
		// 	function(parm) {
		// 		if(parm.buttonIndex == 1) {
					$scope.globalShowLoading();
					//var promise = API.SubmissionResendPolicy($scope.formCertificateNo.value, $scope.formIdCard.value, parm.input1);
					var promise = API.SubmissionResendPolicy($scope.formCertificateNo.value, $scope.formIdCard.value, $scope.stringEmpty);
					promise.then(function (args) {
						if (args.errorCode == -1) {
							$scope.$emit('goToHomePage');
							if (!$scope.$$phase) $scope.$apply();
							$scope.globalHideLoading();
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
						else {
							var message = $scope.globalMessage.ResendPopUpResendSent.format($scope.formSearch.name, $scope.formSearch.certificateNumber);
							try {
								navigator.notification.alert(
									message,
									function () { },
									$scope.globalMessage.PopUpTitle,
									$scope.globalMessage.PopUpButtonOK
								);
							}
							catch (err) { alert(message); }
							$scope.formCertificateNo.value = $scope.stringEmpty;
							$scope.formIdCard.value = $scope.stringEmpty;
							$scope.isCertificateExist = false;
							$scope.globalHideLoading();
							$scope.onClose();
							if (!$scope.$$phase) $scope.$apply();
						}
					},
					function (error) {
						try {
							navigator.notification.alert(
								$scope.globalMessage.ApplicationErrorConnectionFailed,
								function () { },
								$scope.globalMessage.PopUpTitle,
								$scope.globalMessage.PopUpButtonOK
							);
						}
						catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
						$scope.globalHideLoading();
						if (!$scope.$$phase) $scope.$apply();
					});
		// 		}
		// 	},
		// 	$scope.globalMessage.PopUpTitle,
		// 	[$scope.globalMessage.ResendCertificatePopUpOK, $scope.globalMessage.ResendCertificatePopUpCancel],
		// 	$scope.stringEmpty
		// );
	}

	$scope.onCardDraftDelete = function(parm) {
		$scope.globalShowLoading();
		var checkStatusPromise = API.SubmissionGetCurrentStatus();
		checkStatusPromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else {
				if (args.value.allowUpdate == true) {
					try {
						navigator.notification.confirm(
							$scope.globalMessage.SubmissionPopUpMessageDelete,
							function (confirmParm) {
								if (confirmParm == 1) {
									$scope.deleteDraft(parm);
								}
								else{
									$scope.globalHideLoading();
								}
								if (!$scope.$$phase) $scope.$apply();
							},
							$scope.globalMessage.PopUpTitle,
							[$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
						)
					}
					catch (err) {
						if (confirm($scope.globalMessage.SubmissionPopUpMessageDelete)) {
							$scope.deleteDraft(parm);
						}
						else{
							$scope.globalHideLoading();
						}
					}
				}
				else {
					var errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUpdate;
					if (!args.value.isTrainingCompleted) {
						errorMessage = $scope.globalMessage.SubmissionErrorUnauthorizeUnfinishedTraining;
					}
					try {
						navigator.notification.alert(
							errorMessage,
							function () { },
							$scope.globalMessage.PopUpTitle,
							$scope.globalMessage.PopUpButtonOK
						);
					}
					catch (err) { alert(errorMessage); }
					$scope.globalHideLoading();
				}
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
		});
	}

	$scope.onCardSentResend = function(parm) {
		$scope.formCertificateNo.value = $scope.sentList.filter(function (args) { return args.id == parm; })[0].certificateNumber;
		$scope.formIdCard.value = $scope.sentList.filter(function (args) { return args.id == parm; })[0].idCard;
		$scope.changeTab(2);
		$scope.searchClick();
	}

	$scope.deleteDraft = function(parm) {
		var deletePromise = API.SubmissionDrop(parm);
		deletePromise.then(function (args) {
			if (args.errorCode == -1) {
				$scope.$emit('goToHomePage');
				if (!$scope.$$phase) $scope.$apply();
				$scope.globalHideLoading();
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
			else {
				$scope.getDraftList();
				$scope.globalHideLoading();
			}
		},
		function (error) {
			try {
				navigator.notification.alert(
					$scope.globalMessage.ApplicationErrorConnectionFailed,
					function () { },
					$scope.globalMessage.PopUpTitle,
					$scope.globalMessage.PopUpButtonOK
				);
			}
			catch (err) { alert($scope.globalMessage.ApplicationErrorConnectionFailed); }
			$scope.globalHideLoading();
		});
	}
});
