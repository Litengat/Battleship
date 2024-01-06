import { games ,players,createGame} from './game.js';

export function packageManager(socket, data){
    switch (data.type) {
        case "newGame":
            newGame(socket,data.data);
            break;
        case "joinGame":
            joinGame(socket,data.data);
            break;
        case "startGame":
            startGame(socket,data.data);
            break;
        case "placeBoats":
            placeBoat(socket,data.data);
            break;
        case "shipfinished":
            shipfinished(socket,data.data);
            break;
    }
}


function newGame(socket,data){
    let gameid = getNewId(games);
    games.set(gameid,createGame(socket.id));
    socket.gameid = gameid;
    sendPackageWithData(socket,"gameID",gameid)
}

function joinGame(socket,data){
    var gameid = Number(data);
    var game = games.get(Number(data));
    if(!games.has(gameid)){
        console.log("gameID not in use");
        return false;
    }else if(game.ingame){
        console.log("game is in running");
        return false;
    }
    game.guest = socket.id;
    game.ingame = true;
    socket.gameid = Number(data);
    sendPackageWithData(players.get(game.host),"PlayerJoind")
    sendPackage(socket,"successfulJoined");
    return true;
}
function startGame(socket,data){
    var game = games.get(socket.gameid)
    if(socket.id == game.host){
        sendPackage(players.get(game.guest),"gameStarted")
    }else{
        console.log("looser");
    }
}


function placeBoat(socket,data){
    var game = games.get(socket.gameid)
    var cell = game.board[data.x][data.y]
    if(game.host == socket.id){
        cell.host = 'ship';
    } else {
        cell.guest = 'ship';
    }
    sendPackageWithData(socket,"shipPlaced",{
        "x":data.x,
        "y":data.y,
        "type":"dot",
        "rotated": true
    })
}

function shipfinished(socket,data){
    var game = games.get(socket.gameid);
    if(socket.id == game.host){
        game.hostfinished = true;
    }else{
        game.guestfinished = true;
    }
    if(game.hostfinished && game.guestfinished){
        sendPackageWithData(players.get(game.host),"shipReady",true);
        sendPackageWithData(players.get(game.guest),"shipReady",false);
    }

}




export function getNewId(map){
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



