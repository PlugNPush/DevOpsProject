const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); //c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API BIO", () => {
    mocha.it("user", (done) => {
        var agent = chai.request.agent(app.default)
        const log = {
            login : "CrooZ",
            password : "crooz"
        }
        const bio = {bio : "Je mamuse"}
        agent
            .post('/api/user/login')
            .send(log)
            .then((res) => {
                return Promise.all([
                    agent
                        .post('/api/bio/user')
                        .send(bio)
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body.message, "Je mamuse")
                        }),
                    agent
                        .get('/api/bio/get/CrooZ')
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body.bio, "Je mamuse")
                        })
                    
                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                agent.close()
            })
    })
})