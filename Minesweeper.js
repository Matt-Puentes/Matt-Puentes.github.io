var boardHeight = 10
var boardWidth = 10
var mineNum = 10
var lost = false
var boxSize
var board
var canvas
var ctx
var boardPos = [-1, -1]
function main(){
	canvas = document.getElementById('MinesweeperCanvas')
	ctx = canvas.getContext('2d')
	// canvas.width = boxSize * boardWidth;
	// canvas.height = boxSize * boardHeight;

	initializeBoard()

	canvas.addEventListener("click", clickBoard, false)
	canvas.addEventListener("contextmenu", onRightClick, false)
	canvas.addEventListener("mousemove", onMouseMove, false)
	document.getElementById("reset").onclick = function(){
		if(initializeBoard()){
			lost=false;
			draw();
		}
	};

	boxSize = Math.min(canvas.width / boardWidth, canvas.height / boardHeight)
	draw()
}

function drawTile(x,y){
	if(board[x][y].flag == true){
		ctx.fillStyle = 'rgb(200,0,100)'
	}
	else if(board[x][y].clicked == true){
		ctx.fillStyle = 'rgb(200,100,100)'
	}
	else
		ctx.fillStyle = 'rgb(200,100,0)'

	//Draw the rectangle no matter what
	ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize)
	ctx.lineWidth = boxSize/40;
	ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize)

	//Draw text over clicked boxes
	if(board[x][y].clicked == true && board[x][y].neighbors != 0){
		ctx.textAlign="center"
		ctx.textBaseline="middle"
		ctx.fillStyle = 'rgb(0,0,0)'
		ctx.font = ctx.font.replace(/\d+px/, boxSize+"px");
		ctx.fillText(board[x][y].neighbors, (x * boxSize) + boxSize/2, (y * boxSize) + boxSize/2);
	}


	if(lost && board[x][y].mine == true){
		ctx.fillStyle = 'rgb(0,10, 0)'
		ctx.beginPath();
		ctx.arc((x * boxSize) + boxSize/2, (y * boxSize) + boxSize/2, (.5*boxSize)/2, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

function draw(){
	for (var x = 0; x < board.length; x++) {
		for(var y = 0; y < board[x].length; y++){
			drawTile(x,y);
		}
	}

	//Draw "cursor" box
	if(boardPos[0] < boardWidth && boardPos[1] < boardHeight){
		ctx.fillStyle = 'rgba(100,100,100,0.5)'
		ctx.fillRect(boardPos[0] * boxSize, boardPos[1] * boxSize, boxSize, boxSize)
	}
}

function onRightClick(evt){
	if(boardPos[0] < boardWidth && boardPos[1] < boardHeight){
		if(!board[boardPos[0]][boardPos[1]].clicked){

			updateMouse(evt)
			currentTile().flag = !currentTile().flag

			//Check for win condition
			win = true;
			for (var x = 0; x < board.length; x++) {
				for(var y = 0; y < board[x].length; y++){
				  	if(board[x][y].mine != board[x][y].flag || (!board[x][y].clicked && !board[x][y].flag)){
						win = false;
						break
					}
				}
			}
			if(win){
				alert("You win!")
			}
			draw()
		}
	}
}

function clickBoard(evt){
	if(boardPos[0] < boardWidth && boardPos[1] < boardHeight){

		updateMouse(evt)

		//Check for mine
		if(board[boardPos[0]][boardPos[1]].mine == true && !lost){
			lost = true
			alert("You lose!")
			for (var x = 0; x < board.length; x++) {
				for(var y = 0; y < board[x].length; y++){
					if(!board[x][y].mine)
					board[x][y].clicked = true
				}
			}
			draw()

		}
		else if(!lost){
			//Else, make the tile "clicked"
			board[boardPos[0]][boardPos[1]].clicked = true

			if(board[boardPos[0]][boardPos[1]].neighbors == 0){
				//Check for neighbors with no neighbors
				noNeighbors = [board[boardPos[0]][boardPos[1]]]
				for(var i = 0; i < noNeighbors.length; i++){
					var neighbors = getTileNeighbors(noNeighbors[i].x, noNeighbors[i].y)
					for(let n of neighbors){
						if(board[n.x][n.y].clicked == true)
							continue;

						board[n.x][n.y].clicked = true;
						if(board[n.x][n.y].neighbors == 0){
							noNeighbors.push(board[n.x][n.y])
						}
					}
				}
			}
			//If the tile was flagged, unflag it.
			board[boardPos[0]][boardPos[1]].flag = false;

			draw()
		}
	}
}

function onMouseMove(evt){
	updateMouse(evt)
	draw()
}

function initializeBoard(){
	boardHeight = parseInt(document.getElementById('height-box').value)
	boardWidth = parseInt(document.getElementById('width-box').value)
	mineNum = parseInt(document.getElementById('mines-box').value)

	if(mineNum <= 0 || boardHeight <= 0 || boardWidth <= 0){
		alert("Please input values greater than 0.")
		return false;
	}

	if(mineNum >= boardHeight*boardWidth){
		alert("Too many mines! there would only be "+ (boardHeight * boardWidth) +" tiles on the board.")
		return false;
	}

	if(isNaN(boardHeight))
		boardHeight = 10
	if(isNaN(boardWidth))
		boardWidth = 10
	if(isNaN(mineNum))
		mineNum = 10

	//make board
	boxSize = Math.min(canvas.width / boardWidth, canvas.height / boardHeight)
	board = new Array(boardWidth)
	for (var x = 0; x < board.length; x++) {
	  board[x] = new Array(boardHeight);
	  for(var y = 0; y < board[x].length; y++){
		  board[x][y] = {"x": x,
		  				"y": y,
			  			"clicked": false,
		  				"mine": false,
		  				"flag": false,
		  				"neighbors": 0};
	  }
	}

	//place the mines
	var placedMines = 0;
	while(placedMines < mineNum){
		var minex = Math.floor(Math.random() * boardWidth);
		var miney = Math.floor(Math.random() * boardHeight);
		if(!board[minex][miney].mine){
			board[minex][miney].mine = true;
			placedMines++;
		}
	}

	//count the neighbors
	for (var x = 0; x < board.length; x++) {
		for(var y = 0; y < board[x].length; y++){
			//Iterate over neighbors
			var neighbors = getTileNeighbors(x,y)
			for(let n of neighbors){
				if(board[n.x][n.y].mine)
					board[x][y].neighbors++
			}
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	return true;
}

function currentTile(){
	return board[boardPos[0]][boardPos[1]];
}

function updateMouse(evt){
	var rect = canvas.getBoundingClientRect();
	boardPos[0] = Math.floor((evt.clientX - rect.left) / boxSize)
	boardPos[1] = Math.floor((evt.clientY - rect.top) / boxSize)
}

function getTileNeighbors(x, y){
	var neighbors = []
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			var dx = x+i
			var dy = y+j
			if(i == 0 && j == 0)
				continue
			if(dx < 0 || dy < 0 || dx >= board.length || dy >= board[x].length)
				continue
			neighbors.push({"x":dx, "y":dy})
		}
	}
	return neighbors
}
