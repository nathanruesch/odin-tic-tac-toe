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

const playerInfoDialogName = "PlayerInfo";

function createPlayer(_name, _marker) {
    const name = _name;
    const marker = _marker;

    return { name, marker };
}

let playerOne = null;
let playerTwo = null;

let turnCounter = 0;
let currentPlayer = 1;

let currentBoard = [];

function startGame() {
    generateGameBoard();
    turnCounter = 1;

    playerOne = createPlayer(playerOneNameInput.value, "X");
    playerTwo = createPlayer(playerTwoNameInput.value, "O");
}

function generateGameBoard() {

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

function placeMarker(pos) {

}

startGameButton.addEventListener("click", startGame, false);