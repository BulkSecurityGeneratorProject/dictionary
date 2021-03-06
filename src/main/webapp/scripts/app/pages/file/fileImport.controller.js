'use strict';

angular.module('dictionaryApp')
    .controller('FileImportController', function ($scope, $state, $modal, Upload) {
      
        $scope.resetStatus = function() {
            $scope.success = false;
            $scope.failure = false;
        };

        $scope.resetStatus();

        $scope.submit = function() {
            if ($scope.file) {
                $scope.upload($scope.file);
            }
            

        }
        
        $scope.upload = function (file) {
            Upload.upload({
                url: 'api/files/import',
                fields: {'name': file.name}, // additional data to send.
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                if (data.success) {
                    $scope.success = true;    
                    $scope.numWordsCreated = data.numWordsCreated;
                    $scope.numTranslationsCreated = data.numTranslationsCreated;
                    $scope.numTagsCreated = data.numTagsCreated;
                } else {
                    $scope.failure = true;    
                    $scope.message = data.message;
                }
                
            }).error(function (data, status, headers, config) {
                console.log('error. Status: ' + status);
                $scope.failure = true;
                $scope.message = data.message;
            });
        };

        

    });
