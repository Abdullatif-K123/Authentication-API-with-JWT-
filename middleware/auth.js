const jwt = require("jsonwebtoken"); 

const config = process.env; 

const verifyToken = (req, res, next) => {
     const token = 
     req.body.token || req.query.token || req.headers["x-access-token"];
     console.log(token )
     if(!token){
          return res.status(403).send("A token is required of Authentications"); 
     }
     try{ 
          const decode = jwt.verify(token, config.TOKEN_KEY);
          req.user = decode; 
     }
     catch(err){
          return res.status(401).send("Invalid token");
     }
     return next();
}
module.exports = verifyToken;   