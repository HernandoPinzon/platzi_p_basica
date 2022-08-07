let attackPlayer;
let attackEnemy;
let livesPlayer = 3;
let livesEnemy = 3;

let spanLivesPlayer
let spanLivesEnemy
let messagesSection
let buttonFire
let buttonWater
let buttonEarth
let buttonRetry
let attackSection
let petSection

function selectPetPlayer(){
    let inputHipodoge = document.getElementById("hipodoge")
    let inputCapopepo = document.getElementById("capopepo")
    let inputRatigueya = document.getElementById("ratigueya")
    let spanPetPlayer = document.getElementById("player-pet")

    if (inputHipodoge.checked) {
        spanPetPlayer.innerHTML = "Hipodoge";
        hideAttackSection(false);
        hidePetSection(true);
    } else if (inputCapopepo.checked) {
        spanPetPlayer.innerHTML = "Capopepo";
        hideAttackSection(false);
        hidePetSection(true);
    } else if (inputRatigueya.checked) {
        spanPetPlayer.innerHTML = "Ratigueya";
        hideAttackSection(false);
        hidePetSection(true);
    } else {
        alert("you didn't select any pet");
    }
    selectEnemyPet();
}

function hideAttackSection(hide){
    attackSection.hidden = hide;
}
function hideRetrySection(hide){
    buttonRetry.hidden = hide;
}
function hidePetSection(hide){
    petSection.hidden = hide;
}

function selectEnemyPet(){
    let spanPetEnemy = document.getElementById("enemy-pet")
    let randomPet = random(1,3);

    if (randomPet==1) {
        spanPetEnemy.innerHTML = "Hipodoge";
    } else if (randomPet==2){
        spanPetEnemy.innerHTML = "Capopepo";
    } else if (randomPet==3){
        spanPetEnemy.innerHTML = "Ratigueya";
    }
}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attackingPlayer(){

    if (this.id == "button-fire") {
        attackPlayer = "FIRE";
    } else if (this.id == "button-water") {
        attackPlayer = "WATER";
    } else {
        attackPlayer = "EARTH";
    }
    
    attackEnemyRandom();
}

function attackingEnemy(attack){
    attackingEnemy = attack;
}

function attackEnemyRandom(){
    let randomAttack = random(1,3);

    if (randomAttack==1) {
        attackEnemy= "FIRE"
    } else if (randomAttack==2){
        attackEnemy= "WATER"
    } else if (randomAttack==3){
        attackEnemy= "EARTH"
    }
    combat();
}


function combat(){
    if (attackEnemy==attackPlayer) {
        createMessage("TIE")
    } else if (attackEnemy=="WATER"){
        attackPlayer=="EARTH"?createMessage("WIN"):createMessage("LOSE");
    } else if (attackEnemy=="EARTH"){
        attackPlayer=="FIRE"?createMessage("WIN"):createMessage("LOSE");
    } else if (attackEnemy=="FIRE"){
        attackPlayer=="WATER"?createMessage("WIN"):createMessage("LOSE");
    }
}

function checkLives(){
    if(livesEnemy==0){
        disabledAttackButtons(true);
        hideRetrySection(false);
        createMessageWinner("WIN")
    } else if (livesPlayer==0){
        disabledAttackButtons(true);
        hideRetrySection(false);
        createMessageWinner("LOSE")
    }
}

function rebootLives(){
    livesEnemy=3;
    livesPlayer=3;
    spanLivesEnemy.innerHTML = livesEnemy;
    spanLivesPlayer.innerHTML = livesPlayer;
}

function retryGame(){
    rebootLives();
    messagesSection.innerHTML = "";
    disabledAttackButtons(false);
    hidePetSection(false);
    hideAttackSection(true);
    hideRetrySection(true);
}

function disabledAttackButtons(enable){
    buttonFire.disabled = enable;
    buttonEarth.disabled = enable;
    buttonWater.disabled = enable;

}

function restLives(result){
    if (result=="WIN") {
        livesEnemy--;
        spanLivesEnemy.innerHTML = livesEnemy;
    } else if(result=="LOSE") {
        livesPlayer--;
        spanLivesPlayer.innerHTML = livesPlayer;
    }
    checkLives();
}

function createMessage(result){
    let paragraph = document.createElement("p");
    paragraph.innerHTML = `Your pet attack with ${attackPlayer}
    The enemy pet attack with ${attackEnemy}
    - ${result}`
    messagesSection.appendChild(paragraph);
    restLives(result);
}

function createMessageWinner(result){
    let paragraph = document.createElement("p");
    paragraph.innerHTML = `You ${result}!!`
    messagesSection.appendChild(paragraph);
}

function startGame(){
    spanLivesPlayer = document.getElementById("lives-player");
    spanLivesEnemy = document.getElementById("lives-enemy");
    messagesSection = document.getElementById("messages");
    buttonFire = document.getElementById("button-fire")
    buttonWater = document.getElementById("button-water")
    buttonEarth = document.getElementById("button-earth")
    buttonRetry = document.getElementById("button-retry")
    buttonFire.addEventListener("click", attackingPlayer);
    buttonWater.addEventListener("click", attackingPlayer);
    buttonEarth.addEventListener("click", attackingPlayer);
    buttonRetry.addEventListener("click", retryGame);

    attackSection = document.getElementById("selection-attack");
    petSection = document.getElementById("selection-pet");
    hideRetrySection(true)
    hideAttackSection(true);

    

    let buttonPet = document.getElementById("button-pet");
    buttonPet.addEventListener("click", selectPetPlayer);
}


window.addEventListener("load", startGame);