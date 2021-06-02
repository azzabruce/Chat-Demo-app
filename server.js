var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('dgram')
var app = express()
//add http require and use the http from node and we will call the server on the require itself and pass the app
var http = require('http').Server(app)
//create io and set it require socket io and will pass in reference to http
var io = require('socket.io')(http)
//require mongoose and connect to our remote database
var mongoose = require('mongoose')
const { Console } = require('console')

app.use(express.static(__dirname))
//this let bodyParser know that we expect json to be coming in with http request
app.use(bodyParser.json())
//at this point when we click send, we recieve an embty object, because the broweser is urlencoded
//so we must setup a bodyParser to support that
app.use(bodyParser.urlencoded({ extended: false }))
//use the built in es6 Promise library, instead of mongoose promises
mongoose.Promise = Promise
//creat a dbUrl
var dbUrl = "mongodb+srv://user:user@cluster0.kj3lc.mongodb.net/test"
// we want to create a messages Model 

var Message = mongoose.model('Message', {
    //schema definition
    name: String,
    message: String
})
//at this point, we have to refresh the page to see new messages
//we would need to install socket.ip 
//needs to tie in with express we will create a regular http server with node and share with express and node
//let's create a placeholder messages list as an array
//we don't need our message array becuase data is coming from mongodb
// var messages = [
//     { name: 'Azza', message: 'Hello' },
//     { name: 'Tim', message: 'Hi' }
// ]
// 1. creating a get messages end service in node, this allows messages to be called from the backend and displayed in the front-end 
// 2. we need to add a route for endpoint, we will be using app.get to sepcifiy that we will be using a get request
app.get('/messages', (req, res) => {//the route is '/messages. then a callback to handle the request take in response and give is refernce to res to response to it
    //instead of sending our message array, we will send messages from mongoDB
    //to get all the messages in the database (mongodb), we use {} empty brackets
    Message.find({}, (err, messages) => {
        res.send(messages) // next step is to update the front-end to call the messages from backend
    })

})
//add a user parameter
app.get('/messages/:user', (req, res) => {//the route is '/messages. then a callback to handle the request take in response and give is refernce to res to response to it
    //instead of sending our message array, we will send messages from mongoDB
    //to get all the messages in the database (mongodb), we use {} empty brackets
    //get access to user paramater and set it to req.param.user
    var user = req.params.user
    Message.find({ name: user }, (err, messages) => {
        res.send(messages) // next step is to update the front-end to call the messages from backend
    })

})
//let's create a new message post endpoint in node
app.post('/messages', async (req, res) => {
    //now we can use a more generic form of handling erros and exceptions with try/catch block
    try {
        // create an object based on Message model and pass req.boy because it contains our message definition

        var messsage = new Message(req.body)
        //let's save it to mongoDB
        //now we can use promises 
        var savedMessage = await messsage.save()

        var censored = await Message.findOne({ message: 'badword' })//since we are returning a proimse instead of handling it with a call back
        //the next then() will take the result of first promise in a call back 

        //stack these chain function

        if (censored)
            await Message.remove({ _id: censored.id })
        // this will return undefined since express doesn't have a built in support to parse the body, we need to install body-parser
        // console.log(req.body)
        // messages.push(req.body)//add he new message to our message array from postman
        //let's emit an event from the server to all clients notifying them, there is a new message
        else
            io.emit('message', req.body)//message is the event and req.body will contain the message
        res.sendStatus(200)
    } catch (error) {
        //if there is an error, send a server erro 500
        res.sendStatus(500)
        return console.error(error)
    } finally {
        //if we had a looger
        console.log('message post called')
    }


})

//let's find and remove any bad words written in the chat demo app

//let's set up a callback for the scoket coneection event, that will let us know when a new user connect
//check for coneection events and will supply a function that takes in a scoket 
io.on('connection', (socket) => {
    console.log('a user connected')
})
//connect to mongoose
mongoose.connect(dbUrl, { seNewUrlParser: true }, (err) => {
    console.log('mongodb connection is successfull', err)
})
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})