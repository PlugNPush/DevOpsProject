const { request } = require("chai");
const express = require("express");
const { route } = require("express/lib/application");
const Friend = require("./entities/friends.js");
const Users = require("./entities/users.js")

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
    const friends = new Friend.default(db);
    const users = new Users.default(db)

    //cree une relation d amitie
    router.route("/friend/user/:user_login/friends")
    .put( async (req, res) => {
        if (!req.session.userid) {
            res.status(400).json({
                status : 400,
                message : "Utilisateur non loger"
            })
            return
        }

        var user = null
        await users.get(req.session.userid).then((val) => {
            user = val
        })

        if (user == null){
            res.status(401).json({
                message: "Utilisateur inconnu"
            })
            return;
        }

        var friendID = null
        await users.getID(req.params.user_login)
        .then((res) => friendID = res)
        .catch((err)=>{
            friendID = null
        });

        if (friendID == null){
            res.status(401).json({
                status: 401,
                message: "Utilisateur inconnu"
            });
            return;
        }


        if (friendID == req.session.userid){
            res.status(403).json({
                status: 403,
                message: "Impossible de s'auto ajouter"
            });
            return;
        }

        await friends.create(req.session.userid,req.params.user_login)
            .then((user_id) => {
                res.status(200).json({
                     id: user_id 
                })
            })
            .catch((err) => {
                res.status(405).json({
                    message:err
                });
                return
            })
    });
    //recupere la liste des amis de userid (prend un pseudo)
    router
        .route("/friend/user/:user_id/friends")
        .get(async (req, res) => {
        try {

            var id = null
            await users.getID(req.params.user_id)
            .then((res) => id = res)
            .catch((err) => {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            })

            if (id == null){
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return
            }

            var user = null
            await users.get(id)
            .then((val) => user = val)
            .catch((err) => {
                user = null
            })
            if(user == null){
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            
            await friends.get(id).then((val) => {
                listFriend = []
                for(let i = 0; i < val.length; i++){
                    listFriend.push(val[i].loginToAdd)
                }
                res.status(200).json({
                    status:200,
                    listFriend:listFriend
                })
                return
            })
            .catch((err) => {
                res.status(404).json({
                    status:404,
                    message:"Pas d'amis"
                })
                return
            })
            return
        }
        catch (e) {
            res.status(500).send(e);
        }
    });
    //renvoie la relation damitie entre login, se base sur la connexion
    router
        .route("/friend/user/friends/:user_id2")
        .get(async (req,res) => {
            try {
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                var user1 = null;
                await users.get(req.session.userid).then((val) => user1 = val)
                .catch((err) => {
                    user1 = null
                })
                if (user1 == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }
                

                var user2 = null;
                await users.getID(req.params.user_id2).then((val) => user2 = val)
                .catch((err) => {
                    user2 = null
                })
                if (user2 == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }


                await friends.isFriend(req.session.userid,req.params.user_id2).then((val) =>{
                    if(val){
                        res.status(200).json({
                            status: 200,
                            isFriend: true,
                            message: "Amis avec "+ req.params.user_id2
                        });
                        return;
                    }
                    else{
                        res.status(205).json({
                            status: 205,
                            isFriend: false,
                            message: "Pas amis"
                        });
                        return
                    }
                })
                .catch(()=>{
                    res.status(205).json({
                        status: 205,
                        isFriend: false,
                        message: "Pas amis"
                    });
                    return
                })
                return;
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    //renvoie la relation damitie entre user1 et user2
    router
        .route("/friend/user/:user_id1/friends/:user_id2")
        .get(async (req,res) => {
            try {
                var user1 = null;
                await users.get(req.params.user_id1).then((val) => user1 = val)
                .catch((err) => {
                    user1 = null
                })
                if (user1 == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }
                var user2 = null;
                await users.get(req.params.user_id2).then((val) => user2 = val)
                .catch((err) => {
                    user2 = null
                })
                if (user2 == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }


                await friends.isFriend(req.params.user_id1,user2.login).then((val) =>{
                    if(val){
                        res.status(200).json({
                            status: 200,
                            isFriend: true,
                            message: "Amis avec "+ user2.login
                        });
                        return;
                    }
                    else{
                        res.status(200).json({
                            status: 200,
                            isFriend: false,
                            message: "Pas amis"
                        });
                        return
                    }
                })
                .catch(()=>{
                    res.status(200).json({
                        status: 200,
                        isFriend: false,
                        message: "Pas amis"
                    });
                    return
                })
                return;
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        //suppr une relation d amitie
        router
            .route("/friend/user/friends/:user_login")
            .delete(async (req,res) => {
                try {
                    
                    if (!req.session.userid){
                        res.status(400).json({
                            status : 400,
                            message : "Utilisateur non loger"
                        })
                        return
                    }

                
                    var user2 = null;
                    await users.getID(req.params.user_login).then((val) => user2 = val)
                    .catch((err) => {
                        user2 = null
                    })
                    if (user2 == null){

                        res.status(401).json({
                            status: 401,
                            message: "Utilisateur inconnu"
                        });
                        return;
                    }

                    var isFriend = null
                    await friends.isFriend(req.session.userid,req.params.user_login).then((val) =>{
                        isFriend = val
                    })
                    .catch(()=>{
                        isFriend = null
                    })
                    if(isFriend == null){
                        res.status(200).json({
                            status: 200,
                            isFriend: false,
                            message: "Pas amis"
                        });
                        return
                    }


                await friends.delete(req.session.userid,req.params.user_login)
                .then((val) => {
                    res.status(200).json({
                        status: 200,
                        message: "unfollow " + req.params.user_login
                    });
                    return;
                })
                .catch((err)=>{
                    res.status(200).json({
                        status: 500,
                        message:"Probleme suppression"
                    });
                    return;
                })
                    
                }
                catch (e) {
                    res.status(500).send(e);
                }
            });
        //renvoie les relations d amitie avec lutilisateur userid
        router
            .route("/friend/user/:user_id/infos")
            .get(async (req,res) => {
                try {
                    var user = null
                    await users.get(req.params.user_id)
                    .then((val) => user = val)
                    .catch((err) => {
                        user = null
                    })
                    if (user == null){
                        res.status(401).json({
                            status: 401,
                            message: "Utilisateur inconnu"
                        });
                        return;
                    }
                    await friends.get(req.params.user_id).then((val) => {
                        count = 0
                        for(let i = 0; i < val.length; i++){
                            count++
                        }
                        res.status(200).json({
                            status:200,
                            count:count
                        })
                        return
                    })
                    .catch((err) => {
                        res.status(404).json({
                            status:404,
                            message:"Pas d'amis"
                        })
                        return
                    })
            } catch (e) {
                res.status(500).json({
                    e
                })
            }
            });
        //renvoie le nombre de followers du login
        router
            .route("/friend/followers/:login")
            .get(async (req, res) => {
                try{
                    if(req.params.login == null){
                        res.status(401).json({
                            status: 401,
                            message: "Utilisateur inconnu"
                        });
                        return;
                    }
                    await friends.getNbFollowers(req.params.login).then((cpt)=>{
                        res.status(200).json({
                            status : 200,
                            nbFollowers : cpt
                        })
                        return
                    })
                    .catch((err)=>{
                        res.status(404).json({
                            status:404,
                            message:"Probleme Acces BD"
                        })
                        return
                    })
                }
                catch(e){
                    res.status(500).json({
                        e
                    })
                    return
                }
            })


    return router;
}
exports.default = init;

