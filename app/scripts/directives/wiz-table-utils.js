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

    function findMatchingParent(element,isOwner){

      var el = element;

      while(el && el.nodeName != undefined){ 
        if (isOwner(el)){
          return $(el);
        };
        el = el.parentElement;
      }

      return undefined;
    }

    public.getTargetCell = function(event){

      if (event.target == undefined){
        return undefined;
      }

      function isOwner(el){
        return el.nodeName.toLowerCase() === 'td';
      };

      return findMatchingParent(event.target,isOwner);
    };

    /**
    * Returns newly created array of rows
    */
    public.createTableContent = function(data,startRow){
      var rows = [];
      if (startRow == undefined){
        startRow = 0;
      }
      for (var r = 0; r < data.length; r++) {
        var rowData = data[r];
        var tr = createRowElement(r + startRow);

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
      return {'col': parseInt(col),'row': parseInt(row)};
    }

    public.getDataDimentions = function(data){
      if (!data || !$.isArray(data) || data.length == 0 || !$.isArray(data[0])){
        return undeined;
      };
      return {"cols":data[0].length , "rows":data.length};
    }

    /**
    *
    */
    public.getNextCellToEdit = function(data,currEditPos,back){
      if (!currEditPos){
        return undefined;
      };

      var dim = public.getDataDimentions(data);
      if (!dim){
        return undefined;
      }

      var next = {"col":undefined,"row":undefined};

      if (back){
        if (currEditPos.col > 0){
          next.col = currEditPos.col - 1;
          next.row = currEditPos.row;
        }else{        
          next.row = currEditPos.row - 1;
          next.col = dim.cols - 1;
        }
      }else{
        if (currEditPos.col < dim.cols - 1){
          next.col = currEditPos.col + 1;
          next.row = currEditPos.row;
        }else{        
          next.row = currEditPos.row + 1;
          next.col = 0;
        }
      }

      return next;
    };

    public.getCellElementAtCoord = function(element,nextCellCoord){
      var nextRow = element.find("tr[row='" + nextCellCoord.row + "']");
      return nextRow.find("td[col='" + nextCellCoord.col + "']");
    }

    public.createEmptyRowData = function(numcols){
      var newRowData = new Array(numcols);
      for (var i = 0; i < numcols; i++) {
        newRowData[i] = "";
      };
      return newRowData;
    }

    return public;
  })