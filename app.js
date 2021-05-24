// load app using express

const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const createError = require('http-errors')

require('dotenv').config()

const PORT = process.env.PORT || 6119

const bodyParser = require('body-parser')

const data = require('./sample.json')

// home page
app.get("/", (req, res) => {
    const lineItems = data.map((row) => {
        var li = []
        for (var i in row.line_items) {
            // console.log(row.line_items[i].name)
            li.push(row.line_items[i].name)
        }
        return li

    })

    const set = data.map((row) => {
        return [
            {currency: row.currency},
            {total: row.total},
            {taiwanID: row.TaiwanID},
            {firstName: row.billing.first_name},
            {lastName: row.billing.last_name},
            {email: row.billing.email},
            {product: lineItems}
        ]
    })
    res.send(set)

})

app.use(express.urlencoded({extended: false}))

app.use(morgan('short'))

app.use(express.static('./public'))

// db connection credentials
function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rcvR130#",
        database: "express2"
    })
}

// post data to database
app.post('/f6d2c78b-bf03-4f42-86db-fe9816534a2f', (req, res) => {
    console.log("Inserting new line")

    //products bought
    const lineItems = data.map((row) => {
        var li = []
        for (var i in row.line_items) {
            // console.log(row.line_items[i].name)
            li.push(row.line_items[i].name)
        }
        return li

    })

    //create list of data
    const inputData = data.map((row) => {
        return [
            row.billing.first_name,
            row.billing.last_name,
            row.TaiwanID,
            lineItems,
            row.billing.email,
            row.currency,
            row.total,

        ]
    })

    console.log(inputData[0][3][0].toString())

    const queryString = "INSERT INTO users (first_name, last_name, taiwan_id, product, email, currency, total) VALUES (?, ?, ?, ?, ?, ?, ?)"

    getConnection().query(queryString, [inputData[0][0], inputData[0][1], inputData[0][2], inputData[0][3][0].toString(), inputData[0][4], inputData[0][5], inputData[0][6]], (err, results, fields) => {
        if(err){
            console.log("Failed to insert new order: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfully inserted order: " + results.insertId);
        res.end()
    })

})
// error handling
app.use(async(req, res, next) => {
    // const error = new Error("Not Found")
    // error.status = 400
    // next(error)
    next(createError.NotFound("You are using an incorrect route."))
})

app.use(async(err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error:  {
            status: err.status || 500,
            message: err.message
        },
    })
})

app.get("/users/:id", (req, res) => {
    console.log("Fetching user by ID: " + req.params.id)
    

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rcvR130#",
        database: "express2"
    })

    const userID = req.params.id
    const queryString = "SELECT * FROM users WHERE id = ?"

    connection.query(queryString, [userID], (err, rows, fields) => {
        if(err){
            console.log("Query string error " + err)
            res.sendStatus(500)
            // throw err
            return
        }

        console.log("I believe users have been fetched successfully")

        const users = rows.map((row) => {
            return [{firstName: row.first_name}, {TaiwanID: row.taiwan_id}, {Date: row.date}]

        })
        res.json(users)
    })
    // res.end()
})

app.get("/users", (req, res) => {
    console.log(req)
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rcvR130#",
        database: "express2"
    })
    const queryString = "SELECT * FROM users"

    connection.query(queryString, (err, rows, fields) => {
        if(err){
            console.log("Failed to query for all users " + err)
            res.sendStatus(500)
            // throw err
            return
        }

        res.json(rows)
    })
})

// localhost:6119
app.listen(PORT, () => {
    console.log("server is listening on ${PORT}")

})

