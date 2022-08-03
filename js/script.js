let attackPlayer;
let attackEnemy;

function selectPetPlayer(){
    let inputHipodoge = document.getElementById("hipodoge")
    let inputCapopepo = document.getElementById("capopepo")
    let inputRatigueya = document.getElementById("ratigueya")
    let spanPetPlayer = document.getElementById("player-pet")

    if (inputHipodoge.checked) {
        spanPetPlayer.innerHTML = "Hipodoge";
    } else if (inputCapopepo.checked) {
        spanPetPlayer.innerHTML = "Capopepo";
    } else if (inputRatigueya.checked) {
        spanPetPlayer.innerHTML = "Ratigueya";
    } else {
        alert("you didn't select any pet");
    }

    selectEnemyPet();
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
    console.log(this.id);
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

    createMessage();
}

function createMessage(){
    let messagesSection = document.getElementById("messages");
    let paragraph = document.createElement("p");
    paragraph.innerHTML = `Your pet attack with ${attackPlayer}
    The enemy pet attack with ${attackEnemy}
    - PENDING`
    messagesSection.appendChild(paragraph);
}

function startGame(){
    let buttonFire = document.getElementById("button-fire")
    let buttonWater = document.getElementById("button-water")
    let buttonEarth = document.getElementById("button-earth")
    buttonFire.addEventListener("click", attackingPlayer);
    buttonWater.addEventListener("click", attackingPlayer);
    buttonEarth.addEventListener("click", attackingPlayer);
    

    let buttonPet = document.getElementById("button-pet");
    buttonPet.addEventListener("click", selectPetPlayer);
}


window.addEventListener("load", startGame);