const { request } = require("chai");
const express = require("express");
const { route } = require("express/lib/application");
const Users = require("./entities/users.js")
const BIO = require("./entities/bio.js")

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const users = new Users.default(db)
    const bio = new BIO.default(db)

    //cree une relation d amitie
    router.route("/bio/user")
    .post(async (req,res) => {

        if (!req.session.userid){
            res.status(405).json({
                status: 405,
                message: "Utilisateur non loger"
            });
            return;
        }

        var usr = null

        await users.getLogin(req.session.userid).then((val)=> usr = val)
        .catch((err) => {
            usr = null
        })
        if (usr == null){
            res.status(401).json({
                status: 401,
                message: "Utilisateur inconnu"
            });
            return;
        }   


        await bio.create(usr,req.body.bio)
        .then((rs) => {
            res.status(200).json({
                status: 200,
                message: rs
            });
            return;
        })
        .catch((res) => console.log(res))
    })

    router.route("/bio/get/:user_login")
    .get(async (req,res) => {
            
        if (!req.session.userid){
            res.status(405).json({
                status: 405,
                message: "Utilisateur non loger"
            });
            return;
        }

        var usr = null

        await users.getID(req.params.user_login).then((val)=> usr = val)
        .catch((err) => {
            usr = null
        })
        if (usr == null){
            res.status(401).json({
                status: 401,
                message: "Utilisateur inconnu"
            });
            return;
        }   

        await bio.get(req.params.user_login)
        .then((rs) => {
            res.status(200).json({
                status : 200,
                bio: rs
            });
            return;
        })
        .catch((res) => console.log(res))
        
    })


    return router;
}
exports.default = init;

