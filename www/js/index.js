const DISTANCES = [1, 5 ,5 ,10 ,10 ,10 ,15 ,15, 20, "T"];
const BUTTONS   = ["X", 1, 2, 3, 4, 5, 6, 7, 8, 9, " "]


let confirmButton;
let optPlayer;
let optGames;

let currentGameIndex = 0;
let currentPlayerIndex = 0;
let currentDistanceIndex = 0;

let gameData;

let buttonPreviousGame;
let buttonNextGame;

let continueGame = true;

let playerScores = [];  

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    window.screen.orientation.lock("landscape");

    confirmButton = document.getElementById("submitButton");
    optPlayer = document.getElementById("playerCount");
    optGames = document.getElementById("gameCount");
    confirmButton.addEventListener("click", confirmInput);


    buttonPreviousGame = document.getElementById("leftArrow");
    buttonNextGame = document.getElementById("rightArrow");
    buttonPreviousGame.addEventListener("click", previousGame);
    buttonNextGame.addEventListener("click", nextGame);

    firstDisplay();
}


function firstDisplay() {   
    createDistances();
    createAndBindButtons();
}

function createDistances() {
    let divDistances = document.getElementById("distancesContainer");
    for (let value of DISTANCES) {
        let dist = document.createElement("div");
        dist.innerHTML = value;
        divDistances.appendChild(dist).className = "cell-distances"
    }
}

function createAndBindButtons() {
    let divButtons   = document.getElementById("buttonsContainer"); 
    let index = 0;
    for (let value of BUTTONS) {
        let but = document.createElement("button");
        but.innerHTML = value;
        but.id = "button" + index;
        but.addEventListener("click", addValue)
        divButtons.appendChild(but).className = "score-button";
        index++; 
    }

}

function addValue() {
    if (continueGame) {
        let buttonValue;
        if (   this.innerHTML.includes("X")
            || this.innerHTML.includes("&nbsp;")) {

            buttonValue = 0;
        } else {
            buttonValue = this.innerHTML;
        }

        let currentCellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
        let currentCell = document.getElementById(currentCellID);       
        currentCell.innerHTML = this.innerHTML;
        currentCell.value = buttonValue;

        
        
        if (!this.innerHTML.includes("&nbsp;")) {
            toogleBlink(currentCell);
            updateDistanceScores();
            updatePlayerScore();
            updateGameScore();
            updateCellToNext();
        }
    }
}

function updateDistanceScores() {
    let score = 0;
    for (let i = 0; i < getPlayerNumber(); i++) {
        let cellID = "cell" + currentGameIndex + i + currentDistanceIndex;
        let cell = document.getElementById(cellID);
        score += parseInt(cell.value);
    }

    let scoreCellID = "distanceScore" + currentGameIndex + currentDistanceIndex;
    let scoreCell = document.getElementById(scoreCellID);
    scoreCell.innerHTML = score;
    scoreCell.value = score;
}

function updatePlayerScore() {
    let score = 0;
    for (let i = 0; i < 9; i++) {
        let cellID = "cell" + currentGameIndex + currentPlayerIndex + i;
        let cell = document.getElementById(cellID);
        score += parseInt(cell.value);
    }
    let scoreCellID = "cellScore" + currentGameIndex + currentPlayerIndex;
    let cell = document.getElementById(scoreCellID);
    cell.innerHTML = score;
    cell.value = score;
    playerScores[currentGameIndex][currentPlayerIndex] = score;
}

function updateGameScore() {
    let score = 0;

    for (let i = 0; i < getPlayerNumber(); i++) {
        let cellID = "cellScore" + currentGameIndex + i;
        let cell = document.getElementById(cellID);
        score += parseInt(cell.value);
    }

    let cell = document.getElementById("finalGameCell" + currentGameIndex);
    cell.innerHTML = score;
    cell.value = score;
}

