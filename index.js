const express = require("express")
const cors = require("cors")
const { request } = require("http")
const { response } = require("express")

const app = express()
app.use(cors())
app.use(express.json())

const players = []
class Player{
    constructor(id){
        this.id=id
    }

    assignMokepon(mokepon){
        this.mokepon= mokepon
    }

    updatePosition(x,y){
        this.x=x
        this.y=y
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
        console.log(playerId)
        if (indexPlayer>=0) {
            players[indexPlayer].assignMokepon(mokepon)
        }
        console.log(players)
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
        console.clear()
        console.log(players[indexPlayer])
        response.end()
    })


app.listen(
    8080,
    ()=>{console.log("Serve Listening")}
)