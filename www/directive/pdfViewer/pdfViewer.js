angular
.module('pdfViewer', ['dialogPassword'])
.directive('pdfViewerDirective', function() {
    return {
        restrict: 'E',
        scope: {
            url : '=',
            fileName : '=',
            bearer : '=',
            onPasswordCancel: '&'
        },
        templateUrl: './directive/pdfViewer/pdfViewer.html'
    };
})
.controller('pdfViewerDirectiveController', function($scope) {
    $scope.stringEmpty = '';
    $scope.pdfDocument = undefined;
    $scope.loadingClass = '';
    $scope.canvasStyle = {};
    $scope.currentPage = 0;
    $scope.totalPage = 0;
    $scope.canvas = undefined;
    $scope.canvasCTX = undefined;
    $scope.zoom = 1;
    $scope.tempBlob = undefined;
    $scope.tempUrl = '';
    $scope.dialogPassword = {
        isShow: false,
        okText: 'OK',
        cancelText: 'Batal',
        title: 'Silahkan masukkan password pdf',
        model: ''
    }

    $scope.zoomOutClick = function() {
        if($scope.zoom != 1) {
            $scope.zoom = $scope.zoom - 1;
        }
        $scope.canvasStyle = {
            'width' : (100 * $scope.zoom) + '%'
        };
    }

    $scope.zoomInClick = function() {
        $scope.zoom = $scope.zoom + 1;
        $scope.canvasStyle = {
            'width' : (100 * $scope.zoom) + '%'
        };
    }

    $scope.downloadClick = function() {
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

        if($scope.fileName) {
            if ($scope.fileName.endsWith('.pdf'))
                fileName = $scope.fileName;
            else 
                fileName = $scope.fileName + '.pdf';
        }
        else {
            fileName = moment().format('DD-MM-YYYY HH mm ss') + '.pdf';
        }

        window.resolveLocalFileSystemURL(
            storageLocation + 'Download',
            function(dir) {
        		dir.getFile(fileName, {create:true}, function(file) {
                    file.createWriter(function(fileWriter) {
                        fileWriter.write($scope.tempBlob);
                        navigator.notification.alert(
                            'PDF berhasil disimpan dengan nama ' + fileName,
                            function() {},
                            'Pesan',
                            'Ok'
                        );

                    }, function(){
                        navigator.notification.alert(
                            'Proses penyimpanan data gagal',
                            function() {},
                            'Pesan',
                            'Ok'
                        );
                    });
        		}
            );
        });
    }

    $scope.prevClick = function() {
        if($scope.currentPage != 1) {
            $scope.showPage($scope.currentPage - 1);
        }
    }

    $scope.nextClick = function() {
        if($scope.currentPage != $scope.totalPage) {
            $scope.showPage($scope.currentPage + 1);
        }
    }

    $scope.showPDFPassword = function () {
        $scope.dialogPassword.model = $scope.stringEmpty;
        $scope.dialogPassword.isShow = true;
        if (!$scope.$$phase) $scope.$apply();
    }

    $scope.dialogPassword_OnOK = function () {
        PDFJS.getDocument({ url: $scope.tempUrl, password: $scope.dialogPassword.model }).then(function(pdf_doc) {
            $scope.pdfDocument = pdf_doc;
            $scope.totalPage = $scope.pdfDocument.numPages;
            $scope.loadingClass = 'hidden';
            $scope.showPage(1);
            $scope.dialogPassword.model = $scope.stringEmpty;
            $scope.dialogPassword.isShow = false;
        }).catch(function(error) {
            try {
                navigator.notification.alert(
                    error.message,
                    function() {
                        if (!$scope.$$phase) $scope.$apply();
                    },
                    'Pesan',
                    'Ok'
                );
            }
            catch (err) { alert(error.message); if (!$scope.$$phase) $scope.$apply(); }
        });
    }

    $scope.dialogPassword_OnCancel = function () {
        $scope.onPasswordCancel();
    }

    $scope.showPDF = function() {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", $scope.url, true);
        oReq.responseType = "blob";
        if($scope.bearer != '' && $scope.bearer != undefined && $scope.bearer != null) {
            oReq.setRequestHeader('Authorization', 'bearer ' + $scope.bearer)
        }
        oReq.onload = function (oEvent) {
            var blob = oReq.response;
            if (blob) {
                $scope.tempBlob = blob;
                $scope.tempUrl = window.URL.createObjectURL(blob);
                PDFJS.getDocument({ url: $scope.tempUrl }).then(function(pdf_doc) {
                    $scope.pdfDocument = pdf_doc;
                    $scope.totalPage = $scope.pdfDocument.numPages;
                    $scope.loadingClass = 'hidden';
                    $scope.showPage(1);
                }).catch(function(error) {
                    if (error.code == 1) {
                        $scope.showPDFPassword();
                    }
                    else {
                        try {
                            navigator.notification.alert(
                                error.message,
                                function() {
                                    $scope.onPasswordCancel();
                                    if (!$scope.$$phase) $scope.$apply();
                                },
                                'Pesan',
                                'Ok'
                            );
                        }
                        catch (err) {
                            alert(error.message);
                            $scope.onPasswordCancel();
                            if (!$scope.$$phase) $scope.$apply();
                        }
                    }
                });
            }
            else {
                try {
                    navigator.notification.alert(
                        'Gagal menarik data dari server',
                        function() {},
                        'Pesan',
                        'Ok'
                    );
                }
                catch (err) { alert('Gagal menarik data dari server'); }
            }
        };
        oReq.send(null);
    }

    $scope.showPage = function(page_no) {
        $scope.loadingClass = '';
        $scope.currentPage = page_no;

        $scope.pdfDocument.getPage(page_no).then(function(page) {
            var viewport = page.getViewport(2);

            $scope.canvas.height = viewport.height;
            $scope.canvas.width = viewport.width;

            var renderContext = {
                canvasContext: $scope.canvasCTX,
                viewport: viewport
            };

            page.render(renderContext).then(function() {
                $scope.loadingClass = 'hidden';
                if (!$scope.$$phase) $scope.$apply();
            });
        });
    }

    $scope.onLoad = function() {
        $scope.pdfDocument = undefined;
        $scope.loadingClass = '';
        $scope.canvasStyle = '';
        $scope.currentPage = 0;
        $scope.totalPage = 0;
        $scope.canvas = undefined;
        $scope.canvasCTX = undefined;
        $scope.zoom = 1;
        $scope.canvas = $('.pdf-viewer-content').get(0);
        $scope.canvasCTX = $scope.canvas.getContext('2d');
        $scope.showPDF();
    }

    $scope.onLoad();
});
