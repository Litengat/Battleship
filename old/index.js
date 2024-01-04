const WebSocket = require('ws')
const packeges = require('./packeges.js');
const server = new WebSocket.Server({ port: '8080' })

var sockets = new Map()
server.on('connection', socket => { 
    console.log("connection")
    socket.id = packeges.getNewId(packeges.players);
    packeges.players.set(socket.id,socket);

    socket.on('message', message => {
        var type = message;
        console.log(message.toString())
        try {
            message = JSON.parse(message);
            type = message.type;
        }catch{
            console.log("no valid json");
        }
        switch (type.toString()) {
            case "newGame":
                packeges.newGame(socket,message.data);
                break;
            case "joinGame":
                packeges.joinGame(socket,message.data);
                break;
        }
    });
    socket.on('close', close => {
        sockets.delete(socket.id);
    });

});

function getsocket(id){
    console.log(sockets);
    return sockets.get(id);
}


module.exports = {getsocket};