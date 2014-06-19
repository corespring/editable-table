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

        var focuscatcherTemplate = '<input type="text" ' + 
        '   style=\'width:0px;height:0pxpx;display:block;padding:0px;border:0px;\'></input>';

        var popupTemplate = 
        '<div class=\'editor\' style="display:none;position:absolute;background-color:white">' +
        ' <div contenteditable="true" style="top:0px;bottom:0px;left:0px;right:0px"></div>' +
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

            var focuscatcher = $(angular.element(focuscatcherTemplate));
            element.before(focuscatcher);
            var popup = element.find('.editor');
            var editable = $(popup).children().first();

            focuscatcher.focus(focuscatcherFocusIn);
            element.append(Utils.createTableContent(scope.data));
            element.on('mouseup', mouseUpHandler);

            editable.blur(editableBlurHandler);
            //editable.focus(editableFocusHandler);
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

            function focuscatcherFocusIn(event){
              console.log('focuscatcherFocusIn')
              if (event.relatedTarget != editable.get(0)){
                var firstCellEl = Utils.getCellElementAtCoord(element,{'row':0,'col':0});
                startEditing(firstCellEl);    
              }
              else
              {
                event.preventDefault();
              } 
            }
            
            function editableBlurHandler(event){   
              console.log('editableBlurHandler ' + event.target);
              commit(event.target.innerHTML);
              focuscatcher.prop('disabled',false);
            }

            function editableKeyDownHandler(event){
              console.log('editableKeyDownHandler');
              var TABKEY = 9;

              if(event.keyCode == TABKEY){

                var nextCellCoord = Utils.getNextCellToEdit(scope.data,scope.coordEdited,event.shiftKey);

                //commit(event.target.innerHTML);

                if (event.shiftKey){ 
                  if (nextCellCoord.row >= 0){
                    commit(event.target.innerHTML);
                    event.preventDefault();
                  }else{
                    focuscatcher.prop('disabled',true);
                    return;
                  }                    
                }else{
                  commit(event.target.innerHTML);
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
