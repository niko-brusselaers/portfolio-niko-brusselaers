const express = require("express")
const bodyParser = require('body-parser')
const connection = require('./database/connection.js')

const {
    request,
    response
} = require("express")

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(express.static("../docs"))


app.listen(3000, (err) => {
    if (!err) {
        console.log("http://localhost");
    } else {
        console.log(err);
    }
})

/**
 * object template
 * 
 * roomdata{
 *      id(int)
 *      roomName(str),
 *      roomSensor(str),
 *      temperatureData(arr(int))
 * }
 * 
 *
 */



/**
 * GET endpoint, check if API is online
 * 
 * @returns html page with list of endpoints
 */
app.get("/", (request, response) => {
    response.redirect("index.html")
})


/**
 * GET endpoint, return object room
 * 
 * @params object roomName(str)
 * @returns object with result object room
 */
app.get("/getRoomData", async (request, response) => {



})

/**
 * GET endpoint, return the list of rooms
 * 
 * @returns object with result object roomNames(arr(str))
 */
app.get("/getAllRooms", async (request, response) => {

    try {
        // retrieving all room names from rooms table and sending data back via response
        connection.query(`SELECT * FROM rooms `,
            function (error, results, fields) {
                let roomNames = []
                for (let i = 0; i < results.length; i++) {
                    roomNames.push(results[i].roomName)
                }
                response.status(200).send({
                    roomNames: roomNames
                })
            })
    } catch (error) {
        //displaying error in terminal and sending it back via response
        console.log(error);
        response.status(500).send({
            error: error
        })
    }

})

/**
 * POST endpoint, insert sensor data into database
 * 
 * @params object roomData, containing roomSensor(str) and temperatureData(arr(int))
 * @returns object with result of statuscode(str)
 */
app.post("/receiveRoomData", (request, response) => {

    //TODO: retrieve room noise level data from sensor and insert inside database


})

/**
 * POST endpoint, insert new room into database
 * 
 * @params object room, containing roomName(str) and roomSensor(str)
 * @returns object with result of inserted room
 */
app.post("/addRoom", (request, response) => {

    //TODO: insert room inside database

})

/**
 * PUT endpoint, update existing room inside database
 * 
 * @params object room, containing id(int), roomName(str) and newRoomSensor(str)
 * @returns object with result of updated room
 */
app.put("/updateRoomSensor", (request, response) => {

    //TODO: update room sensor from certain room inside database

})



/** 
 * DELETE endpoint, delete room out database
 * 
 * @params object room, containing id(int) and roomName(str) 
 * @returns object with result(str) and statuscode(int)
 */
app.delete("/deleteRoom", (request, response) => {
    let roomName = request.body.roomName
    //TODO: delete room and room data from database
    try {
        // retrieving room to check if it exists
        connection.query(`SELECT * FROM rooms WHERE (roomName) like (?)`, [roomName],
            function (error, results, fields) {
                if (!results.length) {
                    //if the room is not inside database send error response back
                    response.status(400).send({
                        error: "room doesnt exist"
                    })
                } else {
                    // remove all data from room in rooms and sensorData tables
                    connection.execute(`DELETE FROM rooms WHERE (roomName) like (?) `, [roomName])
                    connection.execute(`DELETE FROM sensorData WHERE (room) like (?) `, [roomName])
                    response.status(200).send({
                        result: "ok"
                    })
                }
            })
    } catch (error) {
        //displaying error in terminal and sending it back via response
        console.log(error);
        response.status(500).send({
            error: error
        })
    }


})