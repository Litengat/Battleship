const boardsize = 8;

function getcleanboard(){
    var board = {board:[]};
    for(let x; x < boardsize; x++){
        board.board[x] = [];
        for(let y; y < boardsize;y++){
            board.board[x][y] = {
                state: "none"
            };
        }
    }
    return board;
}

module.exports = {getcleanboard};