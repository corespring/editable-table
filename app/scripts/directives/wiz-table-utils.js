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
      return angular.element('<tr class=\'' + rowId + '\'></tr>');
    }

    function createCellElement(colId){
      return angular.element('<td class=\'' + colId + '\'></td>');
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
      for (var i = 0; i < data.length; i++) {
        var rowData = data[i];
        var tr = createRowElement(createRowId(i));

        for (var j = 0; j < rowData.length; j++) {
          var td = createCellElement(createColumnId(j));
          td.html(rowData[j]); 
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
      return cell.getBoundingClientRect();
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
        return event.target;
      }

      return undefined;
    }

    public.setEditorPosition = function (popup,cell){
      var editable = popup.children()[0];
      var dim = public.getCellDimentions(cell); 
      popup.css('display','block');
      popup.css('width',dim.width);
      popup.css('height',dim.height);
      popup.css('top',dim.top + window.scrollY);
      popup.css('left',dim.left);
      $(editable).css('padding',$(cell).css('padding'));
      $(editable).css('height',dim.height);
    }

    public.setFocusOnEditor = function (popup){
      var editable = popup.children()[0];
      $(editable).focus();
    }

    return public;
  })