const board = require('./board')
var games = new Map();
var players = new Map();

function newGame(socket,package){
    let gameid = getNewId(games);
    games.set(gameid,createGame(socket.id));
    console.log(games.get(gameid));
    sendPackageWithData(socket,"gameID",gameid)
}

function joinGame(socket,package){
    var game = games.get(Number(package));
    game.guest = socket.id;
    console.log(game);
    sendPackageWithData(players.get(game.host),"PlayerJoind")
    return true;
}


function createGame(host){
    return {
        host: host,
        guest: -1,
        board: board.getcleanboard()
    }
}


function getNewId(map){
    
    var i = Math.floor(Math.random() * 8999)+1000;
    if(map.has(i)){
        i = getNewId(map);
    }
    return i;
}

function sendPackage(socket,type){
    socket.send(JSON.stringify({
        "type": type
    }))
}

function sendPackageWithData(socket,type,data){
    socket.send(JSON.stringify({
        "type":type,
        "data": data
    }))

}




module.exports = {newGame,joinGame,getNewId,players};