const express = require("express");
const { route } = require("express/lib/application");
const { getMochaID } = require("mocha/lib/utils");
const { default: message } = require("./entities/message.js");
const Users = require("./entities/users.js");

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
    const users = new Users.default(db);

    //fonction login
    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            var id = null
            await users.getID(login).then((resp) => id = resp)

            if (id == null){
                res.status(401).json({
                    status: 401,
                    "message": "Utilisateur inconnu"
                });
                return;
            }

            var err = false
            await users.checkpassword(login, password)
            .then((suc) => {
                if (!suc){
                    err = true
                    // Faux login : destruction de la session et erreur
                    req.session.destroy((err) => { return });
                    res.status(403).json({
                        status: 403,
                        message: "login et/ou le mot de passe invalide(s)"
                    });
                    return;
                }
            })
            .catch((err) => console.log("ERROR",err))
            
            if (err){
                return
            }

            // Avec middleware express-session
            req.session.regenerate(function (err) {
                if (err) {
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne"
                    });
                }
                else {
                    // C'est bon, nouvelle session créée
                    users.login(login)
                    .then((id) => {
                        req.session.userid = id;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté"
                        });
                        return
                    })
                    .catch((err) => console.log("Err"))
                }
            });
            return;
            
        }
        catch (e) {
            console.log(e)
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
            return
        }
    });

    router
        .route("/user")
        .get(async (req, res) => {
        try {
            if (!req.session.userid){
                res.status(404).json(
                    {message : "user not found"}
                )
                return;
            }
            await users.get(req.session.userid).then((val) => res.status(200).json(val))
            .catch((err) => res.status(404).json(
                {message : "user not found"}
            ))
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    //renvoie les donnees de lutilisateur
    router
        .route("/user/:user_id")
        .get(async (req, res) => {
        try {
            await users.get(req.params.user_id).then((val) => res.status(200).json(val))
            .catch((err) => res.status(404).json(
                {message : "user not found"}
            ))
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    //cree user
    router
        .route("/user")
        .put(async (req, res) => {
            const { login, password, lastname, firstname } = req.body;
            if (!login || !password || !lastname || !firstname) {
                res.status(400).send("Missing fields");
            } else {
                users.create(login, password, lastname, firstname)
                    .then((user_id) => res.status(201).send({ id: user_id }))
                    .catch((err) => res.status(500).send(err));
            }
        });
    //se deconnecte
    router
        .route("/user/logout")
        .delete(async (req,res) => {
            try {
                var user = null
                if (!req.session.userid){
                    res.status(200).json({
                        status: 200,
                        message: "Session deja fermee"
                    });
                    return;
                }

                await users.get(req.session.userid).then((val)=>user=val)
                .catch((err)=>{
                    res.status(200).json({
                        status: 200,
                        message: "Utilisateur inconnu"
                    });
                    return;
                })
                req.session.destroy((err) => { });
                await users.logout(user.login).then(()=>{
                    res.status(200).json({
                        status: 200,
                        message: "Session fermee"
                    });
                    return;
                })
                .catch((err)=>{
                    res.status(401).json({
                        status: 401,
                        message: "Probleme BD"
                    });
                    return;
                })
                return
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    //supprime un utilisateur
    router
        .route("/user/:user_login")
        .delete(async (req, res)=>{
            try{
                var user = null
                await users.getID(req.params.user_login).then((val)=>user=val)
                .catch((err)=>{
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                })
                await users.delete(req.params.user_login).then(()=>{res.status(200).json({
                    status: 200,
                    message: "Suppresion effectuee"
                });
                return;}
                ).catch((err) => {
                    res.status(401).json({
                        status: 401,
                        message: "Probleme BD"
                    });
                    return;
                })
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    //verifie connexion user
    router
        .route("/user/check/isConnected")
        .get(async (req,res) =>{
            if (req.session.userid){
                res.status(200).json({
                    status:200,
                    connected : true
                })
                return
            }
            else{
                res.status(200).json({
                    status:200,
                    connected : false
                })
                return
            }
        })
    //affiche le nombre d utilisateurs dans la base
    router
        .route("/user/all/infos")
        .get(async (req, res)=>{
            try{
                await users.count()
                .then((val)=>{
                    
                    res.status(200).json({
                        status: 200,
                        count : val
                    });
                    return;
                })
                .catch((err)=>{
                    res.status(401).json({
                        status: 401,
                        message: "Probleme comptage"
                    });
                    return;
                })
            }
            catch (e) {
                res.status(500).json({
                    status:500,
                    message : "error"
                });
            }
        });
    //renvoie l id du login correspondant
    router
        .route("/user/token/:login")
        .get(async (req, res)=>{
            try{
                if(!req.params.login){
                    res.status(404).json({
                        status:404,
                        message : "Utilisateur inconnu"
                    });
                }
                var token = null
                await users.getToken(req.params.login).then((val)=>token = val)
                .catch((err)=>{
                    res.status(401).json({
                        status: 401,
                        message: "Pas d utilisateurs"
                    });
                    return;
                })
                console.log(token)
                res.status(200).json({
                    status: 200,
                    token: token
                });
                return;
            }
            catch(e){
                res.status(500).json({
                    status:500,
                    message : "error"
                });
                return
            }
        })


    return router;
}
exports.default = init;

