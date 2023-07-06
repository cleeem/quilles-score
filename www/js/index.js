const DISTANCES = [1, 5 ,5 ,10 ,10 ,10 ,15 ,15, 20, "T"];
const BUTTONS   = ["X", 1, 2, 3, 4, 5, 6, 7, 8, 9, " "]
const TARGET_SCORE = [4, 7, 7, 6, 6, 6, 5, 5, 4];

const GREEN_COLOR = "#5eb35c";
const RED_COLOR   = "#ff6d6d";
const BLUE_COLOR  = "#8EF9F3";

let confirmButton;
let optPlayer;
let optGames;
let parametersButton;

let currentGameIndex = 0;
let currentPlayerIndex = 0;
let currentDistanceIndex = 0;

let strokesCount = 0;
let finishedGameCount = 0;

let playerCount = 0;
let gameCount = 0;

let gameData;

let buttonPreviousGame;
let buttonNextGame;

let continueGame = true;
let colorDistance = false;
let showingMenu = false;

let playerScores = [];  

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    window.screen.orientation.lock("landscape");

    confirmButton = document.getElementById("submitButton");
    optPlayer = document.getElementById("playerCount");
    optGames = document.getElementById("gameCount");
    confirmButton.addEventListener("click", confirmInput);
    parametersButton = document.getElementById("parameters");


    buttonPreviousGame = document.getElementById("leftArrow");
    buttonNextGame = document.getElementById("rightArrow");
    buttonPreviousGame.addEventListener("click", previousGame);
    buttonNextGame.addEventListener("click", nextGame);
    parametersButton.addEventListener("click", showMenu);

    firstDisplay();
}


function firstDisplay() {   
    createDistances();
    createAndBindButtons();
    showMenu();
}

function showMenu() {
    let container = document.getElementById("gameContainer");
    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let newDiv = document.createElement("div");
    newDiv.id = "paramMenu";
    newDiv.className = "menu";

    let title = document.createTextNode("Parametres");
    newDiv.appendChild(title);


    let playerDiv = document.createElement("div");
    playerDiv.className = "parameters-section";
    let textPlayer = document.createElement("div");
    textPlayer.innerHTML = "Nombre de joueurs";
    playerDiv.appendChild(textPlayer);

    let playerInputDiv = document.createElement("div");
    let playerInput = document.createElement("select");
    for (let i = 1; i <= 5; i++) {
        let text = i == 1 ? " joueur" : " joueurs";
        let option = document.createElement("option");
        option.value = i;
        option.text = i + text;
        playerInput.add(option);
    }
    playerInput.id = "playerCount";
    playerInputDiv.appendChild(playerInput).className = "userInput";
    playerDiv.appendChild(playerInputDiv);
    newDiv.appendChild(playerDiv);
    

    let gameDiv = document.createElement("div");
    gameDiv.className = "parameters-section";
    let textGame = document.createElement("div");
    textGame.innerHTML = "Nombre de parties";
    gameDiv.appendChild(textGame);

    let gameInputDiv = document.createElement("div");
    let gameInput = document.createElement("select");
    for (let i = 1; i <= 4; i++) {
        let text = i == 1 ? " partie" : " parties";
        let option = document.createElement("option");
        option.value = i;
        option.text = i + text;
        gameInput.add(option);
    }
    gameInput.id = "gameCount";
    gameInputDiv.appendChild(gameInput).className = "userInput";
    gameDiv.appendChild(gameInputDiv);
    newDiv.appendChild(gameDiv);

    let infos1 = document.createElement("div");
    infos1.innerHTML = "Cliquez sur confirmer pour lancer les parties"
    newDiv.appendChild(infos1);

    let infos2 = document.createElement("div");
    infos2.innerHTML = "Note : si une partie est en cours, elle sera perdue"
    newDiv.appendChild(infos2);

    let buttonClear = document.createElement("button");
    buttonClear.id = "buttonClear";
    buttonClear.innerHTML = "Effacer"
    buttonClear.addEventListener("click", clear);

    newDiv.appendChild(buttonClear);

    let buttonBack = document.createElement("button");
    buttonBack.id = "buttonBack";
    buttonBack.innerHTML = "Retour"
    buttonBack.addEventListener("click", backToGame);

    newDiv.appendChild(buttonBack);

    container.appendChild(newDiv);
    
    let switch50 = document.getElementById("colorDistance");
    switch50.addEventListener("change", toogleDistanceColor)

    showingMenu = true;
}

function clear() {
    resetIndex();
    confirmInput();
}

function backToGame() {
    let container = document.getElementById("gameContainer");
    container.removeChild(container.firstChild);
    showMenu = false;
    if (gameData[currentGameIndex] != undefined) {
        container.appendChild(gameData[currentGameIndex]);
    } else if (document.getElementById("gameDisplay").innerHTML == "RESULTATS") {
        completeResults();
    }
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
    scoreCell.value = score;

    let newMainScore = document.createElement("div");
    newMainScore.innerHTML = score;

    while (scoreCell.firstChild) {
        scoreCell.removeChild(scoreCell.firstChild);
    }

    colorDistanceCell(scoreCell, newMainScore, score);

    
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
    cell.value = score;

    let newMainScore = document.createElement("div");
    newMainScore.innerHTML = score;

    playerScores[currentGameIndex][currentPlayerIndex] = score;

    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }

    colorPlayerCell(cell, newMainScore, score);
}

