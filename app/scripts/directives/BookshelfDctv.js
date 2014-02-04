'use strict';

angular.module('readingRoomApp')
  .directive('bookShelf', function ($log, $modal, userSrvc) {
    return {
      restrict: 'A',
      link: function(scope, el) {
        //scope.files=[];
        //var action = "";

        //////////
        scope.openAddBookDlg = function(filename){
          scope.fileName = filename;

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
            scope.$emit('closeAddBookDlg', {action:'process', title: data.title,
                                            author: data.author, publisher:data.publisher});
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            scope.$emit('closeAddBookDlg', {action:'dismiss'});
          });
        };

        var ModalAddBookCtrl = function ($scope, $modalInstance, item) {
          $scope.fileName = item;

          $scope.ok = function (title, author, publisher) {
            $modalInstance.close({title: title, author: author, publisher:publisher});
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };
        /////////

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

            this.on('error', function(file, message/*, xhr*/){
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
        });
      }
    };
  });
/*
readingRoomApp.directive('addBookIcon', function ($log) {
  return {
    restrict: 'A',
    link: function(scope, el){
      el.css('min-height', '100px');
      el.height('100px');
      el.width('100px');

      el.dropzone({
        url: '/ddd',
        maxFilesize: 5,
        autoProcessQueue: false,
        //addRemoveLinks: true,
        //dictRemoveFile: 'Remove',
        //autoDiscover:false,
        //clickable: false,

        accept: function(file, done){
          //$log.info(this.getUploadingFiles().length);
          //(this.getQueuedFiles().length);
          $log.info(file.type);
          if (file.type === 'image/jpeg') {
            done();
          }
          else {
            done('Supported formats: .png, jpeg');
          }
        },

        init: function() {

          this.on('success', function(file, json) {
            $log.info(json);
            this.removeFile(file);
          });

          this.on('error', function(file, message){
            //$log.error(event.dataTransfer.files);
            this.removeFile(file);
            alert(message);
          });

          this.on('complete', function(file){
            this.removeFile(file);
          });
        }
      });
    }
  };
});
*/
readingRoomApp.directive('addBookDlg', function () {
  return {
    templateUrl: 'views/addbook.html',
    restrict: 'E'
  };
});