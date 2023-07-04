const express = require("express");
const Friend = require("./entities/friends.js");
const Users = require("./entities/users.js")
const Messages = require("./entities/message.js");
const { default: message } = require("./entities/message.js");

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
    const messages = new Messages.default(db)
    //cree message
    router.route("/messages/user/messages")
    .post(async (req,res) => {
        
        var usr = null

        if (!req.session.userid){
            res.status(405).json({
                status: 405,
                message: "Utilisateur non loger"
            });
            return;
        }

        await users.get(req.session.userid).then((val)=> usr = val)
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

        const { message } = req.body
        
        
        if (!message){
            res.status(400).json({
                status: 400,
                message: "Aucun message a envoyer"
            });
            return;
        }
        
        await messages.create(usr.login,message).then((resp) => {
                res.status(200).json({
                    status : 200,
                    id : resp
                })
                return
            })
            .catch((err)=>{
                console.log(err)
                res.status(401).json({
                    status : 401,
                    message : "Message Deja Present"
                })
                return
            })
            .catch((err) => res.status(500).send(err));
        return
    });

    //delike
    router
        .route("/messages/delikes")
        .put(async (req,res) => {
            try{
                if (!req.session.userid){
                    res.status(405).json({
                        status: 405,
                        message: "Utilisateur non loger"
                    });
                    return;
                }

                var msg1 = null

                await messages.getM(req.body.login,req.body.message)
                .then((rep) => msg1 = rep)
                .catch((err) => msg1 = null)

                if (msg1 == null){
                    res.status(404).json({
                        status: 404,
                        message: "Message non trouve"
                    });
                    return;
                }

                await messages.supLike(req.session.userid,msg1)
                .then((rep) => {
                    res.status(200).json({
                        status: 200,
                        message: "Like sup"
                    });
                    return;
                })
                .catch((err) => {
                    res.status(405).json({
                        status: 405,
                        message: "Error bd"
                    });
                    return;
                })
            }
            catch(e){
                console.log(e)
                res.status(500).json({
                    status: 500,
                    message: "Internal Error"
                });
                return;
            }
        })


    //Check like
    router
        .route("/messages/user/likes")
        .put(async (req,res) => {
            try{
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                var msg1 = null

                await messages.getM(req.body.login,req.body.message)
                .then((res) => msg1 = res)
                .catch((err) => msg1 = null)

                if (!msg1){
                    res.status(404).json({
                        status: 404,
                        message: "Message non existant"
                    });
                    return;
                }

                await messages.checkLike(req.session.userid,msg1)
                .then((resp) => {
                    res.status(200).json({
                        status: 200,
                        liker: resp
                    });
                    return;
                })
                .catch((e) => {
                    res.status(404).json({
                        status: 404,
                        message: "error"
                    });
                    return;
                })

                
            }
            catch(e){

            }
        })

    //Like un msg
    router
        .route("/messages/likes")
        .put(async (req, res) => {
            try{

                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                var msg1 = null

                await messages.getM(req.body.login,req.body.message)
                .then((res) => msg1 = res)
                .catch((err) => msg1 = null)

                if (!msg1){
                    res.status(404).json({
                        status: 404,
                        message: "Message non existant"
                    });
                    return;
                }

                var isLike = true;

                await messages.checkLike(req.session.userid,msg1)
                .then((resp) => isLike = resp)
                .catch((err) => isLike = true)

                if (isLike){
                    res.status(200).json({
                        status: 200,
                        message: "Message deja liker"
                    });
                    return;
                }

                await messages.like(req.session.userid,msg1)
                .then((resp) => {
                    res.status(200).json({
                        status: 200,
                        message: "Message liker"
                    });
                    return;
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({
                        status: 400,
                        message: "Message non liker"
                    });
                    return;
                })
            }
            catch(e){
                console.log(e)
                res.status(500).json({
                    status: 500,
                    message: "Internal error"
                });
                return;
            }
        })
    //modif message avec userid
    router
        .route("/messages/user/:user_id/messages")
        .put(async (req, res) => {
            try{
                var usr = null
                await users.get(req.params.user_id).then((val)=>usr = val)
                .catch((err)=>{
                    usr = null
                })
                if (usr == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                const old_message = req.body.old_message
                const new_message = req.body.new_message


                if (!new_message || !old_message){
                    res.status(400).json({
                        status: 400,
                        message: "Messages Vides"
                    });
                    return;
                }

                await messages.exists(usr.login, old_message).then((val)=>{
                    if(!val){
                        res.status(401).json({
                            status:401,
                            message: "Message inexistant"
                        })
                    }
                    return
                })
                .catch((err)=>{
                    res.status(401).json({
                        status:404,
                        message: "Probleme lecture"
                    })
                    return
                })
                await messages.set(usr.login, old_message, new_message).then((val)=>{
                    res.status(200).json({
                        status:200,
                        message : "Modification Effectuee"
                    })
                    return
                })
                .catch((err)=>{
                    res.status(401).json({
                        status : 401,
                        message : "Probleme Modification"
                    })
                    return
                })
                
            }
            catch(e){
                res.status(500).send(e);
            }
        });
    //delete message user
    router
        .route("/messages/user/messages/delete")
        .put(async (req, res)=>{
            try{

                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                console.log("err")
                var usr = null
                await users.get(req.session.userid).then((val)=> usr = val)
                .catch((err)=>{
                    usr = null
                })
                if (usr == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }


                var msg = req.body.message
                var mm = null


                await messages.exists(usr.login, msg).then((val)=>{
                    mm = val
                })
                .catch((err)=>{
                    res.status(404).json({
                        status: 404,
                        message: "Probleme Acces BD"
                    });
                    return;
                })

                if (!mm){
                    res.status(404).json({
                        status: 404,
                        message: "Message Inexistant"
                    });
                    return;
                }

                await messages.delete(usr.login, msg).then(()=>{
                    res.status(200).json({
                        status : 200,
                        message : "Message " + msg + " supprime"
                    })
                    return
                })
                .catch((err)=>{
                    res.status(401).json({
                        status : 401,
                        message : "Probleme acces BD"
                    })
                    return
                })
            }
            catch(e){
                res.status(500).send(e);
            }
        })
    //renvoie les messages de l utilisateur
    router
        .route("/messages/user/messages")
        .get(async (req, res) => {
            try{
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }
                var usr = null
                await users.get(req.session.userid).then((val)=>usr = val)
                .catch((err)=>{
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                })

                if (user == null){
                    return;
                }
                
                await messages.get(usr.login).then((docs)=>{
                    listMsg = []
                    for(let i = 0; i < docs.length; i++){
                        listMsg.push(docs[i].message)
                    }
                    res.status(200).json({
                        status:200,
                        listMessages:listMsg
                    })
                    return
                })
                .catch((err)=>{
                    res.status(404).json({
                        status : 404,
                        message : "Probleme BD"
                    })
                    return
                })
            }
            catch(e){
                res.status(500).send(e);
            }
        });
    //obtenir les messages du login
    router
        .route("/messages/user/:user_login/messages")
        .get(async (req, res) => {
            try{

                var id1 = null
                await users.getID(req.params.user_login)
                .then((id) => id1 = id)
                .catch((err) => {
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                })

                if (id1 == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                await messages.get(req.params.user_login).then((docs)=>{
                    listMsg = []
                    for(let i = 0; i < docs.length; i++){
                        listMsg.push(docs[i].message)
                    }
                    res.status(200).json({
                        status:200,
                        listMessages:listMsg
                    })
                    return
                })
                .catch((err)=>{
                    res.status(404).json({
                        status : 404,
                        message : "Probleme BD"
                    })
                    return
                })
            }
            catch(e){
                res.status(500).send(e);
            }
        });
    //permet d obtenir les messages de luser id friend
    router
        .route("/messages/user/message/:friend_id")
        .get(async (req, res) => {
            try{
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu2"
                    });
                    return;
                }

                var usr = null
                var friend = null
                await users.get(req.params.friend_id).then((val) => friend = val)
                .catch((err)=>{
                    friend = null
                })

                if (friend == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu1"
                    });
                    return;
                }

                await users.get(req.session.userid).then((val) => usr = val)
                .catch((err)=>{
                    usr = null
                })
                
                if (usr == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu3"
                    });
                    return;
                }
                console.log("REQ",req.session.userid)
                var ami = null
                await friends.isFriend(req.session.userid, friend.login).then((val)=>{
                    ami = val
                })
                .catch((err)=>{
                    ami = null
                })

                if (ami == null){
                    res.status(405).json({
                        status: 405,
                        message: "Pas amis"
                    });
                    return;
                }

                await messages.get(friend.login).then((docs)=>{
                    listMsg = []
                    for(let i = 0; i < docs.length; i++){
                        listMsg.push(docs[i].message)
                    }
                    res.status(200).json({
                        status:200,
                        listMessages:listMsg
                    })
                    return
                })
                .catch((err)=>{
                    res.status(404).json({
                        status : 404,
                        message : "Probleme BD"
                    })
                    return
                })
                return
            }
            catch(e){
                res.status(500).send(e);
            }
        })
    //recupere tous les messages de tous les amis
    router
        .route("/messages/user/messages/friends")
        .get(async (req, res) => {
            try{
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur non loger"
                    });
                    return;
                }
                var usr = null

                await users.get(req.session.userid).then((val) => {
                    usr = val
                })
                .catch((err)=>{
                    usr = null
                })

                if (usr == null){
                    res.status(401).json({
                        status: 401,
                        message: "Utilisateur inconnu"
                    });
                    return;
                }

                var listFriend = null

                await friends.get(req.session.userid).then((val)=>listFriend = val)
                .catch((err)=>{
                    listFriend = null
                })

                if (listFriend == null){
                    res.status(200).json({
                        status: 200,
                        messages : undefined
                    });
                    return;
                }

                var liste = []
                for (let f = 0; f < listFriend.length; f++){
                    ls = []
                    await messages.getListMessage(listFriend[f].loginToAdd).then((val)=>{
                        if (val)
                            for (let v = 0 ; v < val.length ; v++){
                                ls.push(val[v])
                            }
                    })
                    .catch((err)=>{})
                    const friendM = {
                        loginFriend : listFriend[f].loginToAdd,
                        message : ls
                    }
                    if (friendM.message[0])
                        liste.push(friendM)
                }
                res.status(200).json({
                    status: 200,
                    messages : liste
                });
                return;
            }
            catch(e){
                console.log("ERROR : ",e)
                res.status(500).send(e);
            }
        });
    //recuperer nbre message users a partir de l id
    router
        .route("/messages/user/:user_id/infos")
        .get(async (req, res) => {
            try{
                var usr = null
                await users.get(req.params.user_id).then((val)=>usr = val)
                .catch((err)=>{
                    usr = null
                })

                if (usr == null){
                    res.status(404).json({
                        status : 404,
                        message : "Utilisateur inconnu"
                    });
                    return
                }
                
                await messages.count(usr.login).then((val)=>{
                    res.status(200).json({
                        status: 200,
                        count : val
                    });
                    return;
                })
                .catch((err)=>{
                    res.status(404).json({
                        status : 404,
                        message : "Probleme comptage"
                    });
                    return
                })
            }
            catch(e){
                res.status(500).send(e)
            }
        });

    //recuperer nbre message users a partir du login
    router
        .route("/messages/user/:login/stats")
        .get(async (req, res) => {
            try{
                var usr = req.params.login
                
                if (usr == null){
                    res.status(404).json({
                        status : 404,
                        message : "Utilisateur inconnu"
                    });
                    return
                }
                
                await messages.count(usr).then((val)=>{
                    res.status(200).json({
                        status: 200,
                        count : val
                    });
                    return;
                })
                .catch((err)=>{
                    res.status(404).json({
                        status : 404,
                        message : "Probleme comptage"
                    });
                    return
                })
            }
            catch(e){
                res.status(500).send(e)
            }
        });
    //renvoie les messages a partir d un mot clef
    router
        .route("/messages/all")
        .put(async (req,res) => {
            try{
                var ls = new Set([])
                var lss = []
                keyword = req.body.keyword

                await messages.findUser(keyword)
                .then((resp) => {
                    for (let i = 0 ; i < resp.length ; i++){
                        ls.add(resp[i]._id)
                        lss.push(resp[i])
                    }
                })
                .catch((err) => console.log(err))

                await messages.findMsg(keyword)
                .then((resp) => {
                    for (let i = 0 ; i < resp.length ; i++){
                        ls.add(resp[i]._id)
                        lss.push(resp[i])
                    }
                })
                .catch((err) => console.log(err))
                
                res.status(200).json({
                    status : 200,
                    message : lss.filter(function (elem,pos){
                        bool = ls.has(elem._id)
                        ls.delete(elem._id)
                        return bool
                    })
                })
                return

            }
            catch(e){
                res.status(500).json(e)
                return
            }
        });
    //renvoie le nbre de tweets likes
    router
        .route("/messages/nblikes")
        .get(async (req, res) => {
            try{
                if(!req.session){
                    res.status(401).json({
                        status : 401,
                        message : "Utilisateur non logge"
                    })
                }
                var nb = null
                await messages.nbLike(req.session.userid).then((val)=>nb = val)
                .catch((err)=>{
                    res.status(401).json(err)
                    return;
                })
                res.status(200).json({
                    user : req.params.login,
                    nbLikes : nb
                })
                return
            }
            catch(e){
                res.status(500).json(e)
                return
            }
        });
    //renvoie le nombre de tweets likes par les autres, prend un login
    router
        .route("/messages/nblikers/:login")
        .get(async (req, res) => {
            try{
                if(!req.params.login){
                    res.status(404).json({
                        status : 404,
                        message : "Probleme de login"
                    })
                }
                var liste = []
                await messages.listIdMessage(req.params.login).then((val)=>liste = val)
                .catch((err)=>{
                    res.status(401).json(err)
                    return
                })
                var cpt = 0
                for (let i = 0; i < liste.length; i++){
                    await messages.nbLikeMsg(liste[i]).then((val)=>cpt+=val)
                    .catch((err)=>{
                        res.status(401).json(err)
                        return
                    })
                }
                res.status(200).json({
                    status : 200,
                    nbLikes : cpt
                })
                return
            }
            catch(e){
                res.status(500).json(e)
                return
            }
        })


    //permet d obtenir le nombre de messages totaux du site
    router
        .route("/messages/infos")
        .get(async (req, res) => {
            try{
                await messages.countAll().then((val)=>{
                    res.status(200).json({
                        status:200,
                        countAll : val
                    })
                    return
                })
                .catch((err)=>{
                    res.status(401).json({
                        status:401,
                        message : "Probleme Comptage"
                    })
                    return
                })
                return
            }
            catch(e){
                res.status(500).send(e);
            }
        })
    return router;


}
exports.default = init;

