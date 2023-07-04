const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); //c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API friend", () => {
    mocha.it("user", (done) => {
        var agent = chai.request.agent(app.default)
        const log = {
            login : "CrooZ",
            password : "crooz"
        }

        agent
            .post('/api/user/login')
            .send(log)
            .then((res) => {
                return Promise.all([

                    //Ajout ami
                    agent
                        .put(`/api/friend/user/___MOI___/friends`)
                        .then((res) => {
                            res.should.have.status(401)
                            chai.assert.deepEqual(res.body.message, "Utilisateur inconnu")
                        }),
                    
                    agent
                    .put(`/api/friend/user/CrooZ/friends`)
                    .then((res) => {
                        res.should.have.status(403)
                        chai.assert.deepEqual(res.body.message, "Impossible de s'auto ajouter")
                    }),

                    agent
                    .put(`/api/friend/user/u1/friends`)
                    .then((res) => {
                        res.should.have.status(200)
                    }),

                    agent
                    .delete(`/api/friend/user/friends/u1`)
                    .then((res) => {
                        res.should.have.status(200)
                        chai.assert.deepEqual(res.body.message, "unfollow u1")
                    }),

                    //recuperer les amis
                    agent
                    .get(`/api/friend/user/CrooZ/friends`)
                    .then((res) => {
                        res.should.have.status(200)
                    }),

                    agent
                    .get(`/api/friend/user/__MOI__/friends`)
                    .then((res) => {
                        res.should.have.status(401)
                        chai.assert.deepEqual(res.body.message, "Utilisateur inconnu")
                    }),

                    agent
                    .get(`/api/friend/user/friends/Azarel`)
                    .then((res) => {
                        res.should.have.status(200)
                        chai.assert.deepEqual(res.body.message, "Amis avec Azarel")
                    }),

                    agent
                    .get(`/api/friend/user/friends/GAMERLORD`)
                    .then((res) => {
                        res.should.have.status(205)
                        chai.assert.deepEqual(res.body.message, "Pas amis")
                    }),

                    agent
                    .get(`/api/friend/followers/CrooZ`)
                    .then((res) => {
                        res.should.have.status(200)
                        chai.assert.deepEqual(res.body.nbFollowers, 3)
                    }),

                    agent
                    .get(`/api/friend/followers/u1`)
                    .then((res) => {
                        res.should.have.status(200)
                        chai.assert.deepEqual(res.body.nbFollowers, 1)
                    }),
                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                agent.close()
            })
    })
})

