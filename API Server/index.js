/**
 * Main Page
 */

var express = require("express");
var graphqlHTTP = require("express-graphql");
var cors = require('cors')
var app = express();
var { schema, root } = require("./graphql")

/**
 * Enable Cors
 */
app.use(cors({
    origin: '*', // change for Production
    allowedHeaders: ["Content-Type"]
}))

/**
 * Health test for ELB
 */
app.get('/teststatus', (req, res) => {
    res.send()
})

/**
 * Graphql handler
 */
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

/**
 * Error Handling
 */
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send()
})

/**
 * Start Server
 */
app.listen(8080, () => {
    console.log("Server Started..!")
})