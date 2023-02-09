//import model Account
const db = require('./db')

//import jsonwebtoken

const jwt = require('jsonwebtoken')



// login function

const login = (acno,pswd)=>{
    console.log('inside login function definition');
    //check acno and pswd is present in mongo db
    //asynchronous function 
     return db.Account.findOne({
        acno,
        password:pswd
     }).then((result)=>{
        if (result){
            //accno n present in db
            console.log('login successfull');

            //currentacno
            let currentAcno=acno

            //generate token
            const token =jwt.sign({
                currentAcno:acno
            },'supersecretkey123')

            return{
                status:true,
                message:'login successfull',
                username:result.username,
                statusCode:200,
                token,
                currentAcno
            }
        }
        else{
            console.log('invalid account/password');
            return{
                status:false,
                message:'invalid account/password',
                statusCode:404
            }
        }
      })
      //.catch((error)=>){
    //     console.log(error);
    //  }
}

// register

const register = (acno,pswd,uname)=>{
    console.log('inside register function definition');
    //check acno and pswd is present in mongo db
    //asynchronous function  - promise
     return db.Account.findOne({
        acno
         }).then((result)=>{
        if (result){
            //accno n present in db
            console.log('already registerd');
            return{
                status:false,
                message:'Account already exist... please Login',
                statusCode:404
            }
        }
        else{
            console.log('registered successfully');
            let newAccount = new db.Account({
            acno,
            password:pswd,
            username:uname,
            balance:0,
            transaction:[]

           })
           newAccount.save()
           return{
            status:true,
            message:'Register successfull',
            statusCode:200
           }
        }
     })
}
//deposit

const deposit = (req,acno,pswd,amount)=>{
    console.log('inside deposit function definition');
    //convert string amount to  number
    let amt = Number(amount)
    //check acno and pswd is present in mongo db
    //asynchronous function 
     return db.Account.findOne({
        acno,
        password:pswd
     }).then((result)=>{
        if (result){
 
            if(req.currentAcno!=acno){
            return{
                status:false,
                message:'Operation denied...',
                statusCode:404
            }
        }


            //accno n present in db

            result.balance += amt
            result.transaction.push({
                type: "CREDIT",
                amount:amt

            })
            result.save()
            
           // console.log('login successfull');
            return{
                status:true,
                message:`${amount} Deposited Successfully`,
                //username:result.username,
                statusCode:200
            }
        }
        else{
            console.log('invalid account/password');
            return{
                status:false,
                message:'invalid account/password',
                statusCode:404
            }
        }
      })
      //.catch((error)=>){
    //     console.log(error);
    //  }
}





//export 
module.exports={
    login,
    register,
    deposit
}