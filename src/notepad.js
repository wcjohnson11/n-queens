var factorial  = function(num){
  var rval = 1;
  for (var i = 2; i <= num; i++) {
    rval = rval * i;
  }
  return rval;
};

var countRooksSolutions = function(n, solutions){

  var range = _.range(n);

  var solutions = solutions || range.map(function(num){
    return [num];
  });

  var updatedSolutions = [];

  if (solutions[0].length === n) {
    return solutions;
  }

  // [[0, 1], [0, 2], [0, 3]]
  for (var i = 0; i < solutions.length; i++) {
    var missing = _.difference(range, solutions[i]);
    for (var j = 0; j < missing.length; j++) {
      updatedSolutions.push( solutions[i].concat(missing[j]) );
    }
  }

  // return updatedSolutions;

  return countRooksSolutions(n, updatedSolutions);

};

var makeEmptyMatrix = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
};

var makeBoardFromArr = function(arr){
  var board = makeEmptyMatrix(arr.length);
  for (var i = 0; i < arr.length; i++){
    board[i][arr[i]] = 1;
  }
  return new Board(board);
};

var countQueensSolutions = function(n){

  return countRooksSolutions(n)
    .map(makeBoardFromArr)
    .filter(function(board){
      return !board.hasAnyQueensConflicts();
    })
    .length;
};

var solutions4 = countRooksSolutions(4);
var bbBoards = solutions4.map(makeBoardFromArr);
var allPassed = bbBoards.every(function(board){
  return !board.hasAnyRooksConflicts();
});
