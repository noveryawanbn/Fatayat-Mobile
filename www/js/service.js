rootApp
    .service('API', function ($http, $q) {
        // this.AppCode = 'DEV',
        // this.AppCode = 'SIT',
        // this.AppCode = 'UAT',
        // this.AppCode = 'PS',
        this.AppCode = 'PRODUCTION',
        // this.APIUrl = 'http://localhost:5000/',
        // this.APIUrl = 'http://192.168.1.194:5000/',
        // this.APIUrl = 'https://demo.manulife.co.id/' + this.AppCode + '/',
        this.APIUrl = 'https://afinity.manulife.co.id/' + this.AppCode + '/',
        this.Fingerprints = [
            'E5 3F 45 B8 01 31 D4 EA 94 96 80 BC F2 4F 6F 43 FC 45 32 BB', // demo
            'C1 06 43 40 CA 26 45 C6 B5 C5 B1 E6 65 4A D0 78 FE 9A 44 A2'  // afinity
        ],
        // this.AppVersion = 'v.2.4.6' + this.AppCode;
        this.AppVersion = 'v.2.4.6';

        this.UppercaseString = function (parm) {
            return parm == null ? '' : parm.trim().toUpperCase();
        }
        this.TrimString = function (parm) {
            return parm == null ? '' : parm.trim();
        }
        // this.checkSSL = function() {
        //     var deffered = $q.defer();
        //     var value = {}
        //     deffered.resolve({});
        //     value = deffered.promise;
        //     return $q.when(value);
        // }
        this.checkSSL = function() {
            var deffered = $q.defer();
            var value = {}
            window.plugins.sslCertificateChecker.check(
                successCallback,
                errorCallback,
                this.APIUrl,
                this.Fingerprints);
      
            function successCallback(message) {
                deffered.resolve(message);
            }
        
            function errorCallback(message) {
                if (message == "CONNECTION_NOT_SECURE") {
                    // There is likely a man in the middle attack going on, be careful!
                } else if (message.indexOf("CONNECTION_FAILED") >- 1) {
                    // There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
                }
                deffered.reject(message);
            }
            value = deffered.promise;
            return $q.when(value);
        }
        this.httpGet = function(url){
            var deffered = $q.defer();
            var value = {}
            this.checkSSL().then(
                function (message) {
                    $http.get(url).then(
                        function (response) {
                            deffered.resolve(response);
                        },
                        function (error) {
                            deffered.reject(error);
                        }
                    );
                },
                function (message) {
                    deffered.reject(message);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        }
        this.httpPost = function(url, param){
            var deffered = $q.defer();
            var value = {}
            this.checkSSL().then(
                function (message) {
                    $http.post(url, param).then(
                        function (response) {
                            deffered.resolve(response);
                        },
                        function (error) {
                            deffered.reject(error);
                        }
                    );
                },
                function (message) {
                    deffered.reject(message);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        }

        this.Login = function (Email, Password) {
            $http.defaults.headers.common.Authorization = '';
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/auth/mobilelogin', {
                    email: this.TrimString(Email),
                    password: this.TrimString(Password)
                })
                .then(
                function (response) {
                    var value = response.data;
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.tokenCode;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.Register = function (IdCard, SellerCode, DateOfBirth, Email, Password) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/insert', {
                    idCard: this.TrimString(IdCard),
                    sellerCode: this.TrimString(SellerCode),
                    dateOfBirth: DateOfBirth,
                    email: this.TrimString(Email),
                    password: this.TrimString(Password)
                })
                .then(
                function (response) {
                    var value = {
                        Status: response.data.status,
                        ErrorCode: response.data.errorCode
                    }
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error)
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.RegisterGetMasterData = function() {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/users/getmasterdata')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.RegisterValidateData = function(Email, Mobile, IdCard) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/validatedata', {
                Email: this.TrimString(Email),
                Mobile: this.TrimString(Mobile),
                IdCard: this.TrimString(IdCard)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.RegisterSubmitData = function(
            Captcha,
            AgentName,
            Level,
            DirectSupervisor,
            Region,
            City,
            IdCard,
            Address1,
            Address2,
            Address3,
            ZipCode,
            DOB,
            BirthPlace,
            MaritalStatus,
            BankAccountNo,
            BankAccountName,
            TaxNumber,
            TaxNumberStatus,
            TaxPayerStatus,
            TaxDependent,
            Mobile,
            Email,
            LatestEducation,
            Bank,
            Occupation,
            FileUploadList,
            Password,
            RecruitBy
        ) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/saveregistration', {
                Captcha: this.TrimString(Captcha),
                AgentName: this.TrimString(AgentName),
                Level: this.TrimString(Level),
                DirectSupervisor: this.TrimString(DirectSupervisor),
                Region: this.TrimString(Region),
                City: this.TrimString(City),
                IdCard: this.TrimString(IdCard),
                Address1: this.TrimString(Address1),
                Address2: this.TrimString(Address2),
                Address3: this.TrimString(Address3),
                ZipCode: this.TrimString(ZipCode),
                DOB: DOB,
                BirthPlace: this.TrimString(BirthPlace),
                MaritalStatus: this.TrimString(MaritalStatus),
                BankAccountNo: this.TrimString(BankAccountNo),
                BankAccountName: this.TrimString(BankAccountName),
                TaxNumber: this.TrimString(TaxNumber),
                TaxNumberStatus: this.TrimString(TaxNumberStatus),
                TaxPayerStatus: this.TrimString(TaxPayerStatus),
                TaxDependent: TaxDependent == "" ? 0 : TaxDependent,
                Mobile: this.TrimString(Mobile),
                Email: this.TrimString(Email),
                LatestEducation: this.TrimString(LatestEducation),
                Bank: this.TrimString(Bank),
                Occupation: this.TrimString(Occupation),
                FileList: FileUploadList,
                Password: this.TrimString(Password),
                RecruitBy: this.TrimString(RecruitBy)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetUserList = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/users')
                .then(
                function (response) {
                    deffered.resolve(response);
                },
                function (error) {
                    deffered.reject(error);
                });
            value = deffered.promise;
            return $q.when(value);
        },
        this.GenerateOTP = function (Email, Mobile, Name, TokenType) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/otp/generate', {
                    Email: this.TrimString(Email),
                    Mobile: this.TrimString(Mobile),
                    Name: this.UppercaseString(Name),
                    TokenType: this.TrimString(TokenType)
                })
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.VerifyOTP = function (Email, Token) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/otp/verify', {
                    Email: this.TrimString(Email),
                    Token: this.TrimString(Token)
                })
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetEContract = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/users/e-contract')
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                });
            value = deffered.promise;
            return $q.when(value);
        },
        this.AgreeContract = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/users/agree-contract')
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetTrainingStatus = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/training/status')
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetQuestions = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/training/questions')
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.TakeRefreshmentTest = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/training/takeRefreshmentTest')
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SendScore = function (QuestionType, Questions, IsFromStaging) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/training/sendscore', { QuestionType: QuestionType, Questions: Questions, IsFromStaging: IsFromStaging })
                .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.NotificationGet = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/notification/get')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.NotificationGetDetail = function (NotificationId) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/notification/getdetail?NotificationId=' + NotificationId)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.NotificationRead = function (NotificationId) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/notification/read', { NotificationId: NotificationId })
                .then(
                    function (response) {
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.InboxGet = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/inbox/get')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.InboxGetDetail = function (InboxId) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/inbox/getdetail?InboxId=' + InboxId)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.InboxRead = function (InboxId) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/inbox/read', { InboxId: InboxId })
                .then(
                    function (response) {
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.InboxDelete = function (InboxId) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/inbox/delete', { InboxId: InboxId })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetCurrentStatus = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getcurrentstatus')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetMasterData = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getmasterdata')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetSentStatus = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getsentstatus')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetDraft = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getdraft')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetSent = function (status, search, index) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getsent?Status={0}&Search={1}&Index={2}'.format(status, search, index))
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionGetDraftDetail = function (ApplicationNumber) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/submission/getdraftdetail?ApplicationNumber=' + this.UppercaseString(ApplicationNumber))
                .then(
                    function (response) {
                        var value = response.data;
                        
                        if (value.value.imageIdCard != null && value.value.imageIdCard != '')
                            value.value.imageIdCard = "data:image/jpeg;base64," + value.value.imageIdCard;

                        if (value.value.imagePerson != null && value.value.imagePerson != '')
                            value.value.imagePerson = "data:image/jpeg;base64," + value.value.imagePerson;

                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionRequestToken = function (MobileNumber) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/requesttoken', {
                    MobileNumber: this.TrimString(MobileNumber)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionSave = function (
            ApplicationNumber,
            IsAgreeNUTeam,
            IsPremiNoMoreThan10Percent,
            IsApplicationSuitsYourNeeds,
            CustomerName,
            CustomerGender,
            CustomerPlaceOfBirth,
            CustomerDateOfBirth,
            CustomerBenefit,
            CustomerPaymentMethod,
            CustomerPremi,
            IdCard,
            IdCardAddress1,
            IdCardAddress2,
            IdCardRTRW,
            IdCardProvince,
            IdCardCity,
            IdCardZIP,
            IdCardDistrict,
            IdCardSubDistrict,
            IsMailAddressSameWithIdCard,
            MailAddress1,
            MailAddress2,
            MailRTRW,
            MailProvince,
            MailCity,
            MailZIP,
            MailDistrict,
            MailSubDistrict,
            HomePhoneAreaCode,
            HomePhoneNumber,
            MobileNumber,
            Bank,
            BankBranch,
            BankAccountNumber,
            Email,
            RelationName,
            RelationType,
            ImageIdCard,
            ImagePerson
        ) {
            if (CustomerPremi == '')
                CustomerPremi = 0;

            if (ImageIdCard != null && ImageIdCard != '')
                ImageIdCard = ImageIdCard.split(',')[1];

            if (ImagePerson != null && ImagePerson != '')
                ImagePerson = ImagePerson.split(',')[1];

            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/save', {
                    ApplicationNumber: this.TrimString(ApplicationNumber),
                    IsAgreeNUTeam: IsAgreeNUTeam,
                    IsPremiNoMoreThan10Percent: IsPremiNoMoreThan10Percent,
                    IsApplicationSuitsYourNeeds: IsApplicationSuitsYourNeeds,
                    CustomerName: this.UppercaseString(CustomerName),
                    CustomerGender: this.TrimString(CustomerGender),
                    CustomerPlaceOfBirth: this.UppercaseString(CustomerPlaceOfBirth),
                    CustomerDateOfBirth: CustomerDateOfBirth,
                    CustomerBenefit: this.TrimString(CustomerBenefit),
                    CustomerPaymentMethod: this.TrimString(CustomerPaymentMethod),
                    CustomerPremi: CustomerPremi,
                    IdCard: this.TrimString(IdCard),
                    IdCardAddress1: this.UppercaseString(IdCardAddress1),
                    IdCardAddress2: this.UppercaseString(IdCardAddress2),
                    IdCardRTRW: this.TrimString(IdCardRTRW),
                    IdCardProvince: this.TrimString(IdCardProvince),
                    IdCardCity: this.TrimString(IdCardCity),
                    IdCardZIP: this.TrimString(IdCardZIP),
                    IdCardDistrict: this.UppercaseString(IdCardDistrict),
                    IdCardSubDistrict: this.UppercaseString(IdCardSubDistrict),
                    IsMailAddressSameWithIdCard: IsMailAddressSameWithIdCard,
                    MailAddress1: this.UppercaseString(MailAddress1),
                    MailAddress2: this.UppercaseString(MailAddress2),
                    MailRTRW: this.TrimString(MailRTRW),
                    MailProvince: this.TrimString(MailProvince),
                    MailCity: this.TrimString(MailCity),
                    MailZIP: this.TrimString(MailZIP),
                    MailDistrict: this.UppercaseString(MailDistrict),
                    MailSubDistrict: this.UppercaseString(MailSubDistrict),
                    HomePhoneAreaCode: this.TrimString(HomePhoneAreaCode),
                    HomePhoneNumber: this.TrimString(HomePhoneNumber),
                    MobileNumber: this.TrimString(MobileNumber),
                    Bank: this.TrimString(Bank),
                    BankBranch: this.UppercaseString(BankBranch),
                    BankAccountNumber: this.UppercaseString(BankAccountNumber),
                    Email: this.TrimString(Email),
                    RelationName: this.UppercaseString(RelationName),
                    RelationType: this.TrimString(RelationType),
                    ImageIdCard: ImageIdCard,
                    ImagePerson: ImagePerson,
                    TokenCode: ''
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionSubmit = function (
            ApplicationNumber,
            IsAgreeNUTeam,
            IsPremiNoMoreThan10Percent,
            IsApplicationSuitsYourNeeds,
            CustomerName,
            CustomerGender,
            CustomerPlaceOfBirth,
            CustomerDateOfBirth,
            CustomerBenefit,
            CustomerPaymentMethod,
            CustomerPremi,
            IdCard,
            IdCardAddress1,
            IdCardAddress2,
            IdCardRTRW,
            IdCardProvince,
            IdCardCity,
            IdCardZIP,
            IdCardDistrict,
            IdCardSubDistrict,
            IsMailAddressSameWithIdCard,
            MailAddress1,
            MailAddress2,
            MailRTRW,
            MailProvince,
            MailCity,
            MailZIP,
            MailDistrict,
            MailSubDistrict,
            HomePhoneAreaCode,
            HomePhoneNumber,
            MobileNumber,
            Bank,
            BankBranch,
            BankAccountNumber,
            Email,
            RelationName,
            RelationType,
            ImageIdCard,
            ImagePerson,
            TokenCode
        ) {
            if (CustomerPremi == '')
                CustomerPremi = 0;

            if (ImageIdCard != null && ImageIdCard != '')
                ImageIdCard = ImageIdCard.split(',')[1];

            if (ImagePerson != null && ImagePerson != '')
                ImagePerson = ImagePerson.split(',')[1];

            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/submit', {
                    ApplicationNumber: this.TrimString(ApplicationNumber),
                    IsAgreeNUTeam: IsAgreeNUTeam,
                    IsPremiNoMoreThan10Percent: IsPremiNoMoreThan10Percent,
                    IsApplicationSuitsYourNeeds: IsApplicationSuitsYourNeeds,
                    CustomerName: this.UppercaseString(CustomerName),
                    CustomerGender: this.TrimString(CustomerGender),
                    CustomerPlaceOfBirth: this.UppercaseString(CustomerPlaceOfBirth),
                    CustomerDateOfBirth: CustomerDateOfBirth,
                    CustomerBenefit: this.TrimString(CustomerBenefit),
                    CustomerPaymentMethod: this.TrimString(CustomerPaymentMethod),
                    CustomerPremi: CustomerPremi,
                    IdCard: this.TrimString(IdCard),
                    IdCardAddress1: this.UppercaseString(IdCardAddress1),
                    IdCardAddress2: this.UppercaseString(IdCardAddress2),
                    IdCardRTRW: this.TrimString(IdCardRTRW),
                    IdCardProvince: this.TrimString(IdCardProvince),
                    IdCardCity: this.TrimString(IdCardCity),
                    IdCardZIP: this.TrimString(IdCardZIP),
                    IdCardDistrict: this.UppercaseString(IdCardDistrict),
                    IdCardSubDistrict: this.UppercaseString(IdCardSubDistrict),
                    IsMailAddressSameWithIdCard: IsMailAddressSameWithIdCard,
                    MailAddress1: this.UppercaseString(MailAddress1),
                    MailAddress2: this.UppercaseString(MailAddress2),
                    MailRTRW: this.TrimString(MailRTRW),
                    MailProvince: this.TrimString(MailProvince),
                    MailCity: this.TrimString(MailCity),
                    MailZIP: this.TrimString(MailZIP),
                    MailDistrict: this.UppercaseString(MailDistrict),
                    MailSubDistrict: this.UppercaseString(MailSubDistrict),
                    HomePhoneAreaCode: this.TrimString(HomePhoneAreaCode),
                    HomePhoneNumber: this.TrimString(HomePhoneNumber),
                    MobileNumber: this.TrimString(MobileNumber),
                    Bank: this.TrimString(Bank),
                    BankBranch: this.UppercaseString(BankBranch),
                    BankAccountNumber: this.UppercaseString(BankAccountNumber),
                    Email: this.TrimString(Email),
                    RelationName: this.UppercaseString(RelationName),
                    RelationType: this.TrimString(RelationType),
                    ImageIdCard: ImageIdCard,
                    ImagePerson: ImagePerson,
                    TokenCode: TokenCode
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionDrop = function (ApplicationNumber) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/drop', {
                    ApplicationNumber: this.TrimString(ApplicationNumber)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionSearchPolicy = function (PolicyNumber, IdCard) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/searchpolicy', {
                    PolicyNumber: this.TrimString(PolicyNumber),
                    IdCard: this.TrimString(IdCard)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.SubmissionResendPolicy = function (PolicyNumber, IdCard, Reason) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/submission/resendpolicy', {
                    PolicyNumber: this.TrimString(PolicyNumber),
                    IdCard: this.TrimString(IdCard),
                    Reason: this.UppercaseString(Reason)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ValidateForgotPassword = function (sellerCode, birthDate, email) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/validate-forgot-password', {
                    SellerCode: this.TrimString(sellerCode),
                    DateOfBirth: birthDate,
                    Email: this.TrimString(email)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.VerifyForgotPasswordToken = function (email, token) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/verify-token', {
                    Email: this.TrimString(email),
                    Token: this.TrimString(token)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.RecreatePassword = function (email, token, password) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/recreate-password', {
                    Email: this.TrimString(email),
                    Token: this.TrimString(token),
                    Password: this.TrimString(password)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ContentGet = function (ContentType, CategoryId) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/content/mobilegetcontent?ContentType=' + this.TrimString(ContentType) + '&CategoryId=' + CategoryId)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ContentGetDetail = function (Id) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/content/mobilegetcontentdetail?Id=' + Id)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ContentGetFile = function (Id) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/content/mobilegetcontentfile?Id=' + Id)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ContentCategoryGet = function () {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/category/mobileget')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ContentSubCategoryGet = function (CategoryId) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/category/mobilegetsub?CategoryId=' + CategoryId)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ChangePassword = function (oldPassword, newPassword) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/change-password', {
                    Password: this.TrimString(oldPassword),
                    NewPassword: this.TrimString(newPassword)
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.Structure = function (search, pageIndex) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/structure', {
                    Search: this.TrimString(search),
                    PageIndex: pageIndex
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.CheckVersion = function (versionNumber) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/auth/checkVersion?versionNumber=' + versionNumber)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetUserProfile = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/users/userprofile')
                .then(
                    function (response){
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error){
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PushNotification = function (userId, uik, agentCode, lastNotificationId, lastInboxId) {
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/auth/pushnotification', {
                    UserId: this.TrimString(userId),
                    UIK: this.TrimString(uik),
                    AgentCode: this.TrimString(agentCode),
                    LastNotificationId: lastNotificationId,
                    LastInboxId: lastInboxId
                })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetPosList = function(status, changeType, search, index){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getpos?Status={0}&ChangeType={1}&Search={2}&Index={3}'.format(status, changeType, search, index))
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },

        this.GetPosAllCertificateList = function(certificateNumber, dob){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getposallcertificate?CertificateNumber={0}&Dob={1}'.format(certificateNumber, dob.toJSON()))
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },

        this.GetPosHeader = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getposheader')
                .then(
                    function(response){
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function(error){
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetCurrentPosStatus = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getcurrentstatus')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetContactUs = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/auth/contactus')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetSertificateData = function(certificateNumber, dob){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/pos/getsertificatedata', {
                CertificateNumber: this.TrimString(certificateNumber),
                Dob: dob
            })
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PosRequestToken = function(MobileNumber, Email){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/pos/requesttoken', {
                MobileNumber: this.TrimString(MobileNumber),
                EmailAddress: this.TrimString(Email)
            })
            .then(
                function(response){
                    var value = response.data;
                    deffered.resolve(value);
                },
                function(error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PosGetMasterData = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getmasterdata')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PosGetPosUpdate = function(id) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getposupdate?id=' + id)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PosGetPosUpdateToken = function(id) {
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/pos/getposupdatetoken?id=' + id)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        }
        ,
        //TODO:
        this.PosSave = function(
            id,
            certificateNumber,
            transactionType,
            custDob,
            areaCode,
            homePhone,
            mobilePhone,
            email,
            address1,
            address2,
            rtrw,
            province,
            city,
            postalCode,
            district,
            subDistrict,
            name,
            accountBankOwnerName,
            bankName,
            bankBranch,
            accountBankNumber,
            relationName,
            relationType,
            moveToCardList,
            healthStatement,
            participantStatement,
            isGovernmentEmployment,
            governmentOfficerName,
            governmentInstituteName,
            position,
            tenure,
            country,
            uploadDocList,
            tokenCode
        ){

            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/pos/save', {
                Id: this.TrimString(id),
                CertificateNumber: this.TrimString(certificateNumber),
                Dob: custDob,
                TransactionType: this.TrimString(transactionType),
                CustomerAreaCode: this.TrimString(areaCode),
                CustomerHomePhone: this.TrimString(homePhone), 
                CustomerMobilePhone: this.TrimString(mobilePhone),
                CustomerEmail: this.TrimString(email),
                CustomerAddress1: this.TrimString(address1),
                CustomerAddress2: this.TrimString(address2),
                CustomerRtRw: this.TrimString(rtrw),
                CustomerProvince: this.TrimString(province),
                CustomerCity: this.TrimString(city),
                CustomerPostalCode: this.TrimString(postalCode),
                CustomerDistrict: this.TrimString(district),
                CustomerSubDistrict: this.TrimString(subDistrict),
                CustomerName: this.TrimString(name),
                AccountBankOwnerName: this.TrimString(accountBankOwnerName),
                BankName: this.TrimString(bankName),
                BankBranch: this.TrimString(bankBranch),
                AccountBankNumber: this.TrimString(accountBankNumber),
                RelationName: this.TrimString(relationName),
                RelationType: this.TrimString(relationType),
                MoveToCardList: moveToCardList,
                HealthStatement: healthStatement,
                ParticipantStatement: participantStatement,
                IsGovernmentEmployment: isGovernmentEmployment,
                GovernmentOfficerName: this.TrimString(governmentOfficerName),
                GovernmentInstituteName: this.TrimString(governmentInstituteName),
                Position: this.TrimString(position),
                Tenure: this.TrimString(tenure),
                Country: this.TrimString(country),
                UploadDocList: uploadDocList,
                TokenCode: this.TrimString(tokenCode)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },

        this.PosSubmit = function(
            id,
            certificateNumber,
            transactionType,
            custDob,
            areaCode,
            homePhone,
            mobilePhone,
            email,
            address1,
            address2,
            rtrw,
            province,
            city,
            postalCode,
            district,
            subDistrict,
            name,
            accountBankOwnerName,
            bankName,
            bankBranch,
            accountBankNumber,
            relationName,
            relationType,
            moveToCardList,
            healthStatement,
            participantStatement,
            isGovernmentEmployment,
            governmentOfficerName,
            governmentInstituteName,
            position,
            tenure,
            country,
            uploadDocList,
            tokenCode
        ){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/pos/submit', {
                Id: this.TrimString(id),
                CertificateNumber: this.TrimString(certificateNumber),
                Dob: custDob,
                TransactionType: this.TrimString(transactionType),
                CustomerAreaCode: this.TrimString(areaCode),
                CustomerHomePhone: this.TrimString(homePhone), 
                CustomerMobilePhone: this.TrimString(mobilePhone),
                CustomerEmail: this.TrimString(email),
                CustomerAddress1: this.TrimString(address1),
                CustomerAddress2: this.TrimString(address2),
                CustomerRtRw: this.TrimString(rtrw),
                CustomerProvince: this.TrimString(province),
                CustomerCity: this.TrimString(city),
                CustomerPostalCode: this.TrimString(postalCode),
                CustomerDistrict: this.TrimString(district),
                CustomerSubDistrict: this.TrimString(subDistrict),
                CustomerName: this.TrimString(name),
                AccountBankOwnerName: this.TrimString(accountBankOwnerName),
                BankName: this.TrimString(bankName),
                BankBranch: this.TrimString(bankBranch),
                AccountBankNumber: this.TrimString(accountBankNumber),
                RelationName: this.TrimString(relationName),
                RelationType: this.TrimString(relationType),
                MoveToCardList: moveToCardList,
                HealthStatement: healthStatement,
                ParticipantStatement: participantStatement,
                IsGovernmentEmployment: isGovernmentEmployment,
                GovernmentOfficerName: this.TrimString(governmentOfficerName),
                GovernmentInstituteName: this.TrimString(governmentInstituteName),
                Position: this.TrimString(position),
                Tenure: this.TrimString(tenure),
                Country: this.TrimString(country),
                UploadDocList: uploadDocList,
                TokenCode: this.TrimString(tokenCode)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.PosGetDraft = function(id){
            var deffered = $q.defer();
            var value = {}

            //TODO: add parameter
            this.httpGet(this.APIUrl + 'api/pos/getposdraft?id=' + id)
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );

            value = deffered.promise;
            return $q.when(value);
        },
        this.PosValidateToken = function(customerEmail, customerMobilePhone, tokenCode){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/pos/posvalidatetoken', {
                CustomerEmail: this.TrimString(customerEmail),
                CustomerMobilePhone: this.TrimString(customerMobilePhone),
                TokenCode: this.TrimString(tokenCode)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetDashboard = function(agentCode, area){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/dashboard/get', {
                AgentCode: this.TrimString(agentCode),
                Area: this.TrimString(area)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetDashboardDetail = function(agentCode, transactionType, area){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/dashboard/getdetail', {
                AgentCode: this.TrimString(agentCode),
                TransactionType: this.TrimString(transactionType),
                Area: this.TrimString(area)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error){
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetReassignList = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpGet(this.APIUrl + 'api/reassign/getreassignlist')
                .then(
                    function (response) {
                        var value = response.data;
                        deffered.resolve(value);
                    },
                    function (error) {
                        deffered.reject(error);
                    }
                );
            value = deffered.promise;
            return $q.when(value);
        },
        this.ReassignAgent = function(applicationNo, policyNo, agentCode){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/reassign/reassignagent', {
                ApplicationNo: this.TrimString(applicationNo),
                PolicyNo: this.TrimString(policyNo),
                AgentCode: this.TrimString(agentCode)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.UserRank = function(){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/users/userrank')
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        },
        this.GetAgentDetail = function(agentCode){
            var deffered = $q.defer();
            var value = {}
            this.httpPost(this.APIUrl + 'api/agentdetail/getagentdetail', {
                AgentCode: this.TrimString(agentCode)
            })
            .then(
                function (response) {
                    var value = response.data;
                    deffered.resolve(value);
                },
                function (error) {
                    deffered.reject(error);
                }
            );
            value = deffered.promise;
            return $q.when(value);
        }
    });