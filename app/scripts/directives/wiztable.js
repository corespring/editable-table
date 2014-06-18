'use strict';

/**
 * @ngdoc directive
 * @name editableTableApp.directive:wizTable
 * @description
 * # wizTable
 */
angular.module('editableTableApp')
  .directive('wizTable',
    ['WizTableUtils','$document',
      function (Utils) {

        var popupTemplate = 
        '<div style="position:absolute;background-color:white">' +
        //' <div contenteditable="true">' +
        //'     popup' +
        //'  </div>' +
        '</div>' ;

        return {
          //templateUrl: 'scripts/directives/wiztable.html',
          restrict: 'A',
          scope: {},
          link: function (scope, element, attrs) {

            scope.isEditing = false;

            var popup = angular.element(popupTemplate);
            var editable = popup.children()[0];
            popup.css('display', 'none')
            element.append(popup); 

            scope = {
              data: [
                ["Cell 0,0","Cell 0.1","Cell 0.2"],
                ["Cell 1,0","Cell 1.1","Cell 1.2"]
              ]
            };

            element.append(Utils.createTableContent(scope.data));

            element.on('mousedown', mouseDownHandler);

            function mouseDownHandler(event) {
              element.on('mouseup',mouseUpHandler);             
            };

            function mouseUpHandler(event) {            
              var cell = Utils.getTargetCell(event);
              if (cell){
                scope.isEditing = true;
                showCellEditor(cell);
              }              
            };

            function showCellEditor(cell){
              var dim = Utils.getCellDimentions(cell);
              var scrollingPos = 
              popup.css('display','block');
              popup.css('width',dim.width);
              popup.css('height',dim.height);
              popup.css('top',dim.top + window.scrollY);
              popup.css('left',dim.left);
              //$(editable).css('padding',$(cell).css('padding'));
              //popup.css('background-color','white');
              //popup.css()
            }
          }
        };
      }
    ]
  );
