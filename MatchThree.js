var canvas;
var ctx;
var boardHeight;
var boardWidth;
var boxSize = 40;
var firstFruit = new Point();
function main(){
	canvas = document.getElementById('MatchThreeCanvas')
	ctx = canvas.getContext('2d')
    canvas.addEventListener("click", onClick, false)
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

function initialize(){
}

function tick(){
}

function drawBoard(){
	//"type" should be "head", "snake" "empty", "food"
	if(type == "head"){
		ctx.lineWidth = boxSize/40;
		ctx.fillStyle = 'rgb(100,0,0)';
	}
	if(type == "snake"){
		ctx.lineWidth = boxSize/40;
		ctx.fillStyle = 'rgb(0,100,0)';
	}
	if(type == "empty" || type == "food"){
		ctx.lineWidth = boxSize/40;
		ctx.fillStyle = 'rgb(100,100,200)';
	}

	ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
	ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);

	if(type == "food"){
		ctx.fillStyle = 'rgb(0,0,255)'
		ctx.beginPath();
		ctx.arc((x * boxSize) + boxSize/2,
			(y * boxSize) + boxSize/2,
			(.5*boxSize)/2, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

function onClick(){
    var rect = canvas.getBoundingClientRect();
    boardPos[0] = Math.floor((evt.clientX - rect.left) / boxSize)
    boardPos[1] = Math.floor((evt.clientY - rect.top) / boxSize)
}
