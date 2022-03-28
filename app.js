require('dotenv').config(); 
require('./config/database').connect(); 
const User = require('./model/user.js');
const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const validator = require('validator'); 
const auth = require('./middleware/auth');
const app = express(); 

app.use(express.json({ limit: "50mb" }));

//Route app root 

app.post("/register", async (req, res)=>{
      try{
          console.log(req.body);
           const{first_name, last_name, email, password} = req.body;
           if(!(email && first_name && last_name && password))
           res.status(400).send("All inputs are required!!!"); 
           if(!(validator.isEmail(email)))
           res.status(400).send("Please make a valid Email!!!"); 
           const oldUser = await User.findOne({email}); 
           if(oldUser){
                res.status(403).send("User already exist, Please go to login"); 
           }
        
        const encryptedpassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedpassword
        }); 
       
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY, 
            {
                 expiresIn: "2h",
            }
        );

        user.token = token; 
        res.status(200).json(user);
      }
      catch(err){
           console.log(err);  
      }
}); 

app.post('/login', async (req,res)=>{
     try{
     const {email, password} = req.body; 
     if(!(email&&password)){
           res.status(400).send("All inputs required!!!" ); 
     }
     console.log(email);
    const emails = email.toLowerCase();
     const user = await User.findOne({emails});
     console.log(user); 
     if(user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                 {user_id: user.id, email}, 
                 process.env.TOKEN_KEY, 
                 {
                    expiresIn: "2h"
                 }
            );
            user.token = token; 
            res.status(200).json(user);
     }
     res.status(400).send("Invalid userName or Password");
}
catch(err){
      console.log(err);
} 
}); 

app.post('/welcome', auth, (req,res)=>{
      res.status(200).send("Welcome Back Bitch!!");
})

module.exports = app; 