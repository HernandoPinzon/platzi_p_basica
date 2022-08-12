let attackPlayer;
let attackEnemy;
let livesPlayer;
let livesEnemy;
let playerId;
let enemyId;
let mokepones = []
let mokeponesEnemyList = []
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
let interval
let backgroundMap = new Image()
backgroundMap.src = './assets/mokemap.png'
let selectPetPlayerCollide = false
const maxWidth = 350
const windowWidth = window.innerWidth - 20 > maxWidth ? maxWidth : window.innerWidth - 20;
const heightWanted = windowWidth * 600 / 800


const messagesDiv = document.getElementById("result");
const cardsContainer = document.getElementById("cards-container");
const attackButtonsContainer = document.getElementById("attack-buttons-container");
const attackSection = document.getElementById("section-attack");
const petSection = document.getElementById("selection-pet");
const spanLivesPlayer = document.getElementById("lives-player");
const spanLivesEnemy = document.getElementById("lives-enemy");
const buttonRetry = document.getElementById("button-retry");

const spanPetPlayer = document.getElementById("player-pet")
const spanPetEnemy = document.getElementById("enemy-pet")
const attacksPlayerDiv = document.getElementById("attacks-player");
const attacksEnemyDiv = document.getElementById("attacks-enemy");
const mapSection = document.getElementById("show-map");
const map = document.getElementById("map");
const canvas = map.getContext("2d");
const buttonPet = document.getElementById("button-pet");

const HIPODOGE_ATTACKS = [
    { name: '💧', id: 'button-water' },
    { name: '💧', id: 'button-water' },
    { name: '💧', id: 'button-water' },
    { name: '🔥', id: 'button-fire' },
    { name: '🌱', id: 'button-earth' }
]
const CAPIPEPO_ATTACKS = [
    { name: '💧', id: 'button-water' },
    { name: '🔥', id: 'button-fire' },
    { name: '🌱', id: 'button-earth' },
    { name: '🌱', id: 'button-earth' },
    { name: '🌱', id: 'button-earth' },
]
const RATIGUEYA_ATTACKS = [
    { name: '💧', id: 'button-water' },
    { name: '🔥', id: 'button-fire' },
    { name: '🔥', id: 'button-fire' },
    { name: '🔥', id: 'button-fire' },
    { name: '🌱', id: 'button-earth' },
]

class Mokepon {
    constructor(name, pic, lives, picHead, playerId = null) {
        this.playerId = playerId
        this.name = name;
        this.pic = pic;
        this.lives = lives;
        this.attacks = []
        this.width = 40
        this.height = 40
        this.x = random(40, windowWidth - this.width)
        this.y = random(40, heightWanted - this.height)
        this.canvasImage = new Image();
        this.canvasImage.src = picHead;
        this.velocityX = 0;
        this.velocityY = 0;
        this.dead = false;
    }
    drawInCanvas(canvas) {
        if (!this.dead) {
            canvas.drawImage(
                this.canvasImage,
                this.x,
                this.y,
                this.width,
                this.height
            )
        }
    }
    inCollision(box) {
        if (box.dead) {

            return false
        }
        let myTop = this.y
        let myButton = this.y + this.height
        let myLeft = this.x
        let myRight = this.x + this.width
        let boxTop = box.y
        let boxButton = box.y + box.height
        let boxLeft = box.x
        let boxRight = box.x + box.width

        if (
            myButton < boxTop || myTop > boxButton || myRight < boxLeft || myLeft > boxRight
        ) {
            return false
        }
        return true
    }
}

let hipodoge = new Mokepon(
    'Hipodoge',
    './assets/hipodoge.png',
    3,
    './assets/hipodogehead.png'
)
let capipepo = new Mokepon(
    'Capipepo',
    './assets/capipepo.png',
    3,
    './assets/capipepohead.png'
)
let ratigueya = new Mokepon(
    'Ratigueya',
    './assets/ratigueya.png',
    3,
    './assets/ratigueyahead.png'
)