function updateGameScore() {
    let score = 0;

    for (let i = 0; i < getPlayerNumber(); i++) {
        let cellID = "cellScore" + currentGameIndex + i;
        let cell = document.getElementById(cellID);
        score += parseInt(cell.value);
    }

    let cell = document.getElementById("finalGameCell" + currentGameIndex);
    cell.value = score;
    
    let newMainScore = document.createElement("div");
    newMainScore.innerHTML = score;

    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }

    colorGameScoreCell(cell, newMainScore, score);

}

function colorDistanceCell(cell, newMainScore, score) {
    if (!colorDistance) {
        cell.appendChild(newMainScore).className = "center";
        cell.style.backgroundColor = BLUE_COLOR;

    } else {
        let newSubScore = document.createElement("div");
        let scoreDiff;
        let targetSum = (TARGET_SCORE[currentDistanceIndex] * (currentPlayerIndex + 1));
        
        cell.appendChild(newMainScore).className = "main-score";

        if (score < targetSum) {
            cell.style.backgroundColor = RED_COLOR;
            scoreDiff = "-" + (targetSum - score);

        } else {
            cell.style.backgroundColor = GREEN_COLOR;

            scoreDiff = "+" + (score - targetSum);
        }
        newSubScore.innerHTML = scoreDiff;
        cell.appendChild(newSubScore).className = "sub-score";
    }
}

function colorPlayerCell(cell, newMainScore, score) {
    if (!colorDistance) {
        cell.appendChild(newMainScore).className = "center";
        cell.style.backgroundColor = BLUE_COLOR;

    } else {
        cell.appendChild(newMainScore).className = "main-score";
        
        let targetSum = 0;
        for (let i = 0; i <= currentDistanceIndex; i++) {
            targetSum += TARGET_SCORE[i];
        }
        
        let scoreDiff = score < targetSum
                     ? "-" + (targetSum - score)
                     : "+" + (score - targetSum);
        
        let newSubScore = document.createElement("div");
        newSubScore.innerHTML = scoreDiff;
        cell.appendChild(newSubScore).className = "sub-score";
        
        cell.style.backgroundColor = 
            score < targetSum
            ? RED_COLOR
            : GREEN_COLOR;
    }
}

function colorGameScoreCell(cell, newMainScore, score) {
    if (!colorDistance) {
        cell.appendChild(newMainScore).className = "center";
        cell.style.backgroundColor = BLUE_COLOR;
    } else {
        let scoreDiff;
        let newSubScore = document.createElement("div");
        
        let targetSum = 0;
        for (let i = 0; i <= currentDistanceIndex; i++) {
            targetSum += (TARGET_SCORE[i] * getPlayerNumber());
        }
        
        cell.appendChild(newMainScore).className = "main-score";

        if (score < targetSum) {
            cell.style.backgroundColor = RED_COLOR;
            scoreDiff = "-" + (targetSum - score);

        } else {
            cell.style.backgroundColor = GREEN_COLOR;

            scoreDiff = "+" + (score - targetSum);
        }
        newSubScore.innerHTML = scoreDiff;
        cell.appendChild(newSubScore).className = "sub-score";
    }
}

function updateCellToNext() {
    strokesCount++;

    if (strokesCount % (getPlayerNumber() * 9) == 0 && finishedGameCount < getGameNumber()) {
        finishedGameCount++;
    }

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

function toogleDistanceColor() {
    console.log("bonsoir");
    colorDistance = !colorDistance;
    if (!showingMenu) {
        changeDistanceCellColor();
        changePlayerCellColor();
        changeGameScoreCellColor();
    }
}

function changeDistanceCellColor() {
    for (let distanceIndex = 0; distanceIndex < currentDistanceIndex; distanceIndex++) {
        let distanceScore = 0;
        for (let player = 0; player < getPlayerNumber(); player++) {
            let cellID = "cell" + currentGameIndex + player + distanceIndex;
            let cell = document.getElementById(cellID);
            distanceScore += parseInt(cell.value); 
        }
        let newMainScore = document.createElement("div");
        newMainScore.innerHTML = distanceScore;
        
        let cellID = "distanceScore" + currentGameIndex + distanceIndex;
        let cell = document.getElementById(cellID);
        
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
        colorDistanceCell(cell, newMainScore, distanceScore);
    }
}

function changePlayerCellColor() {
    for (let playerIndex = 0; playerIndex < getPlayerNumber(); playerIndex++) {
        let playerScore = 0;
        for (let dist = 0; dist < currentDistanceIndex; dist++) {
            let cellID = "cell" + currentGameIndex + playerIndex + dist;
            let cell = document.getElementById(cellID);
            console.log(cellID);
            playerScore += parseInt(cell.value); 
        }
        let newMainScore = document.createElement("div");
        newMainScore.innerHTML = playerScore;
        
        let cellID = "cellScore" + currentGameIndex + playerIndex;
        let cell = document.getElementById(cellID);
        
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
        colorPlayerCell(cell, newMainScore, playerScore);
    }
}

function changeGameScoreCellColor() {
    let gameScore = 0;
    for (let playerIndex = 0; playerIndex < getPlayerNumber(); playerIndex++) {
        let cellID = "cellScore" + currentGameIndex + playerIndex;
        let cell = document.getElementById(cellID);
        gameScore += parseInt(cell.value);
    }
    let newMainScore = document.createElement("div");
    newMainScore.innerHTML = gameScore;

    let cell = document.getElementById("finalGameCell" + currentGameIndex);

    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }
    colorPlayerCell(cell, newMainScore, gameScore);
}

