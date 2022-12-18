import filterByDate from "../filtering/filterByDate"
import getAverageNumber from "../math/getAverageNumber"
import getGraph from "../math/getGraph"
let url = "http://localhost:3001"

/**
 * object template
 * 
 * sensorData {
 *          value(int),
 *          date(str) 
 * }
 *
 *
 * filteredData {
 *      curren(int),
 *      hour(arr(sensorData)),
 *      day(arr(sensorData)),
 *      week(arr(sensorData)),
 *      month(arr(sensorData)) 
 * }
 *
 */

/**
 * Do a fetch call to rest api to receive data about roomName.
 * Filter data by current,hour,week and month,
 * 
 * 
 * @see filterByDate
 * 
 * @param  roomName(str) 
 * @returns filteredData
 * 
 */
const getRoomData = (roomName) => {
    // get room data from roomName
    return fetch(`${url}/getRoomData`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName
            })
        })
        .then(response => response.json())
        .then(data => {
            // filter data by current,hour,day,week,month
            let filterdData = filterByDate(data.temperatureData)

            return filterdData

        })
}

export default getRoomData