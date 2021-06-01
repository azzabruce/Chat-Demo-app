//open a request

var request = require('request')

//create a suit or grouping of tests with describe
//describe is a function call that takes the decription as a first parameter
describe('calc', () => {
    it('should multiply 2 and 2', () => {
        expect(2 * 2).toBe(4)
    })

})

//this will be sepcific to get messages

describe('get messages', () => {
    it('should return 200 Ok', (done) => {
        //we need to create an http request by downloading a library called request
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200)
            //console.log(res.body)//this will not console because this test ends before we get a callback because it is not set as asynchnros
            done()// we need to pass done on the specs and call done() at the end
        })
    })
    //test that list of messages not empty
    it('shout return a list, that is not empty', (done) => {
        //we need to create an http request by downloading a library called request
        request.get('http://localhost:3000/messages', (err, res) => {
            //we only have two items
            expect(res.body.length).toBeGreaterThan(0)
            //console.log(res.body)//this will not console because this test ends before we get a callback because it is not set as asynchnros
            done()// we need to pass done on the specs and call done() at the end
        })
    })
})
//test first development, add the test first and make it fail and then we will implement the feature and ake it pass
//the new feature is a new messages get call or end point that will allow us to get messages from a specifici owner
//will get the name through a url paramater
describe('get messages from a user', () => {
    it('should return 200 Ok', (done) => {
        //we need to create an http request by downloading a library called request
        request.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(res.statusCode).toEqual(200)
            //console.log(res.body)//this will not console because this test ends before we get a callback because it is not set as asynchnros
            done()// we need to pass done on the specs and call done() at the end
        })
    })
    //we don't know if it functions as expected, because our full requirment is that it only gives messages of spcified user
    //let's create another specification for that
    it('name should be tim', (done) => {
        request.get('http://localhost:300/messages/tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('tim')
            done()
        })
    })
})