function confirmInput() {
    playerCount = document.getElementById("playerCount").value;
    gameCount = document.getElementById("gameCount").value;

    if (showingMenu) {
        let container = document.getElementById("gameContainer");
        container.removeChild(container.firstChild);
        showingMenu = false;
    }
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
    finishedGameCount = 0;
    strokesCount = 0;
    gameData = [];
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

            createCell(div, gameIndex, j);

            let cell = document.createElement("div");
            cell.innerHTML = "&nbsp;";
            cell.id = "cellScore" + gameIndex + j 
            cell.value = 0;
            div.appendChild(cell).className = "player-score-cell";  
        }

        playerScores.push(temp);

        createDistanceCell(div, gameIndex);

        let cell = document.createElement("div");
        cell.innerHTML = "&nbsp;";
        cell.id = "finalGameCell" + gameIndex;
        cell.value = 0;
        div.appendChild(cell).className = "final-score-cell";  

        gameData.push(div);
    }

    container.appendChild(gameData[0]);
}

function createCell(div, gameIndex, j) {
    for (let index = 0; index < 9; index++) {
        let cell = document.createElement("div");
        cell.innerHTML = "&nbsp;";
        cell.id = "cell" + gameIndex + j + index;
        cell.value = 0;
        cell.addEventListener("click", setThisToCurrentCell);
        div.appendChild(cell).className = "cell";        
    }
}

function createDistanceCell(div, gameIndex) {
    for (let index = 0; index < 9; index++) {
        let cell = document.createElement("div");
        cell.innerHTML = "&nbsp;";
        cell.id = "distanceScore" + gameIndex + index;
        cell.value = 0;
        div.appendChild(cell).className = "distance-score-cell";        
    }
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
    return playerCount;
}

function getGameNumber() {
    return gameCount;
}

function previousGame() {
    if (currentGameIndex > 0) {   
        enable("button1");
        disbale("button9");
        try {
            let oldCellID = "cell" + currentGameIndex + currentPlayerIndex + currentDistanceIndex;
            let oldCell = document.getElementById(oldCellID);
            toogleBlink(oldCell);
            
        } catch (error) {
                        
        }

        currentGameIndex--;

        currentDistanceIndex = 0;
        currentPlayerIndex = 0;

        continueGame = true;


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
        disbale("button9");

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
    
    let teamScore = 0;
    
    for (let index = 0; index < getPlayerNumber(); index++) {
        let playerData = [];
        let name = document.getElementById("input" + index).value;
        
        if (name == "") {
            name = "Joueur " + (index+1);
        }
        
        playerData.push(name);
        let score = 0;
        for (let gameIndex = 0; gameIndex < getGameNumber(); gameIndex++) {
            score += playerScores[gameIndex][index];
        }
        playerData.push(score);

        teamScore += score;

        if (finishedGameCount != 0) {
            let average = (score / finishedGameCount).toFixed(3);
            playerData.push(average);
        } else {
            playerData.push(0.000);
        }
        
        for (let elt of playerData) {
            let div = document.createElement("div");
            div.innerHTML = elt;
            result.appendChild(div).className = "recap-cell";
        }
    }

    let teamData = ["Total equipe"]

    teamData.push(teamScore);

    if (finishedGameCount != 0) {
        teamData.push((teamScore / finishedGameCount).toFixed(3));
    } else {
        teamData.push(0.000);
    }

    for (let message of teamData) {
        let div = document.createElement("div");
        div.innerHTML = message;
        result.appendChild(div).className = "recap-cell";
    } 

    let gameText = finishedGameCount < 2
                 ? "partie"
                 : "parties";

    let exampleData = [
        "Nom du joueur", 
        "Score ({n} {text})"
            .replace("{text}", gameText)
            .replace("{n}", finishedGameCount),
        "Moyenne({n} {text})"
            .replace("{text}", gameText)
            .replace("{n}", finishedGameCount)
    ];

    for (let message of exampleData) {
        let div = document.createElement("div");
        div.innerHTML = message;
        result.appendChild(div).className = "recap-cell";
    }    

    result.className = "result";

    let container = document.getElementById("gameContainer");
    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(result);
    
    let display = document.getElementById("gameDisplay");
    display.innerHTML = "RESULTATS";

}