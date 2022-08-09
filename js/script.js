let attackPlayer;
let attackEnemy;
let livesPlayer;
let livesEnemy;
let mokepones = []
let mokeponesOptions = ''
let mokeponesAttacks = ''
let inputHipodoge
let inputCapipepo
let inputRatigueya
let attacksButtons
let historyAttacksPlayer = []
let historyAttacksEnemy = []
let selectedMokeponEnemy
let selectedMokeponPlayer

const messagesDiv = document.getElementById("result");
const cardsContainer = document.getElementById("cards-container");
const attackButtonsContainer = document.getElementById("attack-buttons-container");
const attackSection = document.getElementById("section-attack");
const petSection = document.getElementById("selection-pet");
const spanLivesPlayer = document.getElementById("lives-player");
const spanLivesEnemy = document.getElementById("lives-enemy");
const buttonRetry = document.getElementById("button-retry")

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
let capipepo = new Mokepon('Capipepo', './assets/capipepo.png', 4)
let ratigueya = new Mokepon('Ratigueya', './assets/ratigueya.png', 4)
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
mokepones.push(hipodoge, capipepo, ratigueya);



function selectPetPlayer(){
    if (inputHipodoge.checked) {
        spanPetPlayer.innerHTML = inputHipodoge.id
        hideAttackSection(false);
        hidePetSection(true);
    } else if (inputCapipepo.checked) {
        spanPetPlayer.innerHTML = inputCapipepo.id
        hideAttackSection(false);
        hidePetSection(true);
    } else if (inputRatigueya.checked) {
        spanPetPlayer.innerHTML = inputCapipepo.id
        hideAttackSection(false);
        hidePetSection(true);
    } else {
        alert("you didn't select any pet");
    }
    selectedMokeponPlayer = mokepones
        .find((mokepon)=>spanPetPlayer.innerHTML==mokepon.name)
    livesPlayer=selectedMokeponPlayer.lives;
    selectEnemyPet();
    generateAttackButtons();
}

function generateAttackButtons(){
    selectedMokeponPlayer?.attacks.forEach( (attack)=> {
        mokeponesAttacks += `
            <button 
                class="button attacks-buttons" 
                id="${attack.id}"
            >
                ${attack.name}
            </button>
        `
    })
    attackButtonsContainer.innerHTML = mokeponesAttacks
    attacksButtons = Array
        .from(document.querySelectorAll('.attacks-buttons'));
    mokeponesAttacks='';
    generateAttackActions()
}

function generateAttackActions(){
    attacksButtons.forEach((button)=>{
        button.addEventListener('click', attackingPlayer);
    })
}

function hideAttackSection(hide){
    attackSection.style.display = hide?"none":"flex"
    
}
function hideRetrySection(hide){
    buttonRetry.hidden = hide;
    
}
function hidePetSection(hide){
    petSection.style.display = hide?"none":"flex"
}

function selectEnemyPet(){
    
    let randomPet = random(0,mokepones.length-1);
    spanPetEnemy.innerHTML = mokepones[randomPet].name;
    selectedMokeponEnemy = mokepones[randomPet]
    livesEnemy = selectedMokeponEnemy.lives;
    spanLivesEnemy.innerHTML = livesEnemy;
    spanLivesPlayer.innerHTML = livesPlayer;

}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attackingPlayer(event){

    if (this.id == "button-fire") {
        attackPlayer = "FIRE";
    } else if (this.id == "button-water") {
        attackPlayer = "WATER";
    } else {
        attackPlayer = "EARTH";
    }
    this.style.background = '#112f58'
    historyAttacksPlayer.push(attackPlayer);
    attackEnemyRandom();
}

function attackingEnemy(attack){
    attackingEnemy = attack;
}

function attackEnemyRandom(){
    let randomAttack = selectedMokeponEnemy.attacks[random(0,selectedMokeponEnemy.attacks.length-1)];
    
    if (randomAttack.name=='🔥') {
        attackEnemy= "FIRE"
    } else if (randomAttack.name=='💧'){
        attackEnemy= "WATER"
    } else if (randomAttack.name=='🌱'){
        attackEnemy= "EARTH"
    }
    historyAttacksEnemy.push(attackEnemy)
    combat();
}

function combat(){

    if (historyAttacksPlayer.length > 4) {
        for (let i = 0; i  < historyAttacksPlayer.length; i++) {
            const playerAttack = historyAttacksPlayer[i];
            const enemyAttack = historyAttacksEnemy[i];
            if (enemyAttack==playerAttack) {
            } else if (enemyAttack=="WATER"){
                playerAttack=="EARTH"?livesEnemy--:livesPlayer--;
            } else if (enemyAttack=="EARTH"){
                playerAttack=="FIRE"?livesEnemy--:livesPlayer--;
            } else if (enemyAttack=="FIRE"){
                playerAttack=="WATER"?livesEnemy--:livesPlayer--;
            }
            createMessage(playerAttack, enemyAttack)
        }
        checkLives();
    }
}

function checkLives(){
    spanLivesEnemy.innerHTML = livesEnemy;
    spanLivesPlayer.innerHTML = livesPlayer;
    disabledAttackButtons(true);
    hideRetrySection(false);
    if(livesEnemy<livesPlayer){
        createMessageWinner("WIN")
    } else if (livesPlayer<livesEnemy){
        createMessageWinner("LOSE")
    } else if (livesPlayer==livesEnemy) {
        createMessageWinner("TIE")
    }
    historyAttacksPlayer = []
    historyAttacksEnemy = []
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
    attacksButtons.forEach(button => button.disabled=enable)

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

function createMessage(playerAttack, enemyAttack){
    let newPlayerAttack = document.createElement("p");
    let newEnemyAttack = document.createElement("p");
    newPlayerAttack.innerHTML = playerAttack
    newEnemyAttack.innerHTML = enemyAttack

    attacksPlayerDiv.appendChild(newPlayerAttack);
    attacksEnemyDiv.appendChild(newEnemyAttack);
}

function createMessageWinner(result){
    
    messagesDiv.innerHTML = `You ${result}!!`
}

function startGame(){
    
    
    buttonRetry.addEventListener("click", retryGame);
    hideRetrySection(true)
    hideAttackSection(true);
    mokepones.forEach( (mokepon)=> {
        mokeponesOptions += `
            <input type="radio" name="pet" id="${mokepon.name}">
            <label class="mokepon-card" for="${mokepon.name}">
                <p>${mokepon.name}</p>
                <img src="${mokepon.pic}" alt="${mokepon.name}">
            </label>
        `
        
        

    })
    cardsContainer.innerHTML = mokeponesOptions
    inputHipodoge = document.getElementById('Hipodoge');
    inputCapipepo = document.getElementById('Capipepo');
    inputRatigueya = document.getElementById('Ratigueya');

    

    
    buttonPet.addEventListener("click", selectPetPlayer);
}


window.addEventListener("load", startGame);