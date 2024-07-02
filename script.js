const winningSpaces = [
    [1,2,3], // Top across
    [4,5,6], // Middle across
    [7,8,9], // Bottom across
    [1,4,7], // Left down
    [2,5,8], // Middle down
    [3,6,9], // Right down
    [1,5,9], // Top left -> Bottom right diagonal
    [3,5,7], // Top right -> Bottom left diagonal
]

const startGameButton = document.getElementById("submit-player-info-button");
const playAgainButton = document.getElementById("play-again-button");

const winDiv = document.getElementById("win-div");

const playerOneNameInput = document.getElementById("player-one-name");
const playerTwoNameInput = document.getElementById("player-two-name");
const playerOneMarkerInput = document.getElementById("player-one-marker");
const playerTwoMarkerInput = document.getElementById("player-two-marker");

const playerInfoDialog = document.getElementById("player-info-dialog");
const playerInfoDialogName = "PlayerInfo";

const gameboardParent = document.getElementById("game");

let playerOne = null;
let playerTwo = null;

let gameboard = null;
let gameManager = null;

function startGame() {
    closeDialog(playerInfoDialogName);
    playerOne = createPlayer(playerOneNameInput.value, playerOneMarkerInput.value);
    playerTwo = createPlayer(playerTwoNameInput.value, playerTwoMarkerInput.value);
    gameManager = generateGameManager();
    gameboard = generateGameBoard();
    gameboard.generateBoardPieces();
    winDiv.style.display = "none";
}

function createPlayer(_name, _marker) {
    const name = _name;
    const marker = _marker;

    return { name, marker };
}

function generateGameManager() {
    let turnCounter = 1;
    let currentPlayer = 1;

    let _hasWinner = false;

    function advanceTurn() {
        turnCounter++;

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    function getTurn() {
        return turnCounter;
    }

    function getPlayer() {
        console.log(currentPlayer);
        return currentPlayer;
    }

    function getPlayerText() {
        if (currentPlayer == 1) {
            return playerOne.marker;
        } else {
            return playerTwo.marker;
        }
    }

    function hasWinner() {
        return _hasWinner;
    }

    function winGame(player) {
        _hasWinner = true;

        let _player = null;

        if (player === 1) {
            _player = playerOne;
        } else if (player === 2) {
            _player = playerTwo;
        }

        let winText = "Player " + _player.name + " has won in " + turnCounter + " turns using marker " + _player.marker;

        document.getElementById("win-div-text").innerText = winText;
        winDiv.style.display = "block";
    }

    return { advanceTurn, getTurn, getPlayer, getPlayerText, winGame, hasWinner };
}

function generateGameBoard() {
    let parentDiv = document.createElement('div');
    parentDiv.className = "gameboard";

    let boardPieces = [];

    gameboardParent.appendChild(parentDiv);

    // Generate the board pieces
    function generateBoardPieces() {
        for (let i = 0; i < 9; i++) {
            let boardPiece = generateBoardPiece(i + 1, parentDiv);
            boardPieces[i] = boardPiece;
        }

        console.log(boardPieces);
    }
    
    // Method to set a board piece occupied
    function setBoardPiece(pos, value) {
        console.log("Tried to click board piece with pos " + pos + " and value " + value);

        if (!isPieceOccupied(pos)) {
            boardPieces[pos - 1].setBoardPiece(value, gameManager.getPlayer());
            checkWinCondition();
            return true;
        } else {
            return false;
        }
    }

    function isPieceOccupied(pos) {
        return boardPieces[pos - 1].isOccupied();
    }

    function boardPieceClicked(event) {
        if (gameManager.hasWinner()) { 
            console.log("GAME HAS WINNER");
            return; 
        }

        if (setBoardPiece(event.target.dataset.indexNumber, gameManager.getPlayerText())) {
            gameManager.advanceTurn();
        }
    }

    function checkWinCondition() {
        let playerOneSpots = [];
        let playerTwoSpots = [];

        for (let i = 0; i < 9; i++) {
            let piece = boardPieces[i];

            if (piece.isOccupied()) {
                console.log(piece);

                if (piece.getPlayer() === 1) {
                    playerOneSpots.push(i + 1);
                } else if (piece.getPlayer() === 2) {
                    playerTwoSpots.push(i + 1);
                } else {
                    console.log("Unknown player for occupied cell");
                }
            }
        }

        let playerOneWon = false;
        let playerTwoWon = false;

        let checker = (arr, target) => target.every(v => arr.includes(v));

        winningSpaces.forEach(space => {
            if (checker(playerOneSpots, space)) {
                playerOneWon = true;
            } else if (checker(playerTwoSpots, space)) {
                playerTwoWon = true;
            }
        });

        if (playerOneWon) {
            gameManager.winGame(1);
        } else if (playerTwoWon) {
            gameManager.winGame(2);
        }
    }

    console.log("gameboard generated");

    return { setBoardPiece, boardPieceClicked, generateBoardPieces };
}

function generateBoardPiece(data, parentDiv) {
    // Create the parent object of the board piece
    let boardPiece = document.createElement('div');
    // Setup our parent object, giving it the data and click listener
    boardPiece.dataset.indexNumber = data;
    boardPiece.addEventListener("click", gameboard.boardPieceClicked, false);
    boardPiece.className = "board-piece-parent";

    // Setup the text for the board piece
    let boardText = document.createElement('p');
    boardText.innerText = "";
    boardText.className = "board-piece-text";
    boardPiece.appendChild(boardText);

    let occupied = false;
    let player = -1;

    parentDiv.appendChild(boardPiece);

    function setBoardPiece(value, _player) {
        boardText.innerText = value;
        occupied = true;
        player = _player;
    }

    function isOccupied() {
        return occupied;
    }

    function getPlayer() {
        return player;
    }

    console.log("board piece generated");

    return { boardPiece, setBoardPiece, isOccupied, getPlayer, player, occupied };
}

function playAgain() {
    openDialog(playerInfoDialogName);
}

function openDialog(dialogName) {
    switch (dialogName) {
        case "PlayerInfo":
            playerInfoDialog.showModal();
            break;
    }
}

function closeDialog(dialogName) {
    switch (dialogName) {
        case playerInfoDialogName:
            playerInfoDialog.close();
    }
}

startGameButton.addEventListener("click", startGame, false);
playAgainButton.addEventListener("click", playAgain, false);

playerInfoDialog.showModal();