hipodoge.attacks.push(...HIPODOGE_ATTACKS)
capipepo.attacks.push(...CAPIPEPO_ATTACKS)
ratigueya.attacks.push(...RATIGUEYA_ATTACKS)
mokepones.push(hipodoge, capipepo, ratigueya);

function selectPetPlayer() {
    if (inputHipodoge.checked || inputCapipepo.checked || inputRatigueya.checked) {
        if (inputHipodoge.checked) {
            spanPetPlayer.innerHTML = inputHipodoge.id
        } else if (inputCapipepo.checked) {
            spanPetPlayer.innerHTML = inputCapipepo.id
        } else if (inputRatigueya.checked) {
            spanPetPlayer.innerHTML = inputRatigueya.id
        }
        hideMapSection(false);
        //hideAttackSection(false);
        hidePetSection(true);
        selectedMokeponPlayer = mokepones
            .find((mokepon) => spanPetPlayer.innerHTML == mokepon.name)
        livesPlayer = selectedMokeponPlayer?.lives;
        postSelectedPet()
        spanLivesPlayer.innerHTML = '💝'.repeat(livesPlayer);
        startMap()
        generateAttackButtons();
    } else {
        alert("you didn't select any pet");
    }

}

function postSelectedPet() {
    fetch(
        `http://192.168.1.3:8080/mokepon/${playerId}`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    mokepon: selectedMokeponPlayer.name
                }
            )
        }
    )
}
function postPositionPet(x, y) {
    fetch(
        `http://192.168.1.3:8080/mokepon/${playerId}/position`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    positionX: x,
                    positionY: y
                }
            )
        }
    ).then(function (response) {
        if (response.ok) {
            //to obtain the variable inside the response "response.othersPlayers"
            response.json().then(function ({ othersPlayers }) {
                mokeponesEnemyList.length = 0
                othersPlayers.forEach(function (enemy) {
                    if (enemy.mokepon != undefined) {
                        const mokeponName = enemy.mokepon.name || ""
                        let mokeponEnemy
                        if (mokeponName == "Hipodoge") {
                            mokeponEnemy = new Mokepon(
                                'Hipodoge',
                                './assets/hipodoge.png',
                                3,
                                './assets/hipodogehead.png',
                                enemy.id
                            )

                        } else if (mokeponName == "Capipepo") {
                            mokeponEnemy = new Mokepon(
                                'Capipepo',
                                './assets/capipepo.png',
                                3,
                                './assets/capipepohead.png',
                                enemy.id
                            )
                        } else if (mokeponName == "Ratigueya") {
                            mokeponEnemy = new Mokepon(
                                'Ratigueya',
                                './assets/ratigueya.png',
                                3,
                                './assets/ratigueyahead.png',
                                enemy.id
                            )
                        }

                        mokeponEnemy.x = enemy.x
                        mokeponEnemy.y = enemy.y
                        mokeponesEnemyList.push(mokeponEnemy)
                    }
                })
            })
        }
    })
}

