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
        '<input class=\'focuscatcher\' type="text" ' + 
        '   style=\'width:0px;height:0px;display:block;position:relative;padding:0px;border:0px;\'></input>' +      
        '<div class=\'editor\' style="position:absolute;background-color:white">' +
        ' <div contenteditable="true" style="top:0px;bottom:0px;left:0px;right:0px">' +
        //'     {{data[coordEdited.row][coordEdited.col]}}' +
        '  </div>' +
        '</div>' ;

        return {
          template: popupTemplate,
          restrict: 'A',
          scope: {},
          link: function (scope, element, attrs) {

            scope.data = [
                ["Cell 0,0","Cell 0.1","Cell 0.2"],
                ["Cell 1,0","Cell 1.1","Cell 1.2"]
              ];

            scope.coordEdited = undefined;
            scope.cellEdited = undefined;

            element.css('tabindex',0);
            var popup = element.find('.editor');
            var editable = $(popup).children().first();
            var focuscatcher = element.find('.focuscatcher');

            popup.css('display', 'none')

            focuscatcher.focus(elementFocusIn);

            element.append(Utils.createTableContent(scope.data));

            element.on('mouseup', mouseUpHandler);

            editable.blur(editableBlurHandler);
            editable.keydown(editableKeyDownHandler);

            function elementFocusIn(event){
              console.log('elementFocusIn');
              var firstCellEl = Utils.getCellElementAtCoord(element,{'row':0,'col':0});
              startEditing(firstCellEl);  
            }


            function mouseUpHandler(event) {            
              var cell = Utils.getTargetCell(event);              
              if (cell){
                startEditing(cell);                
              }              
            };

            function startEditing(cell){

              scope.$apply(function(){
                scope.cellEdited = cell;
                scope.coordEdited = Utils.getCellCoordinates(cell);
                scope.dataEdited = scope.data[scope.coordEdited.row][scope.coordEdited.col];
                console.log(scope.dataEdited);
                showCellEditor(cell);
              });
              
            }

            function showCellEditor(cell){
              editable.html(scope.dataEdited);
              Utils.setVisibility(popup,true);
              Utils.setEditorPosition(popup,cell);
              Utils.setFocusOnEditor(popup);
            };

            function updateCellData(newData){
              scope.data[scope.coordEdited.row][scope.coordEdited.col] = newData;
            }

            function updateCellContents(){
              scope.cellEdited.html(scope.data[scope.coordEdited.row][scope.coordEdited.col]);
            }

            function commit(newData){
              scope.$apply(function(){
                updateCellData(newData);
                updateCellContents();
                Utils.setVisibility(popup,false);
                scope.cellEdited = undefined;
                scope.coordEdited = undefined;
              });                     
            }
            
            function editableBlurHandler(event){
              commit(event.target.innerHTML);
            }

            function editableKeyDownHandler(event){
              var TABKEY = 9;

              if(event.keyCode == TABKEY){

                var nextCellCoord = Utils.getNextCellToEdit(scope.data,scope.coordEdited,event.shiftKey);

                commit(event.target.innerHTML);

                if (event.shiftKey){ 
                  if (nextCellCoord.row >= 0){
                    event.preventDefault();
                  }else{
                    return;
                  }                    
                }else{
                  event.preventDefault();
                  if (nextCellCoord.row >= scope.data.length ){
                    addNewRow(nextCellCoord.row);
                  }
                }

                var nextCellEl = Utils.getCellElementAtCoord(element,nextCellCoord);

                startEditing(nextCellEl);                                            
              }
            };

            function addNewRow(startRow){
              var dim = Utils.getDataDimentions(scope.data);
              var newRowData = Utils.createEmptyRowData(dim.cols);
              scope.data.push(newRowData);
              var additionalRow = Utils.createTableContent([newRowData],startRow); 
              element.append(additionalRow);
            }
          }
        };
      }
    ]
  );
