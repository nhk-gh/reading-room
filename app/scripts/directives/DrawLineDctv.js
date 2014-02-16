'use strict';

angular.module('readingRoomApp')
  .directive('drawLine', function ($log) {
    return {
      restrict: 'A',
      scope:{},
      
      link: function (scope, element, attr) {
        var cursor = element.css('cursor');
        //var draw = SVG('drawing');
        var draw = false;
        var canvas = angular.element('#drawing');
        var ns = 'http://www.w3.org/2000/svg';
        var line = [];
        var tag = [];
        var rect1;

        element.on('mouseover', function(event){
          element.css('cursor', 'crosshair');
        });

        element.on('mouseleave', function(){
          //$log.info(event);
          element.css('cursor', cursor);
        });

        element.on('mousedown', function(event) {
          var evtPoint = eventCoord();

          for (var i=0; i<line.length; i++) {
            if (line[i]) { line[i].remove(); }
          }
          for (var i=0; i<tag.length; i++) {
            if (tag[i]) { tag[i].remove(); }
          }

          rect1 = scope.$parent.$parent.rects[this.getAttribute('id')];

          var X = parseInt(attr.x) + parseInt(attr.width)/2;
          var Y = parseInt(attr.y);

          line[0] = document.createElementNS(ns,'line');  // stick
          line[0].setAttribute('x1', X);
          line[0].setAttribute('y1', Y);
          line[0].setAttribute('x2', X);
          line[0].setAttribute('y2', Y-10);
          line[0].style.stroke = 'brown';

          line[1] = document.createElementNS(ns,'line');  // line
          line[1].setAttribute('x1', X);
          line[1].setAttribute('y1', Y-10);
          line[1].setAttribute('x2',evtPoint.x);
          line[1].setAttribute('y2',evtPoint.y);
          line[1].style.stroke = 'brown';

          line[2] = document.createElementNS(ns,'line');  // stick

          canvas.append(line);

          tag[0] = document.createElementNS(ns,'text');
          tag[1] = document.createElementNS(ns,'text');
          canvas.append(tag);

          draw = true;
        });

        canvas.on('mousemove', function(event){
          if (draw === true) {
            var evtPoint = eventCoord();
            line[1].setAttribute('x2', evtPoint.x);
            line[1].setAttribute('y2', evtPoint.y);
          }
        })
        .on('mouseup', function(event) {
          var toRemove = true;

          if (draw) {
            draw = false;

            var evtPoint = eventCoord();
            var r, rects = scope.$parent.$parent.rects;

            for (var i=0; i< rects.length; i++) {
              r = rects[i];

              if (((evtPoint.x >= r.x) && (evtPoint.x <= (r.x+ r.w))) &&
                  ((evtPoint.y >= r.y) && (evtPoint.y <= (r.y+ r.h)))) {

                // mouse up event inside the rect
                if (!((parseInt(line[0].getAttribute('x1')) === parseInt(r.x + r.w/2)) &&
                    (parseInt(line[0].getAttribute('y1')) === parseInt(r.y)))) {

                  // but not inside the same rect
                  line[2].setAttribute('x1', r.x + r.w/2);
                  line[2].setAttribute('y1', r.y);
                  line[2].setAttribute('x2', r.x + r.w/2);
                  line[2].setAttribute('y2', r.y-10);
                  line[2].style.stroke = 'brown';

                  line[1].setAttribute('x2', r.x + r.w/2);
                  line[1].setAttribute('y2', r.y-10);

                  // check for common tags
                  var commonTags = rect1.tags.filter(function(tag){
                    return r.tags.indexOf(tag) !== -1;
                  });
                  $log.info(commonTags.join(','));
                  if (commonTags.length > 0) {
                    tag[0].setAttribute('x', parseInt(line[0].getAttribute('x1')));
                    tag[0].setAttribute('y', parseInt(line[0].getAttribute('y1'))-20);
                    tag[0].setAttribute('style', "font-size:10; stroke:#acacac");
                    tag[0].textContent = commonTags.join(',');

                    tag[1].setAttribute('x', r.x + r.w/2);
                    tag[1].setAttribute('y', r.y-20);
                    tag[1].setAttribute('style', "font-size:10; stroke:#acacac");
                    tag[1].textContent = commonTags.join(',');
                  }

                  toRemove = false;
                  break;
                }
              }
            }

            if (toRemove) {
              for (var i=0; i<line.length; i++) {
                if (line[i]) { line[i].remove(); }
              }
              for (var i=0; i<tag.length; i++) {
                if (tag[i]) { tag[i].remove(); }
              }
            }
          }
        });

        var eventCoord = function (event) {
          /*var posx = 0;
          var posy = 0;
          var e;

          if (!event)
            e = window.event;
          else
            e = event;

          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          } else {
            if (e.clientX || e.clientY)	{
              posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
              posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
            }
          }
          // posx and posy contain the mouse position relative to the document
          // Do something with this information   */
          return {x: e.offsetX, y: e.offsetY};
        };
      }
    };
  });
