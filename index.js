// using express , create server 

//1. import express

const express = require('express')

//import data service
const dataService = require('./services/data.service')

//import cors
const cors = require('cors')

//import jsonwebtoken

const jwt = require('jsonwebtoken')


//2. create an server app using express
const app = express()

//using cors define origin to server app
app.use(cors({
    origin:['http://localhost:4200']
}))

//to pass json data
app.use(express.json())

//3.set up port for  server app

app.listen(3000,()=>{
    console.log('server started at port 3000');
})



//application specific middleware

const appMiddleware =(req,res,next)=>{
    console.log('this is application specific middleware');
    next()
}
app.use(appMiddleware)

//router specific middleware - Token validation

const jwtMiddleware=(req,res,next)=>{
    console.log('inside  router specific middleware');
    //get token from request headers x-aces-token key
    let token = req.headers['x-access-token']
    //verify token using jsonwebtoken
    try{
        let data= jwt.verify(token,'supersecretkey123')
        req.currentAcno = data.currentAcno
        //console.log(data);
        next()
    }
    catch{
        res.status(404).json({
            status:false,
            message:"please Login....!!"
        })
    }
}


//http request - REST API

// app.get('/',(req,res)=>{
//     res.send("GET METHOD")
// })

// app.post('/',(req,res)=>{
//     res.send("POST METHOD")
// })

// app.put('/',(req,res)=>{
//     res.send("PUT METHOD")
// })

// app.patch('/',(req,res)=>{
//     res.send("PACTH METHOD")
// })

// app.delete('/',(req,res)=>{
//     res.send("DELETE METHOD")
// })


//http request - REST API - BANK API

// 1.LOGIN API
 app.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);
    //asynchronous
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
 })

 // 1.REGISTER API
 app.post('/register',(req,res)=>{
    console.log('inside register function');
    console.log(req.body);
    //asynchronous
    dataService.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
 })

 // 2.DEPOSIT API
 app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('inside deposit function');
    console.log(req.body);
    //asynchronous
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
 })

  // 2.withdraw API
  app.post('/withdraw',(req,res)=>{
    console.log('inside withdraw function');
    console.log(req.body);
    //asynchronous
    dataService.withdraw(req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
 })