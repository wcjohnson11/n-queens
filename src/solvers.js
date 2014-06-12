/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

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


var getRooksSimpleArrays = function(n, solutions){
  if (n === 0) {
    return [];
  }
  var range = _.range(n);
  var solutions = solutions || range.map(function(num){
    return [num];
  });
  var updatedSolutions = [];
  if (solutions[0].length === n) {
    return solutions;
  }
  for (var i = 0; i < solutions.length; i++) {
    var missing = _.difference(range, solutions[i]);
    for (var j = 0; j < missing.length; j++) {
      updatedSolutions.push( solutions[i].concat(missing[j]) );
    }
  }
  return getRooksSimpleArrays(n, updatedSolutions);
};

var getRooksSolutions = function(n){
  return getRooksSimpleArrays(n).map(makeBoardFromArr);
};

var getQueensSolutions = function(n){
  return getRooksSolutions(n).filter(function(board){
    return !board.hasAnyQueensConflicts();
  });
};



window.findNRooksSolution = function(n) {
  var solution = getRooksSolutions(n)[0];
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = getRooksSolutions(n).length;
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = getQueensSolutions(n)[0];
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 0){
    n = 1;
  }
  var solutionCount = getQueensSolutions(n).length;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
