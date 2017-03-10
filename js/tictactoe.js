var selectX = document.getElementById("selectx");
var selectO = document.getElementById("selecto");

var selectEasy = document.getElementById("selecteasy");
var selectMedium = document.getElementById("selectmedium");

var selectWindow = document.getElementById("selectwindow");

var difficultyWindow = document.getElementById("difficultywindow");

var gameOverWindow = document.getElementById("gameOverWindow");
var gameOverText = document.getElementById("gameOverText");

var replayButton = document.getElementById("replay");

var titleCard = document.getElementById("titlecard");
var tiles = [];

var player = "";
var computer = "";

var playerPicks = [];
var computerPicks = [];
var difficulty = 1;

const winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

var gameStarted = false;
var yourTurn = false;
var gameFinished = false;

function selectDifficulty(val, callback){
	difficulty = val;
	difficultyWindow.style.display = "none";
	showSelectWindow();
}


function removeSelectWindow(){
	//$("#selectwindow").animateCss('fadeOut');
	selectwindow.style.display = "none";
	
	//titleCard.style.justifyContent = "center";
}

function showSelectWindow(){
	$("#selectwindow").animateCss('fadeIn');
	selectwindow.style.display = "flex";
}

function choosePlayer(val){
	if (val == "O") {
		player = val;
		computer = "X";
	} else {
		player = "X";
		computer = "O";
	}
	removeSelectWindow();
	gameStarted = true;
	computerTurn();
}

function getRandomPick() {
    const number = Math.floor(Math.random()*9)+1;
    const isNumberRepeated = playerPicks.includes(number) || computerPicks.includes(number);
    return isNumberRepeated ? getRandomPick() : number;
};

function nextGenAIPick(){
	if (playerPicks.length > 0 && computerPicks.length > 0){

	//Combinaciones posibles del jugador
	var playerCombinations = winningCombinations.slice();
	playerCombinations.forEach(function(combination){
		playerCombinations.push(combination.filter(function(val){
			return !playerPicks.includes(val);
		}));
	})

	//Combinaciones posibles de la maqina
	var computerCombinations = winningCombinations.slice();
	computerCombinations.forEach(function(combination){
		computerCombinations.push(combination.filter(function(val){
			return !computerPicks.includes(val);
		}));
	})

	playerCombinations = playerCombinations.filter(String);

	let allPicks = playerPicks.concat(computerPicks);

	defensiveCombination = playerCombinations.sort(function(a,b){return a.length-b.length})[0]
	offensiveCombination = computerCombinations.sort(function(a,b){return a.length-b.length})[0]

	// Se define una jugada defensiva
	defensivePick = playerCombinations.sort(function(a,b){return a.length-b.length})[0][0];
	// Se define una jugada ofensiva
	offensivePick = computerCombinations.sort(function(a,b){return a.length-b.length})[0][0]

	// Si conviene hacer una jugada defensiva, se hace esta. Si la maquina esta a una jugada de ganar y es su turno, ejecuta la jugada ofensiva.
	// Si ninguna de las dos jugadas definidas anteriormente se encuentran disponibles, se hace una jugada aleatoria.
	// Problemas: Convendria que si ninguna de las dos jugadas este disponible, intente la segunda mejor jugada defensiva/ofensiva.
	if (((defensiveCombination.length < offensiveCombination.length) && !allPicks.includes(defensivePick)) || (allPicks.includes(offensivePick) && !allPicks.includes(defensivePick))){
		return defensivePick;
	} else if ((offensiveCombination.length <= defensiveCombination.length && !allPicks.includes(offensivePick)) || (allPicks.includes(defensivePick) && !allPicks.includes(offensivePick))){
		return offensivePick;
	} else if (allPicks.includes(defensivePick) && allPicks.includes(offensivePick)){
		return getRandomPick();
	}
	} else {
		//Si nadie hizo una jugada, la primer jugada es aleatoria.
		return getRandomPick();
	}
}

function playerTurn(val){
	//console.log(tiles);
	if (gameStarted && yourTurn && tiles[val].innerHTML == ""){
		tiles[val].innerHTML = player;
		playerPicks.push(val);
		return check(playerPicks) ? gameOver(player) : (yourTurn = false, tieCheck(), computerTurn());
	}
	//yourTurn = false;
	//computerTurn();
}

function computerTurn(){
	if (gameStarted && !yourTurn){
		var pick = 0;
		if (difficulty == 1){
			pick = getRandomPick();
		} else if (difficulty == 2){
			pick = nextGenAIPick();
		}
		
		console.log(computerPicks);
		tiles[pick].innerHTML = computer;
		computerPicks.push(pick);
	}

	return check(computerPicks) ? gameOver(computer) : (yourTurn = true, tieCheck());

}

function gameStart(){
	gameStarted = true;
}

function check(who, next){
	for (var k = 0; k < winningCombinations.length; k++) {
		if (who.includes(winningCombinations[k][0]) && who.includes(winningCombinations[k][1]) && who.includes(winningCombinations[k][2])){
			return true;
		}
	};
}

function tieCheck(){
	if (playerPicks.length + computerPicks.length == 9){
		gameOver();
	}
}

function gameOver(who){
	gameStarted = false;
	yourTurn = false;
	gameFinished = true;

	if (who == player){
		(gameOverText.innerHTML = "You won!, Replay?");
	} else if (who == computer){
		(gameOverText.innerHTML = "You lose, Replay?");
	} else {
		(gameOverText.innerHTML = "It's a tie!, Replay?");
	}
	$("#gameOverWindow").animateCss('fadeIn');
	gameOverWindow.style.display = "flex"
}

function replay(){
	$("#title").animateCss('pulse');
	if (!gameStarted && gameFinished){
		for (var i = 1; i < 10; i++){
			tiles[i].innerHTML = "";
		}
	showSelectWindow();
	gameOverWindow.style.display = "none"
	yourTurn = true;
	gameStarted = false;
	gameFinished = false;
	playerPicks = [];
	computerPicks = [];
	}
}



document.addEventListener("DOMContentLoaded", function (event) {
	
	

	for (var i = 1; i < 10; i++){
		tiles[i] = document.getElementById(i.toString());
		tiles[i].onclick = function(){playerTurn(i);}
	}

	tiles[1].onclick = function(){playerTurn(1);}
	tiles[2].onclick = function(){playerTurn(2);}
	tiles[3].onclick = function(){playerTurn(3);}
	tiles[4].onclick = function(){playerTurn(4);}
	tiles[5].onclick = function(){playerTurn(5);}
	tiles[6].onclick = function(){playerTurn(6);}
	tiles[7].onclick = function(){playerTurn(7);}
	tiles[8].onclick = function(){playerTurn(8);}
	tiles[9].onclick = function(){playerTurn(9);}

	selectO.onclick = function(){choosePlayer("O")};
	selectX.onclick = function(){choosePlayer("X")};

	selectEasy.onclick = function(){selectDifficulty(1, showSelectWindow)};
	selectMedium.onclick = function(){selectDifficulty(2, showSelectWindow)};
		
	replayButton.onclick = function(){replay()};

	$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

	$("body").animateCss('fadeIn');
	$("body").css("display", "flex");

})

