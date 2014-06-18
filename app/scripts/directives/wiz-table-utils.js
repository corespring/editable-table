angular.module('editableTableApp')
  .factory('WizTableUtils',function(){

    var public = {};

    function createColumnId(index){
      return 'column_' + index;
    };

    function createRowId(index){
      return 'row_' + index;
    };

    function createRowElement(rowId){
      var tr = angular.element('<tr></tr>');
      tr.attr('row',rowId);
      return tr;
    }

    function createCellElement(colId){
      var td = angular.element('<td></td>');
      td.attr('col',colId);
      return td;
    }

    function belongsTo(element,compareFunc){

      var el = element;

      while(el && el.nodeName != undefined){
        if (compareFunc(el)){
          return true;
        };
        el = el.parentElement;
      }

      return false;
    }

    /**
    * Returns newly created array of rows
    */
    public.createTableContent = function(data){
      var rows = [];
      for (var r = 0; r < data.length; r++) {
        var rowData = data[r];
        var tr = createRowElement(r);

        for (var c = 0; c < rowData.length; c++) {
          var td = createCellElement(c);
          td.html(rowData[c]); 
          tr.append(td);
        };          

        rows.push(tr);
      };

      return rows;
    };

    public.getCellDimentions = function(cell){
      if (!cell){
        return undefined;
      }
      return cell[0].getBoundingClientRect();
    };

    public.getTargetCell = function(event){

      if (event.target == undefined){
        return undefined;
      }

      var target = event.target;
      var belongsToCell = belongsTo(event.target,function(el){
        return el.nodeName.toLowerCase() == 'td';
      });

      if (belongsToCell) {
        return $(event.target);
      }

      return undefined;
    };

    public.setVisibility = function(popup,isVisible){
      popup.css('display',isVisible ? 'block' : 'none');
    };

    public.setEditorPosition = function (popup,cell){
      var editable = popup.children()[0];
      var dim = public.getCellDimentions(cell); 
      
      popup.css('width',dim.width);
      popup.css('height',dim.height);
      popup.css('top',dim.top + window.scrollY);
      popup.css('left',dim.left);
      $(editable).css('padding',$(cell).css('padding'));
      $(editable).css('height',dim.height);
    };

    public.setFocusOnEditor = function (popup){
      var editable = popup.children()[0];
      $(editable).focus();
    };

    public.getCellCoordinates = function(cell){
      var col = cell.attr('col');
      var row = cell.parent().attr('row');
      return {'col': col,'row': row};
    }

    return public;
  })