

const gameBoardSize = 8;
var gamestate = 0;

// 1 = placeships
// 2 = wait for other
// 3 = I play
// 4 = other play
// 5 = win
// 6 = los

function renderBoard() {
    const container = document.getElementById("player-board");
    container.innerHTML = ''; // Spielfeld leeren

    for (let i = 0; i < gameBoardSize; i++) {
        for (let j = 0; j < gameBoardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', function(e) {
                var dataset = e.target.dataset;
                clickCell(dataset.col,dataset.row);
            })
            container.appendChild(cell);
        }
    }
}

const socket = new WebSocket('ws://localhost:8080');

document.querySelector('#button').onclick = () => {
    const text = document.querySelector('#input').value;
    console.log(text);
    socket.send(text)
}


// Listen for messages
socket.onmessage = ({ data }) => {
    console.log(data);
    data = JSON.parse(data);
    game(data);
};

function game(data){
    switch (data.type){
        case "gameID":
            gameId(data.data);
            break;
        case "PlayerJoind":
            PlayerJoind();
            break;
        case "successfulJoined":
            successfulJoined();
            break;
        case "gameStarted":
            gameStarted();
            break;
        case "shipPlaced":
            shipPlaced(data.data);
            break;
        case "shipReady":
            shipReady(data.data);
            break;
        case "hit":
            hit(data.data);
            break;

    }


    
}


const input = document.getElementById("IDinput");
const GameButton = document.getElementById("GameButton");

function gameId(data){
    input.readOnly = true;
    input.value = data;
    GameButton.innerHTML = "Start";
    GameButton.id = "StartButton";
    GameButton.disabled = true;
}

function PlayerJoind(){
    GameButton.disabled = false;
}
function successfulJoined(){
    GameButton.disabled = true;
}

function gameStarted(){
    document.getElementById("gamepanel").hidden = false
    renderBoard()
    GameButton.disabled = false
    GameButton.innerHTML = "shipfinished";
    GameButton.id = "shipfinished";
    input.disabled = true;
    gamestate = 1;
}
function shipPlaced(data){
    var e = getCellbyPos(data.x,data.y);
    e.classList.add('ship');
}
function shipReady(data){
    if(data){
        gamestate = 3
        GameButton.innerHTML = "your turn";
    }else{
        gamestate = 4
    }
    
}
// {"type":"hit","data":{"x":"6","y":"0","ship":false}}
function hit(data){
    var cell = getCellbyPos(data.x,data.y);
    if(gamestate == 3){
        if(data.ship){
            cell.classList.add("boom");
        }else{
            cell.classList.add("miss");
        }
        gamestate = 4;
        GameButton.innerHTML = "your turn";
    }else if(gamestate == 4){
        if(data.ship){
            cell.classList.add("destroyed");
        }else{
            cell.classList.add("missother");
        }
        gamestate = 3;
        GameButton.innerHTML = "Wait for other...";
    }
}



function getCellbyPos(x,y){
    return document.querySelectorAll(`[data-col="${x}"][data-row="${y}"]`)[0];
}



input.oninput = function(){
    if(!input.value == '' && !input.readOnly){
        GameButton.innerHTML = "join";
        GameButton.id = "joinButton";
    }else {
        GameButton.innerHTML = "NewGame";
        GameButton.id = "GameButton";
    }
}

function GameButtonClick(){
    switch(GameButton.id){
        case "GameButton":
            sendPackage("newGame");
            break;
        case "joinButton":
            sendPackageWithData("joinGame",input.value);
            break;
        case "StartButton":
            sendPackage("startGame");
            gameStarted();
            break;
        case "shipfinished":
            shipfinished();
            break;
    }
}
function shipfinished(){
    gamestate = 2;
    GameButton.disabled = true;
    GameButton.innerHTML = "Wait for other...";
    sendPackage("shipfinished");
}

function clickCell(x,y){
    switch(gamestate){
        case 1:
            sendclickCell("placeBoats",x,y)
            break;
        case 3:
            if(!getCellbyPos(x,y).classList.contains("ship")){
                sendclickCell("shoot",x,y)
            }
            break;
    }
}

function sendclickCell(type,x,y){
    sendPackageWithData(type,{
        "x":x,
        "y":y
    })
}


function sendPackageWithData(type,data){
    console.log(JSON.stringify({
        "type":type,
        "data":data
    }));
    socket.send( JSON.stringify({
        "type":type,
        "data":data
    }))
}

function sendPackage(type){
    console.log(type);
    socket.send( JSON.stringify({
        "type":type,
    }))
}
