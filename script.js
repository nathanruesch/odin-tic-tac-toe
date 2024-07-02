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
}

function createPlayer(_name, _marker) {
    const name = _name;
    const marker = _marker;

    return { name, marker };
}

function generateGameManager() {
    let turnCounter = 1;
    let currentPlayer = 1;

    function advanceTurn() {
        turnCounter++;

        currentPlayer = turnCounter % 2;
    }

    function getTurn() {
        return turnCounter;
    }

    function getPlayer() {
        return currentPlayer;
    }

    function getPlayerText() {
        if (currentPlayer == 1) {
            return playerOne.marker;
        } else {
            return playerTwo.marker;
        }
    }

    return { advanceTurn, getTurn, getPlayer, getPlayerText };
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
        if (!isPieceOccupied(pos)) {
            boardPieces[pos - 1].setBoardPiece(value);
            return true;
        } else {
            return false;
        }
    }

    function isPieceOccupied(pos) {
        return boardPieces[pos - 1].isOccupied();
    }

    function boardPieceClicked(event) {
        if (setBoardPiece(event.target.dataset.indexNumber, gameManager.getPlayerText())) {
            gameManager.advanceTurn();
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

    parentDiv.appendChild(boardPiece);

    function setBoardPiece(value) {
        boardText.innerText = value;
        occupied = true;
    }

    function isOccupied() {
        return occupied;
    }

    console.log("board piece generated");

    return { boardPiece, setBoardPiece, isOccupied };
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