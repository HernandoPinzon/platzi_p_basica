const express = require("express")
const cors = require("cors")
const app = express()


app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const players = []
class Player{
    constructor(id){
        this.id=id
        this.attacks=[]
    }

    assignMokepon(mokepon){
        this.mokepon= mokepon
    }

    updatePosition(x,y){
        this.x=x
        this.y=y
    }

    assignAttacks(attacks){
        this.attacks=attacks
    }
}
class Mokepon{
    constructor(name){
        this.name=name
    }
}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get(
    "/join",
    (request, response) =>{
        const id= `${random(0,1000)}`
        const player = new Player(id)
        players.push(player)
        response.setHeader("Access-Control-Allow-Origin","*")
        response.send(id)
    }
)

app.post(
    "/mokepon/:playerId",
    (request,response)=>{
        const playerId = request.params.playerId || ""
        const name = request.body.mokepon || ""
        const mokepon = new Mokepon(name);
        const indexPlayer = players.findIndex(
            (player)=>playerId==player.id
        )
        
        if (indexPlayer>=0) {
            players[indexPlayer].assignMokepon(mokepon)
        }
        
        response.end()
    })

app.post(
    "/mokepon/:playerId/position",
    (request,response)=>{
        const playerId = request.params.playerId || ""
        const positionX = request.body.positionX || ""
        const positionY = request.body.positionY || ""
        const indexPlayer = players.findIndex(
            (player)=>playerId==player.id
        )
        
        if (indexPlayer>=0) {
            players[indexPlayer].updatePosition(positionX,positionY)
        }
        const othersPlayers = players.filter((player)=>player.id!=playerId)
        response.send({
            //same that "othersPlayers: othersPlayers"
            othersPlayers
        })
    })

app.post(
    "/mokepon/:playerId/attacks",
    (request,response)=>{
        const playerId = request.params.playerId || ""
        const attacks = request.body.attacks || []
        const indexPlayer = players.findIndex(
            (player)=>playerId==player.id
        )
        console.log(attacks)
        if (indexPlayer>=0) {
            players[indexPlayer].assignAttacks(attacks)
        }
        response.end()
    })

app.get(
    "/mokepon/:enemyId/attacks",
    (request,response)=>{
        const enemyId = request.params.enemyId || ""
        const enemy = players.find((player)=>enemyId==player.id)
        console.log(enemyId,enemy)
        response.send({
            attacks: enemy.attacks || []
        })
    })


app.listen(
    8080,
    ()=>{console.log("Serve Listening")}
)