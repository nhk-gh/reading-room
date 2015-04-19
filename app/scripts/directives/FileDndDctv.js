/* based on 'omr.angularFileDnD'' module by Louis Sivillo*/
'use strict';

angular.module('readingRoomApp').directive('fileDropzone', function() {
  return {
    restrict: 'A',
    scope: {
      file: '=',
      fileName: '='
    },
    link: function(scope, element, attrs) {
      // DnD
      var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, validMimeTypes;

      validMimeTypes = attrs.fileDropzone;

      getDataTransfer = function(event) {
        var dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
        return dataTransfer;
      };

      processDragOverOrEnter = function(event) {
        if (event) {
          if (event.preventDefault) {
            event.preventDefault();
          }
          if (event.stopPropagation) {
            return false;
          }
        }
        getDataTransfer(event).effectAllowed = 'copy';
        return false;
      };

      checkSize = function(size) {
        var _ref;
        if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
          return true;
        } else {
          //$log.error('File must be smaller than ' + attrs.maxFileSize + ' MB');
          scope.$emit('errorMsg', 'File must be smaller than ' + attrs.maxFileSize + ' MB');
          return false;
        }
      };

      isTypeValid = function(type) {
        if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
          return true;
        } else {
          //$log.error('Invalid file type.  File must be one of following types ' + validMimeTypes);
          scope.$emit('ERROR-MSG', 'Invalid file type.  File must be one of following types ' + validMimeTypes);
          return false;
        }
      };

      element.bind('dragover', processDragOverOrEnter);

      element.bind('dragenter', processDragOverOrEnter);

      element.bind('drop', function(event) {
        if (event !== null) {
          event.preventDefault();
        }

        prepareFile(getDataTransfer(event).files[0]);

        return false;
      });

      // Open dialog
      var fb = element.find('#file-browse');

      element.on('click', function(evt) {
        //console.log(evt);
        fb[0].click();
      });

      fb.on('change', function(evt){
        //console.log(evt);
        prepareFile(evt.target.files[0]);
      });

      // read file and prepare data for upload
      var prepareFile = function(fl){
        var file, name, reader, size, type;

        reader = new FileReader();
        reader.onload = function(evt) {
          if (checkSize(size) && isTypeValid(type)) {
            scope.$apply(function() {
              scope.file = evt.target.result;
              if (angular.isString(scope.fileName)) {
                //return scope.fileName = name;
                scope.fileName = name;
                return scope.fileName;
              }
            });

            return scope.$emit('file-dropzone-drop-event', {
              // I've change the following string; reason:
              // to get a dropped file from the req.files!!!
              file: file, //scope.file,
              type: type,
              name: name,
              size: size
            });
          }
        };
        file = fl;
        name = file.name;
        type = file.type;
        size = file.size;

        reader.readAsDataURL(file);
      };
    }
  };
});


