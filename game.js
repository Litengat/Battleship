export var games = new Map();
export var players = new Map();

const boardsize = 8;

export function createGame(host){
    return {
        host: host,
        guest: -1,
        ingame: false,
        hostfinished: false,
        guestfinished: false,
        gamestate: 0,
        board: getcleanboard()
    }
}

function getcleanboard(){
    var board = [];

    for (let i = 0; i < boardsize; i++) {
        board[i] = [];
        for (let j = 0; j < boardsize; j++) {
        board[i][j] = {
            host:"none",
            guest:"none"
        };
        }
    }
    return board;
}