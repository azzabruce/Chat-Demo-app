var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('dgram')
var app = express()
//add http require and use the http from node and we will call the server on the require itself and pass the app
var http = require('http').Server(app)
//create io and set it require socket io and will pass in reference to http
var io = require('socket.io')(http)

app.use(express.static(__dirname))
//this let bodyParser know that we expect json to be coming in with http request
app.use(bodyParser.json())
//at this point when we click send, we recieve an embty object, because the broweser is urlencoded
//so we must setup a bodyParser to support that
app.use(bodyParser.urlencoded({ extended: false }))
//at this point, we have to refresh the page to see new messages
//we would need to install socket.ip 
//needs to tie in with expresswe will create a regular http server with node and share with express and node
//let's create a placeholder messages list as an array
var messages = [
    { name: 'Azza', message: 'Hello' },
    { name: 'Tim', message: 'Hi' }
]
// 1. creating a get messages end service in node, this allows messages to be called from the backend and displayed in the front-end 
// 2. we need to add a route for endpoint, we will be using app.get to sepcifiy that we will be using a get request
app.get('/messages', (req, res) => {//the route is '/messages. then a callback to handle the request take in response and give is refernce to res to response to it
    res.send(messages) // next step is to update the front-end to call the messages from backend
})
//let's create a new message post endpoint in node
app.post('/messages', (req, res) => {
    console.log(req.body)// this will return undefined since express doesn't have a built in support to parse the body, we need to install body-parser
    messages.push(req.body)//add he new message to our message array from postman
    //let's emit an event from the server to all clients notifying them, there is a new message
    io.emit('message', req.body)//message is the event and req.body will contain the message
    res.sendStatus(200)

})
//let's set up a callback for the scoket coneection event, that will let us know when a new user connect
//check for coneection events and will supply a function that takes in a scoket 
io.on('connection', (socket) => {
    console.log('a user connected')
})
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})