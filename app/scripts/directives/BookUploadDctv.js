'use strict';

angular.module('readingRoomApp')
  .directive('bookUpload', function ($log, $modal, userSrvc) {
    return {
      restrict: 'A',
      link: function(scope, el) {
        //////////
        //
        //  add book dialog functions
        //
        /////////
        scope.$on('file-dropzone-drop-event', function(event, data){
          openAddBookDlg(data.name);
          scope.file = data.file;
        });

        var openAddBookDlg = function(filename){
          //scope.fileName = filename;

          var modalInstance = $modal.open({
            templateUrl: 'addBook',
            controller: ModalAddBookCtrl,
            resolve: {
              item: function () {
                return filename;
              }
            }
          });

          modalInstance.result.then(function (data) {
            uploadFile(data);
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        };

        var ModalAddBookCtrl = function ($scope, $modalInstance, item) {
          $scope.fileName = item;
          $scope.title = item.split('.').shift();

          $scope.ok = function (title, author, publisher) {
            $modalInstance.close({title: title, author: author, publisher:publisher});
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };

        //////////
        //
        //  upload book functions
        //
        /////////
        var uploadFile = function(data) {
          var fd = new FormData();
          fd.append('file', scope.file);
          fd.append('title', data.title);
          fd.append('author', data.author);
          fd.append('publisher', data.publisher);

          var xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", uploadProgress, false);
          xhr.addEventListener("load", uploadComplete, false);
          xhr.addEventListener("error", uploadFailed, false);
          xhr.addEventListener("abort", uploadCanceled, false);
          xhr.open("POST", "/book");
          scope.progressVisible = true;
          xhr.send(fd);
        };

        function uploadProgress(evt) {
          scope.$apply(function(){
            if (evt.lengthComputable) {
              scope.progress = Math.round(evt.loaded * 100 / evt.total);
            } else {
              scope.progress = 'unable to compute';
            }
          });
        }

        function uploadComplete(evt) {
          /* This event is raised when the server send back a response */
          console.log(evt)
          scope.$apply(function(){
            if (evt.target.readyState === 4) {
              scope.progressVisible = false;

              if (evt.target.status === 200 ) {
                userSrvc.user = JSON.parse(evt.target.responseText).user;
                scope.reader = userSrvc.getUser();
                scope.errorMsg = null;
              } else {
                scope.errorMsg = evt.target.responseText;
              }
            }
          });
        }

        function uploadFailed(evt) {
          scope.$apply(function(){
            scope.progressVisible = false;
            scope.info = "There was an error attempting to upload the file.";
          });
        }

        function uploadCanceled(evt) {
          scope.$apply(function(){
            scope.progressVisible = false;
            scope.info = "The upload has been canceled by the user or the browser dropped the connection.";
          })
        }

        /*
        el.dropzone({
          url: '/file-upload',
          maxFilesize: 25,
          autoProcessQueue: true,
          maxFiles: 1,
          clickable: false,

          accept: function(file, done){
            var me = this;
            var validTypes = ['text/plain', 'image/jpeg', 'image/png'];

            if (validTypes.indexOf(file.type) > -1) {
              scope.openAddBookDlg(file.name);
              //scope.$emit('openAddBookDlg', file.name);

              scope.$on('closeAddBookDlg', function(event, data){
                me.options.params.title = data.title;
                me.options.params.author = data.author;
                me.options.params.publisher = data.publisher;

                if (data.action === 'process') {
                  try{
                    done();
                    //me.processQueue();
                  } catch(e){}

                } else {
                  done('Error');
                }
              });

            }  else {
              done('Upload failed: should be a plain text (.txt) file!');
            }
          },

          init: function() {
            this.on('maxfilesexceeded', function(file){
              alert('No more files!') ;
            });

            this.on('success', function(file, json) {
              userSrvc.user = json.user;
              scope.$emit('refreshBookshelfView');
              //this.removeFile(file);
            });

            this.on('addedfile', function(file) {
              $log.info('added');
            });

            this.on('error', function(file, message){
              $log.error(message);
              try {
                this.removeFile(file);
              }
              catch(e){}
             });

            this.on('complete', function(file){
              $log.info('complete: ' + file.name);

              if (this.files.length > 0)
                this.files.forEach(function(f){
                  $log.info('adads');
                  f.accepted = true;
                })
            });
          }
        });*/
      }
    };
  });

readingRoomApp.directive('addBookDlg', function () {
  return {
    templateUrl: 'views/addbook.html',
    restrict: 'E'
  };
});