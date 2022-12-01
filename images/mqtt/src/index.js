const mqtt = require("mqtt")
const connection = require('./database/connection.js')

//defining client name and moquito broker adress
const clientId = "MQTT_API"
const connectUrl = process.env.MQTT_ADDR


/**
 * object template
 * 
 * roomdata{
 *      roomName(str),
 *      roomSensor(str),
 *      temperatureData(arr(int))
 * }
 * 
 *
 */


//connect to mosquito broker
const client = mqtt.connect(connectUrl, {
    clientId: clientId,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    debug: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000
})

//subscribe to defined topics
client.subscribe('arduino/getSensorData')
client.subscribe('arduino/getRoom')


/**
 * check if there are new message on subscribed topics
 * 
 * @params objects - topic(str),
 *                 - payload(roomData() || room(str))
 */
client.on('message', async (topic, payload) => {
    connection.connect();

    /**
     * insert payload data inside sensorData table
     *
     * @params object roomData
     */
    if (topic === 'arduino/getSensorData') {
        try {
            let roomData = JSON.parse(payload.toString())
            console.log(data)
            connection.query(`INSERT INTO sensorData (room, sensorDevice,Value) VALUES (?,?,?)`, [data.room, data.deviceName, data.sensorValue])
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * check if room already exist in rooms table,
     * if not insert the room inside rooms table
     *
     * @params object room(str)
     */
    if (topic === 'arduino/getRoom') {
        let data = JSON.parse(payload.toString())
        console.log(data);
        try {
            connection.query(`SELECT * FROM rooms WHERE roomName LIKE ${data.room}`,
                function (error, result, fields) {
                    console.log(result);
                    try {
                        if (!result.length) {
                            connection.execute(`INSERT INTO rooms (roomName) VALUES (?)`, [data.room])
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })

        } catch (error) {
            console.log(error);
        }

    }



})