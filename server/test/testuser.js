const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); //c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');
//const { get } = require('cypress/types/lodash');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API user", () => {
    mocha.it("user", (done) => {
        var agent = chai.request.agent(app.default)
        const log = {
            login : "CrooZ",
            password : "crooz"
        }
        const log2 = {
            login : "CrooZ1",
            password : "crooz"
        }
        const usr = {
            login : "test",
            password : "test",
            lastname : "test",
            firstname : "test"
        }
        agent
            .post('/api/user/login')
            .send(log)
            .then((res) => {
                return Promise.all([
                    agent
            .post('/api/user/login')
            .send(log2)
            .then((res)=>{
                res.should.have.status(401)
                chai.assert.deepEqual(res.body.message, "Utilisateur inconnu")
            }),

        agent
            .post('/api/user/login')
            .send(log)
            .then((res)=>{
                res.should.have.status(200)
                chai.assert.deepEqual(res.body.message, "Login et mot de passe accepté")
            }),
        agent
            .put('/api/user')
            .send(usr)
            .then((res)=>{
                res.should.have.status(201)
            }),
        agent
            .delete('/api/user/test')
            .then((res)=>{
                res.should.have.status(200),
                chai.assert.deepEqual(res.body.message, "Suppresion effectuee")
                })
                    
                ]),
            agent
                .get('/api/user/all/infos')
                .then((res)=>{
                    res.should.have.status(200)
                    chai.assert.deepEqual(res.body.count, 6)
                }),
            agent
                .delete('/api/user/logout')
                .then((res)=>{
                    res.should.have.status(200)
                    chai.assert.deepEqual(res.body.message, "Session fermee")
                }),
            agent
                .delete('/api/user/logout')
                .then((res)=>{
                    res.should.have.status(200)
                    chai.assert.deepEqual(res.body.message, "Session fermee")
                })
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                agent.close()
            })
    })
})