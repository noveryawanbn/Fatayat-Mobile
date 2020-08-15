var lastIdleTime = new Date();
var isOnLogout = false;

var app = {
    init: function () {
        document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", this.onBackKeyDown.bind(this), false);
        document.addEventListener("pause", this.updateIdleTime, false);
        document.addEventListener("resume", this.updateIdleTime, false);
        document.addEventListener('touchstart', this.updateIdleTime, false);
        document.addEventListener('touchend', this.updateIdleTime, false);
    },
    onDeviceReady: function () {
        MobileAccessibility.usePreferredTextZoom(false);
    },
    onBackKeyDown: function (e) {
        e.preventDefault();
    },
    updateIdleTime: function () {
        lastIdleTime = new Date();
    }
};
app.init();

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var rootApp = angular
    .module('rootApp', [
        'card',
        'cardAction',
        'cardCustomer',
        'cardMaterial',
        'dialogSelect',
        'floatingButton',
        'gridTile',
        'inputHandling',
        'inputQuestionnaire',
        'navBarTop',
        'pdfViewer'
    ])
    .directive('onScrollToBottom', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                element.bind("scroll", function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attrs.onScrollToBottom);
                    }
                });
            }
        };
    })
    .controller('rootController', function ($scope, API, $timeout, $interval) {
        $scope.stringEmpty = '';
        $scope.globalData = {}
        $scope.globalMessage = Technosoft.Model.Message;
        $scope.globalCheckNotificationTimeout = 10000; //Check notification every 10 second
        $scope.globalDateFormatFull = 'DD MMMM YYYY, HH:mm';
        $scope.globalDateFormatMin = 'DD MMM YYYY';
        $scope.globalDateFormatPaymentDueDate = 'DD MMMM';
        $scope.globalMomentLocale = 'id';
        $scope.timeoutClosePage = 500;
        $scope.timeoutOpenPage = 100;
        $scope.otpMaxRequest = 3;
        $scope.otpTime = 5;//time left in minute before another otp request
        $scope.pageIndex = 0;
        $scope.isLoadingShow = false;
        $scope.appVersion = API.AppVersion;
        $scope.maxIdleTime = 30;

        $timeout ( function() {
            try {
                navigator.splashscreen.hide();
                $scope.checkVersion(false);
                $scope.pushNotification();
                $scope.setContactUs();
            }
            catch (err) {}
        }, 1000 );

        $interval ( function() {
            $scope.checkIdle();
        }, 5000 )
        
        $scope.navBarTop = {
            type: 1,
            title: '<img class="nav-bar-top-directive-logo" src="img/logo-full.png" />',
        }
        $scope.email = {
            label: $scope.globalMessage.LoginLabelEmail,
            value: $scope.stringEmpty,
            error: $scope.stringEmpty
        }
        $scope.password = {
            label: $scope.globalMessage.LoginLabelPassword,
            value: $scope.stringEmpty,
            error: $scope.stringEmpty
        }

        $scope.globalShowLoading = function() {
            $scope.isLoadingShow = true;
            app.updateIdleTime();
        }

        $scope.globalHideLoading = function () {
            app.updateIdleTime();
            $scope.isLoadingShow = false;
        }

        $scope.$on('setPageIndex', function (event, args) {
            $scope.pageIndex = args.pageIndex;
            if ($scope.pageIndex < 0) {
                $scope.pageIndex = 0;
            }
        });
        $scope.$on('goToHomePage', function (event) {
            $scope.logout();
        });
        $scope.$on('goToMainMenuPage', function (event) {
            $scope.$broadcast('showMainMenuPage', { pageIndex: $scope.pageIndex + 1 });
        });

        $scope.checkIdle = function() {
            if ($scope.pageIndex > 0 && $scope.isLoadingShow == false && isOnLogout == false) {
                var TimeNow = new Date();
                var TimeElapsed = Math.round((TimeNow - lastIdleTime) / 1000);
                if (TimeElapsed > $scope.maxIdleTime * 60) {
                    $scope.logout();
                }
            }
        }
        $scope.logout = function() {
            isOnLogout = true;
            for (i = $scope.pageIndex; i > 0; i--) {
                $scope.$broadcast('closePage', { pageIndex: i, isForce: true });
            }
            $scope.pageIndex = 0;

            $scope.globalData = {}
            $scope.email.value = $scope.stringEmpty;
            $scope.email.error = $scope.stringEmpty;
            $scope.password.value = $scope.stringEmpty;
            $scope.password.error = $scope.stringEmpty;
            isOnLogout = false;
        }

        $scope.checkVersion = function(isLoginClick){
            $scope.globalShowLoading();
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1;
            if(isAndroid){
                cordova.getAppVersion.getVersionCode(function (version) {
                    $scope.callCheckVersionToServer(version, isLoginClick);
                });
            } else { 
                $scope.callCheckVersionToServer(999999999, isLoginClick)
            }
        }

        $scope.callCheckVersionToServer = function(version, isLoginClick){
            var promise = API.CheckVersion(version);
            promise.then(function (value) {
                if(value == true){
                    if(isLoginClick == true){
                        $scope.login();
                    }
                    else {
                        $scope.globalHideLoading();
                    }
                }
                else{
                    $scope.globalHideLoading();
                    try {
                        navigator.notification.alert(
                            $scope.globalMessage.ApplicationNeedToUpdateMessage,
                            function () {
                                try{
                                    var ua = navigator.userAgent.toLowerCase();
                                    var isAndroid = ua.indexOf("android") > -1;
                                    if(isAndroid){
                                        cordova.getAppVersion.getPackageName().then(function (packageName) {
                                            var googlePlayLink = 'market://details?id=' + packageName;
                                            window.location.replace(googlePlayLink);
                                        });
                                    }
                                }
                                catch (err) {}
                            },
                            $scope.globalMessage.ApplicationNeedToUpdateTitle,
                            $scope.globalMessage.PopUpButtonOK
                        );
                    }
                    catch (err) { 
                        alert($scope.globalMessage.ApplicationNeedToUpdateMessage);
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

        $scope.loginClick = function(){
            var isValid = true;
            $scope.email.error = $scope.stringEmpty;
            $scope.password.error = $scope.stringEmpty;
            if ($scope.email.value == $scope.stringEmpty) {
                $scope.email.error = $scope.globalMessage.LoginErrorEmptyEmail;
                isValid = false;
            }
            if ($scope.password.value == $scope.stringEmpty) {
                $scope.password.error = $scope.globalMessage.LoginErrorEmptyPassword;
                isValid = false;
            }
            if (isValid) {
                $scope.checkVersion(true);
            }
        }

        $scope.login = function () {
            $scope.globalShowLoading();
            var promise = API.Login($scope.email.value, $scope.password.value);
            promise.then(function (value) {
                if (value.errorCode == 0 && value.userStatus == 1 && value.userSuspend.toLowerCase() != 't') {
                    $scope.globalData.UserStatus = value.userStatus;
                    $scope.globalData.UserSuspend = value.userSuspend;
                    $scope.globalData.Name = value.name;
                    $scope.globalData.Email = value.email;
                    $scope.globalData.MobilePhone = value.mobilePhone;
                    $scope.globalData.TrainingProductStatus = value.trainingProductStatus;
                    $scope.globalData.TrainingProductExpiredDate = value.trainingProductExpiredDate;
                    $scope.globalData.TrainingAMLStatus = value.trainingAMLStatus;
                    $scope.globalData.TrainingAMLExpiredDate = value.trainingAMLExpiredDate;
                    $scope.globalData.OnboardingCount = value.onboardingCount;
                    $scope.globalData.OnboardingExpired = value.onboardingExpired;
                    $scope.globalData.OnboardingStatus = value.onboardingStatus;
                    $scope.globalData.EContractStatus = value.eContractStatus;
                    $scope.globalData.Token = value.tokenCode;
                    $scope.globalData.IsPasswordExpired = value.isPasswordExpired;
                    $scope.globalData.IsPasswordExpiring = value.isPasswordExpiring;
                    $scope.globalData.PasswordExpiredDate = value.passwordExpiredDate;
                    $scope.globalData.AgentCode = value.agentCode;
                    if (value.maxIdleTime > 0)
                        $scope.maxIdleTime = value.maxIdleTime;
                    else
                        $scope.maxIdleTime = 30;

                    if ($scope.globalData.OnboardingStatus) {
                        if ($scope.globalData.IsPasswordExpired) {
                            $scope.$broadcast('showChangePasswordExpiredPage', { pageIndex : $scope.pageIndex + 1 });
                        }
                        else {
                            $scope.$broadcast('showMainMenuPage', { pageIndex: $scope.pageIndex + 1 });
                        }
                    }
                    else {
                        $scope.$broadcast('showOnboardingPage', { pageIndex: $scope.pageIndex + 1 });
                    }
                    if (localStorage.getItem("UserId") != value.userId) {
                        localStorage.removeItem("LastNotificationId");
                        localStorage.removeItem("LastInboxId");
                    }
                    localStorage.setItem("UserId", value.userId);
                    localStorage.setItem("UIK", value.uik);
                    localStorage.setItem("AgentCode", value.agentCode);
                }
                else if(value.isFromStaging){
                    $scope.globalData.isFromStaging = true;
                    $scope.globalData.Token = value.tokenCode;
                    $scope.globalData.TrainingProductStatus = value.trainingProductStatus;
                    $scope.globalData.TrainingAMLStatus = value.trainingAMLStatus;
                    if (value.maxIdleTime > 0)
                        $scope.maxIdleTime = value.maxIdleTime;
                    else
                        $scope.maxIdleTime = 30;
                    if (localStorage.getItem("UserId") != value.userId) {
                        localStorage.removeItem("LastNotificationId");
                        localStorage.removeItem("LastInboxId");
                    }
                    localStorage.setItem("UserId", value.userId);
                    $scope.$broadcast('showMainMenuPage', { pageIndex: $scope.pageIndex + 1, isFromStaging: value.isFromStaging });
                } else {
                    var errorMessage = $scope.stringEmpty;
                    if (value.errorCode == 1) {
                        errorMessage = $scope.globalMessage.LoginErrorFailed;
                    }
                    else if (value.errorCode == 2) {
                        errorMessage = $scope.globalMessage.LoginErrorAccessCoreFailed;
                    }
                    else if (value.errorCode == 3) {
                        errorMessage = $scope.globalMessage.LoginErrorUserInactive;
                    }
                    else if (value.errorCode == 4) {
                        errorMessage = $scope.globalMessage.LoginErrorOther;
                    }
                    else if (value.errorCode == 5) {
                        errorMessage = $scope.globalMessage.SuspendWarningMessage;
                    }
                    else if (value.errorCode == 6) {
                        errorMessage = $scope.globalMessage.LoginErrorEmailChanged;
                    }
                    else if (value.userSuspend.toLowerCase() == "t"){
                        errorMessage = $scope.globalMessage.LoginErrorSuspended;
                    }
                    else {
                        errorMessage = $scope.globalMessage.ApplicationErrorConnectionFailed;
                    }
                    try {
                        navigator.notification.alert(
                            errorMessage,
                            function () { },
                            $scope.globalMessage.PopUpTitle,
                            $scope.globalMessage.PopUpButtonClose
                        );
                    }
                    catch (err) { alert(errorMessage); }
                }
                $scope.globalHideLoading();
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
        $scope.registerClick = function () {
            $scope.globalShowLoading();
            $scope.$broadcast('showRegisterPage', { pageIndex: $scope.pageIndex + 1 });
        }
        $scope.forgetPasswordClick = function () {
            $scope.$broadcast('showForgetPasswordPage', { pageIndex: $scope.pageIndex + 1 });
        }

        $scope.pushNotification = function() {
            if (localStorage.getItem('UserId') && localStorage.getItem('AgentCode')) {
                var promise = API.PushNotification(
                    localStorage.getItem('UserId'),
                    localStorage.getItem('UIK'),
                    localStorage.getItem('AgentCode'),
                    
                    localStorage.getItem('LastNotificationId') == null ||
                    localStorage.getItem('LastNotificationId') == undefined ||
                    isNaN(localStorage.getItem('LastNotificationId')) ? 0 :
                    parseInt(localStorage.getItem('LastNotificationId')),
                    
                    localStorage.getItem('LastInboxId') == null ||
                    localStorage.getItem('LastInboxId') == undefined ||
                    isNaN(localStorage.getItem('LastInboxId')) ? 0 :
                    parseInt(localStorage.getItem('LastInboxId'))
                );
                promise.then(function (result) {
                    var notificationList = [];
                    var values = result.notificationList;
                    if (values) {
                        for (var i = 0; i < values.length; i++) {
                            if (values[i].id.startsWith('N')) {
                                var lastNotificationId =
                                    localStorage.getItem('LastNotificationId') == null ||
                                    localStorage.getItem('LastNotificationId') == undefined ||
                                    isNaN(localStorage.getItem('LastNotificationId')) ? 0 :
                                    parseInt(localStorage.getItem('LastNotificationId'));
                                if (lastNotificationId < parseInt(values[i].id.substring(1)))
                                    lastNotificationId = parseInt(values[i].id.substring(1));
                                localStorage.setItem('LastNotificationId', lastNotificationId);
                            } else if (values[i].id.startsWith('I')) {
                                var lastInboxId =
                                    localStorage.getItem('LastInboxId') == null ||
                                    localStorage.getItem('LastInboxId') == undefined ||
                                    isNaN(localStorage.getItem('LastInboxId')) ? 0 :
                                    parseInt(localStorage.getItem('LastInboxId'));
                                if (lastInboxId < parseInt(values[i].id.substring(1)))
                                    lastInboxId = parseInt(values[i].id.substring(1));
                                localStorage.setItem('LastInboxId', lastInboxId);
                            }
                            notificationList.push({
                                id: notificationList.length + 1,
                                title: values[i].title,
                                text: values[i].message,
                                icon: 'file://img/notification_icon.png',
                                smallIcon: 'res://notification_icon'
                            });
                        }
                        if (notificationList.length > 0) {
                            cordova.plugins.notification.local.schedule(notificationList);
                        }
                    }
                    cordova.plugins.notification.badge.set(result.notificationCounter);
                    
                    $timeout(function () {
                        $scope.pushNotification();
                    }, $scope.globalCheckNotificationTimeout);
                },
                function (error) {
                    $timeout(function () {
                        $scope.pushNotification();
                    }, $scope.globalCheckNotificationTimeout);
                });
            } else {
                $timeout(function () {
                    $scope.pushNotification();
                }, $scope.globalCheckNotificationTimeout);
            }
        }

        document.addEventListener("backbutton", function () {
            if(!$scope.isLoadingShow){
                if ($scope.pageIndex > 0) {
                    $scope.$broadcast('closePage', { pageIndex: $scope.pageIndex });
                } else {
                    navigator.notification.confirm(
                        $scope.globalMessage.ApplicationExit,
                        function (parm) {
                            if (parm == 1) {
                                navigator.app.exitApp();
                            }
                        },
                        $scope.globalMessage.PopUpTitle,
                        [$scope.globalMessage.PopUpButtonYes, $scope.globalMessage.PopUpButtonNo]
                    )
                }
                if (!$scope.$$phase) $scope.$apply();
            }
        }, false);

        document.addEventListener('onSMSArrive', function (result) {
            var sms = result.data;
            alert(JSON.stringify(sms));
            if (SMS) {
                SMS.stopWatch(function () {
                    //update('watching', 'watching stopped');
                }, function () {
                    //updateStatus('failed to stop watching');
                });
            }
        });
        $scope.sendSMS = function () {
            if (SMS) {
                SMS.startWatch(function () {
                    //update('watching', 'watching started');
                }, function () {
                    //updateStatus('failed to start watching');
                });
                SMS.sendSMS("+628569092962", "TEST", function () {
                    //success
                }, function () {
                    //failed
                });
            }
        }
        $scope.setContactUs = function () {
            if(localStorage.getItem("contactUs") == null) {
                localStorage.setItem("contactUs", JSON.stringify({
                    'phoneNumberText': '(021) 2555 7788 Ext. 646060 (Help Desk)',
                    'phoneNumber': '02125557788',
                    'emailAddressText': 'Syariah_Helpdesk_Id@Manulife.com',
                    'emailAddress': 'syariah_helpdesk_id@manulife.com'
                }));
            }
            $timeout(function () {
                var promise = API.GetContactUs();
                promise.then(
                    function (args) {
                        localStorage.setItem('contactUs', JSON.stringify({
                            'phoneNumberText': args.phoneNumberText,
                            'phoneNumber': args.phoneNumber,
                            'emailAddressText': args.emailAddressText,
                            'emailAddress': args.emailAddress
                        }));
                    },
                    function (error) { }
                );
            }, $scope.timeoutOpenPage);
        }
    });
