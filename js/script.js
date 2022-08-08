let attackPlayer;
let attackEnemy;
let livesPlayer = 3;
let livesEnemy = 3;
let mokepones = []

const messagesDiv = document.getElementById("result");
const attackSection = document.getElementById("section-attack");
const petSection = document.getElementById("selection-pet");
const spanLivesPlayer = document.getElementById("lives-player");
const spanLivesEnemy = document.getElementById("lives-enemy");
const buttonFire = document.getElementById("button-fire")
const buttonWater = document.getElementById("button-water")
const buttonEarth = document.getElementById("button-earth")
const buttonRetry = document.getElementById("button-retry")

const inputHipodoge = document.getElementById("hipodoge")
const inputCapipepo = document.getElementById("capipepo")
const inputRatigueya = document.getElementById("ratigueya")
const spanPetPlayer = document.getElementById("player-pet")
const spanPetEnemy = document.getElementById("enemy-pet")

const attacksPlayerDiv = document.getElementById("attacks-player");
const attacksEnemyDiv = document.getElementById("attacks-enemy");

const buttonPet = document.getElementById("button-pet");

class Mokepon {
    constructor(name, pic, lives){
        this.name = name;
        this.pic = pic;
        this.lives = lives;
        this.attacks = []
    }
}

let hipodoge = new Mokepon('Hipodoge', './assets/hipodoge.png', 4)
let capipepo = new Mokepon('Capipepo', './assets/capipepo.png', 3)
let ratigueya = new Mokepon('Ratigueya', './assets/ratigueya.png', 4)

mokepones.push(hipodoge, capipepo, ratigueya);

hipodoge.attacks.push(
    { name: '💧', id: 'button-water'},
    { name: '💧', id: 'button-water'},
    { name: '💧', id: 'button-water'},
    { name: '🔥', id: 'button-fire'},
    { name: '🌱', id: 'button-earth'},
)

capipepo.attacks.push(
    { name: '💧', id: 'button-water'},
    { name: '🔥', id: 'button-fire'},
    { name: '🌱', id: 'button-earth'},
    { name: '🌱', id: 'button-earth'},
    { name: '🌱', id: 'button-earth'},
)

ratigueya.attacks.push(
    { name: '💧', id: 'button-water'},
    { name: '🔥', id: 'button-fire'},
    { name: '🔥', id: 'button-fire'},
    { name: '🔥', id: 'button-fire'},
    { name: '🌱', id: 'button-earth'},
)



function selectPetPlayer(){
    if (inputHipodoge.checked) {
        spanPetPlayer.innerHTML = "Hipodoge";
        hideAttackSection(false);
        hidePetSection(true);
    } else if (inputCapipepo.checked) {
        spanPetPlayer.innerHTML = "Capipepo";
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
    attackSection.style.display = hide?"none":"flex"
    
}
function hideRetrySection(hide){
    buttonRetry.hidden = hide;
    
}
function hidePetSection(hide){
    petSection.style.display = hide?"none":"flex"
    console.log("hiding select pet")
}

function selectEnemyPet(){
    
    let randomPet = random(1,3);

    if (randomPet==1) {
        spanPetEnemy.innerHTML = "Hipodoge";
    } else if (randomPet==2){
        spanPetEnemy.innerHTML = "Capipepo";
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
    messagesDiv.innerHTML = "Good luck";
    attacksPlayerDiv.innerHTML = "";
    attacksEnemyDiv.innerHTML = "";
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
    
    

    let newPlayerAttack = document.createElement("p");
    let newEnemyAttack = document.createElement("p");
    let resultP = document.createElement("p");

    messagesDiv.innerHTML = result;
    newPlayerAttack.innerHTML = attackPlayer
    newEnemyAttack.innerHTML = attackEnemy

    attacksPlayerDiv.appendChild(newPlayerAttack);
    attacksEnemyDiv.appendChild(newEnemyAttack);
    restLives(result);
}

function createMessageWinner(result){
    
    messagesDiv.innerHTML = `You ${result}!!`
}

function startGame(){
    
    buttonFire.addEventListener("click", attackingPlayer);
    buttonWater.addEventListener("click", attackingPlayer);
    buttonEarth.addEventListener("click", attackingPlayer);
    buttonRetry.addEventListener("click", retryGame);

    
    hideRetrySection(true)
    hideAttackSection(true);

    

    
    buttonPet.addEventListener("click", selectPetPlayer);
}


window.addEventListener("load", startGame);