function startMap() {
    map.width = windowWidth
    map.height = heightWanted
    selectedMokeponPlayer.x = 10
    selectedMokeponPlayer.y = 10
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyUp)
    drawCanvas();
    interval = setInterval(drawCanvas, 50)
}
function drawCanvas() {
    selectedMokeponPlayer.x += selectedMokeponPlayer.velocityX
    selectedMokeponPlayer.y += selectedMokeponPlayer.velocityY
    canvas.clearRect(0, 0, map.width, map.height);
    canvas.drawImage(
        backgroundMap,
        0,
        0,
        map.width,
        map.height
    )

    postPositionPet(selectedMokeponPlayer.x, selectedMokeponPlayer.y)
    mokeponesEnemyList.forEach(function (mokepon) {
        mokepon.drawInCanvas(canvas)
    })
    selectedMokeponPlayer.drawInCanvas(canvas)
    if (
        (mokeponesEnemyList.some(
            (enemyMokepon)=>selectedMokeponPlayer.inCollision(enemyMokepon)
            )) &&
        selectPetPlayerCollide === false
    ) {

        selectedMokeponEnemy = mokeponesEnemyList.find(
            (enemyMokepon)=>selectedMokeponPlayer.inCollision(enemyMokepon)
        )
        enemyId=selectedMokeponEnemy.playerId
        livesEnemy = selectedMokeponEnemy.lives;
        spanPetEnemy.innerHTML = selectedMokeponEnemy.name;
        spanLivesEnemy.innerHTML = '💝'.repeat(livesEnemy);
        selectPetPlayerCollide = true
        console.log("collide", selectPetPlayerCollide)
        selectedMokeponPlayer.velocityX = 0
        selectedMokeponPlayer.velocityY = 0
        clearInterval(interval)
        hideMapSection(true);
        hideAttackSection(false);
    } else if (
        (!mokeponesEnemyList.some(
            (enemyMokepon)=>selectedMokeponPlayer.inCollision(enemyMokepon)
            )) &&
        selectPetPlayerCollide === true

    ) {
        console.log("notCollide", selectPetPlayerCollide)
        selectPetPlayerCollide = false
    }

}

function movePetLeft() {
    selectedMokeponPlayer.velocityX = -5
}
function movePetRight() {
    selectedMokeponPlayer.velocityX = 5
}
function movePetUp() {
    selectedMokeponPlayer.velocityY = -5
}
function movePetDown() {
    selectedMokeponPlayer.velocityY = 5
}
function stopMoveLeft() {
    selectedMokeponPlayer.velocityX = 0
}
function stopMoveRight() {
    selectedMokeponPlayer.velocityX = 0
}
function stopMoveUp() {
    selectedMokeponPlayer.velocityY = 0
}
function stopMoveDown() {
    selectedMokeponPlayer.velocityY = 0
}
function generateAttackButtons() {
    selectedMokeponPlayer?.attacks.forEach((attack) => {
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
    mokeponesAttacks = '';
    generateAttackActions()
}
function generateAttackActions() {
    attacksButtons.forEach((button) => {
        button.addEventListener('click', attackingPlayer);
    })
}
function hideAttackSection(hide) {
    attackSection.style.display = hide ? "none" : "flex"

}
function hideRetrySection(hide) {
    buttonRetry.hidden = hide;

}
function hidePetSection(hide) {
    petSection.style.display = hide ? "none" : "flex"
}
function hideMapSection(hide) {
    mapSection.style.display = hide ? "none" : "flex"
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function attackingPlayer(event) {

    if (this.id == "button-fire") {
        attackPlayer = "FIRE";
    } else if (this.id == "button-water") {
        attackPlayer = "WATER";
    } else {
        attackPlayer = "EARTH";
    }
    this.style.background = '#112f58'
    this.disabled = true
    historyAttacksPlayer.push(attackPlayer);
    if (historyAttacksPlayer.length==5) {
        pushAttacks()
        intervalGetAttacks = setInterval(getAttacksFromBackend,100)
    }
    
}

function getAttacksFromBackend(){
    fetch(`http://192.168.1.3:8080/mokepon/${enemyId}/attacks`)
    .then((response)=>{
        if (response.ok) {
            response.json().then(function({attacks}){
                if (attacks.length==5) {
                    console.log(attacks)
                    historyAttacksEnemy=attacks
                    combat()
                }
            })
        }
    })
}

function pushAttacks(){
    fetch(
        `http://192.168.1.3:8080/mokepon/${playerId}/attacks`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    attacks: historyAttacksPlayer
                }
            )
        }
    )
}

function attackingEnemy(attack) {
    attackingEnemy = attack;
}

function attackEnemyRandom() {
    let randomAttack = selectedMokeponEnemy.attacks[random(0, selectedMokeponEnemy.attacks.length - 1)];

    if (randomAttack.name == '🔥') {
        attackEnemy = "FIRE"
    } else if (randomAttack.name == '💧') {
        attackEnemy = "WATER"
    } else if (randomAttack.name == '🌱') {
        attackEnemy = "EARTH"
    }
    historyAttacksEnemy.push(attackEnemy)
    combat();
}

