const express=require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {user,auth,result,game,team}=require('./core');
const redis = require('redis');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const client  = redis.createClient();
const path = require('path')
const cors = require('cors')
const uuid = require('uuid/v4')
const app = express();
const http = require('http');
const server = http.createServer(app);

dotenv.config();
const port = process.env.PORT || '3000'
const secretKey =  process.env.SECRETKEY || 'abcdefghijklmnopqrstuvwxyz'
const dbUser =  process.env.DBUSER || null
const dbPass = process.env.DBPASS || null
const dbCluster = process.env.DBCLUSTER || null
const connnectString =  "mongodb+srv://"+dbUser+":"+dbPass+"@"+dbCluster+".mongodb.net/test"

mongoose.connect(connnectString,
{
  useFindAndModify:false,
  useNewUrlParser: true,
  autoIndex:false,
  replicaSet:"Cluster0-shard-0",
  ssl: true,
  sslValidate: true,
})
.then(()=>{console.log('connected')})
.catch((e)=>console.log(e));

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({origin: 'http://localhost:8080', credentials: true }));
} else {
  app.use(express.static(path.resolve(__dirname,`../../dist`)))
  app.get(/^(?!\/api\/)/,(req,res) => {
    res.sendFile(path.resolve('index.html'))
  })
}

app.use(helmet())
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}))
app.use(bodyParser.json({limit: '2mb', extended: true}))
app.use(session({
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
  secret: "POPOPOPOPOPOP",
  resave: false,
  saveUninitialized: false,
  cookie : {
    name:'s3ssionName',
    secure:process.env.NODE_ENV === 'production',
    maxAge : 1200000
  },
}))
app.use(function(req,res,next) {
  let length = 0;
  for (var i =0; i<Object.keys(req.body).length;i++){
    length = length + String(req.body[Object.keys(req.body)[i]]).length
  }
  console.dir(req.method+ " "+req.path+" "
    +(Object.keys(req.query).length == 0 ? "" : JSON.stringify(req.query)+" ")
    +(length > 50 ? "" : JSON.stringify(req.body)+" "));
  next()
})


passport.use(new LocalStrategy(
  { usernameField: 'email' },auth.findAuth
));
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})



app.use(passport.initialize());
app.use(passport.session());



app.get('/api/user', (req, res) => {
  !req.isAuthenticated() ? res.status(401).end() : res.status(200).send(req.session.passport)
})
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(info) {return res.status(401).send({message:info.message})}
    if (err) { return res.status(403).send({authenticated:'UNAUTHENTICATED'}); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, (err) => {
      if (err) { res.status(403).send({authenticated:'UNAUTHENTICATED'}); }
      res.status(200).send({authenticated:'AUTHENTICATED',...req.session.passport,admin:true})
    })
  })(req, res, next);
})

app.get('/api/authrequired', (req, res) => {
  console.log(req.isAuthenticated())
  res.status(req.isAuthenticated() ? 200 : 401).end()
})
app.get('/api/adminRequired', (req, res) => {
  let status = (req.isAuthenticated() && req.session.passport && req.session.passport.admin) ? 200 : 401
  res.status(200).end()
})

app.use((req,res,next)=>{
  !req.isAuthenticated() ? res.status(403).end() : next()
})

app.get('/api/users', user.get)
app.post('/api/users', user.set)

app.get('/api/games', game.get)

app.get('/api/teams', team.get)


app.get('/api/results', result.get)
app.post('/api/results', result.set)


app.get('/api/mock/games',game.mock)
app.get('/api/mock/teams',team.mock)
app.get('/api/mock/users',user.mock)
app.get('/api/mock/resul',result.mock)

app.get('/', (req, res) => {
  console.log('is not auth')
  res.send({})
})

server.listen(port,()=>console.log("...listening HTTP on port " + port));
