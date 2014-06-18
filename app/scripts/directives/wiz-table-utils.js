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
      return event.target;
    }

    return public;
  })