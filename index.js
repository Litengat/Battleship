import { WebSocketServer   } from 'ws';
import { getNewId, packageManager } from './packeges.js';
import { games ,players} from './game.js';
const server = new WebSocketServer({ port: '8080' })


server.on('connection', socket => { 
    console.log("connection")
    socket.id = getNewId(players);
    socket.gameid = -1;
    players.set(socket.id,socket);

    socket.on('message', message => {
        console.log(message.toString())
        try {
            message = JSON.parse(message);
        }catch{
            console.log("no valid json");
            return;
        }
        packageManager(socket,message);
        

    });
    socket.on('close', close => {
        players.delete(socket.id);
    });

});
