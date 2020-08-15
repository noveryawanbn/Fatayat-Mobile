angular
.module('cardMaterial', [])
.directive('cardMaterialDirective', function() {
    return {
        restrict: 'E',
        scope: {
            cardId: '=',
            topLeft: '=',
            topRight: '=',
            message: '=',
            url: '=',
            fileName: '=',
            type: '=',
            isUnread: '=',
            onClick: '&',
            bearer: '=',
            additionalActionIcon: '=',
            additionalAction: '&'
        },
        link: function (scope, element, attrs) {
            scope.downloadClick = function () {
                var storageLocation = '',
                    fileName = '';

                switch (device.platform) {
                    case 'Android':
                        storageLocation = 'file:///storage/emulated/0/';
                        break;
                    case 'iOS':
                        storageLocation = cordova.file.documentsDirectory;
                        break;
                }

                if (scope.fileName) {
                    if (scope.fileName.endsWith('.' + scope.type))
                        fileName = scope.fileName;
                    else
                        fileName = scope.fileName + '.' + scope.type;
                }
                else {
                    fileName = moment().format('DD-MM-YYYY HH mm ss') + '.' + scope.type;
                }
                    
                var oReq = new XMLHttpRequest();
                oReq.open("GET", scope.url, true);
                oReq.responseType = "blob";
                if(scope.bearer != '' && scope.bearer != undefined && scope.bearer != null) {
                    oReq.setRequestHeader('Authorization', 'bearer ' + scope.bearer)
                }
                oReq.onload = function (oEvent) {
                    var blob = oReq.response;
                    if (blob && blob.size > 10) {
                        window.resolveLocalFileSystemURL(
                            storageLocation + 'Download',
                            function (dir) {
                                dir.getFile(fileName, { create: true }, function (file) {
                                    file.createWriter(function (fileWriter) {
                                        fileWriter.write(blob);
                                        navigator.notification.alert(
                                            'File berhasil disimpan dengan nama ' + fileName,
                                            function () { },
                                            'Pesan',
                                            'Ok'
                                        );
                                    }, function () {
                                        navigator.notification.alert(
                                            'Proses penyimpanan data gagal',
                                            function () { },
                                            'Pesan',
                                            'Ok'
                                        );
                                    });
                                }
                                );
                            });
                    }
                    else {
                        navigator.notification.alert(
                            'Gagal menarik data dari server',
                            function () { },
                            'Pesan',
                            'Ok'
                        );
                    }
                };
                oReq.send(null);
            }
        },
        templateUrl: './directive/cardMaterial/cardMaterial.html'
    };
});
