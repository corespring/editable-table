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

            var popup = $(element.children()[0]);
            var editable = $($(popup).children()[0]);

            popup.css('display', 'none')

            element.append(Utils.createTableContent(scope.data));

            element.on('mouseup', mouseUpHandler);

            editable.blur(editableBlurHandler);
            editable.keydown(editableKeyDownHandler);


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

                var nextCellToEdit = Utils.getNextCellToEdit(scope.data,scope.coordEdited,event.shiftKey);

                commit(event.target.innerHTML);

                if (event.shiftKey){ 
                  if (nextCellToEdit.row >= 0){
                    event.preventDefault();
                  }else{
                    return;
                  }                    
                }else{
                  event.preventDefault();
                  if (nextCellToEdit.row >= scope.data.length ){
                    addNewRow(nextCellToEdit.row);
                  }
                }

                var nextRow = element.find("tr[row='" + nextCellToEdit.row + "']");
                var nextCell = nextRow.find("td[col='" + nextCellToEdit.col + "']");  

                startEditing(nextCell);                                            
              }
            };

            function addNewRow(startRow){
              var dim = Utils.getDataDimentions(scope.data);
              var newRowData = new Array(dim.cols);
              for (var i = 0; i < newRowData.length; i++) {
                newRowData[i] = "";
              };
              scope.data.push(newRowData);
              var additionalRow = Utils.createTableContent([newRowData],startRow); 
              element.append(additionalRow);
            }
          }
        };
      }
    ]
  );
