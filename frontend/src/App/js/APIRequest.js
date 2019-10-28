/**
 * Make API Request
 */
var { apiPath } = require("../resources")

export default function APIRequest(query, variables) {
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    return fetch(apiPath, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            query,
            variables
        })
    })
}
