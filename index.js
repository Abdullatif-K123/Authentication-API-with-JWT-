const app = require('./app');






const host = 3000||process.env.port;
app.listen(host, ()=>{ 
    console.log(('Server Has just started'))
})