function updateCellToNext() {

    if (currentPlayerIndex == getPlayerNumber() - 1) {
        currentPlayerIndex = 0;
        currentDistanceScore = 0;

        if (currentDistanceIndex == 8) {
            currentDistanceIndex = 0
            disbale("button9");
            enable("button1");
        
            if (currentGameIndex < getGameNumber()) {
                currentGameIndex++;

                // si on a fini toutes les parties
                if (currentGameIndex == getGameNumber()) {
                    continueGame = false;
                    showResultScreen();
                }  else {
                    // on change de partie
                    switchToNextGamePage();
                }
            }

        } else {
            enable("button9");
            disbale("button1");
            currentDistanceIndex++;
        }
    } else {
        currentPlayerIndex++
    }

    if (continueGame) {
        let newCell = document.getElementById(
            "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex
        );

        toogleBlink(newCell);
    }
}

function disbale(btnID) {
    document.getElementById(btnID).disabled = true;
}

function enable(btnID) {
    document.getElementById(btnID).disabled = false;
}

function showResultScreen() {
    completeResults();
}

function switchToNextGamePage() {
    let container = document.getElementById("gameContainer");

    container.removeChild(container.firstChild);

    container.appendChild(gameData[currentGameIndex]);

    let display = document.getElementById("gameDisplay");
    display.innerHTML = "Partie " + (currentGameIndex+1) + " / " + getGameNumber();

}

function confirmInput() {
    continueGame = true;
    playerScores = [];
    resetIndex();
    createPlayerNameInput();
    createScoreGrid();
    updateGameNumber();
    activateFisrtCell();
    document.getElementById("button9").disabled = true;
}

function resetIndex() {
    currentGameIndex = 0;
    currentPlayerIndex = 0;
    currentDistanceIndex = 0;
}

function createPlayerNameInput() {
    let div = document.getElementById("playerRender");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i = 0; i < getPlayerNumber(); i++) {
        let inputCell = document.createElement("input");
        inputCell.placeholder = "nom du joueur " + (i+1);
        inputCell.id = "input" + i;
        div.appendChild(inputCell).className = "playerNameInput";
    }

    let cell = document.createElement("div");
    cell.innerHTML = "Total Distance";
    div.appendChild(cell).className = "total-distance";  

}

function createScoreGrid() {

    gameData = [];

    let container = document.getElementById("gameContainer");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let gameIndex = 0; gameIndex < getGameNumber(); gameIndex++) {
    
        let div = document.createElement("div");
        div.className = "multi-game";
        div.id = "multiGame" + gameIndex;

        let temp = [];

        for (let j = 0; j < getPlayerNumber(); j++) {
            temp.push(0);

            for (let index = 0; index < 9; index++) {
                let cell = document.createElement("div");
                cell.innerHTML = "&nbsp;";
                cell.id = "cell" + gameIndex + j + index;
                cell.value = 0;
                cell.addEventListener("click", setThisToCurrentCell);
                div.appendChild(cell).className = "cell";        
            }
            let cell = document.createElement("div");
            cell.innerHTML = "&nbsp;";
            cell.id = "cellScore" + gameIndex + j 
            cell.value = 0;
            div.appendChild(cell).className = "player-score-cell";  
        }

        playerScores.push(temp);

        for (let index = 0; index < 9; index++) {
            let cell = document.createElement("div");
            cell.innerHTML = "&nbsp;";
            cell.id = "distanceScore" + gameIndex + index;
            cell.value = 0;
            div.appendChild(cell).className = "distance-score-cell";        
        }

        let cell = document.createElement("div");
        cell.innerHTML = "&nbsp;";
        cell.id = "finalGameCell" + gameIndex;
        cell.value = 0;
        div.appendChild(cell).className = "final-score-cell";  

        gameData.push(div);
    }

    container.appendChild(gameData[0]);
}

function setThisToCurrentCell() {
    let oldCellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
    let oldCell = document.getElementById(oldCellID);
    toogleBlink(oldCell);

    continueGame = true;

    let currentCell = this;
    toogleBlink(currentCell);

    currentGameIndex = this.id[4];
    currentPlayerIndex = this.id[5];
    currentDistanceIndex = this.id[6];

    if (currentDistanceIndex == 0) {
        enable("button1");
        disbale("button9");
    } 
    if (currentDistanceIndex > 0) {
        disbale("button1");
        enable("button9");
    }
}

