var canvas;
var ctx;
var boardHeight;
var boardWidth;
var boxSize = 40;
var pressedDirection = ""; //"left","right","down","up",""
var lastDirection = "";
var nextTick = -1;
var snake = [];
var food = [];
function main(){
	canvas = document.getElementById('SnakeCanvas')
	ctx = canvas.getContext('2d')
	document.getElementById("reset").onclick = resetGame;
	resetGame();
	tick();
}

function resetGame(){
	checkInput();
	initialize();
	pressedDirection = "";
	lastDirection = "";
	if(nextTick != -1)
		clearTimeout(nextTick)
	nextTick = setTimeout(tick, 500);
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
	snake = []
	//these are the initial snake values
	var snakeYpos = Math.floor(boardHeight*0.5);
	var snakeXpos = 0;
	var snakeLength = 3;
	for(var i = 0; i < snakeLength; i++){
		snake.push({"x":snakeXpos+i, "y":snakeYpos});
	}

	//this is the initial food placement
	var foodX;
	if(snake.length * 2 > boardWidth)
		foodX = boardWidth-1;
	else {
		foodX = boardWidth-snake.length;
	}
	food = [foodX, snakeYpos];

	//draw all tiles
	for (var x = 0; x < boardWidth; x++) {
		for(var y = 0; y < boardHeight; y++){
			draw(x, y, "empty");
		}
	}

	for(var i = 0; i < snake.length; i++){
		if(i == snake.length - 1)
			draw(snake[i].x, snake[i].y, "head");
		else
			draw(snake[i].x, snake[i].y, "snake");
	}

	draw(food[0], food[1], "food");
}

function generateNewFood(){
	var candidates = [];
	for (var x = 0; x < boardWidth; x++) {
		for(var y = 0; y < boardHeight; y++){
			//Don't add candidate unless it's valid
			var valid = true;
			for(var i = 0; i < snake.length; i++){
				if(snake[i].x == x && snake[i].y == y){
					valid = false;
					break;
				}
			}
			if(valid)
				candidates.push([x,y]);
		}
	}
	var candidate = candidates[Math.floor(Math.random() * candidates.length)];
	return candidate;
}

function tick(){
	var lost = false;
	//only run if the user has started the game
	if(pressedDirection != ""){
		lastDirection = pressedDirection;

		//check for food
		var ateFood = false;
		if(snake[snake.length-1].x == food[0] && snake[snake.length-1].y == food[1]){
			if(snake.length + 1 == boardWidth * boardHeight){
				alert("You Win!");
				return;
			}
			ateFood = true;
			food = generateNewFood();
			draw(food[0], food[1], "food")
		}

		//removes tail of snake
		if(!ateFood){
			var tail = snake.shift();
			draw(tail.x, tail.y, "empty");
		}
		//get next snake tile
		var nextTile = {"x":snake[snake.length-1].x,
						"y":snake[snake.length-1].y};
		if(pressedDirection == "up")
			nextTile.y -= 1
		if(pressedDirection == "down")
			nextTile.y += 1
		if(pressedDirection == "left")
			nextTile.x -= 1
		if(pressedDirection == "right")
			nextTile.x += 1

		for(var i = 0; i < snake.length; i++){
			if(nextTile.x == snake[i].x && nextTile.y == snake[i].y){
				lost = true;
				break;
			}
		}
		if(nextTile.x < 0 || nextTile.x >= boardWidth || nextTile.y < 0 || nextTile.y >= boardHeight){
			lost = true;
		}
		if(lost){
			pressedDirection = "";
			lastDirection = "";
			alert("you lose!")
			return;
		}

		draw(snake[snake.length-1].x, snake[snake.length-1].y, "snake");
		draw(nextTile.x, nextTile.y, "head");
		snake.push(nextTile);
	}

	if(nextTick != -1)
		clearTimeout(nextTick)
	nextTick = setTimeout(tick, 200);
}

function draw(x, y, type){
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

window.addEventListener("keydown", function (event) {
	var upkeys= ["ArrowUp", "j", "J"];
	var downkeys = ["ArrowDown", "k", "K"];
	var leftkeys = ["ArrowLeft", "h", "H"];
	var rightkeys = ["ArrowRight", "l", "L"];
	if(upkeys.indexOf(event.key) >= 0){
		if(lastDirection != "down"){
			pressedDirection = "up";
		}
	}
	if(downkeys.indexOf(event.key) >= 0){
		if(lastDirection != "up"){
			pressedDirection = "down";
		}
	}
	if(leftkeys.indexOf(event.key) >= 0){
		if(lastDirection != "right"){
			pressedDirection = "left";
		}
	}
	if(rightkeys.indexOf(event.key) >= 0){
		if(lastDirection != "left"){
			pressedDirection = "right";
		}
	}
	if(event.key == "r" || event.key == "R")
		resetGame()
}, true);