function combat() {
    clearInterval(intervalGetAttacks)
    if (historyAttacksPlayer.length > 4) {
        for (let i = 0; i < historyAttacksPlayer.length; i++) {
            const playerAttack = historyAttacksPlayer[i];
            const enemyAttack = historyAttacksEnemy[i];
            if (enemyAttack == playerAttack) {
            } else if (enemyAttack == "WATER") {
                playerAttack == "EARTH" ? livesEnemy-- : livesPlayer--;
            } else if (enemyAttack == "EARTH") {
                playerAttack == "FIRE" ? livesEnemy-- : livesPlayer--;
            } else if (enemyAttack == "FIRE") {
                playerAttack == "WATER" ? livesEnemy-- : livesPlayer--;
            }
            createMessage(playerAttack, enemyAttack)
        }
        checkLives();
    }
}

function checkLives() {
    spanLivesEnemy.innerHTML = '💝'.repeat(livesEnemy < 0 ? 0 : livesEnemy) + " ";
    spanLivesPlayer.innerHTML = '💝'.repeat(livesPlayer < 0 ? 0 : livesPlayer) + " ";
    disabledAttackButtons(true);
    hideRetrySection(false);
    if (livesEnemy < livesPlayer) {
        selectedMokeponEnemy.dead = true;
        createMessageWinner("WIN")
    } else if (livesPlayer < livesEnemy) {
        selectedMokeponPlayer.x = 10
        selectedMokeponPlayer.y = 10
        createMessageWinner("LOSE")
    } else if (livesPlayer == livesEnemy) {
        selectedMokeponPlayer.x = 10
        selectedMokeponPlayer.y = 10
        createMessageWinner("TIE")
    }
    historyAttacksPlayer = []
    historyAttacksEnemy = []
}

function retryGame() {
    messagesDiv.innerHTML = "Good luck";
    attacksPlayerDiv.innerHTML = "";
    attacksEnemyDiv.innerHTML = "";
    disabledAttackButtons(false);
    hidePetSection(false);
    hideAttackSection(true);
    hideRetrySection(true);
}

function disabledAttackButtons(enable) {
    attacksButtons.forEach(button => button.disabled = enable)

}

function createMessage(playerAttack, enemyAttack) {
    let newPlayerAttack = document.createElement("p");
    let newEnemyAttack = document.createElement("p");
    newPlayerAttack.innerHTML = playerAttack
    newEnemyAttack.innerHTML = enemyAttack

    attacksPlayerDiv.appendChild(newPlayerAttack);
    attacksEnemyDiv.appendChild(newEnemyAttack);
}

function createMessageWinner(result) {

    messagesDiv.innerHTML = `You ${result}!!`
}

function startGame() {


    buttonRetry.addEventListener("click", retryGame);
    hideRetrySection(true)
    hideAttackSection(true);
    hideMapSection(true);
    mokepones.forEach((mokepon) => {
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
    joinGame();
}

function joinGame() {
    fetch("http://192.168.1.3:8080/join")
        .then(function (response) {

            if (response.ok) {
                response.text().then(function (response) {
                    playerId = response
                })
            }
        })
}

function keyPress(event) {
    switch (event.key) {
        case "ArrowUp":
            movePetUp()
            break;
        case "ArrowDown":
            movePetDown()
            break;
        case "ArrowLeft":
            movePetLeft()
            break;
        case "ArrowRight":
            movePetRight()
            break;
    }
}
function keyUp(event) {
    switch (event.key) {
        case "ArrowUp":
            stopMoveUp()
            break;
        case "ArrowDown":
            stopMoveDown()
            break;
        case "ArrowLeft":
            stopMoveLeft()
            break;
        case "ArrowRight":
            stopMoveRight()
            break;
    }
}

window.addEventListener("load", startGame);