function updateGameNumber() {
    let display = document.getElementById("gameDisplay");
    display.innerHTML = "Partie " + 1 + " / " + getGameNumber();
}

function activateFisrtCell() {
    let cellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
    let cell = document.getElementById(cellID);
    try {
        toogleBlink(cell);
    } catch (error) {
        
    }
}

function toogleBlink(cell) {
    if (cell.classList.contains("blink")) {
        cell.classList.remove("blink");
        
    } else {
        cell.classList.add("blink");
    }
}

function getPlayerNumber() {
    let selectedValue = optPlayer.options[optPlayer.selectedIndex].value;
    return selectedValue;
}

function getGameNumber() {
    let selectedValue = optGames.options[optGames.selectedIndex].value;
    return selectedValue;
}

function previousGame() {
    if (currentGameIndex > 0) {   
        enable("button1");
        enable("button9");
        try {
            let oldCellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
            let oldCell = document.getElementById(oldCellID);
            toogleBlink(oldCell);
            
        } catch (error) {
                        
        }

        currentGameIndex--;

        currentDistanceIndex = 0;
        currentPlayerIndex = 0;

        let container = document.getElementById("gameContainer");
        container.removeChild(container.firstChild);
        container.appendChild(gameData[currentGameIndex]);

        activateFisrtCell();

        let display = document.getElementById("gameDisplay");
        display.innerHTML = "Partie " + (currentGameIndex+1) + " / " + getGameNumber();
    }
}

function nextGame() {
    if (currentGameIndex < getGameNumber() ) {
        enable("button1");
        enable("button9");

        let oldCellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
        let oldCell = document.getElementById(oldCellID);
        toogleBlink(oldCell);

        currentGameIndex++;

        if (currentGameIndex == getGameNumber()) {

            completeResults();

        } else if (currentGameIndex < getGameNumber()) {
            
            currentDistanceIndex = 0;
            currentPlayerIndex = 0;
            
            let container = document.getElementById("gameContainer");
            container.removeChild(container.firstChild);
            container.appendChild(gameData[currentGameIndex]);
            
            activateFisrtCell();
            
            let display = document.getElementById("gameDisplay");
            display.innerHTML = "Partie " + (currentGameIndex+1) + " / " + getGameNumber();
        }
    }

}

function completeResults() {
    let result = document.createElement("div");
    
    let exampleData = ["Nom du joueur", 
                       "Score (sur {n} parties)"
                       .replace("{n}", getGameNumber()),
                       "Moyenne"];

    for (let message of exampleData) {
        let div = document.createElement("div");
        div.innerHTML = message;
        result.appendChild(div).className = "recap-cell";
    }    

    let teamScore = 0;
    
    for (let index = 0; index < getPlayerNumber(); index++) {
        let playerData = [];
        let name = document.getElementById("input" + index).value;
        
        if (name == "") {
            name = "Joueur " + index;
        }
        
        playerData.push(name);
        let score = 0;
        for (let gameIndex = 0; gameIndex < getGameNumber(); gameIndex++) {
            score += playerScores[gameIndex][index];
        }
        playerData.push(score);

        teamScore += score;

        let average = (score / getGameNumber()).toFixed(3);
        playerData.push(average);
        
        for (let elt of playerData) {
            let div = document.createElement("div");
            div.innerHTML = elt;
            result.appendChild(div).className = "recap-cell";
        }
    }

    let teamData = ["Total equipe"]

    teamData.push(teamScore);

    teamData.push((teamScore / getGameNumber()).toFixed(3));

    for (let message of teamData) {
        let div = document.createElement("div");
        div.innerHTML = message;
        result.appendChild(div).className = "recap-cell";
    } 

    result.className = "result";

    let container = document.getElementById("gameContainer");
    container.removeChild(container.firstChild);
    container.appendChild(result);
    
}