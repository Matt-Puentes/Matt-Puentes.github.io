var canvas;
var ctx;
var boardHeight;
var boardWidth;
var colorNum;
var nextTick;
var selectHorizontal = false
var selectPos = [0,0]
var boxSize = 40;
function main(){
	canvas = document.getElementById('MatchThreeCanvas')
	ctx = canvas.getContext('2d')
	document.getElementById("reset").onclick = resetGame;
	resetGame();
	tick();
}

function resetGame(){
	checkInput();
	initialize();
}

function checkInput(){
	boardHeight = parseInt(document.getElementById('height-box').value)
	boardWidth = parseInt(document.getElementById('width-box').value)
	colorNum = parseInt(document.getElementById('colors-box').value)

	if(boardHeight < 4){
		boardHeight = 4;
		// document.getElementById('height-box').value = 4;
	}
	if(boardWidth < 4){
		boardWidth = 4;
		// document.getElementById('width-box').value = 4;
	}

	canvas.width = boxSize * boardWidth;
	canvas.height = boxSize * boardHeight;
}

function generateBoard(){
	var newBoard = []
	for(var x = 0; x < boardWidth; x++){
		newBoard[x] = []
		for(var y = 0; y < boardHeight; y++){
			if(y < boardHeight/2)
				newBoard[x][y] = 0
			else
				newBoard[x][y] = Math.floor((Math.random() * 5)+ 1)
		}
	}
	return newBoard;
}

function initialize(){
	board = generateBoard()

}

function tick(){
	drawBoard()

	//check for matches
	

}

function swapSelectedBlocks(){
	block1 = board[selectPos[0]][selectPos[1]]
	if(selectHorizontal)
		block2 = board[selectPos[0]][selectPos[1] + 1]
	else
		block2 = board[selectPos[0] + 1][selectPos[1]]

	if(block1 == 0 || block2 == 0)
		return;
	else if(block1 == block2)
		return;

	else {
		board[selectPos[0]][selectPos[1]] = block2
		if(selectHorizontal)
			board[selectPos[0]][selectPos[1] + 1] = block1
		else
			board[selectPos[0] + 1][selectPos[1]] = block1

	}
}

function drawBoard(){
	ctx.strokeStyle = 'rgb(0,0,0)';
	for(var x = 0; x < boardWidth; x++){
		for(var y = 0; y < boardHeight; y++){
			switch (board[x][y]) {
				case 1:
					ctx.fillStyle = 'rgb(100,0,0)';
				break;
				case 2:
					ctx.fillStyle = 'rgb(0,0,100)';
				break;
				case 3:
					ctx.fillStyle = 'rgb(0,100,0)';
				break;
				case 4:
					ctx.fillStyle = 'rgb(100,100,0)';
				break;
				case 5:
					ctx.fillStyle = 'rgb(0,100,100)';
				break;
				default:
					ctx.fillStyle = 'rgb(25,20,25)';

			}
			ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize)
			ctx.lineWidth = boxSize/40;
			ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize)
		}
	}

	ctx.strokeStyle = 'rgb(255,255,255)';
	if(selectHorizontal)
		ctx.strokeRect(selectPos[0] * boxSize, selectPos[1] * boxSize, boxSize, boxSize*2)
	else
		ctx.strokeRect(selectPos[0] * boxSize, selectPos[1] * boxSize, boxSize*2, boxSize)
}

window.addEventListener("keydown", function (event) {
	var upkeys= ["ArrowUp", "j", "J"];
	var downkeys = ["ArrowDown", "k", "K"];
	var leftkeys = ["ArrowLeft", "h", "H"];
	var rightkeys = ["ArrowRight", "l", "L"];
	var flipkeys = [";", "Enter", "Tab"];
	var swapkeys = [" ", ".", ","];
	if(upkeys.indexOf(event.key) >= 0){
		selectPos[1]--;
	}
	if(downkeys.indexOf(event.key) >= 0){
		selectPos[1]++;
	}
	if(leftkeys.indexOf(event.key) >= 0){
		selectPos[0]--;
	}
	if(rightkeys.indexOf(event.key) >= 0){
		selectPos[0]++;
	}
	if(flipkeys.indexOf(event.key) >= 0){
		selectHorizontal = !selectHorizontal;
	}
	if(swapkeys.indexOf(event.key) >= 0){
		swapSelectedBlocks();
		tick();
	}


	if(event.key == "r" || event.key == "R")
		resetGame()

	if(selectHorizontal){
		selectPos[0] = Math.min(Math.max(selectPos[0] ,0), boardWidth - 1)
		selectPos[1] = Math.min(Math.max(selectPos[1] ,0), boardHeight - 2)
	}
	else{
		selectPos[0] = Math.min(Math.max(selectPos[0] ,0), boardWidth - 2)
		selectPos[1] = Math.min(Math.max(selectPos[1] ,0), boardHeight - 1)
	}

	drawBoard()
}, true);
