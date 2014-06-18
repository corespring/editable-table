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
        ' <div contenteditable="true" style="top:0px;bottom:0px;left:0px;right:0px">' +
        '     popup' +
        '  </div>' +
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

              console.log('showCellEditor');

              Utils.setEditorPosition(popup,cell);

              Utils.setFocusOnEditor(popup);
            }
          }
        };
      }
    ]
  );
