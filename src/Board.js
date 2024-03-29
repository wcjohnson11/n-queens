// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //pass in a rowIndex, check if #1's > 1
      var row = this.rows()[rowIndex];
      var found = false;
      for (var i = 0; i < row.length; i++) {
        if(row[i] === 1) {
          if (found === true) {
            return true;
          } else {
            found = true;
          }
        }
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var numRows = this.rows().length;
      for (var i = 0; i < numRows; i++) {
        if ( this.hasRowConflictAt(i) ) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var numRows = rows.length;
      var found = false;
      for (var i = 0; i < numRows; i++) {
        if (rows[i][colIndex] === 1) {
          if (found === true) {
            return true;
          } else {
            found = true;
          }
        }
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      var numCols = rows.length;
      for (var i = 0; i < numCols; i++) {
        if (this.hasColConflictAt(i) ) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    //
    //

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var start = toMajorDiagCoord(majorDiagonalColumnIndexAtFirstRow);
      var row = start[0];
      var col = start[1];
      var rows = this.rows();
      var found;
      while (col < rows.length && row < rows.length) {
        if (rows[row][col] === 1) {
          if (found === true) {
            return true;
          } else {
            found = true;
          }
        }
        row++;
        col++;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var starts = makeMajorRange( this.rows().length );
      for (var i = 0; i < starts.length; i++) {
        if (this.hasMajorDiagonalConflictAt(starts[i])) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      var start = toMinorDiagCoord(minorDiagonalColumnIndexAtFirstRow, rows.length);
      var row = start[0];
      var col = start[1];
      var found;
      while (row >= 0 && col < rows.length) {
        if (rows[row][col] === 1) {
          if (found === true) {
            return true;
          } else {
            found = true;
          }
        }
        row--;
        col++;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var starts = makeMinorRange( this.rows().length );
      for (var i = 0; i < starts.length; i++) {
        if (this.hasMinorDiagonalConflictAt(starts[i])) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

  window.makeEmptyMatrix = makeEmptyMatrix;

  window.toMajorDiagCoord = function(num) {
    if (num === 0){
      return [0, 0];
    } else if (num > 0){
      return [0, num];
    } else if (num < 0) {
      return [Math.abs(num), 0];
    }
  };

  window.toMinorDiagCoord = function(num, size) {
    var len = size - 1;
    if (num <= len){
      return [num, 0];
    } else {
      return [len, num - len];
    }
  };

  window.makeMajorRange = function(r){
    return _.range(-1 * (r - 1), (r - 1));
  };

  window.makeMinorRange = function(r){
    return _.range(0, 2 * r - 1);
  };

}());
