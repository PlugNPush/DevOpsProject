const path = require('path');
const cors = require('cors')
var DataStore = require('nedb')

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

db = {}
db.users = new DataStore({filename : `${basedir}/bdUser.json`})
db.users.loadDatabase()
db.friends = new DataStore({filename : `${basedir}/bdFriend.json`})
db.friends.loadDatabase()
db.messages = new DataStore({filename : `${basedir}/bdMessage.json`})
db.messages.loadDatabase()
db.likes = new DataStore({filename : `${basedir}/bdLike.json`})
db.likes.loadDatabase()
db.pp = new DataStore({filename : `${basedir}/bdPP.json`})
db.pp.loadDatabase()
db.bio = new DataStore({filename : `${basedir}/bdBIO.json`})
db.bio.loadDatabase()




console.log(db.users);
console.log(typeof db.users)

express = require('express');
const app = express()

app.use(cors({
    credentials:true,
    origin: 'https://plugnpush.github.io'
}))


api_1 = require("./apiuser.js");
api_2 = require("./apiFriend.js")
api_3 = require("./apiMessage.js")
api_4 = require("./apiPP.js")
api_5 = require("./apiBio.js")
const session = require("express-session");

app.use(session({
    secret: "technoweb rocks",
    resave : false,
    saveUninitialized : false,
}));

app.use('/api', api_1.default(db));
app.use('/api',api_2.default(db));
app.use('/api',api_3.default(db));
app.use('/api',api_4.default(db));
app.use('/api',api_5.default(db));

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

