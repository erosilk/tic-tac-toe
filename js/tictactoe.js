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

class TicTacToe {

    constructor() {


        this.player = "";
        this.computer = "";

        this.playerPicks = [];
        this.computerPicks = [];
        this.difficulty = 1;

        this.winningCombinations = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];

        this.gameStarted = false;
        this.yourTurn = false;
        this.gameFinished = false;
    }

    selectDifficulty(val, callback) {
        this.difficulty = val;
        difficultyWindow.style.display = "none";
        this.showSelectWindow();
    }

    removeSelectWindow() {
        selectwindow.style.display = "none";
    }

    showSelectWindow() {
        $("#selectwindow").animateCss('fadeIn');
        selectwindow.style.display = "flex";
    }

    choosePlayer(val) {
        if (val == "O") {
            this.player = val;
            this.computer = "X";
        } else {
            this.player = "X";
            this.computer = "O";
        }
        this.removeSelectWindow();
        this.gameStarted = true;
        this.computerTurn();
    }

    getRandomPick() {
        const number = Math.floor(Math.random() * 9) + 1;
        const isNumberRepeated = this.playerPicks.includes(number) || this.computerPicks.includes(number);
        return isNumberRepeated ? this.getRandomPick() : number;
    };

    nextGenAIPick() {
        if (this.playerPicks.length > 0 && this.computerPicks.length > 0) {

            //Combinaciones posibles del jugador
            var playerCombinations = this.winningCombinations.slice();
            playerCombinations.forEach(function(combination) {
                playerCombinations.push(combination.filter(function(val) {
                    return !this.playerPicks.includes(val);
                }, this));
            }, this)

            //Combinaciones posibles de la maqina
            var computerCombinations = this.winningCombinations.slice();
            computerCombinations.forEach(function(combination) {
                computerCombinations.push(combination.filter(function(val) {
                    return !this.computerPicks.includes(val);
                }, this));
            }, this)

            playerCombinations = playerCombinations.filter(String);

            let allPicks = this.playerPicks.concat(this.computerPicks);

            let defensiveCombination = playerCombinations.sort(function(a, b) {
                return a.length - b.length
            })[0]
            let offensiveCombination = computerCombinations.sort(function(a, b) {
                return a.length - b.length
            })[0]

            // Se define una jugada defensiva
            let defensivePick = playerCombinations.sort(function(a, b) {
                return a.length - b.length
            })[0][0];
            // Se define una jugada ofensiva
            let offensivePick = computerCombinations.sort(function(a, b) {
                return a.length - b.length
            })[0][0]

            // Si conviene hacer una jugada defensiva, se hace esta. Si la maquina esta a una jugada de ganar y es su turno, ejecuta la jugada ofensiva.
            // Si ninguna de las dos jugadas definidas anteriormente se encuentran disponibles, se hace una jugada aleatoria.
            // Problemas: Convendria que si ninguna de las dos jugadas este disponible, intente la segunda mejor jugada defensiva/ofensiva.
            if (((defensiveCombination.length < offensiveCombination.length) && !allPicks.includes(defensivePick)) || (allPicks.includes(offensivePick) && !allPicks.includes(defensivePick))) {
                return defensivePick;
            } else if ((offensiveCombination.length <= defensiveCombination.length && !allPicks.includes(offensivePick)) || (allPicks.includes(defensivePick) && !allPicks.includes(offensivePick))) {
                return offensivePick;
            } else if (allPicks.includes(defensivePick) && allPicks.includes(offensivePick)) {
                return this.getRandomPick();
            }
        } else {
            //Si nadie hizo una jugada, la primer jugada es aleatoria.
            return this.getRandomPick();
        }
    }

    playerTurn(val) {

        if (this.gameStarted && this.yourTurn && tiles[val].innerHTML == "") {
            tiles[val].innerHTML = this.player;
            this.playerPicks.push(val);
            return this.check(this.playerPicks) ? this.gameOver(this.player) : (this.yourTurn = false, this.tieCheck(), this.computerTurn());
        }

    }

    computerTurn() {
        if (this.gameStarted && !this.yourTurn) {
            var pick = 0;
            if (this.difficulty == 1) {
                pick = this.getRandomPick();
            } else if (this.difficulty == 2) {
                pick = this.nextGenAIPick();
            }

            console.log(this.computerPicks);
            tiles[pick].innerHTML = this.computer;
            this.computerPicks.push(pick);
        }

        return this.check(this.computerPicks) ? this.gameOver(this.computer) : (this.yourTurn = true, this.tieCheck());

    }

    gameStart() {
        this.gameStarted = true;
    }

    check(who, next) {
        for (var k = 0; k < this.winningCombinations.length; k++) {
            if (who.includes(this.winningCombinations[k][0]) && who.includes(this.winningCombinations[k][1]) && who.includes(this.winningCombinations[k][2])) {
                return true;
            }
        };
    }

    tieCheck() {
        if (this.playerPicks.length + this.computerPicks.length == 9) {
            this.gameOver();
        }
    }

    gameOver(who) {
        this.gameStarted = false;
        this.yourTurn = false;
        this.gameFinished = true;

        if (who == this.player) {
            (gameOverText.innerHTML = "You won!, Replay?");
        } else if (who == this.computer) {
            (gameOverText.innerHTML = "You lose, Replay?");
        } else {
            (gameOverText.innerHTML = "It's a tie!, Replay?");
        }
        $("#gameOverWindow").animateCss('fadeIn');
        gameOverWindow.style.display = "flex"
    }

    replay() {
        $("#title").animateCss('pulse');
        if (!this.gameStarted && this.gameFinished) {
            for (var i = 1; i < 10; i++) {
                tiles[i].innerHTML = "";
            }
            this.showSelectWindow();
            gameOverWindow.style.display = "none"
            this.yourTurn = true;
            this.gameStarted = false;
            this.gameFinished = false;
            this.playerPicks = [];
            this.computerPicks = [];
        }
    }

}

var game = new TicTacToe;



document.addEventListener("DOMContentLoaded", function(event) {



    for (var i = 1; i < 10; i++) {
        tiles[i] = document.getElementById(i.toString());
        tiles[i].onclick = function() {
            game.playerTurn(i);
        }
    }

    tiles[1].onclick = function() {
        game.playerTurn(1);
    }
    tiles[2].onclick = function() {
        game.playerTurn(2);
    }
    tiles[3].onclick = function() {
        game.playerTurn(3);
    }
    tiles[4].onclick = function() {
        game.playerTurn(4);
    }
    tiles[5].onclick = function() {
        game.playerTurn(5);
    }
    tiles[6].onclick = function() {
        game.playerTurn(6);
    }
    tiles[7].onclick = function() {
        game.playerTurn(7);
    }
    tiles[8].onclick = function() {
        game.playerTurn(8);
    }
    tiles[9].onclick = function() {
        game.playerTurn(9);
    }

    selectO.onclick = function() {
        game.choosePlayer("O")
    };
    selectX.onclick = function() {
        game.choosePlayer("X")
    };

    selectEasy.onclick = function() {
        game.selectDifficulty(1)
    };
    selectMedium.onclick = function() {
        game.selectDifficulty(2)
    };

    replayButton.onclick = function() {
        game.replay()
    };

    $.fn.extend({
        animateCss: function(animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });

    $("body").animateCss('fadeIn');
    $("body").css("display", "flex");

})